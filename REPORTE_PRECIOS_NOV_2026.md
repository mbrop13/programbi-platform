# Reporte de Verificación de Precios — Noviembre 2026

**Rama:** `feat/precios-nov-2026`  
**Fecha de verificación:** 2026-11-23  
**Servidor auditado:** `next start -p 3197` (build de producción `--webpack`)

## 1. Validaciones de Código, Build y Playwright

- `git diff origin/main -- data/`: **vacío** (sin cambios en `data/`).
- `npx tsc --noEmit`: **0 errores** (se corrigió comparación redundante `pais === ISO_CHILE` en `app/(pais)/[pais]/miami/page.tsx`).
- `npx eslint` sobre los archivos tocados: **0 errores**.
- `npm run build` (`next build --webpack`): **exitoso** (1.681 páginas estáticas generadas).
- **Playwright (`playwright-core`)** en `/cursos/power-bi`, `/mx/cursos/power-bi`, `/pe/cursos/power-bi`, `/es/precios`, `/us/precios`, `/mx/cursos/power-bi/brochure`:
  - **0 errores de hidratación / React #418 / JS de aplicación** (solo 2 respuestas 404 locales esperadas de `/_vercel/insights/script.js` y `/_vercel/speed-insights/script.js` fuera de Vercel).
  - **0 selector visible de país o moneda** en ninguna de las 6 rutas.
- **Aislamiento de promociones**: `promo_price` de Chile (`169000`, `129000` SQL Server, `249000` Mercado Financiero) no aparece en ningún país fuera de Chile. Venezuela opera 100% en `USD` (0 menciones a `VES`).

## 2. Auditoría de URLs (Sección 7)

| URL | HTML visible observado (muestra precios) | JSON-LD `Offer` | Cuotas observadas | Estado |
| --- | --- | --- | --- | --- |
| `/cursos/power-bi` | $169.000 / $249.000 | 169000 CLP (validUntil:2026-12-31) | - | 200 OK |
| `/cursos/analisis-de-datos` | $338.000 / $747.000 | 338000 CLP (validUntil:2026-12-31) | - | 200 OK |
| `/cursos/analitica-mineria` | $338.000 / $747.000 | 338000 CLP (validUntil:2026-12-31) | - | 200 OK |
| `/cursos/sql-server` | $129.000 / $249.000 | 129000 CLP (validUntil:2026-12-31) | - | 200 OK |
| `/cursos/claude` | $169.000 / $249.000 | 169000 CLP (validUntil:2026-12-31) | - | 200 OK |
| `/cursos/mercado-financiero` | $249.000 / $514.000 | 249000 CLP (validUntil:2026-12-31) | - | 200 OK |
| `/cursos/power-bi/brochure` | $249.000 / $169.000 / $56.333 | - | 3 cuotas sin interés de $56.333 | 200 OK |
| `/precios` | $169.000 / $249.000 / $338.000 / $747.000 / $514.000 | - | - | 200 OK |
| `/guias/curso-analisis-de-datos-chile` | $979.205 / $1.147.226 / $1.234.567 / $. / $338.000 / $747.000, | - | - | 200 OK |
| `/guias/licencias-power-bi-precio-chile` | $169.000 / $249.000 | - | - | 200 OK |
| `/versus/programbi-vs-coderhouse-power-bi` | $198.000 / $8.450 / $19.800 / $495.000 / $249.000 | - | - | 200 OK |
| `/us/cursos/power-bi` | $249 / $12 / $5,250 | 249 USD | Sin cuotas | 200 OK |
| `/us/cursos/analisis-de-datos` | $498 / $8 / $5,250 | 498 USD | Sin cuotas | 200 OK |
| `/us/cursos/mercado-financiero` | $369 / $12 / $5,250 | 369 USD | Sin cuotas | 200 OK |
| `/us/precios` | $249 / $498 / $369 / $5,250 | - | Sin cuotas | 200 OK |
| `/es/cursos/power-bi` | $249 / $498 / $369 | 249 USD | Sin cuotas | 200 OK |
| `/es/cursos/analisis-de-datos` | $498 / $249 / $369 | 498 USD | Sin cuotas | 200 OK |
| `/es/precios` | $249 / $498 / $369 | - | Sin cuotas | 200 OK |
| `/mx/cursos/power-bi` | $3,480 / $1,160 / $6,960 / $2,320 / $5,320 / $7,830 | 3480 MXN | 3 cuotas sin interés de $1,160 / 3 cuotas sin interés de $2,320 / 3 cuotas sin interés de $1,773 | 200 OK |
| `/mx/cursos/analisis-de-datos` | $6,960 / $2,320 / $3,480 / $1,160 / $5,320 / $7,830 | 6960 MXN | 3 cuotas sin interés de $2,320 / 3 cuotas sin interés de $1,160 / 3 cuotas sin interés de $1,773 | 200 OK |
| `/mx/precios` | $3,480 / $1,160 / $6,960 / $2,320 / $5,320 / $7,830 | - | 3 cuotas sin interés de $1,160 / 3 cuotas sin interés de $2,320 / 3 cuotas sin interés de $1,773 | 200 OK |
| `/mx/cursos/power-bi/brochure` | $3,480 / $1,160 | - | 3 cuotas sin interés de $1,160 | 200 OK |
| `/mx/guias/curso-analisis-de-datos-mexico` | $13,000 / $15,000 / $18,000 / $22,000 / $25,000 / $30,000 | - | - | 200 OK |
| `/pe/cursos/power-bi` | S/ 618 / S/206 / S/ 1,236 / S/412 / S/ 904 / S/ 1,332 | 618 PEN | 3 cuotas sin interés de S/206 / 3 cuotas sin interés de S/412 / 3 cuotas sin interés de S/301 | 200 OK |
| `/pe/cursos/analisis-de-datos` | S/ 1,236 / S/412 / S/ 618 / S/206 / S/ 904 / S/ 1,332 | 1236 PEN | 3 cuotas sin interés de S/412 / 3 cuotas sin interés de S/206 / 3 cuotas sin interés de S/301 | 200 OK |
| `/ar/cursos/power-bi` | $ 312.000 / $104.000 / $ 624.000 / $208.000 / $ 437.000 / $ 643.000 | 312000 ARS | 3 cuotas sin interés de $104.000 / 3 cuotas sin interés de $208.000 / 3 cuotas sin interés de $145.667 | 200 OK |
| `/co/cursos/analisis-de-datos` | $ 1.038.000 / $346.000 / $ 519.000 / $173.000 / $ 878.000 / $ 1.294.000 | 1038000 COP | 3 cuotas sin interés de $346.000 / 3 cuotas sin interés de $173.000 / 3 cuotas sin interés de $292.667 | 200 OK |
| `/uy/precios` | $ 8.100 / $2.700 / $ 16.200 / $5.400 / $ 12.177 / $ 17.917 | - | 3 cuotas sin interés de $2.700 / 3 cuotas sin interés de $5.400 / 3 cuotas sin interés de $4.059 | 200 OK |
| `/pa/cursos/power-bi` | $66.33 | 199 USD | 3 cuotas sin interés de $66.33 | 200 OK |
| `/cr/precios` | $66,33 / $132,67 / $99 | - | 3 cuotas sin interés de $66,33 / 3 cuotas sin interés de $132,67 / 3 cuotas sin interés de $99 | 200 OK |
| `/do/precios` | $149 / $49.67 / $298 / $99.33 / $280 / $412 | - | 3 cuotas sin interés de $49.67 / 3 cuotas sin interés de $99.33 / 3 cuotas sin interés de $93.33 | 200 OK |
| `/ec/precios` | $149 / $49,67 / $298 / $99,33 / $262 / $386 | - | 3 cuotas sin interés de $49,67 / 3 cuotas sin interés de $99,33 / 3 cuotas sin interés de $87,33 | 200 OK |
| `/py/precios` | $49,67 / $99,33 / $87,33 | - | 3 cuotas sin interés de $49,67 / 3 cuotas sin interés de $99,33 / 3 cuotas sin interés de $87,33 | 200 OK |
| `/gt/precios` | $49.67 / $99.33 / $87.33 | - | 3 cuotas sin interés de $49.67 / 3 cuotas sin interés de $99.33 / 3 cuotas sin interés de $87.33 | 200 OK |
| `/bo/precios` | $49,67 / $99,33 / $81,67 | - | 3 cuotas sin interés de $49,67 / 3 cuotas sin interés de $99,33 / 3 cuotas sin interés de $81,67 | 200 OK |
| `/sv/precios` | $149 / $49.67 / $298 / $99.33 / $262 / $386 | - | 3 cuotas sin interés de $49.67 / 3 cuotas sin interés de $99.33 / 3 cuotas sin interés de $87.33 | 200 OK |
| `/hn/precios` | $49.67 / $99.33 / $81.67 | - | 3 cuotas sin interés de $49.67 / 3 cuotas sin interés de $99.33 / 3 cuotas sin interés de $81.67 | 200 OK |
| `/ve/precios` | $49,67 / $99,33 / $81,67 | - | 3 cuotas sin interés de $49,67 / 3 cuotas sin interés de $99,33 / 3 cuotas sin interés de $81,67 | 200 OK |
| `/ni/precios` | $49.67 / $99.33 / $81.67 | - | 3 cuotas sin interés de $49.67 / 3 cuotas sin interés de $99.33 / 3 cuotas sin interés de $81.67 | 200 OK |
| `/mx/cursos/mercado-financiero` | $5,320 / $7,830 / $1,773 / $3,480 / $1,160 / $6,960 | 5320 MXN | 3 cuotas sin interés de $1,773 / 3 cuotas sin interés de $1,160 / 3 cuotas sin interés de $2,320 | 200 OK |
| `/pe/cursos/mercado-financiero` | S/ 904 / S/ 1,332 / S/301 / S/ 618 / S/206 / S/ 1,236 | 904 PEN | 3 cuotas sin interés de S/301 / 3 cuotas sin interés de S/206 / 3 cuotas sin interés de S/412 | 200 OK |
| `/ar/cursos/mercado-financiero` | $ 437.000 / $ 643.000 / $145.667 / $ 312.000 / $104.000 / $ 624.000 | 437000 ARS | 3 cuotas sin interés de $145.667 / 3 cuotas sin interés de $104.000 / 3 cuotas sin interés de $208.000 | 200 OK |
| `/co/cursos/mercado-financiero` | $ 878.000 / $ 1.294.000 / $292.667 / $ 519.000 / $173.000 / $ 1.038.000 | 878000 COP | 3 cuotas sin interés de $292.667 / 3 cuotas sin interés de $173.000 / 3 cuotas sin interés de $346.000 | 200 OK |
| `/cr/cursos/mercado-financiero` | $99 | 297 USD | 3 cuotas sin interés de $99 | 200 OK |
| `/bo/cursos/mercado-financiero` | $81,67 | 245 USD | 3 cuotas sin interés de $81,67 | 200 OK |
| `/ve/cursos/mercado-financiero` | $81,67 | 245 USD | 3 cuotas sin interés de $81,67 | 200 OK |

> **Nota sobre Chile y FAQ 30 h:** En Chile (`/cursos/sql-server` y `/cursos/mercado-financiero`), Supabase mantiene promociones activas de Chile (`$129.000` y `$249.000` respectivamente), aisladas exclusivamente a `cl`. En LatAm, los cursos de 20 h y 60 h se muestran sin tachado ni `% de descuento`; la única mención a `% de descuento` detectada en fichas de 20 h/60 h corresponde a la FAQ que referencia el curso de 30 h (*Mercado financiero*).

## 3. Curso de 30 horas (`mercado-financiero`) — 19 Países

| ISO | País | URL | Vigente (catálogo) | Lista (sin cambios) | JSON-LD `Offer` observado | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| CL | Chile | `/cursos/mercado-financiero` | $349.000 (promo DB $249.000) | $514.000 | 249000 CLP | 200 OK |
| AR | Argentina | `/ar/cursos/mercado-financiero` | $437.000 | $643.000 | 437000 ARS | 200 OK |
| MX | México | `/mx/cursos/mercado-financiero` | $5.320 | $7.830 | 5320 MXN | 200 OK |
| PE | Perú | `/pe/cursos/mercado-financiero` | S/ 904 | S/ 1.332 | 904 PEN | 200 OK |
| CO | Colombia | `/co/cursos/mercado-financiero` | $878.000 | $1.294.000 | 878000 COP | 200 OK |
| UY | Uruguay | `/uy/cursos/mercado-financiero` | $12.177 | $17.917 | 12177 UYU | 200 OK |
| PA | Panamá | `/pa/cursos/mercado-financiero` | $297 | $437 | 297 USD | 200 OK |
| CR | Costa Rica | `/cr/cursos/mercado-financiero` | $297 | $437 | 297 USD | 200 OK |
| DO | República Dominicana | `/do/cursos/mercado-financiero` | $280 | $412 | 280 USD | 200 OK |
| EC | Ecuador | `/ec/cursos/mercado-financiero` | $262 | $386 | 262 USD | 200 OK |
| PY | Paraguay | `/py/cursos/mercado-financiero` | $262 | $386 | 262 USD | 200 OK |
| GT | Guatemala | `/gt/cursos/mercado-financiero` | $262 | $386 | 262 USD | 200 OK |
| BO | Bolivia | `/bo/cursos/mercado-financiero` | $245 | $360 | 245 USD | 200 OK |
| SV | El Salvador | `/sv/cursos/mercado-financiero` | $262 | $386 | 262 USD | 200 OK |
| HN | Honduras | `/hn/cursos/mercado-financiero` | $245 | $360 | 245 USD | 200 OK |
| VE | Venezuela | `/ve/cursos/mercado-financiero` | $245 | $360 | 245 USD | 200 OK |
| NI | Nicaragua | `/ni/cursos/mercado-financiero` | $245 | $360 | 245 USD | 200 OK |
| US | Estados Unidos | `/us/cursos/mercado-financiero` | $369 | Sin tachado (FTC) | 369 USD | 200 OK |
| ES | España | `/es/cursos/mercado-financiero` | $369 | Sin tachado | 369 USD | 200 OK |

## 4. Pendientes de Manu (no implementados en esta rama)

1. **Curso 30 h (`mercado-financiero`)**: revisar si corresponde ajustar su precio base/lista o desactivar la promoción activa de `$249.000` CLP en Supabase para Chile.
2. **Comisiones Mercado Pago / pasarela EUR**: revisar estructura de comisiones de Mercado Pago por país y definir pasarela directa en EUR/USD para Europa y Estados Unidos.
3. **AdaxBI / competidores**: monitoreo de precios y posicionamiento frente a AdaxBI y competidores locales.
4. **Regla BIN**: evaluar validación/detección por BIN de tarjeta en checkout internacional para evitar arbitraje de precios o rechazos.
5. **Revisión Argentina (15 dic 2026)**: revisar `PRECIOS_ARS` (`$312.000` / `$624.000` / `$437.000`) antes del `2026-12-15` según evolución del dólar MEP/bolsa.
6. **Equivalente opcional EUR 229 / 459 en España**: evaluar si España migra de `USD` (`$249` / `$498`) a `EUR` (`229 €` / `459 €`) al habilitar pasarela europea.
7. **Puntos tributarios / Bolivia**: revisar tratamiento tributario por país (IVA/retenciones locales) y restricciones cambiarias o de tarjetas en Bolivia.
