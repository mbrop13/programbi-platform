# HERMES — Reporte de ejecución: Gate de precios + Brochure PDF + Horarios por país + Email automático

**Fecha:** 7 de noviembre de 2026
**Rama:** `mejora/gate-pdf-precios-horarios`
**Worktree integrador:** `C:\dev\pbi-gate-pdf`
**Repo:** `github.com/mbrop13/programbi-platform`
**Commit de código:** `b4af6cc` (la rama suma además los commits de documentación de este reporte)
**Push:** ✅ `origin/mejora/gate-pdf-precios-horarios` (18 commits, 61 archivos, +4.541 / −1.053)
**PR / preview:** https://github.com/mbrop13/programbi-platform/pull/new/mejora/gate-pdf-precios-horarios
**Rama publicada:** https://github.com/mbrop13/programbi-platform/tree/mejora/gate-pdf-precios-horarios

---

## 1. Resumen ejecutivo

Se ejecutó el encargo completo con **8 sub-bots en paralelo** (WS1–WS8), cada uno en su
worktree `C:\dev\pbi-gp-wsN` y su rama `feat/gp-wsN`, todos con `opencode-go` /
`deepseek-v4.1-flash`, y se integraron en el worktree `C:\dev\pbi-gate-pdf`.

Estado final, verificado con ejecución real:

| Verificación | Resultado |
|---|---|
| `npx tsc --noEmit` | **EXIT 0**, sin errores |
| `npm run build` (`next build --webpack`) | **EXIT 0**, 838 páginas generadas |
| Smoke `node scripts/verificar-gate-pdf.mjs` | **49/49 OK**, EXIT 0 |
| Barrido del sitemap completo (541 URLs) | **0 fugas de precio** en el HTML, 0 errores de red |
| `git push -u origin` | **OK** |

Lo que quedó funcionando de punta a punta:

1. **Ningún precio en el HTML público.** Fichas, catálogo, `/precios`, home (Chile y países),
   landings de curso, guías, comparativas y referidos entregan HTML sin montos. El precio se
   calcula y se muestra **solo en cliente y solo después de desbloquear**.
2. **Formulario de 3 campos** (Nombre, Email, Teléfono/WhatsApp con prefijo automático por país)
   en la tarjeta lateral de cada ficha. Al enviarlo: abre el **brochure PDF en pestaña nueva**,
   guarda el lead en `course_leads` y desbloquea precios + botón de compra en toda la web
   (`localStorage` + cookie de 90 días + evento `pb:price-unlocked`).
3. **Brochure PDF por curso y país** en `/cursos/[slug]/brochure` y `/{pais}/cursos/[slug]/brochure`:
   dossier imprimible A4 + descarga real con `jsPDF`, con aranceles en moneda local, 3 cuotas,
   fechas y horarios en hora del país, equipo docente con fotos reales y temario completo.
4. **Horarios adaptados al país** en fichas, catálogo, brochure y correo, con etiqueta explícita
   (`· Hora de Chile`, `· Hora de Perú`, `· Hora de México`).
5. **Email automático mejorado**: banner al brochure, tarjetas con arancel, cuotas, horario local,
   “Lo que aprenderás”, equipo docente con fotos y CTA de inscripción.
6. **Backend**: `/api/leads/create` unifica `contact/personal/brochure_pdf`, tolera
   `pricing_variant` si la columna no existe y devuelve `brochureUrl`; nueva API
   `/api/courses/brochure` (GET público, POST admin); `/admin/formularios` con badge de brochure.

---

## 2. Los 8 workstreams

| WS | Rama | Commit | Archivos | Entrega |
|---|---|---|---|---|
| **WS1** | `feat/gp-ws1` | `bd52841` | 7 | Estado de desbloqueo (`lib/pricing-gate.ts`, `hooks/usePriceUnlock.ts`), `paisDesdeZonaHoraria`, `conHoraPais` con etiqueta en todos los países, `detectarPaisCliente`, cookie `pb_geo_country` en `proxy.ts`, `CourseCohortStrip` con país/zona efectivos. |
| **WS2** | `feat/gp-ws2` | `eebdafb` | 5 nuevos (2.076 líneas) | `lib/brochure/brochure-data.ts`, `generate-course-pdf.ts` (jsPDF), `CourseBrochureClient.tsx` (vista A4 imprimible) y las dos rutas de brochure con `robots: noindex, follow`. |
| **WS3** | `feat/gp-ws3` | `4ade913` | 5 | Ficha con gate: sin props de precio (se eliminó `precioTarjeta` y `preciosLocales` del server), formulario de 3 campos, apertura del brochure, desbloqueo, botón de compra y brochure al desbloquear, `Folleto` con scroll al gate, otros cursos sin precios, `#cotizar` con teléfono en modo personal. |
| **WS4** | `feat/gp-ws4` | `452060a` | 12 | Catálogo y `ProgramsCatalog` con gate reactivo, `/precios` con `PreciosGateClient` (tabla “En Brochure PDF” + formulario), landings y guías sin montos, `lib/guias/precio.ts` sanea el Markdown de las guías. |
| **WS5** | `feat/gp-ws5` | `117f17d` | 5 | `LeadForm` abre brochure y desbloquea; sin precios en meta descriptions, JSON-LD (`offers` fuera), FAQs y `llms.txt`. |
| **WS6** | `feat/gp-ws6` | `a987402` | 4 | `/api/leads/create` unificado + `brochureUrl` + fallback de `pricing_variant`; `/api/courses/brochure`; `/admin/formularios` con badge; migración `20261107000000_course_brochure_pdf.sql`. |
| **WS7** | `feat/gp-ws7` | `c5a50d0` | 3 | `quote-data` con `brochureUrl`, `highlights` e `instructors`; `quote-template` con banner, tarjetas enriquecidas y fotos reales; `mailersend` con el link en texto plano. |
| **WS8** | `feat/gp-ws8` | `d63a187` | 2 nuevos | `scripts/verificar-gate-pdf.mjs` (49 verificaciones) y `docs/GATE_PDF_ARQUITECTURA.md`. |

**Orden de integración real:** WS2 → WS1 → WS6 → WS7 → WS3 → WS4 → WS5 → WS8.
**Conflictos de merge: cero** (la propiedad de archivos por workstream se respetó).

Antes de lanzar los bots se commiteó una **base compartida** (`8726691`) con
`lib/pricing-gate.ts`, `hooks/usePriceUnlock.ts` y `components/marketing/BrochureGateForm.tsx`,
para que WS3/WS4/WS5 compilaran contra un contrato único en vez de inventar tres APIs distintas.

---

## 3. Correcciones del orquestador (fuera del mapa de workstreams)

El smoke test y un barrido del sitemap detectaron superficies con precio que **no estaban en el
mapa de archivos del encargo**. Se corrigieron en dos commits (`7397166`, `b4af6cc`):

| Superficie | Qué se hizo |
|---|---|
| `lib/guias/tarjetas.ts` + `components/guias/GuiasDelCurso.tsx` | El hub `/guias` y el bloque de guías de la ficha ya no publican montos. |
| Metas de guías (`app/**/guias/[slug]/page.tsx`) | `description` saneada: era la fuga que quedaba en el `<head>`. |
| `lib/data/seo-ficha/*` | Se quitaron los montos editoriales de la ficha (Power BI y Análisis de datos). |
| `components/marketing/CountryContent.tsx` y `app/(marketing)/curso-power-bi/page.tsx` | CTA al brochure en vez de tarjeta de precio; sin `offers` en el JSON-LD. |
| `app/(marketing)/curso-python`, `curso-sql-online` (`lib/paises/landing-curso.ts`) | FAQ y JSON-LD sin arancel; las landings ya no declaran `Offer`. |
| `components/marketing/Programs.tsx` + `app/(marketing)/page.tsx` + `app/(marketing)/cursos/page.tsx` | La home por país y `/<pais>/cursos` dejaron de recibir `preciosLocales` como prop (viajaba en el flight data). Ahora el precio se calcula en cliente tras desbloquear. |
| `components/comparativas/*` + `lib/comparativas/precios.ts` | `/versus/*` y el listicle: resumen, tabla, FAQ y calculadora sin el arancel propio. La calculadora ahora compara solo con precios de terceros. |
| `components/referrals/*` | `/referidos`: la calculadora de comisiones pasó a un control porcentual y el ejemplo ya no expone el rango de tickets. |

**Barrido final: 541 de 541 URLs del sitemap sin montos en el HTML.**

---

## 4. Verificación reproducible

```bash
cd C:/dev/pbi-gate-pdf
npx tsc --noEmit                 # EXIT 0
npm run build                    # EXIT 0 (next build --webpack)
npx next start -p 3220
node scripts/verificar-gate-pdf.mjs http://127.0.0.1:3220
# 49/49 verificaciones OK · EXIT 0
```

Qué cubre el script (`scripts/verificar-gate-pdf.mjs`):

- **Fichas** `/cursos/power-bi`, `/cursos/analisis-de-datos`, `/pe/cursos/power-bi`,
  `/mx/cursos/python`: 200, sin `169.000 / 338.000 / 349.000 / 169000…`, con
  `name="name"`, `name="email"`, `name="whatsapp"`, `data-gate-form="brochure"` y enlace `/brochure`.
- **Brochures** (las 4 rutas equivalentes): 200, con los 3 profesores, “Hora de”, un monto en
  moneda local, “Descargar PDF” y módulos del temario.
- **`/precios`**: 200, sin montos, con “Desbloquear” y “Brochure”.
- **`/cursos`**: 200 y sin montos.

Además se midió aparte (no está en el script): `/`, `/pe`, `/mx`, `/ar`, `/curso-power-bi`,
`/guias`, `/versus`, `/empresas`, `/referidos` y las 541 URLs del sitemap. Todas sin montos.

---

## 5. Flujo final del visitante

1. Entra a una ficha por ruta con prefijo (`/pe/cursos/power-bi`) o sin prefijo
   (`/cursos/power-bi`). El país se resuelve por URL → cookie `pb_geo_country`
   (`x-vercel-ip-country`) → `programbi_country_iso` → zona horaria IANA → Chile.
2. Ve fechas y horarios en su hora local, pero **ningún precio**. La tarjeta lateral muestra
   “Arancel, fechas y temario en PDF” y el formulario de 3 campos.
3. Al enviar: se abre el brochure en pestaña nueva (síncrono, no lo bloquea el navegador),
   se guarda el lead, se disparan los correos y se desbloquean precios y botón de compra.
4. El brochure se puede descargar como PDF real (`jsPDF`, multipágina) o imprimir en A4.
5. El desbloqueo dura 90 días y aplica a toda la web (catálogo, `/precios`, landings).

---

## 6. Lo que queda para Manu

1. **Ejecutar la migración en Supabase** (idempotente, un solo bloque):

```sql
alter table public.courses add column if not exists brochure_pdf_url text;
comment on column public.courses.brochure_pdf_url is 'URL de un brochure PDF personalizado. Si es null, la web genera el brochure con jsPDF.';
```

2. **Opcional: PDFs propios por curso.** Con la columna anterior, se puede cargar un
   `brochure_pdf_url` por curso vía `POST /api/courses/brochure` (requiere sesión admin). Si está
   vacío, la web genera el brochure automático.
3. **Revisar el preview / abrir el PR** con el link de arriba. No hay deploy automático desde
   este worktree: el preview lo entrega Vercel al abrir el PR.
4. **Probar un envío real** de formulario en el preview para confirmar correo al lead y aviso
   interno (el smoke no envía correos ni genera el PDF en el navegador).

---

## 7. Limitaciones conocidas (honestas)

- **El brochure es accesible por URL directa.** Es parte del diseño: el correo y la pestaña nueva
  apuntan a `/cursos/<slug>/brochure`. El gate protege el HTML de las páginas comerciales, no la
  URL del dossier (que además está `noindex`).
- **Los montos existen en el bundle JS** (necesarios para calcular el precio en cliente). No están
  en el HTML ni en el JSON-LD público, pero un usuario técnico puede leerlos en el código.
- **Guías:** el Markdown fuente (`lib/guias/generado.ts`) conserva cifras históricas; se sanean al
  renderizar (`resolverPrecios`, `tarjetas`, metas). Si se edita el contenido, conviene escribirlo
  sin montos.
- **`pricing_variant`:** la columna ya existe en `course_leads` (migración `20260830000000`); el
  endpoint igual tolera su ausencia por si algún entorno va atrasado.
- **PDF custom:** sin la migración ejecutada, `brochure_pdf_url` se ignora silenciosamente y se
  usa el brochure generado (no rompe nada).
- **Emails:** se validó el HTML y los tipos, no el envío real (requiere SES y un lead real).

---

## 8. Archivos nuevos principales

```
lib/pricing-gate.ts
hooks/usePriceUnlock.ts
components/marketing/BrochureGateForm.tsx
components/marketing/PreciosGateClient.tsx
lib/brochure/brochure-data.ts
lib/brochure/generate-course-pdf.ts
components/brochure/CourseBrochureClient.tsx
app/(marketing)/cursos/[slug]/brochure/page.tsx
app/(pais)/[pais]/cursos/[slug]/brochure/page.tsx
app/api/courses/brochure/route.ts
supabase/migrations/20261107000000_course_brochure_pdf.sql
lib/comparativas/precios.ts
scripts/verificar-gate-pdf.mjs
docs/GATE_PDF_ARQUITECTURA.md
```

Los 8 worktrees `C:\dev\pbi-gp-ws1 … ws8` y los archivos de apoyo (`C:\dev\pbi-gp-prompts`,
`C:\dev\pbi-gp-CONTRATO.md`) fueron eliminados al cierre. Las ramas `feat/gp-ws1 … ws8` se
mantienen en el repo (ya integradas) por trazabilidad.
