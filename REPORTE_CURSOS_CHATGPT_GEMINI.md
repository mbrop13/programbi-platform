# Reporte de Verificación: Cursos de ChatGPT y Gemini

**Rama**: `feat/cursos-chatgpt-gemini`  
**Fecha**: 2026-11-23  
**Verificador**: `verificador-cursos`

---

## 1. Resumen Ejecutivo

- **`git diff origin/main -- data/`**: Vacío (0 modificaciones en `data/`).
- **Scripts de validación**:
  - `scripts/check-paises.mjs` y `scripts/verificar-brochure-v2.mjs` actualizados con `"chatgpt"` y `"gemini"`.
  - `node scripts/build-guias.mjs` y `--check`: OK (`129 guías publicadas, 2 omitidas, 0 avisos`).
  - `node scripts/verificar-guias.mjs`: OK (peor par `10.5%` en `guias/es.md` vs otros países, y `29.0%` en `guias/*.md`, ambos `< 30%`).
  - `node scripts/verificar-guias-paso-a-paso.mjs`: OK (`0` errores estructurales/SEO, `0` avisos, peor solapamiento `0.69%`).
- **Lint y TypeScript**:
  - `npx eslint` sobre los archivos modificados/creados en la rama: `0` errores en código de la rama (1 error preexistente en `components/guias/GuiaEditorialPrimitives.tsx:44`, sin modificar en esta rama; 3 warnings preexistentes en `CourseDetailClient.tsx`).
  - `npx tsc --noEmit`: OK (`0` errores tras corregir el narrowing en `config/pricing.ts:114`).
- **Build Next.js 16**: `npm run build` (`next build --webpack`) completado con éxito (`1767/1767` páginas estáticas generadas).

---

## 2. Tabla de Conteos SEO (`title`, `meta`, `H1`, `OG/Twitter`)

Todas las rutas de curso (`19` mercados × `2` cursos = `38` páginas) y las `8` guías nuevas cumplen `title <= 60`, `140 <= description <= 155`, H1 esperado y sincronización OG/Twitter:

| Ruta | `title` | `meta` | H1 | OG/Twitter |
|---|---:|---:|---|---|
| `/cursos/chatgpt` | 57 | 145 | Curso de ChatGPT en vivo en Chile | OK |
| `/cursos/gemini` | 56 | 145 | Curso de Gemini en vivo en Chile | OK |
| `/ar/cursos/chatgpt` | 49 | 149 | Curso de ChatGPT en vivo en Argentina | OK |
| `/ar/cursos/gemini` | 60 | 149 | Curso de Gemini en vivo en Argentina | OK |
| `/bo/cursos/chatgpt` | 59 | 147 | Curso de ChatGPT en vivo en Bolivia | OK |
| `/bo/cursos/gemini` | 58 | 147 | Curso de Gemini en vivo en Bolivia | OK |
| `/co/cursos/chatgpt` | 60 | 148 | Curso de ChatGPT en vivo en Colombia | OK |
| `/co/cursos/gemini` | 59 | 148 | Curso de Gemini en vivo en Colombia | OK |
| `/cr/cursos/chatgpt` | 50 | 150 | Curso de ChatGPT en vivo en Costa Rica | OK |
| `/cr/cursos/gemini` | 49 | 150 | Curso de Gemini en vivo en Costa Rica | OK |
| `/ec/cursos/chatgpt` | 59 | 147 | Curso de ChatGPT en vivo en Ecuador | OK |
| `/ec/cursos/gemini` | 58 | 147 | Curso de Gemini en vivo en Ecuador | OK |
| `/sv/cursos/chatgpt` | 51 | 151 | Curso de ChatGPT en vivo en El Salvador | OK |
| `/sv/cursos/gemini` | 50 | 151 | Curso de Gemini en vivo en El Salvador | OK |
| `/us/cursos/chatgpt` | 54 | 154 | Curso de ChatGPT en vivo en Estados Unidos | OK |
| `/us/cursos/gemini` | 53 | 154 | Curso de Gemini en vivo en Estados Unidos | OK |
| `/es/cursos/chatgpt` | 58 | 146 | Curso de ChatGPT en vivo en España | OK |
| `/es/cursos/gemini` | 57 | 146 | Curso de Gemini en vivo en España | OK |
| `/gt/cursos/chatgpt` | 49 | 149 | Curso de ChatGPT en vivo en Guatemala | OK |
| `/gt/cursos/gemini` | 60 | 149 | Curso de Gemini en vivo en Guatemala | OK |
| `/hn/cursos/chatgpt` | 60 | 148 | Curso de ChatGPT en vivo en Honduras | OK |
| `/hn/cursos/gemini` | 59 | 148 | Curso de Gemini en vivo en Honduras | OK |
| `/mx/cursos/chatgpt` | 58 | 146 | Curso de ChatGPT en vivo en México | OK |
| `/mx/cursos/gemini` | 57 | 146 | Curso de Gemini en vivo en México | OK |
| `/ni/cursos/chatgpt` | 49 | 149 | Curso de ChatGPT en vivo en Nicaragua | OK |
| `/ni/cursos/gemini` | 60 | 149 | Curso de Gemini en vivo en Nicaragua | OK |
| `/pa/cursos/chatgpt` | 58 | 146 | Curso de ChatGPT en vivo en Panamá | OK |
| `/pa/cursos/gemini` | 57 | 146 | Curso de Gemini en vivo en Panamá | OK |
| `/py/cursos/chatgpt` | 60 | 148 | Curso de ChatGPT en vivo en Paraguay | OK |
| `/py/cursos/gemini` | 59 | 148 | Curso de Gemini en vivo en Paraguay | OK |
| `/pe/cursos/chatgpt` | 56 | 144 | Curso de ChatGPT en vivo en Perú | OK |
| `/pe/cursos/gemini` | 55 | 144 | Curso de Gemini en vivo en Perú | OK |
| `/do/cursos/chatgpt` | 55 | 155 | Curso de ChatGPT en vivo en República Dominicana | OK |
| `/do/cursos/gemini` | 54 | 155 | Curso de Gemini en vivo en República Dominicana | OK |
| `/uy/cursos/chatgpt` | 59 | 147 | Curso de ChatGPT en vivo en Uruguay | OK |
| `/uy/cursos/gemini` | 58 | 147 | Curso de Gemini en vivo en Uruguay | OK |
| `/ve/cursos/chatgpt` | 49 | 149 | Curso de ChatGPT en vivo en Venezuela | OK |
| `/ve/cursos/gemini` | 60 | 149 | Curso de Gemini en vivo en Venezuela | OK |
| `/guias/curso-chatgpt-chile` | 57 | 141 | Cómo usar ChatGPT para trabajo administrativo y análisis en Chile | OK |
| `/co/guias/curso-chatgpt-colombia` | 60 | 144 | Cómo aprovechar ChatGPT en oficinas y análisis de datos en Colombia | OK |
| `/mx/guias/curso-chatgpt-mexico` | 58 | 142 | ChatGPT aplicado al trabajo diario y análisis de datos en México | OK |
| `/pe/guias/curso-chatgpt-peru` | 56 | 140 | Guía práctica de ChatGPT para oficinas y análisis en Perú | OK |
| `/guias/curso-gemini-chile` | 52 | 145 | Cómo usar Gemini en Google Workspace para trabajar mejor en Chile | OK |
| `/co/guias/curso-gemini-colombia` | 55 | 148 | Gemini en Google Workspace: guía práctica para equipos en Colombia | OK |
| `/mx/guias/curso-gemini-mexico` | 53 | 146 | Gemini en Google Workspace: guía práctica para trabajar en México | OK |
| `/pe/guias/curso-gemini-peru` | 51 | 144 | Guía de Gemini para Google Workspace y análisis de documentos en Perú | OK |

---

## 3. Tabla Comparativa de Precios (`Offer` JSON-LD en 19 mercados)

En `config/pricing.ts`, `chatgpt` y `gemini` delegan directamente al precio de catálogo de `claude` en todos los mercados. En los 8 mercados principales (`cl`, `ar`, `co`, `mx`, `pe`, `es`, `us`, `py`) el `Offer` en JSON-LD es 100 % idéntico. En los 11 mercados secundarios (`bo`, `cr`, `ec`, `sv`, `gt`, `hn`, `ni`, `pa`, `do`, `uy`, `ve`), Supabase tiene una promoción `specific_course` activa para `target_id = "claude"`, por lo que `claude` refleja el precio promocional de DB mientras `chatgpt` y `gemini` reflejan el precio de catálogo exacto de `config/paises.ts`:

| País | `chatgpt` | `gemini` | `claude` | Estado |
|---|---:|---:|---:|---|
| `cl` | 169000 CLP | 169000 CLP | 169000 CLP | Idéntico |
| `ar` | 211000 ARS | 211000 ARS | 211000 ARS | Idéntico |
| `bo` | 139 USD | 139 USD | 119 USD | Catálogo igual; promo DB en `claude` |
| `co` | 426000 COP | 426000 COP | 426000 COP | Idéntico |
| `cr` | 169 USD | 169 USD | 144 USD | Catálogo igual; promo DB en `claude` |
| `ec` | 149 USD | 149 USD | 127 USD | Catálogo igual; promo DB en `claude` |
| `sv` | 149 USD | 149 USD | 127 USD | Catálogo igual; promo DB en `claude` |
| `us` | 249 USD | 249 USD | 249 USD | Idéntico |
| `es` | 249 USD | 249 USD | 249 USD | Idéntico |
| `gt` | 149 USD | 149 USD | 127 USD | Catálogo igual; promo DB en `claude` |
| `hn` | 139 USD | 139 USD | 119 USD | Catálogo igual; promo DB en `claude` |
| `mx` | 2570 MXN | 2570 MXN | 2570 MXN | Idéntico |
| `ni` | 129 USD | 129 USD | 119 USD | Catálogo igual; promo DB en `claude` |
| `pa` | 169 USD | 169 USD | 144 USD | Catálogo igual; promo DB en `claude` |
| `py` | 127 USD | 127 USD | 127 USD | Idéntico |
| `pe` | 439 PEN | 439 PEN | 439 PEN | Idéntico |
| `do` | 159 USD | 159 USD | 135 USD | Catálogo igual; promo DB en `claude` |
| `uy` | 5990 UYU | 5990 UYU | 5904 UYU | Catálogo igual; promo DB en `claude` |
| `ve` | 129 USD | 129 USD | 119 USD | Catálogo igual; promo DB en `claude` |

---

## 4. Verificación de los 12 Criterios de Aceptación

| Criterio | Resultado | Detalle |
|---|---|---|
| **1. Rutas HTTP 200** | PASS | 38/38 rutas de curso, 38/38 `/brochure` y 8/8 guías nuevas respondieron HTTP 200. |
| **2. Meta, Title, H1, OG** | PASS | 100 % cumple `title <= 60`, `140 <= meta <= 155`, H1 y sincronización OG/Twitter. |
| **3. Precios vs Claude** | PASS (con nota) | Catálogo 100 % idéntico en `config/pricing.ts`. Mercados principales idénticos en runtime; 11 secundarios tienen promo DB `specific_course` solo para `claude`. |
| **4. JSON-LD** | PASS | `Course`, `Offer`, `FAQPage`, `BreadcrumbList` presentes; 0 `aggregateRating`/`review`. |
| **5. Canonical, Hreflang, Sitemap** | PASS | Canonical autorreferente, hreflang recíproco igual a `claude`, `/brochure` con `noindex, follow` y fuera de `/sitemap.xml`, fichas y 8 guías presentes en `/sitemap.xml`. |
| **6. Temario y bloque local** | PASS | 5 módulos / 10 sesiones con objetivo y entregable; bloque local sin `Power BI`, `tablero` ni `DAX`. |
| **7. Términos prohibidos** | PASS | 0 menciones a `GPT-5`, `GPT-6`, `Gemini 3`, `Gemini 4` o `brochure` visible; `canvas`/`GPTs personalizados`/`Gems` únicamente en contexto de retiro/reemplazo o "Sheets canvas". |
| **8. CTA WhatsApp y Form** | PASS | Playwright verificó `[ref:chatgpt]`, `[ref:gemini]` y formulario «Temario y precios». |
| **9. Guías §10, /cursos, llms** | PASS | 10/10 guías (incluyendo `/guias/claude-vs-chatgpt-analisis-de-datos`) HTTP 200 con CTA enlazado; `/cursos` en orden IA exacto (`copilot`, `claude`, `chatgpt`, `gemini`, `ia-productividad`); `/llms.txt` y `/llms-full.txt` actualizados. |
| **10. Mobile 375px y Consola** | PASS | `scrollWidth === innerWidth` (`375 === 375` y `1440 === 1440`), `0` errores React/JS (`pageErrors: []`; solo 404 esperados de `/_vercel/insights` en `next start` local). |
| **11. Imágenes OG y Cards** | PASS | HTTP 200 en `/og?...` de cursos y 8 guías, y en `/images/courses/{chatgpt,gemini}-card.webp` y `.jpg`. |
| **12. Diff cursos existentes** | PASS | `git diff origin/main -- "lib/seo/money.ts" "lib/data/courses.ts"` confirma que `claude`, `ia-productividad` y `copilot` no fueron alterados. |
