import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailClient from "@/app/(marketing)/cursos/[slug]/CourseDetailClient";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import { coursePath, empresaMetaTitle, isTieredCourse } from "@/lib/data/course-views";
import type { CourseSchedule } from "@/lib/data/course-schedules";
import { getActiveSchedules } from "@/lib/supabase/comunidad-ai";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Curso no encontrado" };

  const title = empresaMetaTitle(course.title);
  const description = isTieredCourse(course)
    ? `Cotiza ${course.title} para tu equipo: niveles básico, intermedio y avanzado, en vivo por Zoom.`
    : `Cotiza ${course.title} para tu equipo. Capacitación en vivo por Zoom.`;
  const path = coursePath(slug, "empresas");
  const shareImage = ogImageUrl({
    kicker: "Para empresas",
    title: course.title,
    description,
    tags: course.techStack,
    accent: course.accentColor,
    path: `cursos/${slug}/empresas`,
  });

  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website",
      images: [{ url: shareImage, width: 1200, height: 630, alt: `${course.title} para empresas` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export default async function EmpresaCoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const schedules = (await getActiveSchedules()) as CourseSchedule[];
  const path = coursePath(slug, "empresas");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Cursos", item: absoluteUrl("/cursos") },
      { "@type": "ListItem", position: 3, name: course.title, item: absoluteUrl(`/cursos/${slug}`) },
      { "@type": "ListItem", position: 4, name: "Empresas", item: absoluteUrl(path) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <CourseDetailClient
        key={`${course.slug}-empresas`}
        course={course}
        initialSchedules={schedules}
        view="empresas"
      />
    </>
  );
}
