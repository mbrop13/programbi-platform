import type { EnlaceCurso } from "./tipos";
import { ENLACES_POWER_BI } from "./power-bi";
import { ENLACES_ANALISIS_DE_DATOS } from "./analisis-de-datos";
import { ENLACES_SQL_SERVER } from "./sql-server";
import { ENLACES_PYTHON } from "./python";

export type { EnlaceCurso } from "./tipos";

/**
 * Enlaces internos por ficha de curso.
 *
 * Cada lista sale de landings y guías que ya existen en el repo, con la ruta
 * verificada. No se agregan URLs nuevas aquí: si la página no existe, el
 * enlace no va.
 */
const POR_CURSO: Record<string, readonly EnlaceCurso[]> = {
  "power-bi": ENLACES_POWER_BI,
  "analisis-de-datos": ENLACES_ANALISIS_DE_DATOS,
  "sql-server": ENLACES_SQL_SERVER,
  python: ENLACES_PYTHON,
};

export function enlacesDeCurso(slug: string): readonly EnlaceCurso[] {
  return POR_CURSO[slug] ?? [];
}
