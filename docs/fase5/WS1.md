# WS1 — Perfiles del fundador y del equipo docente

Frente: `feat/f5-equipo` · Worktree: `C:/dev/pbi-f5-1`
Base: `0b14f1f` (`fix(f4): minería al precio de Análisis de datos, clase-gratis 404 y llms.txt con 8 comparativas`)
Estado: **completado y commiteado** en la rama. Sin push, sin deploy, sin migraciones.

Se partió del trabajo sin commitear de una corrida anterior interrumpida: se revisó,
se conservó lo que ya funcionaba (normalización de `mentors.ts`, tarjetas, ficha, aviso,
páginas y JSON-LD) y se completó lo que faltaba (enlace visible en `/nosotros`,
`@id` coherente del fundador, `founder` en la organización, instructores por curso y
esta documentación).

## Estado

- [x] `/profesores` renderiza los 3 perfiles reales (Manuel Oliva, Emanuel Berrocal, Rodrigo Vega).
- [x] `/profesores/[slug]` con `generateStaticParams` y `dynamicParams = false`.
- [x] Sin biografía se muestra «Perfil en preparación»; no se inventó texto.
- [x] Con `EQUIPO_PUBLICADO` apagado: 200 + `robots: { index: false, follow: true }`.
- [x] `/nosotros` conserva diseño y `AboutPage`; suma `EducationalOrganization` con
      `founder` por `@id`, los nodos `Person` y un enlace visible a `/profesores`.
- [x] `Course.hasCourseInstance.instructor` con el profesor real de cada curso.
- [x] Slugs y rutas sin colisión con `app/(pais)/[pais]`.
- [x] Títulos ≤60 caracteres y un solo `<h1>` por página.
- [x] `docs/fase5/WS1.md`.

## Archivos

Nuevos:

| Archivo | Qué hace |
|---|---|
| `lib/data/equipo.ts` | Fuente única del equipo: normaliza `mentors.ts` a `MiembroEquipo`, define slugs, `EQUIPO_PUBLICADO`, `equipoCompleto()`, `fundadorEquipo()` y `miembroPorCurso()`. |
| `components/equipo/TarjetaProfesor.tsx` | Tarjeta del índice; solo pinta datos existentes y «Perfil en preparación» si falta bio. |
| `components/equipo/PerfilProfesor.tsx` | Ficha completa: foto o iniciales, rol, cargo, credenciales, bio, trayectoria y cursos. |
| `components/equipo/AvisoEquipoPreparacion.tsx` | Aviso de equipo en preparación; se oculta solo con el flag encendido. |
| `components/equipo/iniciales.ts` | Iniciales para el fallback de foto (no se inventan imágenes). |
| `app/(marketing)/profesores/page.tsx` | Índice `/profesores` con `ItemList`, `BreadcrumbList` y organización. |
| `app/(marketing)/profesores/[slug]/page.tsx` | Ficha `/profesores/<slug>` con `ProfilePage` + `Person`. |
| `docs/fase5/WS1.md` | Este documento. |

Modificados:

| Archivo | Cambio |
|---|---|
| `app/(marketing)/nosotros/page.tsx` | Organización con `founder`/`employee`, nodos `Person`, enlace al fundador y bloque visible «Ver todos los perfiles». Se mantiene el `AboutPage` y todo el diseño previo. |
| `lib/seo/course-jsonld.ts` | `instructor` por curso, helpers `idPersona`, `getPersonaJsonLd`, `getOrganizacionEquipoJsonLd` y `getProfilePageJsonLd`. `Offer`, `FAQ` y `syllabusSections` intactos. |
| `components/shared/RootShell.tsx` | Mínimo: el `founder` del nodo global de organización ahora lleva el mismo `@id` y `url` que la ficha, y el `jobTitle` que ya existía en `mentors.ts` («Fundador y Director»). |

## Datos y decisiones

### Fuente y huecos

Todo sale de `lib/data/mentors.ts` (nombre, rol, cargo, credenciales, LinkedIn, foto y
`specialtyCourses`). No se agregó ninguna persona, cargo, foto ni métrica nueva.

| Persona | Slug | Bio | LinkedIn | Foto | Cursos declarados |
|---|---|---|---|---|---|
| Manuel Oliva | `manuel-oliva` | Sí (`founderBio`) | Sí | Sí | `analisis-de-datos`, `power-bi` |
| Emanuel Berrocal | `emanuel-berrocal` | **No** → `null` | Sí | Sí | `mercado-financiero`, `python` |
| Rodrigo Vega | `rodrigo-vega` | **No** → `null` | Sí | Sí | `power-bi`, `excel` |

- `bio` queda en `null` para Emanuel y Rodrigo; las tarjetas y fichas muestran
  «Perfil en preparación». No hay texto inventado.
- Los slugs se declaran explícitos en `SLUG_POR_PERSONA` porque forman parte de la URL
  pública; si mañana entra una persona sin entrada, se genera un slug razonable.
- Se reutiliza `founderCareer` como `trayectoria` en la ficha del fundador (dato que ya
  estaba en el repo y no se mostraba en `/profesores`).

### Publicación

`EQUIPO_PUBLICADO` se lee de `NEXT_PUBLIC_EQUIPO_PUBLICADO === "1"` y hoy da `false`.
Mientras esté apagado:

- `/profesores` y `/profesores/[slug]` responden **200** (no 404) para que se puedan
  revisar, pero declaran `robots: { index: false, follow: true }`.
- Se muestra el aviso «Equipo en preparación».
- El sitemap **no** debe incluir estas URLs (ver la línea exacta más abajo).

Al encenderlo hay que reconstruir/redeployar: el flag se inlinea en build, igual que el
resto de `NEXT_PUBLIC_*`.

### Identidad JSON-LD

- `@id` de cada persona: `https://www.programbi.com/#person-<slug>`
  (p. ej. `#person-manuel-oliva`). Es estable y no depende de que la ficha esté publicada.
- `RootShell` declara el nodo global `EducationalOrganization`; su `founder` usa el mismo
  `@id`, de modo que el nodo se fusiona con el `Person` de `/profesores` y con el
  `instructor` de los cursos.
- `/nosotros` mantiene su `AboutPage` y su nodo `EducationalOrganization` (mismo `@id`
  `#organization`), ahora con `founder` y `employee` por referencia.
- `getPersonaJsonLd` solo agrega `description`, `image` y `sameAs` cuando el dato existe.

### Instructor de cada curso

`getCourseJsonLd` usa `miembroPorCurso(course.slug)`:

- `python` y `mercado-financiero` → **Emanuel Berrocal**.
- `excel` → **Rodrigo Vega**.
- `power-bi`, `analisis-de-datos` y el resto → **Manuel Oliva** (sea porque lo declara
  o porque es el fallback del fundador).
- `power-bi` lo declaran Manuel y Rodrigo; gana el de menor `orden`, que es Manuel.

El `instructor` va dentro de `hasCourseInstance` porque schema.org **no** define
`instructor` en `Course`; el lugar válido es `CourseInstance`. Se conservan `offers`,
`FAQPage` y `syllabusSections` existentes. El antiguo `sameAs` a la página de empresa
(que no era una persona) se reemplazó por el `sameAs` real de LinkedIn.

### Rutas

- `/profesores` y `/profesores/<slug>` viven solo en el grupo `(marketing)`, en la raíz.
  No se crearon versiones `/[pais]/profesores`: las fichas son las mismas para todos los
  mercados y su canonical es la raíz.
- No hay colisión con `app/(pais)/[pais]`: ese layout tiene `dynamicParams = false` y
  `generateStaticParams()` solo devuelve los ISO de `PAISES_CARPETA`; además, una ruta
  estática (`/profesores`) tiene prioridad sobre `[pais]`.
- `[slug]` usa `generateStaticParams()` con los 3 slugs y `dynamicParams = false`: un
  slug desconocido da 404 sin depender de datos externos.
- `esRutaLocalizable()` no incluye `/profesores`, así que `rutaLocal()` no produce
  `/cl/profesores` ni similares.

### SEO

- `/profesores`: `Profesores y equipo docente | ProgramBI` (39 caracteres).
- Fichas: `Manuel Oliva — Profesor | ProgramBI` (35), `Emanuel Berrocal — Profesor |
  ProgramBI` (39), `Rodrigo Vega — Profesor | ProgramBI` (35).
- Un solo `<h1>` por página: índice («Quiénes dictan las clases»), ficha (nombre) y
  `/nosotros` (el que ya existía). Las tarjetas usan `<h2>`.
- Canonical absoluto y OG/Twitter con el pipeline existente (`pageOg`).

## Verificación realizada

Sin `npm run build`, `next dev`, `npx tsc` ni instalación de dependencias, según el
encargo. Lo que sí se ejecutó:

1. **Módulos de datos y JSON-LD con `jiti`** (ejecución real de
   `lib/data/equipo.ts`, `lib/seo/course-jsonld.ts` y `lib/data/courses.ts`):
   - 3 miembros, slugs únicos, todos los cursos declarados existen.
   - 13 cursos revisados: todos tienen `hasCourseInstance.instructor` con `@id` de una
     persona del equipo y nombre coherente.
   - `@id` de Person únicos; `founder` y `employee` de la organización apuntan a ellos.
   - `ProfilePage.mainEntity` coincide con el `Person` de la ficha.
   - Títulos ≤60 y JSON serializable sin `undefined`.
   - Resultado: `TODO OK`.
2. **ESLint puntual** (`node node_modules/eslint/bin/eslint.js ...` sobre los archivos
   tocados): **0 errores**. Queda 1 warning preexistente en `RootShell.tsx`
   (`@next/next/no-head-element`, por el `<head>` del layout raíz; no lo introduce este
   frente).
3. **Rutas y colisiones**: revisadas a mano contra `app/(pais)/[pais]/layout.tsx`
   (`dynamicParams = false`, `paramsCarpeta()`), `app/(marketing)/layout.tsx` y
   `lib/paises/rutas.ts`.

Pendiente para el orquestador (verificación final):

```bash
npm run build
# Debe listar /profesores, /profesores/manuel-oliva,
# /profesores/emanuel-berrocal y /profesores/rodrigo-vega.
```

Con el flag apagado, en el HTML de `/profesores` debe aparecer
`<meta name="robots" content="noindex, follow">`; con `NEXT_PUBLIC_EQUIPO_PUBLICADO=1`
no debe aparecer. En `/nosotros` deben convivir `AboutPage`, `EducationalOrganization`
con `founder: { "@id": "https://www.programbi.com/#person-manuel-oliva" }` y los tres
nodos `Person`. En una ficha de curso, `hasCourseInstance.instructor.@id` debe ser el
`#person-<slug>` correspondiente.

## Línea exacta para el sitemap (otro frente)

`app/sitemap.ts` lo edita otro frente. Para incluir el directorio **solo cuando esté
publicado**, agregar el import:

```ts
import { EQUIPO, EQUIPO_PUBLICADO, rutaPerfil } from "@/lib/data/equipo";
```

y, dentro de `staticPages` (no en `localizedPaths`, porque las fichas son solo de la
raíz), justo después del bloque de `/nosotros`:

```ts
    // F5: directorio de profesores. Con el flag apagado las páginas son noindex,
    // así que no deben entrar al sitemap.
    ...(EQUIPO_PUBLICADO
      ? [
          {
            url: loc("/profesores"),
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.5,
          },
          ...EQUIPO.map((miembro) => ({
            url: loc(rutaPerfil(miembro.slug)),
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.4,
          })),
        ]
      : []),
```

No agregar `/profesores` a `localizedPaths`: generaría `/ar/profesores`,
`/mx/profesores`, etc., que no existen.

## TODO_MANU

- **Biografías de Emanuel Berrocal y Rodrigo Vega.** Sin ellas, sus fichas dicen
  «Perfil en preparación» y `equipoCompleto()` sigue en `false`. No se inventó texto.
- **Bio corta para las tarjetas** (opcional): hoy la tarjeta usa la bio larga del
  fundador y el aviso para los demás.
- **Joaquín Villagra:** solo aparece en un testimonio
  (`lib/data/testimonials.ts`). No tiene cargo, bio, LinkedIn ni foto en el repo, así
  que **no se le creó ficha**. Si Manu confirma esos datos, se agrega a `mentors.ts` y
  aparece solo en `/profesores`.
- **Encender `NEXT_PUBLIC_EQUIPO_PUBLICADO=1`** cuando estén las tres biografías y
  reconstruir. Mientras siga apagado, las páginas son 200 pero noindex y el sitemap no
  las lista.
- **Confirmar que cada profesor sigue dictando los cursos de `specialtyCourses`**
  (dato preexistente en `mentors.ts`, no se modificó). Si cambia, se edita ahí.
- Las fotos y los LinkedIn de las tres personas ya existen en el repo; no hay pendiente
  de datos para ellos.

## Riesgos de merge

- **`components/shared/RootShell.tsx`** es compartido por todos los root layouts. El
  cambio es de 4 líneas ( `@id`, `url`, `jobTitle` del `founder`) y no toca el `<head>`
  ni el resto del nodo. Si otro frente lo edita, el conflicto es trivial.
- **`lib/seo/course-jsonld.ts`** lo usan todas las fichas de curso y las landings de
  país. El cambio altera el `instructor` de 13 cursos (en `python`,
  `mercado-financiero` y `excel` deja de decir Manuel Oliva) y agrega exports nuevos.
  Si otro frente compara snapshots de JSON-LD, hay que actualizarlos.
- **`app/(marketing)/nosotros/page.tsx`** es de marketing; se conservó el diseño y el
  `AboutPage`, pero se agregó una sección al final. Si otro frente reescribe la página,
  el bloque del enlace a `/profesores` debe sobrevivir.
- **Flag apagado en producción**: si se mergea sin encender
  `NEXT_PUBLIC_EQUIPO_PUBLICADO`, las páginas quedan noindex (correcto) y el sitemap no
  las incluye. Si el frente de sitemap las agrega sin el flag, habrá URLs noindex en el
  sitemap: es el error más fácil de cometer.
- Las fichas son solo de la raíz. Si otro frente localiza `/profesores` por país, hay
  que cambiar `rutaPerfil`, los canonical y el `instructor` de las landings.

## Commit

`feat(f5-equipo): perfiles del equipo docente y Course.instructor`

Ver `git log -1 --oneline` en `C:/dev/pbi-f5-1`.
