import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { metadataLocal } from "@/lib/paises/metadata";

const title = "Preguntas frecuentes — Soporte y consultas";
const description =
  "Resuelve tus dudas sobre los cursos de análisis de datos en vivo, metodologías, grabaciones de clases, certificados oficiales y asesorías corporativas de ProgramBI.";

export { default } from "../../../(marketing)/faq/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  return metadataLocal({ pais, path: "/faq", title, description });
}
