/**
 * Planificación determinista de las hojas A4 del brochure.
 *
 * El temario de un curso puede tener 12, 20 o 40 módulos. Este módulo decide
 * exactamente qué módulos caen en cada hoja (4–6 por hoja, grilla 2×2/2×3) y
 * reserva espacio en la última hoja para el panel de inscripción, de modo que
 * la vista previa, la impresión y el PDF siempre tengan el mismo número de
 * páginas y ningún módulo se corte.
 *
 * Es lógica pura (sin React) y compartida por el visor (WS9) y las hojas de
 * temario (WS7). No editar sin actualizar ambos lados.
 */

import type {
  BrochureModulo,
  BrochureNivel,
  CourseBrochureData,
} from "./brochure-data";

export type PlannedBrochureModule = BrochureModulo & {
  /** Numeración global del módulo dentro del programa (1..N). */
  moduleNumber: number;
  levelLabel: string;
  levelShortLabel: string | null;
};

export type BrochureSyllabusGroup = {
  levelLabel: string;
  levelShortLabel: string | null;
  modules: PlannedBrochureModule[];
};

export type BrochureSyllabusPage = {
  groups: BrochureSyllabusGroup[];
  moduleCount: number;
  /** Peso editorial acumulado (1 = módulo corto, 5 = módulo muy cargado). */
  weight: number;
};

/** Peso máximo por hoja: deja aire para títulos, bandas y pie. */
const MAX_WEIGHT = 20;
/** Máximo de tarjetas de módulo por hoja (grilla de 2 columnas × 4 filas). */
const MAX_MODULES = 8;
/** Peso máximo de la última hoja para que quepa el panel de inscripción. */
const LAST_PAGE_WEIGHT = 16;

function weightOf(modulo: BrochureModulo): number {
  const topics = Array.isArray(modulo.topics) ? modulo.topics.length : 0;
  return 1 + Math.min(4, Math.ceil(topics / 4));
}

function emptyPage(): BrochureSyllabusPage {
  return { groups: [], moduleCount: 0, weight: 0 };
}

function pushModule(
  page: BrochureSyllabusPage,
  nivel: BrochureNivel,
  modulo: PlannedBrochureModule
): void {
  const last = page.groups[page.groups.length - 1];
  if (last && last.levelLabel === nivel.label && last.levelShortLabel === (nivel.shortLabel ?? null)) {
    last.modules.push(modulo);
  } else {
    page.groups.push({
      levelLabel: nivel.label,
      levelShortLabel: nivel.shortLabel ?? null,
      modules: [modulo],
    });
  }
  page.moduleCount += 1;
  page.weight += weightOf(modulo);
}

/**
 * Reparte el temario en hojas A4. Siempre devuelve al menos una hoja.
 */
export function planBrochureSyllabus(data: CourseBrochureData): BrochureSyllabusPage[] {
  const pages: BrochureSyllabusPage[] = [];
  let current = emptyPage();
  let numero = 0;

  for (const nivel of data.temario ?? []) {
    for (const modulo of nivel.modules ?? []) {
      const weight = weightOf(modulo);

      if (
        current.moduleCount > 0 &&
        (current.weight + weight > MAX_WEIGHT || current.moduleCount >= MAX_MODULES)
      ) {
        pages.push(current);
        current = emptyPage();
      }

      numero += 1;
      pushModule(current, nivel, {
        ...modulo,
        moduleNumber: numero,
        levelLabel: nivel.label,
        levelShortLabel: nivel.shortLabel ?? null,
      });
    }
  }

  if (current.moduleCount > 0) pages.push(current);
  if (pages.length === 0) return [emptyPage()];

  // Reserva el panel de inscripción en la última hoja: si quedó muy cargada,
  // mueve los módulos finales a una hoja nueva.
  const last = pages[pages.length - 1];
  if (last.weight > LAST_PAGE_WEIGHT && last.moduleCount > 1) {
    const moved: PlannedBrochureModule[] = [];
    while (last.weight > 12 && last.moduleCount > 1) {
      const group = last.groups[last.groups.length - 1];
      const modulo = group.modules.pop();
      if (!modulo) break;
      last.moduleCount -= 1;
      last.weight -= weightOf(modulo);
      moved.unshift(modulo);
      if (group.modules.length === 0) last.groups.pop();
    }
    if (moved.length > 0) {
      const extra = emptyPage();
      for (const modulo of moved) {
        extra.groups.push({
          levelLabel: modulo.levelLabel,
          levelShortLabel: modulo.levelShortLabel,
          modules: [modulo],
        });
        extra.moduleCount += 1;
        extra.weight += weightOf(modulo);
      }
      pages.push(extra);
    }
  }

  return pages;
}

/** Total de hojas A4 del brochure: 4 fijas + hojas de temario. */
export function brochureTotalPages(data: CourseBrochureData): number {
  return 4 + Math.max(1, planBrochureSyllabus(data).length);
}
