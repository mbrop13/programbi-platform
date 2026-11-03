import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { getContenidoPais } from "@/lib/data/contenido-paises";
import { metadataLocal } from "@/lib/paises/metadata";
import { PAGE_SEO } from "@/lib/seo/money";

export const revalidate = 3600;

export { default } from "../../../(marketing)/cursos/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const seo = getContenidoPais(pais)?.seoPaginas.cursos;
  return metadataLocal({
    pais,
    path: "/cursos",
    title: seo?.title ?? PAGE_SEO.cursos.title,
    description: seo?.description ?? PAGE_SEO.cursos.description,
  });
}
