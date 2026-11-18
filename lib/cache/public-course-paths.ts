import { PAISES_CARPETA } from "@/config/paises";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import { analisisDeDatosSlugs } from "@/lib/data/course-schedules";

const prefixes = ["", ...PAISES_CARPETA.map((pais) => `/${pais.iso}`)];

/** Concrete URLs keep an edit to one course from expiring the whole catalog. */
export function publicCoursePaths(slug: string): string[] {
  const course = getCourseBySlug(slug);
  if (!course) return [];
  return prefixes.flatMap((prefix) => [
    `${prefix}/cursos/${course.slug}`,
    `${prefix}/cursos/${course.slug}/brochure`,
  ]);
}

/** Schedules also appear in the home, catalog, landings and the combined pack. */
export function publicSchedulePaths(slug: string): string[] {
  if (!courses.some((course) => course.slug === slug)) return [];
  const paths = new Set(publicCoursePaths(slug));
  if (analisisDeDatosSlugs.includes(slug)) {
    publicCoursePaths("analisis-de-datos").forEach((path) => paths.add(path));
  }
  for (const prefix of prefixes) {
    paths.add(prefix || "/");
    paths.add(`${prefix}/cursos`);
    if (slug === "python") paths.add(`${prefix}/curso-python`);
    if (slug === "sql-server") paths.add(`${prefix}/curso-sql-online`);
  }
  return [...paths];
}

/** Public pages affected when a promotion or price override changes. */
export function publicPricingPaths(slug?: string | null): string[] {
  const paths = new Set<string>();
  const targetSlugs =
    slug && courses.some((course) => course.slug === slug)
      ? [slug]
      : courses.map((course) => course.slug);

  for (const itemSlug of targetSlugs) {
    publicSchedulePaths(itemSlug).forEach((path) => paths.add(path));
  }
  for (const prefix of prefixes) {
    paths.add(`${prefix}/precios`);
    paths.add(`${prefix}/guias`);
  }
  paths.add("/us/miami");
  return [...paths];
}
