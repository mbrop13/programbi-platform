import catalogo from "./regiones-catalogo.json";

export type Region = (typeof catalogo)[number];
export const REGIONES: readonly Region[] = catalogo;
export const NACIONAL = "nacional";
export const RUTA_DESEMPLEO = "/datos/desempleo";

export function buscarRegion(slug: string) {
  return REGIONES.find((region) => region.slug === slug);
}

export function rutaTerritorio(slug: string) {
  return slug === NACIONAL ? RUTA_DESEMPLEO : `${RUTA_DESEMPLEO}/${slug}`;
}

export function nombreTerritorio(slug: string) {
  return buscarRegion(slug)?.nombre ?? "Chile";
}
