# Reporte CRO y Contenido PE/CO — Rama `feat/cro-conversion`

**Fecha:** 26 de noviembre de 2026  
**Rama base:** `main` (incluye `03a68db`, `81bc379` de `fix/seo-latam-post-deploy` y `520ee4c`)  
**Alcance:** Desarrollado y verificado en `feat/cro-conversion`, e integrado en `main` tras aprobación explícita del usuario. Sin cambios en CMS, DNS ni GA4 Admin.

---

## 1. Resumen ejecutivo

Se ejecutaron los **10 entregables CRO** (prioridad 1 a 10) y los **18 ítems de contenido y SEO para Perú y Colombia**, respetando las decisiones fijas de negocio:

- **Precio oculto a simple vista** en fichas, guías (incluyendo FAQs y bloques compactos), `/precios`, `/cursos` (bloque resumen SSR) y `/pago` para visitantes anónimos (antes de iniciar sesión o desbloquear el PDF «Temario y precios»). Se mantienen los precios en JSON-LD/meta para LLMs (`520ee4c`).
- **WhatsApp único del sitio** (`+56 9 3540 9699` / `56935409699`) en todos los países, sin crear número `+52`.
- **Clase gratis sin fecha fija**: `/clase-gratis` continúa en 404 por flag (`NEXT_PUBLIC_CLASE_GRATIS`). Se eliminó toda mención a «sesión abierta por Zoom» o fechas fijas; los CTAs coordinan la clase gratis por WhatsApp.
- **Logos de la home**: `components/marketing/LogoSlider.tsx` ahora muestra el rótulo visible exacto **«Empresas que hemos capacitado»**.
- **Fixes SEO de `fix/seo-latam-post-deploy` (`81bc379`) preservados**: `/mx/cursos` y `/mx/guias` mantienen título y H1 sin «Power BI»; `/co/cursos/analitica-financiera` conserva su 301 a `/co/cursos/mercado-financiero` y permanece fuera de `sitemap.xml`.

---

## 2. Contraste analítico: `course_leads` vs GA4 (`generate_lead`)

### Diagnóstico de discrepancia (83 usuarios y 1 `generate_lead` en 29 oct–25 nov)

| Causa raíz detectada | Cómo afectaba el conteo | Corrección aplicada en `feat/cro-conversion` |
|---|---|---|
| **Latencia síncrona de MailerSend en `/api/leads/create`** | El endpoint esperaba 2 llamadas a MailerSend antes de devolver HTTP 200. Si el usuario abría el PDF o navegaba rápido, el `.then()` del cliente se abortaba y `generate_lead` nunca se disparaba. | `app/api/leads/create/route.ts` ahora usa `after()` de `next/server` para enviar los correos en segundo plano tras responder HTTP 200 inmediato al guardar en `course_leads`. |
| **`fetch` sin `keepalive` en formularios gate** | Al abrir pestaña nueva / cambiar de vista, el navegador podía cancelar el request antes de completar el callback. | Añadido `keepalive: true` en `BrochureGateForm.tsx` y `PreciosGateClient.tsx`, disparando `trackLeadSubmit` → `trackGenerateLead` solo con `res.ok && !isBotTrap`. |
| **Hits abortados en salida (`wa.me` / Mercado Pago)** | `click_whatsapp`, `lead_submit`, `checkout_start` y `begin_checkout` no usaban `transport_type: "beacon"`. | `lib/analytics/marketing.ts` envía `transport_type: "beacon"` en esos eventos de salida. |
| **`sendGenerateLeadBeacon` sin `seg=1`** | El hit directo a `/g/collect` podía quedar sin marca de sesión comprometida (`seg=1`). | Añadido `seg: "1"` en `sendGenerateLeadBeacon`, manteniendo `ep.landing_page` (`readLandingPath()`) y `_dbg=1` estrictamente condicionado a `analyticsDebugEnabled()` (nunca en producción normal). |
| **Fuga de `lead_source` a fuente de sesión** | Eventos antiguos enviaban `source` (`empresas_contact`, `course_detail_card`), que GA4 interpreta como `campaign_source` manual y genera `(not set)` en landing page. | Verificado y reforzado `stripReservedCampaignParams()` y `sendGenerateLeadBeacon()` para enviar siempre `lead_source` / `ep.lead_source` y nunca `source`. |
| **Deduplicación de `generate_lead`** | Riesgo de doble conteo en clics repetidos o recargas rápidas. | Mantenida deduplicación de 60 s (`pb_generate_lead:${form_name}:${course_slug}`) y `1500ms` para `click_whatsapp`. |
| **Posiciones de CTA en guías y `/datos/*`** | Posiciones nuevas colapsaban en `otros`. | `normalizeWhatsAppCtaPosition` preserva `guia_top`, `guia_mid`, `guia_end`, `guia_sidebar`, `guia_sticky_mobile`, `datos_soft`, `co_analista_sueldos` y `notify_next_date`. |

---

## 3. Reducción de fricción en formularios

1. **Formularios principales (`BrochureGateForm`, `PreciosGateClient`, `LeadForm`, `EmpresasContactForm`)**:
   - **Antes:** 3 campos obligatorios (`Nombre`, `Correo`, `WhatsApp`) + selector/checkbox según formulario.
   - **Después:** **2 campos obligatorios** (`Nombre` y `Correo`). El campo **WhatsApp** pasa a ser **`WhatsApp (opcional)`** en todos los mercados (si el usuario lo completa, se valida formato mínimo de 7 dígitos).
   - **Justificación:** La entrega del PDF «Temario y precios» y la cotización llegan por correo y se desbloquean en pantalla de inmediato; exigir teléfono frenaba el primer contacto en usuarios que solo querían revisar temario y arancel.
2. **Captura de interés en cursos sin fecha (`components/marketing/NotifyNextDate.tsx` + `/api/leads/notify`)**:
   - **Antes:** 11 de 15 cursos sin fecha próxima solo ofrecían enlace a WhatsApp o un botón roto en `/pago` (que enviaba `email: ""` sin `?email=` y mostraba `"Registrado"` en falso aunque el API devolviera 400).
   - **Después:** Mini-formulario reutilizable de **1 solo campo obligatorio** (toggle **Correo** o **WhatsApp**), integrado en `/pago`, en las tarjetas de `/cursos` y `/{pais}/cursos`, y en la ficha (`/cursos/[slug]`) cuando no hay cohorte activa. Registra en `course_leads` con `lead_type: "avisame_proxima_fecha"` y emite `generate_lead` con `form_name: "notify_next_date"` y `lead_type: "avisame_proxima_fecha"`.

---

## 4. Resumen de cambios por entregable CRO y PE/CO

### CRO (1 a 10)
1. **Medición confiable:** `lib/analytics/marketing.ts`, `app/api/leads/create/route.ts`, `BrochureGateForm.tsx`, `PreciosGateClient.tsx`.
2. **Copy consistente en fichas y FAQ:** `lib/seo/money.ts`, `components/marketing/CourseLeadSections.tsx` (`renderInternalLinks`), `lib/data/contenido-paises/pe.ts` (reemplaza «Registrarme» / rutas crudas por flujo «Ver temario y precios» y enlaces clicables).
3. **Captura en cursos sin fecha:** `components/marketing/NotifyNextDate.tsx`, `app/api/leads/notify/route.ts`, `CursosPageClient.tsx`, `CourseDetailClient.tsx`, `PagoClient.tsx`.
4. **Coherencia de medios de pago y moneda:** Eliminadas promesas de Yape, Plin, PSE, Nequi, OXXO, SPEI y Mercado Pago local en `pe.ts`, `co.ts`, `mx.ts`, `ar.ts`, `PeruPowerBiSection.tsx`, `contenido-local/{co,ar}.ts` y `PagoClient.tsx` («Pago cifrado vía Mercado Pago»). Aclarado que el cobro con tarjeta internacional vía Mercado Pago se procesa en CLP desde Chile con conversión del banco, manteniendo 3 cuotas sin interés y valores referenciales en el PDF «Temario y precios».
5. **Confianza y pie de página:** `Footer.tsx` actualizado a `ProgramBI SpA · Operamos desde Chile` (CL) y `ProgramBI SpA (Chile) · Clases en vivo para {país}`, manteniendo `/verificar-certificado` y `contacto@programbi.cl`. Nuevo `components/marketing/CertificadoEjemploFicha.tsx` con vista previa ilustrativa del certificado en fichas.
6. **Guías con conversión:** `GuiaPasoAPasoLayout.tsx`, `GuiaPage.tsx`, `GuiaCTA.tsx` con CTA contextual a mitad del artículo (`guia_mid`), recurso descargable / PDF al final (`guia_end`) y enlaces guía → ficha del mismo país.
7. **Páginas `/datos/*`:** `components/datos/CtaDatos.tsx` ahora muestra el bloque suave «Aprende a analizar estos datos» en carreras de `banda === "baja"` (ej. Medicina Veterinaria, Terapia Ocupacional) con acceso a `/cursos/excel`, `/cursos/power-bi` y WhatsApp (`cta_position: "datos_soft"`). `CtaCarreraSueldo.tsx` evita enlaces a `/clase-gratis` (404).
8. **Precio oculto regla única:** Eliminados montos numéricos visibles en `/pago` anónimo (`PagoClient.tsx`), FAQs de guías (`lib/guias/precio.ts`), tarjetas de guías paso a paso (`GuiaCursoCompacto.tsx`, `paso-a-paso-curso.ts`), bloque resumen SSR de `/cursos` (`app/(marketing)/cursos/page.tsx`), comparativas (`lib/data/academias.ts`) y FAQs de `/precios` y países (`resumenDescuentoCatalogo` en `lib/paises/detalle-curso.ts`).
9. **Rendimiento percibido:**
   - `/guias` (`GuiasHub.tsx`): render inicial segmentado (4 destacadas + máx. 6 grupos × 3 tarjetas) con expansión bajo demanda en cliente.
   - Fichas (`/cursos/[slug]/page.tsx`, `CourseDetailClient.tsx`, `TemarioSection.tsx`): temario, cursos relacionados, horarios y SEO resueltos en el servidor (sacando `syllabuses.ts`, `courses.ts`, `money.ts`, `ar.ts` y `pe.ts` del bundle cliente), eliminación de `framer-motion` en `TemarioSection` y `CourseDetailClient`, carga dinámica de `AuthModal`, y diferimiento de los temas de módulos 2+ en `TemarioSection`.
10. **Quick wins títulos y metas:** Aplicados en `/pe/cursos`, `/pe/cursos/analisis-de-datos` y `/co/cursos/power-bi` sin tocar `/mx/cursos` ni `/mx/guias` (`81bc379`). *(Nota: `/workspace/prompts/informe-cro.md` no existe en este repositorio local; se aplicaron los quick wins especificados en el encargo.)*

### Contenido PE y CO
- **Perú:** Actualizada `calcular-gratificacion-excel.ts` (diciembre 2026, plazo 15 dic, Ley 27735, D.S. 015-2026-TR RMV S/ 1.230); creadas `gratificacion-trunca-excel.ts` (magnet `gratificacion-peru-2026`), `planilla-de-sueldos-excel-peru.ts` (pilar enlazando las 6 guías laborales), `cuanto-gana-un-analista-de-datos-peru.md` (datos oficiales INEI ENAHO / MTPE-DISEL de `carreras-pe.json`), `mejores-cursos-power-bi-peru-2026.md` y `certificacion-pl-300-peru.md`; actualizada `claude-peru.md` con planes oficiales de Anthropic (`claude.com/pricing`, 26 nov 2026) convertidos a soles con TC SUNAT venta del 25 nov 2026 (`S/ 3,479`); optimizados títulos/H1 de `/pe/cursos` (ancla a `/pe/cursos/power-bi`) y `/pe/cursos/analisis-de-datos` («analista de datos»).
- **Colombia:** Añadido ancla exacto `curso de excel` → `/co/cursos/excel` en las 5 guías laborales; creadas `diferencia-sena-vs-curso-en-vivo-power-bi.md`, `curso-excel-para-contadores.md`, `certificacion-pl-300-colombia.md` y `diplomado-power-bi-colombia.md`; creadas `/co/cursos/power-bi-bogota` y `/co/cursos/power-bi-medellin` (contenido único por ciudad, 100 % en vivo por Zoom sin sede física, sin `LocalBusiness`, canonical propio sin `hreflang`, registradas en `sitemap.ts`, y fix en `lib/paises/rutas.ts` restringiendo `esRutaLocalizable` a `SLUGS_CURSO`); añadido CTA a `/co/cursos/analisis-de-datos` y clase gratis por WhatsApp en `/co/datos/carreras/cuanto-gana-un-analista-de-datos`; actualizado título de `/co/cursos/power-bi` con COP y 3 cuotas sin interés.

---

## 5. Evidencia medida (antes vs después)

### Rendimiento percibido (local `next build` + `next start`)

| Métrica | Antes (referencia del encargo) | Después (`feat/cro-conversion`) |
|---|---|---|
| `/guias` tamaño HTML | ~1,39 MB | **430,1 KB** (-69 %) |
| `/guias` cantidad de `<img>` en HTML inicial | 184 | **24** (-87 %) |
| `/cursos/power-bi` tamaño HTML | 350–450 KB | **335,0 KB** |
| `/cursos/power-bi` chunks JS / peso gzip | ~41 chunks / ~450 KB gzip | **39 chunks / 397,6 KB gzip** |
| `/pe/cursos/power-bi` chunks JS / peso gzip | ~41 chunks / ~450 KB gzip | **37 chunks / 391,9 KB gzip** |

### Validaciones de build, tests y guías
- `node scripts/build-guias.mjs`: **136 guías publicadas**, 0 errores.
- `node scripts/verificar-guias.mjs`: **OK** (peor par `29.0 %`, límite `30 %`, 377 pares).
- `node scripts/verificar-guias-paso-a-paso.mjs --no-net`: **OK** (0 errores estructurales/SEO, peor solapamiento `0.69 %`).
- `.\node_modules\.bin\tsc --noEmit`: **0 errores** en archivos del proyecto (`TSC_EXIT=0`).
- `eslint` sobre archivos modificados/creados: **0 errores** (`ESLINT_EXIT=0`). *(Nota: `npm run lint` global reporta errores preexistentes en archivos no tocados como `test-ses.js` y `scripts/`.)*
- `npm run build`: **OK** (`BUILD_EXIT=0`, 2287/2287 páginas estáticas generadas).
- `node tests/datos/run-tests.mjs`: **13/13 tests pasando**.
- `node scripts/check-isr-policy.cjs`: falla por desfase preexistente en `lib/cache/public-course-paths.ts` vs `lib/supabase/comunidad-ai.ts` (`analisis-de-datos` en `publicSchedulePaths`), archivos no modificados en esta rama.

### Verificación HTTP, Sitemap y Auditoría SSR (`http://localhost:3000`)
- **HTTP 200 y presentes en `/sitemap.xml` (13/13):**
  - `/pe/guias/calcular-gratificacion-excel`
  - `/pe/guias/gratificacion-trunca-excel`
  - `/pe/guias/planilla-de-sueldos-excel-peru`
  - `/pe/guias/curso-claude-peru`
  - `/pe/guias/cuanto-gana-un-analista-de-datos-peru`
  - `/pe/guias/mejores-cursos-power-bi-peru-2026`
  - `/pe/guias/certificacion-pl-300-peru`
  - `/co/cursos/power-bi-bogota` (sin `hreflang` alternos rotos)
  - `/co/cursos/power-bi-medellin` (sin `hreflang` alternos rotos)
  - `/co/guias/diferencia-sena-vs-curso-en-vivo-power-bi`
  - `/co/guias/curso-excel-para-contadores`
  - `/co/guias/certificacion-pl-300-colombia`
  - `/co/guias/diplomado-power-bi-colombia`
- **Redirects y apagados:**
  - `GET /co/cursos/analitica-financiera` → **301** a `/co/cursos/mercado-financiero` (ausente en `sitemap.xml`).
  - `GET /clase-gratis` → **404** (ausente en `sitemap.xml`).
- **Auditoría SSR:** 0 montos visibles de arancel, 0 `"sesión abierta por Zoom"`, 0 `"brochure"` visible, 0 medios locales falsos en checkout, `"Empresas que hemos capacitado"` presente en `/`, `/mx/cursos` y `/mx/guias` sin `"Power BI"` en `<title>`/`<h1>`.

### Verificación en navegador real (Playwright headless)
- **Móvil `390×844` (`scrollWidth / clientWidth`):**
  - `/cursos/power-bi`: `390/390` (0 overflow), barra inferior sticky visible (`stickyBottom=true`).
  - `/pe/cursos`: `390/390` (0 overflow).
  - `/co/cursos/power-bi`: `390/390` (0 overflow), barra inferior sticky visible (`stickyBottom=true`).
  - `/co/cursos/power-bi-bogota`: `390/390` (0 overflow).
  - `/guias`: `390/390` (0 overflow).
  - `/pago` (anónimo): `390/390` (0 overflow), precios numéricos ocultos (`hasVisiblePrice=false`), mensaje de PDF «Temario y precios» visible (`hasPdfUnlockMsg=true`).
  - `/datos/carreras/medicina-veterinaria`: `390/390` (0 overflow), bloque suave «Aprende a analizar estos datos» visible (`hasSoftBlock=true`).
- **Desktop `1280×800`:**
  - `/cursos/power-bi`: tarjeta lateral sticky visible a la derecha (`asideVisible=true`, `asideRight=true`).
  - `/cursos`: clic en «Avísame la próxima fecha» abre formulario con **1 solo input visible** y toggle Correo / WhatsApp.

---

## 6. Qué quedó pendiente

1. **`/workspace/prompts/informe-cro.md`**: no existía en el workspace local; si contiene quick wins adicionales a los ya listados en el encargo, revisarlo aparte.
2. **Configuración en GA4 Admin (a cargo de Manu):** filtros de tráfico interno/bots y verificación de eventos clave en la interfaz de GA4.
3. **`/clase-gratis`:** permanece apagada (404) hasta que Manu defina `NEXT_PUBLIC_CLASE_GRATIS=1` y `NEXT_PUBLIC_CLASE_GRATIS_FECHA`.
4. **Enlaces fuente de testimonios (`lib/data/testimonials.ts`):** los 20 testimonios reales existentes no tienen `linkedinUrl` cargado (`TODO_MANU`); no se inventó ninguno.
5. **Cuentas locales de Mercado Pago (`MERCADOPAGO_ACCESS_TOKEN_<ISO>`):** cuando se habiliten cuentas locales por país en el entorno, `lib/paises/cobro.ts` activará el cobro en moneda local y podrán re-agregarse medios locales en el copy.
6. **Archivos untracked locales:** los archivos untracked preexistentes en el directorio de trabajo (`hermes_*.log`, etc.) se excluyeron deliberadamente del commit.
