# Reporte — Perú fase 1: carreras mejor pagadas, Excel laboral y fix «curso power bi» (`feat/pe-datos-carreras-excel`)

## 1. Resumen ejecutivo

- **Rama**: `feat/pe-datos-carreras-excel` (creada desde `main`, sin merge ni deploy a producción).
- **Nuevas URLs HTML indexables**: **47 URLs** (`/pe/datos`, `/pe/datos/carreras`, `/pe/datos/carreras/mejor-pagadas`, `/pe/datos/carreras/tecnicas-mejor-pagadas`, **38 fichas** `/pe/datos/carreras/[slug]` y **5 guías** de Excel laboral `/pe/guias/*`).
- **Descargables estáticos (`X-Robots-Tag: noindex, nofollow`, fuera de sitemap)**:
  - `/pe/datos/carreras/csv/carreras-peru.csv` (38 familias publicables, sin `enaho_pct_desempleo`)
  - 5 plantillas `.xlsx` en `/pe/plantillas/`: `gratificacion-peru-2026.xlsx`, `cts-peru-2026.xlsx`, `liquidacion-beneficios-sociales-peru-2026.xlsx`, `renta-quinta-categoria-peru-2026.xlsx`, `boleta-de-pago-peru-2026.xlsx`.
- **Fix de canibalización «curso power bi» (5.a)**:
  - `/pe/cursos`: title `Cursos en vivo de datos, Excel e IA en Perú | ProgramBI`, H1 `Cursos en vivo de análisis de datos, Excel e IA en Perú`, enlace a `/pe/cursos/power-bi` con anchor `Curso de Power BI en Perú →`.
  - `/pe/cursos/power-bi`: title `Curso de Power BI en Perú: en vivo y certificado | ProgramBI` (60 car.), H1 `Curso de Power BI en vivo en Perú`.
  - `/pe`, `/pe/guias`, `/pe/preguntas-frecuentes`: enlaces en HTML SSR a `/pe/cursos/power-bi` con anchors de compra.

## 2. Conteo del sitemap y pares `hreflang`

- **URLs `/pe/*` en sitemap**: antes `41` (más `/pe` = `42` referencias), después `88` sin contar blog Supabase dinámico (+47 nuevas URLs exactas).
- **Total sitemap estático (sin env de Supabase)**: `996` URLs (0 CSV y 0 XLSX en `sitemap.xml`).
- **Tabla compartida `lib/seo/datos-hreflang.ts`** (`x-default` = Chile, reciprocidad 100 % en metadata y `sitemap.xml`):
  - `/pe/datos/carreras` ↔ `/datos/carreras`
  - `/pe/datos/carreras/mejor-pagadas` ↔ `/datos/carreras/mejor-pagadas`
  - 12 pares explícitos de fichas del mismo nivel verificadas como indexables en Chile (`medicina`, `derecho`, `enfermeria`, `psicologia`, `arquitectura-y-urbanismo` ↔ `arquitectura`, `ingenieria-industrial`, `ingenieria-mecanica`, `obstetricia` ↔ `obstetricia-y-puericultura`, `enfermeria-tecnica` ↔ `tecnico-en-enfermeria`, `administracion-de-empresas-tecnica` ↔ `tecnico-en-administracion-de-empresas`, `agropecuaria-tecnica` ↔ `tecnico-agropecuario`, `contabilidad-tecnica` ↔ `tecnico-en-contabilidad-general`).
  - Excluidas: `tecnologia-medica`, `diseno`, `farmacia-y-bioquimica` (distinto nivel entre PE y CL), `/pe/datos`, `/pe/datos/carreras/tecnicas-mejor-pagadas` y las 5 guías laborales.

## 3. Valores de control y decisiones sobre datos faltantes

| Control | Slug / Código | Mediana ENAHO (S/ 2024) | n con ingreso | CV |
|---|---|---|---|---|
| Ingeniería de Sistemas y Cómputo | `ingenieria-de-sistemas` (511) | S/ 2.881 | 391 | 6,0 % |
| Contabilidad y Finanzas (Univ.) | `contabilidad` (342) | S/ 2.163 | 851 | 3,3 % |
| Derecho | `derecho` (351) | S/ 2.654 | 731 | 5,6 % |
| Medicina | `medicina` (711) | S/ 5.244 | 175 | 9,9 % |

- **Publicabilidad**: exactamente **38 familias** (`enaho_publicable = "si"`: 22 universitarias + 16 técnicas). Las 11 filas `con_advertencia` o `no` fueron excluidas de JSON, CSV, tablas, fichas y sitemap.
- **MTPE**: cuando una familia técnica o departamento no existe en `mtpe_mejor_pagadas_por_departamento_nov22_oct23.csv`, se muestra «sin dato MTPE».
- **EDO 2026**: el informe oficial solo publica el top 10 por nivel; el resto muestra «fuera del top 10 EDO».
- **SUNEDU**: el cruce aplica solo a carreras universitarias (marcado como aproximado por coincidencia de nombre); en técnicas no aplica.
- **Plantillas `.xlsx`**: parámetros legales verificados (UIT 2026 S/ 5.500 por D.S. 301-2025-EF, tramos 5.ª categoría SUNAT, bonificación extraordinaria 9 % / 6,75 % Ley 27735/30334, ONP 13 %, EsSalud 9 %, aporte obligatorio AFP 10 %); comisión sobre flujo/prima de seguro AFP y asignación familiar quedan como celdas editables con nota «completar con el valor vigente» y enlace oficial a `sbs.gob.pe`.

## 4. Verificaciones ejecutadas (rápidas) y pendientes (pesadas)

- **Ejecutadas en esta rama**:
  - `node scripts/build-carreras-pe.mjs` (idempotente, validó 38 fichas y controles)
  - `node scripts/build-plantillas-pe.mjs` (5 `.xlsx` re-abiertos y validados con `exceljs`)
  - `npx tsx --test tests/datos/seo.test.ts tests/datos-pe/carreras-pe.test.ts` → **11/11 tests pasaron**
  - `node scripts/verificar-guias-paso-a-paso.mjs --no-net` → **0 errores, 0 avisos**
  - `npx tsc --noEmit` → **exit 0**
- **Pendientes bajo solicitud explícita**: `npm run build` completo y verificación HTTP SSR en `next start` sobre las 47 URLs y headers `X-Robots-Tag`.

## 5. Checklist post-deploy (para Manu, después del merge)

1. En Search Console, volver a enviar `https://www.programbi.com/sitemap.xml`.
2. Inspeccionar URL y pedir indexación de `/pe/datos/carreras`, `/pe/datos/carreras/mejor-pagadas`, `/pe/datos/carreras/tecnicas-mejor-pagadas`, `/pe/datos/carreras/ingenieria-de-sistemas`, `/pe/datos/carreras/medicina`, `/pe/datos/carreras/derecho`, `/pe/guias/calcular-gratificacion-excel` y `/pe/cursos/power-bi`.
3. A los 7 días, revisar en Cobertura que las **47 URLs** estén «Enviada e indexada». A los 28 días, revisar en Rendimiento (Perú) que «curso power bi» pase a `/pe/cursos/power-bi`.
