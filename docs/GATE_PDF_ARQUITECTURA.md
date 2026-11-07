# Arquitectura del gate de precios y del brochure PDF

Cómo la web entrega el precio de un curso a cambio de un contacto: la ficha
muestra el formulario, que abre el brochure con precios en otra pestaña; el lead
queda en Supabase y el correo llega con el PDF. **Ningún monto en el HTML inicial.**

## 1. Gate de precios

`lib/pricing-gate.ts` es isomorfo (sin `"use client"`) y concentra las claves:
`PRICE_UNLOCK_STORAGE_KEY = "pb_price_unlocked"` en `localStorage`;
`PRICE_UNLOCK_COOKIE = "pb_price_unlocked"`, de 90 días (7.776.000 s),
`path=/` y `SameSite=Lax`; `LEAD_INFO_STORAGE_KEY = "pb_lead_info"` para el
último nombre, email y WhatsApp; y `PRICE_UNLOCK_EVENT = "pb:price-unlocked"`.

`isPriceUnlockedClient()` devuelve `false` sin `window`: en SSR nunca hay
desbloqueo. `unlockPricesClient(lead)` escribe la marca, deja la cookie, guarda
el contacto y dispara el evento; `lockPricesClient()` borra ambas marcas.
`hooks/usePriceUnlock.ts` expone `usePriceUnlock()` (arranca en `unlocked:
false` y `hydrated: false`, lee el navegador al montar y escucha
`pb:price-unlocked` y `storage`), así que un envío desbloquea toda la web.

**Por qué no basta ocultar con CSS o estado.** En el App Router los Server
Components serializan sus props como flight data de RSC. Si el servidor calcula
un precio y lo pasa a un componente cliente, el monto queda en el HTML aunque el
CSS lo tape. Por eso las páginas públicas no calculan ni reciben precios: el
monto se calcula en cliente con funciones puras (`precioPublico`, `precioVenta`,
`formatMoneda`, `porcentajeDescuento`) y solo se renderiza con `unlocked ===
true`. Solo pueden llevar precio el brochure, `/pago`, `/admin` y los emails.

## 2. Formulario de 3 campos

`components/marketing/BrochureGateForm.tsx` es el único camino de desbloqueo.
Recibe `slug`, `courseTitle`, `pais`, `source` y opcionales de copy (`heading`,
`subheading`, `buttonLabel`, `idPrefix`, `compact`, `onUnlocked`, `className`).
Renderiza Nombre, Email y Teléfono/WhatsApp con selector de prefijo; el `<form>`
lleva `data-gate-form="brochure"`, el ancla que usa el script de verificación.

Validación: nombre de al menos 2 caracteres, email contra `isValidEmail`
(`/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`) y al menos 7 dígitos de teléfono; luego
`phoneCodeFor(pais)` elige el prefijo y `withDialCode` normaliza a `+56...`.
El envío abre primero `window.open(courseBrochureUrl(slug, pais), "_blank", ...)`
dentro del handler síncrono (Safari y móviles no lo bloquean; si falla queda un
enlace de respaldo), después `unlockPricesClient(lead)` pinta precio y botón de
pago, y al final `void fetch("/api/leads/create", ...)` guarda el lead en
segundo plano sin romper la experiencia si la red falla.

El payload lleva `name`, `email`, `whatsapp`, `sourceCourse`,
`selectedCourses`, `leadType`, `pais`, `pricingVariant: "gate"`, la atribución
UTM y los campos anti-bot (`_website` honeypot y `_t` con el tiempo de llenado).

## 3. Brochure PDF

Rutas `/cursos/[slug]/brochure` y `/[pais]/cursos/[slug]/brochure`. En Next.js
16 `params` y `searchParams` son promesas (`const { slug } = await params`); el
país se resuelve con el prefijo de la URL y `?pais=`.

`lib/brochure/brochure-data.ts` reúne título, precio local (`precioPublico`,
`precioVenta`, `formatMoneda`), cuotas (`NOTA_CUOTAS`), fechas en el huso del
país (`conHoraPais`/`horarioLocal`), los tres profesores de `mentors` con foto
y credenciales, y el temario de `getCourseSyllabus`. `CourseBrochureClient.tsx`
es la vista imprimible A4, sin gate, con la acción «Descargar PDF», y
`generate-course-pdf.ts` arma el PDF con jsPDF en el navegador (import
dinámico): portada, precio, fechas locales, equipo y temario. Si Supabase tiene
un `brochure_pdf_url`, ese archivo manda como override; si no, se genera.

El brochure es la excepción controlada: sí contiene precio, horario local, los
tres profesores y los módulos, porque es el premio que recibe el visitante.

## 4. Horarios por país

`lib/paises/horarios.ts` centraliza la conversión: `zonaDe(iso)` da el huso
IANA, `conHoraPais(iso, horario)` agrega `· Hora de <país>` y
`horarioLocal(iso, opciones)` entrega inicio/fin local, offset y equivalencias;
`paisDesdeZonaHoraria()` traduce la zona del navegador a un ISO.
`proxy.ts` lee `x-vercel-ip-country` y deja la cookie `pb_geo_country`; la
prioridad es URL → cookie → `localStorage` → zona horaria → Chile, siempre con
`normalizarPais`, `ISO_CHILE` y `esIndexable`. Las fechas salen de
`getActiveSchedules()` y caen a `staticSchedules` si falla la consulta.

## 5. Guardado y emails

`POST /api/leads/create` valida con zod, aplica rate limit por IP y descarta bots
por honeypot, tiempo de llenado y spam. Inserta en `course_leads` con
`lead_type` (`contact` por defecto), `pricing_variant` (`gate`), país, curso de
origen, UTM y mensaje; `/admin/formularios` lista y filtra esos leads. Después
del insert se disparan `sendQuoteConfirmationToLead` (brochure, precio,
descuentos, destacados y equipo) y `sendNewLeadNotificationToAdmin` (contacto y
curso de origen).

## 6. Verificación automatizada

Con el build levantado: `node scripts/verificar-gate-pdf.mjs
http://127.0.0.1:3220`. Solo hace GET: (A) las cuatro fichas responden 200 sin
montos prohibidos y con `name="name"`, `name="email"`, `name="whatsapp"`,
`data-gate-form="brochure"` y enlace `/brochure`; (B) los cuatro brochures
responden 200 con los tres profesores, `Hora de`, un monto con símbolo de
moneda, `Descargar`, `PDF` y un módulo; (C) `/precios` responde 200 sin montos y
con `Desbloquear` y `Brochure`; (D) `/cursos` tampoco filtra montos. Imprime
`[OK]`/`[FALLA]`, el resumen `X/Y verificaciones OK` y sale 1 si algo falla.
Sin servidor, avisa y sale 1.

No cubre el envío real del formulario, la inserción en Supabase, los emails ni
la generación del PDF en el navegador; eso se prueba a mano abriendo una ficha.

## 7. Mapa de archivos y curso nuevo

| Workstream | Archivos |
|---|---|
| WS1 | `lib/pricing-gate.ts`, `hooks/usePriceUnlock.ts`, `lib/paises/horarios.ts`, `proxy.ts` |
| WS2 | rutas de brochure, `lib/brochure/*`, `components/brochure/CourseBrochureClient.tsx` |
| WS3 | ficha de curso (`CourseDetailClient`, páginas de `[slug]`) |
| WS4 | catálogo, `/precios`, landings y guías |
| WS5 | `LeadForm`, JSON-LD y metadatos por país |
| WS6 | `/api/leads/create`, `/api/courses/brochure`, admin y migración |
| WS7 | `lib/email/*` (cotización y aviso interno) |
| WS8 | este documento y `scripts/verificar-gate-pdf.mjs` |

Para agregar un curso no se toca el gate: se suma el slug a `SLUGS_CURSO` en
`config/paises.ts`, se cargan sus precios locales, su syllabus en
`lib/data/syllabuses.ts`, sus mentores en `lib/data/mentors.ts` y sus cohortes
en `staticSchedules`. El brochure y la ficha toman esos datos solos; basta
volver a correr el script para confirmar que no se filtró un monto.

## Flujo completo

```
Visitante
   │ 1. entra a /cursos/<slug>  (o /pe/cursos/<slug>, /mx/cursos/<slug>)
   ▼
Ficha (RSC) ── HTML sin montos; solo el formulario de 3 campos
   │ 2. Nombre + Email + Teléfono/WhatsApp
   ▼
BrochureGateForm (cliente)
   ├─ window.open(/cursos/<slug>/brochure?pais=xx) ──► pestaña nueva con PDF
   ├─ unlockPricesClient(lead) ──► localStorage + cookie 90 días + evento
   └─ POST /api/leads/create ──► Supabase course_leads (pricing_variant=gate)
                                        │
                                        ├─► email al lead (brochure + precio + equipo)
                                        └─► aviso interno al equipo
```
