import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailClient from "@/app/(marketing)/cursos/[slug]/CourseDetailClient";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import {
  advancedHeading,
  advancedMetaTitle,
  coursePath,
  isTieredCourse,
  levelIntro,
} from "@/lib/data/course-views";
import type { CourseSchedule } from "@/lib/data/course-schedules";
import { getActiveSchedules } from "@/lib/supabase/comunidad-ai";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";
import { getCourseJsonLd } from "@/lib/seo/course-jsonld";
import { COURSE_SEO } from "@/lib/seo/money";

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

function clip(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const last = cut.lastIndexOf(" ");
  return `${(last > 80 ? cut.slice(0, last) : cut).trimEnd()}…`;
}

export function generateStaticParams() {
  return courses.filter((course) => isTieredCourse(course)).map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || !isTieredCourse(course)) return { title: "Curso no encontrado" };

  const title = advancedMetaTitle(course.title);
  const intro = levelIntro(course, "Avanzado");
  const description = clip(
    intro
      ? `${course.title} avanzado, en vivo por Zoom. ${intro}`
      : `${course.title} avanzado, en vivo por Zoom, con certificado al completar.`
  );
  const heading = advancedHeading(COURSE_SEO[slug]?.h1 || course.title);
  const path = coursePath(slug, "avanzado");
  const shareImage = ogImageUrl({
    kicker: "Curso avanzado",
    title: heading,
    description,
    tags: course.techStack,
    accent: course.accentColor,
    path: `cursos/${slug}/avanzado`,
  });

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website",
      images: [{ url: shareImage, width: 1200, height: 630, alt: heading }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export default async function AdvancedCoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || !isTieredCourse(course)) notFound();

  const schedules = (await getActiveSchedules()) as CourseSchedule[];
  const heading = advancedHeading(COURSE_SEO[slug]?.h1 || course.title);
  const path = coursePath(slug, "avanzado");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      getCourseJsonLd(course, "avanzado"),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Cursos", item: absoluteUrl("/cursos") },
          { "@type": "ListItem", position: 3, name: course.title, item: absoluteUrl(`/cursos/${slug}`) },
          { "@type": "ListItem", position: 4, name: heading, item: absoluteUrl(path) },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <CourseDetailClient
        key={`${course.slug}-avanzado`}
        course={course}
        initialSchedules={schedules}
        view="avanzado"
      />
    </>
  );
}
