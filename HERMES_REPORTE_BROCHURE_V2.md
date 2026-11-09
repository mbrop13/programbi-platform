# HERMES REPORTE — Brochure PDF V2 (Visor Estudio A4 + PDF 1:1 WYSIWYG)

**Fecha:** 9 de noviembre de 2026
**Rama:** `mejora/brochure-pdf-v2`
**Commit final:** `8f8be96` (push a `origin/mejora/brochure-pdf-v2` OK)
**Base:** `origin/main` @ `eb40be3`
**Worktree:** `C:\dev\pbi-brochure-v2`

---

## 1. Resumen ejecutivo

Se ejecutó de principio a fin el encargo `HERMES_ENCARGO_BROCHURE_V2.md` con 10 sub-bots en paralelo (WS1–WS10), cada uno en su worktree y rama `feat/bv2-wsN`, integrados después en `mejora/brochure-pdf-v2`.

El resultado es un **Visor Estudio de PDF** en `/cursos/[slug]/brochure` y `/{pais}/cursos/[slug]/brochure`:

- **Sin Navbar, Footer ni MarketingChrome**: la ruta se comporta como visor de documento a pantalla completa.
- **Hojas A4 reales de 794 × 1123 px** (210 × 297 mm), fondo de estudio oscuro, sombra de papel, barra fija tipo Adobe/Chrome PDF, zoom 75/100/125 %, conmutador “Vista Hojas A4” / “Visor PDF Nativo”, índice lateral, miniaturas, selector de país/moneda, Descargar PDF, Imprimir y CTA de inscripción.
- **PDF descargado 1:1 con la vista previa**: cada hoja se captura con `html-to-image` (`toCanvas`, `pixelRatio: 2.5` → 1985 × 2808 px), se inserta como página A4 completa en `jsPDF` y se superponen **enlaces clicables reales** (`doc.link`) sobre los botones de inscripción y WhatsApp.
- **Activos 100 % locales y visibles en el PDF**: logo real de ProgramBI, foto hero de cada curso, 3 fotos de profesores en `/images/mentors/*.jpg`, capturas reales de dashboards/clases, los 12 logos de empresas clientes y vista previa del certificado oficial.
- **Respaldo vectorial con imágenes reales** si la captura DOM fallara: el PDF nunca sale sin logo, fotos ni logos de empresas.

**Estado de verificación:** `tsc` 0 errores · `npm run build` OK (838/838 páginas) · `verificar-brochure-v2.mjs` **107/107** · `verificar-gate-pdf.mjs` **57/57** · descarga real de PDF probada en Chrome (6 páginas, 8 enlaces, 2,68 MB).

---

## 2. Problemas diagnosticados y solución aplicada

| Problema reportado | Causa raíz | Solución |
|---|---|---|
| La página del brochure “parecía una web normal” | Se renderizaba dentro del layout de marketing, con Navbar, Footer y MarketingChrome | WS3: early-return `null` en los tres componentes cuando `pathname.endsWith("/brochure")`. WS9: visor estudio oscuro a pantalla completa. |
| El PDF no se parecía a la vista | `generate-course-pdf.ts` dibujaba cajas con `jsPDF` (`rect` + Helvetica) sin imágenes | WS8: motor primario 1:1 capturando las hojas A4 del DOM con `html-to-image` + `jsPDF`, más respaldo vectorial con activos reales. |
| No aparecía el logo de ProgramBI | El PDF escribía texto plano “ProgramBI” | Logo real `/images/logo.png` en cabecera de todas las hojas y del PDF; `/images/logo-nav.webp` en la barra del visor. |
| No aparecían fotos de profesores | `mentors.ts` apuntaba a `mail.programbi.com` sin cabeceras CORS; `fetch(..., { mode: "cors" })` fallaba siempre | WS1: descarga local a `public/images/mentors/*.jpg` (3 JPEG 1024×1024, 630–659 KB) y `imageUrl` same-origin. |
| No aparecían logos de empresas | El PDF unía nombres con puntos | WS1/WS4/WS6: `BROCHURE_COMPANY_LOGOS` con los 12 WebP locales, renderizados como `<img>` en portada y hoja de equipo. |
| No aparecían capturas de dashboards/clases | El PDF ignoraba la galería | WS1: `getCourseGalleryForBrochure(slug)` con galerías reales por stack; WS6: hoja de proyectos con 3 capturas en marco de ventana. |
| El PDF salía “horrible” y distinto | No existía captura WYSIWYG ni paginación A4 real | WS4: hoja A4 exacta; WS5–WS7: portada, inversión, proyectos, equipo y temario; WS8: captura y ensamblado A4. |

---

## 3. Arquitectura entregada

### 3.1 Contrato compartido (orquestador)

- `lib/brochure/brochure-assets.ts`
  - `BROCHURE_BRAND_LOGOS` (`main`, `nav`, `square`).
  - `BROCHURE_COMPANY_LOGOS`: 12 empresas con logo local.
  - `getCourseGalleryForBrochure(slug)`: 3–4 capturas reales según curso/stack.
  - `brochurePdfFileName(data)`.
- `lib/brochure/brochure-pages.ts`
  - `planBrochureSyllabus(data)`: paginación determinista del temario, sin cortar módulos.
  - `brochureTotalPages(data)`: 4 hojas fijas + hojas de temario.
- `lib/brochure/brochure-data.ts` enriquecido con:
  - `brandLogoUrl`, `brandLogoNavUrl`, `companyLogos`, `galleryImages`, `methodologyPillars`.
  - `profesores` con `imageUrl` local, `studentCount`, `yearsExperience`, `linkedinUrl`.
  - `imageUrl` del curso resuelta a la foto hero `<slug>.jpg`.

### 3.2 Workstreams integrados

| WS | Entregable | Archivos |
|---|---|---|
| WS1 | Retratos locales y activos verificados | `public/images/mentors/*.jpg`, `lib/data/mentors.ts` |
| WS2 | Cargador universal de imágenes a PNG base64 | `lib/brochure/image-loader.ts` |
| WS3 | Sin chrome web en `/brochure` | `Navbar.tsx`, `Footer.tsx`, `MarketingChrome.tsx` |
| WS4 | Hoja A4 exacta y cabecera institucional | `BrochureA4Sheet.tsx`, `BrochureBrandHeader.tsx` |
| WS5 | Portada ejecutiva + inversión/calendario | `BrochureCoverSheet.tsx`, `BrochurePricingScheduleSheet.tsx` |
| WS6 | Resultados/galería/certificado + equipo y empresas | `BrochureShowcaseSheet.tsx`, `BrochureFacultySheet.tsx` |
| WS7 | Temario completo paginado + panel de inscripción | `BrochureSyllabusSheets.tsx` |
| WS8 | Motor PDF 1:1 + respaldo con imágenes | `lib/brochure/generate-course-pdf.ts` |
| WS9 | Visor estudio A4 | `components/brochure/CourseBrochureClient.tsx` |
| WS10 | Suite de verificación | `scripts/verificar-brochure-v2.mjs`, `verificar-gate-pdf.mjs` |

### 3.3 Visor Estudio (`CourseBrochureClient.tsx`)

- Barra superior fija `#111318` con logo real, nombre del archivo `Brochure_ProgramBI_<slug>_<PAIS>.pdf`, insignia “N páginas A4 · Vista previa 1:1”.
- Zoom − / % / + (75 %, 100 %, 125 %), conmutador “Vista Hojas A4” / “Visor PDF Nativo” (Blob URL en `<iframe>`), selector de país/moneda.
- Acciones: Descargar PDF con progreso “Generando pág. X/N…”, Imprimir, PDF oficial (si el curso tiene `customPdfUrl`), Inscribirme Ahora y WhatsApp.
- Layout `#181A20` con sidebar de índice y miniaturas (xl), lienzo central con hojas A4 reales y escala responsiva; `@media print` con `@page A4 portrait; margin: 0`, ocultando toda la UI.
- Hojas mantenidas montadas incluso en modo nativo porque el generador las captura desde `sheetsRef`.

### 3.4 Motor PDF (`generate-course-pdf.ts`)

- **Camino primario:** espera `document.fonts.ready`, convierte cada `<img>` a `data:image/png;base64` con `inlineAllImagesInElement`, captura cada `[data-brochure-sheet]` con `toCanvas` (`pixelRatio: 2.5`, 1985 × 2808), inserta JPEG 0.94 a `210 × 297 mm` y añade `doc.link(x, y, w, h, { url })` para cada `[data-pdf-link]`.
- **Respaldo:** si no hay hojas o falla la captura, dibuja un PDF vectorial completo con logo, hero, fotos de profesores, galería, logos de empresas, precio, cuotas, horarios y temario.
- Nombre de archivo: `Brochure_ProgramBI_<slug>_<PAIS>.pdf`.

---

## 4. Verificación real ejecutada

### 4.1 Tipos y build

```
npx tsc --noEmit          → EXIT 0
npm run build             → EXIT 0
                            ✓ Compiled successfully in 40s
                            ✓ Generating static pages (838/838)
                            ├ ƒ /[pais]/cursos/[slug]/brochure
                            ├ ƒ /cursos/[slug]/brochure
```

Nota: el build requiere `.env.local` con Supabase (ignorado por git). En el worktree se copió desde el repo principal; no se commiteó ningún secreto.

### 4.2 `node scripts/verificar-brochure-v2.mjs http://127.0.0.1:3220`

```
107/107 verificaciones OK   → EXIT 0
```

Cubre:
- 3 fotos de profesores en disco (> 10 KB, cabecera JPEG), logo de marca y 12 logos de empresas.
- 13 heroes de curso y galerías de 4 cursos.
- HTTP 200 + `content-type` de imagen para cada activo.
- 4 rutas de brochure: `data-brochure-studio="v2"`, hojas `1..5`, logo, 3 fotos locales, cero `mail.programbi.com`, ≥ 8 logos de empresas, ≥ 2 capturas de galería, `CERTIFICADO DE FINALIZACIÓN`, precio local, 3 cuotas, `Hora de`, temario completo, Descargar PDF e Inscribirme.
- Consistencia de país: Chile y Perú muestran montos distintos.

### 4.3 `node scripts/verificar-gate-pdf.mjs http://127.0.0.1:3220`

```
57/57 verificaciones OK   → EXIT 0
```

Se preservaron las 49 verificaciones originales y se añadieron 2 por ruta de brochure (`data-brochure-studio="v2"` y ausencia de `mail.programbi.com`).

### 4.4 QA en navegador real (Chrome headless vía Playwright)

- 6 hojas A4 (portada, inversión, proyectos/certificado, equipo, temario ×2), todas **794 × 1123 px**.
- **0 imágenes rotas** (35 `<img>` verificadas: logo, hero, 3 retratos, 12 logos, galería).
- **0 desbordes/recortes** en `<main>` y en las 13 tarjetas de módulo.
- Sin enlace “Ver Cursos” del Navbar en la página; `data-brochure-studio="v2"` presente.
- Fuente display: Georgia; cuerpo: stack del sistema (WYSIWYG entre preview y captura).

### 4.5 Descarga real del PDF

Prueba con click en “Descargar PDF” en Chrome:

```
Archivo:  Brochure_ProgramBI_power-bi_CL.pdf
Tiempo:   8,7 s
Tamaño:   2.684.360 bytes (2,68 MB)
Páginas:  6
Enlaces:  8 anotaciones /URI
Imágenes: 6 JPEG (una por página)
MediaBox: 595,28 × 841,89 pt (A4 exacto)
```

Se extrajo la página 1 del PDF y se revisó visualmente: logo, foto hero, KPIs, metodología y los 8 logos de empresas aparecen completos y nítidos, idénticos a la vista previa.

---

## 5. Ajustes de calidad realizados durante la integración

1. **Horario duplicado** en la hoja de inversión: se oculta `horaChile` cuando es idéntica al horario local (caso Chile).
2. **Paginación del temario**: de 4 hojas casi vacías (3/3/4/3 módulos) a **2 hojas equilibradas (7 + 6 módulos)**, sin superposición con el panel de inscripción.
3. **Legibilidad**: se subieron tipografías y padding de las tarjetas de módulo (tópicos 8,8 px, títulos 11 px) y se distribuyó el contenido verticalmente.
4. **Hojas 2–4**: se rellenó el espacio inferior con distribución flex, una fila de métricas en la tarjeta de precio, galería más alta, certificado más grande y logos de empresas más legibles.
5. **Certificado**: texto corregido a “Se certifica la finalización del programa”.
6. **PDF oficial**: se conservó el enlace a `customPdfUrl` cuando el curso lo tenga.
7. **Script de verificación**: el extractor de montos ahora ignora `<script>`/`<style>` (los nombres de chunk tipo `...s/7289.js` se confundían con soles).

---

## 6. Archivos y métricas del cambio

```
22 archivos cambiados
+6.805 líneas / −1.156 líneas
```

Nuevos:
- `lib/brochure/brochure-assets.ts`
- `lib/brochure/brochure-pages.ts`
- `lib/brochure/image-loader.ts`
- `components/brochure/BrochureA4Sheet.tsx`
- `components/brochure/BrochureBrandHeader.tsx`
- `components/brochure/pages/BrochureCoverSheet.tsx`
- `components/brochure/pages/BrochurePricingScheduleSheet.tsx`
- `components/brochure/pages/BrochureShowcaseSheet.tsx`
- `components/brochure/pages/BrochureFacultySheet.tsx`
- `components/brochure/pages/BrochureSyllabusSheets.tsx`
- `scripts/verificar-brochure-v2.mjs`
- `public/images/mentors/manuel-oliva.jpg`, `emanuel-berrocal.jpg`, `rodrigo-vega.jpg`

Reescritos:
- `lib/brochure/generate-course-pdf.ts`
- `components/brochure/CourseBrochureClient.tsx`

Modificados:
- `lib/brochure/brochure-data.ts`
- `lib/data/mentors.ts`
- `components/shared/Navbar.tsx`, `Footer.tsx`, `MarketingChrome.tsx`
- `scripts/verificar-gate-pdf.mjs`

---

## 7. Comandos reproducibles

```bash
cd C:/dev/pbi-brochure-v2
npx tsc --noEmit
npm run build
npx next start -p 3220
node scripts/verificar-brochure-v2.mjs http://127.0.0.1:3220
node scripts/verificar-gate-pdf.mjs http://127.0.0.1:3220
```

---

## 8. Estado final y notas

- **Rama publicada:** `origin/mejora/brochure-pdf-v2` (commit `8f8be96`). `origin/main` no se modificó.
- **Limpieza:** worktrees `C:\dev\pbi-bv2-ws1` … `ws10` eliminados; ramas `feat/bv2-ws1…10` eliminadas tras el merge; `C:\dev\pbi-bv2-prompts` eliminado; scripts de QA temporales y `.build_v2.log` borrados.
- **Worktrees restantes:** solo los preexistentes del proyecto; `pbi-brochure-v2` limpio.
- **Aviso local:** en `next start` aparece un 404 de `/_vercel/insights/script.js` (analytics de Vercel fuera de Vercel). No afecta al brochure ni al PDF.
- **Requisito de build:** `.env.local` con Supabase debe existir en el entorno de build; está en `.gitignore`.
- **Navegador:** la generación 1:1 usa canvas + `html-to-image`; funciona en Chrome/Edge/Firefox modernos. En navegadores restringidos se activa el respaldo vectorial con imágenes reales.
