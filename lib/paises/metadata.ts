import type { Metadata } from "next";
import { esIndexable, getPais, normalizarPais } from "@/config/paises";
import { absoluteUrl, pageOg, tituloLocal } from "@/lib/seo";
import { hreflangDe, localeOg, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";

/**
 * Nombre que cabe en un <title>. Los países con nombre largo usan su forma
 * corta habitual; el resto, el nombre oficial de la config.
 */
const NOMBRE_TITULO: Record<string, string> = {
  do: "Rep. Dominicana",
};

function nombreParaTitulo(iso: string): string {
  return NOMBRE_TITULO[iso] || getPais(iso).nombre;
}

/** Agrega el país al título cuando no lo trae, antes de recortar a 60. */
function conPais(texto: string, iso: string, max: number = 60): string {
  if (iso === "cl") return texto;
  const nombre = getPais(iso).nombre;
  const corto = nombreParaTitulo(iso);
  if (texto.includes(nombre) || texto.includes(corto)) return texto;
  const base = texto.replace(/ \| ProgramBI$/i, "");
  const sufijo = ` en ${corto}`;
  const completo = `${base}${sufijo}`;
  if (completo.length <= max) return completo;

  // Si no cabe, se acorta la parte larga (no el país) y se quitan conectores
  // que quedarían colgando («… Soporte y en Bolivia»).
  const disponible = Math.max(1, max - sufijo.length);
  let corte = base.slice(0, disponible).trim();
  const ultimoEspacio = corte.lastIndexOf(" ");
  if (ultimoEspacio > 0) corte = corte.slice(0, ultimoEspacio);
  corte = corte
    .replace(/[\s:;,.|\-–—]+$/, "")
    .replace(/\s+(y|e|o|u|de|del|en|para|con|la|el|los|las)$/i, "")
    .trim();
  return `${corte}${sufijo}`;
}

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
  /**
   * Fuerza `noindex, follow` aunque el país sea indexable. Aditivo: por
   * defecto manda `esIndexable(iso)`. Lo usan las variantes por país que
   * duplican una página nacional y no deben competir con ella (test de nivel).
   */
  forzarNoindex?: boolean;
  /**
   * Omite `alternates.languages`. Aditivo: por defecto se emite el hreflang
   * recíproco de los países indexables. Se usa cuando las variantes por país
   * de la ruta quedan en noindex y no deben recibir ni emitir hreflang.
   */
  sinHreflang?: boolean;
}): Metadata {
  const iso = normalizarPais(opts.pais);
  const indexable = !opts.forzarNoindex && esIndexable(iso);
  const title = tituloLocal(conPais(localizarMercado(opts.title, iso), iso));
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
      ...(indexable && !opts.sinHreflang ? { languages: hreflangDe(opts.path) } : {}),
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
