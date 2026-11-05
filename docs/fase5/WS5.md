# WS5 — Medición de tráfico IA en GA4

Ejecutado en el worktree `C:/dev/pbi-f5-5`, rama `feat/f5-medicion-ia`, desde `mejora/fase5` @ `0b14f1f`.

## Estado

- [x] Hecho

Sin `next build`, `tsc`, `next dev` ni tests: la verificación fue por lectura del flujo completo y `git diff --check` (7 agentes en paralelo, máquina de 8 GB).

## Archivos

- `lib/analytics/marketing.ts` — detección de la señal, `detectAiReferral()`, `trackAiReferral()`, tipos `AiSource` / `AiReferral`, mapas de hosts y UTMs, constante `GA_LEAD_EVENTS.AI_REFERRAL`.
- `components/shared/MarketingAnalytics.tsx` — llamada a `trackAiReferral()` en un `useEffect` por ruta, después del efecto de `page_view`.
- `ANALYTICS.md` — sección «Tráfico desde asistentes IA».
- `docs/fase5/WS5.md` — este documento.

No se tocaron `app/layout.tsx`, `next.config.ts` ni ningún otro archivo.

## Lógica

### Detección (`detectAiReferral`)

1. Normaliza el host de `document.referrer`: minúsculas, sin esquema, sin `www.`, sin puerto ni path. Lo busca en `AI_REFERRER_HOSTS`:
   `chatgpt.com`, `chat.openai.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`, `grok.com`.
2. Si no hay match, revisa `utm_source` y `utm_medium` de la URL actual y, como respaldo, los UTM first-touch de `sessionStorage` (`pb_marketing_utm`, que ya llenaba `captureUtmFromUrl`). Valores: `chatgpt.com`, `chatgpt`, `openai`, `perplexity`, `gemini`, `copilot`, `claude`, `grok`, sin distinguir mayúsculas.
3. Devuelve `ai_source` canónico, `referrer_host` (host normalizado o `(direct)` si solo hubo UTM) y `landing_path` (ruta actual sin query).

La coincidencia de host es exacta tras normalizar: `chatgpt.com.evil.com` no cuenta. `www.` y los paths sí quedan cubiertos.

### Envío (`trackAiReferral`)

- Deduplica con `sessionStorage["pb_ai_referral"]` y un flag en memoria. El flag cubre el caso en que el storage esté bloqueado; la marca se escribe **antes** de enviar, así que un remount o un cambio de ruta no repite el evento.
- Llama a `ensureGa4()` (stub + `config` + page_view inicial), setea `gtag('set', 'user_properties', { ai_source })` y manda `ai_referral` por `trackEvent` con `ai_source`, `referrer_host` y `landing_path`.
- `trackEvent` añade el contexto habitual (`country`, `page_type`, `utm_*`) y usa `ensurePageViewBeforeHit`, que deduplica por `path+query`: no se duplica `page_view` ni el evento abre la sesión.
- Es una función pura de decisión + efecto de analítica: no bloquea la hidratación (todo ocurre en `useEffect`) y no requiere dependencias nuevas.

### Integración

En `MarketingAnalytics` el orden de efectos queda:

1. `initGa4()`
2. `captureUtmFromUrl()`
3. `trackPageView()`
4. `trackAiReferral({ path: pathname })`

Como el page_view de la ruta ya se envió, `trackEvent` no lo repite. El efecto depende de `[pathname, searchParams]`, igual que el de pageviews, así que también detecta una landing interna abierta directamente con `?utm_source=chatgpt`.

## Verificación

- `git diff --check` → sin errores.
- Lectura del flujo: `ensureGa4()` es idempotente; `sendPageViewHit` actualiza `__pbLastPageViewKey`; `trackPageView` y `ensurePageViewBeforeHit` comparan esa clave antes de enviar. No hay ruta que emita dos `page_view`.
- `ai_referral` se marca como enviado antes de `trackEvent`; `sessionStorage` es por pestaña y el flag en memoria evita duplicados si el storage falla.
- No se modificaron nombres, firmas ni parámetros de los eventos existentes (`page_view`, `view_curso`, `generate_lead`, `click_whatsapp`, `quiz_complete`, etc.).

## Cómo probar

Detalle completo en `ANALYTICS.md` → «Tráfico desde asistentes IA».

1. `http://localhost:3000/?utm_source=chatgpt` en pestaña nueva → consola `[analytics] ai_referral` con `ai_source: "chatgpt"`, `referrer_host: "(direct)"`, `landing_path: "/"`.
2. Referrer simulado `https://chatgpt.com/c/123` con Requestly/ModHeader o Playwright (`page.goto(url, { referer })`) → `referrer_host: "chatgpt.com"`.
3. Navegar entre rutas: no debe salir un segundo `ai_referral`; sí debe salir un `page_view` por ruta.
4. Repetir: `sessionStorage.removeItem("pb_ai_referral")` y recargar.
5. Tras deploy: GA4 → Admin → DebugView, entrar desde un enlace real de ChatGPT/Perplexity y confirmar el evento y la user property.

## TODO_MANU

- [ ] Decidir si `ai_referral` se marca como **evento clave** en GA4 (Admin → Events → Mark as key event). Recomendación: no marcarlo; es diagnóstico de canal, no una conversión. Si se marca, hacerlo solo después de ver volumen real.
- [ ] Crear el grupo de canales «Asistentes IA» (Admin → Data display → Channel groups → Create new channel group; condición Session source matches regex `chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai|grok\.com`, canal por encima de `Referral`).
- [ ] Crear la dimensión personalizada user-scoped `ai_source` (Admin → Custom definitions → Create custom dimension, scope User). No es retroactiva.
- [ ] Validar en DebugView tras deploy con un referrer real de ChatGPT/Perplexity y revisar a los 7–14 días si el volumen justifica una exploration propia.
