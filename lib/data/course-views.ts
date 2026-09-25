import type { Course, CourseLevel } from "@/lib/data/courses";
import { getCourseSyllabus } from "@/lib/data/syllabuses";

/** Ladder sold today as three named levels. Copilot and Power Automate are not in this set. */
export const TIER_NAMES = ["Básico", "Intermedio", "Avanzado"] as const;

export type CourseOfferView = "publico" | "avanzado" | "empresas";

export function isTieredCourse(course: Course): boolean {
  const names = new Set((course.levels ?? []).map((level) => level.name));
  return TIER_NAMES.every((name) => names.has(name));
}

export function levelsForView(course: Course, view: CourseOfferView): CourseLevel[] {
  const levels = course.levels ?? [];
  if (!isTieredCourse(course) || view === "empresas") return levels;
  if (view === "avanzado") return levels.filter((level) => level.name === "Avanzado");
  return levels.filter((level) => level.name === "Básico" || level.name === "Intermedio");
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

/** Hours shown on catalog cards. Rolled-up totals (144 h, 48 h) drop the advanced level. */
export function catalogHours(course: Course): number {
  if (!isTieredCourse(course)) return course.durationHours;
  const open = levelsForView(course, "publico");
  const perLevel = open[0]?.durationHours || course.durationHours;
  if (course.durationHours > perLevel) {
    return open.reduce((sum, level) => sum + (level.durationHours || 0), 0);
  }
  return perLevel;
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
