# HERMES_REPORTE_FASE4

Fecha: 4 de noviembre de 2026 · Rama: `mejora/fase4` · Base: `mejora/fase3` @ `d188e53`
Nunca se tocó `main`, no hubo deploy, no se aplicaron migraciones.

---

## 1. Resumen ejecutivo

| Qué | Resultado |
|---|---|
| Base verificada | `mejora/fase3` = `origin/mejora/fase3` (`d188e53`), sin commits pendientes |
| Rama integradora | `mejora/fase4` (worktree `C:/dev/pbi-f4`) |
| Diff total | 45 archivos, +2.798 / −110 líneas |
| Build | `npx next build --webpack` → **EXIT 0**, 828 páginas estáticas |
| TypeScript | `npx tsc --noEmit` → **EXIT 0** |
| Lint (35 archivos tocados) | **0 errores**, 15 warnings de estilo preexistentes |
| Verificación general | `verificar-sitio.mjs`: 536 URLs de sitemap, 550/553 revisadas, 5.824 alternates, 169 fichas con `Offer`, 550 títulos únicos, **0 hallazgos** |
| Verificación fase 4 | `verificar-fase4.mjs`: **0 hallazgos** |
| Sitemap | 536 URLs; `/clase-gratis` **no** aparece (flag apagado) |

---

## 2. Desviación importante: subagentes

El encargo pedía **7 subagentes en paralelo**. El runtime de esta sesión solo permite
**2 hijos** (`delegation.oneshot_max_children = 2`): el primer intento con 7 fue
rechazado con «Delegation budget for this one-shot run is exhausted».

Lo que se hizo:

- **WS4 (landings SQL/Python)** y **WS6 (certificado verificable)** corrieron en
  subagentes con `opencode-go deepseek-v4.1-flash`, cada uno en su worktree
  (`C:/dev/pbi-f4-4`, `C:/dev/pbi-f4-6`) y su rama (`feat/f4-landings`,
  `feat/f4-certificado`), con commits propios.
- **WS1 (cuotas), WS2 (clase gratis), WS3 (test de nivel), WS5 (precios) y
  WS7 (medición)** los hizo el orquestador directamente en `mejora/fase4`, porque el
  presupuesto de delegación ya estaba agotado.
- Las ramas `feat/f4-cuotas`, `feat/f4-clase-gratis`, `feat/f4-test-nivel`,
  `feat/f4-precios` y `feat/f4-medicion` se crearon, pero quedaron apuntando al commit
  inicial del plan: el trabajo de esos cinco frentes vive en `mejora/fase4`.

No se ocultó ningún trabajo ni se inventó que hubiera 7 agentes.

---

## 3. Decisiones de Manu implementadas

### 3.1 Las 3 cuotas sin interés aplican en todos los países

- Nueva fuente única `config/cuotas.ts`: `CUOTAS_SIN_INTERES = 3`, `cuotasSinInteres()`,
  `textoCuotas()`, `NOTA_CUOTAS`, `NOTA_CUOTAS_MEDIOS`, `MEDIOS_CUOTAS`.
- `lib/faq/contenido.ts`: **11** respuestas, resúmenes y pasos dejaron de escribir «3
  cuotas» a mano y ahora interpolan la config.
- `components/faq/FaqContenido.tsx`, `components/guias/Bloque30Segundos.tsx` y
  `components/guias/ElementoVisual.tsx` leen la misma fuente.
- Ficha de curso: nota `NOTA_CUOTAS` bajo el precio (visible en el HTML del servidor).
- Checkout: nota `NOTA_CUOTAS_MEDIOS` bajo el total.
- `lib/email/quote-template.ts` decía «hasta 12 cuotas sin interés» y contradecía la
  decisión: ahora dice 3.

### 3.2 Clase gratis con flag APAGADO

- `config/flags.ts`: `CLASE_GRATIS_HABILITADA` desde `NEXT_PUBLIC_CLASE_GRATIS`
  (default **false**) y `CLASE_GRATIS` con `fecha`, `hora` y `cupos` desde entorno.
  Todo `null` por defecto: **no se inventó fecha ni cupos**.
- `/clase-gratis` y `/{pais}/clase-gratis` responden 200 con «Todavía no hay fecha
  confirmada», CTA a WhatsApp y a cursos, **sin formulario**, con `robots: noindex`.
- La ruta queda registrada en `lib/paises/rutas.ts` pero **fuera del sitemap**.
- El formulario (`components/clase-gratis/FormularioClase.tsx`) existe y solo se monta
  cuando `CLASE_GRATIS.fecha` tiene valor real; reutiliza `POST /api/leads/create`.

### 3.3 Fase 4 arrancó con fase 3 cerrada

Confirmado antes de empezar: `git rev-parse mejora/fase3` = `origin/mejora/fase3` =
`d188e53`, y `git log origin/mejora/fase3..mejora/fase3` vacío.

---

## 4. Estado por workstream

| WS | Estado | Qué quedó |
|---|---|---|
| 1 · Cuotas | Hecho por orquestador | Fuente única + 11 textos de FAQ + ficha + checkout + plantilla de cotización |
| 2 · Clase gratis | Hecho por orquestador | Ruta con flag apagado, noindex, sin fecha inventada |
| 3 · Test de nivel | Hecho por orquestador | País real en title/H1, hub `/test-nivel`, email opcional a `leads_magnet` |
| 4 · Landings SQL/Python | Hecho por subagente | Contenido local, precio, horario y FAQ por país; Paraguay sin `Offer` |
| 5 · Precios | Hecho por orquestador | Canonical y título propios por país; FAQ de cuotas |
| 6 · Certificado | Hecho por subagente + fix del orquestador | `/certificado/[codigo]`, `/verificar-certificado`, fallback de esquema |
| 7 · Medición | Hecho por orquestador | `webinar_signup`, auditoría `_dbg`, `verificar-fase4.mjs` |

Detalle por WS en `docs/fase4/WS1.md` … `WS7.md`.

---

## 5. Defectos reales encontrados y corregidos

1. **`/precios` se declaraba Chile en todos los países.** La página exportaba
   `metadata` estática con `canonical: /precios` y título de Chile; `/mx/precios`,
   `/ar/precios`, etc. heredaban ese canonical. Ahora hay `generateMetadata({ params })`
   con título, descripción, canonical y `hreflang` por país. Verificado:
   `/mx/precios` → `<title>Precios de cursos en vivo en México | ProgramBI</title>` y
   `canonical=https://www.programbi.com/mx/precios`.
2. **El test de nivel se llamaba «en Chile» en todas las rutas.** Título y H1 ahora usan
   el país de la URL.
3. **`/certificado/<código>` daba 500.** Postgres respondía `42703`: la migración
   `20260708000000_update_certificates.sql` **no está aplicada** en la base viva, así que
   `student_name` y `course_title` no existen. Se agregó fallback al esquema real
   (`certificate_code, issued_at, user_id, course_id`) resolviendo curso en
   `courses.title` y alumno en `profiles.full_name`. Un código inexistente ahora da
   **404** (antes 500). El email nunca se consulta.
4. **«Hasta 12 cuotas sin interés»** en la plantilla de cotización, contra la decisión de
   Manu.
5. **`/clase-gratis` no existía**: creada con flag apagado y noindex.

---

## 6. Verificación (evidencia)

```
npx tsc --noEmit                → EXIT=0
npx next build --webpack        → EXIT=0 · 828 páginas estáticas
                                → "✓ Generating static pages using 11 workers (828/828) in 3.2min"

node scripts/verificar-sitio.mjs http://127.0.0.1:3112
  Sitemap: 536 URLs
  Rutas opcionales: 17
  URLs revisadas: 550/553
  Alternates comprobados: 5824
  Fichas con Offer: 169
  Títulos únicos: 550
  VERIFICACIÓN OK: sin hallazgos.

node scripts/verificar-fase4.mjs http://127.0.0.1:3112
  Fase 4: 6 grupos de comprobaciones
  FASE 4 OK: sin hallazgos.
```

`scripts/verificar-fase4.mjs` comprueba: precios por país (canonical y título),
hub y tests por país, landings SQL/Python con país en el H1 y `Course`+`Offer`+`FAQPage`,
Paraguay sin `Offer` y con CTA de WhatsApp, `/clase-gratis` noindex sin formulario,
`/certificado/<inválido>` = 404 y `/verificar-certificado` = 200.

Sitemap servido: 536 `<url>`, `test-nivel` 39 apariciones (hub + tests × países),
`verificar-certificado` 1, `clase-gratis` **0**.

---

## 7. Pendientes de Manu (TODO_MANU)

1. **Preview de Vercel**: revisar `mejora/fase4` y pasárselo a Radar para SEO/GA4 antes de
   cualquier merge a `main`.
2. **Clase gratis**: confirmar fecha, hora y cupos. Recién ahí definir
   `NEXT_PUBLIC_CLASE_GRATIS=1` + `_FECHA`, `_HORA`, `_CUPOS` y agregar la ruta al sitemap.
3. **Migración `leads_magnet`**: sin ella el email opcional del test de nivel no guarda
   nada (igual que la plantilla).
4. **Migración `20260708000000_update_certificates.sql`**: sin ella el certificado usa el
   fallback (`courses` + `profiles`); con ella muestra las columnas propias.
5. **Probar un código real** de `public.certificates` en el preview (la tabla está vacía
   en la base a la que apunta este entorno, así que no se pudo ver el caso 200).
6. **GA4 DebugView**: verificar `webinar_signup`, `quiz_complete`, `download_template` y
   `purchase` con una navegación real.
7. **Paraguay** sigue sin precio: noindex, sin `Offer`, CTA por WhatsApp.
8. **3 cuotas**: confirmar con la pasarela de cada país que se ofrecen sin recargo; el
   texto afirma la condición comercial, no el detalle técnico de cada medio.

---

## 8. Riesgos y notas técnicas

- **Turbopack**: se mantiene la regla de fase 3; el build válido es `next build --webpack`
  por el symlink de `node_modules` entre worktrees.
- **`node_modules`**: en `C:/dev/pbi-f4` es un *junction* de Windows a
  `C:/dev/pbi-v2/node_modules`. `ln -s` de MSYS copia la carpeta (1 GB) y hay que evitarlo.
- **Build lento**: 828 páginas; algunos posts del blog agotaron los 60 s por página y se
  reintentaron; el build terminó igual con EXIT 0.
- **No se tocó**: `main`, DNS, Google Ads/Meta Ads, configuración de GA4, Supabase de
  producción ni migraciones. No se envió ningún correo ni WhatsApp.

---

## 9. Mapa de commits

```
42f9aa3 docs(f4-certificado): esquema real de Supabase y fallback
55f95c9 fix(f4-certificado): verificar con el esquema real de Supabase y degradar sin 500
f63adb7 docs(f4): estado por workstream y plan al dia
bf7aa3f feat(f4): sitemap y rutas localizables para test-nivel y verificador
36c7be8 feat(f4-medicion): evento webinar_signup y verificacion de rutas de fase 4
34ac901 fix(f4-precios): canonical y titulo propios por pais y FAQ de cuotas
e4b486e feat(f4-clase-gratis): pagina /clase-gratis detras de flag apagado, sin fecha ni cupos inventados
11930a6 feat(f4-test-nivel): pais real en title/h1, hub /test-nivel y email opcional del resultado
7a28c5d feat(f4-cuotas): 3 cuotas sin interes en todos los paises desde config/cuotas
0d09e37 merge(f4): feat/f4-certificado
db8efe9 merge(f4): feat/f4-landings
2457401 fix(f4-landings): nota de casos locales solo cuando hay sector
95b6875 feat(f4-landings): contenido local, precio y FAQ por país en SQL y Python
a4ccb25 feat(f4-certificado): ficha pública de certificado con verificación por código
d347e0c feat(f4): plan de fase 4 y fuente unica de cuotas sin interes
```

Rama publicada: `origin/mejora/fase4`. Sin merge a `main`, sin deploy.
