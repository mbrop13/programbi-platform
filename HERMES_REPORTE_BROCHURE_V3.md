# HERMES REPORTE FINAL — Brochure V3 + Formulario Siempre Visible y Rediseñado

Fecha: 2026-11-09  
Rama de trabajo: `mejora/brochure-pdf-v3`  
Commit base: `origin/main` (`94f9da9`)  

---

## 1. Resumen Ejecutivo de Mejoras V3

Atendiendo directamente el feedback del usuario:
> *"ahora no aparece el formulario en las paginas de los cursos para descargar el pdf deberia de ser mucho mejor osea esta genial pero podria ser mejor los textos mas grandes y cosas asi"*

Se completaron e integraron exitosamente los 8 frentes de trabajo:

### A. Formulario Siempre Visible y con Tipografía Grande en Fichas de Curso (`WS1`)
- **Problema previo:** En `app/(marketing)/cursos/[slug]/CourseDetailClient.tsx`, la lógica `canSeePrice = isLoggedIn || priceUnlocked` ocultaba completamente `<BrochureGateForm>` cuando el visitante estaba logueado o ya había solicitado el brochure antes, reemplazándolo por el precio sin gate.
- **Solución V3:**
  - El formulario `<BrochureGateForm>` ahora se renderiza **SIEMPRE** en el panel lateral de las fichas de curso (`/cursos/[slug]` y `/{pais}/cursos/[slug]`), garantizando que cualquier usuario pueda volver a descargar el PDF o solicitarlo a otro correo.
  - Pre-llenado inteligente si ya existen datos previos guardados (`nombre`, `email`, `teléfono`).
  - Tras el envío exitoso, el formulario no desaparece bruscamente: muestra confirmación destacada con acceso directo en nueva pestaña al Visor/PDF y un CTA secundario a WhatsApp/Inscripción.
  - Rediseño visual con fuentes grandes (`20px–24px` en encabezados, `15px` en beneficios con checks verdes, etiquetas claras sobre cada input de `h-12 text-base` y botón CTA principal de `h-13 text-base font-bold`).

### B. Separación de Páginas A4 y Tipografía Grande en el Brochure PDF (`WS2` a `WS7`)
- **Problema previo:** Para comprimir la información en pocas páginas, se usaban fuentes diminutas (de `6px` a `8.8px`), apretando precios, horarios y temarios.
- **Solución V3:**
  - **Página 2 (Inversión & Cuotas):** Dedicada exclusivamente al arancel oficial en moneda local (**`52px` bold**), 3 cuotas sin interés (**`20px` bold**), badges de medios de pago locales, caja "Qué incluye tu inscripción" con viñetas destacadas y métricas de garantía académica.
  - **Página 3 (Fechas & Horarios):** Nueva página independiente con las próximas fechas de inicio, horario en la zona horaria del país del visitante y tabla comparativa internacional de husos horarios ("La misma clase en vivo en cada país").
  - **Páginas 4 y 5 (Showcase & Docentes):** Fuentes ampliadas (cuerpos `13px–15px`, títulos `28px–34px`), fotos nítidas sin CORS, 12 logos empresariales reales, capturas de dashboards y vista previa del certificado oficial.
  - **Páginas 6 a N (Temario Módulo a Módulo):** Algoritmo de paginación que distribuye como máximo 4 módulos por hoja A4, elevando los títulos de módulo a `15px` bold y los tópicos a `12.5px–13px`, evitando cualquier desborde vertical.

---

## 2. Pruebas y Verificaciones Automatizadas (100% OK)

1. **TypeScript (`tsc --noEmit`):** `EXIT 0` (cero errores en toda la plataforma).
2. **Suite de Verificación Brochure V2/V3 (`scripts/verificar-brochure-v2.mjs`):**
   - **`119/119` pruebas pasadas exitosamente (100%).**
   - Comprobadas hojas A4 fijas, tipografía `>= 10.5px`, logos locales, 3 profesores, horarios por país, cuotas sin interés y temario completo en Chile (`CL`), Perú (`PE`), México (`MX`) y Colombia (`CO`).
3. **Suite de Verificación Gate & Formulario (`scripts/verificar-gate-pdf.mjs`):**
   - **`77/77` pruebas pasadas exitosamente (100%).**
   - Comprobada la presencia obligatoria y visible del formulario en todas las fichas de cursos, protección de precios y flujo completo.
4. **Next.js Production Build (`next build --webpack`):**
   - **`838/838` páginas estáticas generadas exitosamente sin errores.**
