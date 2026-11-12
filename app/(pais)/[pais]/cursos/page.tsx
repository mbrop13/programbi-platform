import type { Metadata } from "next";
import { esIsoPais, ISO_CHILE } from "@/config/paises";
import { getContenidoPais, getSeoBloque } from "@/lib/data/contenido-paises";
import { metadataLocal } from "@/lib/paises/metadata";
import { aplicarSeoLocal } from "@/lib/paises/contenido-local/seo";
import { PAGE_SEO } from "@/lib/seo/money";

export const revalidate = 86400;

export { default } from "../../../(marketing)/cursos/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const seo = getSeoBloque(pais, "cursos") ?? getContenidoPais(pais)?.seoPaginas.cursos;
  return aplicarSeoLocal(
    metadataLocal({
      pais,
      path: "/cursos",
      title: seo?.title ?? PAGE_SEO.cursos.title,
      description: seo?.description ?? PAGE_SEO.cursos.description,
    }),
    pais,
    "cursos"
  );
}
