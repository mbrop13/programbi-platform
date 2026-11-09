/**
 * Planificación determinista de las hojas A4 del brochure.
 *
 * El brochure tiene 5 hojas fijas (1 Portada, 2 Inversión, 3 Calendario,
 * 4 Proyectos/Certificado, 5 Equipo Docente) y el temario empieza en la hoja 6.
 * Este módulo decide exactamente qué módulos caen en cada hoja de temario
 * (máximo 4 tarjetas por hoja, grilla 2×2) y reserva la última hoja para el
 * panel de inscripción (máximo 3 módulos), de modo que la vista previa, la
 * impresión y el PDF siempre tengan el mismo número de páginas, con tipografía
 * grande y sin que ningún módulo se corte.
 *
 * Es lógica pura (sin React) y compartida por el visor (WS7) y las hojas de
 * temario (WS6). No editar sin actualizar ambos lados.
 */

import type {
  BrochureModulo,
  BrochureNivel,
  CourseBrochureData,
} from "./brochure-data";

/** Hojas fijas antes del temario: portada, inversión, calendario, showcase y equipo. */
export const BROCHURE_FIXED_PAGES = 5;

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

/** Máximo de tarjetas por hoja: con tipografía grande caben 2 filas de 2. */
const MAX_MODULES = 4;
/** Peso editorial máximo por hoja: deja aire para bandas, títulos y pie. */
const MAX_WEIGHT = 13;
/** La última hoja reserva espacio para el panel de inscripción. */
const LAST_PAGE_MAX_MODULES = 3;
/**
 * Si la hoja ya tiene esta cantidad de módulos, un cambio de nivel abre hoja
 * nueva: dos bandas de nivel más tres filas de tarjetas no caben en un A4.
 */
const MODULES_BEFORE_LEVEL_BREAK = 3;

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

/** Añade un módulo ya planificado conservando la agrupación por nivel. */
function appendPlanned(page: BrochureSyllabusPage, modulo: PlannedBrochureModule): void {
  const last = page.groups[page.groups.length - 1];
  if (
    last &&
    last.levelLabel === modulo.levelLabel &&
    last.levelShortLabel === modulo.levelShortLabel
  ) {
    last.modules.push(modulo);
  } else {
    page.groups.push({
      levelLabel: modulo.levelLabel,
      levelShortLabel: modulo.levelShortLabel,
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
      const ultimoGrupo = current.groups[current.groups.length - 1];
      const cambiaNivel =
        ultimoGrupo != null &&
        (ultimoGrupo.levelLabel !== nivel.label ||
          ultimoGrupo.levelShortLabel !== (nivel.shortLabel ?? null));

      if (
        current.moduleCount > 0 &&
        ((cambiaNivel && current.moduleCount >= MODULES_BEFORE_LEVEL_BREAK) ||
          current.weight + weight > MAX_WEIGHT ||
          current.moduleCount >= MAX_MODULES)
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

  // Reserva el panel de inscripción en la última hoja: si el plan termina con
  // 4 módulos, mueve el último a una hoja nueva (aunque quede con 1 módulo)
  // para que el panel respire. `weight` y `moduleCount` se recalculan al mover.
  const last = pages[pages.length - 1];
  if (last.moduleCount > LAST_PAGE_MAX_MODULES) {
    const moved: PlannedBrochureModule[] = [];

    while (last.moduleCount > LAST_PAGE_MAX_MODULES) {
      const group = last.groups[last.groups.length - 1];
      const modulo = group?.modules.pop();
      if (!modulo) break;

      last.moduleCount -= 1;
      last.weight -= weightOf(modulo);
      moved.unshift(modulo);

      if (group.modules.length === 0) last.groups.pop();
    }

    if (moved.length > 0) {
      const extra = emptyPage();
      for (const modulo of moved) appendPlanned(extra, modulo);
      pages.push(extra);
    }
  }

  return pages;
}

/** Total de hojas A4 del brochure: 5 fijas + hojas de temario. */
export function brochureTotalPages(data: CourseBrochureData): number {
  return BROCHURE_FIXED_PAGES + Math.max(1, planBrochureSyllabus(data).length);
}
