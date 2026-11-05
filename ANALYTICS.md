# Analytics (Fase A — instrumentación)

Medimos **leads**, no vanity. Stack: **GA4 gtag** (no GTM). El HTML público no incluye GTM (`GTM-`) ni un Measurement ID hardcodeado.

## Inventario

| Pieza | Estado |
| --- | --- |
| GA4 gtag | Sí. `components/shared/MarketingAnalytics.tsx` + `lib/analytics/marketing.ts` |
| GTM | No. No añadir GTM encima de gtag. |
| Vercel Analytics | Sí (`@vercel/analytics` en `app/layout.tsx`). Independiente de GA4. |
| Microsoft Clarity | Opcional, mismo loader, `NEXT_PUBLIC_CLARITY_PROJECT_ID` |
| Carga | `next/script` `strategy="lazyOnload"` (después de hidratar / idle). Stub `gtag` + `config` en mount para no perder eventos. |
| Pageviews App Router | Automáticos vía `usePathname` / `useSearchParams` (`send_page_view: false` en init; `config` por ruta). |

## Env

No pegues el Measurement ID en el chat ni en el código. En local (`platform/.env.local`) y en Vercel:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
```

Reemplaza `G-XXXXXXXX` por el ID real de GA4 (Admin → Data streams → Web → Measurement ID).

Opcional:

```bash
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
```

Sin `NEXT_PUBLIC_GA_MEASUREMENT_ID` no se carga `gtag.js`. En desarrollo los eventos igual salen en consola: `[analytics] event_name {…}`.

Reinicia `next dev` después de cambiar env públicas.

## Eventos de lead

Nombres **exactos**. Parámetros custom en snake_case.

| Evento | Cuándo | Params |
| --- | --- | --- |
| `page_view` | Cada ruta App Router (SPA incluida) | `page_path` (vía `gtag('config')`) |
| `view_curso` | Vista de `/cursos/[slug]` | `curso_slug` |
| `view_empresas` | Vista de `/empresas` | — |
| `click_cta_primary` | CTA primario en home | `cta_id` |
| `click_registro` | Click que abre / lleva a registro | — |
| `submit_registro` | Alta **exitosa** (email o Google nuevo). No se dispara en honeypot/bot ni en error. | — |
| `generate_lead` | Misma conversión: signUp OK, insert de lead OK, o OAuth nuevo (`?reg_ok=1`). **Marcar generate_lead como evento clave en GA4 Admin.** | `method` (`form` \| `click`), `page_path`, `course_slug` (si hay) |
| `click_whatsapp` | Click a `wa.me` / WhatsApp | `course` (slug), `country` (ISO), `page`; también `page_path` y `curso_slug` por compatibilidad |
| `click_cotizar_empresas` | CTA “Pedir una propuesta” en empresas | — |
| `quiz_complete` | Test de nivel completado (`/test-nivel/sql`, `/test-nivel/excel` y versiones por país) | `tema` (`sql` \| `excel`), `nivel` (`inicial` \| `basico` \| `intermedio` \| `avanzado`), `pais`, `aciertos`, `total` |

`ai_referral` (entrada desde asistentes IA) se documenta en [Tráfico desde asistentes IA](#tráfico-desde-asistentes-ia). No es un evento de lead.

### `cta_id` (home)

- `home_hero_registrarse`
- `home_nav_registrarse`

Home “Registrarme” dispara **los dos**: `click_cta_primary` + `click_registro`.

CTA primario home: **Registrarme** (camino más corto al lead). “Ver cursos” es outline y no dispara `click_cta_primary`.

Google OAuth de usuario nuevo redirige con `?reg_ok=1` (se limpia del URL al instante). Eso dispara `submit_registro`.

## Cómo probar DebugView

1. En GA4: **Admin → Data streams** copia el Measurement ID `G-…`.
2. Seta `NEXT_PUBLIC_GA_MEASUREMENT_ID` (local o preview). Reinicia el server.
3. Abre [GA4 DebugView](https://support.google.com/analytics/answer/7201382) (Admin → DebugView).
4. Activa debug de una de estas formas:
   - Local: `debug_mode` ya va en `gtag config` cuando `NODE_ENV === "development"`.
   - Preview/prod: extensión [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijfeivfkblbkeamm) o `?debug_mode` no hace falta; usa la extensión o el tag assistant.
5. Checklist manual (home → curso → registro → WhatsApp):

   | Paso | Qué debes ver en DebugView |
   | --- | --- |
   | Abrir `/` | `page_view` (`page_path` `/`) |
   | Click **Registrarme** (hero) | `click_cta_primary` (`cta_id=home_hero_registrarse`) y `click_registro` |
   | Ir a un curso `/cursos/power-bi` (slug real) | `page_view` + `view_curso` (`curso_slug`) |
   | Click **Registrarse** / **Ver precio** en el curso | `click_registro` |
   | Completar registro (éxito) | `submit_registro` + `generate_lead` (`method=form`, `page_path`, `course_slug` si viene de un curso) |
   | Click del botón verde de WhatsApp | `click_whatsapp` (`course`, `country`, `page`) |
   | Abrir `/empresas` | `view_empresas` |
   | Click **Pedir una propuesta** | `click_cotizar_empresas` |

6. En DevTools → Network, `gtag/js?id=G-…` debe cargar (no bloqueado por CSP).
7. Consola en `next dev`: líneas `[analytics] …`.

Los hits de DebugView no inflan reportes estándar si usas debug_mode / la extensión.

## Tráfico desde asistentes IA

GA4 no trae un canal propio para ChatGPT, Perplexity, Gemini, Copilot, Claude o Grok: el referrer de `chatgpt.com` cae en **Referral**, y muchas apps abren el enlace sin referrer y solo dejan un `utm_source`. Para no depender de esa clasificación, el sitio detecta la entrada en el cliente y manda el evento `ai_referral`.

### Qué se mide

Se revisa, en este orden:

1. El host de `document.referrer` (con o sin `www.`, con path): `chatgpt.com`, `chat.openai.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`, `grok.com`.
2. `utm_source` y `utm_medium` de la URL actual y, como respaldo, los UTM *first-touch* guardados en la sesión: `chatgpt.com`, `chatgpt`, `openai`, `perplexity`, `gemini`, `copilot`, `claude`, `grok` (sin distinguir mayúsculas; `www.` se ignora).

Al detectar, se envía **una sola vez por sesión de pestaña** (`sessionStorage`, clave `pb_ai_referral`):

| Parámetro | Ejemplo | Significado |
| --- | --- | --- |
| `ai_source` | `chatgpt` | valor canónico: `chatgpt`, `perplexity`, `gemini`, `copilot`, `claude`, `grok` |
| `referrer_host` | `chatgpt.com` | host del referrer normalizado (sin `www.`); `(direct)` si la señal vino solo de UTM |
| `landing_path` | `/curso-power-bi` | ruta donde se detectó la entrada, sin query |

También se ejecuta `gtag('set', 'user_properties', { ai_source })`, así que la propiedad viaja en los hits posteriores de esa sesión. El evento hereda el contexto habitual (`country`, `page_type`, UTM) de `trackEvent`.

`ai_referral` no abre la sesión ni duplica pageviews: `trackEvent` reutiliza el `page_view` de la ruta.

### Grupo de canales «Asistentes IA»

1. GA4 → **Admin** → **Data display** → **Channel groups**.
2. **Create new channel group** (parte de una copia del grupo por defecto) y nómbralo `Asistentes IA`.
3. **Add new channel** → nombre `Asistentes IA` → **+ Add condition group**.
4. Condición: dimensión **Session source**, coincidencia **matches regex**, valor:

   ```
   chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|grok\.com
   ```

   La regex no lleva anclas: GA4 la aplica como coincidencia parcial, así que cubre `www.` y cualquier path del referrer.
5. **Reorder**: deja `Asistentes IA` **por encima de `Referral`** y pulsa **Apply**; GA4 evalúa en orden y gana el primer canal que coincide. Luego **Save group**.
6. En **Acquisition → User acquisition** o **Traffic acquisition**, usa el grupo `Asistentes IA` como dimensión primaria o secundaria. También está disponible en Explorations.

El grupo no cambia `session_source` ni los eventos: solo reclasifica las sesiones al consultar los informes. Los grupos personalizados de GA4 pueden aplicarse retroactivamente a los datos históricos, así que puede aparecer tráfico pasado que ya tenía `chatgpt.com` como fuente.

### Dimensión personalizada `ai_source`

1. GA4 → **Admin** → **Custom definitions** → **Create custom dimension**.
2. Nombre: `ai_source`. Descripción: `Asistente IA de origen (chatgpt, perplexity, gemini, copilot, claude, grok)`.
3. Scope: **User**. User property: `ai_source` (debe coincidir exactamente con la que setea el código).
4. **Create**.

Es user-scoped y **no retroactiva**: solo recoge valores desde su creación y puede tardar hasta 24–48 h en aparecer en los informes.

### Verlo en Explorations y DebugView

- **Explorations** → **Blank**: dimensión `ai_source` (scope User) y métrica `Total users`; o `Event name` filtrado a `ai_referral` con `Event count` y `Total users`. Añade `landing_path` o `page_path` como desglose para ver qué landings traen los asistentes.
- **Admin → DebugView**: al entrar con la señal aparece `ai_referral`; al abrirlo se ven `ai_source`, `referrer_host` y `landing_path`. La user property `ai_source` también debe aparecer en las propiedades del usuario de debug.

### Probar en local

1. Arranca `next dev`. En desarrollo `trackEvent` imprime siempre, aunque no haya `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
2. **UTM (lo más rápido)**: abre `http://localhost:3000/?utm_source=chatgpt` en una pestaña nueva. En consola:

   ```
   [analytics] ai_referral { ai_source: "chatgpt", referrer_host: "(direct)", landing_path: "/", … }
   [pb-ga] ai_referral { ai_source: "chatgpt", referrer_host: "(direct)", landing_path: "/" }
   ```

   La segunda línea solo sale en localhost, en un preview de Vercel o con `?pb_ga_debug=1`.
3. **Referrer simulado**: carga `http://localhost:3000/` con la cabecera `Referer: https://chatgpt.com/c/123`. Opciones:
   - Extensión tipo **Requestly** o **ModHeader**: regla que reemplace `Referer` en `http://localhost:3000/*`.
   - Playwright/CDP: `page.goto("http://localhost:3000/", { referer: "https://chatgpt.com/c/123" })`.
   - Sin herramientas: desde una pestaña de `https://chatgpt.com/`, ejecuta `location.href = "http://localhost:3000/"`; el navegador manda el origen como referrer si el sitio no usa `no-referrer`.
4. Debe salir `ai_source: "chatgpt"` y `referrer_host: "chatgpt.com"`. Prueba también `?utm_source=Perplexity`, `?utm_medium=openai` y un `utm_source=newsletter` (no debe disparar nada).
5. Para repetir el test: `sessionStorage.removeItem("pb_ai_referral")` y recarga. Sin borrarlo, un segundo `ai_referral` no debe aparecer aunque navegues entre rutas.
6. Confirma que cada ruta sigue enviando **un solo** `page_view` y que `view_curso`, `generate_lead`, `click_whatsapp`, etc. no cambian.

## CSP

`next.config.ts` permite:

- `script-src`: `https://www.googletagmanager.com`, `https://www.google-analytics.com`, Clarity
- `connect-src`: `https://*.google-analytics.com`, `https://analytics.google.com`, `https://www.googletagmanager.com`, Clarity
- `img-src`: pixel de GA / GTM / Clarity

No se usa `unsafe-eval` extra ni ambos GTM+gtag.

## Archivos

- `lib/analytics/marketing.ts` — helpers y nombres de evento
- `components/shared/MarketingAnalytics.tsx` — loader gtag, pageviews, clicks WhatsApp / `data-analytics-event`
- `components/shared/AnalyticsPageEvent.tsx` — `view_empresas`
- `components/marketing/RegisterCta.tsx`, `HeroSection.tsx`
- `components/shared/Navbar.tsx`, `AuthModal.tsx`, `WhatsAppButton.tsx`
- `app/(auth)/registro/page.tsx`, `app/(auth)/login/page.tsx`
- `app/(marketing)/cursos/[slug]/CourseDetailClient.tsx`
- `app/(marketing)/test-nivel/[tema]/TestNivelClient.tsx` — `quiz_complete`
- `lib/data/test-nivel/*` — preguntas, niveles y recomendación
- `components/empresas/empresas-landing.tsx`, `empresas-contact-form.tsx`
- `app/auth/callback/route.ts` — `reg_ok` en OAuth nuevo
- `next.config.ts` — CSP
- `app/layout.tsx` — ya montaba `MarketingAnalytics` (sin cambio de UI)
