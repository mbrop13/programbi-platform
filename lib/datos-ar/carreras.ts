import carrerasJson from "@/data/ar/carreras.json";
import type { AnuarioDiu2024, CarrerasArData, DisciplinaAraucano } from "./types";

const DATA = carrerasJson as CarrerasArData;

export function getCarrerasAr(): CarrerasArData {
  return DATA;
}

/**
 * Devuelve las 36 disciplinas de Araucano con `n_con_salario_sipa >= 100`.
 * Mientras `diccionarioDisponible` sea `false`, `nombreOficial` y `slug` son `null`.
 */
export function getDisciplinasPublicablesAr(): readonly DisciplinaAraucano[] {
  return DATA.disciplinas;
}

/**
 * Busca una disciplina por slug oficial solo cuando el diccionario Araucano está cargado.
 * Sin diccionario oficial no se publican fichas individuales.
 */
export function getDisciplinaPorSlugAr(slug: string): DisciplinaAraucano | null {
  if (!DATA.diccionarioDisponible) return null;
  return DATA.disciplinas.find((d) => d.slug === slug) ?? null;
}

export function getAnuarioDiu2024(): AnuarioDiu2024 | null {
  return DATA.anuarioDiu2024;
}

export function getEstadoDiccionarioAr(): {
  disponible: boolean;
  fichasPublicadas: number;
  disciplinasPublicables: number;
  anioBase: string;
  mesAjusteIpc: string;
} {
  return {
    disponible: DATA.diccionarioDisponible,
    fichasPublicadas: DATA.fichasPublicadas,
    disciplinasPublicables: DATA.totalDisciplinasPublicables,
    anioBase: DATA.anioBase,
    mesAjusteIpc: DATA.mesAjusteIpc,
  };
}
