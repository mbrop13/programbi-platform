# P14 — Landings SQL y Python por país

Rama: `mejora/landings-sql-python`.

## Rutas implementadas

| Ruta Chile | Versiones de país | Curso del catálogo |
|---|---|---|
| `/curso-sql-online` | `/ar`, `/mx`, `/pe`, `/co`, `/uy` + resto de carpetas de `config/paises.ts` | `sql-server` |
| `/curso-python` | `/ar`, `/mx`, `/pe`, `/co`, `/uy` + resto de carpetas de `config/paises.ts` | `python` |

Las versiones de países no indexables (`bo`, `cr`, `ec`, etc.) existen por la carpeta dinámica, pero heredan `noindex, follow` de `metadataLocal` y quedan fuera del sitemap y de los hreflang.

## Archivos

- `app/(marketing)/curso-sql-online/page.tsx`
- `app/(marketing)/curso-python/page.tsx`
- `app/(pais)/[pais]/curso-sql-online/page.tsx` (reexport)
- `app/(pais)/[pais]/curso-python/page.tsx` (reexport)
- `components/marketing/CursoLanding.tsx`
- `lib/data/landing-cursos.ts` (copy propio, sin imports de P8/P9)
- `lib/paises/landing-curso.ts` (precio, horario, metadata y JSON-LD)
- `lib/paises/rutas.ts` (`RAICES`: las dos rutas son localizables)
- `app/sitemap.ts` (Chile + versiones indexables)
- `docs/seo-gsc.md` (títulos nuevos)
- `docs/dominios-paises.md` (ejemplos de las nuevas URLs)

## Datos usados

- Catálogo: `lib/data/courses.ts` (`sql-server`, `python`), `lib/data/syllabuses/*` (temario real), `lib/data/course-views.ts` (horas públicas, niveles y temario) y `lib/data/course-schedules.ts` (cohortes y horario).
- Precios: `config/paises.ts` y `lib/paises/precios.ts`. Chile muestra el precio de catálogo; los países con `pago: "mp"` muestran su precio local. No se convierte CLP a otra moneda ni se inventa un precio.
- Horario: `lib/paises/horarios.ts`. Se usa el `schedule_time` de la cohorte cuando existe y, si no, el horario base del sitio (`HORA_CLASE_CHILE`). Se muestra en hora del país y, fuera de Chile, también en hora de Chile.
- Fechas: `nextCohortForCourse` solo muestra cohortes futuras. Si no hay, se usa `OPEN_COHORT_LABEL` (“Cupos abiertos — consulta fecha”).
- Copy: `lib/data/landing-cursos.ts`. Los “usos” describen aplicaciones del temario real y, en los mercados con contenido propio, toman el sector y la fuente de `lib/data/contenido-paises`. No son casos de clientes ni métricas inventadas.

## SEO

- Canonical propio por país vía `metadataLocal`.
- `hreflang` de los países indexables + `x-default` vía `hreflangDe`.
- `sitemap.xml`: Chile y las carpetas indexables.
- JSON-LD: `Course` + `Offer` (reutiliza `getCourseJsonLd`), `FAQPage` y `BreadcrumbList`. La URL del curso y de la oferta apunta a la landing; la imagen se publica como URL absoluta. No se agregan `AggregateRating` ni reseñas inventadas.
- Las FAQ visibles y las del JSON-LD son las mismas.

## Integración con el contenido por país

Las dos landings consumen `getContenidoPais(pais)` para el H1 y el SEO escritos
por mercado, tres casos de uso por curso y dos FAQ propias. Los sectores y las
fuentes de datos de esos casos salen de `lib/data/contenido-paises`; no se
inventan industrias ni cifras.

La plantilla P9 (`PlantillaDescarga`) sigue fuera de estas dos landings para no
duplicar la lógica de leads. Si se quiere reutilizar, debe hacerse en un
workstream posterior y revisando que el JSON-LD no duplique `FAQPage` en la
misma URL.

Estas landings no tocan `components/empresas/*` ni `app/(marketing)/empresas/*`
(SENCE/empresas sigue aplazado).

## Verificación pendiente

Por la restricción de la rama no se ejecutaron `npm`, `npx`, `node`, `lint`, `build` ni pruebas. Antes de mergear, en el PC y de a una rama:

1. `npx tsc --noEmit`, `npm run lint` y `npm run build`.
2. `curl` de `/curso-sql-online`, `/curso-python`, `/ar/...`, `/mx/...`, `/pe/...`, `/co/...` y `/uy/...`: 200, canonical propio, hreflang de los 6 países + `x-default` y H1 con el país correcto.
3. Extraer los `<script type="application/ld+json">` y validar `Course`, `Offer`, `FAQPage` y `BreadcrumbList` (Rich Results Test).
4. Confirmar que `/sitemap.xml` incluye las dos rutas en Chile y en las carpetas indexables, y que no incluye países `noindex`.
5. Confirmar que el precio y el horario mostrados coinciden con la cohorte vigente en `course_schedules`.
