# Indexabilidad de países secundarios (WS9)

Fecha: 9 nov 2026 · Fuente de verdad en código: [`indexabilidad.ts`](./indexabilidad.ts).
Consumidores: `metadataLocal` (metadata de páginas), `hreflangDe` (alternates) y,
desde WS10, `app/sitemap.ts`.

## Regla aplicada

- Si la URL **no tiene clics** en GSC (28 días) y su texto es **> 70 % igual** a la
  versión raíz de Chile → `noindex, follow`, fuera del sitemap y fuera del hreflang.
- Si tiene clics → **no se noindexa** (se deja index y se documenta).
- Prohibido canonical cruzado entre países: se usa `noindex` o 301.
- `/{pais}/curso-power-bi` no entra aquí: WS3 lo resuelve con 301 a
  `/{pais}/cursos/power-bi`.
- Países no indexables (`hn`, `ni`, `pa`, `py`) siguen con `noindex, follow` por
  `config/paises.ts`; esta lista no los toca.

Similitud medida con shingles de 5 palabras sobre el `<main>` de producción
(script `similitud.py`, 9 nov 2026). GSC: `sc-domain:programbi.com`, 28 días.

## Tabla URL → decisión → motivo

### `/{pais}/precios`

| URL | Decisión | Motivo |
|---|---|---|
| `/ec/precios` | noindex, follow | Mismo listado que `/precios`, solo cambia moneda/medios de pago. Similitud 84,5–86,4 %. Sin clics GSC. |
| `/uy/precios` | noindex, follow | Ídem. Sin clics GSC. |
| `/cr/precios` | noindex, follow | Ídem. Sin clics GSC. |
| `/do/precios` | noindex, follow | Ídem. Sin clics GSC. |
| `/gt/precios` | noindex, follow | Ídem. Sin clics GSC. |
| `/ve/precios` | noindex, follow | Ídem. Sin clics GSC. |
| `/bo/precios` | noindex, follow | Ídem. Sin clics GSC. |
| `/sv/precios` | noindex, follow | Ídem. Sin clics GSC. |

### `/{pais}/preguntas-frecuentes`

| URL | Decisión | Motivo |
|---|---|---|
| `/ec/preguntas-frecuentes` | noindex, follow | Reexporta la página de Chile: mismas respuestas y JSON-LD. Similitud 94,6–95,1 %. Sin clics GSC. |
| `/uy/preguntas-frecuentes` | noindex, follow | Ídem. Sin clics GSC. |
| `/cr/preguntas-frecuentes` | noindex, follow | Ídem. Sin clics GSC. |
| `/do/preguntas-frecuentes` | noindex, follow | Ídem. Sin clics GSC. |
| `/gt/preguntas-frecuentes` | noindex, follow | Ídem. Sin clics GSC. |
| `/ve/preguntas-frecuentes` | noindex, follow | Ídem. Sin clics GSC. |
| `/bo/preguntas-frecuentes` | noindex, follow | Ídem. Sin clics GSC. |
| `/sv/preguntas-frecuentes` | noindex, follow | Ídem. Sin clics GSC. |

### `/{pais}/faq`

| URL | Decisión | Motivo |
|---|---|---|
| `/ec/faq` | noindex, follow | Duplicado de `/faq` (y de `/{pais}/preguntas-frecuentes`). Similitud 89,1–89,5 %. Sin clics GSC. |
| `/uy/faq` | **index** (excepción) | FAQ propia de Uruguay (agro, frigoríficos, Montevideo, pago en UYU); similitud 7,1 % con `/faq`, bajo el umbral 70 %. |
| `/cr/faq` | noindex, follow | Ídem `/ec/faq`. Sin clics GSC. |
| `/do/faq` | noindex, follow | Ídem. Sin clics GSC. |
| `/gt/faq` | noindex, follow | Ídem. Sin clics GSC. |
| `/ve/faq` | noindex, follow | Ídem. Sin clics GSC. |
| `/bo/faq` | noindex, follow | Ídem. Sin clics GSC. |
| `/sv/faq` | noindex, follow | Ídem. Sin clics GSC. |

### `/{pais}/curso-sql-online`

| URL | Decisión | Motivo |
|---|---|---|
| `/ec/curso-sql-online` | noindex, follow | Landing que reexporta la raíz. Similitud 88,3–89,8 %. Sin clics GSC. |
| `/uy/curso-sql-online` | noindex, follow | Ídem. Sin clics GSC. |
| `/cr/curso-sql-online` | noindex, follow | Ídem. Sin clics GSC. |
| `/do/curso-sql-online` | noindex, follow | Ídem. Sin clics GSC. |
| `/gt/curso-sql-online` | noindex, follow | Ídem. Sin clics GSC. |
| `/ve/curso-sql-online` | noindex, follow | Ídem. Sin clics GSC. |
| `/bo/curso-sql-online` | noindex, follow | Ídem. Sin clics GSC. |
| `/sv/curso-sql-online` | noindex, follow | Ídem. Sin clics GSC. |

### `/{pais}/curso-python`

| URL | Decisión | Motivo |
|---|---|---|
| `/ec/curso-python` | noindex, follow | Landing que reexporta la raíz. Similitud 89,6–90,4 %. Sin clics GSC. |
| `/uy/curso-python` | noindex, follow | Ídem. Sin clics GSC. |
| `/cr/curso-python` | noindex, follow | Ídem. Sin clics GSC. |
| `/do/curso-python` | noindex, follow | Ídem. Sin clics GSC. |
| `/gt/curso-python` | noindex, follow | Ídem. Sin clics GSC. |
| `/ve/curso-python` | noindex, follow | Ídem. Sin clics GSC. |
| `/bo/curso-python` | noindex, follow | Ídem. Sin clics GSC. |
| `/sv/curso-python` | noindex, follow | Ídem. Sin clics GSC. |

### `/{pais}/curso-power-bi-vs-pack-adopcion`

| URL | Decisión | Motivo |
|---|---|---|
| `/ec/curso-power-bi-vs-pack-adopcion` | noindex, follow | Comparativa idéntica a la raíz. Similitud 85,3–94,2 %. Sin clics GSC. |
| `/uy/curso-power-bi-vs-pack-adopcion` | noindex, follow | Ídem. Sin clics GSC. |
| `/cr/curso-power-bi-vs-pack-adopcion` | noindex, follow | Ídem. Sin clics GSC. |
| `/do/curso-power-bi-vs-pack-adopcion` | noindex, follow | Ídem. Sin clics GSC. |
| `/gt/curso-power-bi-vs-pack-adopcion` | noindex, follow | Ídem. Sin clics GSC. |
| `/ve/curso-power-bi-vs-pack-adopcion` | noindex, follow | Ídem. Sin clics GSC. |
| `/bo/curso-power-bi-vs-pack-adopcion` | noindex, follow | Ídem. Sin clics GSC. |
| `/sv/curso-power-bi-vs-pack-adopcion` | noindex, follow | **17 impresiones GSC y 0 clics**: la regla protege solo URLs con clics, así que se consolida igual. |

### `/{pais}/implementacion-power-bi`

| URL | Decisión | Motivo |
|---|---|---|
| `/ec/implementacion-power-bi` | noindex, follow | Reexporta la raíz. Similitud 92,8–93,9 %. Sin clics GSC. |
| `/uy/implementacion-power-bi` | **index** (excepción) | Contenido propio de Uruguay; similitud 38,9 % con la raíz, bajo el umbral 70 %. |
| `/cr/implementacion-power-bi` | noindex, follow | Ídem `/ec/implementacion-power-bi`. Sin clics GSC. |
| `/do/implementacion-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/gt/implementacion-power-bi` | noindex, follow | **10 impresiones GSC y 0 clics**: sin clics no hay excepción; similitud > 70 %. |
| `/ve/implementacion-power-bi` | **index** (excepción) | **1 clic GSC (28 d)**: la regla prohíbe noindexar URLs con clics. |
| `/bo/implementacion-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/sv/implementacion-power-bi` | noindex, follow | Ídem. Sin clics GSC. |

### `/{pais}/migrar-excel-a-power-bi`

| URL | Decisión | Motivo |
|---|---|---|
| `/ec/migrar-excel-a-power-bi` | noindex, follow | Reexporta la raíz. Similitud 92,7–93,9 %. Sin clics GSC. |
| `/uy/migrar-excel-a-power-bi` | **index** (excepción) | Contenido propio de Uruguay; similitud 38,7 % con la raíz, bajo el umbral 70 %. |
| `/cr/migrar-excel-a-power-bi` | noindex, follow | Ídem `/ec/migrar-excel-a-power-bi`. Sin clics GSC. |
| `/do/migrar-excel-a-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/gt/migrar-excel-a-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/ve/migrar-excel-a-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/bo/migrar-excel-a-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/sv/migrar-excel-a-power-bi` | noindex, follow | Ídem. Sin clics GSC. |

### `/{pais}/por-que-fallan-proyectos-power-bi`

| URL | Decisión | Motivo |
|---|---|---|
| `/ec/por-que-fallan-proyectos-power-bi` | noindex, follow | Guía idéntica a la raíz. Similitud 90,6–97,2 %. Sin clics GSC. |
| `/uy/por-que-fallan-proyectos-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/cr/por-que-fallan-proyectos-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/do/por-que-fallan-proyectos-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/gt/por-que-fallan-proyectos-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/ve/por-que-fallan-proyectos-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/bo/por-que-fallan-proyectos-power-bi` | noindex, follow | Ídem. Sin clics GSC. |
| `/sv/por-que-fallan-proyectos-power-bi` | noindex, follow | Ídem. Sin clics GSC. |

### `/{pais}/versus/*`

| URL | Decisión | Motivo |
|---|---|---|
| `/{pais}/versus/*` (ec, uy, cr, do, gt, ve, bo, sv) | noindex si se publica | Hoy no existe: `/[pais]/versus` solo genera mx, co y ar (`dynamicParams = false`); esas rutas devuelven 404. La regla queda declarada para que, si se publican, nazcan noindex y no entren al sitemap. |

### Se mantienen indexables

| URL | Decisión | Motivo |
|---|---|---|
| `/{pais}` | index | Hub del país; contenido y demanda propia. |
| `/{pais}/cursos` | index | Listado de cursos del país. |
| `/{pais}/cursos/<curso>` (13 fichas) | index | Fichas de curso; sin ellas no hay oferta indexable por país. |
| `/{pais}/empresas` | index | Página comercial con `BloqueLocalPais` (WS7). |
| `/{pais}/curso-power-bi` | 301 (WS3) | Redirige a `/{pais}/cursos/power-bi`; no se toca en WS9. |

## Para WS10 (sitemap + hreflang)

Helpers en `lib/paises/indexabilidad.ts`:

```ts
esRutaNoindexPais(iso: string | null | undefined, pathname: string): boolean
paisesDeRutaNoindex(pathname: string): string[]
rutasNoindexDePais(iso: string | null | undefined): string[]
patronNoindexDeRuta(pathname: string): string | null
RUTAS_NOINDEX_PAIS: Readonly<Record<string, readonly PaisSecundario[]>>
```

- En `app/sitemap.ts`, al expandir `localizedPaths` por país, filtrar con
  `!esRutaNoindexPais(pais.iso, item.path)`. Aplica a `countryPages` y a la lista
  explícita de `/{pais}/preguntas-frecuentes` en `guideIndexPages`.
- `hreflangDe(path)` (en `lib/paises/rutas.ts`) ya excluye las variantes noindex
  por país; no duplicar la lista en otro helper.
- URLs que deben salir del sitemap (todas las filas `noindex` de arriba):
  `/{pais}/precios`, `/{pais}/preguntas-frecuentes`, `/{pais}/curso-sql-online`,
  `/{pais}/curso-python`, `/{pais}/curso-power-bi-vs-pack-adopcion`,
  `/{pais}/por-que-fallan-proyectos-power-bi` en los 8 países;
  `/{pais}/faq` en ec, cr, do, gt, ve, bo, sv;
  `/{pais}/implementacion-power-bi` en ec, cr, do, gt, bo, sv;
  `/{pais}/migrar-excel-a-power-bi` en ec, cr, do, gt, ve, bo, sv.
- Excepciones que **deben seguir** en sitemap y hreflang: `/uy/faq`,
  `/ve/implementacion-power-bi`, `/uy/implementacion-power-bi`,
  `/uy/migrar-excel-a-power-bi`.

## Verificación

`node scripts/check-paises.mjs http://localhost:3119` (requiere servidor; lo
corre Hermes en la verificación final). Comprueba status 200, una sola meta
robots, canonical propio, noindex donde corresponde, ausencia de hreflang en
noindex, y que ninguna URL noindex esté en `sitemap.xml` ni sea destino de un
`<link rel="alternate" hreflang>` de una variante indexable.
