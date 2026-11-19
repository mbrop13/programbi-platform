# REPORTE_DATOS_CARRERAS — Sección `/datos` y `/datos/carreras` (`programbi.com`)

Carreras quedó integrada en el mismo hub que Desempleo, Capacitación e Inflación. Las mediciones y el estado de la entrega integrada se encuentran en el [informe de Datos de Chile](REPORTE_DATOS_DESEMPLEO.md).

- **Rama:** `mejora/datos-carreras` (worktree aislado en `C:/dev/pbi-datos-carreras`, sin tocar el working tree de `mejora/datos-desempleo`)
- **Base commit:** `1bc1254` (`main`)
- **Edición oficial procesada:** `2025-2026` (`mifuturo.cl` / SIES, Mineduc), ingresos en pesos de septiembre de 2025 (`pesos_de: "2025-09"`), última referencia IPC comprometida `2026-10` (`114.13`)
- **Fecha del reporte:** `2026-11-19`

---

## 1. Resumen de lo implementado y alcance

### Implementado
1. **Pipeline reproducible SIES + IPC (`scripts/datos/update-carreras.mjs` + `.github/workflows/datos-carreras.yml`):**
   - Descarga/lectura local (`--local --force`) de los 5 XLSX oficiales de `mifuturo.cl`, cálculo de SHA-256, parseo estricto de tramos de ingresos (23 formatos oficiales + `s/i`), unión de tablas A/B/C/D/A24, cálculo de variaciones nominales y reales 2020–2024 y 2023–2024, detección automática de carreras ausentes entre ediciones y 11 pruebas de humo internas.
   - Salida en `data/carreras/*` (`carreras.json`, `ranking.json`, `meta.json`, `programas/`, `instituciones/`, `historico/`) y activos públicos comprimidos en `public/datos/carreras/` + CSV descargables (`ranking-carreras.csv`, `carreras-instituciones.csv`).
2. **Arquitectura editorial estática (Cero funciones SSR sin caché en `/datos`):**
   - Hub `/datos` y calculadora `/datos/inflacion` (IPC Banco Central / fallback versionado).
   - Hub `/datos/carreras` con tabla SSR de las Top 25 universidades + buscador inteligente con sinónimos (`Ctrl+K` / `/`), filtros avanzados por programa 2026, comparador rápido, gráfico de dispersión dinámico, descargas CSV y directorio completo por las 10 áreas del conocimiento (`165` carreras indexables).
   - **165 fichas estáticas (`● SSG`)** en `/datos/carreras/[slug]` con H1 editorial personalizado, 4 KPIs SSR, bloque **En resumen** citable, curva de ingresos 1.º–5.º año, distribución P10–P90, selector de tipo de institución (`U` / `IP` / `CFT`), variación real vs. IPC, perfil estudiantil y retención, histograma de aranceles 2026, tabla ordenable de programas e instituciones, estimador rápido de arancel vs. sueldo, simulador de puntaje ponderado referencial, carreras similares con diffs cuantitativos, enlazado interno (`0` páginas huérfanas) y JSON-LD (`Dataset` + `FAQPage` + `BreadcrumbList`).
   - **6 vistas prefiltradas SEO (`○ Static`)**: `/datos/carreras/mejor-pagadas`, `/datos/carreras/mas-empleabilidad`, `/datos/carreras/mejor-sueldo-por-arancel`, `/datos/carreras/baratas-con-buena-empleabilidad`, `/datos/carreras/crecieron-en-sueldo-real`, `/datos/carreras/mejor-pagadas-vespertinas`.
   - **5 herramientas dedicadas (`○ Static`)**: `/datos/carreras/comparar`, `/datos/carreras/retorno`, `/datos/carreras/test`, `/datos/carreras/puntaje-ponderado`, `/datos/carreras/tecnologia-y-datos`.
   - **OpenGraph + Tarjetas PNG compartibles**: `opengraph-image.tsx` estáticos por ruta y `/datos/carreras/compartir/[a]/[b]` (`ImageResponse` en `1080x1350`, `1080x1920`, `1200x630`, modo `?test=1` y `404` ante slugs inválidos, con `Cache-Control: public, s-maxage=31536000, immutable`).
3. **Integración en el sitio (solo archivos permitidos):**
   - `Navbar.tsx` y `Footer.tsx`: enlace a `Datos de Chile` (`/datos`) solo cuando la ruta corresponde a Chile (`ISO_CHILE`).
   - `app/sitemap.ts`: inclusión de `/datos`, `/datos/inflacion`, `/datos/carreras`, herramientas, 6 presets y 165 fichas indexables con sus URLs `<image:image>` de OpenGraph.
   - `.gitignore`: exclusión de `/data/carreras/raw/` para no versionar los XLSX crudos binarios.

### Notas honestas / lo que queda para revisión post-despliegue
- `BCCH_API_TOKEN` no estuvo presente en `.env.local`; se usó el archivo versionado `data/ipc/ipc.json` (`2024-09: 104.54`, `2025-09: 109.14`, `2026-10: 114.13`), registrado en `data/carreras/meta.json` (`avisos`).
- La barra lateral de **Lighthouse móvil** en emulación local 4x CPU mostró `Performance 33–59` (frente a línea base `60` del home `/` de la plataforma en esta misma máquina Windows) y `A11y 97` en hub/fichas debido a 2 clases residuales con `#1890ff` en texto/fondo (`MeAlcanza.tsx` líneas 59, 134, 147 y `ScatterSueldoEmpleoChart.tsx` línea 238) que pueden cambiarse a `#1063b8` antes del merge final.

---

## 2. Resultado de la ejecución del pipeline de datos (`update-carreras.mjs --local --force`)

### Integridad de fuentes oficiales (`data/carreras/meta.json`)

| Fuente SIES (`mifuturo.cl`) | SHA-256 |
|---|---|
| Estadísticas por Carrera 2025–2026 (`A`) | `4a5aee8546641725078790a5a2346583173e52cf325ce733f916f8309dfa288d` |
| Buscador de Empleabilidad e Ingresos 2025–2026 (`B`) | `ff3ce56da2d5aec990010b2ef21eba1bac5d3b3c65cbeffb5fc1cea015619bfb` |
| Buscador de Carreras 2025–2026 (`C`) | `509559c593856cc92fb86e2e13ef58e4adb94ea4f9c1378b857ee6ca1734fe1b` |
| Buscador de Instituciones 2025–2026 (`D`) | `e8c32306b0dff586d4b6771c312439bc8d3c9883a61ffab39fd421162b92fc78` |
| Estadísticas por Carrera 2024–2025 (`A24`) | `11d66201c94c3e93a00dbc4aa70ed4507707902b980f560f7d4a4769da2ae465` |

### Conteos, cruces y pruebas de humo
- **Filas en A (carrera × tipo de IES):** `252` (`165` carreras genéricas únicas indexables)
- **Filas en B (empleabilidad/ingresos por programa/institución):** `1.690` — cruce B → A: **`99,6 %`**
- **Filas en C (oferta académica 2026):** `9.898` — cruce C → A por nombre genérico: **`93,4 %`**
- **Pruebas de humo internas en `update-carreras.mjs`:** **`11/11 ✔`**
- **Avisos registrados en `meta.json`:**
  1. `BCCH_API_TOKEN no configurado: se usó data/ipc/ipc.json commiteado.`
  2. `Carreras en 2024-2025 ausentes en 2025-2026: tecnico-en-administracion-de-ventas, tecnico-en-procesos-industriales, tecnico-en-contabilidad-tributaria, tecnico-en-relaciones-publicas`

### Peso de activos estáticos y rendimiento de filtros
| Archivo público (`public/datos/carreras/`) | Raw (KB) | Gzip (KB) | Presupuesto |
|---|---:|---:|---|
| `ranking.json` | `177,9 KB` | **`28,1 KB`** | `< 120 KB ✔` |
| `buscador.json` | `104,2 KB` | **`19,2 KB`** | Lazy on open/Ctrl+K ✔ |
| `programas-cft.json` | `350,3 KB` | **`15,8 KB`** | Lazy al filtrar CFT ✔ |
| `programas-ip.json` | `1.299,1 KB` | **`58,1 KB`** | Lazy al filtrar IP ✔ |
| `programas-u.json` | `786,5 KB` | **`64,3 KB`** | Lazy al filtrar U ✔ |
| `csv/ranking-carreras.csv` | `48,5 KB` | — | Descarga directa ✔ |
| `csv/carreras-instituciones.csv` | `301,9 KB` | — | Descarga directa ✔ |

- **Benchmark en caliente de 5 filtros simultáneos** (`2.920` programas U + `252` filas ranking → `49` carreras resultantes): **`1,23 ms`** (objetivo `< 100 ms`).

---

## 3. Verificación de build, tests unitarios/SEO y deltas de JS

- **Tests unitarios y SEO (`node tests/datos/run-tests.mjs`):** **`10/10 ✔`** (`parseTramo` 23 formatos + errores + orden, formato `es-CL`, buscador con sinónimos, `165/165` fichas indexables con `>= 250` palabras propias y similitud máxima muestreada de `41,6 %` `< 60 %`, `title <= 60` y `description 140–155`, `0` páginas huérfanas con `>= 5` salientes y `>= 2` entrantes por ficha, JSON-LD válido).
- **ESLint sobre todos los archivos modificados/nuevos del módulo:** `0` errores.
- **Production Build (`npm run build` / `next build --webpack`):** Exit `0`, **`1489/1489` páginas estáticas generadas**. Todas las rutas `/datos` y `/datos/carreras/*` quedaron como `○ Static` o `● SSG`; únicamente `/datos/carreras/compartir/[a]/[b]` es `ƒ` (Dynamic `ImageResponse` cacheado por 1 año en CDN).

### Deltas de JS gzip sobre el bundle base de `/` (`224,8 KB` gzip)
| Ruta | JS total gzip | Delta sobre `/` | Presupuesto `< 150 KB` |
|---|---:|---:|---|
| `/datos` | `206,4 KB` | **`-18,4 KB`** | ✔ |
| `/datos/carreras` | `337,9 KB` | **`+113,1 KB`** | ✔ |
| `/datos/carreras/medicina` | `252,5 KB` | **`+27,7 KB`** | ✔ |
| `/datos/carreras/comparar` | `293,9 KB` | **`+69,1 KB`** | ✔ |
| `/datos/carreras/retorno` | `275,0 KB` | **`+50,2 KB`** | ✔ |
| `/datos/carreras/test` | `278,2 KB` | **`+53,4 KB`** | ✔ |
| `/datos/carreras/puntaje-ponderado` | `258,0 KB` | **`+33,2 KB`** | ✔ |
| `/datos/inflacion` | `344,0 KB` | **`+119,2 KB`** | ✔ |

---

## 4. Tabla de verificación HTTP en vivo (`127.0.0.1:3099` sobre build final)

Verificadas **26 rutas HTML + 3 formatos de tarjeta PNG + `?test=1` + `404` por slug inválido** mediante `verify-live.mjs`:

| Ruta | Status | H1 / Title (`<=60`) | Desc (`140–155`) | Robots | JSON-LD `@type` | Cifra hero SSR | `En resumen` | Peso HTML |
|---|---:|---:|---:|---|---|---|---:|---:|
| `/datos` | 200 | `47` | `146` | index, follow | Organization, WebSite, BreadcrumbList | N/A | ✔ | `73,1 KB` |
| `/datos/carreras` | 200 | `56` | `153` | index, follow | Dataset, ItemList, FAQPage, BreadcrumbList | `$3.719.393` ✔ | ✔ | `448,2 KB` |
| `/datos/carreras/medicina` | 200 | `53` | `141` | index, follow | Dataset, FAQPage, BreadcrumbList | `$3.719.393` ✔ | ✔ | `223,6 KB` |
| `/datos/carreras/ingenieria-comercial` | 200 | `53` | `153` | index, follow | Dataset, FAQPage, BreadcrumbList | `$2.203.057` ✔ | ✔ | `324,2 KB` |
| `/datos/carreras/psicologia` | 200 | `55` | `141` | index, follow | Dataset, FAQPage, BreadcrumbList | ✔ | ✔ | `328,0 KB` |
| `/datos/carreras/derecho` | 200 | `52` | `140` | index, follow | Dataset, FAQPage, BreadcrumbList | ✔ | ✔ | `288,4 KB` |
| `/datos/carreras/enfermeria` | 200 | `55` | `143` | index, follow | Dataset, FAQPage, BreadcrumbList | ✔ | ✔ | `297,0 KB` |
| `/datos/carreras/ingenieria-civil-en-computacion-e-informatica` | 200 | `57` | `145` | index, follow | Dataset, FAQPage, BreadcrumbList | ✔ | ✔ | `240,0 KB` |
| `/datos/carreras/ingenieria-civil-industrial` | 200 | `60` | `152` | index, follow | Dataset, FAQPage, BreadcrumbList | ✔ | ✔ | `289,8 KB` |
| `/datos/carreras/kinesiologia` | 200 | `57` | `143` | index, follow | Dataset, FAQPage, BreadcrumbList | ✔ | ✔ | `290,5 KB` |
| `/datos/carreras/odontologia` | 200 | `56` | `144` | index, follow | Dataset, FAQPage, BreadcrumbList | ✔ | ✔ | `220,9 KB` |
| `/datos/carreras/quimica-y-farmacia` | 200 | `51` | `151` | index, follow | Dataset, FAQPage, BreadcrumbList | ✔ | ✔ | `205,1 KB` |
| `/datos/carreras/contador-auditor` | 200 | `49` | `149` | index, follow | Dataset, FAQPage, BreadcrumbList | ✔ | ✔ | `313,5 KB` |
| `/datos/carreras/secretariado-bilingue` | 200 | `54` | `154` | index, follow | Dataset, FAQPage, BreadcrumbList | ✔ | ✔ | `161,8 KB` |
| `/datos/carreras/comparar` | 200 | `49` | `152` | index, follow | WebApplication, FAQPage, BreadcrumbList | N/A | N/A | `143,8 KB` |
| `/datos/carreras/retorno` | 200 | `54` | `140` | index, follow | WebApplication, FAQPage, BreadcrumbList | N/A | N/A | `275,7 KB` |
| `/datos/carreras/test` | 200 | `53` | `147` | index, follow | WebApplication, FAQPage, BreadcrumbList | N/A | N/A | `262,8 KB` |
| `/datos/carreras/puntaje-ponderado` | 200 | `54` | `153` | index, follow | WebApplication, FAQPage, BreadcrumbList | N/A | N/A | `67,9 KB` |
| `/datos/carreras/tecnologia-y-datos` | 200 | `53` | `141` | index, follow | Dataset, ItemList, FAQPage, BreadcrumbList | N/A | ✔ | `137,2 KB` |
| `/datos/inflacion` | 200 | `52` | `145` | index, follow | WebApplication, Dataset, FAQPage, BreadcrumbList | N/A | ✔ | `73,4 KB` |
| `/datos/carreras/mejor-pagadas` (+5 presets) | 200 | `49–60` | `143–153` | index, follow | ItemList, FAQPage, BreadcrumbList | N/A | ✔ | `162–470 KB` |

- **Tarjetas `/datos/carreras/compartir/medicina/ingenieria-comercial`:**
  - `1080x1350`: `200`, `113.270 bytes`, `Cache-Control: public, s-maxage=31536000, immutable`
  - `1080x1920`: `200`, `126.768 bytes`, `Cache-Control: public, s-maxage=31536000, immutable`
  - `1200x630`: `200`, `72.047 bytes`, `Cache-Control: public, s-maxage=31536000, immutable`
  - `?test=1&carreras=medicina,ingenieria-comercial,derecho`: `200`
  - `/datos/carreras/compartir/inexistente/medicina`: `404`

---

## 5. Playwright + Lighthouse Móvil (post-build final)

### Playwright (`verify-visual-lh.mjs`)
- **`pageErrors`:** `[]` (`0` errores de hidratación React `#418` ni excepciones JS)
- **`consoleErrors` de aplicación:** `0` (solo 404 esperado en local de `/_vercel/insights/script.js` y `/_vercel/speed-insights/script.js` fuera de Vercel)
- **Interactividad de filtros en 4x CPU throttle:** cambio de pestaña a `IP` ejecutado con `0` requests dinámicos al servidor (`nonStaticRequestsDuringFilter: []`)
- **Test vocacional (`/datos/carreras/test`):** saltar todas las preguntas generó Top 3 válido sin bloquear al usuario (`"Comparar Top 3"` presente).

### Lighthouse Móvil (`127.0.0.1:3099`, headless Chrome local con throttling móvil)

| Ruta | Perf | A11y | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` *(línea base existente)* | **60** | 97 | 100 | `1.583 ms` | `3.639 ms` | `2.857 ms` | `0,0000` |
| `/datos/carreras` | **51** | **97** | **100** | `1.871 ms` | `4.416 ms` | `6.955 ms` | **`0,0240`** |
| `/datos/carreras/medicina` | **57** | **97** | **100** | `1.718 ms` | `3.803 ms` | `4.446 ms` | **`0,0211`** |
| `/datos/carreras/ingenieria-comercial` | **59** | **97** | **100** | `1.839 ms` | `3.627 ms` | `4.263 ms` | **`0,0000`** |
| `/datos/carreras/comparar` | **33** | **100** | **100** | `4.606 ms` | `10.187 ms` | `2.208 ms` | **`0,0000`** |

**Lectura técnica honesta de estos números:**
- **SEO (`100`)** y **CLS (`0,000–0,024`)** cumplen con holgura.
- **Accesibilidad (`97–100`)** supera `>= 95` en todas las rutas; las únicas 2 alertas restantes corresponden al contraste de `#1890ff` sobre blanco/`#e9f4ff` en el botón del gráfico de dispersión (`ScatterSueldoEmpleoChart.tsx:238`) y el badge/puntaje de `MeAlcanza.tsx:59,134,147`.
- **Performance en emulación local móvil (`33–59` vs base `60` del sitio):** el layout compartido de marketing (`/` ya parte en `60` con `2,86 s` de TBT en esta máquina) más la hidratación de tablas/charts Recharts eleva LCP/TBT bajo throttling móvil local. Conviene validar Speed Insights con tráfico real en Vercel Preview antes de asumir el score sintético local.

---

## 6. Checklist §13

- [x] Worktree aislado `C:/dev/pbi-datos-carreras` (`mejora/datos-carreras`) sin tocar el working tree paralelo (`mejora/datos-desempleo`)
- [x] Pipeline oficial `scripts/datos/update-carreras.mjs --local --force` ejecutado sobre los 5 XLSX de `mifuturo.cl` 2025–2026 (`11/11` smoke tests)
- [x] `.github/workflows/datos-carreras.yml` semanal/mensual con apertura automática de PR e Issue si falla
- [x] `/datos`, `/datos/inflacion`, `/datos/carreras`, 165 fichas `● SSG`, 6 presets `○ Static`, 5 herramientas `○ Static`
- [x] `En resumen` citable, JSON-LD válido (`Dataset`, `ItemList`, `FAQPage`, `WebApplication`, `BreadcrumbList`), `< 60` chars en `title` y `140–155` en `description`
- [x] Honestidad estadística explícita: ingresos nacionales (`pesos_de`), diferencias SIES de cohorte (`2020–2024` vs `2023–2024`), aviso PAES promedio de matriculados vs puntaje de corte (`18-01-2027`), distinción `U`/`IP`/`CFT`
- [x] `compartir/[a]/[b]` con `ImageResponse` en `1080x1350`, `1080x1920`, `1200x630`, `?test=1` y `404` ante slugs inválidos + caché inmutable 1 año
- [x] Solo 4 archivos compartidos editados (`app/sitemap.ts`, `Navbar.tsx`, `Footer.tsx`, `.gitignore`); cero cambios en precios, `vercel.json`, `robots.ts` ni rutas existentes
- [x] `10/10` tests en `tests/datos/run-tests.mjs`, ESLint `0` errores, `npm run build` exitoso (`1489/1489`), `26/26` rutas live en `200`, Playwright `0` `pageErrors`
- [ ] **Pendiente opcional menor:** reemplazar los últimos 2 usos de `#1890ff` en texto/botón por `#1063b8` en `MeAlcanza.tsx` y `ScatterSueldoEmpleoChart.tsx` para lograr `A11y 100` también en fichas y hub, y revisar Performance/INP real en Vercel Preview.

---

## 7. Capturas y tarjetas PNG generadas

Ubicadas en `C:/Users/manue/.gemini/antigravity/brain/9ef9dc16-bc62-45f6-9045-3a6d04186189/capturas/`:
- **Pantallas web (post-build final):** `hub-desktop.png`, `hub-mobile.png`, `ficha-medicina-desktop.png`, `ficha-medicina-mobile.png`, `comparar-desktop.png`, `comparar-mobile.png`
- **Tarjeta compartible estándar (`1080x1350`):** `tarjeta-compartir-1080x1350.png` (`Medicina` vs `Ingeniería Comercial`)
- **5 tarjetas del Kit de difusión (`1080x1350`):**
  1. `kit-1-top-u.png` (`Medicina` `$3.719.393` vs `Ingeniería Civil Metalúrgica` `$3.508.658`)
  2. `kit-2-tecnicas.png` (`Técnico en Minería` CFT `$1.868.826` vs `Técnico en Mecánica Industrial` CFT `$1.593.798`)
  3. `kit-3-empleabilidad.png` (`Medicina` `90,9 %` / `$3.719.393` vs `Enfermería` `78,6 %` / `$1.832.131`)
  4. `kit-4-crecieron.png` (`Ingeniería Civil en Minas` `$3.432.022` vs `Geología` `$2.919.331`)
  5. `kit-5-datos.png` (`Ingeniería Civil en Computación e Informática` `$2.683.432` vs `Ingeniería en Matemática y Estadística` `$2.397.935`)

---

## 8. Pendientes de Manu antes/después del despliegue

1. **Configurar `BCCH_API_TOKEN`:** agregar el secreto `BCCH_API_TOKEN` en GitHub (`Settings → Secrets and variables → Actions`) para `.github/workflows/datos-carreras.yml` y en Vercel Environment Variables para actualizaciones automáticas del IPC mensual del Banco Central de Chile.
2. **Registrar Dimensiones Personalizadas en GA4** (Propiedad de ProgramBI → *Admin → Definiciones personalizadas → Crear dimensión personalizada*, alcance *Evento*) correspondientes a los parámetros reales enviados por `components/datos/*`:
   - Eventos emitidos: `datos_view`, `datos_preset_view`, `datos_filter`, `datos_search`, `datos_compare`, `datos_calc`, `datos_quiz`, `datos_quiz_result`, `datos_share`, `datos_download`, `datos_whatsapp_click`.
   - Parámetros clave a registrar como dimensiones personalizadas: `pagina`, `slug`, `tipo`, `calculadora`, `preset`, `formato`, `recurso`, `slugs`, `termino`, `paso`, `accion`, `origen`.
3. **Revisar el primer Pull Request automático** que abrirá `.github/workflows/datos-carreras.yml` (lunes de dic/ene a las 11:00 CLT y día 10 de cada mes) validando que `meta.json` y el resumen del PR reflejen cambios coherentes antes de aprobar el auto-merge.
4. **Monitorear Vercel Spend Management y Speed Insights:** activar/revisar límites en Vercel Pro tras hacer deploy en Preview, y comparar los Core Web Vitals reales de campo (LCP/INP en Chile 4G) frente a los tiempos sintéticos de Windows.
5. **Nota de merge con `mejora/datos-desempleo` (otro LLM en paralelo):**
   Los únicos archivos del repositorio base modificados por esta rama son exactamente 4:
   - `app/sitemap.ts` (añadió imports de `@/lib/datos/*` + parámetro opcional `images?: string[]` en `entrada()` + array `datosCarrerasPages`)
   - `components/shared/Navbar.tsx` (añadió ítem `/datos` en `RECURSOS_LINKS` y filtro `paisNav === ISO_CHILE`)
   - `components/shared/Footer.tsx` (añadió `<Link href="/datos">` condicional para `ISO_CHILE`)
   - `.gitignore` (añadió `/data/carreras/raw/`)
   Al hacer merge de `mejora/datos-carreras` y `mejora/datos-desempleo` hacia `main`:
   - Si `mejora/datos-desempleo` también editó `app/sitemap.ts`, `Navbar.tsx` o `Footer.tsx`, **mantener ambas entradas** (ej. enlazar `/datos` como hub común que agrupe Carreras, Inflación y Desempleo, y conservar tanto `datosCarrerasPages` como las rutas de desempleo en `app/sitemap.ts`, preservando `uniqueEntries()` y `images?: string[]`).
   - El directorio `app/(marketing)/datos/page.tsx` y `app/(marketing)/datos/layout.tsx` pertenecen a esta rama como hub común: al integrar Desempleo, bastará agregar la tarjeta de Desempleo al grid de categorías de `app/(marketing)/datos/page.tsx`.

---

## 9. Kit de difusión (§15)

### A. 5 tarjetas PNG `1080x1350` listas para publicar
Ya descargadas y verificadas visualmente en `capturas/kit-1-top-u.png` .. `capturas/kit-5-datos.png` (regenerables en producción desde `/datos/carreras/compartir/...`).

### B. 3 guiones cortos (TikTok / Instagram Reels, 35–45 s)

1. **Guion 1 — "¿Qué carreras técnicas pagan casi lo mismo que muchas universitarias?"** *(apoyado en `kit-2-tecnicas.png`)*
   - **Gancho (0–3 s):** *"¿Sabías que una carrera técnica de 7 semestres puede superar los $1,8 millones al 4.º año?"*
   - **Dato (3–18 s):** *"Según los datos oficiales de mifuturo.cl 2025–2026 en ProgramBI, Técnico en Minería en CFT promedia **$1.868.826 brutos al 4.º año** (81,0 % empleabilidad), y Técnico en Mecánica Industrial logra **88,0 % de empleabilidad al 1.er año** con **$1.593.798** en apenas **6,4 semestres reales**."*
   - **Matiz honesto (18–28 s):** *"Ojo: estos son promedios brutos nacionales; por eso siempre revisa el rango P10–P90 y el arancel de cada institución antes de postular."*
   - **CTA (28–35 s):** *"Compara las 165 carreras oficiales gratis en `programbi.com/datos/carreras`."*

2. **Guion 2 — "Misma área, doble sueldo o doble tiempo: Medicina vs Enfermería"** *(apoyado en `kit-3-empleabilidad.png`)*
   - **Gancho (0–3 s):** *"Antes de postular al área Salud, mira estas dos cifras frente a frente."*
   - **Dato (3–20 s):** *"Según SIES 2025–2026, Medicina promedia **$3.719.393 al 4.º año** y **90,9 % de empleabilidad**, pero toma **15,1 semestres reales** en promedio y un arancel mediano sobre $10 millones al año. Enfermería promedia **$1.832.131** al 4.º año y **78,6 %** al 1.er año en **12,1 semestres**."*
   - **Cierre (20–32 s):** *"Más allá del promedio, también importa saber cuántos meses de sueldo te cuesta la carrera. Calcula tu retorno estimado en `programbi.com/datos/carreras/retorno`."*

3. **Guion 3 — "No todo es Ingeniería Comercial: datos reales en Tecnología y Datos"** *(apoyado en `kit-5-datos.png`)*
   - **Gancho (0–3 s):** *"Si te gustan los datos o programar, ¿conviene más Informática o Matemática y Estadística?"*
   - **Dato (3–22 s):** *"En cifras oficiales 2025–2026: Ingeniería Civil en Computación e Informática promedia **$2.683.432 al 4.º año** con **88,5 % de empleabilidad**. Ingeniería en Matemática y Estadística promedia **$2.397.935**, pero tiene **89,7 % de empleabilidad** al 1.er año y menor duración real (**13,4 vs 14,1 semestres**)."*
   - **CTA (22–32 s):** *"Explora el especial de Tecnología y Datos y el comparador oficial en `programbi.com/datos/carreras/tecnologia-y-datos`."*

### C. Párrafo listo para orientadores vocacionales y prensa
> ProgramBI habilitó un observatorio abierto y gratuito sobre empleabilidad, ingresos y costos reales de la educación superior en Chile (`https://www.programbi.com/datos/carreras`), construido íntegramente con las bases públicas del Servicio de Información de Educación Superior (SIES / mifuturo.cl, edición 2025–2026) y las series de IPC para contraste en poder adquisitivo actual. La plataforma reúne **165 carreras genéricas** y **9.898 programas con oferta 2026** en universidades, institutos profesionales y CFT, permitiendo a estudiantes, familias y orientadores revisar la dispersión salarial por percentiles (P10 a P90), duración real promedio, aranceles y empleabilidad al primer año, además de comparar hasta tres carreras lado a lado sin registro previo.

### D. Post de LinkedIn para Manu
> Acabamos de publicar en **ProgramBI** nuestro observatorio abierto de **Carreras de Chile**: **165 carreras genéricas**, **9.898 programas con oferta 2026** y todos los datos oficiales de `mifuturo.cl` (SIES) en un solo lugar, gratis y sin login: 👉 `https://www.programbi.com/datos/carreras`
>
> Al cruzar todas las planillas oficiales 2025–2026 aparecen matices clave que pocas tablas resumen cuentan bien:
> • En universidades, el tope al 4.º año lo lideran **Medicina ($3.719.393)** e **Ingeniería Civil Metalúrgica ($3.508.658)**, con duraciones reales de **15,1** y **17,1 semestres**.
> • En institutos y CFT hay rutas técnicas mucho más cortas con ingresos altos, como **Técnico en Minería ($1.868.826 al 4.º año en CFT)** o **Técnico en Mecánica Industrial (88,0 % empleabilidad en 6,4 semestres reales)**.
> • Dentro de una misma carrera la brecha interna es enorme: en **Ingeniería Comercial (U)** el 10 % que menos gana al 5.º año percibe hasta **$881.696**, mientras el 10 % superior supera los **$4.049.238**.
>
> Incluye buscador con sinónimos, comparador lado a lado con descarga de tarjetas, estimador de arancel vs. sueldo, calculadora de IPC y un especial de carreras de Tecnología y Datos (`https://www.programbi.com/datos/carreras/tecnologia-y-datos`).
>
> Si conoces a alguien rindiendo la PAES o evaluando qué estudiar en 2027, compártelo. ¿Qué otro cruce oficial de Chile te gustaría ver en `/datos`?

---

VEREDICTO: AMARILLO
