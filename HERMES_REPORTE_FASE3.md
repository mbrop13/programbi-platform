# HERMES_REPORTE_FASE3

Fecha: 4 de noviembre de 2026 · Rama integradora: `mejora/fase3` · Nunca se tocó `main`.
Estado: **integrado, compilado, verificado y pusheado** (`origin/mejora/fase3`).

---

## 1. Resumen ejecutivo

| Qué | Resultado |
|---|---|
| Base | `e9591c2` (mejora/fase3) con las 103 guías de Pluma |
| Worktrees | `C:\dev\pbi-f3-1` … `pbi-f3-7`, una rama `feat/f3-*` por workstream |
| Integración | 7 merges `--no-ff` + correcciones del orquestador (22 commits sobre la base) |
| Diff total | 62 archivos, +7.049 / −916 líneas |
| Build | `npx next build --webpack` → **OK**, 793 páginas estáticas prerenderizadas |
| TypeScript | `npx tsc --noEmit` → **EXIT 0** |
| Generador de guías | **113 guías publicadas**, 2 omitidas con motivo, 0 avisos |
| Verificación del sitio | **536/539 URLs OK, 5.655 alternates, 169 fichas con Offer, 0 hallazgos** |
| Push | `origin/mejora/fase3` (no `main`, sin deploy, sin migraciones) |

Comando de verificación reproducible:

```
cd C:\dev\pbi-f3
npx next build --webpack          # Turbopack falla por el symlink de node_modules
npx next start -p 3111
node scripts/verificar-sitio.mjs http://127.0.0.1:3111
node scripts/build-guias.mjs --check
node scripts/verificar-guias.mjs
```

---

## 2. Cómo se ejecutó (y la incidencia real)

Se lanzaron **7 subagentes en paralelo**, uno por worktree y workstream, con
`delegate_task` y el modelo de la sesión (`opencode-go deepseek-v4.1-flash`).
Corrieron 24–25 minutos cada uno y **el proveedor se cayó a mitad de camino**:
los 7 terminaron con timeout (*“OpenCode Go didn't respond in time”*). Ninguno
alcanzó a escribir su informe final, pero todos dejaron trabajo en disco.

Lo que hice al recuperar el control:

1. Revisé los 7 worktrees y **commiteé el trabajo pendiente** para no perderlo
   (7 commits `wip(f3-wsN)`).
2. Integré las 7 ramas en `mejora/fase3` con `--no-ff`. **Cero conflictos.**
3. Corregí 20 errores de TypeScript y 3 duplicaciones que quedaron a medias:
   imports `hub`/`opciones`, `TarjetaGuia` vs `Guia`, `esPaisCoderhouse`
   duplicado, `seoTitle`/`metaTitle`, `FaqEnlace.etiqueta`/`texto`.
4. Corregí el JSON-LD de las guías: f3-3 había agregado `Course`+`Offer` a las
   113 guías; el encargo pide **Article + FAQPage + BreadcrumbList** (el
   `Course` vive solo en la ficha, para no duplicarlo 113 veces).
5. Añadí lo que faltaba para cerrar la fase: rutas FAQ por país en el sitemap,
   `CollectionPage`+`ItemList` en los índices de guías y comparativas de
   academia en `llms.txt`.
6. Build, arranque local y verificación completa contra el HTML servido.

Conclusión honesta: **el contenido y los componentes son de los 7 subagentes;
la integración, las correcciones y toda la verificación son mías.** No se
inventó ningún dato para tapar huecos.

---

## 3. Estado por workstream

| WS | Rama | Estado | Qué quedó |
|---|---|---|---|
| 1. CRO registro | `feat/f3-cro` | **Hecho** | Registro directo, sin paso de contacto; precio público en el HTML; modal sin teléfono y con aviso de confirmación + reenvío |
| 2. Hub de guías | `feat/f3-hub-guias` | **Hecho** | Buscador y filtros con estado en URL, facetas dinámicas, tarjetas con imagen, 15 índices de país |
| 3. Guía premium (WS8) | `feat/f3-guia-diseno` | **Hecho** | Elemento visual mapeado (ruta, tabla, flujo, checklist, barras, pasos), índice sticky, CTA fijo mobile, bloque “En 30 segundos” en servidor |
| 4. Comparativas (WS9) | `feat/f3-comparativas` | **Hecho** | 4 comparativas de academia + 3 variantes por país + listicle de Power BI Chile, con fuentes y fecha |
| 5. FAQ / GEO | `feat/f3-faq-geo` | **Hecho** | Precios por país desde la fuente única, FAQPage, FAQ por país, enlaces desde footer y `llms.txt` |
| 6. Enlazado y verificación | `feat/f3-enlazado-verif` | **Hecho** | Bloque “Guías de \<curso\>” en las fichas; `verificar-sitio.mjs` y `verificar-enlaces.mjs` ampliados |
| 7. Plantillas y automatización | `feat/f3-plantillas` | **Hecho** | `build-guias.mjs --check`, exclusiones con aviso, plantillas de guía/certificación/comparativa y `docs/PLANTILLA_GUIAS.md` |

### WS1 — CRO del registro
- `CourseDetailClient.tsx`: fuera el gate de contacto de `05dacd9`
  (`showPrice`, `contactInstead`, `openRegisterForPrice`); el CTA va a registro
  o checkout y el precio se renderiza sin JS.
- `AuthModal.tsx`: registro con nombre, email y contraseña (mín. 6); sin
  teléfono; pantalla “Revisa tu correo para confirmar tu cuenta” con reenvío.
- `app/(auth)/registro` y `login`: copy alineado con el flujo directo.

### WS2 — Hub de guías
- `lib/guias/hub.ts` (tipos y filtros puros, seguro para cliente),
  `lib/guias/opciones.ts` (facetas desde `cursosConGuia()` + catálogo, no una
  lista paralela) y `lib/guias/tarjetas.ts` (proyección sin cuerpos Markdown:
  el payload RSC no arrastra 1 MB de contenido).
- `/guias`: 113 tarjetas, buscador sin acentos, filtros país/curso
  sincronizados con `?pais=&curso=&q=`, estado vacío y `CollectionPage`+`ItemList`.
- `/<pais>/guias` para los 15 mercados con guías, título y descripción por
  país (el título largo de República Dominicana se acorta a ≤60).

### WS3 — Guía premium
- `ElementoVisual.tsx`: lee `nota_hermes` y elige variante; nunca vuelca texto
  crudo. 103 guías traen `ELEMENTO VISUAL` y caen en ruta, comparativa, flujo,
  checklist, barras o pasos.
- `GuiaStickyCta.tsx`: CTA fijo en mobile, sin tapar contenido (el artículo
  reserva `pb-28`), con cierre y `prefers-reduced-motion`.
- `IndiceGuia.tsx`: fijo en desktop, `<details>` en mobile, con sección activa.
- Se eliminó la duplicación ruta de aprendizaje (bloque visual + bloque final)
  y el `Course`/`Offer` repetido en el JSON-LD de las guías.

### WS4 — Comparativas
Rutas nuevas (todas 200 y con JSON-LD verificado):
- `/versus/programbi-vs-coderhouse-power-bi` (+ `/mx`, `/co`, `/ar`)
- `/versus/alternativa-a-platzi-en-vivo`
- `/versus/ips-datax-vs-programbi`
- `/versus/desafio-latam-vs-programbi`
- `/guias/mejores-cursos-power-bi-chile-2026`

Cada fila de tabla lleva fuente y “Actualizado: 04-11-2026”; el bloque
“Elige X si…” reconoce dónde gana el rival; `Course`/`Offer` solo para
ProgramBI y con precio de `config/pricing.ts`. El hub `/versus` suma la
sección “Academias”.

### WS5 — Preguntas frecuentes / GEO
- `/preguntas-frecuentes` con ficha rápida, secciones y `FAQPage` (mismo texto
  visible), `BreadcrumbList` y `Organization`; sin `Course`/`Offer`.
- Precios por país generados desde la fuente única (Chile/AR/MX/CO/PE/UY con
  moneda local; Paraguay “consulta por WhatsApp”).
- `/<pais>/preguntas-frecuentes` para los 15 países con `hreflang` recíproco,
  `robots` según indexabilidad y `dynamicParams=false`.
- `llms.txt` lista guías, FAQ y ahora también las comparativas de academia.

### WS6 — Enlazado y verificación
- `components/guias/GuiasDelCurso.tsx`: bloque de servidor en la ficha de
  curso, con la guía del país primero, transversales después y enlace al hub.
  Montado en `/cursos/[slug]` y en `/[pais]/cursos/[slug]`.
- `scripts/verificar-sitio.mjs`: cubre guías, hubs, FAQ, versus y
  comparativas; valida estado, título ≤60 único, un H1, JSON-LD por tipo,
  canonical, hreflang recíproco, bloque “En 30 segundos”, precio visible,
  ausencia de `_dbg` y de “Se cobra en CLP”, y WhatsApp con `?text=`.
- `scripts/verificar-enlaces.mjs`: enlaces guía → curso y curso → guía.

### WS7 — Plantillas y automatización
- `scripts/build-guias.mjs`: excluye con aviso lo que no es guía publicable
  (el archivo de preguntas frecuentes y el brief), valida `curso` contra el
  catálogo y agrega `--check` (falla si `generado.ts` está desactualizado).
- Resultado: **113 guías** (antes 114, con una entrada fantasma que no tenía
  ruta). Reparto: análisis de datos 22 · Power BI 19 · Claude 9 · Access 7 ·
  Copilot 7 · Excel 7 · IA productividad 7 · Machine Learning 7 · Mercado
  financiero 7 · Power Automate 7 · Python 7 · SQL Server 7.
- Plantillas: `guias/_PLANTILLA-guia-curso-pais.md`,
  `_PLANTILLA_CERTIFICACION.md`, `_PLANTILLA_COMPARATIVA.md` y
  `docs/PLANTILLA_GUIAS.md` (flujo completo, cómo agregar curso y país).

---

## 4. Verificación (evidencia)

Build (`f3-build5.log`):

```
✓ Compiled successfully
✓ Generating static pages using 11 workers (793/793)
EXIT=0
```

TypeScript: `npx tsc --noEmit` → `EXIT=0`, sin errores.

Generador:

```
build-guias --check: 113 guías publicadas, 2 omitidas, 0 avisos
--check: OK · lib/guias/generado.ts está al día (113 guías).
```

`verificar-guias.mjs`: sin parejas sobre el límite de duplicate content
(peor par 28,6% < 30%; 343 pares revisados).

`verificar-sitio.mjs` contra `next start`:

```
Sitemap: 522 URLs
Rutas opcionales: 17
URLs revisadas: 536/539
Alternates comprobados: 5655
Fichas con Offer: 169
Títulos únicos: 536
VERIFICACIÓN OK: sin hallazgos.   (EXIT=0)
```

Smoke test manual del HTML servido:

| Ruta | Estado | H1 | JSON-LD |
|---|---|---|---|
| `/guias` | 200 | 1 | CollectionPage + ItemList |
| `/guias/curso-analisis-de-datos-chile` | 200 | 1 | Article + FAQPage + Breadcrumb |
| `/py/guias/como-aprender-power-bi-en-paraguay` | 200 | 1 | Article + FAQPage + Breadcrumb (sin precio, WhatsApp) |
| `/mx/guias` | 200 | 1 | CollectionPage + ItemList |
| `/preguntas-frecuentes` | 200 | 1 | FAQPage + Breadcrumb + Organization |
| `/ar/preguntas-frecuentes` | 200 | 1 | FAQPage + Breadcrumb + Organization |
| `/versus/programbi-vs-coderhouse-power-bi` | 200 | 1 | WebPage + ItemList + Course + FAQPage + Breadcrumb |
| `/mx/versus/programbi-vs-coderhouse-power-bi` | 200 | 1 | ídem, con precio en MXN |
| `/guias/mejores-cursos-power-bi-chile-2026` | 200 | 1 | Article + ItemList + Course + FAQPage |
| `/cursos/power-bi` | 200 | 1 | Course + Breadcrumb + FAQPage + bloque “Guías del curso” |

Sitemap: `/guias`, 15 índices de país, 113 guías, 4 comparativas de academia,
3 variantes por país, listicle y 13 FAQ (Chile + mercados indexables).

---

## 5. Pendientes para Manu (TODO_MANU)

1. **Datos de competidores**: las comparativas citan cuotas, clases gratis y
   precios de Coderhouse/Platzi/IPS/Desafío tal como están en
   `guias/COMPARATIVAS_BRIEF.md`, con URL y fecha. El brief marcaba algunos
   como “confirmar” (por ejemplo, cuotas vigentes de Coderhouse). Revisarlos
   antes de difundir las páginas: no se inventó ninguno, pero conviene
   revalidar precios y promociones el día del lanzamiento.
2. **Fecha de la próxima cohorte**: “lunes 23 de noviembre de 2026” está en
   `lib/guias/curso.ts`, `GuiaCTA` y en el texto de las guías. Al cambiar la
   cohorte hay que actualizarla en esos tres lugares (o moverla a config).
3. **Duración**: `lib/data/courses.ts` dice 16 h por nivel y las landings y
   guías dicen 20 h. Es una inconsistencia previa, documentada en
   `lib/guias/curso.ts`; falta que definas el número oficial.
4. **Paraguay**: sigue sin precio aprobado. Sus guías son `noindex`, muestran
   “consulta el valor por WhatsApp” y no declaran `Offer`.
5. **`guias/preguntas-frecuentes-programbi.md`**: quedó excluido del generador
   porque su ruta `/preguntas-frecuentes` la sirve la página React. El
   contenido ya está incorporado a esa página; decide si borras el `.md` o lo
   conservas como fuente editorial.
6. **Registro**: el flujo quedó sin teléfono y con confirmación por correo,
   pero no se probó un alta real contra Supabase (no se tocan datos de
   producción). Conviene una prueba manual en el preview de Vercel.
7. **3 cuotas sin interés**: quedó afirmado en FAQ y comparativas porque lo
   confirmaste el 4-nov. Si alguna pasarela no lo ofrece en algún país, hay
   que ajustar el texto.

---

## 6. Riesgos y notas técnicas

- **Turbopack**: `next build` falla con *“Symlink [project]/node_modules is
  invalid”* porque los worktrees enlazan `node_modules` a `C:\dev\pbi-v2`.
  El build válido es `npx next build --webpack`. Si quieres Turbopack, hay que
  instalar `node_modules` local en cada worktree (consume ~1 GB por worktree).
- **Proveedor**: los 7 subagentes murieron por timeout del proveedor, no por
  el código. Si se repite la fase, conviene lanzar 2–3 a la vez y no 7, o
  tener un proveedor de respaldo configurado.
- **AuthModal** se usa también en login y registro general; el build y los
  tipos pasan, pero no hay test E2E. Es el cambio con más superficie de riesgo
  funcional de toda la fase.
- **Contenido**: las 103 guías de Pluma no se reescribieron; solo se
  regeneraron rutas y metadatos. La verificación de duplicate content da
  28,6% en el peor par, bajo el límite de 30%.
- **No se tocó**: `main`, DNS, Google Ads/Meta Ads, configuración de GA4, la
  base de Supabase ni migraciones. No se envió ningún correo ni WhatsApp.

---

## 7. Mapa de commits

```
785a85d fix(fase3): título de guías por país <=60, llms.txt con comparativas y doc de plantilla
3ccf4f6 feat(fase3): JSON-LD CollectionPage en los índices de guías
8fe915b fix(fase3): guías sin Course duplicado, rutas FAQ por país en sitemap y build verde
46850a0 fix(fase3): tipos e imports tras integrar los siete workstreams
77ef799 merge(fase3): feat/f3-cro
89280c0 merge(fase3): feat/f3-enlazado-verif
1e53481 merge(fase3): feat/f3-faq-geo
9998ae5 merge(fase3): feat/f3-comparativas
156fee2 merge(fase3): feat/f3-guia-diseno
535c548 merge(fase3): feat/f3-hub-guias
3ceaa67 merge(fase3): feat/f3-plantillas
```

Rama publicada: `origin/mejora/fase3` (queda disponible para preview de Vercel;
no se mergeó a `main` ni se desplegó).
