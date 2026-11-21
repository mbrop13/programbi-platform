# Reporte — 20 Guías Paso a Paso + Mejora de `power-bi-vs-excel`

- **Rama:** `feat/guias-paso-a-paso` (creada desde `main`; sin merge a `main` ni deploy a producción).
- **Fecha:** 2026-11-21
- **Estado general:** Implementación completa de las 20 guías nuevas, layout reutilizable, SEO/JSON-LD, filtros del hub, sitemap y mejora on-page de `/guias/power-bi-vs-excel`.
- **Nota sobre verificaciones pesadas:** Por indicación explícita de Manu (*"las verificaciones pesadas hazlas cuando yo te diga ya que trabajaremos más en la web"*), se ejecutaron todas las validaciones estáticas, de TypeScript, generación de guías, solapamiento de shingles, enlaces externos reales y endpoints en vivo, quedando aplazados `npm run build`, smoke live contra `next start`, comprobación visual en Playwright 375 px y Lighthouse móvil hasta la ronda final de verificación.

---

## 1. URLs del preview / rutas generadas

- Hub actualizado con filtros por herramienta (`Excel`, `Power BI`, `Power Automate`, `SQL`, `Python`) y nivel (`Básico`, `Intermedio`, `Avanzado`): `/guias`
- Guía existente mejorada (§4): `/guias/power-bi-vs-excel`
- 20 guías nuevas (canónicas de Chile, sin prefijos de país):
  1. `/guias/dolar-observado-en-excel-automatico`
  2. `/guias/uf-utm-ipc-en-excel-automatico`
  3. `/guias/conectar-power-bi-api-banco-central`
  4. `/guias/como-hacer-flujo-de-caja-en-excel`
  5. `/guias/control-de-gastos-en-excel`
  6. `/guias/como-hacer-presupuesto-en-excel`
  7. `/guias/inventario-en-excel-entradas-y-salidas`
  8. `/guias/como-hacer-dashboard-en-excel`
  9. `/guias/liquidacion-de-sueldo-en-excel-chile`
  10. `/guias/carta-gantt-en-excel`
  11. `/guias/control-de-horas-en-excel`
  12. `/guias/control-de-ventas-en-excel`
  13. `/guias/automatizar-reportes-con-power-bi` *(Insignia)*
  14. `/guias/automatizar-excel-con-power-query` *(Insignia)*
  15. `/guias/enviar-reportes-automaticos-con-power-automate` *(Insignia ≥ 2.000)*
  16. `/guias/dashboard-de-ventas-en-power-bi-paso-a-paso` *(Insignia)*
  17. `/guias/tabla-calendario-power-bi-dax`
  18. `/guias/conectar-power-bi-a-sql-server`
  19. `/guias/automatizar-excel-con-python`
  20. `/guias/macros-vba-excel-desde-cero`

---

## 2. Tabla SEO por guía y control de canibalización (KW únicas)

| # | URL (`/guias/...`) | Title (≤60) | Long. Title | Long. Meta (140–155) | KW principal | Palabras útiles | Peor solapamiento (8-shingles) |
|---|---|---|---|---|---|---|---|
| 1 | `dolar-observado-en-excel-automatico` | Dólar observado en Excel que se actualiza solo (2026) | 53 | 150 | dolar en Excel | 2.417 | 0,51% |
| 2 | `uf-utm-ipc-en-excel-automatico` | UF, UTM e IPC en Excel actualizados automáticamente | 51 | 147 | UF en Excel | 1.764 | 0,51% |
| 3 | `conectar-power-bi-api-banco-central` | Conectar Power BI a la API del Banco Central de Chile | 53 | 151 | conectar Power BI a una API | 1.701 | 0,12% |
| 4 | `como-hacer-flujo-de-caja-en-excel` | Cómo hacer un flujo de caja en Excel paso a paso (2026) | 55 | 145 | como hacer un flujo de caja en Excel | 1.683 | 0,06% |
| 5 | `control-de-gastos-en-excel` | Control de gastos en Excel paso a paso (personal y hogar) | 57 | 144 | como hacer un control de gastos en Excel | 1.686 | 0,06% |
| 6 | `como-hacer-presupuesto-en-excel` | Cómo hacer un presupuesto en Excel (personal o pyme) | 52 | 142 | como hacer un presupuesto en Excel | 2.343 | 0,42% |
| 7 | `inventario-en-excel-entradas-y-salidas` | Inventario en Excel con entradas, salidas y stock mínimo | 56 | 141 | como hacer un inventario en Excel | 1.913 | 0,42% |
| 8 | `como-hacer-dashboard-en-excel` | Cómo hacer un dashboard en Excel desde cero (paso a paso) | 57 | 147 | como hacer un dashboard en Excel | 2.342 | 0,05% |
| 9 | `liquidacion-de-sueldo-en-excel-chile` | Liquidación de sueldo en Excel (Chile): cálculo paso a paso | 59 | 148 | como calcular la liquidacion de sueldo en Chile | 2.053 | 0,00% |
| 10 | `carta-gantt-en-excel` | Cómo hacer una carta Gantt en Excel automática (paso a paso) | 60 | 142 | como hacer una carta Gantt en Excel | 1.936 | 0,26% |
| 11 | `control-de-horas-en-excel` | Control de horas en Excel: asistencia y horas extra | 51 | 143 | control de horas en Excel | 2.121 | 0,16% |
| 12 | `control-de-ventas-en-excel` | Control de ventas en Excel: registro, reporte y metas | 53 | 155 | control de ventas en Excel | 2.040 | 0,18% |
| 13 | `automatizar-reportes-con-power-bi` | Cómo automatizar reportes con Power BI (guía completa 2026) | 59 | 150 | automatizar reportes con Power BI | 3.066 | 0,27% |
| 14 | `automatizar-excel-con-power-query` | Automatizar Excel con Power Query: guía paso a paso | 51 | 145 | automatizar Excel | 2.283 | 0,00% |
| 15 | `enviar-reportes-automaticos-con-power-automate` | Enviar reportes automáticos por correo con Power Automate | 57 | 146 | Power Automate enviar correo con Excel | 2.283 | 0,26% |
| 16 | `dashboard-de-ventas-en-power-bi-paso-a-paso` | Cómo hacer un dashboard de ventas en Power BI (paso a paso) | 59 | 151 | como hacer un dashboard en Power BI | 2.498 | 0,37% |
| 17 | `tabla-calendario-power-bi-dax` | Tabla calendario en Power BI con DAX (código listo) | 51 | 147 | tabla calendario Power BI | 1.650 | 0,30% |
| 18 | `conectar-power-bi-a-sql-server` | Cómo conectar Power BI a SQL Server (Import y DirectQuery) | 58 | 145 | conectar Power BI a SQL Server | 1.879 | 0,37% |
| 19 | `automatizar-excel-con-python` | Automatizar Excel con Python (pandas y openpyxl) paso a paso | 60 | 152 | automatizar Excel con Python | 1.777 | 0,00% |
| 20 | `macros-vba-excel-desde-cero` | Macros y VBA en Excel desde cero: ejemplos útiles | 49 | 150 | macros en Excel | 1.608 | 0,00% |
| §4 | `power-bi-vs-excel` | Power BI vs Excel: para qué sirve cada uno y cuándo usarlo | 58 | 149 | power bi vs excel | 1.394 | 0,00% |

### Guías existentes en `/guias/*` (verificación de 0 duplicados de KW)

| URL existente | KW / intención cubierta |
|---|---|
| `/guias/como-aprender-power-bi-en-chile` | cómo aprender Power BI en Chile |
| `/guias/como-usar-claude-para-analisis-de-datos` | cómo usar Claude para análisis de datos |
| `/guias/claude-vs-chatgpt-analisis-de-datos` | Claude vs ChatGPT para análisis de datos |
| `/guias/como-usar-copilot-en-excel` | cómo usar Copilot en Excel |
| `/guias/funciones-dax-mas-importantes` | funciones DAX más importantes |
| `/guias/power-bi-vs-looker-studio` | Power BI vs Looker Studio |
| `/guias/power-bi-vs-tableau` | Power BI vs Tableau |
| `/guias/certificacion-pl-300-power-bi` | certificación PL-300 Power BI |
| `/guias/curso-online-vs-presencial-power-bi` | curso online vs presencial Power BI |
| `/guias/sueldo-analista-de-datos-latinoamerica` | sueldo analista de datos Latinoamérica |
| `/guias/curso-access-chile` … `/guias/curso-sql-server-chile` (12 fichas curso-país) | curso `<herramienta>` Chile |

---

## 3. Resultado por criterio de aceptación (§5)

| Criterio | Estado | Evidencia real |
|---|---|---|
| 20 guías nuevas en `/guias/<slug>` (SSG) + `power-bi-vs-excel` mejorada + hub `/guias` con filtros | **OK (código listo; build diferido)** | `app/(marketing)/guias/[slug]/page.tsx` con `revalidate = false`, `dynamicParams = false`; `GuiasHub.tsx` con filtros `herramienta` y `nivel`; `npx tsc --noEmit` 0 errores; `node scripts/build-guias.mjs` 118 guías sin avisos. `npm run build` diferido por indicación del usuario. |
| Title ≤60, meta 140–155, 1 H1, canonical absoluto, OG 200, JSON-LD `@graph` (`TechArticle` + `HowTo` + `FAQPage` + `BreadcrumbList`) sin `aggregateRating`/`review` | **OK (código y auditoría estática; smoke live diferido)** | Validado en `scripts/verificar-guias-paso-a-paso.mjs` (0 errores en 20 guías + `power-bi-vs-excel`), `lib/guias/paso-a-paso-seo.ts` (`HowToStep.text` idéntico a `parrafos[0]`, `FAQPage` idéntico a `guia.faqs`). |
| Bloques obligatorios (En 30s, Ruta visual, tabla comparativa, código copiable, errores comunes, «Descarga la plantilla» disabled, FAQ 4–6, 3 relacionadas, TOC sticky, tarjeta sticky, WhatsApp móvil) | **OK** | Implementado en `components/guias/GuiaPasoAPasoLayout.tsx` y subcomponentes reutilizables (`CapturaPendiente`, `GuiaPasoAPasoCodeBlock` con toggle ES/EN, `GuiaPasoAPasoToc`, `GuiaPasoAPasoCursoCard`, `GuiaPasoAPasoStickyWa`). |
| Longitud ≥1.500 (≥2.000 en #13–#16) y solapamiento <10% (shingles de 8 palabras) | **OK** | Mínimo estándar observado: 1.608 palabras (`macros-vba-excel-desde-cero`); mínimo insignia: 2.283 palabras (`automatizar-excel-con-power-query` y #15). Peor solapamiento entre pares: **0,51%** (`dolar-observado-en-excel-automatico` ↔ `uf-utm-ipc-en-excel-automatico`). |
| Sin dos URLs compitiendo por la misma KW principal | **OK** | 0 duplicados en las 20 nuevas + `power-bi-vs-excel` + 23 guías raíz existentes. |
| Código y endpoints verificados; 0 credenciales reales | **OK (endpoints y sintaxis verificados; desktop diferido)** | `mindicador.cl/api/{dolar,uf,utm,ipc}`: HTTP 200 (ver detalles en §4). `SERVICIOWEB` validado en Node contra el JSON real de `mindicador.cl/api/dolar` (`1008.79`). `si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx` respondió HTTP 200 con código `-5` (esperado sin credenciales reales). Bloques JSON validados con `JSON.parse`, VBA con `Option Explicit` en los 6 ejemplos, fórmulas Excel con paréntesis balanceados y toggle ES/EN. Ejecución interactiva en Excel 365 Windows y Power BI Desktop queda pendiente de prueba manual/escritorio. |
| Todos los enlaces externos responden 200/3xx válido | **OK** | `scripts/verificar-guias-paso-a-paso.mjs`: **38 / 38 URLs externas respondieron HTTP 200** (se reemplazaron URLs de `support.microsoft.com` bloqueadas por 403 y el enlace antiguo `Web_Services/index_EN.htm` de BCCh por URLs oficiales `learn.microsoft.com` y `si3.bcentral.cl/siete` / `www.bcentral.cl` verificadas 200). |
| Placeholders de imagen con `alt`, ratio 16/9 e inventario `CAPTURAS.md` | **OK** | `CapturaPendiente.tsx` usa `aspect-video` y `data-pending-image="true"`; 20/20 carpetas `content/guias/<slug>/CAPTURAS.md` verificadas contra sus IDs. |
| Lighthouse móvil ≥95 / ≥98 / 100, LCP <1,8s, CLS <0,05 y 0 overflow 375 px | **PENDIENTE (diferido por usuario)** | Diferido hasta la ronda final de verificaciones pesadas solicitada por el usuario. |
| CTA dicen «clase gratis» y «3 cuotas sin interés» con WhatsApp prellenado con título y slug | **OK** | Verificado en `GuiaPasoAPasoCursoCard.tsx`, `GuiaPasoAPasoStickyWa.tsx`, `GuiaPasoAPasoLayout.tsx`, `GuiaCursoLateral.tsx` y `GuiaStickyCta.tsx`. |
| 0 testimonios, 0 precios inventados, `data/` sin cambios, rama pusheada sin merge a `main` | **OK** | `<TestimoniosDeCurso>` omitido en paso a paso y en `power-bi-vs-excel`; precios desde `config/pricing.ts` / `lib/paises/precios.ts`; `git diff --stat main -- data/` vacío. |

---

## 4. Validación de endpoints y código (Node v24.18.0, 21-nov-2026)

| Endpoint / Prueba | Resultado |
|---|---|
| `https://mindicador.cl/api/dolar` | HTTP 200 · 31 registros · último dato `2026-11-20T03:00:00.000Z` = `1008.79` |
| `https://mindicador.cl/api/uf` | HTTP 200 · 31 registros · último dato `2026-11-21T03:00:00.000Z` = `41377.93` |
| `https://mindicador.cl/api/utm` | HTTP 200 · 31 registros · último dato `2026-11-01T03:00:00.000Z` = `72440` |
| `https://mindicador.cl/api/ipc` | HTTP 200 · 31 registros · último dato `2025-12-01T03:00:00.000Z` = `-0.2` (**desfasado**) |
| `SERVICIOWEB` parser JS sobre JSON real de `dolar` | Extrae `1008.79` correctamente |
| `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx` | HTTP 200 (responde JSON `Codigo: -5` con credenciales `DEMO`, sin credenciales reales en el repo) |

---

## 5. Capturas pendientes (`CAPTURAS.md`)

Cada guía cuenta con su archivo de inventario en `content/guias/<slug>/CAPTURAS.md` (115 capturas en total entre las 20 guías) con el `id` exacto, descripción de pantalla y `alt`.

---

## 6. Parámetros que Manu debe revisar

1. **Guía #9 (`liquidacion-de-sueldo-en-excel-chile`):** Se incluyó el aviso educativo visible y se dejaron las tasas de AFP, topes imponibles UF, SIS y tramos del Impuesto Único de Segunda Categoría como celdas parametrizables a completar con datos vigentes de Previred / SII / Superintendencia de Pensiones, para evitar publicar cifras legales desactualizadas. Revisar antes de publicar capturas o plantilla descargable.
2. **IPC en `mindicador.cl` (Guía #2 `uf-utm-ipc-en-excel-automatico`):** Verificado el 21-nov-2026 que `https://mindicador.cl/api/ipc` devuelve como último registro `2025-12-01` (`-0.2`). La guía ya advierte este desfase y recomienda consultar la API BDE del BCCh o el INE (`ine.gob.cl`).
3. **Pruebas interactivas en escritorio y ronda pesada final:** Cuando indiques cerrar verificaciones pesadas, ejecutar `npm run build`, smoke live HTML/OG, Playwright 375 px, Lighthouse móvil en #1, #13 y #16, y validar visualmente las fórmulas en Excel 365 Windows y Power BI Desktop.
