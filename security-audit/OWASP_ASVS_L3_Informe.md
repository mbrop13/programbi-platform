# 🔒 AUDITORÍA OWASP ASVS 4.0.3 — NIVEL 3 (Application Security Verification Standard)

**Aplicación auditada:** ProgramBI Platform (`platform/`) — Next.js 16.2.3 + Supabase
**Fecha:** 2026-07-05
**Alcance:** Código fuente estático (`app/`, `lib/`, `supabase/`, `middleware.ts`, `next.config.ts`, `package.json`, `.env.local` estructura). **No** incluye pentest dinámico.
**Metodología:** OWASP ASVS 4.0.3 Nivel 3 (286 requisitos, el más estricto).
**Modo:** Solo lectura — no se modificó ningún archivo de la aplicación.

---

## 📊 SCORECARD EJECUTIVO

| Dominio ASVS | Requisitos L3 críticos | Estado | Score |
|---|---|---|---|
| **V1** Arquitectura y modelado de amenazas | Threat model | ⚠️ Parcial | B |
| **V2** Autenticación | Password, MFA, throttling | ❌ No cumple | D |
| **V3** Gestión de sesión | Timeout, logout, cookies | ❌ No cumple | D |
| **V4** Control de acceso | RBAC, IDOR, RLS | ❌ No cumple | D- |
| **V5** Validación e inyección | XSS, sanitización, prompt | ❌ No cumple | D |
| **V6** Criptografía | HMAC, secrets, RNG | ⚠️ Parcial | C |
| **V7** Errores y logging | Audit log, centralización | ❌ No cumple | F |
| **V8** Protección de datos | Privacidad, derecho al olvido | ❌ No cumple | D |
| **V9** Comunicaciones | TLS, HSTS, headers | ✅ Cumple | A- |
| **V12** Archivos | MIME, EXIF, bucket privado | ❌ No cumple | D |
| **V13** API y Web | Webhooks firma, rate-limit | ❌ No cumple | D- |
| **V14** Configuración y supply chain | CVEs, SRI, SBOM | ⚠️ Parcial | C- |

**Veredicto global:** 🔴 **NO CERTIFICA ASVS Nivel 3**. La aplicación presenta **8 vulnerabilidades críticas** y **~25 altas** que deben corregirse antes de cualquier certificación o despliegue en producción con datos reales.

### Distribución de hallazgos

| Severidad | Cantidad |
|---|---|
| 🔴 Crítica | 8 |
| 🟠 Alta | 25 |
| 🟡 Media | 18 |
| 🟢 Baja / Info | 15 |

---

## 🚨 TOP 8 HALLAZGOS CRÍTICOS (acciones inmediatas)

Estos son los que permiten compromiso total del sistema o fraude directo. **Arreglar primero.**

### 🔴 CR-1 — Escalada de privilegios por RLS incompleta en `profiles`
- **ASVS:** V4.1.3, V4.3.3
- **Archivo:** `supabase/schema.sql:181-182`
- **Evidencia:** La política `Users can update own profile` permite `UPDATE` sin `WITH CHECK` ni restricción de columnas. Cualquier usuario autenticado puede hacer:
  ```js
  supabase.from("profiles").update({ role: "admin", subscription_plan: "ultra" }).eq("id", miUserId)
  ```
- **Impacto:** Escalada a administrador + plan premium gratis. **Derrota todo el control de acceso.**
- **Fix:**
  ```sql
  DROP POLICY "Users can update own profile" ON public.profiles;
  CREATE POLICY "users update own profile (limited)" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND NOT EXISTS (
      SELECT 1 FROM (SELECT to_jsonb(new) AS nb) t
      WHERE nb ?| array['role','subscription_plan','is_on_trial','subscription_expires_at',
                        'organization_id','flow_customer_id','flow_subscription_id','mp_subscription_id']
    ));
  ```
  Idealmente un trigger `BEFORE UPDATE` que compare `OLD` vs `NEW`.

### 🔴 CR-2 — Backdoor de administrador por email hardcodeado
- **ASVS:** V4.3.4
- **Archivos:** `app/(admin)/layout.tsx:17`, `lib/supabase/comunidad.ts:68`
- **Evidencia:**
  ```ts
  const isAdmin = profile?.role === "admin" || user.email === "manuel@programbi.com";
  ```
- **Impacto:** Cualquiera con esa cuenta de email es admin sin importar su rol en BD.
- **Fix:** Eliminar el OR por email en ambos archivos. Autorizar únicamente por `profiles.role`.

### 🔴 CR-3 — Webhook de MercadoPago SIN verificación de firma HMAC
- **ASVS:** V13.3.1, V6.2.2, V4.2.2
- **Archivo:** `app/api/mercadopago/webhook/route.ts:5-262`
- **Evidencia:** No se lee ni valida `x-signature` ni `x-request-id`. El handler muta `profiles.subscription_plan` y crea `enrollments` confiado en `body.data.id` controlable.
- **Impacto:** Fraude: forjar webhook para activar plan premium o matricularse en cualquier curso gratis.
- **Fix:** Implementar verificación HMAC-SHA256 oficial de MercadoPago contra `MERCADOPAGO_WEBHOOK_SECRET`. Devolver 401 si no calza con `crypto.timingSafeEqual`.

### 🔴 CR-4 — Webhook de Flow SIN validación de origen
- **ASVS:** V13.3.1, V6.2.2
- **Archivo:** `app/api/flow/confirm/route.ts:10-21`
- **Evidencia:** Confía en el `token` por formData sin verificar firma/callback IP.
- **Impacto:** Matriculación/cobros fraudulentos, replay.
- **Fix:** Validar IP de Flow (allowlist `200.71.53.0/24`) en `x-forwarded-for`, o firmar el callback con HMAC contra `FLOW_SECRET_KEY` (helper `sign` ya existe en `lib/flow/client.ts:16`).

### 🔴 CR-5 — XSS Stored en blog/newsletter vía DOMPurify bypass en SSR
- **ASVS:** V5.3.3, V5.4.1
- **Archivos:** `components/shared/ArticleBlockRenderer.tsx:11-13`, `app/(marketing)/blog/[slug]/BlogArticleClient.tsx:446`, `app/(marketing)/newsletter/[slug]/ArticleClient.tsx:208-212`
- **Evidencia:**
  ```ts
  const sanitizeHtml = (html) => typeof window !== "undefined" ? DOMPurify.sanitize(html) : html;
  // En SSR (servidor) window === undefined → devuelve el HTML CRUDO con scripts
  ```
- **Impacto:** Cualquiera con permiso de edición de `articles` inyecta `<script>` servido a TODOS los visitantes.
- **Fix:** Sanitizar en servidor con `isomorphic-dompurify` (jsdom) o sanitizar al escribir en Supabase. Eliminar el `dangerouslySetInnerHTML` del excerpt.

### 🔴 CR-6 — XSS Stored en panel admin de chatbot (escala privilegios)
- **ASVS:** V5.4.1
- **Archivo:** `app/(comunidad)/comunidad/admin/chatbot/ChatbotAdminClient.tsx:848-853, 339-345`
- **Evidencia:** `renderSimpleMarkdown(msg.content)` se inyecta vía `dangerouslySetInnerHTML` sin sanitizar. `msg.content` viene de `chatbot_messages` (escrito por visitante anónimo).
- **Impacto:** Visitante anónimo inyecta `<img onerror>` → admin abre conversación → ejecuta JS en su sesión admin. **Stored XSS que escala a admin.**
- **Fix:** Sanitizar con DOMPurify antes de inyectar, o renderizar como texto.

### 🔴 CR-7 — RLS ausente en tablas críticas (`payments`, `asesoria_slots`, `course_schedules`, `chatbot_*`, `articles`, `promo_popups`)
- **ASVS:** V4.1.3, V4.3.x
- **Evidencia:** Estas tablas **no existen** en `supabase/schema.sql` ni migraciones (creadas manualmente en panel). Con la `publishable` key expuesta en el navegador, cualquiera puede leer/escribir si no tienen RLS explícita.
- **Impacto:** Lectura de todos los pagos (montos, emails, métodos), auto-matrícula en `enrollments` (INSERT con `auth.uid()=user_id` pero sin validar pago), robo de slots de asesorías ajenas.
- **Fix:** `ENABLE ROW LEVEL SECURITY` + `FORCE` en TODAS estas tablas; quitar la policy `Users can insert own enrollments` (matrícula solo vía webhook verificado).

### 🔴 CR-8 — IDOR en `lessons`: `video_url` de cursos pagos públicamente legible
- **ASVS:** V4.1.3, V4.3.1
- **Archivos:** `supabase/schema.sql:191-194` (policy `USING (true)`), `lib/supabase/comunidad-ai.ts:514-559`
- **Evidencia:** `lessons` es legible por todos sin verificar inscripción. La server action devuelve TODOS los `video_url` y el gate es solo client-side.
- **Impacto:** Robo del catálogo completo de videos premium sin pagar (paywall cosmético).
- **Fix:** RLS restrictiva que exija `enrollments` activo + no devolver `video_url` de lecciones bloqueadas desde `getCourseLessons`.

---

## 🟠 HALLAZGOS ALTOS (resumen)

| # | Dominio | Hallazgo | Archivo |
|---|---|---|---|
| A-1 | V2 | Política de contraseñas mínima 10/6 (L3 exige 12) y divergente | registro/AuthModal/actualizar-password |
| A-2 | V2 | Sin HIBP/breach password check (V2.5.7) | — |
| A-3 | V2 | Sin MFA en ninguna cuenta (incl. admin) | global |
| A-4 | V2 | Sin throttling/lockout en login/registro/recuperación | — |
| A-5 | V2 | Auto-login post-registro sin verificar email (bypass verificación) | AuthModal:139 |
| A-6 | V2 | `getSession()` sin validar firma JWT en server actions | subscription.ts:9, etc. |
| A-7 | V3 | Sin idle timeout ni absolute timeout | proxy.ts/middleware |
| A-8 | V3 | Logout `signOut()` sin `scope:'global'`; sin re-auth post-logout | Navbar:182 |
| A-9 | V4 | `/api/business/members` POST permite adherir usuarios ajenos a mi empresa | members:116 |
| A-10 | V4 | `/api/mp/return` muta estado financiero leyendo `collection_status` del query param | mp/return:11 |
| A-11 | V4 | `/api/asesorias/slots` GET no exige auth y selecciona columnas sensibles | asesorias/slots |
| A-12 | V4 | `live/token` no valida inscripción al curso antes de emitir token | live/token:25 |
| A-13 | V5 | XSS Stored en `AdminPanel`/`PromoPopup` con `custom_html` + reinyecta scripts | PromoPopup:27-56 |
| A-14 | V5 | Prompt injection: `full_name`, adjuntos, `sourcePage` sin cuarentena | lib/ai/*, chatbot |
| A-15 | V5 | Inyección HTML en correos transaccionales (`nombre` sin escape) | quote-template.ts:207 |
| A-16 | V5 | Validación MIME por `file.type` (spoofeable) — sin magic bytes | attachments.ts:42 |
| A-17 | V6/14 | Secretos de **producción** en `.env.local` sincronizado a OneDrive | .env.local |
| A-18 | V7 | Ausencia total de logging de autenticación (login/logout/fail) | global |
| A-19 | V7 | Sin librería centralizada de logging (38 console.log, 158 console.error) | global |
| A-20 | V7 | PII y payloads de webhook logueados vía console | leads/mercadopago/flow |
| A-21 | V8 | Derecho al olvido NO implementado (bloque legal GDPR) | — |
| A-22 | V8 | Vercel Analytics sin banner de consentimiento (GDPR) | layout.tsx:224 |
| A-23 | V8 | `err.message` y stack expuestos al cliente en 4+ API routes | live/admin/email |
| A-24 | V12 | Bucket `project-submissions` PÚBLICO (entregas legibles sin auth) | 20260702_*.sql:208 |
| A-25 | V12 | CSV admin sin límite de tamaño/tipo (DoS memoria) | admin/companies:97 |
| A-26 | V13 | Rate limiter **in-memory** (inútil en Vercel serverless) | rate-limiter.ts:6 |
| A-27 | V13 | `/api/mp/create` y otras rutas sin validación Zod del body | mp/create:18 |
| A-28 | V14 | `next@16.2.3` con **9 CVE HIGH** (SSRF + bypass middleware) — fix: 16.2.10 | package.json:39 |
| A-29 | V14 | `nodemailer@^8.0.5` CVE HIGH (SSRF + file read) | package.json:40 |
| A-30 | V14 | `dompurify@^3.4.10` CVE bypass XSS activo | package.json:30 |
| A-31 | V14 | TradingView cargado desde CDN **sin SRI** | TradingViewWidget.tsx:31 |
| A-32 | V14 | `Math.random()` en IDs de orden de pago (no CSPRNG) | flow/create:131, mp/create:131 |

---

## ✅ CONTROLES QUE SÍ CUMPLEN (conservar)

| Control | Estado | Evidencia |
|---|---|---|
| TLS + HSTS preload (1 año, includeSubDomains) | ✅ | `next.config.ts:63` |
| Cabeceras de seguridad completas (CSP, X-Frame DENY, nosniff, Referrer-Policy, Permissions-Policy) | ✅ | `next.config.ts:24-69` |
| Middleware valida JWT con `getUser()` (no `getSession()`) | ✅ | `proxy.ts:37-39` |
| PKCE en OAuth Google | ✅ | `auth/callback/route.ts` |
| Sin SQL crudo — todas las consultas vía Supabase parametrizadas | ✅ | global |
| Sin `eval`, `child_process`, `exec`, `new Function` en código de app | ✅ | global |
| Sin path traversal (sin `fs.*`, adjuntos usan `userId/uuid.ext` en Storage) | ✅ | attachments.ts |
| Cuotas IA validadas server-side (`quota-service.ts`) | ✅ | lib/ai/quota-service.ts |
| RLS en tablas core (profiles, ai_chats, notifications, project_submissions) | ✅ | schema.sql |
| `.env*` gitignorado y **0 secretos en git history** (451 commits) | ✅ | .gitignore:34 |
| Sin MD5/SHA1/DES; HMAC-SHA256 correcto en Flow | ✅ | lib/flow/client.ts:16 |
| `crypto.randomUUID()` para IDs sensibles y storage paths | ✅ | attachments.ts, ai/chat |
| Service-role key NO prefijada con `NEXT_PUBLIC_` (no llega al bundle) | ✅ | server.ts |
| Markdown IA con react-markdown **sin rehype-raw** (HTML crudo descartado) | ✅ | MarkdownRenderer.tsx |
| Server Actions con CSRF protegido por Next.js 16 | ✅ | — |
| Lockfile con integrity en 711/711 entradas; sin URLs http ni git+http | ✅ | package-lock.json |

---

## 🎯 PLAN DE REMEDIACIÓN PRIORIZADO

### Fase 0 — Emergencia (≤ 24h, antes de cualquier deploy a prod)
1. **Rotar TODOS los secretos** del `.env.local` (asumir compromiso por OneDrive):
   `SUPABASE_SECRET_KEY`, `MERCADOPAGO_ACCESS_TOKEN`, `FLOW_SECRET_KEY`, `SES_SMTP_PASS`, `OPENROUTER_API_KEY`.
2. **Eliminar backdoor por email** (`CR-2`) — 2 líneas.
3. **Parchear RLS de `profiles`** (`CR-1`) — migración SQL.
4. **Implementar HMAC en webhook MercadoPago** (`CR-3`).
5. **Habilitar RLS en tablas críticas** (`CR-7`).
6. **`npm install next@16.2.10 nodemailer@^9`** (`A-28`, `A-29`).

### Fase 1 — Crítica (≤ 1 semana)
7. Validar firma HMAC en webhook de Flow (`CR-4`).
8. Sanitizar blog/newsletter/chatbot admin con DOMPurify server-side (`CR-5`, `CR-6`).
9. RLS restrictiva en `lessons`; no devolver `video_url` de lecciones bloqueadas (`CR-8`).
10. Mover `/api/mp/return` y `/api/flow/return` a solo-redirect (no mutar estado) (`A-10`).
11. Hacer bucket `project-submissions` privado (`A-24`).
12. Cambiar `Math.random()` por `crypto.randomUUID()` en órdenes (`A-32`).
13. Quitar `getSession()` → `getUser()` en server actions (`A-6`).

### Fase 2 — Alta (≤ 1 mes)
14. Política de contraseñas unificada ≥12 + HIBP (`A-1`, `A-2`).
15. Throttling persistente (Upstash Redis) + CAPTCHA en auth (`A-3`, `A-4`).
16. MFA TOTP obligatorio para admin/managers (`A-3`).
17. Implementar idle/absolute timeout (`A-7`).
18. Librería de logging centralizada (pino) + tabla `auth_events` (`A-18`, `A-19`).
19. Eliminar PII de `console.log` y webhook payloads (`A-20`).
20. Derecho al olvido: `deleteMyAccount()` server action (`A-21`).
21. Banner de consentimiento cookies (`A-22`).
22. Escape HTML en plantillas de email (`A-15`).
23. Validación magic bytes + límite tamaño CSV (`A-16`, `A-25`).
24. Rate limiter distribuido Upstash (`A-26`).
25. Zod en TODAS las API routes (`A-27`).
26. Eliminar auto-login post-registro; exigir verificación email (`A-5`).
27. Self-host TradingView o añadir SRI (`A-31`).

### Fase 3 — Endurecimiento L3 (continuo)
28. CSP con nonces (quitar `'unsafe-inline'`/`'unsafe-eval'`).
29. HSTS max-age 63072000 + submit a preload list.
30. SBOM CycloneDX en CI + `npm audit` gate.
31. `import "server-only"` en todos los módulos server.
32. COOP/COEP/CORP headers.
33. Cifrado columna (`pgcrypto`) en `leads.email`, `chatbot_messages.content`.
34. Antivirus scan en buckets de subida.
35. Documentar runbook de rotación de claves.

---

## 📋 MATRIZ DE CUMPLIMIENTO ASVS L3 (extracto)

| ID ASVS | Requisito (resumen) | Estado | Hallazgo ref. |
|---|---|---|---|
| V2.1.6 | Verificación de cuenta por email | ❌ | A-5 |
| V2.1.7 | Anti-enumeración de usuarios | ❌ | — |
| V2.2.1 | Throttling autenticación | ❌ | A-4 |
| V2.5.1 | Password ≥ 12 caracteres | ❌ | A-1 |
| V2.5.7 | Breach check (HIBP) | ❌ | A-2 |
| V2.8.x | MFA | ❌ | A-3 |
| V3.2.1 | Tokens stateless validados | ⚠️ | A-6 |
| V3.3.2 | Idle timeout | ❌ | A-7 |
| V3.3.3 | Logout server-side | ⚠️ | A-8 |
| V3.3.4 | Absolute timeout | ❌ | A-7 |
| V4.1.3 | Anti-BOLA/IDOR | ❌ | CR-7, CR-8 |
| V4.2.1 | Datos sensibles protegidos | ❌ | CR-1 |
| V4.2.2 | Validación server-side de permisos | ❌ | CR-3, CR-4 |
| V4.3.1 | Acceso mínimo a datos | ❌ | CR-7 |
| V4.3.3 | Atributos sensibles (rol, plan) | ❌ | CR-1 |
| V5.3.3 | Output encoding | ❌ | CR-5 |
| V5.4.1 | No reflejar input sin codificar | ❌ | CR-5, CR-6 |
| V5.4.2 | Input como datos (prompt injection) | ❌ | A-14 |
| V6.2.2 | Integridad webhooks (HMAC) | ❌ | CR-3, CR-4 |
| V7.1.1 | Logging de auth | ❌ | A-18 |
| V7.2.1 | No loguear secrets/PII | ❌ | A-20 |
| V8.3.3 | No exponer detalles internos | ❌ | A-23 |
| V8.6.1 | Derecho al olvido | ❌ | A-21 |
| V9.1.2 | HSTS | ✅ | — |
| V12.1.1 | Archivos en dominio/origen seguro | ❌ | A-24 |
| V12.3.1 | Validación magic bytes | ❌ | A-16 |
| V13.2.3 | Webhooks con firma | ❌ | CR-3, CR-4 |
| V14.1.2 | Dependencias parcheadas | ❌ | A-28, A-29, A-30 |
| V14.4.4 | SRI en CDN de terceros | ❌ | A-31 |

---

## ⚠️ LIMITACIONES DE LA AUDITORÍA

1. **Estática únicamente** — no se ejecutó pentest dinámico, fuzzing, ni pruebas de runtime.
2. **Tablas `payments`, `asesoria_slots`, `course_schedules`, `chatbot_*`, `articles`, `promo_popups`** no están en migraciones versionadas → su RLS real NO fue auditable. **Asumir inseguras hasta verificar.**
3. **`supabase/config.toml`** no versionado → políticas de Auth (expiración JWT, confirmación email, password strength) no verificadas. **Confirmar en dashboard.**
4. **Despliegue Vercel real** (env vars productivas, configuración de edge) fuera del alcance.
5. **`openchat/`** (subproyecto) se mencionó solo como referencia de patrones — no auditado a fondo.
6. Los hallazgos se basan en el estado del código a la fecha 2026-07-05.

---

## 📁 ENTREGABLES

- `OWASP_ASVS_L3_Informe.md` — este documento (resumen ejecutivo + scorecard + plan).
- `OWASP_ASVS_L3_Hallazgos_Detallados.md` — detalle técnico por dominio con código de cada hallazgo (ver archivo adjunto).
- `README.md` — índice y cómo usar.

*Auditoría realizada en modo solo lectura. No se modificó ningún archivo de la aplicación. Todos los secretos en este informe aparecen como `***REDACTED***`.*
