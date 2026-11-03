import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { getContenidoPais } from "@/lib/data/contenido-paises";
import { metadataLocal } from "@/lib/paises/metadata";
import { GUIDE_SEO } from "@/lib/seo/money";

const copy = GUIDE_SEO["por-que-fallan-proyectos-power-bi"];

export { default } from "../../../(marketing)/por-que-fallan-proyectos-power-bi/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const seo = getContenidoPais(pais)?.seoPaginas.porQueFallan;
  return metadataLocal({
    pais,
    path: copy.path,
    title: seo?.title ?? copy.title,
    description: seo?.description ?? copy.description,
  });
}
