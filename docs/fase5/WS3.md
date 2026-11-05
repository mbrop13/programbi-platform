# Fase 5 · WS3 — Landings de nicho SSR

Rama: `feat/f5-landings` · Worktree: `C:/dev/pbi-f5-3`

Alcance: cuatro landings SSR bajo `app/(marketing)/`, contenido en
`lib/data/landings-nicho.ts` y componentes en `components/landings/`. No se
tocaron `app/sitemap.ts`, `next.config.ts`, `app/llms.txt/**`,
`components/shared/Footer.tsx`, `app/(marketing)/cursos/**` ni
`app/(marketing)/page.tsx`.

## Rutas y títulos

Estas son las cuatro URLs chilenas que debe incorporar el sitemap. El título
incluye la marca y queda dentro del tope de 60 caracteres.

| # | Ruta | Título base | H1 |
|---|---|---|---|
| 1 | `/power-bi-para-finanzas` | `Power BI para finanzas y control de gestión` | Power BI para finanzas y control de gestión |
| 2 | `/power-bi-sql-server-python` | `Power BI, SQL Server y Python para datos` | Power BI, SQL Server y Python: la ruta completa de datos |
| 3 | `/analisis-de-datos-mineria` | `Análisis de datos para minería en Chile` | Análisis de datos para minería: del turno al tablero |
| 4 | `/capacitacion-empresas` | `Capacitación en datos para empresas en Chile` | Capacitación en datos para empresas: programas in-company |

Todos los títulos agregan el sufijo ` | ProgramBI` mediante `tituloSeo`; el resultado final está en el bloque de sitemap.

Títulos y rutas para pegar en `app/sitemap.ts`:

```text
/power-bi-para-finanzas      → Power BI para finanzas y control de gestión | ProgramBI
/power-bi-sql-server-python  → Power BI, SQL Server y Python para datos | ProgramBI
/analisis-de-datos-mineria   → Análisis de datos para minería en Chile | ProgramBI
/capacitacion-empresas       → Capacitación en datos para empresas en Chile | ProgramBI
```

Cada página declara `metadata` propia con canonical absoluto y
`alternates.languages` vía `hreflangDe`. La metadata se arma en
`landingMetadata()` (`lib/data/landings-nicho.ts`) y se reutiliza en las cuatro
rutas.

## Estructura y datos estructurados

| Ruta | Course | Otros JSON-LD |
|---|---|---|
| `/power-bi-para-finanzas` | `power-bi` (reutiliza `getCourseJsonLd`) | `FAQPage` + `BreadcrumbList` |
| `/power-bi-sql-server-python` | `analisis-de-datos` | `ItemList` de SQL Server, Power BI y Python + `FAQPage` + `BreadcrumbList` |
| `/analisis-de-datos-mineria` | `analitica-mineria` | `FAQPage` + `BreadcrumbList` |
| `/capacitacion-empresas` | — | `Service` (in-company) + `FAQPage` + `BreadcrumbList` |

Las FAQ visibles (`LandingFaq`) y las del `FAQPage` salen del mismo arreglo
`faqs`, así que no hay preguntas declaradas que el usuario no pueda leer.

## Decisiones

- **Precios desde la configuración, nunca a mano.** `LandingPricing` lee
  `precioPublico(ISO_CHILE, slug)` de `config/pricing.ts`. La ruta de minería
  usa `analitica-mineria`, cuyo monto en `PRECIOS_CLP` es el mismo de
  `analisis-de-datos` (la tabla de precios manda). No hay montos escritos en
  el copy ni en el JSON-LD.
- **Cuotas desde `config/cuotas.ts`.** Los textos que mencionan cuotas usan
  `textoCuotas(ISO_CHILE)`; no se escribe «3 cuotas» a mano.
- **Contenido diferenciado.** Cada landing tiene un ángulo propio: finanzas y
  control de gestión, stack SQL Server + Power BI + Python, operación minera y
  capacitación in-company. No hay párrafos largos repetidos entre las cuatro.
- **Sin casos, clientes ni cifras inventadas.** Los ejemplos son ejercicios de
  clase y los textos lo dicen explícitamente. No se prometen sueldos, cargos,
  cupos, fechas de cohorte, plazos de respuesta ni descuentos.
- **Formulario B2B reutilizado.** `/capacitacion-empresas` renderiza
  `EmpresasContactForm`, el mismo componente cliente de `/empresas`. Envía a
  `POST /api/leads/create` con `leadType: "asesoria_b2b"` y dispara
  `generate_lead` mediante `trackLeadSubmit()` de
  `lib/analytics/marketing.ts`. No hay backend nuevo.
- **SSR.** Las cuatro páginas y `LandingPage` son componentes de servidor; el
  único componente cliente es el formulario de empresas.
- **Enlazado interno.** Cada landing enlaza a fichas reales del catálogo
  (`lib/data/courses.ts`), a 2–3 guías existentes de `lib/guias/generado.ts` y
  a las otras landings desde el bloque «Sigue en ProgramBI».
- **Minería, alineada con la ficha pública.** El copy habla de dos niveles
  públicos de 20 horas (Básico-Intermedio y Avanzado) y de tres bloques
  temáticos, que es lo que declaran `lib/data/course-views.ts` y la ficha. El
  hero toma horas y niveles de `course-views`, no de texto fijo.

## Archivos

- `app/(marketing)/power-bi-para-finanzas/page.tsx`
- `app/(marketing)/power-bi-sql-server-python/page.tsx`
- `app/(marketing)/analisis-de-datos-mineria/page.tsx`
- `app/(marketing)/capacitacion-empresas/page.tsx`
- `lib/data/landings-nicho.ts`
- `components/landings/LandingPage.tsx`
- `components/landings/LandingHero.tsx`
- `components/landings/LandingSectionBlock.tsx`
- `components/landings/LandingPricing.tsx`
- `components/landings/LandingFaq.tsx`
- `components/landings/LandingLinks.tsx`
- `components/landings/LandingCta.tsx`
- `components/landings/LandingClosing.tsx`
- `components/landings/LandingContactSection.tsx`
- `components/landings/index.ts`

## TODO_MANU

1. **Sitemap.** Agregar las cuatro rutas de la tabla a `app/sitemap.ts`
   (quedó fuera del alcance de este workstream). Son solo Chile; no hay
   carpetas `app/(pais)/[pais]/...` para estas landings.
2. **Hreflang.** `hreflangDe()` entrega el mismo canonical chileno para todos
   los mercados porque estas rutas no están en `RAICES` ni tienen versión por
   país. No genera enlaces rotos, pero tampoco versiones reales. Decidir si se
   dejan solo en Chile (y se recorta el mapa a `es-CL` + `x-default`) o si se
   crean las carpetas de país y se suman a `lib/paises/rutas.ts`. Si se crean,
   también deben entrar al sitemap por mercado.
3. **Minería: consistencia de la ficha.** `lib/data/courses.ts` declara
   `durationHours: 48` para `analitica-mineria`, mientras la vista pública
   (`course-views`) muestra 20 horas por nivel. La landing usa la vista pública.
   Confirmar cuál es el dato correcto en la ficha antes de publicar campañas.
4. **Atribución del formulario.** `EmpresasContactForm` reporta
   `source: "empresas_contact"`. Si se quiere distinguir esta landing en GA4,
   hay que agregarle un prop `source` al componente de empresas (fuera del
   alcance de WS3).
5. **Enlaces de navegación.** No se agregaron estas landings al menú ni al
   footer (Footer.tsx está fuera de alcance). Si deben aparecer en el menú,
   coordinar con el workstream de navegación.

## Verificación

No se ejecutaron `npm run build`, `next dev` ni `tsc` por las restricciones de
la rama. Sí se ejecutó ESLint sobre las cuatro páginas, `lib/data/landings-nicho.ts`
y todos los componentes de `components/landings/`: sin errores. Queda pendiente
el build completo antes del merge.

Checklist para el revisor:

1. `npm run lint` y `npm run build`.
2. Levantar el sitio y abrir las cuatro rutas:
   - `/power-bi-para-finanzas`
   - `/power-bi-sql-server-python`
   - `/analisis-de-datos-mineria`
   - `/capacitacion-empresas`
3. En cada una confirmar: HTTP 200, un solo `<h1>`, `<title>` de la tabla,
   canonical propio, `hreflang` presente, breadcrumbs visibles y FAQ visibles.
4. Verificar precios en pantalla: Power BI, SQL Server, Python y Análisis de
   Datos salen de `config/pricing.ts`; minería debe mostrar el mismo monto que
   Análisis de Datos (CLP 338.000). Empresas no muestra precio de lista.
5. Extraer los `<script type="application/ld+json">` y validar:
   - Course + Offer en finanzas, stack y minería.
   - FAQPage con exactamente las mismas preguntas y respuestas que la sección
     visible.
   - BreadcrumbList y, en stack, ItemList; en empresas, Service.
6. Probar el formulario de `/capacitacion-empresas` en un entorno con
   `POST /api/leads/create` habilitado y confirmar el evento `generate_lead` en
   GA4 DebugView.
7. Revisar que los enlaces internos a fichas y guías respondan 200 (no hay
   slugs inventados).
8. Confirmar que el sitemap incluye las cuatro rutas después del cambio del
   punto 1 de TODO_MANU.
