import type { Metadata } from "next";
import Link from "next/link";
import { courses } from "@/lib/data/courses";
import { getCourseGallery } from "@/lib/data/course-gallery";
import { catalogHours, publicLevelCount } from "@/lib/data/course-views";
import CursosPageClient from "./CursosPageClient";
import CountryContext from "@/components/marketing/CountryContext";
import { ObjetivosCursos, RecursosDatos } from "@/components/marketing/EnlacesPrioritarios";
import { getContenidoPais } from "@/lib/data/contenido-paises";
import { getActiveSchedules } from "@/lib/supabase/comunidad-ai";
import type { CourseSchedule } from "@/lib/data/course-schedules";
import { ogImageUrl } from "@/lib/og/url";
import { PAGE_SEO } from "@/lib/seo/money";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString, twitterShare } from "@/lib/seo";
import { getPais, ISO_CHILE, normalizarPais, PAISES_INDEXABLES } from "@/config/paises";
import { muestraPrecioLocal, precioCurso } from "@/lib/paises/precios";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";

export const revalidate = 3600;

/**
 * Rutas no-país que GSC marcó como «descubierta, sin indexar» y que no
 * aparecen en el bloque `RecursosDatos` de arriba. Se enlazan desde el
 * catálogo chileno para darles una ruta de rastreo real; las fichas salen de
 * `courses` y las páginas de empleo ya existen, no se inventa contenido.
 */
const DESCUBIERTAS = [
  { href: "/cursos/mercado-financiero", label: "Curso de mercado financiero" },
  { href: "/empleos/para-empresas", label: "Publicar vacantes" },
  { href: "/empleos/talento", label: "Talento certificado" },
] as const;

export const metadata: Metadata = {
  title: { absolute: PAGE_SEO.cursos.title },
  description: PAGE_SEO.cursos.description,
  alternates: {
    canonical: absoluteUrl("/cursos"),
    languages: hreflangDe("/cursos"),
  },
  openGraph: {
    title: PAGE_SEO.cursos.title,
    description: PAGE_SEO.cursos.description,
    url: absoluteUrl("/cursos"),
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Catálogo de cursos",
          title: "Aprende análisis de datos con expertos de la industria",
          description:
            "Cursos online en vivo: Power BI, SQL Server, Python, Machine Learning y más.",
          tags: ["Power BI", "SQL", "Python", "IA"],
          path: "cursos",
        }),
        width: 1200,
        height: 630,
        alt: "Cursos de análisis de datos de ProgramBI",
      },
    ],
  },
  twitter: twitterShare(
    PAGE_SEO.cursos.title,
    PAGE_SEO.cursos.description,
    ogImageUrl({
      kicker: "Catálogo de cursos",
      title: "Aprende análisis de datos con expertos de la industria",
      description:
        "Cursos online en vivo: Power BI, SQL Server, Python, Machine Learning y más.",
      tags: ["Power BI", "SQL", "Python", "IA"],
      path: "cursos",
    })
  ),
};

export default async function CursosPage({
  params,
}: {
  params: Promise<{ pais?: string }>;
}) {
  const pais = normalizarPais((await params).pais);
  const contenido = getContenidoPais(pais);
  const schedules = (await getActiveSchedules()) as CourseSchedule[];
  const featuredImage =
    courses.find((c) => c.slug === "analisis-de-datos")?.imageUrl ??
    "/images/courses/analisis-de-datos-card.webp";

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: courses.length,
    itemListElement: courses.map((course, index) => {
      const url = absoluteUrl(rutaLocal(pais, `/cursos/${course.slug}`));
      const local = muestraPrecioLocal(pais) ? precioCurso(pais, course.slug) : null;
      return {
        "@type": "ListItem",
        position: index + 1,
        url,
        name: course.title,
        ...(local != null
          ? {
              item: {
                "@type": "Course",
                name: course.title,
                url,
                offers: {
                  "@type": "Offer",
                  price: local,
                  priceCurrency: getPais(pais).moneda,
                  availability: "https://schema.org/InStock",
                },
              },
            }
          : {}),
      };
    }),
  };

  return (
    <>
      <link rel="preload" as="image" href={featuredImage} fetchPriority="high" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Inicio", path: rutaLocal(pais, "/") },
              { name: "Cursos", path: rutaLocal(pais, "/cursos") },
            ])
          ),
        }}
      />
      <CursosPageClient
        schedules={schedules}
        catalog={courses.map((c) => ({
          slug: c.slug,
          title: c.title,
          shortDescription: c.shortDescription,
          imageUrl: c.imageUrl,
          durationHours: catalogHours(c),
          levelsCount: publicLevelCount(c),
          techStack: c.techStack,
          gallery:
            c.slug === "analisis-de-datos"
              ? [
                  { src: c.imageUrl, alt: c.title },
                  ...getCourseGallery(c.slug).map((shot) => ({ src: shot.src, alt: shot.caption })),
                ]
              : undefined,
        }))}
      />
      {contenido ? (
        <CountryContext
          contenido={contenido}
          titulo={`Qué se practica en el catálogo de ${getPais(pais).nombre}`}
        />
      ) : null}
      {/* Solo Chile: las landings de nicho y las páginas de comparativas viven
          en la raíz y hablan del mercado chileno. */}
      {pais === ISO_CHILE ? <ObjetivosCursos contexto="cursos" /> : null}
      {pais === ISO_CHILE ? <RecursosDatos contexto="cursos" /> : null}
      {pais === ISO_CHILE ? (
        <section
          className="border-t border-line bg-canvas px-4 py-12 sm:px-6 lg:px-8"
          aria-labelledby="especializaciones-y-recursos"
        >
          <div className="mx-auto max-w-[1400px]">
            <h2 id="especializaciones-y-recursos" className="text-xl font-semibold text-ink">
              Especialización financiera y bolsa de trabajo
            </h2>
            <p className="mt-2 max-w-[52rem] text-sm leading-relaxed text-mute">
              La ficha del curso de mercado financiero y las páginas para publicar vacantes o
              contratar talento con certificados verificados.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-ink">
              {DESCUBIERTAS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="no-underline underline-offset-2 hover:text-mute hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      <section className="bg-paper px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="cursos-por-pais">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="cursos-por-pais" className="text-xl font-semibold text-ink">
            Cursos por país
          </h2>
          <p className="mt-2 max-w-[52rem] text-sm leading-relaxed text-mute">
            Cada mercado tiene su propio horario, su moneda y su forma de pago. Elige el tuyo para ver
            el catálogo con precios y fechas locales.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-ink">
            {PAISES_INDEXABLES.map((mercado) => (
              <li key={mercado.iso}>
                <Link
                  href={rutaLocal(mercado.iso, "/cursos")}
                  className="no-underline underline-offset-2 hover:text-mute hover:underline"
                  hrefLang={mercado.idioma}
                >
                  Cursos de {mercado.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
