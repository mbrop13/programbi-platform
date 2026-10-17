import type { Metadata } from "next";
import { getPais, normalizarPais } from "@/config/paises";
import { absoluteUrl } from "@/lib/seo";
import { hreflangDe, localeOg, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";

export function metadataLocal(opts: {
  pais: string | null | undefined;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const iso = normalizarPais(opts.pais);
  const title = localizarMercado(opts.title, iso);
  const description = localizarMercado(opts.description, iso);
  const canonical = absoluteUrl(rutaLocal(iso, opts.path));
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: hreflangDe(opts.path),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: localeOg(iso),
      type: "website",
      siteName: "ProgramBI",
    },
  };
}

export function nombrePais(iso: string | null | undefined): string {
  return getPais(normalizarPais(iso)).nombre;
}
