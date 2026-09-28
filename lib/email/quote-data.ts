/**
 * Quote-email data: resolve courses from the lead form, platform prices
 * (catalog + overrides + promos), schedules, and related-course order.
 */

import { courses, getCourseBySlug, type Course } from "@/lib/data/courses";
import { staticSchedules, OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
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

function formatEmailDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
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

function isFutureDate(dateStr: string): boolean {
  const d = new Date(dateStr + "T12:00:00");
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

function pickSchedules(
  list: ScheduleRow[],
  slug: string,
  levelName: string
): ScheduleRow[] {
  const future = list.filter(
    (s) =>
      s.course_slug === slug &&
      s.is_active !== false &&
      isFutureDate(s.start_date)
  );
  const levelMatch = future.filter((s) => s.level_name === levelName);
  const rows = (levelMatch.length > 0 ? levelMatch : future).slice();
  rows.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  return rows;
}

function formatScheduleLine(sched: ScheduleRow, withTime: boolean): string {
  const dateFormatted = formatEmailDate(sched.start_date);
  const daysFormatted = formatEmailDays(sched.schedule_days);
  if (withTime) {
    const timeFormatted = formatEmailTime(sched.schedule_time);
    return [dateFormatted, daysFormatted, timeFormatted].filter(Boolean).join(" · ");
  }
  return [dateFormatted, daysFormatted].filter(Boolean).join(" · ");
}

function getAnalisisSchedule(schedulesList: ScheduleRow[]): { summary: string; lines: string[] } {
  const lines: string[] = [];
  let earliest: { time: number; label: string } | null = null;

  for (const mod of PACK_MODULES) {
    let modRows = pickSchedules(schedulesList, mod.slug, "Básico");
    if (modRows.length === 0) {
      modRows = pickSchedules(staticSchedules as ScheduleRow[], mod.slug, "Básico");
    }
    if (!modRows[0]) continue;
    const dateLabel = formatEmailDate(modRows[0].start_date);
    lines.push(`${mod.label} · ${dateLabel}`);
    const time = new Date(modRows[0].start_date + "T12:00:00").getTime();
    if (!earliest || time < earliest.time) {
      earliest = { time, label: dateLabel };
    }
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
  if (slug === "analisis-de-datos") {
    return getAnalisisSchedule(schedulesList).summary;
  }

  let rows = pickSchedules(schedulesList, slug, levelName);
  if (rows.length === 0) {
    rows = pickSchedules(staticSchedules as ScheduleRow[], slug, levelName);
  }

  if (rows.length === 0) return OPEN_COHORT_LABEL;
  if (rows.length === 1) return formatScheduleLine(rows[0], withTime);
  return rows
    .slice(0, 3)
    .map((sched, idx) => `Opción ${idx + 1}: ${formatScheduleLine(sched, withTime)}`)
    .join("  |  ");
}

function packIncludes(): string[] {
  return ["SQL Server · 16 h", "Power BI · 16 h", "Python · 16 h"];
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
  const packSchedule =
    course.slug === "analisis-de-datos" ? getAnalisisSchedule(schedules) : null;

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
