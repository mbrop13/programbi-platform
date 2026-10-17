import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { metadataLocal } from "@/lib/paises/metadata";

const path = "/migrar-excel-a-power-bi";
const title = "Migrar Excel a Power BI Chile | Control de gestión";
const description =
  "Migrar Excel a Power BI en Chile: tableros para control de gestión y capacitación del equipo. Cotiza in-company o el curso abierto.";

export { default } from "../../migrar-excel-a-power-bi/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  return metadataLocal({ pais, path, title, description });
}
