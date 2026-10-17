import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { metadataLocal } from "@/lib/paises/metadata";

const path = "/implementacion-power-bi";
const title = "Implementación Power BI Chile | ProgramBI";
const description =
  "Implementación Power BI en Chile para control de gestión: dashboards, capacitación in-company y acompañamiento. Diagnóstico por WhatsApp.";

export { default } from "../../implementacion-power-bi/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  return metadataLocal({ pais, path, title, description });
}
