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
  "machine-learning",
] as const;

const NUEVOS = new Set(["access", "mercado-financiero"]);

const SEARCH_PROMPTS = [
  { line: "¿Te interesa aprender Power BI?", word: "Power BI" },
  { line: "¿Sabes cómo podría ayudarte Claude?", word: "Claude" },
  { line: "¿Quieres aprender Python?", word: "Python" },
  { line: "¿Buscas SQL Server?", word: "SQL Server" },
  { line: "¿Te interesa el análisis de datos?", word: "Análisis de datos" },
  { line: "¿Automatizas con Power Automate?", word: "Power Automate" },
  { line: "¿Quieres manejar Excel?", word: "Excel" },
  { line: "¿Te sirve Copilot en el trabajo?", word: "Copilot" },
] as const;

const TYPE_LINE_MS = 92;
const TYPE_WORD_MS = 135;
const HOLD_MS = 2400;
const DELETE_WORD_MS = 85;
const DELETE_LINE_MS = 46;
const GAP_MS = 700;

type PromptPhase = "type-line" | "type-word" | "delete-word" | "delete-line";

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
  const [promptIndex, setPromptIndex] = useState(0);
  const [typedLine, setTypedLine] = useState("");
  const [typedWord, setTypedWord] = useState("");
  const [promptPhase, setPromptPhase] = useState<PromptPhase>("type-line");
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
    const prompt = SEARCH_PROMPTS[promptIndex];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setTypedLine(prompt.line);
      setTypedWord(prompt.word);
      const id = window.setTimeout(() => {
        setPromptIndex((current) => (current + 1) % SEARCH_PROMPTS.length);
      }, 5600);
      return () => window.clearTimeout(id);
    }

    if (promptPhase === "type-line") {
      if (typedLine.length < prompt.line.length) {
        const id = window.setTimeout(() => {
          setTypedLine(prompt.line.slice(0, typedLine.length + 1));
        }, TYPE_LINE_MS);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => setPromptPhase("type-word"), 0);
      return () => window.clearTimeout(id);
    }

    if (promptPhase === "type-word") {
      if (typedWord.length < prompt.word.length) {
        const id = window.setTimeout(() => {
          setTypedWord(prompt.word.slice(0, typedWord.length + 1));
        }, TYPE_WORD_MS);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => setPromptPhase("delete-word"), HOLD_MS);
      return () => window.clearTimeout(id);
    }

    if (promptPhase === "delete-word") {
      if (typedWord.length > 0) {
        const id = window.setTimeout(() => {
          setTypedWord((current) => current.slice(0, -1));
        }, DELETE_WORD_MS);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => setPromptPhase("delete-line"), 0);
      return () => window.clearTimeout(id);
    }

    if (promptPhase === "delete-line") {
      if (typedLine.length > 0) {
        const id = window.setTimeout(() => {
          setTypedLine((current) => current.slice(0, -1));
        }, DELETE_LINE_MS);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => {
        setTypedLine("");
        setTypedWord("");
        setPromptIndex((current) => (current + 1) % SEARCH_PROMPTS.length);
        setPromptPhase("type-line");
      }, GAP_MS);
      return () => window.clearTimeout(id);
    }

    return;
  }, [searchQuery, searchFocused, promptIndex, typedLine, typedWord, promptPhase]);

  const orderedCourses = orderCatalog(filteredCourses);
  const featured = orderedCourses.find((c) => c.slug === "analisis-de-datos");
  const rest = orderedCourses.filter((c) => c.slug !== "analisis-de-datos");

  return (
    <>
      <section className="px-4 pt-24 pb-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="sr-only">Cursos</h1>
          <p
            aria-hidden="true"
            className="min-h-[3.25rem] text-center text-xl font-semibold tracking-tight text-ink sm:min-h-[3rem] sm:text-2xl"
          >
            {searchQuery ? (
              "\u00a0"
            ) : (
              <>
                {typedLine}
                {typedLine.length > 0 ? (
                  <span className="ml-px inline-block h-[0.9em] w-px translate-y-px bg-ink/70 align-middle motion-safe:animate-pulse" />
                ) : null}
              </>
            )}
          </p>
          <div className="relative mt-4">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <label htmlFor="course-search" className="sr-only">
              Buscar curso
            </label>
            {searchQuery || searchFocused ? null : (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 left-12 flex -translate-y-1/2 items-center truncate text-base text-ink"
              >
                {typedWord}
                <span className="ml-px inline-block h-5 w-px shrink-0 bg-ink/70 motion-safe:animate-pulse" />
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
                <span className="mt-5 inline-flex text-sm font-semibold text-ink">Ver temario</span>
                <div className="mt-5">
                  <CourseCohortFacts
                    slug={featured.slug}
                    schedules={schedules}
                    timeZone={timeZone}
                    pais={pais}
                    loaded
                    medium
                  />
                </div>
              </Link>
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
