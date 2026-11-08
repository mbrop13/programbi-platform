import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBrochureData } from "@/lib/brochure/brochure-data";
import { CourseBrochureClient } from "@/components/brochure/CourseBrochureClient";
import { getCourseBySlug } from "@/lib/data/courses";
import { esIsoPais, ISO_CHILE } from "@/config/paises";

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ pais?: string | string[] }>;

function primerValor(valor: string | string[] | undefined): string | undefined {
  const crudo = Array.isArray(valor) ? valor[0] : valor;
  return crudo?.trim().toLowerCase() || undefined;
}

/**
 * Brochure del curso (versión Chile / raíz).
 * El país sale del query `?pais=` cuando es válido; si no, Chile.
 */
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Brochure no encontrado | ProgramBI" };

  const titulo = `Brochure ${course.title} — Precios y temario | ProgramBI`;
  return {
    title: { absolute: titulo },
    description: `${course.title}: precios en tu moneda, 3 cuotas sin interés, fechas, equipo docente y temario completo. Brochure oficial de ProgramBI.`,
    robots: { index: false, follow: true },
    openGraph: { title: titulo, type: "article" },
  };
}

export default async function CourseBrochurePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const paisQuery = primerValor(query.pais);
  const pais = paisQuery && esIsoPais(paisQuery) ? paisQuery : ISO_CHILE;

  const data = await getCourseBrochureData(slug, pais);
  if (!data) notFound();

  return <CourseBrochureClient data={data} />;
}
