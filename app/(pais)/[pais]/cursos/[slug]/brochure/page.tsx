import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBrochureData } from "@/lib/brochure/brochure-data";
import { CourseBrochureClient } from "@/components/brochure/CourseBrochureClient";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import {
  esIsoPais,
  ISO_CHILE,
  normalizarPais,
  PAISES_CARPETA,
} from "@/config/paises";

export const revalidate = 86400;
export const dynamicParams = false;

type Params = Promise<{ pais: string; slug: string }>;

/**
 * Temario y precios del curso con carpeta de país (`/pe/cursos/<slug>/brochure`).
 *
 * El país sale solo de la ruta. El antiguo `?pais=` ya no se lee: antes podía
 * mandar sobre el segmento y eso obligaba a renderizar en cada visita.
 *
 * Se generan los mismos pares país × curso que hoy responden 200: las carpetas
 * publicadas (`PAISES_CARPETA`, la misma lista que usa el layout de `(pais)`)
 * por los slugs del catálogo. Con `dynamicParams = false`, cualquier otra
 * combinación da 404 estático.
 */
export function generateStaticParams(): { pais: string; slug: string }[] {
  return PAISES_CARPETA.flatMap((pais) =>
    courses.map((course) => ({ pais: pais.iso, slug: course.slug }))
  );
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

export default async function CourseBrochurePaisPage({
  params,
}: {
  params: Params;
}) {
  const { pais: segmento, slug } = await params;
  // Misma condición que el layout de `(pais)`: Chile vive en la raíz.
  if (!esIsoPais(segmento) || segmento === ISO_CHILE) notFound();

  const data = await getCourseBrochureData(slug, normalizarPais(segmento));
  if (!data) notFound();

  return <CourseBrochureClient data={data} />;
}
