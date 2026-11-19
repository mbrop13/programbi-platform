import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  TIPO_ORDEN,
  type CarreraRecord,
  type CarreraTipoData,
  type InstitucionCarrera,
  type MetaCarreras,
  type ProgramaCarrera,
  type RankingItem,
  type TipoIesKey,
} from "./carreras-tipos";

export * from "./carreras-tipos";

const DATA_DIR = join(process.cwd(), "data", "carreras");

let cacheMeta: MetaCarreras | null = null;
let cacheCarreras: CarreraRecord[] | null = null;
let cacheCarrerasMap: Map<string, CarreraRecord> | null = null;
let cacheRanking: RankingItem[] | null = null;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function getMetaCarreras(): MetaCarreras {
  if (!cacheMeta) {
    cacheMeta = readJson<MetaCarreras>(join(DATA_DIR, "meta.json"));
  }
  return cacheMeta;
}

export function getCarreras(): CarreraRecord[] {
  if (!cacheCarreras) {
    cacheCarreras = readJson<CarreraRecord[]>(join(DATA_DIR, "carreras.json"));
    cacheCarrerasMap = new Map(cacheCarreras.map((c) => [c.slug, c]));
  }
  return cacheCarreras;
}

export function getCarrera(slug: string): CarreraRecord | null {
  getCarreras();
  return cacheCarrerasMap?.get(slug) ?? null;
}

export function getRankingCarreras(): RankingItem[] {
  if (!cacheRanking) {
    cacheRanking = readJson<RankingItem[]>(join(DATA_DIR, "ranking.json"));
  }
  return cacheRanking;
}

export function getInstitucionesCarrera(slug: string): InstitucionCarrera[] {
  const file = join(DATA_DIR, "instituciones", `${slug}.json`);
  if (!existsSync(file)) return [];
  return readJson<InstitucionCarrera[]>(file);
}

export function getProgramasCarrera(slug: string): ProgramaCarrera[] {
  const file = join(DATA_DIR, "programas", `${slug}.json`);
  if (!existsSync(file)) return [];
  return readJson<ProgramaCarrera[]>(file);
}

/** Devuelve el tipo de institución principal (prioridad U -> IP -> CFT, o el primero con ingreso al 4.º año). */
export function tipoPrincipalDeCarrera(carrera: CarreraRecord): { key: TipoIesKey; data: CarreraTipoData } | null {
  const disponibles = TIPO_ORDEN.filter((k) => Boolean(carrera.tipos[k]));
  if (disponibles.length === 0) return null;
  const conIngYEmp = disponibles.find((k) => {
    const t = carrera.tipos[k];
    return t && t.ing[3] !== null && t.emp1 !== null;
  });
  const elegido = conIngYEmp ?? disponibles[0];
  const data = carrera.tipos[elegido];
  return data ? { key: elegido, data } : null;
}

/**
 * Regla anti-thin (§5.2): indexable solo si tiene ingreso 4.º año + empleabilidad 1.er año
 * + al menos 3 bloques más con datos (curva ingresos, percentiles, evolución, instituciones, oferta, perfil).
 */
export function esFichaIndexable(carrera: CarreraRecord): boolean {
  const tipos = TIPO_ORDEN.map((k) => carrera.tipos[k]).filter((t): t is CarreraTipoData => Boolean(t));
  const tienePrincipales = tipos.some((t) => t.ing[3] !== null && t.emp1 !== null);
  if (!tienePrincipales) return false;

  let bloques = 0;
  if (tipos.some((t) => t.ing.filter((x) => x !== null).length >= 3)) bloques++;
  if (tipos.some((t) => t.pct.p10_5 !== null && t.pct.p90_5 !== null)) bloques++;
  if (tipos.some((t) => Object.values(t.evol_ing4).some((v) => v !== null))) bloques++;
  if (getInstitucionesCarrera(carrera.slug).length > 0) bloques++;
  if ((carrera.oferta?.programas ?? 0) > 0) bloques++;
  if (tipos.some((t) => t.titulados.t !== null)) bloques++;

  return bloques >= 3;
}

/** Mediana simple de un arreglo numérico. */
export function mediana(valores: number[]): number | null {
  if (valores.length === 0) return null;
  const ordenados = [...valores].sort((a, b) => a - b);
  const mid = Math.floor(ordenados.length / 2);
  return ordenados.length % 2 === 0
    ? Math.round((ordenados[mid - 1] + ordenados[mid]) / 2)
    : ordenados[mid];
}

export function areasUnicas(): string[] {
  return [...new Set(getCarreras().map((c) => c.area))].sort((a, b) => a.localeCompare(b, "es"));
}

export function regionesUnicas(): string[] {
  const set = new Set<string>();
  for (const r of getRankingCarreras()) {
    for (const reg of r.regiones) set.add(reg);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "es"));
}
