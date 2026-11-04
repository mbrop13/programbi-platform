# Hermes Agent — Orquestación de mejoras programbi.com

> Para: **Hermes Agent** (orquestador) trabajando en el repo `programbi-platform` (Next.js App Router + Supabase, desplegado en Vercel). Delegas en **hasta 4 sub-bots con DeepSeek V4.1 Flash en paralelo**.
> Preparado por Radar (SEO/analítica) para Manu, 4 nov 2026.

## 1. Objetivo de negocio
Más **visitas cualificadas desde LATAM** (Chile, México, Colombia, Argentina, Perú, Uruguay, Paraguay) y más **leads**: registros al curso, conversaciones de WhatsApp y descargas de la plantilla gratis. Cada cambio debe acercar a una de esas tres conversiones o medirla mejor. Nada de cambios cosméticos sin impacto.

## 2. Lee primero (misma carpeta que este archivo)
1. `PLAN_MEJORAS.md`: plan de 90 días, estado de cada punto, ramas y hashes previos. Es tu **registro de estado**.
2. `GUIAS_POWER_BI_PAISES.md`: especificación y **textos finales** de 11 guías, §8 Corrección de precios, plan de medición y checklist.
3. El código: `app/` (rutas por país `/ar /mx /pe /co /uy`), componentes de ficha de curso, sitemap, layout con GA4 (G-CSV91QJMMJ), `supabase/migrations/`.
Parte de la rama integradora previa `mejora/integracion-seo` si aún no está en `main` (verifícalo con `git log main..mejora/integracion-seo`).

## 3. Reglas (innegociables)
- **Nunca** push ni merge a `main`, ni deploy a producción, sin OK explícito de Manu. Push de ramas de feature y de la integradora sí (genera previews de Vercel).
- **No inventar datos**: ni precios, ni sueldos, ni testimonios, ni cifras de alumnos. Si falta un dato, déjalo como pendiente de Manu.
- No tocar DNS, dominios, Google Ads/Meta Ads, ni la configuración de GA4/Search Console.
- No enviar mensajes, correos ni WhatsApp a nadie. No aplicar migraciones en la base de producción (solo dejarlas listas).
- No cambiar montos de precio: solo unificar la fuente (§8 de las guías) hasta que Manu defina.
- Un bot = un workstream = una rama = sus archivos. Si un bot necesita tocar un archivo de otro workstream, **pide el cambio a Hermes**, no lo edita.

## 4. Workstreams y propiedad de archivos

| WS | Rama | Alcance | Archivos que le pertenecen (ajusta a la estructura real; declara la lista en PLAN_MEJORAS.md antes de empezar) |
|---|---|---|---|
| 1 | `feat/ws1-precios-whatsapp-registro` | §8 precios (fuente única, quitar «Se cobra en CLP», nota bajo botón, `validFrom` fijo); WhatsApp con `?text=` precargado server-side y botón flotante mobile; registro con nombre+email+contraseña (mín. 6), pantalla «Revisa tu correo» con reenviar | `config/pricing.ts` (nuevo), componentes de precio/checkout, componente WhatsApp, modal/página de registro, `/api/leads-magnet` |
| 2 | `feat/ws2-guias-pais` | 7 guías de país (§3), infra `/guias` y `/{pais}/guias`, componente `<GuiaCTA>`, layout de guía, `/py/` mínima (home país + ficha + guía) sin `Offer` mientras no haya precio | `app/**/guias/**`, `content/guias/pais/*.mdx`, `components/guias/*`, `app/py/**`, config de países (solo **agregar** `py`) |
| 3 | `feat/ws3-guias-transversales` | Guías DAX y Power BI vs Excel (§4), piloto Claude CL/MX (§5), `/llms.txt`, `/preguntas-frecuentes` con FAQPage | `content/guias/transversales/*.mdx`, `content/guias/claude/*.mdx`, `public/llms.txt` o `app/llms.txt/route.ts`, `app/preguntas-frecuentes/**`. Usa el layout y `<GuiaCTA>` de WS2 (**espera** a que WS2 publique esos componentes en su rama; mientras tanto escribe el contenido MDX) |
| 4 | `feat/ws4-medicion-perf-links` | GA4: arreglar landing `(not set)` (page_view en primera carga y en cada cambio de ruta, sin duplicar), parámetros comunes `country`, `course`, `page_type`, `guide_slug`, `cta_position` en `click_whatsapp`, `click_registro`, `generate_lead`, `view_item`; sin `_dbg`. Performance mobile (next/image AVIF/WebP, next/font, GA afterInteractive; LCP < 2,5 s). Enlaces internos: breadcrumbs visibles, CTA en posts del blog, footer por país con link a guía, bloque «cursos por país» en `/cursos` | `lib/analytics*`, `components/analytics/*`, layout raíz (solo scripts), `components/Footer*`, `components/Breadcrumbs*`, plantillas de blog, `app/cursos/page.tsx` |

**Archivos compartidos (solo Hermes los edita o integra):** `app/sitemap*.ts`, `next.config.*`, `package.json`/lockfile, `middleware.ts`, config i18n/hreflang. Cada WS deja en su PR la lista de URLs nuevas y cambios de hreflang; Hermes los integra en la rama integradora.

## 5. Orden de trabajo y merge
1. Hermes crea `mejora/integracion-v2` desde `mejora/integracion-seo` (o `main` si ya está mergeada) y la pushea.
2. Cada bot crea su rama desde `mejora/integracion-v2`.
3. Orden de merge a `mejora/integracion-v2` (merge commit, no squash, para conservar hashes):
   1. **WS4** (medición/analítica base: los demás emiten eventos con su helper).
   2. **WS1** (precios: las guías leen precio de `config/pricing.ts`).
   3. **WS2** (infra de guías y `/py/`).
   4. **WS3** (contenido sobre la infra de WS2).
   Tras cada merge: `rebase` de las ramas pendientes sobre la integradora, build y tests.
4. Hermes integra sitemap/hreflang/llms.txt al final y corre la verificación (§8).
5. Push de `mejora/integracion-v2` → preview de Vercel → avisar a Manu (§10). **Fin.** No merge a main.

## 6. Protocolo de estado en PLAN_MEJORAS.md
Agregar una sección `## Integración v2` con una tabla que **cada bot actualiza al iniciar y al cerrar cada tarea**:

| ID | Tarea | WS | Estado (pendiente / en curso / hecho / bloqueado) | Rama | Hash | Nota / bloqueo |
|---|---|---|---|---|---|---|

- Una fila por punto verificable (por ejemplo «WS1-3 quitar Se cobra en CLP»).
- `bloqueado` siempre con el motivo y a quién le toca (por ejemplo «pendiente Manu: precio CL»).
- Commit del archivo de estado en la rama del propio bot; Hermes consolida en la integradora.
- Si se acaban los límites de cualquier agente, otro debe poder seguir solo con este archivo y PLAN_MEJORAS.md.

## 7. Prompts para cada sub-bot (copiar tal cual)

### Prompt WS1
```
Eres un sub-bot de Hermes en el repo programbi-platform (Next.js App Router + Supabase). Rama: feat/ws1-precios-whatsapp-registro, creada desde mejora/integracion-v2. No hagas push ni merge a main, no deploys, no migraciones en producción, no inventes datos ni montos.
Lee: GUIAS_POWER_BI_PAISES.md §8 y PLAN_MEJORAS.md.
Tareas:
1. Crea config/pricing.ts con curso × país (cl, mx, co, ar, pe, uy, py) usando EXACTAMENTE los montos que hoy hay en el código (no los cambies). py sin precio. Reemplaza todos los montos en duro (ficha, tarjetas "Otros cursos", landings, JSON-LD Offer, checkout) por lecturas de esa config. validFrom fijo.
2. Quita "Se cobra en CLP" y "Se cobra en pesos chilenos (...)" junto al precio. Bajo el botón de pago, nota pequeña: "Pagas con tarjeta internacional; el cargo final lo define tu banco."
3. Todos los links wa.me/56935409699 con ?text= server-side: "Hola, vengo de programbi.com ({País}) y quiero info del curso {Curso}" (genérico con país en home y /cursos). Botón flotante en mobile en páginas públicas.
4. Registro: solo nombre, email y contraseña (mínimo 6 en todos los formularios). Tras el alta: "Revisa tu correo para confirmar tu cuenta" + botón reenviar. Plantilla gratis: solo email.
5. Test que compare, para cada curso×país, precio visible = Offer.price = monto de checkout.
Solo edita tus archivos (lista en HERMES_ORQUESTACION.md §4). Si necesitas otro archivo, pídeselo a Hermes. Actualiza PLAN_MEJORAS.md (sección Integración v2) al iniciar y al cerrar cada tarea con rama y hash. Al terminar: build, tsc, tests, y reporta a Hermes rama, hashes, archivos tocados y pendientes (precio CL y PY = decisión de Manu).
```

### Prompt WS2
```
Eres un sub-bot de Hermes en programbi-platform. Rama: feat/ws2-guias-pais desde mejora/integracion-v2. Sin push/merge a main, sin deploys, sin inventar datos.
Lee GUIAS_POWER_BI_PAISES.md §0–§3 y §7.
Tareas:
1. Infra: rutas /guias/[slug] y /{pais}/guias/[slug] (SSG desde content/guias/pais/*.mdx con frontmatter title, description, h1, country, updated, faq[], sources[]), índices /guias y /{pais}/guias, componente <GuiaCTA variant="top|mid|end"> y barra fija mobile, JSON-LD @graph Article + FAQPage + BreadcrumbList, canonical propio, hreflang recíproco entre las 7 guías de país + x-default (CL), <html lang> por país, fecha "Actualizado" visible.
2. Publica las 7 guías de país con el texto EXACTO del archivo (solo correcciones menores de estilo). {precio_local} se lee de config/pricing.ts (WS1); mientras no esté, usa un stub con la misma interfaz.
3. /py/: crea la versión de país mínima (home, ficha Power BI, guía), es-PY, horario 19:30–21:30, SIN Offer ni monto; CTA "Consulta el valor por WhatsApp". No indexar /py/ si queda vacía.
4. Enlaces: cada guía a /{pais}/curso-power-bi, ficha, guías transversales e índice. Entrega a Hermes la lista de URLs para el sitemap y los cambios de hreflang (no edites sitemap ni middleware).
5. Mide el texto compartido entre guías de país (shingles de 5 palabras) y reporta el %; debe ser < 30 %.
Eventos: usa el helper de analytics de WS4 (si aún no existe, llama a una función trackEvent(name, params) con stub). Actualiza PLAN_MEJORAS.md con estado, rama y hash. Reporta al terminar.
```

### Prompt WS3
```
Eres un sub-bot de Hermes en programbi-platform. Rama: feat/ws3-guias-transversales desde mejora/integracion-v2. Sin push/merge a main, sin deploys, sin inventar datos.
Lee GUIAS_POWER_BI_PAISES.md §2, §4, §5 y §7.
Tareas:
1. Escribe en MDX (content/guias/transversales y content/guias/claude) las guías: /guias/funciones-dax-mas-importantes, /guias/power-bi-vs-excel (una sola versión, canonical propio, sin alternates), /guias/como-usar-claude-para-analisis-de-datos (es-CL) y /mx/guias/como-usar-claude-para-analisis-de-datos (es-MX), alternates CL↔MX. Texto EXACTO del archivo. Bloques de código DAX con formato legible.
2. Usa el layout y <GuiaCTA> de WS2 (rebasea cuando WS2 los tenga; antes, deja el contenido listo). CTAs del piloto Claude apuntan a /cursos/claude y /mx/cursos/claude con course=claude.
3. /llms.txt: resumen de la academia, cursos, horarios, precios por país leídos de config/pricing.ts (sin montos en duro), links a fichas, landings y guías.
4. /preguntas-frecuentes con 20 preguntas reales (precio, duración, certificado, en vivo/grabado, requisitos, pago desde el extranjero) con FAQPage; responde solo con datos que existan en el sitio.
Entrega a Hermes las URLs para sitemap. Actualiza PLAN_MEJORAS.md con estado, rama y hash. Reporta al terminar.
```

### Prompt WS4
```
Eres un sub-bot de Hermes en programbi-platform. Rama: feat/ws4-medicion-perf-links desde mejora/integracion-v2. Sin push/merge a main, sin deploys, no tocar la configuración de GA4 ni ads.
Tareas:
1. Helper único lib/analytics.ts: trackEvent(name, params) que agrega country (de la ruta; cl si raíz), page_type, course y guide_slug cuando aplique. Sin _dbg. Exporta la interfaz pronto para que WS1–WS3 la usen.
2. Landing (not set): page_view en la primera carga con page_location y page_referrer, y en cada cambio de ruta del App Router, sin duplicados (verifica en DebugView o con el network log: un page_view por navegación).
3. Eventos: click_whatsapp y click_registro (con cta_position), generate_lead (solo con respuesta 200; lead_type), view_item en fichas con value y currency leídos de config/pricing.ts.
4. Performance mobile: next/image AVIF/WebP con sizes correctos y priority solo en la hero; next/font con display swap; GA con strategy afterInteractive. Reporta Lighthouse mobile antes/después en home, una ficha y una landing de país (meta LCP < 2,5 s).
5. Enlaces internos: breadcrumbs visibles en fichas y landings, CTA al curso relacionado en medio y al final de cada post del blog, footer por país con link a su guía, bloque "cursos por país" en /cursos.
Solo tus archivos. Actualiza PLAN_MEJORAS.md con estado, rama y hash. Reporta al terminar.
```

## 8. Checklist de verificación final (Hermes, sobre `mejora/integracion-v2`)
- [ ] `npm run build` sin errores; `npx tsc --noEmit` sin errores; lint sin errores nuevos en archivos tocados.
- [ ] Todas las URLs del sitemap responden 200 en el preview (script que recorre el sitemap).
- [ ] `<title>` ≤ 60 caracteres y único en todo el sitemap; un H1 por página.
- [ ] hreflang recíprocos (cada alternate apunta de vuelta) y `x-default` presente en clústeres de país; canonical propio.
- [ ] JSON-LD válido (parsea como JSON; tipos Article, FAQPage, BreadcrumbList, Course/Offer donde corresponde); FAQ del schema = FAQ visible.
- [ ] Todos los `href` a `wa.me` en el HTML del servidor llevan `?text=`.
- [ ] Precios coherentes: visible = JSON-LD `Offer.price` = checkout, para cada curso × país; 0 apariciones de «Se cobra en CLP»; `/py/` sin `Offer`.
- [ ] Sin `_dbg` en el bundle (`rg "_dbg" .next/static` vacío).
- [ ] Eventos visibles en GA4 DebugView desde el preview con los parámetros definidos.
- [ ] PLAN_MEJORAS.md al día: cada fila con estado, rama y hash.

## 9. Pendientes de Manu (no los resuelvas tú; déjalos marcados como `bloqueado`)
1. Aplicar la migración `supabase/migrations/20261102000000_leads_magnet.sql` en Supabase (sin ella la plantilla no guarda correos).
2. Configurar `IP_HASH_SALT` en Vercel (Preview y Production).
3. **Precio de Paraguay en USD** (monto).
4. **Precio correcto de Chile** (249.000 vs 169.000 CLP) y si los precios por país son tabla fija o derivados del CLP.
5. Compra de prueba en el preview (pagos reales los hace Manu).

## 10. Cierre
Cuando la verificación §8 esté en verde (o con los bloqueos de §9 documentados):
1. Push de `mejora/integracion-v2` y espera el preview de Vercel.
2. Genera el **link compartible** del preview (Vercel → deployment → Share, URL con `?_vercel_share=`).
3. Avisa a Manu con: link compartible, rama, último hash, resumen de lo hecho por WS, lista de pendientes §9 y lo que quedó bloqueado. Pídele que se lo pase a **Radar** para la revisión final de SEO y GA4 antes de cualquier merge a `main`.
