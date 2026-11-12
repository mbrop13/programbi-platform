import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { getSeoBloque } from "@/lib/data/contenido-paises";
import { metadataLocal } from "@/lib/paises/metadata";
import { aplicarSeoLocal, getSeoLocal } from "@/lib/paises/contenido-local/seo";
import { PAGE_SEO } from "@/lib/seo/money";

export { default } from "../../../(marketing)/empresas/page";

// ISR también para la versión por país (el layout de [pais] ya fija
// generateStaticParams y revalidate; esto fija el intervalo de la página).
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const seo = getSeoBloque(pais, "empresas") ?? getSeoLocal(pais, "empresas");
  return aplicarSeoLocal(
    metadataLocal({
      pais,
      path: "/empresas",
      title: seo?.title ?? PAGE_SEO.empresas.title,
      description: seo?.description ?? PAGE_SEO.empresas.description,
    }),
    pais,
    "empresas"
  );
}
