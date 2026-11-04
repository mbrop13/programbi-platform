import type { Metadata } from "next";
import type { ComparativaAcademia } from "@/lib/data/comparativas";
import { absoluteUrl, pageOg, tituloLocal } from "@/lib/seo";

/** Metadata compartida por las comparativas (canonical propio y OG por ruta). */
export function metadataComparativa(
  contenido: ComparativaAcademia,
  languages?: Record<string, string>,
): Metadata {
  const canonical = absoluteUrl(contenido.ruta);
  const share = pageOg({
    title: contenido.seoTitle,
    description: contenido.seoDescription,
    path: contenido.ruta,
    kicker: "Comparativa",
    tags: ["Power BI", contenido.rival],
    alt: contenido.h1,
  });

  return {
    title: { absolute: tituloLocal(contenido.seoTitle) },
    description: contenido.seoDescription,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title: contenido.seoTitle,
      description: contenido.seoDescription,
      url: canonical,
      type: "website",
      locale: contenido.idioma.replace("-", "_"),
      siteName: "ProgramBI",
      images: share.images,
    },
    twitter: share.twitter,
  };
}
