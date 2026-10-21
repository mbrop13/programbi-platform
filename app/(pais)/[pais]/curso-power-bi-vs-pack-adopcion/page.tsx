import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { metadataLocal } from "@/lib/paises/metadata";
import { GUIDE_SEO } from "@/lib/seo/money";

const copy = GUIDE_SEO["curso-power-bi-vs-pack-adopcion"];

export { default } from "../../../(marketing)/curso-power-bi-vs-pack-adopcion/page";

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
