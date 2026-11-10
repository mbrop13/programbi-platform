import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { getContenidoPais, getSeoBloque } from "@/lib/data/contenido-paises";
import { metadataLocal } from "@/lib/paises/metadata";
import { PAGE_SEO } from "@/lib/seo/money";

export const revalidate = 3600;

/**
 * La home del país reexporta la de marketing. El índice completo de fichas y
 * guías del mercado lo aporta `IndicePais` dentro de esa página, con el `pais`
 * que llega por params; aquí solo se cambian los metadatos.
 */
export { default } from "../../(marketing)/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const contenido = getContenidoPais(pais);
  const seo = getSeoBloque(pais, "hub");
  return metadataLocal({
    pais,
    path: "/",
    title: seo?.title ?? contenido?.seo.title ?? PAGE_SEO.home.title,
    description: seo?.description ?? contenido?.seo.description ?? PAGE_SEO.home.description,
  });
}
