import type { Metadata } from "next";
import { esIndexable, getPais, normalizarPais } from "@/config/paises";
import { absoluteUrl, pageOg } from "@/lib/seo";
import { hreflangDe, localeOg, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";

/**
 * Meta robots de la versión por país.
 * Solo Chile (raíz), Argentina, México, Perú, Colombia y Uruguay se indexan.
 * Los demás países quedan en noindex, follow: el enlace se sigue, la página no.
 */
export function robotsLocal(iso: string | null | undefined) {
  return {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  } as const;
}

export function metadataLocal(opts: {
  pais: string | null | undefined;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const iso = normalizarPais(opts.pais);
  const indexable = esIndexable(iso);
  const title = localizarMercado(opts.title, iso);
  const description = localizarMercado(opts.description, iso);
  const canonical = absoluteUrl(rutaLocal(iso, opts.path));
  // Tarjeta de compartir propia de cada mercado: la del Chile no sirve para México.
  const share = pageOg({
    title,
    description,
    path: rutaLocal(iso, opts.path),
    kicker: `Cursos en vivo · ${getPais(iso).nombre}`,
    tags: ["Power BI", "Análisis de datos", getPais(iso).nombre],
    alt: title,
  });
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      // Los países que no se indexan no entran en el juego de hreflang.
      ...(indexable ? { languages: hreflangDe(opts.path) } : {}),
    },
    // Sin `robots` se hereda el del layout raíz (index, follow).
    ...(indexable ? {} : { robots: robotsLocal(iso) }),
    openGraph: {
      title,
      description,
      url: canonical,
      locale: localeOg(iso),
      type: "website",
      siteName: "ProgramBI",
      images: share.images,
    },
    twitter: share.twitter,
  };
}

export function nombrePais(iso: string | null | undefined): string {
  return getPais(normalizarPais(iso)).nombre;
}
