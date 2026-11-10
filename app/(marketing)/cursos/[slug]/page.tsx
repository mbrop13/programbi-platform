import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, getCourseBySlug, type Course } from "@/lib/data/courses";
import { getActiveSchedules, getMarketingDescription } from "@/lib/supabase/comunidad-ai";
import type { CourseSchedule } from "@/lib/data/course-schedules";
import CourseDetailClient from "@/app/(marketing)/cursos/[slug]/CourseDetailClient";
import BloquePaisFicha from "@/components/paises/BloquePaisFicha";
import BloqueLocalPais from "@/components/paises/BloqueLocalPais";
import FichaSeoExtra from "@/components/marketing/FichaSeoExtra";
import PlantillaVentasPowerBi from "@/components/marketing/PlantillaVentasPowerBi";
import GuiasDelCurso from "@/components/guias/GuiasDelCurso";
import TestimoniosDeCurso from "@/components/marketing/TestimoniosDeCurso";
import { ogImageUrl } from "@/lib/og/url";
import { absoluteUrl, jsonLdString, tituloLocal } from "@/lib/seo";
import { getCourseJsonLd } from "@/lib/seo/course-jsonld";
import { COURSE_SEO } from "@/lib/seo/money";
import { normalizarPais, esIndexable, ISO_CHILE } from "@/config/paises";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";
import { robotsLocal } from "@/lib/paises/metadata";
import { getBloqueLocal, getSeoBloque, esRutaSeoLocal } from "@/lib/data/contenido-paises";
import { detalleCursoLocal } from "@/lib/paises/detalle-curso";
import { horarioDeCohorte } from "@/lib/paises/horarios";

export const revalidate = 3600;

type Params = Promise<{ slug: string; pais?: string }>;
type SearchParams = Promise<{ para?: string | string[]; nivel?: string | string[] }>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Copia del curso sin montos para el componente cliente.
 *
 * Los props de un Server Component viajan en el flight data de RSC dentro del
 * HTML: si `originalPrice` o `levels[].price` van en el prop, el precio queda
 * expuesto aunque la tarjeta no lo pinte. El monto se calcula en cliente con
 * `precioVenta`, así que el cliente no necesita ninguno de estos campos.
 */
function cursoSinPrecios(course: Course): Course {
  const limpio: Course = { ...course, levels: course.levels?.map((level) => ({ ...level })) };
  delete limpio.originalPrice;
  limpio.levels?.forEach((level) => {
    delete level.price;
    delete level.originalPrice;
  });
  return limpio;
}

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, pais: rawPais } = await params;
  const pais = normalizarPais(rawPais);
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Curso no encontrado" };

  const seo = COURSE_SEO[slug];
  const titleBase = seo?.title ?? `${course.title} — Curso en vivo Chile`;
  // Perú y México tienen title/meta escritos para su mercado; el resto sigue
  // localizando el título chileno.
  const seoLocal = esRutaSeoLocal(slug) ? getSeoBloque(pais, slug) : null;
  const title = seoLocal ? tituloLocal(seoLocal.title) : tituloLocal(localizarMercado(titleBase, pais));
  const dbDescription = await getMarketingDescription(slug);
  // Chile puede declarar el precio en la meta; los demás mercados usan la
  // versión sin monto porque su precio va en otra moneda.
  const descripcionBase =
    pais === ISO_CHILE && seo?.descriptionCl
      ? seo.descriptionCl
      : seo?.description || dbDescription || course.description;
  const description = seoLocal ? seoLocal.description : localizarMercado(descripcionBase, pais);
  const canon = absoluteUrl(rutaLocal(pais, `/cursos/${slug}`));

  // Tarjeta OG de marca (tipográfica, papel-monócromo) — reemplaza las
  // portadas remotas de estilo antiguo.
  const shareImage = ogImageUrl({
    kicker: localizarMercado("Curso en vivo Chile", pais),
    title: localizarMercado(seo?.h1 || course.title, pais),
    description,
    tags: course.techStack,
    accent: course.accentColor,
    path: `cursos/${slug}`,
  });

  // Solo los países indexables entran en el juego de hreflang.
  const indexable = esIndexable(pais);

  return {
    title: pais === "cl" ? (seo?.title ? { absolute: seo.title } : titleBase) : { absolute: title },
    description,
    alternates: {
      canonical: canon,
      ...(indexable ? { languages: hreflangDe(`/cursos/${slug}`) } : {}),
    },
    ...(indexable ? {} : { robots: robotsLocal(pais) }),
    openGraph: {
      title,
      description,
      url: canon,
      type: "website",
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug, pais: rawPais } = await params;
  const pais = normalizarPais(rawPais);
  const query = await searchParams;
  const para = one(query.para);
  const nivel = one(query.nivel);
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const seo = COURSE_SEO[slug];
  const dbDescription = await getMarketingDescription(slug);
  if (dbDescription && !seo) {
    course.description = dbDescription;
  } else if (seo) {
    course.description = seo.description;
  }

  const schedules = (await getActiveSchedules()) as CourseSchedule[];

  // Horario local y preguntas que no incluyen el precio.
  const cohorte = schedules.find((s) => s.course_slug === course.slug);
  const { inicio, fin } = horarioDeCohorte(cohorte?.schedule_time);
  const detalle = detalleCursoLocal({ iso: pais, inicio, fin });

  const courseJsonLd = getCourseJsonLd(course, "publico", pais);
  const bloque = getBloqueLocal(pais, { curso: slug });
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      courseJsonLd,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl(rutaLocal(pais, "/")) },
          { "@type": "ListItem", position: 2, name: "Cursos", item: absoluteUrl(rutaLocal(pais, "/cursos")) },
          {
            "@type": "ListItem",
            position: 3,
            name: localizarMercado(seo?.h1 || course.title, pais),
            item: absoluteUrl(rutaLocal(pais, `/cursos/${slug}`)),
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          ...(seo
            ? seo.faqs
                .filter((faq) => !faq.soloChile || pais === ISO_CHILE)
                .map((faq) => ({
                  "@type": "Question",
                  name: localizarMercado(faq.q, pais),
                  acceptedAnswer: { "@type": "Answer", text: localizarMercado(faq.a, pais) },
                }))
            : []),
          // Preguntas del mercado: horario local y certificado. Sin el precio.
          ...detalle.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        ],
      },
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <CourseDetailClient
        key={course.slug}
        course={cursoSinPrecios(course)}
        initialSchedules={schedules}
        initialView={para === "empresas" ? "empresas" : "publico"}
        initialLevelName={nivel}
        detalleLocal={detalle}
      />
      {/* Bloque propio del mercado: texto, horario, FAQ y enlaces internos.
          Reemplaza a CountryContext, que repetía los mismos datos. */}
      <BloquePaisFicha curso={course} pais={pais} inicio={inicio} fin={fin} />
      {/* Datos del mercado para la ficha: precio en moneda local (gate del
          brochure), horario convertido, pago, cuotas, clase gratis y
          certificado, más el resto de fichas y guías del país. */}
      {bloque ? (
        <BloqueLocalPais iso={pais} bloque={bloque} contexto="ficha" conEnlaces />
      ) : null}
      <FichaSeoExtra slug={course.slug} pais={pais} />
      {/* Bloque único de la antigua landing /curso-power-bi (plantilla CSV),
          migrado aquí antes de convertir esa landing en 301. */}
      {course.slug === "power-bi" ? <PlantillaVentasPowerBi pais={pais} /> : null}
      <GuiasDelCurso curso={course.slug} pais={pais} />
      {/* Citas reales de alumnos de este curso (LinkedIn). Se oculta sola si no
          hay testimonios o si el kill-switch NEXT_PUBLIC_TESTIMONIOS=0. */}
      <TestimoniosDeCurso cursoSlug={course.slug} />
    </>
  );
}
