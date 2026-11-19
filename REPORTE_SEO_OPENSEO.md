# REPORTE SEO + CONVERSIÓN — TANDA 3 (`mejora/seo-openseo`)

- **Rama:** `mejora/seo-openseo` (creada desde `main` `92aadb1`; **sin merge a `main`**).
- **Alcance:** OpenSEO + Search Console + GA4 (19 nov 2026), complementando la Tanda 2 (`aad6afa`) sin sobrescribir sus títulos ni el bloque único de Argentina, y conservando intactos los precios de `main` (`92aadb1`), slugs, `vercel.json`, `app/robots.ts` y `app/sitemap.ts`.

---

## 1. Tabla de verificación sobre HTML renderizado (`next start`)

Extraído directamente del servidor de producción (`npx next start -p 3300`) tras el build final (`1131/1131` páginas, `0` errores ESLint, `0` errores TypeScript):

| URL | Status | `<title>` (largo) | `<meta name="description">` (largo) | `H1` | Canonical | `meta robots` | «En resumen» HTML | Enlaces internos a ficha |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/pe` | 200 | `Cursos de datos en vivo para Perú \| ProgramBI` (45) | 148 chars | `Cursos de análisis de datos en vivo para Perú` | `https://www.programbi.com/pe` | index, follow *(default)* | No | `4` enlaces a `/pe/cursos/power-bi` |
| `/pe/cursos` | 200 | `Cursos de datos en vivo en Perú: SQL, Python, Power BI y más` (60) | 154 chars | `Cursos de Power BI, SQL y análisis de datos en Perú` | `https://www.programbi.com/pe/cursos` | index, follow *(default)* | No | `5` enlaces a `/pe/cursos/power-bi` |
| `/pe/cursos/power-bi` | 200 | `Curso de Power BI en Perú: en vivo, con certificado` (51) | 154 chars | `Curso Power BI en vivo en Perú` | `https://www.programbi.com/pe/cursos/power-bi` | index, follow *(default)* | **Sí** | `3` internos PE + `/pe/cursos/excel` *(frase literal `"curso de Power BI en Perú"` + bloque Excel y Power BI verificados)* |
| `/pe/guias/como-aprender-power-bi-en-peru` | 200 | `Cómo aprender Power BI en Perú (2026): ruta y curso` (51) | 145 chars | `Cómo aprender Power BI en Perú: guía práctica para analistas` | `https://www.programbi.com/pe/guias/como-aprender-power-bi-en-peru` | index, follow *(default)* | No | `11` enlaces a `/pe/cursos/power-bi` (intro, cuerpo y CTA) |
| `/cursos` | 200 | `Cursos de datos en vivo en Chile: Power BI, SQL, Python y Excel` (63) | 135 chars | `Cursos de Power BI, SQL y análisis de datos en Chile` | `https://www.programbi.com/cursos` | index, follow *(default)* | No | `31` enlaces a fichas `/cursos/*` |
| `/cursos/power-bi` | 200 | `Curso de Power BI en Chile: en vivo y con certificado` (53) | 149 chars | `Curso Power BI en vivo en Chile` | `https://www.programbi.com/cursos/power-bi` | index, follow *(default)* | **Sí** | `11` enlaces (`/cursos/excel`, `/cursos/sql-server`, etc.) + CTA móvil y fin de temario |
| `/cursos/sql-server` | 200 | `Curso de SQL en Chile: SQL Server en vivo, de básico a avanzado` (63) | 147 chars | `Curso SQL Server en vivo en Chile` | `https://www.programbi.com/cursos/sql-server` | index, follow *(default)* | **Sí** | `11` enlaces (`/cursos/power-bi`, `/cursos/analisis-de-datos`, etc.) + CTA móvil y fin de temario |
| `/cursos/python` | 200 | `Curso de Python para datos en Chile: desde cero y en vivo` (57) | 147 chars | `Curso de Python desde cero para datos, en vivo en Chile` | `https://www.programbi.com/cursos/python` | index, follow *(default)* | **Sí** | `10` enlaces (`/cursos/analisis-de-datos`, `/cursos/machine-learning`, etc.) + CTA móvil y fin de temario |
| `/cursos/analisis-de-datos` | 200 | `Curso de Análisis de Datos en Chile: SQL, Power BI y Python` (59) | 149 chars | `Curso de análisis de datos en vivo en Chile` | `https://www.programbi.com/cursos/analisis-de-datos` | index, follow *(default)* | **Sí** | `14` enlaces (`/cursos/sql-server`, `/cursos/power-bi`, `/cursos/python`) + CTA móvil y fin de temario |
| `/guias/sueldo-analista-de-datos-latinoamerica` | 200 | `Sueldo de analista de datos en Latinoamérica (2026)` (51) | 150 chars | `Sueldo de analista de datos en Latinoamérica: cifras por país con fuente` | `https://www.programbi.com/guias/sueldo-analista-de-datos-latinoamerica` | index, follow *(default)* | No | `16` enlaces (`/cursos/analisis-de-datos` verificado) |
| `/guias/power-bi-vs-excel` | 200 | `Power BI vs Excel: diferencias y cuándo usar cada uno` (53) | 126 chars | `Power BI vs Excel: qué los diferencia y cuándo conviene cada uno` | `https://www.programbi.com/guias/power-bi-vs-excel` | index, follow *(default)* | No | `21` enlaces (`/cursos/power-bi` verificado) |
| `/guias/certificacion-pl-300-power-bi` | 200 | `Certificación PL-300 Power BI: guía, examen y temario 2026` (58) | 149 chars | `Certificación PL-300 de Power BI: qué evalúa, cómo es el examen y cómo prepararte` | `https://www.programbi.com/guias/certificacion-pl-300-power-bi` | index, follow *(default)* | No | `17` enlaces (`/cursos/power-bi` verificado) |
| `/guias/como-usar-claude-para-analisis-de-datos` | 200 | `Cómo usar Claude para análisis de datos (guía 2026)` (51) | 122 chars | `Cómo usar Claude para analizar datos en tu trabajo (sin programar)` | `https://www.programbi.com/guias/como-usar-claude-para-analisis-de-datos` | index, follow *(default)* | No | `9` enlaces (`/cursos/claude`, `/cursos/analisis-de-datos`, `/cursos/power-bi`) |
| `/guias/curso-claude-chile` | 200 | `Curso de Claude en Chile: guía práctica y clases en vivo` (56) | 134 chars | `Cómo usar Claude AI para trabajo administrativo en Chile` | `https://www.programbi.com/guias/curso-claude-chile` | index, follow *(default)* | No | `6` enlaces (`/cursos/claude` verificado) |
| `/blog` | 200 | `Blog — Recursos de análisis de datos \| ProgramBI` (48) | 150 chars | `Blog` | `https://www.programbi.com/blog` | index, follow *(default)* | No | `8` enlaces a fichas |
| `/casos` | 200 | `Testimonios de alumnos de ProgramBI \| ProgramBI` (47) | 152 chars | `Testimonios de alumnos de ProgramBI` | `https://www.programbi.com/casos` | index, follow *(default)* | No | `9` enlaces a fichas |
| `/nosotros` | 200 | `Sobre nosotros — Academia de análisis de datos \| ProgramBI` (58) | 141 chars | `Capacitando a la próxima generación de profesionales de datos` | `https://www.programbi.com/nosotros` | index, follow *(default)* | No | `5` enlaces a fichas |
| `/profesores/manuel-oliva` | 200 | `Manuel Oliva — Profesor \| ProgramBI` (35) | 136 chars | `Manuel Oliva` | `https://www.programbi.com/profesores/manuel-oliva` | index, follow *(default)* | No | `7` enlaces a fichas |
| `/sueldos-analista-datos-chile` | 200 | `Sueldo analista de datos Chile 2026: calculadora \| ProgramBI` (60) | 152 chars | `Sueldo de Analista de Datos y BI en Chile (2026)` | `https://www.programbi.com/sueldos-analista-datos-chile` | index, follow *(default)* | Sí | `12` enlaces a fichas |
| `/herramientas/excel-a-dax` | 200 | `Conversor Excel a DAX: equivalencias Power BI \| ProgramBI` (57) | 146 chars | `Conversor y guía de fórmulas Excel a DAX` | `https://www.programbi.com/herramientas/excel-a-dax` | index, follow *(default)* | Sí | `7` enlaces (`H1 -> H2 -> H3` secuencial sin saltos) |

### Confirmación de enlaces a `/pe/cursos/power-bi`
- HTML de `/pe`: **4** apariciones de `href="/pe/cursos/power-bi"`.
- HTML de `/pe/cursos`: **5** apariciones de `href="/pe/cursos/power-bi"` con anclas descriptivas (`Curso de Power BI en Perú` / `Ver curso de Power BI en Perú →`).
- HTML de `/pe/guias/como-aprender-power-bi-en-peru`: **11** apariciones de `href="/pe/cursos/power-bi"`.

---

## 2. Medición GA4 (`G-CSV91QJMMJ`)

### Código de disparo de `generate_lead` y `click_whatsapp`

1. **`generate_lead`** (`lib/analytics/marketing.ts`, líneas `540–611`):
   ```ts
   export function trackGenerateLead(opts: {
     method: GenerateLeadMethod;
     form_name?: string;
     course_slug?: string | null;
     page_path?: string;
     lead_type?: string;
     lead_source?: string;
     country?: string;
     landing_page?: string;
   }): void {
     // ...
     const course_slug = inferCourseSlug(opts.course_slug);
     const country = opts.country || analyticsContext().country;
     const landing_page = opts.landing_page || readLandingPath();
     const form_name = opts.form_name || opts.lead_source || opts.lead_type || undefined;
     ensurePageViewBeforeHit();
     const transport = sendGenerateLeadBeacon({ method: opts.method, form_name, course_slug, page_path: opts.page_path, lead_type: opts.lead_type, lead_source: opts.lead_source, country, landing_page })
       ? "beacon"
       : GA_MEASUREMENT_ID ? "gtag" : "none";
     if (transport === "gtag") {
       trackEvent(GA_LEAD_EVENTS.GENERATE_LEAD, { method: opts.method, form_name, course_slug, page_path: opts.page_path, lead_type: opts.lead_type, lead_source: opts.lead_source, country, landing_page, transport_type: "beacon" });
     }
   }
   ```
   - **Formularios cableados tras envío exitoso (nunca al abrir):** `BrochureGateForm.tsx` (`brochure_gate`), `PreciosGateClient.tsx` (`precios_gate`), `LeadForm.tsx` (`home_contact_section`), `CourseDetailClient.tsx` (`submitCourseLead`), `empresas-contact-form.tsx` / `LandingContactSection.tsx` (`empresas_contact`), `DiagnosticoMadurez.tsx` (`empresas_diagnostico`), `AsesoriasForm.tsx` (`asesorias_empresas`/`asesorias_particulares`), `PagoClient.tsx` (`pago_enterprise`), `SimuladorPl300Client.tsx` (`simulador_pl300`), `PlantillaDetailClient.tsx` (`plantillas_detail`, ahora validando `res.ok`), `PlantillaDescarga.tsx` (`plantilla_descarga`), `TestNivelClient.tsx` (`test_nivel_*`), `FormularioClase.tsx` (`clase_gratis`), `WebinarClient.tsx` (`webinar`), `WaitlistForm.tsx` (`waitlist_talent`/`waitlist_companies`), `app/(auth)/registro/page.tsx`, `AuthModal.tsx`, `components/referrals/auth-card.tsx`.

2. **`click_whatsapp`** (`lib/analytics/marketing.ts`, líneas `1199–1245`):
   - Emite `course_slug`, `country`, `page_path` (además de `course`, `page`, `cta_position`, `wa_location`) con dedupe por clic en `WhatsAppCta.tsx`, `WhatsAppButton.tsx`, `CourseDetailClient.tsx`, `DiagnosticoMadurez.tsx`, `CalculadoraAhorro.tsx`, `AuthModal.tsx` y el listener global de `MarketingAnalytics.tsx`.

### Causas encontradas del `(not set)` en landing page (23,5 %) y correcciones
1. **Cookie `_ga_<ID>` en formato moderno `GS2.1` sin `sct` en `gaSession()`:** `gtag.js` escribe `GS2.1.s<sid>$o<sct>...`, pero `gaSession()` solo extraía `sid` en `GS2` sin capturar `$o<sct>`. El Measurement Protocol requiere ambos (`sid` + `sct`): al mandar `sendGenerateLeadBeacon` solo con `sid`, GA4 desacoplaba el hit y generaba una sesión huérfana con `landing_page = (not set)`. Corregido capturando `s<sid>` + `$o<sct>` en `GS2.1` y exigiendo ambos para usar `sendBeacon` directo (si falta uno, cae a `gtag(..., { transport_type: "beacon" })`).
2. **`useSearchParams()` dentro de `<Suspense fallback={null}>` en `MarketingAnalytics.tsx`:** suspendía el montaje durante la hidratación estática mientras efectos de componentes hijos (`CourseDetailClient`, `AnalyticsPageEvent`) ejecutaban antes. Se eliminó `useSearchParams()` leyendo `window.location.search` en cliente, se incluyó `page_location`/`page_path`/`page_title` en `gtag("config")` inicial y se enlazó `visibilitychange`/`focus`/`pageshow` (`bindSessionResumePageView`) para reemitir `page_view` si la pestaña retoma actividad tras > 30 min de inactividad.
3. **Fallback de ID de medición:** si faltara `NEXT_PUBLIC_GA_MEASUREMENT_ID`, ahora usa el ID fijo del sitio (`G-CSV91QJMMJ`).

---

## 3. Verificación de archivos congelados

`git diff main -- config/paises.ts vercel.json app/robots.ts app/sitemap.ts` → **0 líneas modificadas** (vacío).

---

## 4. Diff resumido por archivo

- **Perú Power BI & Catálogos:** `lib/data/contenido-paises/pe.ts`, `lib/data/contenido-paises/fichas.ts`, `components/paises/PeruPowerBiSection.tsx` *(nuevo)*, `app/(marketing)/cursos/page.tsx`, `app/(marketing)/cursos/CursosPageClient.tsx`, `components/marketing/FeaturedCourseStrip.tsx`, `content/guias/pais/pe.md`, `guias/*-peru.md` (12 archivos).
- **Fichas Chile, bloque «En resumen» & CTA conversión:** `lib/seo/money.ts`, `lib/data/seo-ficha/index.ts`, `lib/data/seo-ficha/power-bi.ts`, `lib/data/seo-ficha/analisis-de-datos.ts`, `lib/data/seo-ficha/sql-server.ts` *(nuevo)*, `lib/data/seo-ficha/python.ts` *(nuevo)*, `components/marketing/CourseSummaryBox.tsx` *(nuevo)*, `components/marketing/temario/TemarioSection.tsx`, `app/(marketing)/cursos/[slug]/page.tsx`, `app/(marketing)/cursos/[slug]/CourseDetailClient.tsx`.
- **Analítica GA4 (`generate_lead`, `click_whatsapp`, `page_view`):** `lib/analytics/marketing.ts`, `components/shared/MarketingAnalytics.tsx`, `components/marketing/BrochureGateForm.tsx`, `components/marketing/LeadForm.tsx`, `components/marketing/PreciosGateClient.tsx`, `components/empresas/empresas-contact-form.tsx`, `components/empresas/DiagnosticoMadurez.tsx`, `components/empresas/CalculadoraAhorro.tsx`, `components/marketing/AsesoriasForm.tsx`, `app/(marketing)/pago/PagoClient.tsx`, `components/marketing/SimuladorPl300Client.tsx`, `app/(marketing)/plantillas/[slug]/PlantillaDetailClient.tsx`, `components/marketing/PlantillaDescarga.tsx`, `app/(marketing)/test-nivel/[tema]/TestNivelClient.tsx`, `components/clase-gratis/FormularioClase.tsx`, `app/(marketing)/webinar/WebinarClient.tsx`, `components/empleos/landing/WaitlistForm.tsx`, `components/marketing/WhatsAppCta.tsx`, `components/shared/WhatsAppButton.tsx`, `components/shared/AuthModal.tsx`, `app/(auth)/registro/page.tsx`, `components/referrals/auth-card.tsx`.
- **Guías CTR (posición 5–10):** `guias/sueldo-analista-de-datos-latinoamerica.md`, `content/guias/transversales/power-bi-vs-excel.md`, `guias/certificacion-pl-300-power-bi.md`, `content/guias/transversales/claude-cl.md`, `guias/claude-chile.md`, `lib/guias/generado.ts` *(regenerado con 118 guías)*.
- **Técnico menor OpenSEO:** `app/(marketing)/blog/page.tsx`, `app/(marketing)/blog/[slug]/page.tsx`, `app/(marketing)/casos/page.tsx`, `app/(marketing)/casos/[slug]/page.tsx`, `app/(marketing)/nosotros/page.tsx`, `app/(pais)/[pais]/nosotros/page.tsx`, `app/(marketing)/profesores/[slug]/page.tsx`, `app/(marketing)/sueldos-analista-datos-chile/page.tsx`, `components/herramientas/ExcelToDaxClient.tsx`.

---

## 5. Lo que NO se agregó por falta de datos reales

- No se inventaron cifras de alumnos, reseñas nuevas, casos de éxito de empresas, tasas de empleabilidad ni rankings externos en fichas, guías o perfiles de profesores (`Emanuel Berrocal` y `Rodrigo Vega` conservan únicamente sus credenciales reales publicadas).
- No se crearon "packs" ni ofertas ficticias para cruzar Excel + Power BI en Perú: solo se documentó la relación real de Power Query/M/DAX y se enlazó `/pe/cursos/excel` como curso independiente del catálogo.
- No se prometió modalidad presencial, gratuidad del curso ni SENCE donde no existen en el catálogo.

VEREDICTO: VERDE
