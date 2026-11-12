import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBrochureData } from "@/lib/brochure/brochure-data";
import { CourseBrochureClient } from "@/components/brochure/CourseBrochureClient";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import { ISO_CHILE } from "@/config/paises";

export const revalidate = 86400;
export const dynamicParams = false;

type Params = Promise<{ slug: string }>;

/**
 * Temario y precios del curso (versión Chile / raíz).
 *
 * El país sale solo de la ruta: la raíz es Chile y `/<pais>/cursos/<slug>/brochure`
 * es ese país. El antiguo `?pais=` ya no se lee, así que la página deja de
 * depender de `searchParams` y puede servirse desde caché (ISR).
 *
 * Solo se generan los slugs del catálogo; el resto da 404 estático
 * (`dynamicParams = false`), igual que la ficha del curso.
 */
export function generateStaticParams(): { slug: string }[] {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Temario no encontrado | ProgramBI" };

  const titulo = `Temario y precios: ${course.title} | ProgramBI`;
  return {
    title: { absolute: titulo },
    description: `${course.title}: temario completo, precios en tu moneda, 3 cuotas sin interés, fechas y equipo docente.`,
    robots: { index: false, follow: true },
    openGraph: { title: titulo, type: "article" },
  };
}

export default async function CourseBrochurePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const data = await getCourseBrochureData(slug, ISO_CHILE);
  if (!data) notFound();

  return <CourseBrochureClient data={data} />;
}
