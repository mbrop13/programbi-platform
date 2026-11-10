import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBrochureData } from "@/lib/brochure/brochure-data";
import { CourseBrochureClient } from "@/components/brochure/CourseBrochureClient";
import { getCourseBySlug } from "@/lib/data/courses";
import { esIsoPais, ISO_CHILE, normalizarPais } from "@/config/paises";

export const revalidate = 3600;

type Params = Promise<{ pais: string; slug: string }>;
type SearchParams = Promise<{ pais?: string | string[] }>;

function primerValor(valor: string | string[] | undefined): string | undefined {
  const crudo = Array.isArray(valor) ? valor[0] : valor;
  return crudo?.trim().toLowerCase() || undefined;
}

/**
 * Temario y precios del curso con carpeta de país (`/pe/cursos/<slug>/brochure`).
 * El query `?pais=` válido manda sobre el segmento; si no viene, manda la ruta.
 */
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
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { pais: segmento, slug } = await params;
  const query = await searchParams;
  const paisQuery = primerValor(query.pais);
  const pais =
    paisQuery && esIsoPais(paisQuery)
      ? paisQuery
      : esIsoPais(segmento)
        ? normalizarPais(segmento)
        : ISO_CHILE;

  const data = await getCourseBrochureData(slug, pais);
  if (!data) notFound();

  return <CourseBrochureClient data={data} />;
}
