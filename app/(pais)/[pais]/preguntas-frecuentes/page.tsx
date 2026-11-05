import type { Metadata } from "next";
import { PAISES_CARPETA, esIsoPais, getPais, ISO_CHILE } from "@/config/paises";
import { metadataLocal } from "@/lib/paises/metadata";

/**
 * Versión por país de las preguntas frecuentes. Reutiliza la página de Chile:
 * el contenido y el TSX son los mismos, cambian los precios, la hora local y
 * el canonical. Los países no indexables heredan noindex, follow.
 */
export const revalidate = 3600;
export const dynamicParams = false;

type Params = { pais: string };

/** Solo las carpetas de país: Chile vive en /preguntas-frecuentes. */
export function generateStaticParams(): Params[] {
  return PAISES_CARPETA.map((pais) => ({ pais: pais.iso }));
}

const title = "Preguntas frecuentes: cursos, clases y pagos";

function descripcion(nombre: string): string {
  return `Respuestas sobre los cursos de ProgramBI en ${nombre}: clases en vivo por Zoom, grabaciones de por vida, horario local, precios en moneda local, cuotas, requisitos y certificado.`;
}

export { default } from "../../../(marketing)/preguntas-frecuentes/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  return metadataLocal({
    pais,
    path: "/preguntas-frecuentes",
    title,
    description: descripcion(getPais(pais).nombre),
  });
}
