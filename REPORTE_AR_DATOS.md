# Reporte — Argentina: fix Power BI, `/ar/datos`, aguinaldo en Excel, carreras, inflación y desempleo (`feat/ar-datos-aguinaldo-carreras`)

## 1. Resumen ejecutivo

- **Rama**: `feat/ar-datos-aguinaldo-carreras` (creada desde `main`, sin merge ni deploy a producción).
- **Nuevas URLs HTML indexables**: **8 URLs** (sin fichas individuales por ausencia del diccionario oficial Araucano):
  - `/ar/datos` (hub)
  - `/ar/guias/calcular-aguinaldo-excel` (urgente, antes del 18 dic 2026)
  - `/ar/datos/carreras` (índice)
  - `/ar/datos/carreras/mejor-pagadas`
  - `/ar/datos/carreras/salida-laboral`
  - `/ar/datos/carreras/mas-demandadas`
  - `/ar/datos/inflacion` (ISR diario `revalidate = 86400`, con respaldo JSON)
  - `/ar/datos/desempleo` (ISR diario `revalidate = 86400`, con respaldo JSON)
- **Descargables estáticos (`X-Robots-Tag: noindex, nofollow`, fuera de sitemap)**:
  - CSV: `/ar/datos/carreras/csv/carreras-argentina.csv`, `/ar/datos/inflacion/csv/ipc-argentina-indec.csv`, `/ar/datos/desempleo/csv/desempleo-argentina-indec.csv`
  - Plantilla `.xlsx`: `/ar/plantillas/aguinaldo-sac-argentina-2026.xlsx` (fórmulas vivas sin macros + hoja `Parametros` con Ley 23.041 y LCT arts. 121–123).
- **Fix canibalización `/ar` (5.1)**:
  - `/ar/cursos/power-bi`: única URL `/ar` optimizada para «curso power bi» (`Curso de Power BI en Argentina: en vivo y con certificado`, H1 `Curso de Power BI en vivo en Argentina`, meta con horario de Buenos Aires, 3 cuotas sin interés y clase gratis).
  - `/ar/cursos`: title `Cursos en vivo de datos, Excel e IA en Argentina | ProgramBI` y H1 de catálogo sin «Power BI»; tarjeta enlaza con anchor `Curso de Power BI en Argentina`.
  - `/ar/guias`: title `Guías de Excel, datos e IA para Argentina | ProgramBI` sin «Power BI» ni «curso».
  - `/ar`, `/ar/preguntas-frecuentes` (`#precios`), `/ar/cursos/analisis-de-datos` (`Data Analyst`) y `Footer` («Datos de Argentina» solo en `ar`) actualizados.

## 2. Bloqueo del diccionario Araucano y cómo activar las 36 fichas

- `data/ar/fuente/out/araucano_por_disciplina.csv` incluye **36 disciplinas** con `n_con_salario_sipa ≥ 100` (quedan fuera la 36 con n=83 y la 38 con n=49), pero el microdato solo trae `disciplina_id` (1–38) porque las descargas de `diccionario.xlsx` y `metodologia-araucano-da.pdf` respondieron HTTP 403 desde el entorno.
- **Decisión obligatoria**: 0 nombres inventados y **0 fichas `/ar/datos/carreras/[slug]`** publicadas ni en sitemap (`diccionarioDisponible: false`).
- **Para activar las 36 fichas**: colocar `diccionario-araucano.xlsx` en `data/ar/fuente/`, volver a correr `node scripts/build-datos-ar.mjs` (completará `nombreOficial` y `slug` en `data/ar/carreras.json`) y habilitar `app/(pais)/[pais]/datos/carreras/[slug]/page.tsx`.

## 3. Conteo del sitemap, pares `hreflang` y licencias pendientes

- **URLs `/ar/*` en sitemap**: antes `40`, después `48` (+8 nuevas URLs HTML exactas; 0 CSV y 0 XLSX).
- **Tabla compartida `lib/seo/datos-hreflang.ts`** (`x-default` = Chile, reciprocidad 100 %):
  - 5 pares exactos: `/datos/carreras` ↔ `/ar/datos/carreras`, `/datos/carreras/mejor-pagadas` ↔ `/ar/datos/carreras/mejor-pagadas`, `/datos/carreras/mas-empleabilidad` ↔ `/ar/datos/carreras/salida-laboral`, `/datos/inflacion` ↔ `/ar/datos/inflacion`, `/datos/desempleo` ↔ `/ar/datos/desempleo`.
- **Licencias pendientes de verificar** (se citan los organismos sin declarar licencia abierta en `Dataset` JSON-LD): Capital Humano DIU Anuario 2024, INDEC IPC, BCRA API v4.0 e INDEC EPH. Únicamente CEP XXI Araucano declara **CC BY 4.0** (`https://creativecommons.org/licenses/by/4.0/`).
- **Cero «empleabilidad»** en `/ar/**`, cero `LocalBusiness`, cero `Occupation`, cero `/ar/clase-gratis`.

## 4. Verificaciones ejecutadas (rápidas) y pendientes (pesadas)

- **Ejecutadas**: `node scripts/build-datos-ar.mjs`, `node scripts/build-plantillas-ar.mjs`, `npx tsx --test tests/datos/seo.test.ts tests/datos-ar/argentina.test.ts`, `node scripts/verificar-guias-paso-a-paso.mjs --no-net`, `npx tsc --noEmit`.
- **Pendientes bajo solicitud explícita**: `npm run build` completo y verificación HTTP SSR en `next start` sobre las 8 URLs y headers `X-Robots-Tag`.

## 5. Checklist post-deploy (para Manu, después del merge)

1. Reenviar `https://www.programbi.com/sitemap.xml` en Search Console.
2. Pedir indexación en orden: `/ar/guias/calcular-aguinaldo-excel` (mismo día), `/ar/datos`, `/ar/datos/carreras/mejor-pagadas`, `/ar/datos/inflacion` y `/ar/cursos/power-bi`.
3. A los 7 días revisar Cobertura (8 URLs nuevas, o 44 tras sumar el diccionario; más `/ar/guias/curso-excel-argentina` y `/ar/versus/programbi-vs-coderhouse-power-bi`) y a los 28 días Rendimiento de «power bi» en Argentina.
