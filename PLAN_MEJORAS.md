# PLAN_MEJORAS — Plan de crecimiento ProgramBI (90 días)

Archivo autocontenido para que cualquier LLM o desarrollador implemente el plan sin otro contexto.
Fuente: Canvas "Plan de crecimiento ProgramBI — 90 días" (datos GSC/GA4 al 31/10/2026; las metas son hipótesis).
Estado al 02-11-2026 22:45 (hora de Chile). **Implementación pausada por Manu.**

---

## Estado 03-11-2026 — Worktree de integración

Sección de estado; no reemplaza ni borra el historial anterior.

- **Worktree:** `C:\dev\pbi-integracion`, rama `mejora/integracion-seo`. Sin commit y sin tocar `main`.
- **Integrado:** SEO, países, registro, WhatsApp, landings Power BI/SQL/Python, precios y tests.
- **Campus externo:** la activación es manual y los mensajes quedaron ajustados.
- **P1 GA4:** integrado. La propuesta experimental de compra y los cambios a webhooks **NO** están integrados.
- **Aplazado / no integrado:** email opcional de test (aplazado por Manu), SENCE (aplazado), webinar y certificados (no integrados).
- **Aviso CLP:** se mantiene discreto.
- **Migración `leads_magnet`:** no aplicada; ahora usa `service_role`.
- **Verificación de build (Next webpack):** el build final tras el ajuste de CSP pasó. Mantiene warnings de Pyodide, `IP_HASH_SALT` y `metadataBase`; TypeScript pasó. 12 rutas respondieron HTTP 200 con canonicals/hreflang y JSON-LD sintácticamente válido. HIBP CORS responde HTTP 200.
- **Sitemap (build local):** resultado confirmado: **192 URL examinadas**, **0 HTTP distintos de 200**, **0 títulos vacíos**, **0 títulos de más de 60 caracteres** y **0 grupos de títulos duplicados**.
- **Lint:** resultado confirmado con ESLint en los 89 archivos modificados/nuevos: **0 errores y 23 warnings**. El histórico global se mantiene en 813 errores y 450 warnings.
- **Pendiente:** pruebas de GA4, pruebas de pagos reales y despliegue con OK explícito.
- **Alcance:** no se hicieron commits, merges, push ni deploy. No se incluyen claves ni valores de entorno.

---

## 0. Contexto del repo

- Repo: `mbrop13/programbi-platform` (paquete `platform`). Next.js (App Router), React, TypeScript, Tailwind, Supabase (auth y datos), GA4 (gtag y Measurement Protocol en `lib/analytics/marketing.ts`).
- Repo principal (NO tocar): `C:\Users\manue\OneDrive\Desktop\Programbi-web\platform`, `main` @ `a921e4d`.
- `C:\dev\platform` es una copia parcial abandonada: NO usar.
- Worktrees (todos del repo principal, base `a921e4d`):

| Worktree | Rama | Último hash |
|---|---|---|
| `C:\dev\pbi-medicion` | `mejora/medicion` | `f7db42f` |
| `C:\dev\pbi-seo-fixes` | `mejora/seo-fixes` | `1c3c097` |
| `C:\dev\pbi-whatsapp-registro` | `mejora/whatsapp-registro` | `b91995c` |
| `C:\dev\pbi-paises-contenido` | `mejora/paises-contenido` | `181431e` |
| `C:\dev\pbi-landings-powerbi` | `mejora/landings-powerbi` | `baabec7` |
| `C:\dev\pbi-plan-registro` | `mejora/plan-registro` | (este archivo) |

- Rutas por país: `app/(pais)/[pais]/...` reexporta las páginas de `app/(marketing)/...`. Helpers: `config/paises.ts` (`getPais`, `normalizarPais`, `esIsoPais`), `lib/paises/rutas.ts` (`rutaLocal`, `hreflangDe`), `lib/paises/precios.ts` (`localizarMercado`, `notaCobroClp`), `lib/paises/horarios.ts`.
- Países: `cl` (base, sin prefijo), `ar`, `mx`, `pe`, `co`, `uy`.
- Cada worktree tiene un `opencode.json` (modelo `opencode-go/deepseek-v4.1-flash`, bash denegado salvo `git status/diff`, `ls`, `cat`, `rg`; `lsp:false`, `formatter:false`). Las exclusiones locales van en `.git/info/exclude`, que es común a todos los worktrees.

## 1. Reglas

1. Una rama `mejora/*` por tema. Nunca commit, push ni merge a `main` sin un OK explícito de Manu. Sin deploy.
2. Sin git destructivo (`reset --hard`, `push --force`, borrar ramas) salvo que Manu lo apruebe.
3. **No quitar `isBreachedPassword`** (`lib/security/password.ts`, chequeo HaveIBeenPwned k-anonymity). Tiene que seguir en registro, AuthModal, referidos (`auth-card`) y `actualizar-password`.
4. **SENCE/empresas está APLAZADO**: no tocar `components/empresas/*` ni `app/(marketing)/empresas/*`.
5. Sin secretos en el código ni en commits (`.env*` nunca se commitea).
6. No cambiar estilos visuales salvo lo que pida cada punto.

## 2. Restricciones del PC de Manu (Windows, 7,8 GB RAM)

- Hoy hubo varios reinicios (BSOD 0x10E del driver de video bajo carga) y saturación por procesos `node`.
- Mientras se escribe código: **NO correr** `npm`, `npx`, `node`, `tsc`, `eslint`, `next build` ni `dev`. Máximo 3 agentes OpenCode a la vez (4-5 solo con 1,5 GB o más de RAM libre). No lanzar nada con menos de 800 MB libres.
- Nunca dejar vivo `opencode serve --service`: retomaba sesiones viejas y corría tsc/lint. Las sesiones viejas están en `C:\dev\opencode-sesiones-respaldo`.
- Usar el binario nativo `...\WinGet\Packages\SST.opencode_...\opencode.exe`, no el shim de npm.
- **Verificaciones al FINAL de todas las mejoras, de a una rama:** `npm ci` (una sola vez, compartiendo `node_modules`) → `npx tsc --noEmit` → `npm run lint` → `npm run build` → chequeos funcionales (curl de títulos, hreflang, canonical, sitemap, eventos GA4).
- Después se avisa una sola vez a Radar para la revisión final de SEO y GA4.
- Bloqueo actual: la API key de OpenCode Go expiró. Manu tiene que crear una nueva en OpenCode Console.

---

## 3. Puntos del plan

Formato de cada punto: **Hecho** (rama y hash) · **Falta** · **Pasos** · **Aceptación**.

### Fase 0-30 · S1-S2: Convertir y medir

#### P1. Medición: `_dbg` en `generate_lead` y landing `(not set)` (68%)
- **Hecho:** `mejora/medicion` (`deff510`, último `f7db42f`).
  - En `lib/analytics/marketing.ts`, `_dbg=1` y `debug_mode` solo se envían si el debug está activo (`analyticsDebugEnabled()`); `pb_dbg` "0"/"1" va siempre como diagnóstico.
  - Se documenta la causa del `(not set)`: la sesión empezaba con `generate_lead` vía Measurement Protocol, sin `page_view` previo. Se agregaron parámetros de handoff OAuth que no deben partir `page_view`/`landing_page`.
  - Archivos: `lib/analytics/marketing.ts`, `components/shared/MarketingAnalytics.tsx`, `ANALYTICS.md`.
- **Falta:** revisión por lectura y verificación final.
- **Pasos:**
  1. `git diff a921e4d mejora/medicion`: confirmar que ningún camino de producción agrega `_dbg` sin flag (líneas ~390-470).
  2. Confirmar que `MarketingAnalytics.tsx` envía `page_view` con `page_location` real en la primera carga, también después del consentimiento y tras un redirect OAuth.
- **Aceptación:**
  - `rg '_dbg' lib/` solo aparece detrás de `if (debug)` o `...(debug ? …)`.
  - En GA4 DebugView con `?pb_debug=1` se ve `_dbg`; sin el flag no hay hits en DebugView.
  - A los 7 días del deploy, `landing_page (not set)` queda bajo el 10%.

#### P2. SEO: FAQ AR/MX con hora local
- **Hecho:** `mejora/seo-fixes` (`b70e90d`…`1c3c097`).
  - Nuevo `localizarHoras()` en `lib/paises/horarios.ts`, que se usa dentro de `localizarMercado()` (`lib/paises/precios.ts`).
  - En `lib/data/site.ts` (`homeFaqs`) y `lib/data/pack-adopcion.ts` (`HOME_FAQS`), "(hora de Chile)" pasó a ", hora de Chile", para que el reemplazo funcione.
  - Toca `FaqSection.tsx` y `app/(marketing)/page.tsx`.
- **Falta:** confirmar que las FAQ de `/ar` y `/mx` ya no dicen "hora de Chile" y muestran la hora local correcta (AR UTC-3, MX UTC-6, PE/CO UTC-5, UY UTC-3).
- **Pasos:**
  1. Revisar que `FaqSection` y la home pasen las FAQ por `localizarMercado(texto, pais)`.
  2. Revisar que `localizarHoras` convierta la hora concreta (ej. 19:00 CL → 17:00 CDMX) y no solo el nombre.
- **Aceptación:**
  - `curl /ar` y `curl /mx`: el HTML no contiene "hora de Chile" y sí "hora de Argentina" / "hora de Ciudad de México" (o equivalente).
  - `/` (Chile) no cambia.

#### P3. SEO: "Se cobra en CLP" junto al precio local
- **Hecho:** `mejora/seo-fixes`. `notaCobroClp()` ahora devuelve "Se cobra en CLP ($X), equivalente aprox." y hay una nueva constante `NOTA_COBRO_CLP` en `lib/paises/precios.ts`. Toca `lib/paises/detalle-curso.ts`, `CourseDetailClient.tsx` y `CourseLeadSections.tsx`.
- **Falta:** el Canvas pide **quitar** "Se cobra en CLP" pegado al precio local, porque genera desconfianza. Hay que decidir con Manu: (a) quitarlo junto al precio y moverlo como nota al checkout, o (b) mantenerlo discreto. Recomendación: (a).
- **Pasos:**
  1. `rg -n "Se cobra en|notaCobroClp|NOTA_COBRO_CLP"`.
  2. Sacar la nota del bloque de precio en `CourseDetailClient.tsx` y `CourseLeadSections.tsx`.
  3. Mostrarla solo en el paso de pago o checkout.
- **Aceptación:** en `/ar/cursos/power-bi` y `/mx/cursos/power-bi`, la tarjeta de precio muestra solo la moneda local, y el aviso de CLP aparece solo en el checkout.

#### P4. SEO: `areaServed` sin duplicar
- **Hecho:** `mejora/seo-fixes`. Se quitó `areaServed: "CL"` del `contactPoint` en `components/shared/RootShell.tsx`. Hay nuevos helpers en `lib/seo.ts` (+26 líneas).
- **Falta:**
  - Confirmar que el JSON-LD de los cursos (`course-jsonld` / `lib/seo.ts`) declare un solo `areaServed` por página: el país de la ruta.
  - Confirmar que en rutas no-CL no se repita CL entre RootShell y el curso.
- **Pasos:** `rg -n "areaServed"`. Dejar una sola fuente: el JSON-LD del curso usa `getPais(pais)` y el de la organización global no lo declara.
- **Aceptación:** en `curl /mx/cursos/power-bi`, extraer los `<script type="application/ld+json">` y contar `areaServed`: debe haber exactamente 1, con valor MX.

#### P5. SEO: títulos de más de 60 caracteres y duplicados
- **Hecho:** `mejora/seo-fixes`.
  - Se aplicó `tituloSeo()` en `blog/[slug]`, `casos/[slug]` (usa `title` en vez de `fullTitle`), `empleos/[slug]`, `empleos/empresas/[slug]`, `newsletter/[slug]`, `versus/[slug]`, `webinar`, `gran-partido` y `lib/seo/money.ts`.
  - En `lib/data/comparisons.ts` se acortaron 2 `seoTitle`.
- **Falta:** revisar los 13 títulos señalados (`/casos/*`, `/blog`, `/nosotros`) y eliminar duplicados. `/nosotros` no aparece en el diff.
- **Pasos:**
  1. Ver la implementación de `tituloSeo()` en `lib/seo.ts`: debe cortar en palabra completa a 60 caracteres o menos, incluido el sufijo de marca.
  2. Revisar `app/(marketing)/nosotros/page.tsx`.
- **Aceptación:** con un script sobre el sitemap, ningún `<title>` supera 60 caracteres y no hay dos URLs indexables con el mismo `<title>`.
- **Ojo:** `app/(marketing)/empleos/empresas/[slug]` es de empleos, no de "empresas/SENCE"; puede quedarse.

#### P6. WhatsApp precargado por curso y país + `click_whatsapp` con parámetros
- **Hecho:** `mejora/whatsapp-registro` (`7158075`…`b91995c`).
  - En `lib/whatsapp.ts` hay nuevos `whatsappNumber(country)` (usa `NEXT_PUBLIC_WHATSAPP_NUMBER`, luego el número del país, luego `PACK.whatsappE164`) y `whatsappCountryName()`, y el mensaje pasa a depender de curso y país.
  - Se integró en `components/marketing/WhatsAppCta.tsx` (fallback `country?.trim() || paisRuta`), `components/shared/WhatsAppButton.tsx`, `CursosPageClient.tsx`, `CourseDetailClient.tsx`, `CourseLeadSections.tsx` y `HeroSection.tsx`.
  - El 02-11 se descartaron cambios rotos sin commitear de `WhatsAppButton.tsx`.
- **Falta:**
  - El mensaje exacto del Canvas: `Hola, quiero info del curso {curso} desde {país} [ref:{slug}]`.
  - `click_whatsapp` con `course`, `country` y `page` en todos los botones.
  - Respuesta en menos de 5 min y secuencia de email (Cartero) para leads sin compra: es operativo, sin código ahora.
- **Pasos:**
  1. En `lib/whatsapp.ts`, que `whatsappHref({course, country, page})` arme exactamente ese texto con `encodeURIComponent`.
  2. En `lib/analytics/marketing.ts`, que la función de `click_whatsapp` reciba `{course, country, page}`, y que todos los `onClick` de `WhatsAppCta`/`WhatsAppButton` la llamen.
- **Aceptación:**
  - En `/mx/cursos/power-bi`, el `href` del botón contiene `wa.me/`, y el `text=` decodificado dice "Hola, quiero info del curso Power BI desde México [ref:power-bi]".
  - En GA4 DebugView, `click_whatsapp` trae `course=power-bi`, `country=mx` y `page=/mx/cursos/power-bi`.

#### P7. Registro sin campo interés + contraseña de 8 caracteres o más (manteniendo `isBreachedPassword`)
- **Hecho:** `mejora/whatsapp-registro`.
  - Se quitó `interest` / `interestFromCoursePath` de `app/(auth)/registro/page.tsx` y `components/shared/AuthModal.tsx`, y se borró `lib/data/lead-interests.ts`.
  - Registro: `minLength={8}` más el texto de ayuda "Mínimo 8 caracteres…".
- **PROBLEMA GRAVE en la rama (hay que corregirlo antes de mergear):**
  - El commit WIP **borró `isBreachedPassword` y `MAX_LENGTH` de `lib/security/password.ts`** y quitó la llamada en `registro/page.tsx` y `AuthModal.tsx`.
  - `components/referrals/auth-card.tsx` y `app/(comunidad)/comunidad/actualizar-password/page.tsx` todavía la importan, así que hoy **el build falla** y además se pierde seguridad.
- **Pasos:**
  1. Restaurar `lib/security/password.ts` desde main: `git checkout a921e4d -- lib/security/password.ts`. Tiene `MAX_LENGTH=128` e `isBreachedPassword`.
  2. Volver a agregar en `registro/page.tsx` y `AuthModal.tsx` el import y el bloque `if (await isBreachedPassword(password)) { setError("Esta contraseña aparece en filtraciones conocidas. Elige otra."); setLoading(false); return; }` antes de `signUp`.
  3. Confirmar que `auth-card.tsx` y `actualizar-password/page.tsx` siguen igual que en main.
  4. Agregar `minLength={8}` también a los inputs de contraseña de `AuthModal.tsx`, `auth-card.tsx` y `actualizar-password`.
  5. Revisar que `lib/data/lead-interests.ts` no tenga otros usos (`rg interestFromCoursePath`). Si los tiene, no borrarlo.
- **Aceptación:**
  - `rg -n "isBreachedPassword"` aparece en `password.ts` y en los 4 formularios.
  - `rg -n "interest" app/(auth) components/shared/AuthModal.tsx` no devuelve nada.
  - Con "1234567" el formulario se bloquea; con "password123" (filtrada) se rechaza; con una contraseña aleatoria de 8 caracteres, el registro funciona.
  - El typecheck pasa.

### Fase 0-30 · S3-S4

#### P8. Contenido realmente distinto por país (AR, MX, PE, CO, UY)
- **Hecho:** `mejora/paises-contenido` (`0cb74d0`…`181431e`).
  - Nueva carpeta `lib/data/contenido-paises/` con `tipos.ts`, `index.ts` (`getContenidoPais`) y `ar|mx|pe|co|uy.ts` (~124 líneas cada uno).
  - Componentes nuevos: `components/marketing/CountryContent.tsx` y `CountryContext.tsx`.
  - Integrado en la home, `app/(pais)/[pais]/page.tsx`, `cursos`, `cursos/[slug]`, `faq`, `implementacion-power-bi`, `migrar-excel-a-power-bi` y `por-que-fallan-proyectos-power-bi`. `[PENDIENTE CONTENIDO XX]` se reemplazó por `contenido.mercado.facturacion`.
- **Falta:**
  - Comprobar que el texto sea al menos 60% distinto entre países.
  - Revisar que los datos de mercado (facturación, medios de pago, horarios, casos) sean plausibles y no inventen cifras.
  - El `<title>` y la meta description deben ser propios por país.
- **Pasos:**
  1. Leer los 5 archivos de país y comparar las secciones de 2 en 2.
  2. Reescribir lo repetido.
  3. Las cifras que no tengan fuente se marcan `[VERIFICAR]` o se quitan.
- **Aceptación:**
  - Comparando el texto visible de `/ar`, `/mx`, `/pe`, `/co` y `/uy` (sin nav ni footer), cada par se parece menos del 40%.
  - No queda ningún `[PENDIENTE CONTENIDO`.
  - Cada página tiene canonical propio y hreflang a los 6 países más `x-default`.

#### P9. Landings Power BI por país + plantilla descargable
- **Hecho:** `mejora/landings-powerbi` (`9147cec`…`baabec7`).
  - Nueva página `app/(marketing)/curso-power-bi/page.tsx` (380 líneas) con su reexport en `app/(pais)/[pais]/curso-power-bi/page.tsx`.
  - `components/marketing/PlantillaDescarga.tsx` descarga `public/plantillas/plantilla-ventas-powerbi.csv`; `trackPlantillaDownload` envía `file_download`.
  - Entrada en `app/sitemap.ts`, rutas en `lib/paises/rutas.ts`, `lib/seo/money.ts` y `docs/seo-gsc.md`.
  - Enlaces "Curso Power BI con plantilla de ventas gratis" en guías y en el detalle del curso Power BI.
- **Falta (según el Prompt 2 del Canvas):**
  1. H1 "Curso de Power BI online en vivo en {país}", precio en moneda local, horario local, 3 casos de uso locales y FAQ propia (pago, certificado, horario, nivel). Debe tomarse de `getContenidoPais` cuando P8 esté mergeado.
  2. JSON-LD `Course` + `Offer` + `FAQPage`, hreflang y canonical propios.
  3. La plantilla debe pedir **solo email** antes de descargar, guardar en Supabase (tabla `leads_magnet`: `email`, `pais`, `recurso`, `created_at`) y disparar `download_template` (no `file_download`).
  4. Idealmente, una plantilla `.pbix` además del CSV.
- **Pasos:**
  1. Crear la migración SQL `supabase/migrations/<fecha>_leads_magnet.sql` con RLS: insert anónimo, sin select público. No aplicarla sin OK de Manu.
  2. Crear el endpoint `app/api/leads-magnet/route.ts`: valida email, honeypot (`lib/antibot`) y hace el insert.
  3. Convertir `PlantillaDescarga` en un formulario de email que, si sale bien, entrega el archivo y llama a `trackEvent("download_template", {recurso, pais, location})`.
- **Aceptación:**
  - `/ar/curso-power-bi`, `/mx/curso-power-bi` y `/pe/curso-power-bi` responden 200, cada una con su H1 de país y su JSON-LD válido (Rich Results Test).
  - Aparecen en `sitemap.xml`.
  - Un email enviado crea la fila en `leads_magnet`, y el evento `download_template` llega a DebugView.

#### P10. Google Business Profile + 10 reseñas
- **Hecho:** nada. Es una tarea operativa de Manu, sin código.
- **Pasos:** crear o verificar el GBP y pedir reseñas a alumnos. Opcional: mostrar reseñas en la web con schema `Review`/`AggregateRating`, solo si son reales y verificables.
- **Aceptación:** GBP verificado con 10 reseñas o más.

### Fase 30-60 · S5-S6

#### P11. Landing Empresas/SENCE + cotizador — **APLAZADO** por Manu. No implementar.

#### P12. Test de nivel SQL/Excel (imán de leads)
- **Hecho:** nada.
- **Pasos:**
  1. Crear `app/(marketing)/test-nivel/[tema]/page.tsx` (`sql`, `excel`) con 10 preguntas en `lib/data/test-nivel/*.ts`.
  2. Mostrar un resultado con nivel y curso recomendado.
  3. Pedir email opcional para enviar el resultado, guardado en `leads_magnet` con `recurso='test-sql'`.
  4. Disparar el evento `quiz_complete` con `{tema, nivel, pais}`.
- **Aceptación:** el test se puede completar sin login, muestra la recomendación con link al curso y el evento aparece en DebugView.

#### P13. Clase gratis mensual en hora LATAM (webinar)
- **Hecho:** ya existe `app/(marketing)/webinar/page.tsx`; en `seo-fixes` solo se tocó el título.
- **Pasos:**
  1. Mostrar la fecha y hora en 19:00 CDMX / 21:00 BA, usando `lib/paises/horarios.ts`.
  2. Agregar formulario de inscripción con el evento `webinar_signup`.
  3. Después de cada clase, publicar la grabación como página indexable con schema `VideoObject`.
- **Aceptación:** la inscripción guarda el lead, dispara `webinar_signup` y la página de la grabación queda en el sitemap.

### Fase 30-60 · S7-S8

#### P14. Landings CO, UY y SQL/Python por país
- **Hecho:** la plantilla de `/[pais]/curso-power-bi` (P9) ya cubre técnicamente CO y UY.
- **Pasos:**
  1. Extender P9 a `co` y `uy`.
  2. Crear `curso-sql-online` y `curso-python` con el mismo patrón y contenido de `getContenidoPais`.
- **Aceptación:** las mismas de P8 y P9 para las nuevas URLs.

#### P15. GEO: comparativas y FAQ para IA
- **Hecho:** existen `versus/[slug]` y `lib/data/comparisons.ts` (títulos acortados en P5).
- **Pasos:**
  1. Crear la página `/precios` con precios por país, duración y qué incluye.
  2. Crear la FAQ citable "mejor curso Power BI en vivo en LatAm".
  3. Usar schema `FAQPage` y `Course` correctos.
- **Aceptación:** `/precios` está indexable, con JSON-LD válido, y las respuestas son cortas y factuales.

#### P16. YouTube + Shorts — contenido, sin código. Opcional: embeds con `VideoObject` en las landings.

### Fase 60-90 · S9-S12

#### P17. Certificado verificable + 3 casos de alumnos
- **Pasos:**
  1. Crear `app/(marketing)/certificado/[codigo]/page.tsx`, que lee de Supabase (tabla `certificados`, con migración y sin aplicarla sin OK) y muestra alumno, curso y fecha.
  2. Agregar el botón "Agregar a LinkedIn".
  3. Los casos van en `app/(marketing)/casos`.
- **Aceptación:** un código válido muestra el certificado; uno inválido devuelve 404.

#### P18. Calculadora salarial — solo si hay fuentes fiables y citadas por país. Si no, no se hace.

#### P19. Backlinks y alianzas (comunidad Power BI, universidades, beca co-marca) — operativo, sin código.

#### P20. Remarketing (Pauta) — solo propuesta y sin gasto. Requiere la medición limpia (P1, P21).

### Medición transversal

#### P21. Eventos y atribución
- **Hecho:** `click_whatsapp` parcial (P6) y `file_download` de la plantilla (P9).
- **Falta:**
  - Eventos `download_template`, `quiz_complete`, `webinar_signup` y `b2b_quote` (este último aplazado con empresas), con `course` y `country`.
  - Código `ref` en el mensaje de WhatsApp.
  - Segmento en GA4 que excluya bots de EE.UU. y vínculo GA4 ↔ Search Console (configuración de Manu o Radar).
  - `purchase` con `value` y `currency` al confirmar el pago (buscar el webhook de pago: `rg -n "purchase|webhook" app/api`).
- **Aceptación:** cada evento se ve en DebugView con sus parámetros, y una compra de prueba registra `purchase` con el valor correcto.

---

## 4. Conflictos probables al mergear (archivos tocados por varias ramas)

| Archivo | Ramas |
|---|---|
| `app/(marketing)/cursos/[slug]/CourseDetailClient.tsx` | seo-fixes, whatsapp-registro, landings-powerbi |
| `app/(marketing)/page.tsx` | seo-fixes, paises-contenido |
| `components/marketing/FaqSection.tsx` | seo-fixes, paises-contenido |
| `components/marketing/CourseLeadSections.tsx` | seo-fixes, whatsapp-registro |
| `components/marketing/HeroSection.tsx` | whatsapp-registro, paises-contenido |
| `lib/paises/precios.ts` | seo-fixes, paises-contenido |
| `lib/analytics/marketing.ts` | medicion, landings-powerbi |
| `lib/seo/money.ts` | seo-fixes, landings-powerbi |
| `app/(marketing)/por-que-fallan-proyectos-power-bi/page.tsx` | paises-contenido, landings-powerbi |
| `app/(marketing)/cursos/[slug]/page.tsx` | paises-contenido (y el detalle de landings) |

## 5. Orden de merge sugerido (cada paso con OK de Manu y verificación de esa rama)

1. `mejora/medicion`: base de analytics, la más pequeña.
2. `mejora/seo-fixes`: helpers `tituloSeo`, `localizarHoras` y `precios`.
3. `mejora/paises-contenido`: rebasar sobre 2 y resolver `precios.ts`, `FaqSection` y `page.tsx`.
4. `mejora/whatsapp-registro`: **después de corregir P7** (restaurar `isBreachedPassword`). Resolver `CourseDetailClient`, `CourseLeadSections` y `HeroSection`.
5. `mejora/landings-powerbi`: rebasar sobre 1-4 para usar `getContenidoPais` y `marketing.ts`.
6. `mejora/plan-registro`: solo documentación.

En cada paso, en el PC (de a una): `npx tsc --noEmit`, `npm run lint`, `npm run build`, y después los chequeos de aceptación del punto. Al final, un solo aviso a Radar.

## 6. Aplazado

- **SENCE / empresas (P11, `b2b_quote`):** aplazado por decisión de Manu. No se tocan `components/empresas/*` ni `app/(marketing)/empresas/*`. Verificado: ninguna rama modifica `components/empresas` respecto de `main`.

## 7. KPIs (base de 2 semanas al 31/10 → meta de 2 semanas al día 90, hipótesis)

Clics GSC 93→300 · posición "curso power bi" 38,5→<15 · sesiones IA 49→120 · click_whatsapp 50→120 · generate_lead 9→40 · leads plantillas/test 0→60 · compras 1→6 · landing (not set) 68%→<10%.

---

## Estado 03-11-2026 — Nueva tanda (parcial, sin commit)

Sección de estado de la nueva tanda; no reemplaza ni borra el historial anterior. Todos los avances son parciales: **no se afirma que ningún punto esté cerrado en su totalidad**.

- **WhatsApp con mensaje precargado:** hay avances en la generación del enlace con mensaje precargado por curso y país. No se valida la totalidad de los botones ni de los casos.
- **País:** integración de país en curso y con avances; sin cobertura total confirmada.
- **Precios:** avances en la localización de precios; sin confirmación de totalidad.
- **Registro:** avances en el flujo de registro; sin confirmación de totalidad.
- **Landings:** avances en las landings por curso/país; no se afirma que todas estén completas.
- **FAQ:** avances en las FAQ por país; sin confirmación de totalidad.
- **Analítica:** avances en los eventos de analítica; no se validó en vivo.
- **Enlaces:** avances en enlaces internos y rutas; sin auditoría total.
- **Build webpack + TypeScript:** completado con éxito, **693 páginas**. No se verificó el deploy.
- **Comprobación HTTP local del sitemap:** **200 URL** examinadas, **200 respuestas con estado 200**, títulos no vacíos, únicos y de 60 caracteres o menos, JSON-LD parseable, enlaces `wa.me` con parámetro `text`, y reciprocidad básica de hreflang entre las páginas encontradas.
- **Límites de la comprobación:** no valida la ausencia total de hreflang, la semántica del JSON-LD (solo que sea parseable) ni URL fuera del sitemap.
- **Pendiente:**
  - GA4 en vivo.
  - Lighthouse.
  - Imagen real del certificado.
  - Salarios con fuentes.
  - Validación operativa de Supabase y de `IP_HASH_SALT` en Vercel.
  - Compra.
- **Deploy:** no verificado.
- **Commits/hashes:** los cambios de esta tanda **no tienen commit**, por lo que todavía no hay hashes que registrar.
- **Alcance:** solo se actualizó este archivo; no se tocaron otros archivos, no se usó git, no se borró nada y no se accedió a archivos de entorno.

## Integración v2 (rama mejora/integracion-v2, base adb532c)

Rama integradora: `mejora/integracion-v2` (worktree `C:/dev/pbi-v2`). Reglas: sin merge ni push a `main`, sin deploy, sin tocar DNS/ads/Supabase de producción.

| ID | Tarea | WS | Estado | Rama | Hash | Nota |
|---|---|---|---|---|---|---|
| WS4-1 | Contexto común `country`, `page_type`, `course`, `guide_slug` en todos los eventos | WS4 | hecho | feat/ws4-medicion-geo | fe0a924 | `lib/analytics/context.ts` + inyección en `trackEvent` y `page_view` |
| WS4-2 | `page_view` sin duplicados y sin `_dbg` en producción | WS4 | hecho (heredado) | feat/ws4-medicion-geo | adb532c | Ya venía resuelto en `lib/analytics/marketing.ts`; auditado, no se rehizo |
| WS4-3 | `click_whatsapp` y `click_registro` con `cta_position` | WS4 | hecho | feat/ws4-medicion-geo | fe0a924 | Botón flotante, CTA de ficha, sidebar y CTA inline |
| WS4-4 | `view_item` con `value` y `currency` desde `config/pricing.ts` | WS4 | hecho | feat/ws4-medicion-geo | fe0a924 | `trackCourseView` emite `view_curso` y `view_item` |
| WS4-5 | Enlaces internos: footer por país, «cursos por país», CTA del blog | WS4 | hecho | feat/ws4-medicion-geo | fe0a924 | Blog usa el curso de la categoría |
| WS4-6 | Lighthouse mobile antes/después | WS4 | bloqueado | feat/ws4-medicion-geo | — | PC de 8 GB sin Lighthouse instalado; next/image AVIF/WebP y next/font ya estaban configurados. Se mide desde el preview de Vercel |
| WS1-1 | Fuente única de precios en ficha, tarjetas, landings, JSON-LD y checkout | WS1 | hecho (heredado) | feat/precios-geo | adb532c | `config/pricing.ts` ya alimenta `lib/data/courses.ts`, que es la base del checkout Flow/Mercado Pago |
| WS1-2 | Quitar «Se cobra en CLP» y nota bajo el botón | WS1 | hecho (heredado) | feat/precios-geo | adb532c | Única mención restante: comentario en `lib/paises/precios.ts`, sin texto visible |
| WS1-3 | Registro solo nombre, email y contraseña (mín. 6) | WS1 | hecho | feat/ws3-cro-whatsapp | b5cc7b8 | `validatePassword` y todos los `minLength` a 6; se quitó el teléfono del registro |
| WS1-4 | «Revisa tu correo» + reenviar confirmación | WS1 | hecho | feat/ws3-cro-whatsapp | b5cc7b8 | `supabase.auth.resend` con redirect propio |
| WS1-5 | Menos fricción en el formulario de contacto (commit 05dacd9) | WS1 | hecho | feat/ws3-cro-whatsapp | b5cc7b8 | Particulares: solo nombre y correo; el teléfono queda opcional en empresas |
| WS1-6 | `wa.me` con `?text=` en el HTML del servidor | WS1 | hecho | feat/ws3-cro-whatsapp | b5cc7b8 | `whatsappHref` ya generaba el texto; el botón flotante ahora se renderiza en servidor |
| WS1-7 | Test precio visible = Offer = checkout | WS1 | hecho | mejora/integracion-v2 | 94db342 | `scripts/verificar-sitio.mjs`: 169 fichas con `Offer` y 0 desajustes entre precio visible y `Offer` (405 URL) |
| WS2-1 | Infra `/guias` y `/{pais}/guias` con SSG | WS2 | hecho | feat/ws2-guias-pais | 11f072c | Índices y fichas generados desde `content/guias` con `scripts/build-guias.mjs` |
| WS2-2 | 7 guías de país publicadas | WS2 | hecho | feat/ws2-guias-pais | 11f072c | ~1.200 palabras y 6 FAQ por guía |
| WS2-3 | `<GuiaCTA>` top/mid/end y barra fija mobile | WS2 | hecho | feat/ws2-guias-pais | 11f072c | Marcadores `<!-- CTA-* -->` del MDX |
| WS2-4 | JSON-LD Article + FAQPage + BreadcrumbList, canonical y hreflang | WS2 | hecho | feat/ws2-guias-pais | 11f072c | FAQ del schema = FAQ visible |
| WS2-5 | `/py/` mínima sin Offer | WS2 | hecho (heredado) | feat/ws2-guias-pais | 11f072c | `/py` ya existía por `[pais]`; se agregó `/py/guias` y se confirmó noindex y sin precio |
| WS2-6 | Texto compartido entre guías < 30 % | WS2 | hecho | feat/ws2-guias-pais | 11f072c | Peor par 11,1 % con shingles de 5 palabras (`scripts/verificar-guias.mjs`) |
| WS3-1 | Guías DAX y Power BI vs Excel | WS3 | hecho | feat/ws2b-guias-transversales | 23f1d80 | Texto desde GUIAS_POWER_BI_PAISES.md |
| WS3-2 | Piloto Claude CL y MX con alternates | WS3 | hecho | feat/ws2b-guias-transversales | 23f1d80 | `es-CL` ↔ `es-MX`, x-default a Chile |
| WS3-3 | `/llms.txt` dinámico con precios por país | WS3 | hecho | feat/ws2b-guias-transversales | 23f1d80 | `app/llms.txt/route.ts`; se eliminó `public/llms.txt` |
| WS3-4 | `/preguntas-frecuentes` con 20 preguntas y FAQPage | WS3 | hecho | feat/ws2b-guias-transversales | 23f1d80 | Solo datos existentes en el sitio |
| INT-1 | Sitemap con guías, índices y preguntas frecuentes | Integración | hecho | mejora/integracion-v2 | fff44f1 | Paraguay fuera del sitemap por noindex |
| INT-2 | Países secundarios en sitemap y hreflang | Integración | hecho | mejora/integracion-v2 | 94db342 | 405 URL en el sitemap: 27–29 por país secundario (/bo /cr /do /ec /gt /sv /ve) y hreflang es-BO, es-SV… recíproco (4.772 alternates comprobados) |
| INT-3 | Build + tsc + verificación §8 sobre la integradora | Integración | hecho | mejora/integracion-v2 | 94db342 | Build de 660 páginas, `tsc` sin errores y verificación sin hallazgos (detalle en HERMES_REPORTE.md) |
| INT-4 | Precio de Chile en el HTML del servidor | Integración | hecho | mejora/integracion-v2 | 94db342 | La ficha ya no espera la comprobación de sesión: el HTML trae $169.000 (y 338.000 / 349.000) igual que el `Offer` |
| INT-5 | Títulos de país ≤ 60 caracteres y únicos | Integración | hecho | mejora/integracion-v2 | 94db342 | 405/405 títulos únicos; FAQ, nosotros y «por qué fallan» llevan país; «Rep. Dominicana» en el title |
| INT-6 | Aviso de CLP solo en el checkout | Integración | hecho | mejora/integracion-v2 | 94db342 | Ficha y /precios muestran solo «Pagas con tarjeta internacional…»; el aviso de cobro en CLP queda en el pago |
| INT-7 | Cero marcadores [PENDIENTE] en el HTML | Integración | hecho | mejora/integracion-v2 | 94db342 | Empresas y ciudad de contacto ya no publican placeholders |
| MANU-1 | Migración `20261102000000_leads_magnet.sql` en Supabase | — | bloqueado (Manu) | — | — | Sin ella la plantilla no guarda correos |
| MANU-2 | `IP_HASH_SALT` en Vercel (Preview y Production) | — | bloqueado (Manu) | — | — | |
| MANU-3 | Precio de Paraguay en USD | — | bloqueado (Manu) | — | — | Por eso /py queda noindex y sin Offer |
| MANU-4 | Confirmar precio Chile (169.000 vs 249.000) y si la tabla por país es fija | — | bloqueado (Manu) | — | — | Hoy: 169.000 / 338.000 / 349.000, tabla por país fija |
| MANU-5 | Compra de prueba en el preview | — | bloqueado (Manu) | — | — | Pagos reales los hace Manu |

## Cierre integración v2 — 04-11-2026

- **Rama:** `mejora/integracion-v2` (worktree `C:/dev/pbi-v2`), pusheada a `origin`. Último hash: **94db342**. `main` sin tocar.
- **Merges incluidos:** WS4 (`fe0a924`), WS1 (`b5cc7b8`), WS2 (`11f072c`), WS3 (`23f1d80`). Las cuatro ramas ya estaban dentro de la integradora; se verificó con `git branch --contains`.
- **Build final:** 660 páginas estáticas, `tsc --noEmit` sin errores, ESLint sin errores nuevos en los archivos tocados.
- **Verificación §8 (`scripts/verificar-sitio.mjs`):** 405 URL, 0 hallazgos; 4.772 alternates recíprocos comprobados; 169 fichas con `Offer`; 405/405 títulos únicos y ≤ 60 caracteres; 0 enlaces `wa.me` sin `text=`; 0 «Se cobra en CLP»; 0 marcadores `[PENDIENTE]`.
- **Precios:** Chile 169.000 (Análisis de datos 338.000, Mercado financiero 349.000) en visible y `Offer`, con `validFrom` fijo. México 2.190 / 4.390; resto de países según su tabla.
- **Paraguay:** `/py` responde 200 con `noindex`, sin `Offer` y con CTA «Consultar el valor» por WhatsApp.
- **Defectos corregidos en esta pasada:** el precio de Chile no estaba en el HTML del servidor; 31 títulos duplicados o de más de 60 caracteres en países secundarios; el aviso de cobro en CLP aparecía junto al precio en fichas y `/precios`; marcadores `[PENDIENTE]` visibles en `/empresas` y en la ciudad de contacto.
- **Preview:** Vercel despliega al detectar el push de la rama; esta sesión no tiene CLI ni token de Vercel, así que el link se toma desde el panel (Deployments → rama `mejora/integracion-v2`).
