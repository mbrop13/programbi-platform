import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import { getActiveSchedules, getMarketingDescription } from "@/lib/supabase/comunidad-ai";
import type { CourseSchedule } from "@/lib/data/course-schedules";
import CourseDetailClient from "@/app/(marketing)/cursos/[slug]/CourseDetailClient";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";
import { getCourseJsonLd } from "@/lib/seo/course-jsonld";
import { COURSE_SEO } from "@/lib/seo/money";
import { normalizarPais } from "@/config/paises";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";
import { resolverCobro } from "@/lib/paises/cobro";

export const revalidate = 3600;

type Params = Promise<{ slug: string; pais?: string }>;
type SearchParams = Promise<{ para?: string | string[]; nivel?: string | string[] }>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
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
  const title = localizarMercado(titleBase, pais);
  const dbDescription = await getMarketingDescription(slug);
  const description = localizarMercado(seo?.description || dbDescription || course.description, pais);
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

  return {
    title: pais === "cl" ? (seo?.title ? { absolute: seo.title } : titleBase) : { absolute: title },
    description,
    alternates: {
      canonical: canon,
      languages: hreflangDe(`/cursos/${slug}`),
    },
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

  const courseJsonLd = getCourseJsonLd(course, "publico", pais);
  const cobro = resolverCobro(pais);
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
      seo
        ? {
            "@type": "FAQPage",
            mainEntity: seo.faqs.map((faq) => ({
              "@type": "Question",
              name: localizarMercado(faq.q, pais),
              acceptedAnswer: { "@type": "Answer", text: localizarMercado(faq.a, pais) },
            })),
          }
        : null,
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
        course={course}
        initialSchedules={schedules}
        initialView={para === "empresas" ? "empresas" : "publico"}
        initialLevelName={nivel}
        cobroLocal={cobro.modo === "local" || cobro.modo === "usd-chile"}
      />
    </>
  );
}
