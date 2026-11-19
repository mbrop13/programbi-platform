import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { getContenidoPais } from "@/lib/data/contenido-paises";
import { metadataLocal } from "@/lib/paises/metadata";

const title = "Sobre nosotros — Academia de análisis de datos";
const description =
  "Conoce ProgramBI: academia de cursos en vivo de Power BI, SQL, Python y análisis de datos en Chile y Latinoamérica, fundada por Manuel Oliva.";

function normalizarDescripcionNosotros(texto: string | undefined): string {
  if (!texto) return description;
  if (texto.length >= 120 && texto.length <= 155) return texto;
  const ampliada = texto
    .replace("las clases en horario", "las clases en vivo en horario")
    .replace("en el campus.", "en el campus virtual.");
  if (ampliada.length >= 120 && ampliada.length <= 155) return ampliada;
  return description;
}

export { default } from "../../../(marketing)/nosotros/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const seo = getContenidoPais(pais)?.seoPaginas.nosotros;
  return metadataLocal({
    pais,
    path: "/nosotros",
    title: seo?.title ?? title,
    description: normalizarDescripcionNosotros(seo?.description),
  });
}
