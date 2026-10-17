import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { metadataLocal } from "@/lib/paises/metadata";
import { PAGE_SEO } from "@/lib/seo/money";

export const revalidate = 3600;

export { default } from "../page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  return metadataLocal({
    pais,
    path: "/",
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
  });
}
