# Reporte — Colombia: Excel laboral, observatorio de carreras (OLE/SNIES), datos DANE/BanRep y SEO `/co` (`feat/colombia-paginas`)

## 1. Resumen ejecutivo

- **Rama**: `feat/colombia-paginas` (creada desde `main`, sin merge ni deploy a producción).
- **Nuevas URLs HTML indexables**: **369 URLs**:
  - 1 hub: `/co/datos`
  - 5 guías de Excel laboral: `/co/guias/prima-de-servicios-excel`, `/co/guias/intereses-de-cesantias-excel`, `/co/guias/cesantias-2026`, `/co/guias/liquidacion-de-contrato-excel`, `/co/guias/liquidacion-de-nomina-excel`
  - 6 páginas del observatorio de carreras: `/co/datos/carreras`, `/co/datos/carreras/mejor-pagadas`, `/co/datos/carreras/tecnologicas-mejor-pagadas`, `/co/datos/carreras/cuanto-gana-un-analista-de-datos`, `/co/datos/carreras/comparar`, `/co/datos/carreras/metodologia`
  - **354 fichas** de carrera `/co/datos/carreras/[slug]` (`sugerido_ficha = "si"`, ≥200 graduados cotizantes)
  - 3 macroeconómicas: `/co/datos/desempleo`, `/co/datos/inflacion`, `/co/datos/salario-minimo`
- **Descargables estáticos (`X-Robots-Tag: noindex, nofollow`, fuera de sitemap)**:
  - CSV: `/co/datos/carreras/csv/ranking-carreras-colombia-ole.csv`, `/co/datos/carreras/csv/carreras-ies-colombia-ole.csv`, `/co/datos/desempleo/csv/desempleo-colombia-dane.csv`, `/co/datos/inflacion/csv/ipc-colombia-dane.csv`
  - 5 plantillas `.xlsx` en `/co/plantillas/`: `prima-de-servicios-colombia-2026.xlsx`, `intereses-de-cesantias-colombia-2026.xlsx`, `cesantias-colombia-2026.xlsx`, `liquidacion-contrato-colombia-2026.xlsx`, `liquidacion-nomina-colombia-2026.xlsx`.
- **SEO `/co/cursos/*` y fix canibalización «curso power bi»**:
  - `co` registrado en `BLOQUES` (`lib/data/contenido-paises/co.ts` + `index.ts`) con horario `America/Bogota`, PSE/Nequi, «3 cuotas sin interés», «clase gratis», «Temario y precios» y cobertura en Bogotá, Medellín, Cali y Barranquilla.
  - `/co/cursos` optimizado como catálogo (`Catálogo de cursos de datos en Colombia | ProgramBI`, H1 sin Power BI) y `/co/cursos/power-bi` optimizado como única landing de «curso power bi» (`Curso Power BI en vivo en Colombia | ProgramBI`), junto con títulos propios para `excel`, `analisis-de-datos`, `sql-server` y `python`.
  - «Datos de Colombia» expuesto en `Navbar` y `Footer` únicamente cuando `pais === "co"`.

## 2. Conteo del sitemap y pares `hreflang`

- **URLs `/co/*` en sitemap**: antes `42` (más `/co` = `43`), después `411` (+369 nuevas URLs HTML exactas; 0 CSV y 0 XLSX).
- **Total sitemap estático (sin env de Supabase)**: `1318` URLs.
- **Tabla compartida `lib/seo/datos-hreflang.ts`** (`x-default` = Chile, reciprocidad 100 %):
  - 5 pares base obligatorios: `/datos/carreras`, `/datos/carreras/mejor-pagadas`, `/datos/carreras/comparar`, `/datos/desempleo`, `/datos/inflacion` ↔ `/co/...`.
  - 28 pares explícitos de fichas CL ↔ CO verificados 1:1 en nivel e indexabilidad.
  - Excluidas: `/co/datos`, `/co/datos/salario-minimo`, `/co/datos/carreras/tecnologicas-mejor-pagadas`, `/co/datos/carreras/cuanto-gana-un-analista-de-datos`, `/co/datos/carreras/metodologia`, las 5 guías laborales y fichas sin par explícito.

## 3. Valores de control y licencias / datos fuera

- **Controles verificados**: SMMLV 2026 `$1.750.905`, auxilio `$249.095` (total `$2.000.000`); desempleo sep-2026 `8,0 %`, Bogotá jul–sep 2026 `7,6 %`, Quibdó `23,4 %`; IPC oct-2026 índice `161,32` y variación 12m `6,30 %`; TRM 25-nov-2026 `3.592,03` COP/USD; tasa BanRep 24-nov-2026 `12,25 %`; Sistemas y Computación (`1.550`, `49,8 %`, `3,99`), Informática (`1.132`, `47,5 %`, `3,87`), Software (`1.175`, `43,5 %`, `3,65`), Sistemas (`14.422`, `32,3 %`, `3,08`), Economía (`5.237`, `19,1 %`, `2,47`), Industrial (`27.339`, `14,3 %`, `2,21`), Estadística (`391` cotizantes — en ficha, fuera de ranking ≥500, `42,2 %`, `3,70`).
- **Licencias**: únicamente la TRM (`datos.gov.co` `32sa-8pi3`) declara `CC BY-SA 4.0`. Para OLE, SNIES, DANE GEIH y DANE IPC no se declara licencia abierta en `Dataset` JSON-LD (pendiente de validación jurídica); se cita al organismo con enlace oficial.
- **Datos fuera de publicación**: 628 programas con 30–199 cotizantes quedan fuera de fichas y de sitemap (solo los 354 con `sugerido_ficha = "si"` tienen ficha; 335 entran a rankings `sugerido_ranking = "si"`). No se publica tasa porcentual de vinculación por HTTP 500 en tableros BI del OLE, ni sexo por ausencia en el CSV derivado, ni SMMLV 2027 antes de decreto oficial. Cero menciones a «empleabilidad» ni «campo laboral».

## 4. Verificaciones ejecutadas (rápidas) y pendientes (pesadas)

- **Ejecutadas**:
  - `node scripts/build-datos-co.mjs` (idempotente, validó 18 controles)
  - `node scripts/build-plantillas-co.mjs` (5 `.xlsx` con fórmulas vivas y hoja `Parametros`)
  - `npx tsx --test tests/datos/seo.test.ts tests/datos-co/colombia.test.ts` → **11/11 tests pasaron**
  - `node scripts/verificar-guias-paso-a-paso.mjs --no-net` → **0 errores, 0 avisos**
  - `npx tsc --noEmit` → **exit 0**
- **Pendientes bajo solicitud explícita**: `npm run build` completo y verificación HTTP SSR en `next start` sobre las 369 URLs y headers `X-Robots-Tag`.

## 5. Checklist post-deploy (para Manu, después del merge posterior a PE/AR/MX)

1. Reenviar `https://www.programbi.com/sitemap.xml` en Search Console.
2. Pedir indexación en orden: `/co/guias/prima-de-servicios-excel` (antes del 10 dic), `/co/datos`, `/co/datos/salario-minimo`, `/co/datos/carreras`, `/co/datos/carreras/mejor-pagadas`, `/co/datos/carreras/tecnologicas-mejor-pagadas`, `/co/datos/carreras/cuanto-gana-un-analista-de-datos`, fichas principales (`ingenieria-de-sistemas`, `ingenieria-industrial`), `/co/cursos/power-bi`, `/co/cursos/excel`, y antes de enero/febrero `/co/guias/intereses-de-cesantias-excel` y `/co/guias/cesantias-2026`.
3. A los 7 días revisar Cobertura (369 URLs indexadas y CSV/XLSX en `noindex`) y a los 28 días Rendimiento de «curso power bi» en Colombia.
