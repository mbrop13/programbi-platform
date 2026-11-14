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
/** Altura aproximada del banner explicativo de niveles en la primera hoja de temario. */
const FIRST_PAGE_GUIDE_RESERVE_PX = 58;
/** Espacio reservado en la última hoja para la placa final de inscripción. */
const LAST_PAGE_ENROLLMENT_RESERVE_PX = 160;
const LEVEL_BANNER_PX = 48;
const ROW_GAP_PX = 14;

export type CourseLevelCard = {
  code: string;
  name: string;
  hoursText: string;
  badge: string;
  description: string;
};

export type CourseLevelSummary = {
  isTwoLevel: boolean;
  levelsLabel: string;
  coverKpiUnit: string;
  coverKpiNote: string;
  coverHoursNote: string;
  coverModulesNote: string;
  coverBannerTitle: string;
  coverBannerDetail: string;
  priceKicker: string;
  priceScopeNote: string;
  scheduleHoursTitle: string;
  scheduleHoursSubtitle: string;
  levelCards: CourseLevelCard[];
  syllabusRightNote: string;
  syllabusGuideBanner: string;
  closingScopeLabel: string;
};

/**
 * Resume de manera consistente cómo se organiza el curso según su catálogo:
 * la mayoría combina dos niveles independientes (Básico-Intermedio y Avanzado),
 * mientras otros (como Claude, Copilot o Access) se dictan en un nivel único.
 */
export function describeCourseLevels(data: CourseBrochureData): CourseLevelSummary {
  const levels = data.levels ?? [];
  const isTwoLevel = levels.length > 1 || data.levelsCount > 1;

  if (isTwoLevel) {
    const lvl1 = levels[0];
    const lvl2 = levels[1];
    const name1 = lvl1?.name || "Básico-Intermedio";
    const name2 = lvl2?.name || "Avanzado";
    const h1 = lvl1?.hours || data.hours;
    const h2 = lvl2?.hours || data.hours;
    const hasThreePartsInSyllabus = (data.temario?.length ?? 0) >= 3;
    const hoursPair = h1 === h2 ? `${h1} h por nivel` : `${h1} h y ${h2} h`;

    return {
      isTwoLevel: true,
      levelsLabel: `${name1} y ${name2}`,
      coverKpiUnit: "NIVELES",
      coverKpiNote: `${name1} y ${name2}`,
      coverHoursNote: "Por nivel en vivo",
      coverModulesNote: "Incluye ambos niveles",
      coverBannerTitle: "2 niveles independientes",
      coverBannerDetail: `Se dicta en ${name1} (${h1} h) y ${name2} (${h2} h). Puedes cursar solo el nivel que necesitas; este brochure reúne el temario de ambos.`,
      priceKicker: `Arancel por nivel · ${data.moneda}`,
      priceScopeNote: `Corresponde a 1 nivel a elección: ${name1} (${h1} h) o ${name2} (${h2} h). Cada nivel se cursa e inscribe por separado.`,
      scheduleHoursTitle: `${data.hours} h por nivel`,
      scheduleHoursSubtitle: `2 niveles independientes · ${data.modality || "Zoom en vivo"}`,
      levelCards: [
        {
          code: "NIVEL 01",
          name: name1,
          hoursText: `${h1} h`,
          badge: "Base + dominio práctico",
          description: hasThreePartsInSyllabus
            ? "Reúne Nivel I (Básico) y Nivel II (Intermedio) en una ruta progresiva para construir criterio y soltura real."
            : "Construye la base técnica y la aplicación práctica de negocio desde cero con acompañamiento en vivo.",
        },
        {
          code: "NIVEL 02",
          name: name2,
          hoursText: `${h2} h`,
          badge: "Nivel independiente",
          description: hasThreePartsInSyllabus
            ? "Corresponde al Nivel III (Avanzado): técnicas expertas, automatización y casos complejos si ya dominas la base."
            : "Enfocado en arquitectura, modelado avanzado y entregables de alto impacto para quienes ya manejan los fundamentos.",
        },
      ],
      syllabusRightNote: `2 niveles · ${hoursPair}`,
      syllabusGuideBanner: hasThreePartsInSyllabus
        ? `Organización de este temario: los bloques Básico (Nivel I) e Intermedio (Nivel II) forman el programa ${name1} (${h1} h), y el bloque Avanzado (Nivel III) corresponde al programa ${name2} (${h2} h).`
        : `Organización de este temario: programa estructurado en dos inscripciones independientes — ${name1} (${h1} h) y ${name2} (${h2} h).`,
      closingScopeLabel: `Por nivel elegido`,
    };
  }

  const rawName = (levels[0]?.name || "").trim();
  const singleQualifier =
    rawName && !/^completo$/i.test(rawName) ? rawName : "Programa completo";
  const isDefaultFull = singleQualifier === "Programa completo";

  return {
    isTwoLevel: false,
    levelsLabel: isDefaultFull ? "Nivel único completo" : `Nivel único · ${singleQualifier}`,
    coverKpiUnit: "NIVEL ÚNICO",
    coverKpiNote: isDefaultFull ? "Programa completo" : singleQualifier,
    coverHoursNote: "Programa en vivo",
    coverModulesNote: "Ruta integrada",
    coverBannerTitle: "Programa de nivel único",
    coverBannerDetail: isDefaultFull
      ? `Este curso se imparte en un solo nivel completo de ${data.hours} h en vivo (no se divide en Básico-Intermedio y Avanzado).`
      : `Este curso se imparte en un nivel único (${singleQualifier}) de ${data.hours} h en vivo de principio a fin, sin dividir etapas.`,
    priceKicker: `Programa completo · ${data.moneda}`,
    priceScopeNote: `Valor total del curso completo en nivel único (${data.hours} h en vivo y acceso a los ${data.modulesCount} módulos).`,
    scheduleHoursTitle: `${data.hours} h · Nivel único`,
    scheduleHoursSubtitle: `Programa completo · ${data.modality || "Zoom en vivo"}`,
    levelCards: [
      {
        code: "NIVEL ÚNICO",
        name: isDefaultFull
          ? `Programa completo (${data.hours} h)`
          : `Nivel único · ${singleQualifier} (${data.hours} h)`,
        hoursText: `${data.hours} h en vivo`,
        badge: "Sin separación por niveles",
        description: `A diferencia de los cursos de dos niveles, este programa reúne sus ${data.modulesCount} módulos en una sola inscripción continua de inicio a cierre.`,
      },
    ],
    syllabusRightNote: `Nivel único · ${data.hours} h de programa`,
    syllabusGuideBanner: `Organización de este temario: programa de nivel único (${data.hours} h en vivo). Todos los módulos se cursan en una sola secuencia integrada.`,
    closingScopeLabel: "Programa completo",
  };
}

/** Formatea título y etiqueta lateral de cada banda de nivel en las hojas de temario. */
export function formatSyllabusGroupHeader(
  data: CourseBrochureData,
  levelLabel: string
): { title: string; badge: string } {
  const levels = data.levels ?? [];
  const isTwoLevel = levels.length > 1 || data.levelsCount > 1;
  const h1 = levels[0]?.hours || data.hours;
  const h2 = levels[1]?.hours || data.hours;

  if (!isTwoLevel) {
    let cleanTitle = levelLabel.trim();
    if (/^principiante$/i.test(cleanTitle)) {
      cleanTitle = "Programa completo · De cero a dominio aplicado";
    } else if (/^intermedio a avanzado$/i.test(cleanTitle)) {
      cleanTitle = "Programa completo · Intermedio a Avanzado";
    }
    return {
      title: cleanTitle,
      badge: `Nivel único · ${data.hours} h en vivo`,
    };
  }

  if (/b[aá]sico-intermedio/i.test(levelLabel)) {
    return {
      title: levelLabel,
      badge: `Nivel 1 independiente · ${h1} h en vivo`,
    };
  }
  if (/nivel\s*i\b.*b[aá]sico|^nivel:\s*b[aá]sico/i.test(levelLabel)) {
    return {
      title: levelLabel,
      badge: `Parte 1 de Básico-Intermedio (${h1} h)`,
    };
  }
  if (/nivel\s*ii\b.*intermedio|^nivel:\s*intermedio/i.test(levelLabel)) {
    return {
      title: levelLabel,
      badge: `Parte 2 de Básico-Intermedio (${h1} h)`,
    };
  }
  if (/avanzado/i.test(levelLabel)) {
    return {
      title: levelLabel,
      badge: `Nivel 2 independiente · ${h2} h en vivo`,
    };
  }

  return {
    title: levelLabel,
    badge: `Incluido en el programa (${data.hours} h por nivel)`,
  };
}

function decideModuleSpan(modulo: BrochureModulo): 1 | 2 {
  const topics = Array.isArray(modulo.topics) ? modulo.topics : [];
  const totalChars = topics.reduce((sum, t) => sum + t.length, 0);
  const longestTopic = topics.reduce((max, t) => Math.max(max, t.length), 0);
  if (topics.length >= 8 || totalChars >= 430 || longestTopic >= 96) {
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
    const pageLimit =
      pages.length === 0
        ? PAGE_BODY_MAX_PX - FIRST_PAGE_GUIDE_RESERVE_PX
        : PAGE_BODY_MAX_PX;

    if (current.moduleCount > 0 && candidateHeight > pageLimit) {
      pages.push(current);
      current = emptyPage();
    }
    pushModuleToPage(current, modulo);
  }

  if (current.moduleCount > 0) pages.push(current);

  // Asegura espacio para la placa final de inscripción en la última hoja.
  const last = pages[pages.length - 1];
  const lastPageBodyMax =
    pages.length === 1
      ? PAGE_BODY_MAX_PX - FIRST_PAGE_GUIDE_RESERVE_PX
      : PAGE_BODY_MAX_PX;
  const lastLimit = lastPageBodyMax - LAST_PAGE_ENROLLMENT_RESERVE_PX;
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
