import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import meta from "@/data/desempleo/meta.json";
import rankingJson from "@/data/desempleo/ranking.json";
import { NACIONAL, REGIONES, buscarRegion, rutaTerritorio } from "./regiones";
import { claveRevisionDesempleo } from "./revision-desempleo";

export type Nota = "a" | "b";
export type Observacion = {
  p: string;
  tasa: number;
  tasa_ocup: number;
  tasa_part: number;
  ft: number;
  ocu: number;
  des: number;
  notas: Partial<Record<string, Nota>>;
};

export type Hito = Pick<Observacion, "p" | "tasa">;

export type Indicadores = {
  slug: string;
  nombre: string;
  tasa: number;
  anterior_pp: number | null;
  yoy_pp: number | null;
  rank_mismo_trimestre: number;
  anterior_mismo_trimestre?: Hito | null;
  vs_chile_pp?: number;
  maximo: Hito;
  minimo: Hito;
};

export const METADATOS = meta;
export const REVISION_DESEMPLEO = claveRevisionDesempleo(process.cwd(), meta.ine_fecha_actualizacion);
export const FUENTE_ENE = "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral/ocupacion-y-desocupacion";
export const LICENCIA = "https://creativecommons.org/licenses/by-sa/4.0/";
export const TERMINOS_INE = "https://www.ine.gob.cl/terminos-de-uso-y-licencia-de-datos-abiertos";
export const CARTOGRAFIA = "https://www.bcn.cl/siit/mapas_vectoriales";
export const PERIODO_ACTUAL = meta.ultimo_periodo.codigo;
export const FECHA_EDICION = meta.fetched_at.slice(0, 10);
export const RANKING = (rankingJson as Indicadores[]).filter((item) => item.slug !== NACIONAL)
  .sort((a, b) => b.tasa - a.tasa);

const series = new Map<string, Observacion[]>();

export function serieTerritorio(slug: string) {
  const existente = series.get(slug);
  if (existente) return existente;
  if (slug !== NACIONAL && !buscarRegion(slug)) return [];
  const archivo = slug === NACIONAL ? "nacional.json" : join("regiones", `${slug}.json`);
  const ubicacion = join(process.cwd(), "data", "desempleo", archivo);
  if (!existsSync(ubicacion)) return [];
  const datos = JSON.parse(readFileSync(ubicacion, "utf8")) as Observacion[];
  series.set(slug, datos);
  return datos;
}

export function datosTerritorio(slug: string) {
  const serie = serieTerritorio(slug);
  const actual = serie.at(-1);
  const indicadores = (rankingJson as Indicadores[]).find((item) => item.slug === slug);
  return actual && indicadores ? { serie, actual, indicadores, haceUnAno: serie.at(-13) } : null;
}

export function regionesPublicables() {
  return REGIONES.filter(({ slug }) => {
    const datos = datosTerritorio(slug);
    return datos && datos.serie.length >= 13 && datos.actual.p === PERIODO_ACTUAL;
  });
}

export function rutasObservatorio() {
  return ["/datos", rutaTerritorio(NACIONAL), ...regionesPublicables().map(({ slug }) => rutaTerritorio(slug))];
}

export function hayPbix() {
  return existsSync(join(process.cwd(), "public", "datos", "desempleo", "observatorio-desempleo.pbix"));
}
