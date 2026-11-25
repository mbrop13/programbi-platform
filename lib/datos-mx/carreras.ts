import rawCarreras from "@/data/mx/carreras-imco-2026.json";
import type {
  CarreraMxRecord,
  CarrerasImcoDataset,
  CarrerasImcoMeta,
} from "./types";

const DATASET = rawCarreras as CarrerasImcoDataset;

const PUBLICABLES_ORDENADAS: readonly CarreraMxRecord[] = [...DATASET.carreras]
  .filter((c) => c.publicable && c.posicionIngreso !== null)
  .sort((a, b) => (a.posicionIngreso ?? 999) - (b.posicionIngreso ?? 999));

const POR_SLUG = new Map<string, CarreraMxRecord>(
  PUBLICABLES_ORDENADAS.map((c) => [c.slug, c])
);

export function getMetaCarrerasMx(): CarrerasImcoMeta {
  return DATASET.meta;
}

export function getTodasLasCarrerasMx(): readonly CarreraMxRecord[] {
  return DATASET.carreras;
}

export function getCarrerasPublicablesMx(): readonly CarreraMxRecord[] {
  return PUBLICABLES_ORDENADAS;
}

export function getCarrerasExcluidasMx(): readonly CarreraMxRecord[] {
  return DATASET.carreras.filter((c) => !c.publicable);
}

export function getCarreraMxPorSlug(slug: string): CarreraMxRecord | undefined {
  return POR_SLUG.get(slug);
}

export function getCarreraMxPorClave(
  cveCarrera: string,
  soloPublicables = true
): CarreraMxRecord | undefined {
  const pool = soloPublicables ? PUBLICABLES_ORDENADAS : DATASET.carreras;
  return pool.find((c) => c.cveCarrera === cveCarrera);
}

export function getSlugsCarrerasMx(): string[] {
  return PUBLICABLES_ORDENADAS.map((c) => c.slug);
}
