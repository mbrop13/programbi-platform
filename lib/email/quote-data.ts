/**
 * Quote-email data: resolve courses from the lead form, platform prices
 * (catalog + overrides + promos), schedules, and related-course order.
 */

import { courses, getCourseBySlug, type Course } from "@/lib/data/courses";
import { staticSchedules, OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
import { isTieredCourse } from "@/lib/data/course-views";
import type { EmailCourseItem, EmailPackInfo } from "./quote-template";

export type PriceOverrideRow = {
  item_type?: string;
  item_id?: string;
  level_name?: string;
  price?: number;
};

export type PromotionRow = {
  target_type?: string;
  target_id?: string;
  promo_price?: number | null;
  discount_percentage?: number | null;
  is_active?: boolean;
  valid_until?: string | null;
};

export type ScheduleRow = {
  course_slug: string;
  level_name: string;
  start_date: string;
  schedule_days: string;
  schedule_time: string;
  is_active?: boolean;
};

/** Related courses shown under the quoted one. Order = visual priority. */
export const RELATED_BY_SLUG: Record<string, string[]> = {
  "analisis-de-datos": ["power-bi", "python", "copilot"],
  "power-bi": ["analisis-de-datos", "python", "copilot"],
  python: ["analisis-de-datos", "power-bi", "copilot"],
  "sql-server": ["analisis-de-datos", "power-bi", "python"],
  copilot: ["ia-productividad", "power-automate", "analisis-de-datos"],
  "ia-productividad": ["copilot", "power-automate", "python"],
  "power-automate": ["copilot", "ia-productividad", "power-bi"],
  excel: ["power-bi", "analisis-de-datos", "copilot"],
  "machine-learning": ["python", "analisis-de-datos", "ia-productividad"],
  "analitica-mineria": ["power-bi", "python", "analisis-de-datos"],
  "analitica-financiera": ["excel", "power-bi", "python"],
};

const PACK_MODULES = [
  { slug: "sql-server", label: "SQL Server" },
  { slug: "power-bi", label: "Power BI" },
  { slug: "python", label: "Python" },
] as const;

const DEFAULT_RELATED = ["power-bi", "python", "copilot"];

const ALIAS_RULES: Array<{ test: (s: string) => boolean; slug: string }> = [
  {
    test: (s) => /an[aá]lisis[\s-]*de[\s-]*datos/.test(s) || s.includes("analisis-de-datos"),
    slug: "analisis-de-datos",
  },
  { test: (s) => s.includes("copilot"), slug: "copilot" },
  {
    test: (s) => s.includes("machine-learning") || s.includes("machine learning") || s === "ml",
    slug: "machine-learning",
  },
  {
    test: (s) =>
      s.includes("power-automate") ||
      s.includes("power automate") ||
      (s.includes("automate") && !s.includes("copilot")),
    slug: "power-automate",
  },
  {
    test: (s) =>
      s.includes("ia-productividad") ||
      s.includes("ia en productividad") ||
      s.includes("inteligencia artificial"),
    slug: "ia-productividad",
  },
  {
    test: (s) => s.includes("power-bi") || s.includes("power bi") || s.includes("powerbi"),
    slug: "power-bi",
  },
  { test: (s) => s.includes("python"), slug: "python" },
  { test: (s) => s.includes("sql"), slug: "sql-server" },
  { test: (s) => s.includes("excel"), slug: "excel" },
  {
    test: (s) => s.includes("miner") || s.includes("analitica-mineria") || s === "minería" || s === "mineria",
    slug: "analitica-mineria",
  },
  {
    test: (s) => s.includes("finan") || s.includes("analitica-financiera"),
    slug: "analitica-financiera",
  },
];

export function formatCLP(price: number): string {
  if (!price || price <= 0) return "Consultar";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function resolveCourseSlug(raw: string): string | null {
  const s = raw.toLowerCase().trim();
  if (!s) return null;

  const bySlug = getCourseBySlug(s);
  if (bySlug) return bySlug.slug;

  const byTitle = courses.find((c) => c.title.toLowerCase() === s);
  if (byTitle) return byTitle.slug;

  for (const rule of ALIAS_RULES) {
    if (rule.test(s)) return rule.slug;
  }
  return null;
}

function resolveLevelName(raw: string, course: Course): string {
  const s = raw.toLowerCase();
  const levels = course.levels || [];
  const find = (needle: string) =>
    levels.find((l) => l.name.toLowerCase().includes(needle));

  if (s.includes("avanzado")) {
    const hit = find("avanzado");
    if (hit) return hit.name;
  }
  if (s.includes("intermedio")) {
    const hit = find("intermedio");
    if (hit) return hit.name;
  }
  if (s.includes("básico") || s.includes("basico")) {
    const hit = find("básico") || find("basico");
    if (hit) return hit.name;
  }
  if (s.includes("especializaci")) {
    const hit = find("especializaci") || find("básico") || find("basico");
    if (hit) return hit.name;
  }
  return levels[0]?.name || "Básico";
}

function findLevel(course: Course, levelName: string) {
  const levels = course.levels || [];
  const needle = levelName.toLowerCase();
  return (
    levels.find((l) => l.name === levelName) ||
    levels.find(
      (l) => l.name.toLowerCase().includes(needle) || needle.includes(l.name.toLowerCase())
    ) ||
    levels[0]
  );
}

export function calculateQuotePrice(
  slug: string,
  levelName: string,
  priceOverrides: PriceOverrideRow[],
  promotions: PromotionRow[]
): { finalPrice: number; originalPrice: number; hasDiscount: boolean; discountPercent: number } {
  const course = getCourseBySlug(slug);
  if (!course) {
    return { finalPrice: 0, originalPrice: 0, hasDiscount: false, discountPercent: 0 };
  }

  const level = findLevel(course, levelName);
  const basePrice = level?.price || 0;
  const catalogOriginalCandidate = level?.originalPrice || course.originalPrice || 0;
  const catalogOriginal =
    catalogOriginalCandidate > basePrice ? catalogOriginalCandidate : basePrice;

  const override = priceOverrides.find(
    (o) =>
      o.item_type === "course" &&
      o.item_id === slug &&
      (o.level_name === (level?.name || levelName) || !o.level_name)
  );
  const effectiveBase = override?.price && override.price > 0 ? override.price : basePrice;

  const promo = promotions.find(
    (pr) =>
      pr.target_type === "all" ||
      pr.target_type === "courses" ||
      (pr.target_type === "specific_course" && pr.target_id === slug)
  );

  let finalPrice = effectiveBase;
  let originalPrice = catalogOriginal > effectiveBase ? catalogOriginal : effectiveBase;

  if (promo) {
    if (promo.promo_price && promo.promo_price > 0) {
      finalPrice = promo.promo_price;
    } else if (promo.discount_percentage && promo.discount_percentage > 0) {
      finalPrice = Math.round((effectiveBase * (100 - promo.discount_percentage)) / 100);
    }
    originalPrice = Math.max(originalPrice, effectiveBase);
  }

  const hasDiscount = originalPrice > finalPrice && finalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  return { finalPrice, originalPrice, hasDiscount, discountPercent };
}

const QUOTE_TIME_ZONE = "America/Santiago";

/** Calendar day as YYYY-MM-DD. The stored start date is a cohort day, not a UTC instant. */
export function scheduleDateKey(raw: string): string | null {
  const match = (raw || "").trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function todayKey(timeZone = QUOTE_TIME_ZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** True when the cohort has not started yet in Chile, including a start dated today. */
export function isUpcomingScheduleDate(raw: string, today = todayKey()): boolean {
  const key = scheduleDateKey(raw);
  return Boolean(key && key >= today);
}

function formatEmailDate(dateStr: string): string {
  const key = scheduleDateKey(dateStr);
  if (!key) return dateStr;
  const date = new Date(key + "T12:00:00");
  if (Number.isNaN(date.getTime())) return dateStr;
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  return `${date.getDate()} de ${months[date.getMonth()]}`;
}

function formatEmailDays(daysStr: string): string {
  let res = (daysStr || "").toLowerCase();
  res = res.replace("lunes y miércoles", "Lun y Mié");
  res = res.replace("lunes y miercoles", "Lun y Mié");
  res = res.replace("martes y jueves", "Mar y Jue");
  res = res.replace("sábado", "Sáb");
  res = res.replace("sabado", "Sáb");
  if (!res) return "";
  return res.charAt(0).toUpperCase() + res.slice(1);
}

function formatEmailTime(timeStr: string): string {
  const match = (timeStr || "").match(/^(\d{1,2}:\d{2})/);
  return match ? match[1] : timeStr;
}

/**
 * Levels whose published dates may appear on a quote.
 * The open course (Básico, Intermedio, or Básico-Intermedio) uses those two
 * cohorts. Avanzado never borrows a date from the other level, and a missing
 * date stays "consulta fecha" instead of showing a cohort that already started.
 * null means any level of that slug (courses sold as a single cohort).
 */
function quotedScheduleLevels(course: Course, levelName: string): string[] | null {
  const raw = levelName.toLowerCase();
  const advancedOnly =
    raw.includes("avanzado") && !raw.includes("básico") && !raw.includes("basico") && !raw.includes("intermedio");

  if (course.slug === "analisis-de-datos") {
    return advancedOnly ? ["Avanzado"] : ["Básico", "Intermedio"];
  }
  if (isTieredCourse(course)) {
    return advancedOnly ? ["Avanzado"] : ["Básico", "Intermedio"];
  }
  return null;
}

function pickSchedules(
  list: ScheduleRow[],
  slug: string,
  levels: string[] | null,
  today = todayKey()
): ScheduleRow[] {
  return list
    .filter((s) => {
      if (s.course_slug !== slug || s.is_active === false) return false;
      if (!isUpcomingScheduleDate(s.start_date, today)) return false;
      if (levels && !levels.includes(s.level_name)) return false;
      return true;
    })
    .sort((a, b) => (scheduleDateKey(a.start_date) || "").localeCompare(scheduleDateKey(b.start_date) || ""));
}

function formatScheduleLine(sched: ScheduleRow, withTime: boolean, withLevel = false): string {
  const dateFormatted = formatEmailDate(sched.start_date);
  const daysFormatted = formatEmailDays(sched.schedule_days);
  const level = withLevel ? sched.level_name : "";
  const timeFormatted = withTime ? formatEmailTime(sched.schedule_time) : "";
  return [dateFormatted, level, daysFormatted, timeFormatted].filter(Boolean).join(" · ");
}

function rowsForSlug(
  schedulesList: ScheduleRow[],
  slug: string,
  levels: string[] | null
): ScheduleRow[] {
  const live = pickSchedules(schedulesList, slug, levels);
  if (live.length > 0) return live;
  return pickSchedules(staticSchedules as ScheduleRow[], slug, levels);
}

function getAnalisisSchedule(
  schedulesList: ScheduleRow[],
  levels: string[]
): { summary: string; lines: string[] } {
  const lines: string[] = [];
  let earliest: { key: string; label: string } | null = null;

  for (const mod of PACK_MODULES) {
    const row = rowsForSlug(schedulesList, mod.slug, levels)[0];
    if (!row) {
      lines.push(`${mod.label} · ${OPEN_COHORT_LABEL}`);
      continue;
    }
    lines.push(`${mod.label} · ${formatScheduleLine(row, true)}`);
    const key = scheduleDateKey(row.start_date) || "";
    const label = formatEmailDate(row.start_date);
    if (!earliest || key < earliest.key) earliest = { key, label };
  }

  return {
    summary: earliest ? `Próximo inicio: ${earliest.label}` : OPEN_COHORT_LABEL,
    lines,
  };
}

export function getCourseScheduleString(
  slug: string,
  levelName: string,
  schedulesList: ScheduleRow[],
  withTime = true
): string {
  const course = getCourseBySlug(slug);
  const levels = course ? quotedScheduleLevels(course, levelName) : [levelName];
  if (slug === "analisis-de-datos") {
    return getAnalisisSchedule(schedulesList, levels ?? ["Básico", "Intermedio"]).summary;
  }

  const rows = rowsForSlug(schedulesList, slug, levels);
  if (rows.length === 0) return OPEN_COHORT_LABEL;
  const showLevel = (levels?.length ?? 0) > 1;
  if (rows.length === 1) return formatScheduleLine(rows[0], withTime, showLevel);
  return rows
    .slice(0, 3)
    .map((sched, idx) => `Opción ${idx + 1}: ${formatScheduleLine(sched, withTime, showLevel)}`)
    .join("  |  ");
}

function packIncludes(): string[] {
  return ["SQL Server · 20 h", "Power BI · 20 h", "Python · 20 h"];
}

const SHORT_NAME: Record<string, string> = {
  "analisis-de-datos": "Análisis de Datos",
  copilot: "Copilot",
  "power-bi": "Power BI",
  python: "Python",
  "sql-server": "SQL Server",
  excel: "Excel",
  "power-automate": "Power Automate",
  "ia-productividad": "IA en Productividad",
  "machine-learning": "Machine Learning",
  "analitica-mineria": "Analítica Minera",
  "analitica-financiera": "Analítica Financiera",
};

const LEVEL_IN_TITLE = new Set(["power-bi", "python", "sql-server", "excel"]);

function displayTitle(course: Course, levelName: string): string {
  if (course.slug === "copilot") return "Copilot y Copilot Studio";
  const base = SHORT_NAME[course.slug] || course.title;
  const isGenericLevel = /básico|basico|intermedio|avanzado/i.test(levelName);
  if (LEVEL_IN_TITLE.has(course.slug) && isGenericLevel) {
    return `${base} ${levelName}`;
  }
  return base;
}

function displayLevel(course: Course, levelName: string): string {
  if (course.slug === "analisis-de-datos") return "Especialización";
  if (course.slug === "copilot") return "Nuevo";
  return levelName;
}

function toEmailItem(
  course: Course,
  levelName: string,
  priceOverrides: PriceOverrideRow[],
  promotions: PromotionRow[],
  schedules: ScheduleRow[]
): EmailCourseItem {
  const level = findLevel(course, levelName);
  const resolvedLevel = level?.name || levelName;
  const hours = level?.durationHours || course.durationHours || 16;
  const pricing = calculateQuotePrice(course.slug, resolvedLevel, priceOverrides, promotions);
  const savings = Math.max(0, pricing.originalPrice - pricing.finalPrice);
  const scheduleLevels = quotedScheduleLevels(course, resolvedLevel);
  const packSchedule =
    course.slug === "analisis-de-datos"
      ? getAnalisisSchedule(schedules, scheduleLevels ?? ["Básico", "Intermedio"])
      : null;

  return {
    slug: course.slug,
    title: displayTitle(course, resolvedLevel),
    heroLabel: SHORT_NAME[course.slug] || course.title,
    tagline: course.shortDescription,
    levelName: displayLevel(course, resolvedLevel),
    durationHours: hours,
    startDate: packSchedule
      ? packSchedule.summary
      : getCourseScheduleString(course.slug, resolvedLevel, schedules, hours <= 48),
    startDateLines: packSchedule && packSchedule.lines.length > 0 ? packSchedule.lines : undefined,
    originalPrice: formatCLP(pricing.originalPrice),
    finalPrice: formatCLP(pricing.finalPrice),
    originalPriceValue: pricing.originalPrice,
    finalPriceValue: pricing.finalPrice,
    hasDiscount: pricing.hasDiscount,
    discountPercent: pricing.discountPercent,
    savings: savings > 0 ? formatCLP(savings) : "",
    color: course.accentColor || "#171716",
    checkoutUrl: `https://www.programbi.com/pago?curso=${course.slug}`,
    courseUrl: `https://www.programbi.com/cursos/${course.slug}`,
    includes: course.slug === "analisis-de-datos" ? packIncludes() : undefined,
  };
}

export function buildQuoteModel(
  rawCourses: string[],
  schedules: ScheduleRow[],
  promotions: PromotionRow[],
  priceOverrides: PriceOverrideRow[]
): {
  selected: EmailCourseItem[];
  related: EmailCourseItem[];
  pack: EmailPackInfo;
} {
  const seen = new Set<string>();
  const selected: EmailCourseItem[] = [];

  for (const raw of rawCourses) {
    const slug = resolveCourseSlug(raw);
    if (!slug) continue;
    const course = getCourseBySlug(slug);
    if (!course) continue;
    const levelName = resolveLevelName(raw, course);
    const key = `${slug}::${levelName}`;
    if (seen.has(key)) continue;
    seen.add(key);
    selected.push(toEmailItem(course, levelName, priceOverrides, promotions, schedules));
  }

  if (selected.length === 0) {
    const fallback = getCourseBySlug("analisis-de-datos");
    if (fallback) {
      selected.push(
        toEmailItem(fallback, fallback.levels?.[0]?.name || "Básico", priceOverrides, promotions, schedules)
      );
    }
  }

  selected.sort((a, b) => {
    if (a.slug === "analisis-de-datos" && b.slug !== "analisis-de-datos") return -1;
    if (b.slug === "analisis-de-datos" && a.slug !== "analisis-de-datos") return 1;
    return 0;
  });

  const quotedSlugs = new Set(selected.map((c) => c.slug));
  const primary = selected[0];
  const relatedOrder = [
    ...(RELATED_BY_SLUG[primary?.slug || ""] || DEFAULT_RELATED),
    ...DEFAULT_RELATED,
  ];

  const related: EmailCourseItem[] = [];
  const relatedSeen = new Set<string>();
  for (const slug of relatedOrder) {
    if (quotedSlugs.has(slug) || relatedSeen.has(slug)) continue;
    if (slug === "analitica-mineria" || slug === "analitica-financiera") continue;
    const course = getCourseBySlug(slug);
    if (!course) continue;
    relatedSeen.add(slug);
    related.push(
      toEmailItem(course, course.levels?.[0]?.name || "Básico", priceOverrides, promotions, schedules)
    );
    if (related.length >= 3) break;
  }

  const hasIndividualStack = selected.some((c) =>
    ["power-bi", "sql-server", "python"].includes(c.slug)
  );
  const hasPack = selected.some((c) => c.slug === "analisis-de-datos");
  const showPackRecommendation = hasIndividualStack && !hasPack;

  let pack: EmailPackInfo = {
    showPackRecommendation: false,
    origPrice: "$0",
    offerPrice: "$0",
    savingPercent: 0,
    url: "https://www.programbi.com/cursos/analisis-de-datos",
    checkoutUrl: "https://www.programbi.com/pago?curso=analisis-de-datos",
  };

  if (showPackRecommendation) {
    const packPricing = calculateQuotePrice(
      "analisis-de-datos",
      "Básico",
      priceOverrides,
      promotions
    );
    const savingPercent =
      packPricing.originalPrice > 0
        ? Math.round(
            ((packPricing.originalPrice - packPricing.finalPrice) / packPricing.originalPrice) * 100
          )
        : 0;
    pack = {
      showPackRecommendation: true,
      origPrice: formatCLP(packPricing.originalPrice),
      offerPrice: formatCLP(packPricing.finalPrice),
      savingPercent,
      url: "https://www.programbi.com/cursos/analisis-de-datos",
      checkoutUrl: "https://www.programbi.com/pago?curso=analisis-de-datos",
    };
  }

  const relatedWithoutPackDup = pack.showPackRecommendation
    ? related.filter((c) => c.slug !== "analisis-de-datos")
    : related;

  return { selected, related: relatedWithoutPackDup, pack };
}
