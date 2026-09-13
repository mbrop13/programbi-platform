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
| `click_whatsapp` | Click a `wa.me` / WhatsApp | `page_path` |
| `click_cotizar_empresas` | CTA “Pedir una propuesta” en empresas | — |

### `cta_id` (home)

- `home_hero_registrarse`
- `home_flagship_registrarse`
- `home_nav_registrarse`

Home “Registrarse” dispara **los dos**: `click_cta_primary` + `click_registro`.

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
   | Click **Registrarse** (hero) | `click_cta_primary` (`cta_id=home_hero_registrarse`) y `click_registro` |
   | Ir a un curso `/cursos/power-bi` (slug real) | `page_view` + `view_curso` (`curso_slug`) |
   | Click **Registrarse** / **Ver precio** en el curso | `click_registro` |
   | Completar registro (éxito) | `submit_registro` |
   | Click del botón verde de WhatsApp | `click_whatsapp` (`page_path`) |
   | Abrir `/empresas` | `view_empresas` |
   | Click **Pedir una propuesta** | `click_cotizar_empresas` |

6. En DevTools → Network, `gtag/js?id=G-…` debe cargar (no bloqueado por CSP).
7. Consola en `next dev`: líneas `[analytics] …`.

Los hits de DebugView no inflan reportes estándar si usas debug_mode / la extensión.

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
- `components/marketing/RegisterCta.tsx`, `HeroSection.tsx`, `Flagship.tsx`
- `components/shared/Navbar.tsx`, `AuthModal.tsx`, `WhatsAppButton.tsx`
- `app/(auth)/registro/page.tsx`, `app/(auth)/login/page.tsx`
- `app/(marketing)/cursos/[slug]/CourseDetailClient.tsx`
- `components/empresas/empresas-landing.tsx`, `empresas-contact-form.tsx`
- `app/auth/callback/route.ts` — `reg_ok` en OAuth nuevo
- `next.config.ts` — CSP
- `app/layout.tsx` — ya montaba `MarketingAnalytics` (sin cambio de UI)
