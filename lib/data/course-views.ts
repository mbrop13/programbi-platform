import type { Course, CourseLevel } from "@/lib/data/courses";
import { getCourseSyllabus, levelHours, type SyllabusLevelContent } from "@/lib/data/syllabuses";

/** Ladder sold today as three named levels. Copilot and Power Automate are not in this set. */
export const TIER_NAMES = ["Básico", "Intermedio", "Avanzado"] as const;

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
    durationHours: (basico.durationHours || 0) + (intermedio.durationHours || 0),
    whatYouLearn: learn.filter((item, index) => learn.indexOf(item) === index),
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
  const hours = parts.reduce((sum, part) => sum + levelHours(part), 0);
  const benefits = parts.flatMap((part) => part.benefits ?? []);
  const intros = parts.map((part) => part.intro).filter((intro): intro is string => Boolean(intro));

  return {
    id: "basico-intermedio",
    label: OPEN_LEVEL_NAME,
    shortLabel: hours > 0 ? `${hours}h` : undefined,
    audience: parts.find((part) => part.audience)?.audience,
    benefits: benefits.filter((item, index) => benefits.indexOf(item) === index),
    intro: intros.join(" "),
    modules,
    theme: parts[0].theme,
  };
}

export function levelsForView(course: Course, view: CourseOfferView): CourseLevel[] {
  const levels = course.levels ?? [];
  if (!isTieredCourse(course) || view === "empresas") return levels;
  if (view === "avanzado") return levels.filter((level) => level.name === "Avanzado");
  const open = openCourseLevel(course);
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

/** Hours of the open course: básico and intermedio together. */
export function catalogHours(course: Course): number {
  if (!isTieredCourse(course)) return course.durationHours;
  return openCourseLevel(course)?.durationHours || course.durationHours;
}

export function offerHours(course: Course, view: CourseOfferView): number {
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
  if (view === "publico") {
    const combined = combinedOpenSyllabus(course);
    if (combined) {
      return combined.modules.map((mod) => ({
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
