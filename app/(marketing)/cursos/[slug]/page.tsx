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

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ para?: string | string[]; nivel?: string | string[] }>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Curso no encontrado" };

  const seo = COURSE_SEO[slug];
  const title = seo?.title ?? `${course.title} — Curso en vivo Chile`;
  const dbDescription = await getMarketingDescription(slug);
  const description = seo?.description || dbDescription || course.description;

  // Tarjeta OG de marca (tipográfica, papel-monócromo) — reemplaza las
  // portadas remotas de estilo antiguo.
  const shareImage = ogImageUrl({
    kicker: "Curso en vivo Chile",
    title: seo?.h1 || course.title,
    description,
    tags: course.techStack,
    accent: course.accentColor,
    path: `cursos/${slug}`,
  });

  return {
    title: seo?.title ? { absolute: seo.title } : title,
    description,
    alternates: {
      canonical: absoluteUrl(`/cursos/${slug}`),
    },
    openGraph: {
      title: seo?.title ?? `${title} | ProgramBI`,
      description,
      url: absoluteUrl(`/cursos/${slug}`),
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
      title: seo?.title ?? `${title} | ProgramBI`,
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
  const { slug } = await params;
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

  const courseJsonLd = getCourseJsonLd(course);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      courseJsonLd,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Cursos", item: absoluteUrl("/cursos") },
          {
            "@type": "ListItem",
            position: 3,
            name: seo?.h1 || course.title,
            item: absoluteUrl(`/cursos/${slug}`),
          },
        ],
      },
      seo
        ? {
            "@type": "FAQPage",
            mainEntity: seo.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
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
      />
    </>
  );
}
