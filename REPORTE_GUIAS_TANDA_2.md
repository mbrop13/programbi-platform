# Reporte de Implementación — Guías Paso a Paso (Tanda 2)

- **Rama:** `feat/guias-tanda-2` (creada desde `feat/guias-paso-a-paso` sin merge a `main` ni deploy a producción).
- **Alcance completado:** **29 de 29 guías** planificadas (P1 #1–#11, P2 #12–#24 y P3 #25–#29), sumando un total acumulado de **49 guías paso a paso** registradas en `content/guias/paso-a-paso/index.ts`.
- **Estado de verificaciones:** Verificaciones ligeras ejecutadas tras la edición final (**0 errores**). Por instrucción explícita del usuario («las verificaciones pesadas y esas cosas haslas cuando yo te diga»), quedan **diferidas** `npm run build`, smoke live con `next start`, validación live de OG/sitemap, Playwright 375 px, Lighthouse y el barrido de red a URLs externas.
- **Integridad de `data/`:** `git diff --stat main -- data/` vacío (sin modificaciones en `data/`).

---

## 1. Tabla de guías implementadas (Tanda 2: 29 / 29)

Conteo de palabras útiles medido con `scripts/verificar-guias-paso-a-paso.mjs --no-net` (excluye bloques de código, JSON, fórmulas y prompts).

| # | Prioridad | Slug | Insignia | Estado | Palabras útiles (mínimo) | Capturas (`CAPTURAS.md`) | Bloques código / prompts | `omitirHowTo` | Entorno objetivo / versión documentada |
|---:|:---:|---|:---:|---|---:|---:|---:|:---:|---|
| 1 | P1 | `chatgpt-para-analisis-de-datos` | ★ | Publicada (TS) | 2.405 (≥2.000) | 4 | 8 (6 prompts) | No | ChatGPT (nov. 2026) · Python 3.11+ / pandas 2.2+ |
| 2 | P1 | `ia-para-excel-chatgpt-claude-gemini` | ★ | Publicada (TS) | 2.362 (≥2.000) | 5 | 13 (5 prompts + 8 Excel ES/EN) | No | ChatGPT / Claude / Gemini · Excel Microsoft 365 (ES `;` / EN `,`) |
| 3 | P1 | `tabla-dinamica-en-excel` | — | Publicada (TS) | 1.832 (≥1.500) | 4 | 4 (Excel ES/EN) | No | Excel Microsoft 365 / Excel 2021+ (ES `;` / EN `,`) |
| 4 | P1 | `gemini-para-analisis-de-datos` | — | Publicada (TS) | 1.662 (≥1.500) | 4 | 6 (5 prompts + 1 Sheets) | No | Gemini (nov. 2026) · Google Sheets / Excel |
| 5 | P1 | `ia-para-analizar-pdf` | — | Publicada (TS) | 1.830 (≥1.500) | 5 | 6 (5 prompts + Power Query M) | No | Gemini / ChatGPT / Claude · Power BI / Excel `Pdf.Tables` |
| 6 | P1 | `prompts-para-excel` | — | Publicada (TS) | 3.717 (≥1.500) | 3 | 9 (6 prompts + Excel ES/EN) | No | ChatGPT / Copilot / Claude · Excel 365 (ES `;` / EN `,`) |
| 7 | P1 | `ia-para-power-bi-dax` | ★ | Publicada (TS) | 2.626 (≥2.000) | 4 | 9 (5 prompts + DAX + JSON válido) | No | Power BI Desktop · DAX · ChatGPT / Claude |
| 8 | P1 | `copilot-en-power-bi` | — | Publicada (TS) | 2.074 (≥1.500) | 4 | 6 (5 prompts + 1 DAX) | No | Microsoft Fabric (`F2+`/`F64+`) · Power BI Service / Desktop |
| 9 | P1 | `ia-para-python-analisis-de-datos` | — | Publicada (TS) | 1.843 (≥1.500) | 4 | 8 (5 prompts + Python) | No | Python 3.11+ · pandas 2.2+ · Jupyter / VS Code / Colab |
| 10 | P1 | `buscarv-y-buscarx-en-excel` | — | Publicada (TS) | 1.678 (≥1.500) | 4 | 6 (Excel ES/EN) | No | Excel 365 / 2021+ / 2016+ (ES `;` / EN `,`) |
| 11 | P1 | `que-es-analisis-de-datos` | — | Publicada (TS) | 1.835 (≥1.500) | 2 | 2 (Excel ES/EN + SQL) | **Sí** | Excel ES/EN · SQL Server (T-SQL) |
| 12 | P2 | `mcp-power-bi-claude` | — | Publicada (TS) | 2.688 (≥1.500) | 5 | 6 (5 prompts/JSON MCP) | No | Claude Desktop · Servidor MCP Power BI (Microsoft Learn) |
| 13 | P2 | `ia-para-sql` | — | Publicada (TS) | 1.897 (≥1.500) | 5 | 7 (5 prompts + T-SQL) | No | SQL Server / SSMS 22+ (GitHub Copilot) · ChatGPT / Claude |
| 14 | P2 | `ia-para-hacer-graficos` | — | Publicada (TS) | 1.656 (≥1.500) | 5 | 6 (5 prompts + `matplotlib`) | No | ChatGPT / Gemini · Excel · Python 3.11+ / `matplotlib` |
| 15 | P2 | `notebooklm-que-es-y-como-usarlo` | — | Publicada (TS) | 1.890 (≥1.500) | 5 | 5 (5 prompts) | No | Google NotebookLM (nov. 2026) |
| 16 | P2 | `gemini-en-google-sheets` | — | Publicada (TS) | 1.880 (≥1.500) | 5 | 6 (5 prompts + Sheets `QUERY`) | No | Google Sheets · Workspace / Google One AI |
| 17 | P2 | `formulas-de-excel-mas-usadas` | — | Publicada (TS) | 1.541 (≥1.500) | 5 | 6 (30 fórmulas ES/EN) | No | Excel 365 / Web / 2021+ / 2016+ (ES `;` / EN `,`) |
| 18 | P2 | `funcion-si-excel-varias-condiciones` | — | Publicada (TS) | 1.886 (≥1.500) | 5 | 9 (Excel ES/EN) | No | Excel 365 / 2021+ / 2019 (ES `;` / EN `,`) |
| 19 | P2 | `python-para-analisis-de-datos` | ★ | Publicada (TS) | 2.082 (≥2.000) | 7 | 8 (Python + bash) | No | Python 3.11/3.12 · pandas 2.2+ · `matplotlib` · Jupyter / `uv` |
| 20 | P2 | `consultas-sql-ejemplos` | ★ | Publicada (TS) | 2.007 (≥2.000) | 7 | 7 (25 consultas T-SQL + DDL/DML) | No | SQL Server Express / SSMS (T-SQL) |
| 21 | P2 | `como-ser-analista-de-datos` | — | Publicada (TS) | 1.917 (≥1.500) | 6 | 0 | No | Ruta de carrera (Excel, SQL, Power BI, Python, PL-300) |
| 22 | P2 | `ciencia-de-datos-vs-analisis-de-datos` | — | Publicada (TS) | 1.777 (≥1.500) | 5 | 0 | **Sí** | Comparativa conceptual de roles y herramientas |
| 23 | P2 | `licencias-power-bi-precio-chile` | — | Publicada (TS) | 2.066 (≥1.500) | 5 | 0 | **Sí** | Power BI Free / Pro / PPU / Microsoft Fabric (nov. 2026) |
| 24 | P2 | `google-sheets-vs-excel` | — | Publicada (TS) | 1.792 (≥1.500) | 6 | 2 (Sheets vs Excel ES/EN) | **Sí** | Google Sheets vs Microsoft Excel 365 |
| 25 | P3 | `chatgpt-vs-gemini-vs-copilot` | — | Publicada (TS) | 2.173 (≥1.500) | 2 | 5 (5 prompts) | **Sí** | ChatGPT / Gemini / Copilot / Claude (nov. 2026) |
| 26 | P3 | `copilot-studio-crear-agente` | — | Publicada (TS) | 2.160 (≥1.500) | 3 | 5 (5 prompts/config) | No | Microsoft Copilot Studio · Power Automate · Teams |
| 27 | P3 | `automatizar-tareas-con-ia` | — | Publicada (TS) | 1.915 (≥1.500) | 3 | 6 (5 prompts + flujo) | No | ChatGPT / Copilot / Power Automate / Copilot Studio |
| 28 | P3 | `preguntas-entrevista-analista-de-datos` | — | Publicada (TS) | 2.027 (≥1.500) | 3 | 5 (T-SQL, Excel ES/EN, DAX) | No | T-SQL · Excel ES/EN · Power BI / DAX |
| 29 | P3 | `calcular-finiquito-chile-excel` | — | Publicada (TS) | 2.114 (≥1.500) | 3 | 5 (Excel ES/EN) | No | Excel 365 / 2021+ (ES `;` / EN `,`) · normativa Chile (`dt.gob.cl`, `bcn.cl`) |

> **Nota sobre pruebas de ejecución (Criterio §5.6):** En esta etapa se ejecutó la validación estática de tipos (`tsc --noEmit`), parseo de bloques JSON, balanceo sintáctico de fórmulas Excel ES/EN y paridad `codigoEn` vía `scripts/verificar-guias-paso-a-paso.mjs --no-net`. La ejecución interactiva manual de fórmulas/scripts en Excel de escritorio, Power BI Desktop, SQL Server Express, Python/Jupyter local, Copilot Studio y Google Sheets queda marcada como pendiente junto con la fase de verificaciones pesadas.

---

## 2. Arquitectura UI, SEO y Hub `/guias` agregada en Tanda 2

- **`lib/guias/paso-a-paso-tipos.ts` y `lib/guias/paso-a-paso-seo.ts`:**
  - Nuevas herramientas `IA`, `Google Sheets`, `Carrera`; cursos adicionales (`ia-productividad`, `analisis-de-datos`, `copilot`, `claude`, `machine-learning`); y lenguajes de bloque `prompt`, `sheets`, `bash`.
  - Conteo de palabras incluye `guia.avisoPrivacidad` y `sec.verificaResultado`.
  - `jsonLdDeGuiaPasoAPaso(guia)` omite el nodo `HowTo` cuando `guia.omitirHowTo === true` o `howToSteps.length === 0` (solo emite `TechArticle`, `FAQPage` y `BreadcrumbList`; 0 `aggregateRating`/`review`). Las 5 guías conceptuales/comparativas (`que-es-analisis-de-datos`, `ciencia-de-datos-vs-analisis-de-datos`, `licencias-power-bi-precio-chile`, `google-sheets-vs-excel`, `chatgpt-vs-gemini-vs-copilot`) tienen `omitirHowTo: true`.
- **`components/guias/GuiaPasoAPasoCodeBlock.tsx`:** Etiquetas `"Prompt listo para copiar"` (con ícono `Sparkles` y estilo diferenciado), `"Google Sheets"` y `"Terminal"`.
- **`components/guias/GuiaPasoAPasoLayout.tsx` y `GuiaPasoAPasoCursoCard.tsx`:**
  - Bloque **Aviso de privacidad y anonimización** (`role="note"`) debajo de «Lo que necesitas» en las 16 guías con `esGuiaIA: true` / `avisoPrivacidad`.
  - Caja **«Verifica el resultado»** al cierre de pasos que usan IA (`1` a `7` cajas por guía en todas las guías IA).
  - Enlace discreto a `cursoSecundario` debajo de «Ver el curso» en la tarjeta del curso.
  - Placeholder «Descarga la plantilla» mantenido desactivado sin URLs de descarga ficticias.
- **Hub `app/(marketing)/guias/page.tsx` y `components/guias/GuiasHub.tsx`:**
  - `HERRAMIENTAS_ORDEN` ampliado a `["IA", "Excel", "Power BI", "Power Automate", "SQL", "Python", "Google Sheets", "Carrera"]`.
  - Nuevo bloque destacado **«IA para análisis de datos»** en `/guias` enlazando las 4 rutas clave (`/guias/como-usar-claude-para-analisis-de-datos`, `/guias/chatgpt-para-analisis-de-datos`, `/guias/gemini-para-analisis-de-datos`, `/guias/claude-vs-chatgpt-analisis-de-datos`).
  - Todas las URLs antiguas existentes y `app/sitemap.ts` intactos (las 29 guías entran automáticamente al sitemap vía `GUIAS_PASO_A_PASO`).

---

## 3. Resolución de guías `⚠` (§3.1)

| Slug marcado con `⚠` | Estado previo en repo + Tanda 1 | Decisión ejecutada |
|---|---|---|
| `chatgpt-para-analisis-de-datos` | No existía en `.md` ni en Tanda 1 | **Creada desde cero en Tanda 2** (★, P1 #1) |
| `ia-para-excel-chatgpt-claude-gemini` | No existía en `.md` ni en Tanda 1 | **Creada desde cero en Tanda 2** (★, P1 #2) |
| `tabla-dinamica-en-excel` | No existía en `.md` ni en Tanda 1 | **Creada desde cero en Tanda 2** (P1 #3) |
| `carta-gantt-en-excel` | Ya creada en Tanda 1 (`content/guias/paso-a-paso/carta-gantt-en-excel.ts`) | **No duplicada / intacta desde Tanda 1** |
| `control-de-horas-en-excel` | Ya creada en Tanda 1 (`content/guias/paso-a-paso/control-de-horas-en-excel.ts`) | **No duplicada / intacta desde Tanda 1** |
| `control-de-ventas-en-excel` | Ya creada en Tanda 1 (`content/guias/paso-a-paso/control-de-ventas-en-excel.ts`) | **No duplicada / intacta desde Tanda 1** |

Resultado: 0 URLs duplicadas.

---

## 4. Enlaces de vuelta en guías existentes (§4)

Sin modificar ningún `.md` existente ni alterar `title`, `meta`, URL, `schema` o copias de país en `[pais]/guias/`, se configuró `ENLACES_VUELTA_LEGACY` en `app/(marketing)/guias/[slug]/page.tsx` para anteponer las guías nuevas indicadas en la sección visible de relacionadas (`relacionadas.slice(0, 6)` en `GuiaPage.tsx`) únicamente en las rutas canónicas de Chile:

1. `/guias/como-usar-claude-para-analisis-de-datos` → enlaces a `chatgpt-para-analisis-de-datos`, `gemini-para-analisis-de-datos`, `ia-para-excel-chatgpt-claude-gemini`.
2. `/guias/claude-vs-chatgpt-analisis-de-datos` → enlaces a `chatgpt-para-analisis-de-datos`, `gemini-para-analisis-de-datos`, `chatgpt-vs-gemini-vs-copilot`.
3. `/guias/como-usar-copilot-en-excel` → enlaces a `copilot-en-power-bi`, `prompts-para-excel`, `copilot-studio-crear-agente`.
4. `/guias/funciones-dax-mas-importantes` → enlaces a `ia-para-power-bi-dax`, `copilot-en-power-bi`.
5. `/guias/power-bi-vs-excel` → enlaces a `licencias-power-bi-precio-chile`, `google-sheets-vs-excel`.

Además, las **16 guías con `esGuiaIA: true`** incluyen enlaces cruzados hacia las guías existentes de Claude (`/guias/como-usar-claude-para-analisis-de-datos` y/o `/guias/claude-vs-chatgpt-analisis-de-datos`).

---

## 5. Inventario de `CAPTURAS.md` pendientes (29 guías · 128 capturas en Tanda 2)

Cada guía nueva cuenta con su archivo `content/guias/<slug>/CAPTURAS.md` (100 % emparejado con los IDs en su `.ts`) y usa `CapturaPendiente` sin imágenes inventadas. Conteo por slug:

- `chatgpt-para-analisis-de-datos` (`content/guias/chatgpt-para-analisis-de-datos/CAPTURAS.md`): 4 capturas
- `ia-para-excel-chatgpt-claude-gemini` (`content/guias/ia-para-excel-chatgpt-claude-gemini/CAPTURAS.md`): 5 capturas
- `tabla-dinamica-en-excel` (`content/guias/tabla-dinamica-en-excel/CAPTURAS.md`): 4 capturas
- `gemini-para-analisis-de-datos` (`content/guias/gemini-para-analisis-de-datos/CAPTURAS.md`): 4 capturas
- `ia-para-analizar-pdf` (`content/guias/ia-para-analizar-pdf/CAPTURAS.md`): 5 capturas
- `prompts-para-excel` (`content/guias/prompts-para-excel/CAPTURAS.md`): 3 capturas
- `ia-para-power-bi-dax` (`content/guias/ia-para-power-bi-dax/CAPTURAS.md`): 4 capturas
- `copilot-en-power-bi` (`content/guias/copilot-en-power-bi/CAPTURAS.md`): 4 capturas
- `ia-para-python-analisis-de-datos` (`content/guias/ia-para-python-analisis-de-datos/CAPTURAS.md`): 4 capturas
- `buscarv-y-buscarx-en-excel` (`content/guias/buscarv-y-buscarx-en-excel/CAPTURAS.md`): 4 capturas
- `que-es-analisis-de-datos` (`content/guias/que-es-analisis-de-datos/CAPTURAS.md`): 2 capturas
- `mcp-power-bi-claude` (`content/guias/mcp-power-bi-claude/CAPTURAS.md`): 5 capturas
- `ia-para-sql` (`content/guias/ia-para-sql/CAPTURAS.md`): 5 capturas
- `ia-para-hacer-graficos` (`content/guias/ia-para-hacer-graficos/CAPTURAS.md`): 5 capturas
- `notebooklm-que-es-y-como-usarlo` (`content/guias/notebooklm-que-es-y-como-usarlo/CAPTURAS.md`): 5 capturas
- `gemini-en-google-sheets` (`content/guias/gemini-en-google-sheets/CAPTURAS.md`): 5 capturas
- `formulas-de-excel-mas-usadas` (`content/guias/formulas-de-excel-mas-usadas/CAPTURAS.md`): 5 capturas
- `funcion-si-excel-varias-condiciones` (`content/guias/funcion-si-excel-varias-condiciones/CAPTURAS.md`): 5 capturas
- `python-para-analisis-de-datos` (`content/guias/python-para-analisis-de-datos/CAPTURAS.md`): 7 capturas
- `consultas-sql-ejemplos` (`content/guias/consultas-sql-ejemplos/CAPTURAS.md`): 7 capturas
- `como-ser-analista-de-datos` (`content/guias/como-ser-analista-de-datos/CAPTURAS.md`): 6 capturas
- `ciencia-de-datos-vs-analisis-de-datos` (`content/guias/ciencia-de-datos-vs-analisis-de-datos/CAPTURAS.md`): 5 capturas
- `licencias-power-bi-precio-chile` (`content/guias/licencias-power-bi-precio-chile/CAPTURAS.md`): 5 capturas
- `google-sheets-vs-excel` (`content/guias/google-sheets-vs-excel/CAPTURAS.md`): 6 capturas
- `chatgpt-vs-gemini-vs-copilot` (`content/guias/chatgpt-vs-gemini-vs-copilot/CAPTURAS.md`): 2 capturas
- `copilot-studio-crear-agente` (`content/guias/copilot-studio-crear-agente/CAPTURAS.md`): 3 capturas
- `automatizar-tareas-con-ia` (`content/guias/automatizar-tareas-con-ia/CAPTURAS.md`): 3 capturas
- `preguntas-entrevista-analista-de-datos` (`content/guias/preguntas-entrevista-analista-de-datos/CAPTURAS.md`): 3 capturas
- `calcular-finiquito-chile-excel` (`content/guias/calcular-finiquito-chile-excel/CAPTURAS.md`): 3 capturas

*(Total acumulado Tanda 1 + Tanda 2: 243 capturas documentadas en 49 archivos `CAPTURAS.md`).*

---

## 6. Datos no verificados dejados fuera y revisiones requeridas de Manu

Siguiendo la regla de **cero invención de precios, límites no verificados ni resultados de IA**:

- **Precios y cuotas de herramientas de terceros omitidos a propósito** (remiten a sus portales oficiales con fecha de consulta `21 de noviembre de 2026`):
  - Tarifas en USD/CLP e impuestos locales de **Power BI Pro, PPU y capacidades Microsoft Fabric (F2–F64+)** → se remite a `https://powerbi.microsoft.com/es-es/pricing/`, `https://learn.microsoft.com/es-es/fabric/enterprise/licenses` y distribuidores Microsoft CSP en Chile, sin inventar conversiones informales a CLP.
  - Tarifas, paquetes prepagados y medidores de pago por uso en Azure de **Microsoft Copilot Studio** → se describe solo el modelo de licenciamiento documentado en Microsoft Learn y se remite al portal oficial de precios.
  - Tarifas en CLP y cuotas dinámicas de **ChatGPT, Google Workspace / Google One AI (Gemini), Microsoft 365 Copilot y Claude** → `chatgpt-vs-gemini-vs-copilot` compara arquitectura, suites, privacidad y casos de uso sin precios inventados en CLP y enlaza a `openai.com/chatgpt/pricing/`, `anthropic.com/pricing`, Google Workspace y Microsoft Learn.
  - Salarios por cargo en Chile no incluidos como cifras fijas inventadas → `como-ser-analista-de-datos` enlaza internamente a `/guias/sueldo-analista-de-datos-latinoamerica` y `/datos/carreras`.
- **Resultados de IA sin fecha ni modelo:** Los prompts son plantillas reproducibles; donde se comenta qué esperar se explica como criterio de validación (caja «Verifica el resultado») sin inventar transcripciones de respuestas ni benchmarks numéricos.

### Guías que requieren revisión explícita de Manu antes de publicar a `main`

1. **`calcular-finiquito-chile-excel` (Revisión legal / normativa laboral Chile):** Incluye `avisoEducativo`, enlaces a `dt.gob.cl` y Código del Trabajo en `bcn.cl`, hoja `Parametros` con fecha (`21-11-2026`), tope referencial 90 UF (Art. 172), regla de fracción >6 meses y tope de 11 años (Art. 163), y vacación proporcional parametrizada. Manu debe confirmar criterios operativos vigentes y ejemplos antes de promoción masiva o publicación de `.xlsx` descargable.
2. **Guías con referencias de licencias / precios / planes de terceros:**
   - `licencias-power-bi-precio-chile` (Power BI Free, Pro, PPU, Fabric F64+ en Chile)
   - `copilot-en-power-bi` (requisitos de capacidad Fabric F2+ / F64+ / Premium P1+ y Copilot)
   - `copilot-studio-crear-agente` (modelo de licenciamiento y medidores de Copilot Studio)
   - `gemini-en-google-sheets` (disponibilidad de panel lateral y función `=AI()` por plan de Google Workspace / Google One AI en español)
   - `notebooklm-que-es-y-como-usarlo` (cuotas de fuentes por cuaderno y límites por fuente)
   - `chatgpt-vs-gemini-vs-copilot` (estructura de planes y enlaces oficiales de precios/privacidad)

---

## 7. Resultados de verificaciones ligeras (post-edición) y checks diferidos

### Verificaciones ejecutadas después del último cambio

1. **`node scripts/verificar-guias-paso-a-paso.mjs --no-net --out ".../audit-tanda2.json"`** → **Exit 0**:
   - **49 guías + `power-bi-vs-excel` evaluadas.**
   - **Errores estructurales/SEO:** `0`.
   - **Avisos:** `0`.
   - **Peor solapamiento (shingles de 8 palabras):** `0.69 %` (`copilot-en-power-bi <-> ia-para-power-bi-dax`, 14 shingles; muy por debajo del límite `< 10 %`).
   - Todas las 9 guías insignia (4 de T1 + 5 de T2) superan ≥ 2.000 palabras útiles; todas las demás superan ≥ 1.500 palabras útiles; `title <= 60`, `meta` entre `140` y `155`; `0` URLs con patrón `support.microsoft.com`.
2. **Inspección Node de atributos Tanda 2** → **Exit 0**:
   - Las 16 guías `esGuiaIA: true` tienen `avisoPrivacidad`, ≥ 5 bloques `prompt` (5 o 6), ≥ 1 caja `verificaResultado` (1 a 7) y enlace interno a Claude.
   - Las 5 guías conceptuales/comparativas aplicables (`que-es-analisis-de-datos`, `ciencia-de-datos-vs-analisis-de-datos`, `licencias-power-bi-precio-chile`, `google-sheets-vs-excel`, `chatgpt-vs-gemini-vs-copilot`) tienen `omitirHowTo: true`.
3. **`.\\node_modules\\.bin\\tsc --noEmit`** → **Exit 0** (`TSC=0`, sin errores de tipos en todo el proyecto).
4. **`node scripts/build-guias.mjs --check`** → **Exit 0** (`118 guías publicadas, 2 omitidas, 0 avisos`; `lib/guias/generado.ts` al día e ignora `CAPTURAS.md`).
5. **`git diff --stat main -- data/`** → **Vacío** (cero cambios en `data/`).

### Verificaciones pesadas diferidas por instrucción del usuario

Quedan pendientes hasta que el usuario indique ejecutar la pasada pesada:
- `npm run build` completo (Next.js 16 SSG).
- Smoke live con `next start` (HTTP 200 en `/guias` y las 29 rutas nuevas, validación de OG images `/og?...` = 200 y `sitemap.xml`).
- Inspección DOM / mobile a **375 px** (sin overflow horizontal, sticky WhatsApp en móvil y tarjeta sticky desktop).
- Auditoría **Lighthouse** y Rich Results / JSON-LD sobre HTML renderizado.
- Barrido de red (`node scripts/verificar-guias-paso-a-paso.mjs` sin `--no-net`) para validar HTTP 200 de las 99 URLs externas.
