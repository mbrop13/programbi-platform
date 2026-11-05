# WS4 — Redirecciones, sitemap, robots, IndexNow y verificación de Bing

Ejecutado en el worktree `C:/dev/pbi-f5-4`, rama `feat/f5-tecnico-seo`, desde
`mejora/fase5` @ `0b14f1f`.

## Estado

- [x] Hecho

Sin `next build`, `next dev`, `npx tsc`, `npm install` ni deploy (prohibidos en el
encargo). La verificación fue: `npx eslint` sobre los archivos tocados, ejecución
de `app/sitemap.ts`, `app/robots.ts` y `app/api/indexnow/route.ts` fuera de Next
con el type-stripping de Node 26 y un loader que resuelve `@/` (resultados abajo),
`node --check` de los dos scripts y comparación automática de `next.config.ts`
contra `vercel.json`.

## Archivos

- `next.config.ts` — 15 redirecciones nuevas (301/308) de URLs viejas de
  Shopify/WordPress; el resto del archivo no se tocó.
- `vercel.json` — las mismas 15 reglas con `statusCode: 301`, antes de las que ya
  existían (las específicas siempre antes que los comodines).
- `app/sitemap.ts` — `lastmod` real por URL, prioridades por país, dedupe y
  exclusión de imágenes OG.
- `lib/seo/lastmod.ts` (nuevo) — mapa estable de fechas.
- `app/robots.ts` — `Disallow` para `/*?wc-ajax=` y `/*?id=`.
- `lib/seo/metadata-base.ts` — verificación de Bing y de Google por entorno.
- `app/api/indexnow/route.ts` (nuevo) — endpoint POST/GET de IndexNow.
- `public/d9cbecf278eba793c25db7d0bff8c126.txt` (nuevo) — clave pública de
  IndexNow (32 hex, sin salto de línea).
- `scripts/indexnow.mjs` (nuevo) — envío manual del sitemap a `api.indexnow.org`.
- `scripts/verificar-redirecciones.mjs` (nuevo) — comprobación local de las 301.
- `docs/fase5/WS4.md` — este documento.

No se tocaron `app/(marketing)/cursos/**`, `app/(marketing)/page.tsx`,
`components/shared/Footer.tsx`, `app/llms.txt/**` ni `lib/data/testimonials.ts`.

## 1. Redirecciones

| Desde | Hacia |
| --- | --- |
| `/pages` | `/cursos` |
| `/pages/cursos` | `/cursos` |
| `/pages/cursos-1` | `/cursos` |
| `/pages/bootcamp` | `/cursos/analisis-de-datos` |
| `/pages/contact` | `/empresas` |
| `/pages/webinar` | `/clase-gratis` si `NEXT_PUBLIC_CLASE_GRATIS=1`; si no, `/cursos` |
| `/campus` | `/login` |
| `/cart` | `/cursos` |
| `/recommendations/products` y `/recommendations/products/:path*` | `/cursos` |
| `/apps/:path*` | `/cursos` |
| `/products/excel` | `/cursos/excel` |
| `/products/curso-analisis-de-datos-para-la-mineria` | `/cursos/analitica-mineria` |
| `/products/curso-de-analisis-de-datos-para-el-sector-financiero` | `/cursos/mercado-financiero` |
| `/products/sql-server-program-bi` | `/cursos/sql-server` |

Cada destino se comprobó contra el repo: los cinco slugs de curso existen en
`lib/data/courses.ts`, y `/cursos`, `/empresas`, `/login` y `/clase-gratis` tienen
`page.tsx` real.

### 301 en Vercel, 308 en local

`next.config.ts` con `permanent: true` emite **308**; Vercel aplica `vercel.json`
antes de Next y emite **301**. Para Google son equivalentes (ambos permanentes),
así que en producción se cumple 301 y en local el script de verificación acepta
las dos. Si algún día se necesita 301 también en local, hay que mover estas
reglas a `proxy.ts`.

### `/pages/webinar`: la única regla que no es idéntica en los dos archivos

`vercel.json` es JSON puro: no evalúa variables de entorno. Y `/clase-gratis`
responde **404** cuando `NEXT_PUBLIC_CLASE_GRATIS` no está en `1` (hoy está
apagado, ver `config/flags.ts`), así que una 301 a esa ruta sería una 301 a un
404. Decisión:

- `vercel.json` → `/cursos` (existe siempre). Es la que manda en producción y hoy
  coincide con la de Next.
- `next.config.ts` → `/clase-gratis` solo con el flag encendido; si no, `/cursos`.

**Al encender el flag hay que cambiar a mano el destino en `vercel.json`.** Está
anotado en el comentario de `next.config.ts` y en TODO_MANU.

### Apex `programbi.com`

El repo ya lo resolvía en `vercel.json` con dos reglas `has: host = programbi.com`
(una para `/` y otra para `/:path*`) que mandan a `https://www.programbi.com/...`.
Se dejaron al final para no interceptar las reglas de rutas y **no se duplicaron
en `next.config.ts`**: al ejecutarse antes, cualquier copia en Next solo podría
provocar un salto extra o un bucle si el matcher se equivoca. `CANONICAL_HOST` y
`SitemapLoc` siguen forzando `www.programbi.com`.

Consecuencia menor: una URL antigua pedida en el apex puede pasar por dos saltos
(apex → `www` → destino), porque las reglas de ruta se evalúan antes que la de
host. Termina siempre en `www` y no afecta al resto del sitio.

## 2. Sitemap (`lastmod` real)

Antes todas las URLs llevaban `lastModified: new Date()`, es decir, la hora del
request: Google veía el sitio entero "modificado" en cada rastreo y la señal no
valía nada.

- `lib/seo/lastmod.ts` centraliza el mapa: fecha ISO por ruta de Chile, por
  plantilla de país (`/{iso}/...`) y para las fichas de curso (`/cursos/<slug>`)
  y de caso (`/casos/<slug>`). Lo que no tiene fecha propia cae en
  `SITE_ACTUALIZADO` (`2026-11-05`), una constante que se sube a mano.
- `app/sitemap.ts` arma cada entrada con `entrada(path, priority, freq)`, que
  llama a `lastmodDe(path)`. Nunca hay `new Date()` en el archivo.
- Los `lastmod` que ya venían de datos (`guia.updated`, `COMPARATIVAS_ACTUALIZADO`)
  se pasan tal cual, sin reconstruir un `Date`.
- Dedupe: `uniqueEntries()` sigue descartando repetidas y URLs de otro host.
- `/opengraph-image` y `/twitter-image` quedan fuera por filtro explícito en
  `uniqueEntries()` (son imágenes generadas por ruta, no páginas).
- Prioridades: Chile en la raíz con 1; México, Colombia, Argentina, Perú,
  Uruguay y Paraguay al 90 % de la base; el resto de los indexables al 75 %.
  Paraguay está en la lista aunque hoy tenga `indexable: false`: el día que
  publique precio hereda la prioridad sin tocar el código.

### Recuperado del sitemap original

El rewrite de la corrida anterior había borrado `/casos/<slug>` con el argumento
de que "el frente 2 los deja en noindex". Se comprobó y **no es así**:
`app/(marketing)/casos/[slug]/page.tsx` no declara `robots`, tiene canonical
propio. Se restauraron las 8 fichas con `entrada()` y fecha estable.

### Lo que se quitó a propósito

El rewrite había agregado cuatro landings que **no existen en el repo**
(`/power-bi-para-finanzas`, `/power-bi-sql-server-python`,
`/analisis-de-datos-mineria`, `/capacitacion-empresas`): habrían entrado al
sitemap como 404. Las publica el frente de landings en su rama; ese frente tiene
que agregarlas a `staticPages` cuando existan.

### Blog

`publishedBlogUrls()` ya no recibe `now`; usa `SITE_ACTUALIZADO` porque la
consulta actual (`slug, title, excerpt`) no trae fecha. Si se agrega
`published_at`/`updated_at` a la tabla, ese es el sitio para usarla.

## 3. Robots

Se agregaron dos `Disallow` al grupo `*`:

```
Disallow: /*?wc-ajax=
Disallow: /*?id=
```

Son restos de WordPress/WooCommerce que solo generan URLs duplicadas. No se tocó
nada más: `/login` y `/comunidad` siguen rastreables a propósito (llevan
`noindex, follow`), y `/opengraph-image` no está bloqueada — solo se excluye del
sitemap, como pedía el encargo.

## 4. IndexNow

- `public/d9cbecf278eba793c25db7d0bff8c126.txt` contiene exactamente
  `d9cbecf278eba793c25db7d0bff8c126` (32 bytes, sin salto de línea). La clave es
  pública por diseño: es lo que prueba que el envío lo hace el dueño del dominio.
- `app/api/indexnow/route.ts`:
  - `GET` → `{ ok, servicio, configurado, maxUrls, metodo, ... }`. No devuelve la
    clave ni su ruta.
  - `POST` → valida `INDEXNOW_KEY` por cabecera `x-indexnow-key`, `?key=` o
    `key` en el cuerpo (401 si no coincide, 503 si no está configurada), acepta
    `{ "urls": [...] }`, rechaza más de 100 URLs, normaliza a
    `https://www.programbi.com/...` (apex → www, sin query ni hash), descarta
    hosts ajenos, deduplica y reenvía a `https://api.indexnow.org/indexnow`.
    Devuelve `{ ok, recibidas, enviadas, omitidas, estadoIndexNow }`.
- `scripts/indexnow.mjs`: lee el sitemap desplegado, extrae `<loc>`, filtra al
  host y envía en lotes de 10 000. **Dry-run por defecto**; con `--enviar`
  comprueba antes que `/<clave>.txt` responda 200 con el contenido exacto y
  recién entonces notifica. Ejecución manual, nunca desde un cron.

```
node scripts/indexnow.mjs                     # dry-run contra producción
node scripts/indexnow.mjs --base=http://127.0.0.1:3112
node scripts/indexnow.mjs --enviar            # solo tras desplegar
```

No se ejecutó contra producción ni en dry-run: la corrida no hizo peticiones a
`api.indexnow.org`.

## 5. Verificación de Bing

`lib/seo/metadata-base.ts` lee:

- `NEXT_PUBLIC_BING_VERIFICATION` → `<meta name="msvalidate.01" content="...">`
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` → `<meta name="google-site-verification" ...>`

Next no tiene `verification.bing` (el tipo `Verification` solo admite `google`,
`yahoo`, `yandex`, `me` y `other`), así que Bing va por
`verification.other["msvalidate.01"]`, que es exactamente la etiqueta que pide
Bing Webmaster Tools. Sin variables no se emite ninguna etiqueta.

`METADATA_BASE` lo usan los seis root layouts: `(marketing)`, `(pais)/[pais]`,
`(auth)`, `(admin)`, `(comunidad)` y `(referidos)`, así que la etiqueta sale en
todo el sitio.

## 6. Cómo verificar

Redirecciones (requiere un servidor local; el script no toca producción):

```
npm run build
npm run start -- -p 3112
node scripts/verificar-redirecciones.mjs --base=http://127.0.0.1:3112
```

Comprueba las 15 rutas (incluye `/recommendations/products/123` y `/apps/algo`
para los comodines): exige 301/308, `Location` con el destino esperado y que el
destino responda 200. **No se corrió contra producción.**

Sitemap y robots, ya desplegado:

```
curl -s https://www.programbi.com/robots.txt
curl -s https://www.programbi.com/sitemap.xml | grep -c "<loc>"
curl -s https://www.programbi.com/sitemap.xml | grep -c "opengraph-image"   # 0
```

IndexNow, ya desplegado:

```
curl -s https://www.programbi.com/api/indexnow
curl -s -X POST https://www.programbi.com/api/indexnow \
  -H "x-indexnow-key: $INDEXNOW_KEY" -H "content-type: application/json" \
  -d '{"urls":["https://www.programbi.com/cursos"]}'
```

### Verificación hecha en esta corrida

- `npx eslint` sobre los seis archivos TS: sin errores ni warnings.
- `node --check scripts/indexnow.mjs scripts/verificar-redirecciones.mjs`: OK.
- `vercel.json` parsea como JSON; 31 redirecciones (29 de ruta + 2 de host
  apex→www), todas con destino existente.
- Las 15 reglas del encargo existen en `next.config.ts` y en `vercel.json` con el
  mismo destino (comprobado ejecutando `nextConfig.redirects()` con Node 26).
- `app/sitemap.ts` ejecutado: 536 URLs, 0 duplicadas, 0 imágenes OG, 8 casos,
  12 carpetas de país (sin `py`, `hn`, `ni`, `pa` porque son `indexable: false`),
  ninguna entrada con la fecha del request y salida idéntica en dos ejecuciones
  seguidas.
- `app/robots.ts` ejecutado: los dos `Disallow` nuevos están en el grupo `*`.
- `app/api/indexnow/route.ts` ejecutado con `fetch` simulado: 503 sin clave, 401
  con clave incorrecta, 400 sin URLs / con 101 / con URLs ajenas, 200 con envío
  válido (host, `keyLocation` y dedupe correctos) y 502 si IndexNow rechaza.

## TODO_MANU

1. **Variables en Vercel**: `INDEXNOW_KEY=d9cbecf278eba793c25db7d0bff8c126`,
   `NEXT_PUBLIC_BING_VERIFICATION=<código de Bing Webmaster Tools>`. Opcional:
   `NEXT_PUBLIC_GOOGLE_VERIFICATION`. Son `NEXT_PUBLIC_*`, así que requieren
   redeploy para entrar en el HTML.
2. **Bing Webmaster Tools**: dar de alta el sitio y comprobar la etiqueta. La
   clave de IndexNow no hay que registrarla aparte, pero conviene verla en
   «IndexNow» del panel.
3. **Search Console**: después del deploy, revisar en «Páginas → No encontradas»
   que las rutas de la tabla devuelvan 301 y no 404.
4. **`/pages/webinar`**: si se enciende `NEXT_PUBLIC_CLASE_GRATIS=1`, cambiar en
   `vercel.json` el destino de esa regla a `/clase-gratis`.
5. **Landings**: cuando el frente de landings publique sus rutas, agregarlas al
   sitemap (hoy se excluyeron a propósito).
6. **Blog**: si la tabla `newsletter_articles` tiene `published_at`/`updated_at`,
   pasarla a `lastmod` en vez de `SITE_ACTUALIZADO`.
7. **IndexNow**: la clave está en el repo porque es pública; si se quiere otra,
   hay que renombrar el `.txt` y cambiar `INDEXNOW_KEY` a la vez.

## Riesgos de merge

- `vercel.json` y `next.config.ts` son los archivos con más probabilidad de
  choque: cualquier otro frente que agregue redirecciones debe insertarlas
  después de las específicas y antes de los comodines.
- `app/sitemap.ts` lo puede tocar el frente de landings: el conflicto se resuelve
  dejando `staticPages` + `entrada()` y sumando sus rutas ahí, sin volver a
  `new Date()`.
- `lib/seo/metadata-base.ts` también lo toca el frente de medición/verificación:
  el bloque `verification` debe quedar con `google` + `other["msvalidate.01"]`.
- `app/robots.ts` es pequeño; el conflicto, si aparece, es solo en el array
  `disallow` del grupo `*`.
