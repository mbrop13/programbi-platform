# Auditoría Pre-Producción e Integración Multi-País (PE, CO, MX, AR)

- **Rama de integración:** `feat/latam-datos-integracion` (creada desde `main` `6eef724`)
- **Ramas individuales preservadas:** `feat/pe-datos-carreras-excel` (`d2ca6b6`), `feat/colombia-paginas` (`ca002d2`), `feat/mx-excel-laboral-carreras` (`7009053`), `feat/ar-datos-aguinaldo-carreras` (`6a7661d`)
- **Veredicto:** **GO** para mergear `feat/latam-datos-integracion` a `main` y desplegar a producción (pendiente de aprobación explícita de Manu; no se realizó merge ni deploy).

---

## 1. Resumen de cobertura por país

| Mercado | URLs HTML nuevas | Fichas de carreras | Guías Excel + `.xlsx` | CSVs `noindex` | Estado |
|---|---:|---:|---:|---:|---|
| **Perú (`/pe`)** | 47 | 38 (22 univ + 16 téc) | 5 | 1 | Cumple 100 % |
| **Colombia (`/co`)** | 369 | 354 (`sugerido_ficha`) | 5 | 4 | Cumple 100 % |
| **México (`/mx`)** | 82 | 75 (4 excluidas: 513/610/621/420) | 4 | 1 | Cumple 100 % |
| **Argentina (`/ar`)** | 8 | 0 (sin `diccionario-araucano.xlsx`) | 1 | 3 | Cumple 100 % |
| **Total LatAm** | **506** | **467** | **15** | **9** | **506 / 506 OK** |

---

## 2. Hallazgos reales detectados y corregidos antes de producción

1. **Integración de 31 archivos compartidos:** Las 4 ramas partieron independientemente de `main`. Se unificaron en `feat/latam-datos-integracion` sin pérdida de cambios:
   - 6 rutas dispatcher bajo `app/(pais)/[pais]/datos/` con 18 módulos extraídos en `components/datos-{pe,co,mx,ar}/pages/`.
   - Tabla única recíproca `lib/seo/datos-hreflang.ts` (`x-default` = Chile, `es-CL`, `es-PE`, `es-CO`, `es-MX`, `es-AR`) con validación contra datasets publicables.
   - `app/sitemap.ts` unificado con las **506 URLs HTML nuevas**, `lastmod` reales y `alternatesSitemapDatosDe`.
   - `lib/leads-magnet.ts` (15 `.xlsx`), `PlantillaDescarga.tsx`, `RecursosRelacionadosCurso.tsx`, `GuiaPasoAPasoLayout/CursoCard/StickyWa`, `GuiasDelCurso.tsx`, `CursosPageClient.tsx`, `CourseDetailClient.tsx`, `IndicePais.tsx`, `FaqContenido.tsx`, `Footer.tsx`, `next.config.ts` y `vercel.json`.
2. **PE — 5 guías Excel sin cablear en rutas de Next.js:** Se conectaron `GUIAS_PASO_A_PASO_PE` en `app/(pais)/[pais]/guias/page.tsx` y `app/(pais)/[pais]/guias/[slug]/page.tsx` (evitando 404 en `/pe/guias/*` y añadiendo enlaces de compra a `/pe/cursos/power-bi`).
3. **PE — H1 de `/pe/cursos/power-bi`:** Se agregó `h1Override = "Curso de Power BI en Perú"` en `app/(marketing)/cursos/[slug]/page.tsx`.
4. **AR — Ancla `#precios` faltante:** Se añadió `<span id="precios" className="scroll-mt-24" aria-hidden="true" />` en `app/(marketing)/cursos/[slug]/CourseDetailClient.tsx` para el enlace `/ar/cursos/power-bi#precios` desde `/ar/preguntas-frecuentes`.
5. **CL — Hreflang recíproco en `/datos/inflacion`:** Se conectó `es-CO` y `es-AR` en `lib/seo/datos-hreflang.ts` (consumido automáticamente por `metadataSimpleDatos` en `app/(datos-publicos)/datos/inflacion/page.tsx`).
6. **CO — Directorio SSR completo de 354 fichas en `/co/datos/carreras`:** `TablaCarrerasCo` pagina en cliente, por lo que ~304 fichas no salían en el HTML inicial. Se agregó un `<details>` SSR en `components/datos-co/pages/CarrerasCoPage.tsx` con las 354 fichas enlazadas (`0` huérfanas).
7. **MX — `hreflangDatosDe` faltante en `/mx/datos/carreras`:** `components/datos-mx/pages/CarrerasMxPage.tsx` no pasaba `hreflangDatosDe("/mx/datos/carreras")` a `buildLanguagesMx(...)`. Corregido para reciprocidad 100 % con CL/PE/CO/AR.

---

## 3. Resultados de verificaciones pesadas

| Verificación | Alcance | Resultado |
|---|---|---|
| `npx tsc --noEmit` | Proyecto completo | **Exit 0** (0 errores) |
| `npx eslint` | Archivos unificados y corregidos | **0 errores** |
| Suite unitaria (`npx tsx --test`) | `seo.test.ts`, `carreras-pe.test.ts`, `colombia.test.ts`, `mexico.test.ts`, `argentina.test.ts` | **27 / 27 pass** |
| Validadores de guías | `build-guias.mjs --check` y `verificar-guias-paso-a-paso.mjs --no-net` | **0 errores, 0 avisos** |
| Idempotencia de builders | `build-carreras-pe`, `build-datos-co`, `build-datos-mx`, `build-datos-ar` | **100 % idempotentes** |
| Validación `.xlsx` (`exceljs`) | Las **15 plantillas** (`5 PE + 5 CO + 4 MX + 1 AR`) | **15 / 15 OK** (hoja `Parametros`, fórmulas vivas, 0 errores) |
| `npm run build` | Build de producción Next.js 16.2.10 | **Exit 0** — 2.276 rutas estáticas/ISR (`●` / `● 1d`), 0 `ƒ` nuevas |
| Auditoría HTTP SSR (`next start`) | **585 páginas HTML** (506 nuevas + 35 modificadas + 44 CL recíprocas), **24 descargas** (9 CSV + 15 XLSX), 404 excluidas, `/sitemap.xml` | **`FAILURES=0` (`SSR_AUDIT=ALL_GREEN`)**: `<html lang>` correcto, canonicales absolutos, JSON-LD válido (0 `LocalBusiness`, 0 `Occupation`, licencias verificadas), reciprocidad `hreflang` 100 %, 0 `empleabilidad`/`campo laboral`/`brochure`/`Sin fecha confirmada`/`clase-gratis`, canibalización Power BI resuelta, `X-Robots-Tag: noindex, nofollow` en las 24 descargas |

---

## 4. Pendientes operativos para Manu (post-merge / fase siguiente)

1. **Merge y deploy:** Confirmar para hacer merge de `feat/latam-datos-integracion` a `main` y desplegar.
2. **Search Console:** Reenviar `https://www.programbi.com/sitemap.xml` y pedir indexación prioritaria de las guías estacionales de diciembre (`/co/guias/prima-de-servicios-excel`, `/pe/guias/calcular-gratificacion-excel`, `/mx/guias/plantilla-aguinaldo-excel`, `/ar/guias/calcular-aguinaldo-excel`) + `/pe/cursos/power-bi`, `/co/cursos/power-bi`, `/ar/cursos/power-bi`.
3. **Variables / datos opcionales:**
   - Definir `NEXT_PUBLIC_CLASE_GRATIS_FECHA` en Vercel cuando haya fecha confirmada de clase gratis.
   - Entregar `diccionario-araucano.xlsx` cuando esté disponible para habilitar las 36 fichas `/ar/datos/carreras/[slug]` en una fase siguiente.
   - Confirmar si habrá correo o WhatsApp `+52` propio para México en `config/paises.ts`.
