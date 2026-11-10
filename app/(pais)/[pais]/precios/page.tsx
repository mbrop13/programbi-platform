import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { metadataLocal } from "@/lib/paises/metadata";
import { aplicarSeoLocal, getSeoLocal } from "@/lib/paises/contenido-local/seo";

export const revalidate = 3600;

const title = "Precios de cursos en vivo en Chile | ProgramBI";
const description =
  "Precios publicados por curso en Chile: duración, qué incluye, medios de pago y preguntas frecuentes.";

export { default } from "../../../(marketing)/precios/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const seo = getSeoLocal(pais, "precios");
  return aplicarSeoLocal(
    metadataLocal({ pais, path: "/precios", title, description }),
    pais,
    "precios"
  );
}
