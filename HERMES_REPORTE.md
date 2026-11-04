# HERMES_REPORTE — Integración v2

## Correcciones finales (2026-11-04)

Rama: `mejora/integracion-v2`. Repo: `C:/dev/pbi-v2`. Nunca se tocó `main`.

### A. /precios — Mercado financiero sin descuento falso (BLOQUEANTE)

- **Síntoma:** la tabla mostraba `$249.000 CLP` con `$349.000` tachado y `29% off`.
- **Causa:** `lib/paises/precios-pagina.ts` (`filaChile`) resolvía el precio con
  `resolverPrecioClp()` a partir de `getCheckoutCatalog()`, que lee `promotions` y
  `price_overrides` de Supabase. Había una promoción activa para
  `mercado-financiero` con `promo_price = 249000` (creada el 30-10, antes del
  cambio de precios del 04-11).
- **Fix:** `filaChile()` toma el precio de `precioChile(slug)` en
  `config/pricing.ts` (fuente única). `listLabel = null` y `discount = 0`.
  `preciosDePais()` ya no consulta el catálogo del checkout para Chile.
- **Verificado:** build + HTTP 200. La fila muestra `$349.000 CLP` sin tachado,
  sin `% off` y sin `line-through`; 0 ocurrencias de `249.000` en `/precios`;
  JSON-LD `Offer price: 349000`.

### B. /referidos — precios vigentes

- **Causa:** `lib/referrals/constants.ts` tenía `199_000`, `498_000` y `249_000`
  escritos a mano.
- **Fix:** los tres valores se derivan de `PRECIOS_CLP`:
  mínimo publicado = 169.000, máximo publicado = 349.000 y
  `analisis-de-datos` = 338.000 como valor por defecto. El slider usa
  `step=1000` para que 338.000 sea alcanzable.
- **Verificado:** HTTP 200; la landing muestra 169.000 / 338.000 / 349.000 y
  0 ocurrencias de 199.000, 249.000 y 498.000.
- **Búsqueda en el repo:** no quedan precios viejos en código vivo. Solo
  aparecen en documentos históricos (`ANALISIS_Y_MEJORAS.md`, `PLAN_MEJORAS.md`,
  `HERMES_ORQUESTACION.md`, `GUIAS_POWER_BI_PAISES.md`, `docs/…`) y en previews
  de email (`scripts/previews/*.html`), que no se tocaron por no ser parte del
  sitio.

### C. /registro — textos coherentes con el formulario

- Subtítulo: `Nombre, email y teléfono. Después ves fechas y valor.` →
  `Nombre, email y contraseña. Después ves fechas y valor.`
- Placeholder y texto de ayuda: `Mínimo 8 caracteres` → `Mínimo 6 caracteres`.
- Label duplicado `Email *` del campo de contraseña → `Contraseña *`.
- No se tocó `validatePassword` ni `isBreachedPassword`; la regla real ya era
  mínimo 6 caracteres.
- **Verificado:** HTTP 200 y cadenas correctas en el HTML generado.

### D. /llms.txt — todas las guías publicadas

- **Causa:** `guiasRaiz()` solo devolvía las rutas que empiezan por `/guias/`
  (4 guías), y dejaba fuera las de país con prefijo y Claude México.
- **Fix:** `GUIAS` de `lib/guias/generado` filtrado con el mismo criterio que
  `app/sitemap.ts`: país indexable o transversal. Sin rutas ni títulos
  hardcodeados. Paraguay queda fuera por noindex.
- **Verificado:** HTTP 200 con 10 guías listadas: Chile, Argentina, México,
  Colombia, Perú, Uruguay, Claude Chile, Claude México, funciones DAX y
  Power BI vs Excel.

### Verificación ejecutada

- `npx tsc --noEmit` → exit 0.
- `npx eslint` sobre los 5 archivos tocados → 0 errores (1 warning preexistente
  en `registro/page.tsx`).
- `npx next build --webpack` → exit 0 (660 páginas estáticas).
- `next start` + `curl` → HTTP 200 en `/precios`, `/referidos`, `/registro` y
  `/llms.txt`.

### Pendiente detectado (no ejecutado)

En Supabase sigue activa la promoción `mercado-financiero` con
`promo_price = 249000` y 29%. `/precios` y la ficha ya no la usan, pero el
checkout (`app/api/mp/create/route.ts`) todavía podría aplicarla y cobrar
249.000. No se modificó la base de datos. Para alinearla con la fuente única:

```sql
update public.promotions
set is_active = false
where target_id = 'mercado-financiero'
  and promo_price = 249000
  and is_active = true;
```
