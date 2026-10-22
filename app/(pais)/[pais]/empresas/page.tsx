import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { metadataLocal } from "@/lib/paises/metadata";
import { PAGE_SEO } from "@/lib/seo/money";

export { default } from "../../../(marketing)/empresas/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  return metadataLocal({
    pais,
    path: "/empresas",
    title: PAGE_SEO.empresas.title,
    description: PAGE_SEO.empresas.description,
  });
}
