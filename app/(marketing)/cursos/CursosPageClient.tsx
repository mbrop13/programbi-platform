"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CourseImage from "@/components/shared/CourseImage";
import { CourseCohortFacts } from "@/components/marketing/CourseCohortStrip";
import FeaturedCourseStrip from "@/components/marketing/FeaturedCourseStrip";
import { Clock, Search } from "lucide-react";
import { trackCourseCardClick } from "@/lib/analytics/marketing";
import { type CourseSchedule } from "@/lib/data/course-schedules";
import { WA_URL } from "@/lib/data/site";
import { usePaisRuta, useRutaLocal } from "@/lib/paises/cliente";
import { zonaDe } from "@/lib/paises/horarios";

const CATALOG_ORDER = [
  "analisis-de-datos",
  "power-bi",
  "mercado-financiero",
  "claude",
  "sql-server",
  "python",
  "excel",
  "access",
  "copilot",
  "power-automate",
  "ia-productividad",
  "analitica-mineria",
  "analitica-financiera",
  "machine-learning",
] as const;

const NUEVOS = new Set(["access", "mercado-financiero"]);

const SEARCH_HINTS = [
  "¿Quieres aprender Power BI?",
  "¿Cómo te podría ayudar Claude?",
  "¿Buscas SQL Server o Python?",
  "¿Te interesa análisis de datos?",
  "¿Automatizar con Power Automate?",
] as const;

function orderCatalog(list: CourseCatalogItem[]): CourseCatalogItem[] {
  const bySlug = new Map(list.map((course) => [course.slug, course]));
  const listed = CATALOG_ORDER.map((slug) => bySlug.get(slug)).filter((course): course is CourseCatalogItem => Boolean(course));
  const rest = list.filter((course) => !CATALOG_ORDER.includes(course.slug as (typeof CATALOG_ORDER)[number]));
  return [...listed, ...rest];
}

export type CourseCatalogItem = {
  slug: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  durationHours: number;
  levelsCount?: number;
  techStack: string[];
  gallery?: { src: string; alt: string }[];
};

export default function CursosPageClient({
  catalog,
  schedules,
  preciosLocales = {},
}: {
  catalog: CourseCatalogItem[];
  schedules: CourseSchedule[];
  /** Precio ya formateado por curso, por ejemplo "$159.900 ARS". Vacío en Chile. */
  preciosLocales?: Record<string, string>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const pais = usePaisRuta();
  const hrefLocal = useRutaLocal();
  const timeZone = zonaDe(pais);

  const filteredCourses = catalog.filter((course) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      course.title.toLowerCase().includes(q) ||
      course.techStack.some((t) => t.toLowerCase().includes(q)) ||
      course.shortDescription.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (searchQuery || searchFocused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setHintIndex((current) => (current + 1) % SEARCH_HINTS.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [searchQuery, searchFocused]);

  const orderedCourses = orderCatalog(filteredCourses);
  const featured = orderedCourses.find((c) => c.slug === "analisis-de-datos");
  const rest = orderedCourses.filter((c) => c.slug !== "analisis-de-datos");

  return (
    <>
      <section className="px-4 pt-24 pb-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="sr-only">Cursos</h1>
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <label htmlFor="course-search" className="sr-only">
              Buscar curso
            </label>
            {searchQuery ? null : (
              <span
                key={hintIndex}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 left-12 -translate-y-1/2 truncate text-base text-faint motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
              >
                {SEARCH_HINTS[hintIndex]}
              </span>
            )}
            <input
              id="course-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="h-14 w-full rounded-2xl border border-line-strong bg-paper pl-12 pr-4 text-base text-ink outline-none transition-colors focus:border-ink/40"
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      <section className="px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-10 lg:pb-16">
        <div className="mx-auto max-w-[1400px] space-y-5">
          {featured && (
            <article className="grid overflow-hidden rounded-[26px] border border-line bg-paper transition-colors hover:border-ink/20 lg:grid-cols-12">
              <div className="min-w-0 p-3 pb-0 sm:p-4 sm:pb-0 lg:col-span-7 lg:p-5 lg:pb-0">
                {featured.gallery && featured.gallery.length > 1 ? (
                  <FeaturedCourseStrip
                    title="Curso de análisis de datos"
                    images={featured.gallery}
                    href={hrefLocal(`/cursos/${featured.slug}`)}
                    onNavigate={() => trackCourseCardClick(featured.slug, "cursos_catalog")}
                  />
                ) : (
                  <Link
                    href={hrefLocal(`/cursos/${featured.slug}`)}
                    onClick={() => trackCourseCardClick(featured.slug, "cursos_catalog")}
                    className="relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-line bg-wash"
                  >
                    <CourseImage
                      src={featured.imageUrl}
                      alt={featured.title}
                      fill
                      preload
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  </Link>
                )}
              </div>
              <Link
                href={hrefLocal(`/cursos/${featured.slug}`)}
                onClick={() => trackCourseCardClick(featured.slug, "cursos_catalog")}
                className="flex flex-col justify-center px-6 py-6 no-underline lg:col-span-5 lg:px-8 lg:py-6"
              >
                <p className="text-xs font-semibold text-mute">
                  60 horas por nivel · básico-intermedio y avanzado
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Curso de análisis de datos
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mute">{featured.shortDescription}</p>
                <p className="mt-4 text-sm font-semibold text-ink">SQL · Power BI · Python</p>
                {preciosLocales[featured.slug] ? (
                  <p className="mt-3 text-sm font-semibold text-ink">{preciosLocales[featured.slug]}</p>
                ) : null}
                <span className="mt-6 inline-flex text-sm font-semibold text-ink">Ver temario</span>
              </Link>
              <div className="px-4 py-4 lg:col-span-12 lg:px-5 lg:pt-4 lg:pb-5">
                <CourseCohortFacts
                  slug={featured.slug}
                  schedules={schedules}
                  timeZone={timeZone}
                  pais={pais}
                  loaded
                  compact
                />
              </div>
            </article>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((course) => (
              <Link
                key={course.slug}
                href={hrefLocal(`/cursos/${course.slug}`)}
                onClick={() => trackCourseCardClick(course.slug, "cursos_catalog")}
                className="group overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-colors hover:border-ink/20"
              >
                <div className="relative aspect-[16/10] bg-wash">
                  <CourseImage
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {NUEVOS.has(course.slug) ? (
                    <span className="absolute right-4 top-4 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-canvas shadow-sm">
                      Nuevo
                    </span>
                  ) : null}
                </div>
                <div className="px-4 pt-4">
                  <CourseCohortFacts
                    slug={course.slug}
                    schedules={schedules}
                    timeZone={timeZone}
                    pais={pais}
                    loaded
                    compact
                  />
                </div>
                <div className="px-6 py-5">
                  <h2 className="text-xl font-bold tracking-tight text-ink">
                    {course.slug === "power-bi"
                      ? "Curso Power BI"
                      : course.slug === "power-automate"
                        ? "Curso Power Automate"
                        : course.title}
                  </h2>
                  <p className="mt-1 text-sm text-mute">{course.shortDescription}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-xs text-faint">
                    <Clock size={12} /> {course.durationHours} h · En vivo
                    {course.levelsCount && course.levelsCount > 1 ? ` · ${course.levelsCount} niveles` : ""}
                  </p>
                  {preciosLocales[course.slug] ? (
                    <p className="mt-2 text-sm font-semibold text-ink">{preciosLocales[course.slug]}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-mute">No se encontraron cursos con esa búsqueda.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas"
                >
                  Ver todos los cursos
                </button>
                <Link
                  href={hrefLocal("/empresas")}
                  className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink no-underline"
                >
                  Capacitación para empresas
                </Link>
                <a
                  href={WA_URL}
                  className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink no-underline"
                >
                  Contactar
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
