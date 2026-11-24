# Reporte de Indexación de Países y Sitemap (`feat/indexacion-paises-sitemap`)

Fecha de verificación: 2026-11-24  
Rama verificada: `feat/indexacion-paises-sitemap`  
Servidor auditado: `npx next start -p 3199` (build de producción, `1770` páginas estáticas/SSG)

---

## 1. Comparativa del Sitemap (`/sitemap.xml`)

- **URLs antes:** `654`
- **URLs después:** `959` (`+305` URLs)
- **Estado HTTP en vivo (`959/959`):** `200 OK`, `0` fallos/404/redirecciones, `0` `noindex`, `0` discrepancias de `canonical`.
- **Archivos excluidos:** `0` `.csv`/`.xlsx`, `0` rutas `/brochure`.

### Desglose por prefijo de país

| Prefijo | Cantidad de URLs |
| --- | ---: |
| `cl (raíz)` | 383 |
| `mx` | 43 |
| `co` | 43 |
| `pe` | 42 |
| `ar` | 40 |
| `py` | 39 |
| `uy` | 39 |
| `es` | 29 |
| `bo` | 28 |
| `cr` | 28 |
| `do` | 28 |
| `ec` | 28 |
| `gt` | 28 |
| `sv` | 28 |
| `ve` | 28 |
| `us` | 27 |
| `hn` | 26 |
| `ni` | 26 |
| `pa` | 26 |
| **Total** | **959** |

### Desglose por sección

| Sección | Cantidad de URLs |
| --- | ---: |
| `/cursos` (catálogo raíz y por país) | 304 |
| `/datos` (observatorio, carreras, 23 fichas de instituciones + índice = 24) | 222 |
| `/guias` (raíz, guías de Chile/transversales/locales y hubs `/{pais}/guias`) | 198 |
| `landings` (landings comerciales, `/us/miami`, etc.) | 93 |
| `institucionales` (`/empresas`, `/precios`, `/nosotros`, `/test-nivel`, `/preguntas-frecuentes`, `/profesores`, `/referidos`, `/glosario`, legales) | 91 |
| `home` (`/` + 18 portadas de país) | 19 |
| `/blog` (`/blog` + 10 posts publicados) | 11 |
| `/casos` (`/casos` + 8 fichas `/casos/*`) | 9 |
| `comparativas` (`/versus` y comparativas) | 9 |
| `/empleos` (`/empleos`, `/empleos/talento`, `/empleos/para-empresas`) | 3 |
| **Total** | **959** |

---

## 2. Tabla de Locales en `hreflang`

El clúster completo de portada (`/` y homólogos) declara **20** entradas recíprocas (`0` asimetrías `A → B` sin `B → A` en todo el sitemap; `0` targets con `noindex` o `404`):

| Locale `hreflang` | Prefijo / Ruta raíz | Estado en `hreflang` |
| --- | --- | --- |
| `x-default` | `/` | Activo |
| `es-CL` | `/` | Activo (recíproco) |
| `es-AR` | `/ar` | Activo (recíproco) |
| `es-BO` | `/bo` | Activo (recíproco) |
| `es-CO` | `/co` | Activo (recíproco) |
| `es-CR` | `/cr` | Activo (recíproco) |
| `es-DO` | `/do` | Activo (recíproco) |
| `es-EC` | `/ec` | Activo (recíproco) |
| `es-ES` | `/es` | Activo (recíproco) |
| `es-GT` | `/gt` | Activo (recíproco) |
| `es-HN` | `/hn` | Activo (recíproco) |
| `es-MX` | `/mx` | Activo (recíproco) |
| `es-NI` | `/ni` | Activo (recíproco) |
| `es-PA` | `/pa` | Activo (recíproco) |
| `es-PE` | `/pe` | Activo (recíproco) |
| `es-PY` | `/py` | Activo (recíproco, nuevo) |
| `es-SV` | `/sv` | Activo (recíproco) |
| `es-US` | `/us` | Activo (recíproco, nuevo) |
| `es-UY` | `/uy` | Activo (recíproco) |
| `es-VE` | `/ve` | Activo (recíproco) |

---

## 3. Checklist de Verificación (12 puntos)

| # | Verificación | Cumple | Evidencia observada |
| --- | --- | --- | --- |
| 1 | `npx tsc --noEmit` con 0 errores | Sí | Exit `0` sin errores tras el ajuste en `components/guias/GuiasHub.tsx`. |
| 2 | `npx eslint` sobre los 15 archivos de código con 0 errores | Sí | Exit `0`, `0` errores (`1` warning preexistente en `config/paises.ts`). |
| 3 | `npm run build` exitoso sin rutas `ƒ` dinámicas innecesarias | Sí | Exit `0`, `1770` páginas estáticas/SSG generadas. |
| 4 | Sitemap incluye instituciones, `/py`, `/us` + `/us/guias`, hubs `hn/ni/pa`, `/casos/*`, `/blog/*`, `/empleos*` | Sí | `959` URLs totales (`24` rutas de instituciones, `39` `/py`, `27` `/us`, `8` `/casos/*`, `10` `/blog/*`, `3` `/empleos*`, hubs `us/hn/ni/pa/guias`). |
| 5 | `0` URLs del sitemap con `noindex`, `404`, redirect o canonical distinto | Sí | Verificadas `959/959` en vivo contra `localhost:3199` (`0` fallos, `0` `noindex`, `0` canonical mismatch). |
| 6 | `0` `.csv`/`.xlsx` ni `/brochure` en el sitemap | Sí | `0` coincidencias en `/sitemap.xml`. |
| 7 | Clusters `hreflang` recíprocos con `es-PY` y `es-US` | Sí | `20` locales en raíz; `0` enlaces no recíprocos y `0` destinos `noindex`/`404`. |
| 8 | Señales EE.UU. y precios USD sin tachado (`/us`, `/us/cursos/power-bi`, `/us/precios`, `/us/miami`) | Sí | Todas `200` e `index`, español en vivo, USD `249`/`498` sin `line-through`; horarios `17:30–19:30 ET`, `16:30–18:30 CT`, `14:30–16:30 PT` en `/us`, `/us/precios` y `/us/miami`. |
| 9 | Hubs `/us/guias`, `/hn/guias`, `/ni/guias`, `/pa/guias` operativos | Sí | `200`, `index`, canonical propio, `89` enlaces internos cada uno y `0` enlaces rotos. |
| 10 | HTML SSR de `/guias` y `/casos` enlaza todas las fichas indexables | Sí | `/guias` enlaza `75/75` guías de Chile del sitemap; `/casos` enlaza `8/8` fichas `/casos/*`. |
| 11 | Redirect `301` `/versus/desafio-latam-vs-programbi` y `X-Robots-Tag` en CSV/XLSX | Sí | `301 → /versus` (`/versus` `200`); `HEAD`/`GET` en los 4 CSV/XLSX devuelve `X-Robots-Tag: noindex, nofollow` y `/datos/desempleo` no lo lleva. |
| 12 | Exclusiones (`brochure`, `/login`, `/registro`, `/pago`, `/admin`) y `/robots.txt` | Sí | Las 7 rutas excluidas devuelven `noindex` (o `307` con `X-Robots-Tag: noindex, nofollow` en `/admin`) y están fuera del sitemap; `/robots.txt` conserva sus `Disallow`. |

---

## 4. Qué no se tocó

- `data/` (verificado con `git diff origin/main -- data/` vacío).
- `config/pricing.ts` (precios de Chile intactos).
- Archivos exclusivos de ramas hermanas (datos/analytics/embudo GA4).
- Páginas de `/brochure`, `/login`, `/registro`, `/pago`, `/admin` y reglas de `app/robots.ts` (se mantienen excluidas).
- No se realizó merge a `main` ni `git push`.
