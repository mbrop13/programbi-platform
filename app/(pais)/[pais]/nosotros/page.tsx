import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { metadataLocal } from "@/lib/paises/metadata";

const title = "Sobre nosotros — Academia de análisis de datos";
const description =
  "Conoce ProgramBI: la institución de capacitación profesional líder en Power BI, SQL, Python y Machine Learning en Chile y Latinoamérica. Fundada por Manuel Oliva.";

export { default } from "../../../(marketing)/nosotros/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  return metadataLocal({ pais, path: "/nosotros", title, description });
}
