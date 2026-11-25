import { readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  CarreraPe,
  DatasetCarrerasPe,
  MetaCarrerasPe,
  NivelCarreraPe,
  ResumenCarrerasPe,
} from "./types";

export * from "./types";

const DATA_PATH = join(process.cwd(), "data", "pe", "carreras", "carreras-pe.json");

let cacheDataset: DatasetCarrerasPe | null = null;
let cacheBySlug: Map<string, CarreraPe> | null = null;

function cargarDataset(): DatasetCarrerasPe {
  if (!cacheDataset) {
    cacheDataset = JSON.parse(readFileSync(DATA_PATH, "utf8")) as DatasetCarrerasPe;
    cacheBySlug = new Map(cacheDataset.carreras.map((c) => [c.slug, c]));
  }
  return cacheDataset;
}

export function getMetaCarrerasPe(): MetaCarrerasPe {
  return cargarDataset().meta;
}

export function getResumenCarrerasPe(): ResumenCarrerasPe {
  return cargarDataset().resumen;
}

export function getCarrerasPe(): CarreraPe[] {
  return cargarDataset().carreras;
}

export function getCarreraPe(slug: string): CarreraPe | null {
  cargarDataset();
  return cacheBySlug?.get(slug) ?? null;
}

export function getCarrerasPePorTipo(tipo: NivelCarreraPe): CarreraPe[] {
  return getCarrerasPe()
    .filter((c) => c.tipo === tipo)
    .sort((a, b) => a.rankNivel - b.rankNivel);
}

export function getCarreraHermanaPe(carrera: CarreraPe): CarreraPe | null {
  if (!carrera.slugHermana) return null;
  return getCarreraPe(carrera.slugHermana);
}
