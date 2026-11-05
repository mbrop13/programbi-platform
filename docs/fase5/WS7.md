# Fase 5 · WS7 — Indexación: fichas por país y enlazado interno

Rama: `feat/f5-indexacion` · Worktree: `C:/dev/pbi-f5-7`
Base: `main` en `0b14f1f` (la rama no se ha rebasado).

## Estado

- [x] Bloque único por país montado en la ficha de curso (Chile incluido).
- [x] Cada ficha enlaza a la guía de su curso, a otras guías del mercado y al
      mismo curso en 2-3 mercados vecinos.
- [x] La home de cada país enlaza a las 13 fichas y a todas las guías
      publicadas de ese mercado.
- [x] Footer con `/faq`, `/glosario` y `/versus` sin duplicar URLs.
- [x] Páginas chilenas prioritarias enlazadas desde la home y `/cursos`.
- [x] Cuatro landings de nicho enlazadas desde la home y `/cursos` (solo Chile).
- [x] Sin build ni `next dev` (prohibidos para el subagente). ESLint puntual sin
      errores.

## Qué se hizo

### 1. Ficha de curso: `BloquePaisFicha`

`app/(marketing)/cursos/[slug]/page.tsx` monta `<BloquePaisFicha>` después de
`CourseDetailClient` y antes de `GuiasDelCurso`. Es la misma página que sirve
`/<pais>/cursos/<slug>`, así que el bloque aparece en los seis mercados con
contenido propio (Chile, Argentina, México, Perú, Colombia y Uruguay).

El bloque (`components/paises/BloquePaisFicha.tsx`, componente de servidor)
incluye:

- los párrafos únicos del mercado de `lib/data/contenido-paises/fichas.ts`
  (153–185 palabras por país, ampliados en esta corrida para llegar al mínimo
  editorial de 150);
- el caso de industria de `contenido.casos[0]`, con su fuente de datos;
- precio de venta local con `precioVenta()` (`config/pricing.ts` y
  `config/paises.ts`) y moneda del mercado;
- horario convertido a la hora local con `horarioLocal()`, más la referencia en
  hora de Chile;
- medios de pago reales de `config/paises.ts` y `textoCuotas()` de
  `config/cuotas.ts`;
- preguntas propias del mercado: dos de `categoria: "pagos"` y una `"general"`
  de `contenido-paises`; en Chile, tres respuestas de `faqDePais("cl")`
  (`cuotas-sin-interes`, `formas-de-pago`, `grabaciones-de-por-vida`), que se
  arman con precios y cuotas reales;
- enlaces a la guía del curso en ese país, a tres guías de otros cursos del
  mismo mercado y al índice de guías;
- el bloque «El mismo curso en otros mercados», con precio y hora local de cada
  vecino y, cuando existe, su guía del mismo curso.

Se eliminó `CountryContext` de la ficha: repetía horario, medios de pago y
referencias que ahora cubre el bloque nuevo. `CountryContext` sigue intacto en
`/cursos`, `/implementacion-power-bi`, `/migrar-excel-a-power-bi` y
`/por-que-fallan-proyectos-power-bi`.

### 2. Guía local y vecinos

- `components/paises/enlaces.ts`: `guiaLocalDeCurso()` ahora prioriza el slug
  (`curso-<curso>-<pais>`) sobre el campo `course` del generado. Sin eso, la
  ficha de `analitica-mineria` quedaba sin guía porque
  `curso-analitica-mineria-chile` está etiquetada como `analisis-de-datos`.
- `lib/paises/vecinos.ts`: mapa editorial de vecinos. Chile queda con
  Argentina, Perú y Uruguay; Uruguay con Argentina y Chile (Paraguay se filtra
  porque no es indexable). Cada uno de los seis mercados con ficha termina con
  2-3 vecinos.

### 3. Home de país con índice completo

`components/paises/IndicePais.tsx` es un bloque de servidor con:

- las 13 fichas agrupadas como el catálogo (Herramientas, Especializaciones,
  IA), enlazadas con su título real;
- todas las guías publicadas del mercado (`guiasDePais` + `esGuiaPublicada`):
  15 en Chile, 13-14 en Argentina, México, Perú, Colombia y Uruguay;
- enlace al catálogo y al índice de guías del mercado.

Se monta en `app/(marketing)/page.tsx`, que es la página que reexporta
`app/(pais)/[pais]/page.tsx`, así que aparece en la home de Chile y en la de
cada país. El catálogo de la home solo muestra seis tarjetas en el HTML inicial
(las demás se despliegan con JavaScript); este índice deja las trece fichas en
el HTML del servidor.

### 4. Footer

`components/shared/Footer.tsx` agrega tres enlaces con texto distinto al
existente:

- `FAQ de cursos y pagos` → `/faq`
- `Glosario de datos` → `/glosario`
- `Comparativas de herramientas` → `/versus`

No se duplica `/preguntas-frecuentes` (sigue con su enlace propio) ni se repite
ninguna URL. El layout del footer no cambia: es una columna `flex-col` más.

### 5. Páginas chilenas prioritarias y landings

`components/marketing/EnlacesPrioritarios.tsx` exporta dos bloques:

- `ObjetivosCursos`: cuatro tarjetas a `/power-bi-para-finanzas`,
  `/power-bi-sql-server-python`, `/analisis-de-datos-mineria` y
  `/capacitacion-empresas`.
- `RecursosDatos`: diez enlaces con descripción a `/versus`, las tres
  comparativas (`desafio-latam`, `coderhouse`, `ips-datax`),
  `/cursos/machine-learning`, `/power-bi-mineria-chile`, `/glosario`, `/faq`,
  `/empleos` y `/empleos/vacantes`.

Se montan en la home (después de `Programs` y después de `FaqSection`) y en
`/cursos` (después de `CountryContext`, antes del selector de países). Solo se
renderizan cuando el mercado de la ruta es Chile: las landings y las páginas de
comparativas viven en la raíz y su texto habla del mercado chileno; enlazarlas
desde `/ar`, `/mx`, etc. mandaría al usuario a otra versión del sitio.

### 6. Duplicados

- No se agregó un segundo H1: el bloque usa `h2`/`h3` y no repite el titular de
  `CourseDetailClient`.
- Las preguntas del bloque no repiten las de `CourseLocalSeo`/`CourseFaq`
  (horario y certificado): se excluyen por categoría y por id.
- `GuiasDelCurso` sigue siendo el único bloque «Guías de \<curso\>»; el bloque
  nuevo solo enlaza guías de **otros** cursos del mismo país.
- `CountryContext` se reutiliza en las páginas que ya lo tenían; en la ficha se
  reemplazó, no se duplicó.

## Archivos

Nuevos:

- `components/paises/IndicePais.tsx`
- `components/marketing/EnlacesPrioritarios.tsx`
- `docs/fase5/WS7.md` (este archivo)

De la corrida anterior, completados y conectados:

- `lib/data/contenido-paises/fichas.ts` (textos por país, 153–185 palabras)
- `lib/paises/vecinos.ts` (mapa de vecinos)
- `components/paises/enlaces.ts` (guía local del curso)
- `components/paises/BloquePaisFicha.tsx` (bloque de ficha)

Modificados:

- `app/(marketing)/cursos/[slug]/page.tsx` (monta el bloque, quita
  `CountryContext`)
- `app/(marketing)/page.tsx` (índice de país, objetivos y recursos)
- `app/(marketing)/cursos/page.tsx` (objetivos y recursos)
- `app/(pais)/[pais]/page.tsx` (comentario: el índice lo aporta la home
  compartida)
- `components/shared/Footer.tsx` (tres enlaces nuevos)

## Cómo verificar

Sin `next dev` ni build (reservados al orquestador). Lo que sí se puede correr:

```bash
npx eslint "app/(marketing)/page.tsx" "app/(marketing)/cursos/page.tsx" \
  "app/(marketing)/cursos/[slug]/page.tsx" "app/(pais)/[pais]/page.tsx" \
  "components/shared/Footer.tsx" "components/paises/*.tsx" \
  "components/marketing/EnlacesPrioritarios.tsx" \
  "lib/data/contenido-paises/fichas.ts" "lib/paises/vecinos.ts"
```

Comprobaciones manuales cuando haya build o preview:

1. `GET /cursos/power-bi` debe traer en el HTML (no solo en JS) el texto
   «Ficha local · Chile», el precio en CLP y el bloque «El mismo curso en otros
   mercados» con Argentina, Perú y Uruguay.
2. `GET /ar/cursos/power-bi` debe traer «Ficha local · Argentina», el precio en
   ARS, el horario de Buenos Aires, dos preguntas de pagos y los enlaces a
   `/ar/guias/como-aprender-power-bi-en-argentina` (guía local), a otras guías
   argentinas y a las fichas de Chile y Uruguay, cada una con su guía.
3. `GET /ar` debe incluir las 13 fichas y las 13 guías argentinas publicadas.
   `GET /` (Chile) debe incluir las 15 guías chilenas.
4. `GET /` y `GET /cursos` deben incluir los enlaces a las cuatro landings, a
   `/versus`, las tres comparativas, `/glosario`, `/faq`,
   `/cursos/machine-learning`, `/power-bi-mineria-chile`, `/empleos` y
   `/empleos/vacantes`.
5. `GET /` de cualquier país debe mostrar en el footer `/faq` (con prefijo de
   país), `/glosario` y `/versus`.

Conteos usados para el diseño (verificados contra `lib/guias/generado.ts`):
Chile 15 guías publicadas; Argentina 13; México 14; Perú, Colombia y Uruguay
13. Todos los cursos del catálogo tienen una guía del mercado en los seis
países: fuera de Chile, Power BI se cubre con `como-aprender-power-bi-en-<país>`
y el resto con `curso-<slug>-<país>`.

## TODO_MANU

- **Orden de merge con `feat/f5-landings` (WS3).** Las cuatro landings
  (`/power-bi-para-finanzas`, `/power-bi-sql-server-python`,
  `/analisis-de-datos-mineria`, `/capacitacion-empresas`) no existen en esta
  rama: los enlaces quedan escritos y devolverán 404 hasta que se integre
  `33b8923`. Si el orden se invierte, no hay que tocar nada; si se decide no
  publicar alguna landing, hay que quitar su tarjeta de
  `components/marketing/EnlacesPrioritarios.tsx`.
- **`/faq` vs `/preguntas-frecuentes`.** Son dos páginas vivas y el footer
  enlaza ambas con textos distintos («Preguntas frecuentes» y «FAQ de cursos y
  pagos»). No se tocó su contenido ni su canonical; si Manu decide consolidar,
  conviene redirigir una de las dos (hoy `/faq` es la que está sin indexar).
- **FAQ de Chile en la ficha.** Sale de `faqDePais("cl")` porque Chile no tiene
  archivo en `lib/data/contenido-paises`. Si se quiere texto editorial chileno
  propio (como el de `fichas.ts`), hay que crear `cl.ts` en `contenido-paises` y
  el bloque lo tomará sin cambios.
- **Otros mercados indexables** (Bolivia, Costa Rica, Ecuador, El Salvador,
  Guatemala, República Dominicana y Venezuela) siguen con la ficha común: no
  tienen `fichas.ts` ni `contenido-paises`. Si se les quiere dar texto propio,
  el bloque ya está listo para recibirlos.
- **Crecimiento del índice.** `IndicePais` lista todas las guías del mercado.
  Con 15 se ve bien; si un país pasa de ~25 guías, conviene agrupar por curso o
  limitar a las más recientes.

## Riesgos de merge

- `app/(marketing)/page.tsx`: es el archivo con más probabilidad de conflicto
  (cualquier frente que agregue una sección a la home). Los cambios son
  aditivos y están al final del árbol JSX; se resuelven conservando ambas
  secciones.
- `app/(marketing)/cursos/page.tsx`: mismo caso; el bloque nuevo va antes de la
  sección «Cursos por país».
- `components/shared/Footer.tsx`: solo se agregaron tres entradas a
  `companyLinks`. Si otro frente toca la lista, el conflicto es de una línea.
- `app/(marketing)/cursos/[slug]/page.tsx`: se quitó `CountryContext` y se
  agregó el bloque. Si el frente 1 (`lib/seo/course-jsonld.ts`) o el 2
  (guías) modifican esta página, el conflicto está en el bloque de imports y en
  el cierre del `return`.
- `components/paises/BloquePaisFicha.tsx` y `lib/data/contenido-paises/fichas.ts`
  vienen de la corrida anterior sin commit; si otro worktree los tiene
  duplicados, hay que quedarse con esta versión (incluye FAQ, guías, vecinos y
  los párrafos ampliados).
- No se tocaron `app/sitemap.ts`, `app/robots.ts`, `next.config.ts`,
  `components/guias/**`, `lib/data/testimonials.ts` ni
  `lib/seo/course-jsonld.ts`: los frentes 1, 2 y 4 no deberían chocar con este
  commit.

## Commit

- Un solo commit en la rama `feat/f5-indexacion`; este reporte va dentro de ese
  commit. Sin push (lo hace el orquestador al integrar).
