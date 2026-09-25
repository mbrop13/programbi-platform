import type { Course, CourseLevel } from "@/lib/data/courses";
import { getCourseSyllabus, type SyllabusLevelContent, type SyllabusModule } from "@/lib/data/syllabuses";

/** Ladder sold today as three named levels. Copilot and Power Automate are not in this set. */
export const TIER_NAMES = ["Básico", "Intermedio", "Avanzado"] as const;

/** Básico-Intermedio and Avanzado, each, when sold to individuals. Empresas keep each level's own hours. */
export const PARTICULAR_COURSE_HOURS = 20;

const MODULE_HOUR_PREFIX = /^(?:\d+\s*horas?|\d+\s*h)\s*[•·]\s*/i;
const MODULE_TITLE_HOURS = /\s*\(\d+\s*h(?:oras?)?\)/gi;

export type CourseOfferView = "publico" | "avanzado" | "empresas";

export function isTieredCourse(course: Course): boolean {
  const names = new Set((course.levels ?? []).map((level) => level.name));
  return TIER_NAMES.every((name) => names.has(name));
}

export const OPEN_LEVEL_NAME = "Básico-Intermedio";

function levelByName(course: Course, name: string): CourseLevel | undefined {
  return course.levels?.find((level) => level.name === name);
}

/** One open course: the published básico and intermedio blocks, without a new price. */
export function openCourseLevel(course: Course): CourseLevel | null {
  const basico = levelByName(course, "Básico");
  const intermedio = levelByName(course, "Intermedio");
  if (!basico || !intermedio) return null;
  const learn = [...basico.whatYouLearn, ...intermedio.whatYouLearn];
  return {
    name: OPEN_LEVEL_NAME,
    price: basico.price,
    originalPrice: basico.originalPrice,
    durationHours: PARTICULAR_COURSE_HOURS,
    whatYouLearn: learn.filter((item, index) => learn.indexOf(item) === index),
  };
}

function particularModule(mod: SyllabusModule): SyllabusModule {
  const subtitle = mod.subtitle?.replace(MODULE_HOUR_PREFIX, "").trim();
  return {
    ...mod,
    title: mod.title.replace(MODULE_TITLE_HOURS, "").trim(),
    hours: undefined,
    subtitle: subtitle || undefined,
  };
}

/** Particular pages state one course length. Per-module hour chips stay on the empresas temario. */
function asParticularLevel(level: SyllabusLevelContent): SyllabusLevelContent {
  return {
    ...level,
    shortLabel: `${PARTICULAR_COURSE_HOURS}h`,
    modules: level.modules.map(particularModule),
  };
}

function partName(label: string): string {
  return label.replace(/^Nivel\s+[IVX]+:\s*/i, "").replace(/^Nivel:\s*/i, "").trim() || label;
}

/** Original básico and intermedio modules, in that order, as one temario. */
export function combinedOpenSyllabus(course: Course): SyllabusLevelContent | null {
  if (!isTieredCourse(course)) return null;
  const data = getCourseSyllabus(course);
  const parts = ["Básico", "Intermedio"]
    .map((name) => data.levels[syllabusIndexForLevel(course, name)])
    .filter((part): part is SyllabusLevelContent => Boolean(part));
  if (parts.length < 2) return null;

  const modules = parts.flatMap((part) => {
    const name = partName(part.label);
    return part.modules.map((mod) => ({
      ...mod,
      id: `${part.id}-${mod.id}`,
      title: mod.title.startsWith(name) ? mod.title : `${name} · ${mod.title}`,
    }));
  });
  const benefits = parts.flatMap((part) => part.benefits ?? []);
  const intros = parts.map((part) => part.intro).filter((intro): intro is string => Boolean(intro));

  return asParticularLevel({
    id: "basico-intermedio",
    label: OPEN_LEVEL_NAME,
    audience: parts.find((part) => part.audience)?.audience,
    benefits: benefits.filter((item, index) => benefits.indexOf(item) === index),
    intro: intros.join(" "),
    modules,
    theme: parts[0].theme,
  });
}

/** Temario shown on a particular page. Empresas keeps each level's own hours. */
export function offerSyllabusLevel(course: Course, view: CourseOfferView): SyllabusLevelContent | null {
  if (!isTieredCourse(course) || view === "empresas") return null;
  if (view === "publico") return combinedOpenSyllabus(course);
  const part = getCourseSyllabus(course).levels[syllabusIndexForLevel(course, "Avanzado")];
  return part ? asParticularLevel(part) : null;
}

export function levelsForView(course: Course, view: CourseOfferView): CourseLevel[] {
  const levels = course.levels ?? [];
  if (!isTieredCourse(course) || view === "empresas") return levels;
  if (view === "avanzado") {
    return levels
      .filter((level) => level.name === "Avanzado")
      .map((level) => ({ ...level, durationHours: PARTICULAR_COURSE_HOURS }));
  }
  const open = openCourseLevel(course);
  const advanced = levelByName(course, "Avanzado");
  if (open && advanced) {
    return [open, { ...advanced, durationHours: PARTICULAR_COURSE_HOURS }];
  }
  return open ? [open] : levels.filter((level) => level.name === "Básico" || level.name === "Intermedio");
}

export function syllabusIndexForLevel(course: Course, levelName: string | undefined): number {
  if (!levelName) return 0;
  const index = (course.levels ?? []).findIndex((level) => level.name === levelName);
  return index >= 0 ? index : 0;
}

export function publicLevelCount(course: Course): number {
  const count = levelsForView(course, "publico").length;
  return count > 0 ? count : 1;
}

/** Hours on the public catalog: 20 for each particular course, the stored length otherwise. */
export function catalogHours(course: Course): number {
  if (!isTieredCourse(course)) return course.durationHours;
  return openCourseLevel(course)?.durationHours || course.durationHours;
}

export function offerHours(course: Course, view: CourseOfferView): number {
  if (isTieredCourse(course) && view !== "empresas") return PARTICULAR_COURSE_HOURS;
  const levels = levelsForView(course, view);
  const sum = levels.reduce((total, level) => total + (level.durationHours ?? 0), 0);
  return sum > 0 ? sum : course.durationHours;
}

export function offerLowPrice(course: Course, view: CourseOfferView): number | undefined {
  const prices = levelsForView(course, view)
    .map((level) => level.price ?? 0)
    .filter((price) => price > 0);
  return prices.length ? Math.min(...prices) : undefined;
}

export function offerTeaches(course: Course, view: CourseOfferView): string[] {
  const fromLevels = levelsForView(course, view).flatMap((level) => level.whatYouLearn);
  return fromLevels.length > 0 ? fromLevels : course.whatYouLearn;
}

export function levelIntro(course: Course, levelName: string): string | undefined {
  const data = getCourseSyllabus(course);
  return data.levels[syllabusIndexForLevel(course, levelName)]?.intro;
}

export function offerSyllabusSections(
  course: Course,
  view: CourseOfferView
): { name: string; description: string }[] {
  if (view !== "empresas") {
    const offered = offerSyllabusLevel(course, view);
    if (offered) {
      return offered.modules.map((mod) => ({
        name: mod.title,
        description: mod.topics
          .map((topic) => (typeof topic === "string" ? topic : topic.title))
          .join(", "),
      }));
    }
  }
  const data = getCourseSyllabus(course);
  return levelsForView(course, view).flatMap((level) => {
    const content = data.levels[syllabusIndexForLevel(course, level.name)];
    if (!content) return [];
    return content.modules.map((mod) => ({
      name: mod.title,
      description: mod.topics
        .map((topic) => (typeof topic === "string" ? topic : topic.title))
        .join(", "),
    }));
  });
}

export function coursePath(slug: string, view: CourseOfferView = "publico"): string {
  if (view === "avanzado") return `/cursos/${slug}/avanzado`;
  if (view === "empresas") return `/cursos/${slug}/empresas`;
  return `/cursos/${slug}`;
}

export function empresaQuotePath(slug: string, levelName?: string): string {
  const params = new URLSearchParams({ curso: slug });
  if (levelName) params.set("nivel", levelName);
  return `/empresas?${params.toString()}#contacto`;
}

export function advancedHeading(base: string): string {
  if (/avanzado/i.test(base)) return base;
  if (base.includes(" en vivo")) return base.replace(" en vivo", " avanzado en vivo");
  return `Curso avanzado de ${base}`;
}

export function advancedMetaTitle(courseTitle: string): string {
  const full = `Curso ${courseTitle} avanzado en vivo | ProgramBI`;
  if (full.length <= 60) return full;
  const short = `${courseTitle} avanzado | ProgramBI`;
  return short.length <= 60 ? short : short.slice(0, 60);
}

export function empresaMetaTitle(courseTitle: string): string {
  const suffix = " · empresas | ProgramBI";
  const full = `${courseTitle}${suffix}`;
  if (full.length <= 60) return full;
  return `${courseTitle.slice(0, 60 - suffix.length).trimEnd()}${suffix}`;
}
