import type { BloqueSeoFicha } from "./tipos";
import { BLOQUES_POWER_BI } from "./power-bi";
import { BLOQUES_ANALISIS_DE_DATOS } from "./analisis-de-datos";
import { BLOQUES_CLAUDE } from "./claude";

export type { BloqueSeoFicha } from "./tipos";

/**
 * Bloques editoriales extra por ficha de curso, en orden de lectura.
 * Se renderizan en el servidor (components/marketing/FichaSeoExtra.tsx).
 */
const POR_CURSO: Record<string, readonly BloqueSeoFicha[]> = {
  "power-bi": BLOQUES_POWER_BI,
  "analisis-de-datos": BLOQUES_ANALISIS_DE_DATOS,
  claude: BLOQUES_CLAUDE,
};

export function bloquesDeFicha(slug: string): readonly BloqueSeoFicha[] {
  return POR_CURSO[slug] ?? [];
}
