import carrerasRaw from "@/data/co/carreras.json";
import carrerasIesRaw from "@/data/co/carreras-ies.json";
import type {
  CarreraCo,
  CarreraIesItemCo,
  CarrerasDatasetCo,
  CarrerasIesDatasetCo,
  MetaCarrerasCo,
  NivelFormacionCo,
} from "./types";

const carrerasData = carrerasRaw as CarrerasDatasetCo;
const carrerasIesData = carrerasIesRaw as CarrerasIesDatasetCo;

export function getMetaCarrerasCo(): MetaCarrerasCo {
  return carrerasData.meta;
}

export function getProgramasCo(): CarreraCo[] {
  return carrerasData.programas;
}

/** Los 354 programas con ficha individual (`sugerido_ficha === true`). */
export function getFichasCarrerasCo(): CarreraCo[] {
  return carrerasData.programas.filter((p) => p.sugerido_ficha);
}

/** Los 335 programas habilitados en rankings (`sugerido_ranking === true`). */
export function getRankingCarrerasCo(nivel?: NivelFormacionCo): CarreraCo[] {
  return carrerasData.programas.filter(
    (p) => p.sugerido_ranking && (!nivel || p.nivel_formacion === nivel)
  );
}

export function getCarreraPorSlugCo(slug: string): CarreraCo | undefined {
  return carrerasData.programas.find((p) => p.slug === slug);
}

export function getFichaPorSlugCo(slug: string): CarreraCo | undefined {
  return carrerasData.programas.find((p) => p.slug === slug && p.sugerido_ficha);
}

export function getIesPorCarreraCo(slug: string): CarreraIesItemCo[] {
  return carrerasIesData.por_programa[slug] ?? [];
}

export function getMetaIesCo() {
  return carrerasIesData.meta;
}

export function medianaNivelCo(nivel: NivelFormacionCo): {
  mediana_smmlv: number;
  mediana_cop_2026: number;
} {
  const valores = getFichasCarrerasCo()
    .filter((p) => p.nivel_formacion === nivel)
    .map((p) => p.mediana_smmlv)
    .sort((a, b) => a - b);

  if (valores.length === 0) return { mediana_smmlv: 0, mediana_cop_2026: 0 };
  const mid = Math.floor(valores.length / 2);
  const med =
    valores.length % 2 === 0
      ? Math.round(((valores[mid - 1] + valores[mid]) / 2) * 100) / 100
      : valores[mid];
  return {
    mediana_smmlv: med,
    mediana_cop_2026: Math.round(med * carrerasData.meta.smmlv_2026_cop),
  };
}

export function posicionEnNivelCo(slug: string): {
  posicion: number;
  total: number;
} | null {
  const carrera = getFichaPorSlugCo(slug);
  if (!carrera) return null;
  const delNivel = getFichasCarrerasCo()
    .filter((p) => p.nivel_formacion === carrera.nivel_formacion)
    .sort(
      (a, b) =>
        b.mediana_smmlv - a.mediana_smmlv ||
        b.graduados_cotizantes - a.graduados_cotizantes ||
        a.slug.localeCompare(b.slug, "es")
    );
  const idx = delNivel.findIndex((p) => p.slug === slug);
  if (idx < 0) return null;
  return { posicion: idx + 1, total: delNivel.length };
}
