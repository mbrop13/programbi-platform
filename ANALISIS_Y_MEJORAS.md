# ProgramBI: análisis SEO/GEO/CRO y backlog (4/11/2026)
Este documento complementa `PLAN_MEJORAS.md`, `GUIAS_POWER_BI_PAISES.md` y `HERMES_ORQUESTACION.md`. Hermes lo reparte en WS1–WS4. Las reglas son las mismas: una rama por workstream, nada se sube a `main` sin el OK de Manu y no se inventan datos (las cifras de sueldo, los testimonios y las reseñas tienen que ser reales y con su fuente).

Workstreams:
- **WS1:** SEO técnico y precios.
- **WS2:** contenido y guías.
- **WS3:** CRO y WhatsApp.
- **WS4:** medición y GEO.

Fuentes:
- GSC: del 17/10 al 3/11, comparado con el 29/9 al 16/10.
- GA4: del 21/10 al 3/11, comparado con el 7/10 al 20/10.
- Auditoría de producción de las 192 URL y curl en vivo hechos el 4/11.

## 1. Veredicto: ¿los cambios funcionan o perjudican?
**Funcionan en alcance; la conversión no avanza.**

| Métrica | Antes | Ahora | Lectura |
|---|---|---|---|
| Impresiones GSC | 1.270 | 4.220 (x3,3) | Más URL rankeando (países y cursos) |
| Clics GSC | 43 | 135 (x3,1) | Crecen en proporción a las impresiones |
| CTR | 3,4 % | 3,2 % | Estable |
| Posición media | 12,5 | 17,2 | Empeora por **mezcla**, no por caída. Entran consultas genéricas en posiciones 25–50 («curso power bi» 38,1 con 137 impresiones; «cursos analisis de datos» 26,9). La marca se mantiene en 1,1. |
| Sesiones GA4 | 196 | 447 | Incluye unas 75 sesiones de EE.UU. que parecen bot (13 s de interacción, pico del 28/10 en Chrome) |
| Eventos clave | 1 | 12 | 7 de ellos vienen de ChatGPT |
| form_start → generate_lead | 29 → 12 | 51 → 9 | **El formulario pierde más que antes** |
| Compras | 1 ($338.000, Análisis de datos, válida) | 0 | |

Riesgos detectados:
1. **JSON-LD de Chile con precios incorrectos.** El Offer marca 249.000, 199.000 o 498.000 según el curso, mientras el precio real es 169.000. Verificado en vivo: `/cursos/power-bi` tiene `"price":249000`. Google puede mostrar un precio falso, lo que expone a un aviso de Merchant/rich results y a la desconfianza del usuario.
2. **«Se cobra en CLP» en 85 páginas**, y el aviso en CLP no es igual en todos los cursos (169.000 en unos, 249.000 en otros). Las dos cosas contradicen el precio local.
3. **La caída de form_start → lead coincide con `05dacd9`** («pedir contacto antes del registro», 31/10). La ficha ahora pide «nombre, correo y teléfono» antes del alta, lo que suma un paso y el campo teléfono. Es una hipótesis fuerte, pero se confirma con el embudo (ver el punto 2).
4. **Las páginas de país «no oficiales» rankean sin estar integradas.** `/ve`, `/sv`, `/cr`, `/do`, `/py`, `/bo`, `/ec` y `/gt` responden 200, con canonical propio, `lang` por país y precio en USD. Por ejemplo, `/sv/cursos/claude` está en posición 1,9 con 27 % de CTR. Sin embargo, **no están en el sitemap** (solo cl, ar, mx, pe, co y uy, con 28 URL cada uno) ni en los hreflang. Eso explica parte de las 65 «descubiertas sin indexar» y de las 59 «canónica alternativa». Corrige la premisa de que «no hay versión»: existen, pero están huérfanas.
5. **Un 61 % de las landings sale como (not set)** en GA4. Así no se puede atribuir qué página convierte.
6. **`/admin/formularios` aparece como landing** en GA4 (4 sesiones). GA está midiendo el panel de administración, lo que mete ruido en los datos y expone una ruta interna.

## 2. Diagnóstico de conversión
El tráfico sube y los leads no. Estas son las hipótesis, cada una con su forma de verificarla:

| # | Hipótesis | Dato | Cómo verificar |
|---|---|---|---|
| H1 | El contacto previo al registro (`05dacd9`) agrega fricción, y el teléfono es obligatorio | 51 form_start contra 9 generate_lead (18 %; antes 41 %) y submit_registro 10 → 5 | Embudo de exploración GA4: form_start → envío → generate_lead, segmentado por fecha (antes y después del 31/10). Revisar en el código si el teléfono es `required` y si los errores de validación se muestran. |
| H2 | generate_lead no se dispara en todos los éxitos (problema de medición) | Hay lead_submit 4 y generate_lead 9: dos nombres para lo mismo | Comparar las filas nuevas de Supabase (tabla de contactos/leads) por día con generate_lead. Si Supabase tiene más, es un problema de tracking. |
| H3 | El precio contradictorio frena el checkout | begin_checkout 2 → 0 | Se resuelve con WS1 y se mide el begin_checkout posterior |
| H4 | WhatsApp absorbe la intención (no es pérdida) | click_whatsapp 11 → 58 | Contar las conversaciones reales en WhatsApp Business con el texto precargado, que en las fichas hoy no siempre se envía |
| H5 | El tráfico de bots infla el denominador | 75 usuarios de EE.UU. con 13 s | Filtrar y recalcular las tasas |

**Recomendación:** pasar el formulario a un solo paso, con nombre y email obligatorios y teléfono/WhatsApp opcional, y medir 14 días. Hacerlo como A/B o como cambio con fecha anotada.

## 3. Backlog priorizado
Impacto (I) y esfuerzo (E) van de 1 a 5. La prioridad es I/E.

| ID | Área | Ítem | I | E | WS |
|---|---|---|---|---|---|
| T1 | Técnico/precio | Fuente única de precios y JSON-LD correcto (169k / 338k / 349k) | 5 | 2 | WS1 |
| C1 | CRO | Formulario en un paso y teléfono opcional (revertir la fricción de 05dacd9) | 5 | 1 | WS3 |
| C2 | CRO | wa.me con `?text=` en el HTML de servidor de todas las fichas y landings | 4 | 1 | WS3 |
| T2 | Técnico | Quitar «Se cobra en CLP» de las 85 páginas y dejar el aviso uniforme bajo el pago | 4 | 1 | WS1 |
| M1 | Medición | Arreglar page_view (not set) y excluir /admin | 5 | 2 | WS4 |
| T3 | Técnico | Integrar los países secundarios en el sitemap y en hreflang (o decidir noindex) | 4 | 2 | WS1 |
| M2 | Medición | Filtro de bots de EE.UU. y unificar lead_submit/generate_lead | 4 | 1 | WS4 |
| T4 | Técnico | Resolver los 26 404 y las 64 redirecciones en el enlazado | 3 | 2 | WS1 |
| S1 | Contenido | Landing raíz «Curso Power BI en vivo» (Chile) para subir desde la posición 38 | 5 | 3 | WS2 |
| S2 | Contenido | Potenciar /cursos/analisis-de-datos (440 impresiones, posición 24,8) | 4 | 2 | WS2 |
| G1 | GEO | Ampliar llms.txt y crear páginas citables (FAQ, comparativas, precios) | 4 | 2 | WS4 |
| S3 | Contenido | Publicar las guías por país en olas | 4 | 3 | WS2 |
| C3 | CRO | Lead magnet de la plantilla y clase gratis con secuencia de email | 4 | 3 | WS3 |
| C4 | CRO | Prueba social real cerca del precio | 3 | 2 | WS3 |
| C5 | CRO | Popup de salida suave y CTA fijo en mobile | 3 | 2 | WS3 |
| G2 | GEO | Menciones, reseñas y perfiles externos | 3 | 3 | Manu + WS4 |
| X1 | Mercados | Versión /latam en USD como hub de CentroAmérica, el Caribe y Venezuela | 3 | 3 | WS1/WS2 |
| M3 | Medición | Parámetros comunes, embudo y remarketing | 3 | 2 | WS4 |

### Detalle por ítem
**T1. Precios con una sola fuente de verdad (WS1).**
- Por qué: el Offer de Chile tiene 249.000, 199.000 o 498.000; el precio real es 169.000 en todos los cursos, 338.000 en Análisis de datos y 349.000 en Mercado financiero.
- Qué hacer: crear `config/pricing.ts` (curso → CLP y precio local por país) y alimentar desde ahí la ficha, `levels.price`, el JSON-LD Offer, las landings, las guías, llms.txt y el checkout. `validFrom` va con una fecha fija.
- Archivos probables: `app/**/cursos/[slug]`, `lib/courses*`, `components/*Price*`, los generadores de JSON-LD y el checkout.
- Aceptación: un curl a todas las `/cursos/{slug}` y `/{p}/cursos/{slug}` da precio visible igual al Offer, y `grep -E '249\.?000|199\.?000|498\.?000'` no devuelve nada.

**T2. Aviso de CLP (WS1).**
- Qué hacer: quitar «Se cobra en CLP» junto al precio y dejar una sola nota pequeña bajo el botón de pago, con el CLP del curso tomado de pricing.ts.
- Aceptación: 0 apariciones de «Se cobra en CLP» en las 192 URL.

**T3. Países secundarios (/ve, /sv, /cr, /do, /py, /bo, /ec, /gt y otros) (WS1).**
- Por qué: rankean (`/sv/cursos/claude` en posición 1,9; `/ve/cursos/analisis-de-datos` en 5,1) y El Salvador, Venezuela, Rep. Dominicana y Costa Rica suman 29 clics, el 21 % del total. Aun así, están fuera del sitemap y de hreflang.
- Qué hacer: hay dos opciones.
  - **(a) Recomendada:** incluirlos en el sitemap y en el set hreflang (es-SV, es-VE, etc.) con contenido mínimo propio (moneda USD, horario local en la ficha).
  - **(b)** Consolidarlos en `/latam` con 301 y hreflang `es-419`. Por las posiciones actuales, (b) arriesga perder rankings.
- Aceptación: hreflang recíprocos validados y sitemap que liste todas las URL 200 indexables.

**T4. Cobertura en GSC (WS1).**
- Qué hacer:
  - Exportar las 26 URL 404 desde GSC (pendiente de Manu o de acceso) y redirigir con 301 a su equivalente.
  - En las 64 redirecciones, quitar del sitemap y del enlazado interno cualquier URL que redirija (www/no-www, slash final, slugs viejos).
  - En las 59 de canónica alternativa, es normal si son variantes, pero hay que confirmar que ninguna ficha de país apunte su canonical a Chile.
  - En las 65 descubiertas sin indexar, mejorar el enlazado interno: footer por país, bloque «cursos por país» en /cursos y enlaces desde las guías.
- Aceptación: rastreo propio sin enlaces internos a 3xx o 404, y validación iniciada en GSC.

**S1. Power BI en Chile (WS2).**
- Por qué: «curso power bi» (137 impresiones, posición 38), «curso de power bi» (129, posición 38,8), «cursos power bi» (90, posición 35,8) y «cursos de power bi» (76, posición 28,7) no tienen ningún clic. /cursos/power-bi funciona como ficha comercial delgada.
- Qué hacer: enriquecer /cursos/power-bi, en vez de crear otra URL que compita con ella:
  - H1 «Curso de Power BI en vivo en Chile».
  - Temario por clase, proyecto final y docente con credenciales.
  - Horario en hora de Chile y precio de 169.000 visible en el HTML.
  - 8 preguntas frecuentes, testimonios reales y comparativa en vivo vs grabado.
  - Enlaces desde home, /cursos, la guía de Chile y la guía DAX.
- Aceptación: más de 1.200 palabras útiles, Offer correcto, y meta de top 15 en 6 semanas (hipótesis).

**S2. Análisis de datos (WS2).**
- Por qué: es la URL con más impresiones (440, posición 24,8), cubre «curso data analyst» (posición 52) y «curso analista de datos» (posición 28), y es el curso de mayor valor (338.000).
- Qué hacer: sección «ruta para ser analista de datos», salidas laborales, comparación con Power BI solo, preguntas frecuentes, y plan de cuotas si existe.
- Aceptación: precio de 338.000 coherente en todo el sitio.

**S3. Guías (WS2).** Usar los textos de `GUIAS_POWER_BI_PAISES.md`. El orden de publicación va por datos:
- **Ola 1:** Chile, Perú (529 impresiones), Argentina (468) y la guía DAX.
- **Ola 2:** México, Colombia, Uruguay y Power BI vs Excel.
- **Ola 3:** Paraguay (precio pendiente) y el piloto de Claude.
  - /mx/cursos/claude ya tiene 10 % de CTR en posición 8,8, y Claude rankea bien en sv, cr, ec, bo y py.
  - Conviene extender ese piloto antes que crear nuevas guías de Power BI.

Para todas las olas:
- Revisar en GSC a las 4–6 semanas.
- No publicar más de 3 por semana.

**G1. GEO (WS4).**
- Por qué: ChatGPT trajo 56 sesiones con 10,7 % de tasa de eventos clave. Es el mejor canal por tasa.
- Qué hacer:
  - Ampliar `/llms.txt`, que hoy solo trae el catálogo, con precios por país, modalidad, duración, certificado, contacto y links a preguntas frecuentes y guías.
  - Crear `/preguntas-frecuentes` con FAQPage y respuestas de 40–60 palabras, autocontenidas y con cifras.
  - Crear las comparativas (en vivo vs grabado, Power BI vs Excel).
  - Crear una página «Precios» con tabla HTML, fácil de citar.
  - Organization y Course con `sameAs` (LinkedIn, YouTube, Google Business).
  - Fecha de actualización visible.
- Medición: canal personalizado «AI Assistant» en GA4 (chatgpt.com, perplexity.ai, gemini, copilot, claude.ai) y `utm_source` cuando los asistentes lo agregan.
- Aceptación: llms.txt con precios correctos y canal IA en un informe.

**G2. Menciones (Manu + WS4).**
- Perfil de Google Business con reseñas reales de alumnos.
- Presencia en directorios de cursos y en LinkedIn.
- Respuestas en Reddit y foros solo si son genuinas.
- Nada de reseñas falsas.

**C1. Formulario (WS3).**
- Qué hacer:
  - Un paso con nombre y email obligatorios, y WhatsApp opcional.
  - El registro después, o con login social si existe.
  - Mensajes de error visibles.
  - generate_lead se dispara solo cuando el server responde 200.
- Aceptación: tasa form_start→lead ≥ 35 % en 14 días (hipótesis; hoy 18 %).

**C2. WhatsApp (WS3).** wa.me con `?text=Hola, vengo de programbi.com ({país}) y quiero info del curso {curso}` desde el SSR, y botón flotante en mobile.
- Hoy la ficha de Chile tiene uno con text y otros dos sin.
- Aceptación: todos los wa.me del HTML llevan text=.

**C3. Captación de email (WS3).**
- Plantilla Power BI gratis, que requiere la migración de Supabase.
- Clase gratis en vivo mensual con inscripción solo por email.
- Secuencia de 3 correos: plantilla, caso de alumno y fechas con precio.

**C4. Prueba social (WS3).** Testimonios reales, con país, junto al precio, y una muestra del certificado.

**C5. Popup y CTA fijo (WS3).**
- Popup de salida solo en desktop, una vez por usuario cada 7 días y nunca en mobile como intersticial (para evitar la penalización de Google).
- En mobile, una barra fija con «Inscribirme» y WhatsApp.

**M1. (not set) (WS4).**
- Qué hacer:
  - Un solo `page_view` por ruta del App Router, con `page_location` y `page_referrer`.
  - Desactivar el page_view automático si se envía uno manual, para no duplicar.
  - Asegurar que el primer evento de la sesión sea page_view.
  - Excluir /admin, /recuperar y las rutas internas de GA.
- Aceptación: (not set) por debajo del 10 % en 7 días.

**M2. Bots y nombres de eventos (WS4).**
- Filtro o segmento sin EE.UU. con menos de 15 s.
- Unificar en `generate_lead` con `lead_type` (contacto, plantilla, empresas, registro).
- `empresas_contact/(not set)` (25 sesiones) indica UTMs mal formados en los correos de empresas. Corregirlos con `utm_source=email&utm_medium=empresas`.

**M3. Embudo y remarketing (WS4).**
- Parámetros comunes en los eventos: country, course y page_type.
- view_item con value y currency.
- Embudo view_curso → form_start → generate_lead → begin_checkout → purchase.
- Audiencias de GA4 para remarketing (vio la ficha sin enviar el formulario), con banner de cookies si se activan los anuncios.

**X1. /latam (WS1/WS2).** Hub en USD que enlace los países secundarios. **No** reemplaza a los existentes (ver T3), porque ya rankean.

## 4. Plan de 3 sprints
**Sprint 1 (semana 1): arreglar lo que daña.**
- T1, T2, C1, C2, M1 y M2.
- Merge con el OK de Manu y luego validación de GSC.

**Sprint 2 (semanas 2–3): indexación y captación.**
- T3, T4, S1, S2, C3, G1 y la ola 1 de guías.

**Sprint 3 (semanas 4–6): escala.**
- Olas 2–3, C4, C5, M3, X1 y G2.
- Revisión en GSC de qué guías aparecen.

KPIs a 6 semanas. Las metas son hipótesis, no promesas:

| KPI | Base | Meta |
|---|---|---|
| Clics GSC en 18 días | 135 | 250 |
| Posición de «curso power bi» | 38 | ≤ 15 |
| CTR de /cursos/analisis-de-datos | 1,6 % | 4 % |
| Landing (not set) | 61 % | < 10 % |
| form_start → generate_lead | 18 % | ≥ 35 % |
| generate_lead en 14 días | 9 | 30 |
| Compras en 14 días | 0 | ≥ 2 |
| Sesiones desde IA en 14 días | 59 | 100 |

## 5. Qué NO hacer
- No duplicar guías entre países cambiando solo el nombre, ni crear guías DAX por país.
- No hacer 301 de los países secundarios a /latam mientras rankean.
- No crear una segunda URL de «curso power bi» que canibalice /cursos/power-bi.
- No usar intersticiales en mobile, popups agresivos ni contadores falsos.
- No inventar testimonios, reseñas, sueldos ni alumnos.
- No dejar precios escritos a mano fuera de pricing.ts.
- No cambiar slugs sin poner el 301.
- No publicar más de 3 guías por semana, ni todas de golpe.
- No bloquear por robots las páginas que tienen canonical (Google no ve el canonical).
- No medir sin filtrar los bots.

## 6. Pendientes de Manu
1. Aplicar la migración de Supabase `20261102000000_leads_magnet.sql` y configurar `IP_HASH_SALT` en Vercel.
2. Decidir el precio en USD para Paraguay y los países secundarios. Hoy se muestra USD; confirmar el valor.
3. Exportar de GSC las 26 URL 404 y las 65 descubiertas, o dar acceso.
4. Confirmar si el checkout cobra en CLP en los otros países.
5. Aprobar el formulario de un paso, que revierte en parte `05dacd9`.
6. Juntar 5–10 testimonios reales con su permiso y crear o activar Google Business.
7. Dar el OK de cada merge y hacer una compra de prueba después del Sprint 1.
