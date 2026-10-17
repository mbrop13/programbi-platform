import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { metadataLocal } from "@/lib/paises/metadata";
import { GUIDE_SEO } from "@/lib/seo/money";

const copy = GUIDE_SEO["por-que-fallan-proyectos-power-bi"];

export { default } from "../../por-que-fallan-proyectos-power-bi/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  return metadataLocal({
    pais,
    path: copy.path,
    title: copy.title,
    description: copy.description,
  });
}
