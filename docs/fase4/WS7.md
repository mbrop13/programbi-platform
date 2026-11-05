# WS7 — Medición y atribución

Ejecutado por el orquestador en `mejora/fase4`.

## Estado

- [x] Hecho (con hallazgos: varias piezas ya venían de fase 3)

## Qué se hizo

- `lib/analytics/marketing.ts`: nuevo evento `webinar_signup` y
  `trackWebinarSignup({ pais, source, course })`.
- `app/(marketing)/webinar/WebinarClient.tsx`: dispara `webinar_signup` solo con respuesta
  OK del endpoint de leads (no en error).
- `scripts/verificar-fase4.mjs`: verificación HTTP de las rutas de la fase 4 (precios por
  país, hub y tests, landings SQL/Python, `/clase-gratis` noindex, certificado inválido
  404, verificador 200, Paraguay sin `Offer`).

## Hallazgos (ya estaban resueltos, no se rehicieron)

- `quiz_complete` ya incluía `tema`, `nivel`, `pais`, `aciertos` y `total`.
- `download_template` ya se dispara desde `components/marketing/PlantillaDescarga.tsx`.
- El mensaje de WhatsApp ya arma `Hola, quiero info del curso {curso} desde {país}
  [ref:{slug}]` en `lib/whatsapp.ts` (P6 cumplido en fase 3).
- `_dbg` y `debug_mode` ya se envían solo con el flag de debug; `pb_dbg` va siempre como
  diagnóstico.

## Pendientes / TODO_MANU

- Ver los eventos en GA4 DebugView desde el preview (requiere navegador y el preview de
  Vercel; no se puede desde el build local).
- `purchase` con `value`/`currency` depende del webhook de pago real.

## Commits

- `36c7be8` feat(f4-medicion): evento webinar_signup y verificación de rutas de fase 4
