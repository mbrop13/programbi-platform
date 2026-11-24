# Reporte de Verificación — Embudo, SEO, GEO y Conversión (`feat/embudo-seo-geo-conversion`)

**Fecha:** 2026-11-24  
**Rama:** `feat/embudo-seo-geo-conversion`  
**Alcance:** Verificación técnica (`build-guias`, `verificar-guias`, `verificar-guias-paso-a-paso`, `seo.test.ts`, `tsc`, `eslint`, `next build`) y verificación en vivo con Playwright + `fetch` contra `next start -p 3199`.

---

## 1. Eventos GA4 (`window.dataLayer`)

### Eventos verificados en vivo y en código (`lib/analytics/marketing.ts`)

| Acción | Evento disparado | Parámetros verificados | Qué se dejó de disparar |
| :--- | :--- | :--- | :--- |
| Clic en WhatsApp desde ficha de curso (`/cursos/power-bi`) | `click_whatsapp` | `cta_position: "curso_ayuda"`, `cta_location: "curso_ayuda"`, `wa_location: "curso_ayuda"`, `course_slug: "power-bi"`, `page_type: "curso"`, `country: "cl"` (nunca `undefined`) | Ya **no** se dispara `generate_lead` acoplado al clic de WhatsApp (`hasGenerateLead: false`) |
| Clic en WhatsApp desde guía (`/guias/notebooklm-que-es-y-como-usarlo`) | `click_whatsapp` | `cta_position: "guia_cta"`, `cta_location: "guia_cta"`, `wa_location: "guia_cta"`, `guide_slug: "notebooklm-que-es-y-como-usarlo"`, `course_slug: "gemini"`, `page_type: "guia"` | Ya **no** se dispara `generate_lead` acoplado al clic de WhatsApp (`hasGenerateLead: false`) |
| Vista de ficha `/cursos/power-bi` | `view_item` | `currency: "CLP"`, `value: 169000`, `items: [{ item_id: "power-bi", item_name: "Power BI", quantity: 1, price: 169000 }]` (Array de objetos, NO string) | — |
| Vista de ficha `/cursos/analisis-de-datos` | `view_item` | `currency: "CLP"`, `value: 338000`, `items: [{ item_id: "analisis-de-datos", item_name: "Análisis de Datos", quantity: 1, price: 338000 }]` (Array de objetos, NO string) | — |
| Inicio de checkout en `/pago` (`trackCheckoutStart` en `PagoClient.tsx` / `marketing.ts`) | `checkout_start` + `begin_checkout` | `items` construido como `Array` de `AnalyticsEcommerceItem` (`item_id`, `item_name`, `price`, `quantity`), `currency`, `value`, `course_slugs`, `pais` | — |
| Envío de registro (`trackSubmitRegistro` en `marketing.ts`) | `submit_registro` + `sign_up` | `method`, `form_name`, `course_slug`, `transport_type: "beacon"` | Ya **no** emite `generate_lead` (reservado para leads reales) |
| Envío de lead / webinar (`trackLeadSubmit`, `trackWebinarSignup`) | `lead_submit` / `webinar_signup` + `generate_lead` | `method: "form"`, `form_name`, `lead_type`, `lead_source`, `course_slug`, `country` | — |
| Vista de páginas `/datos`, `/profesores/manuel-oliva`, `/casos`, `/nosotros` | `page_view` | `page_type` = `"datos"`, `"profesor"`, `"casos"`, `"nosotros"` respectivamente (nunca `"otro"`) | — |

---

## 2. Enlaces de cuerpo en guías (Tabla 5.1)

Verificados en el HTML renderizado dentro del cuerpo del artículo (fuera de `header`, `footer`, `nav` y botones de CTA laterales):

| URL origen | Ancla en cuerpo | Destino | Enlaces de cuerpo a `/cursos/*` |
| :--- | :--- | :--- | :---: |
| `/guias/notebooklm-que-es-y-como-usarlo` | `curso de Gemini en vivo` | `/cursos/gemini` | 2 |
| `/guias/notebooklm-que-es-y-como-usarlo` | `curso de análisis de datos` | `/cursos/analisis-de-datos` | 2 |
| `/guias/liquidacion-de-sueldo-en-excel-chile` | `curso de Excel en vivo` | `/cursos/excel` | 1 |
| `/guias/control-de-ventas-en-excel` | `curso de Excel en vivo` | `/cursos/excel` | 2 |
| `/guias/control-de-ventas-en-excel` | `curso de Power BI en vivo` | `/cursos/power-bi` | 2 |
| `/guias/ia-para-power-bi-dax` | `curso de Power BI en vivo` | `/cursos/power-bi` | 1 |
| `/guias/licencias-power-bi-precio-chile` | `curso de Power BI en vivo` | `/cursos/power-bi` | 1 |
| `/guias/power-bi-vs-excel` | `curso de Excel` / `curso de Power BI` / `curso de análisis de datos` | `/cursos/excel`, `/cursos/power-bi`, `/cursos/analisis-de-datos` | 3 *(en bloque comparativo previo a `<!-- CTA-END -->`, donde se actualizó el ancla a `curso de análisis de datos`)* |

---

## 3. Fichas de Claude por país (`[data-testid="bloque-pais-ficha"]`)

Verificación en vivo sobre los 9 mercados solicitados. En todos los casos, los párrafos propios de la ficha (`parrafosFicha`) y el bloque de caso (`caso: null` para cursos IA) tienen **0 menciones** a `Power BI`, `medidas`, `tablero`, `conectar la fuente`, `DAX` o `modelo estrella` (las únicas apariciones del texto "Power BI" dentro de la sección corresponden al bloque genérico de FAQs de precios del país o a enlaces laterales a otras guías del mismo mercado, no al contenido de Claude).

| País | Ruta | HTTP | ¿Reescrita / propia para IA? | ¿Mención de Power BI en contenido de Claude? | Notas verificadas |
| :--- | :--- | :---: | :---: | :---: | :--- |
| Chile | `/cursos/claude` | 200 | Sí | No (0 menciones) | `meta description`: 142 chars |
| Perú | `/pe/cursos/claude` | 200 | Sí | No (0 menciones) | `meta description`: 141 chars |
| México | `/mx/cursos/claude` | 200 | Sí | No (0 menciones) | `meta description`: 143 chars |
| Colombia | `/co/cursos/claude` | 200 | Sí | No (0 menciones) | `meta description`: 145 chars |
| Argentina | `/ar/cursos/claude` | 200 | Sí | No (0 menciones) | `meta description`: 146 chars |
| Uruguay | `/uy/cursos/claude` | 200 | Sí | No (0 menciones) | `meta description`: 144 chars |
| Estados Unidos | `/us/cursos/claude` | 200 | Sí | No (0 menciones) | `noindex, follow`, `meta description`: 151 chars |
| España | `/es/cursos/claude` | 200 | Sí | No (0 menciones) | Mantiene **RGPD / LOPDGDD** (`hasRgpd: true`), `meta description`: 143 chars |
| República Dominicana | `/do/cursos/claude` | 200 | Sí | No (0 menciones) | `meta description`: **152 chars** (rango 140–155), `index, follow` |

---

## 4. Estado de `/us`

- `/us/cursos/claude` responde **HTTP 200**.
- Meta robots: **`noindex, follow`**.
- **Ausente** en `/sitemap.xml` (`inSitemap: false`).
- **Ausente** en etiquetas `<link rel="alternate" hreflang="...">` de todos los países indexados (`hasUsHreflang: false`).

---

## 5. GEO, Schema JSON-LD, `robots.txt` y `llms.txt`

### Nodos `Person` unificados
- `https://www.programbi.com/#person-manuel-oliva` (verificado en `/`, `/profesores`, `/profesores/manuel-oliva`, `/cursos/power-bi`, `/cursos/claude` con `sameAs`, `worksFor` e `image`).
- `https://www.programbi.com/#person-emanuel-berrocal` (verificado en `/profesores`).
- `https://www.programbi.com/#person-rodrigo-vega` (verificado en `/profesores`, sin `?trk=org-employees`).

### Validaciones Schema / GEO
- **0** nodos `LocalBusiness` en todas las rutas inspeccionadas.
- **0** nodos `AggregateRating` ni `Review` inventados.
- `Organization.knowsAbout` incluye `Claude`, `ChatGPT` y `Gemini`.
- `[data-testid="course-summary-box"]` visible en `/cursos/power-bi`, `/cursos/claude`, `/cursos/chatgpt` y `/cursos/gemini`; `/cursos/claude` sin bloque de testimonios inventado.
- `/robots.txt`: incluye `Claude-SearchBot` y `Claude-User` con `Allow: /`, mantiene bloqueados `Bytespider`, `PetalBot` y `MJ12bot`, e incluye `Sitemap: https://www.programbi.com/sitemap.xml`.
- `/llms.txt` y `/llms-full.txt`: **200 OK**, incluyen `Claude`, `ChatGPT` y `Gemini`, sin atribuir Power BI a Claude.

---

## 6. Resumen de pruebas técnicas

| Comprobación | Resultado | Detalle |
| :--- | :---: | :--- |
| `node scripts/build-guias.mjs` | **OK (exit 0)** | 129 guías publicadas, 2 omitidas, 0 avisos; regeneró `lib/guias/generado.ts` |
| `node scripts/build-guias.mjs --check` | **OK (exit 0)** | `lib/guias/generado.ts` al día (129 guías) |
| `node scripts/verificar-guias.mjs` | **OK (exit 0)** | Peor par 10.5% (límite 30%), peor variante `guias/*.md` 29.0% (376 pares) |
| `node scripts/verificar-guias-paso-a-paso.mjs` | **OK (exit 0)** | 0 errores estructurales/SEO, 0 avisos (8/99 URLs externas externas con 404/403/timeout propias de sitios de terceros) |
| `npx tsx --test tests/datos/seo.test.ts` | **OK (exit 0)** | 6 / 6 tests pasando |
| `npx tsc --noEmit` | **OK (exit 0)** | 0 errores |
| `npx eslint ...` (14 archivos de la rama) | **OK (exit 0)** | 0 errores (13 warnings preexistentes) |
| `npm run build` | **OK (exit 0)** | Build de producción completo; `/cursos/[slug]`, `/guias/[slug]`, `/profesores`, `/casos`, `/nosotros`, `/datos`, `/robots.txt`, `/llms.txt`, `/llms-full.txt` estáticos/SSG (`○` / `●`) |
| `git diff origin/main -- data/` | **Vacío** | Sin cambios en `data/` |
| `git diff --name-only origin/main` | **Sin solapes** | Solo los 20 archivos de la rama + `lib/guias/generado.ts` y `REPORTE_EMBUDO_SEO_GEO.md` |
