# WS1 — Cuotas sin interés en todos los países

Ejecutado por el orquestador en `mejora/fase4` (el subagente no se pudo lanzar por el
tope de delegación del runtime).
Base: `mejora/fase4` (`d347e0c`).

## Estado

- [x] Hecho

## Qué se hizo

Decisión de Manu (4-nov-2026): las 3 cuotas sin interés aplican en todos los países.
Se creó `config/cuotas.ts` como fuente única (`CUOTAS_SIN_INTERES`, `cuotasSinInteres`,
`textoCuotas`, `NOTA_CUOTAS`, `NOTA_CUOTAS_MEDIOS`) y se reemplazaron los textos
hardcodeados:

- `lib/faq/contenido.ts`: 11 respuestas/resúmenes/pasos ahora interpolan `CUOTAS`.
- `components/faq/FaqContenido.tsx`: nota de formas de pago con el número de la config.
- `components/guias/Bloque30Segundos.tsx`: bloque «En 30 segundos» usa `textoCuotas(iso)`.
- `components/guias/ElementoVisual.tsx`: lista «Lo que incluye» usa la config.
- `lib/email/quote-template.ts`: «hasta 12 cuotas» → 3 cuotas (contradecía la decisión).
- `app/(marketing)/cursos/[slug]/CourseDetailClient.tsx`: nota `NOTA_CUOTAS` bajo el precio.
- `app/(marketing)/pago/PagoClient.tsx`: nota `NOTA_CUOTAS_MEDIOS` bajo el total del checkout.

No se tocaron los datos de competidores (`lib/data/academias.ts`) ni empresas/SENCE.

## Verificación local

- `rg "3 cuotas|hasta 12 cuotas"` en `app components lib` solo devuelve `config/cuotas.ts`
  (comentarios) y `lib/data/academias.ts` (texto sobre competidores).
- Sin build (lo corre el orquestador sobre la integradora).

## Pendientes / TODO_MANU

- Confirmar con la pasarela de cada país que las 3 cuotas sin interés se ofrecen sin
  recargo; el texto afirma la condición comercial, no el detalle técnico de cada medio.
- `lib/data/academias.ts` sigue diciendo «(Mercado Pago o Webpay)» para ProgramBI; es
  coherente con `MEDIOS_CUOTAS`, pero si Manu agrega otra pasarela hay que actualizarlo.

## Commits

- `7a28c5d` feat(f4-cuotas): 3 cuotas sin interés en todos los países desde config/cuotas
