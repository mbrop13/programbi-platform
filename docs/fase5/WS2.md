# WS2 — Testimonios reales (LinkedIn) y página /casos

Rama: `feat/f5-testimonios` (worktree `C:/dev/pbi-f5-2`).
Base: `0b14f1f` (`fix(f4): minería al precio de Análisis de datos, clase-gratis 404 y llms.txt con 8 comparativas`).

## Estado

- [x] Testimonios reales conservados y atribuidos por curso.
- [x] `/casos` como índice de testimonios por curso + casos de uso existentes.
- [x] Componente reutilizable `TestimoniosDeCurso` para fichas y guías.
- [x] Testimonios en guías (raíz y por país), solo cuando el curso tiene citas.
- [x] Kill-switch `NEXT_PUBLIC_TESTIMONIOS`.
- [ ] Integración de una línea en la ficha del curso: **la hace el orquestador** con el snippet de abajo (este frente no edita la ficha).

## Archivos

Nuevos:

- `components/marketing/Testimonios.tsx` — tarjetas de cita (servidor, sin JS de cliente, sin estrellas ni puntuaciones).
- `components/marketing/TestimoniosDeCurso.tsx` — filtra por `cursoSlug`, arma la sección y devuelve `null` si no hay citas o si el flag está apagado.
- `app/(marketing)/casos/page.tsx` — hub de `/casos`.
- `docs/fase5/WS2.md` — este documento.

Modificados:

- `lib/data/testimonials.ts` — tipo ampliado (`linkedinUrl`, `cursoSlug`, `fuente`, `anio`), helpers `testimoniosDeCurso` / `testimoniosSinCurso`, flag `TESTIMONIOS_PUBLICADOS`.
- `app/(marketing)/guias/[slug]/page.tsx` — monta `<TestimoniosDeCurso cursoSlug={guia.course} variante="compacta" />`.
- `app/(pais)/[pais]/guias/[slug]/page.tsx` — mismo bloque para las guías de país.
- `components/marketing/Quote.tsx` — el carrusel de la home respeta el mismo kill-switch (devuelve `null` con el flag en `"0"`). No se tocó `app/(marketing)/page.tsx`.

Sin cambios netos: `components/guias/GuiasDelCurso.tsx` (se revirtió, ver Decisiones).

## Datos

- Los **20 testimonios** del repo se conservan **textualmente** (nombre, rol y mensaje). Verificado comparando contra `git show HEAD:lib/data/testimonials.ts`: mismo número, mismo orden, texto idéntico.
- **0 mensajes duplicados exactos.** Dos autores aparecen dos veces (`Branco Sanchez`, `Jaime Nicolas Aranda Vasquez`) con citas distintas: se mantienen porque son publicaciones diferentes.
- **13 citas atribuidas** a una ficha: `sql-server` 7, `power-bi` 4, `python` 1, `analisis-de-datos` 1.
- **7 citas sin curso**: Big Data/BigQuery, Data Science, cursos presenciales y programa de diplomado. No se les inventó ficha.
- **No existe ninguna URL de LinkedIn de alumnos en el repo** (solo perfiles de mentores en `lib/data/mentors.ts`). `linkedinUrl` queda vacío y las tarjetas no muestran enlace; el campo ya está listo para cuando Manu pase las URLs.

## Decisiones

1. **`cursoSlug` solo por evidencia en el propio testimonio.** Se asigna cuando el rol o el mensaje nombran el curso sin ambigüedad. Quedan sin atribuir:
   - Diego Repetti: menciona Power BI Avanzado **y** SQL Server (dos fichas).
   - Víctor Montecino y Julio Reyes: BigQuery/Looker Studio (no hay ficha con ese slug).
   - Jorge Kaisarieh: dice «aprendiendo Power BI», no que terminó el curso.
   - Karla Escalona: «Fundamentos de Data Science» (no hay ficha con ese slug).
   - Leslie Mau: «Cursos Presenciales».
   - Jaime Aranda (primer testimonio): programa/diplomado, sin curso concreto.
   - Victor Arzola sí se atribuye a `analisis-de-datos`: su rol dice «Alumno de Analítica de Datos» y es el único programa de análisis de datos del catálogo.
2. **Cero `AggregateRating` y cero `Review` en JSON-LD.** No hay calificación verificable. `/casos` declara `CollectionPage` + `ItemList` de casos de uso. Sin `reviewRating`, sin `ratingValue`.
3. **`/casos` no reemplaza ni duplica `/casos/[slug]`.** El índice lista los 8 casos existentes leyendo `lib/data/cases.ts`, deduplicados por slug con `Map`; los enlaces van a las mismas rutas de siempre y no se creó ningún slug nuevo. Los casos de uso y los testimonios de alumnos son secciones separadas y rotuladas.
4. **Sin testimonios dentro de `GuiasDelCurso`.** Ese componente ya se monta en la ficha del curso; si además mostrara citas, al integrar `TestimoniosDeCurso` la ficha tendría dos bloques iguales. Se revirtió a su estado original y las citas viven en un solo componente.
5. **Guías:** el bloque se monta también en las guías por país (misma guía, mismo curso) y se oculta solo cuando el curso no tiene citas. No se tocó el diseño de `GuiaPage`: la sección va después del artículo, con los mismos tokens (`bg-canvas`, `border-line`, `text-ink`, `text-mute`).
6. **Kill-switch:** `TESTIMONIOS_PUBLICADOS = process.env.NEXT_PUBLIC_TESTIMONIOS !== "0"`. Con `"0"`, `/casos` responde 200, declara `robots: { index: false, follow: true }`, no renderiza citas y **mantiene los casos de uso**. Tampoco se renderizan los bloques de fichas/guías ni el carrusel de la home (`Quote`). No se borra contenido ni se devuelve 404. Al ser `NEXT_PUBLIC_*`, el valor se inlinea en build: cambiarlo en producción exige reconstruir (documentarlo en el deploy).
7. **`data-testid` únicos:** `Testimonios` acepta `testId`; `/casos` pasa uno por curso (`testimonios-power-bi`, …) y `testimonios-otros`.

## Integración en la ficha (snippet exacto)

Archivo: `app/(marketing)/cursos/[slug]/page.tsx`. La ficha por país (`app/(pais)/[pais]/cursos/[slug]/page.tsx`) **reexporta** esta página, así que una sola inserción cubre `/cursos/<slug>` y `/<pais>/cursos/<slug>`.

1) Import, junto al de `GuiasDelCurso`:

```tsx
import GuiasDelCurso from "@/components/guias/GuiasDelCurso";
import TestimoniosDeCurso from "@/components/marketing/TestimoniosDeCurso";
```

2) JSX, después de `<GuiasDelCurso />` y antes de `CountryContext`:

```tsx
      <GuiasDelCurso curso={course.slug} pais={pais} />
      {/* Testimonios reales del curso; se oculta solo si no hay citas. */}
      <TestimoniosDeCurso cursoSlug={course.slug} />
      {contenido ? (
```

Opciones del componente (todas con default): `limite={3}`, `variante="compacta"`, `titulo`, `descripcion`, `enlaceIndice={true}`, `id`.

## Cómo verificar

1. Lint de los archivos del frente:

```bash
npx eslint "app/(marketing)/casos/page.tsx" \
  "components/marketing/Testimonios.tsx" \
  "components/marketing/TestimoniosDeCurso.tsx" \
  "app/(marketing)/guias/[slug]/page.tsx" \
  "app/(pais)/[pais]/guias/[slug]/page.tsx" \
  "lib/data/testimonials.ts"
```

2. Rutas (tras el build del orquestador):
   - `/casos` → 200, H1 «Casos de uso y testimonios de alumnos», índice por curso, 20 citas y 8 tarjetas de casos.
   - `/casos/dashboards-ventas-bi` → sigue igual (200, sin cambios en esa ruta).
   - `/guias/como-aprender-power-bi-en-chile` → sección de testimonios de Power BI al final; una guía de un curso sin citas (p. ej. Claude) no muestra el bloque.
   - `/cursos/power-bi` y `/cl/cursos/power-bi` → bloque tras integrar el snippet.
3. Kill-switch: build con `NEXT_PUBLIC_TESTIMONIOS=0`; `/casos` debe responder 200, sin citas, con `<meta name="robots" content="noindex, follow">` y los 8 casos visibles.
4. Buscar `AggregateRating` y `reviewRating` en el HTML de `/casos`: no deben aparecer.
5. Render de humo ejecutado en este frente (sin `next build` ni `next dev`): 20 `blockquote`, 18 autores únicos, 8 enlaces de caso, 0 `undefined`; con el flag en `"0"`: 0 citas, `robots.index=false`, casos intactos.

## TODO_MANU

- **URLs de LinkedIn**: perfil del alumno o publicación original de cada cita. No están en el repo; `linkedinUrl` queda vacío. Con el dato, las tarjetas muestran el icono y el enlace automáticamente.
- **Año de publicación** de cada cita (`anio`): no hay fecha documentada, no se inventó.
- **Confirmar atribución** de las 7 citas sin curso y, en particular, de Victor Arzola (`analisis-de-datos`).
- **Sitemap**: `/casos` no se agregó a `app/sitemap.ts` porque ese archivo es de otro frente. Queda para el orquestador (junto con la URL de la ficha si cambia).
- **Texto comercial de los casos**: `lib/data/cases.ts` incluye citas de clientes (Carolina Méndez, Roberto González, etc.) que no son testimonios de alumnos y se dejaron tal cual. Si Manu quiere separar «casos de éxito» de «testimonios de alumnos» con otra URL, es una decisión de producto posterior.

## Pendientes / riesgos

- La ficha del curso no muestra testimonios hasta que el orquestador aplique el snippet (por diseño de este frente).
- El flag es de build: no cambia en caliente sin reconstruir.
- No se pudo revisar visualmente con `next dev`/`next build` (prohibido en este frente); la verificación fue lint + render estático en memoria.
