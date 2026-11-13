/**
 * Planificador editorial determinista para las hojas de temario (6..N).
 *
 * Calcula el ancho de cada módulo (`span`: 1 o 2 columnas) y su altura real
 * estimada en píxeles (incluyendo envoltorio de texto por ancho de columna,
 * cabeceras de nivel y reserva para el panel de cierre en la última hoja)
 * para eliminar cualquier recorte/desbordamiento en cursos densos como
 * `mercado-financiero`, `excel`, `python` y `power-bi`.
 */

import type {
  BrochureModulo,
  BrochureNivel,
  CourseBrochureData,
} from "./brochure-data";

/** Hojas fijas previas al temario: portada, inversión, calendario, showcase y docentes. */
export const BROCHURE_FIXED_PAGES = 5;

export type PlannedBrochureModule = BrochureModulo & {
  /** Numeración global del módulo dentro del programa (1..N). */
  moduleNumber: number;
  levelLabel: string;
  levelShortLabel: string | null;
  /** 1 = media columna (~340px); 2 = ancho completo (~698px, 2 subcolumnas). */
  span: 1 | 2;
  /** Altura estimada conservadora en px para paginación exacta. */
  estimatedHeightPx: number;
};

export type BrochureSyllabusGroup = {
  levelLabel: string;
  levelShortLabel: string | null;
  modules: PlannedBrochureModule[];
};

export type BrochureSyllabusPage = {
  groups: BrochureSyllabusGroup[];
  moduleCount: number;
  /** Altura estimada total del contenido en px. */
  usedHeightPx: number;
};

/** Alto útil disponible debajo del encabezado "Programa Académico Detallado". */
const PAGE_BODY_MAX_PX = 815;
/** Espacio reservado en la última hoja para la placa final de inscripción. */
const LAST_PAGE_ENROLLMENT_RESERVE_PX = 160;
const LEVEL_BANNER_PX = 48;
const ROW_GAP_PX = 14;

function decideModuleSpan(modulo: BrochureModulo): 1 | 2 {
  const topics = Array.isArray(modulo.topics) ? modulo.topics : [];
  const totalChars = topics.reduce((sum, t) => sum + t.length, 0);
  const longestTopic = topics.reduce((max, t) => Math.max(max, t.length), 0);
  if (topics.length >= 8 || totalChars >= 370 || longestTopic >= 68) {
    return 2;
  }
  return 1;
}

function estimateModuleHeightPx(modulo: BrochureModulo, span: 1 | 2): number {
  const topics = Array.isArray(modulo.topics) ? modulo.topics : [];
  const titleCharsPerLine = span === 2 ? 64 : 29;
  const titleLines = Math.max(1, Math.ceil((modulo.title?.length ?? 20) / titleCharsPerLine));
  const headerAndChrome = 54 + titleLines * 20;

  if (topics.length === 0) return headerAndChrome + 16;

  if (span === 2) {
    // Dos subcolumnas de ~318px cada una -> ~43 chars por línea a 11.8px.
    const half = Math.ceil(topics.length / 2);
    const left = topics.slice(0, half);
    const right = topics.slice(half);
    const colHeight = (items: string[]) =>
      items.reduce(
        (acc, t) => acc + Math.max(1, Math.ceil((t.length + 3) / 42)) * 17 + 6,
        0
      );
    return headerAndChrome + Math.max(colHeight(left), colHeight(right)) + 16;
  }

  // Media columna de ~328px con lista simple de 1 columna -> ~39 chars por línea.
  const listHeight = topics.reduce(
    (acc, t) => acc + Math.max(1, Math.ceil((t.length + 3) / 38)) * 17 + 6,
    0
  );
  return headerAndChrome + listHeight + 16;
}

function measurePageHeightPx(groups: BrochureSyllabusGroup[]): number {
  let total = 0;
  for (let gi = 0; gi < groups.length; gi++) {
    const group = groups[gi];
    total += LEVEL_BANNER_PX;
    let i = 0;
    while (i < group.modules.length) {
      const current = group.modules[i];
      if (current.span === 2) {
        total += current.estimatedHeightPx + ROW_GAP_PX;
        i += 1;
      } else {
        const next = group.modules[i + 1];
        if (next && next.span === 1) {
          total += Math.max(current.estimatedHeightPx, next.estimatedHeightPx) + ROW_GAP_PX;
          i += 2;
        } else {
          total += current.estimatedHeightPx + ROW_GAP_PX;
          i += 1;
        }
      }
    }
    if (gi < groups.length - 1) total += 10;
  }
  return total;
}

function emptyPage(): BrochureSyllabusPage {
  return { groups: [], moduleCount: 0, usedHeightPx: 0 };
}

function cloneGroupsWithModule(
  groups: BrochureSyllabusGroup[],
  modulo: PlannedBrochureModule
): BrochureSyllabusGroup[] {
  const next = groups.map((g) => ({ ...g, modules: [...g.modules] }));
  const last = next[next.length - 1];
  if (
    last &&
    last.levelLabel === modulo.levelLabel &&
    last.levelShortLabel === modulo.levelShortLabel
  ) {
    last.modules.push(modulo);
  } else {
    next.push({
      levelLabel: modulo.levelLabel,
      levelShortLabel: modulo.levelShortLabel,
      modules: [modulo],
    });
  }
  return next;
}

function pushModuleToPage(
  page: BrochureSyllabusPage,
  modulo: PlannedBrochureModule
): void {
  page.groups = cloneGroupsWithModule(page.groups, modulo);
  page.moduleCount += 1;
  page.usedHeightPx = measurePageHeightPx(page.groups);
}

/**
 * Reparte los módulos en hojas A4 garantizando holgura vertical y
 * reserva exacta en la última página para el bloque de inscripción.
 */
export function planBrochureSyllabus(data: CourseBrochureData): BrochureSyllabusPage[] {
  const planned: PlannedBrochureModule[] = [];
  let numero = 0;

  for (const nivel of (data.temario ?? []) as BrochureNivel[]) {
    for (const modulo of nivel.modules ?? []) {
      numero += 1;
      const span = decideModuleSpan(modulo);
      planned.push({
        ...modulo,
        moduleNumber: numero,
        levelLabel: nivel.label,
        levelShortLabel: nivel.shortLabel ?? null,
        span,
        estimatedHeightPx: estimateModuleHeightPx(modulo, span),
      });
    }
  }

  if (planned.length === 0) return [emptyPage()];

  const pages: BrochureSyllabusPage[] = [];
  let current = emptyPage();

  for (const modulo of planned) {
    const candidateGroups = cloneGroupsWithModule(current.groups, modulo);
    const candidateHeight = measurePageHeightPx(candidateGroups);

    if (current.moduleCount > 0 && candidateHeight > PAGE_BODY_MAX_PX) {
      pages.push(current);
      current = emptyPage();
    }
    pushModuleToPage(current, modulo);
  }

  if (current.moduleCount > 0) pages.push(current);

  // Asegura espacio para la placa final de inscripción en la última hoja.
  const last = pages[pages.length - 1];
  const lastLimit = PAGE_BODY_MAX_PX - LAST_PAGE_ENROLLMENT_RESERVE_PX;
  if (last.usedHeightPx > lastLimit && last.moduleCount > 0) {
    const moved: PlannedBrochureModule[] = [];
    while (last.usedHeightPx > lastLimit && last.moduleCount > 0) {
      const grp = last.groups[last.groups.length - 1];
      const popped = grp?.modules.pop();
      if (!popped) break;
      if (grp.modules.length === 0) last.groups.pop();
      last.moduleCount -= 1;
      last.usedHeightPx = measurePageHeightPx(last.groups);
      moved.unshift(popped);
    }

    if (last.moduleCount === 0) {
      // Un único módulo altísimo ocupa casi toda la hoja: se queda ahí y el CTA pasa a una hoja dedicada limpia si excediera.
      for (const m of moved) pushModuleToPage(last, m);
      if (last.usedHeightPx > lastLimit) {
        pages.push(emptyPage());
      }
    } else if (moved.length > 0) {
      const extra = emptyPage();
      for (const m of moved) pushModuleToPage(extra, m);
      pages.push(extra);
    }
  }

  return pages;
}

/** Total de hojas A4 del brochure: 5 fijas + hojas de temario. */
export function brochureTotalPages(data: CourseBrochureData): number {
  return BROCHURE_FIXED_PAGES + Math.max(1, planBrochureSyllabus(data).length);
}
