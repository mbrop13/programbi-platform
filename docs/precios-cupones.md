# Precios y cupones

## Decisión de precios (03-11-2026)

- Chile: el precio comercial real es CLP $169.000 y el precio de lista es CLP $249.000 (`public/llms.txt:19`, `config/paises.ts:33,66`).
- El catálogo de Chile manda en la página: `preciosDePais` usa `getCheckoutCatalog()` para Chile (`lib/paises/precios-pagina.ts:61-89,135-143`).
- Argentina, México, Perú, Colombia y Uruguay usan tablas fijas en `config/paises.ts` (`PRECIOS_ARS` y `precios(...)`) y no se derivan del precio chileno (`config/paises.ts:82-98,190-191,226-227,335-336,408-409,444-445`; `public/llms.txt:21`).
- Descuentos de planes de la comunidad: no se consideran. **No verificable como "desactivados"**: `app/api/mp/create/route.ts:38-44` y `app/api/flow/create/route.ts:38-44` todavía calculan descuentos pro/max/ultra en CLP. En moneda local no se aplican.

## Cupones

- Son los códigos de la tabla `coupons`. El cliente los escribe en el checkout y los valida `validateCouponAction` (`lib/supabase/comunidad-ai.ts:1930-1982`).
- No son las promociones/overrides del panel admin: esas viven en `promotions` y `price_overrides` y se aplican automáticamente (`lib/pago/precio-clp.ts:45-70`; `app/api/mp/create/route.ts:47-54,95-113`).
- La fórmula del cupón sobre moneda local vive en `totalLocalConCupon` (`lib/paises/precios.ts:94-127`).

## Regla del cupón

- Si es stacking, el cupón se aplica al total local (`lib/paises/precios.ts:116-120`; `app/api/mp/create/route.ts:200-203`).
- Si no es stacking, se aplica solo a los ítems sin promoción; los ítems con promo mantienen su subtotal (`lib/paises/precios.ts:122-127`; `app/api/mp/create/route.ts:204-218`).
- Nunca se aplica la promoción chilena ni el descuento de plan al importe local (`app/api/mp/create/route.ts:179-182,191-222`).

## Pendiente conocido

- El "bump" de CLP $99.000 existe solo en las rutas API (`app/api/mp/create/route.ts:137-143`; `app/api/flow/create/route.ts:143-149`).
- Ningún componente del front envía `bumpSelections`: `PagoClient` arma el body sin ese campo (`app/(marketing)/pago/PagoClient.tsx:555-565`). Hoy es código sin uso.
- Si se activa, en la ruta MP no se cobraría en moneda local: el importe local sale de `validatedItems` y el bump solo suma a `grandTotalClp` (`app/api/mp/create/route.ts:191-195`). Flow cobra en CLP (`app/api/flow/create/route.ts:180-188,209-210`), así que no tiene cobro local.
