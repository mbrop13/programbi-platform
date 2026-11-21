"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Clock } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { COURSE_FILTER_GROUPS } from "@/lib/data/course-nav";
import {
  OPEN_COHORT_LABEL,
  nextCohortForCourse,
  type CourseSchedule,
} from "@/lib/data/course-schedules";
import { trackCourseCardClick } from "@/lib/analytics/marketing";
import { usePaisRuta, useRutaLocal } from "@/lib/paises/cliente";
import { zonaDe } from "@/lib/paises/horarios";
import { usePriceUnlock } from "@/hooks/usePriceUnlock";
import { muestraPrecioDirecto } from "@/config/paises";
import {
  descuentoPublico,
  formatMoneda,
  precioVenta,
  type PromocionAplicable,
} from "@/lib/paises/precios";

const ORDER = [
  "analisis-de-datos",
  "power-bi",
  "sql-server",
  "python",
  "excel",
  "claude",
  "access",
  "analitica-mineria",
  "mercado-financiero",
  "ia-productividad",
  "copilot",
  "power-automate",
  "machine-learning",
] as const;

const VISIBLE_COUNT = 6;

type Filtro = "todos" | (typeof COURSE_FILTER_GROUPS)[number]["id"];

export type ProgramCard = {
  slug: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  durationHours: number;
  techStack: string[];
  badgeLabel?: string;
  levelsCount: number;
};

function orderCatalog(list: ProgramCard[]): ProgramCard[] {
  const bySlug = new Map(list.map((c) => [c.slug, c]));
  const listed = ORDER.map((slug) => bySlug.get(slug)).filter((c): c is ProgramCard => Boolean(c));
  const rest = list.filter((c) => !ORDER.includes(c.slug as (typeof ORDER)[number]));
  return [...listed, ...rest];
}

function isNew(course: ProgramCard) {
  return course.badgeLabel?.toLowerCase().includes("nuevo") ?? false;
}

function courseTitle(course: ProgramCard) {
  if (course.slug === "power-bi") return "Curso Power BI";
  if (course.slug === "power-automate") return "Curso Power Automate";
  return course.title;
}

/** "Lunes, 7 de diciembre de 2026" -> "lunes 7 de diciembre". */
function fechaCorta(fecha: string) {
  const sinAnio = fecha.replace(",", "").replace(/ de \d{4}$/, "");
  return sinAnio.charAt(0).toLowerCase() + sinAnio.slice(1);
}

export default function Programs({
  catalog,
  schedules,
  promotions = [],
}: {
  catalog: ProgramCard[];
  schedules: CourseSchedule[];
  promotions?: readonly PromocionAplicable[];
}) {
  const { unlocked } = usePriceUnlock();
  const ALL = orderCatalog(catalog);
  const [expanded, setExpanded] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const pais = usePaisRuta();
  const showPrice = unlocked || muestraPrecioDirecto(pais);
  const hrefLocal = useRutaLocal();
  const timeZone = zonaDe(pais);
  if (!ALL.length) return null;

  const enCatalogo = new Set(ALL.map((c) => c.slug));
  const grupos = COURSE_FILTER_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    slugs: g.slugs.filter((slug) => enCatalogo.has(slug)),
  })).filter((g) => g.slugs.length > 0);
  const grupoActivo = grupos.find((g) => g.id === filtro);

  const featuredCourse = filtro === "todos" ? ALL[0] : null;
  const featuredPrecio = featuredCourse ? precioVenta(pais, featuredCourse.slug, promotions) : null;
  const featuredDescuento = featuredCourse ? descuentoPublico(pais, featuredCourse.slug, promotions) : 0;
  const featuredCohorte =
    featuredCourse && schedules.length
      ? nextCohortForCourse(featuredCourse.slug, schedules, timeZone)
      : null;

  // Todas las tarjetas quedan en el HTML (enlaces internos); el filtro y el
  // "ver todos" solo las ocultan con CSS.
  const oculta = (slug: string, idx: number) => {
    if (grupoActivo) return !grupoActivo.slugs.includes(slug);
    if (idx === 0) return true;
    return !expanded && idx >= VISIBLE_COUNT;
  };

  const visibleGridCount = ALL.filter((course, idx) => !oculta(course.slug, idx)).length;
  const noMatches = Boolean(grupoActivo && visibleGridCount === 0);

  const filterBtnClass = (activa: boolean) =>
    `inline-flex min-h-[44px] sm:min-h-[38px] shrink-0 items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition-colors ${
      activa
        ? "border-[var(--h-ink)] bg-[var(--h-ink)] text-[var(--h-surface)]"
        : "border-[var(--h-border-strong)] bg-[var(--h-surface)] text-[var(--h-muted)] hover:border-[var(--h-ink)] hover:text-[var(--h-ink)]"
    }`;

  return (
    <section
      id="programas"
      className="home-scope cv-auto border-t border-[var(--h-border)] bg-[var(--h-bg)] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 border-b border-[var(--h-border)] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--h-ink)] sm:text-4xl lg:text-[2.75rem]">
              Catálogo de cursos
            </h2>
            <p className="mt-3 max-w-[44rem] text-base leading-relaxed text-[var(--h-muted)]">
              <span className="font-semibold tabular-nums text-[var(--h-ink)]">{ALL.length}</span>{" "}
              programas en vivo por Zoom: análisis de datos, visualización, bases de datos y
              productividad aplicada.
            </p>
          </div>
          <Link
            href={hrefLocal("/cursos")}
            className="inline-flex min-h-[44px] shrink-0 items-center text-sm font-semibold text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
          >
            Ver catálogo completo
          </Link>
        </div>

        <div
          role="group"
          aria-label="Filtrar cursos por categoría"
          className="scrollbar-hide -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0"
        >
          <button
            type="button"
            aria-pressed={filtro === "todos"}
            onClick={() => setFiltro("todos")}
            className={filterBtnClass(filtro === "todos")}
          >
            <span>Todos</span>
            <span className="text-xs font-medium tabular-nums opacity-75">{ALL.length}</span>
          </button>
          {grupos.map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={filtro === g.id}
              onClick={() => setFiltro(g.id)}
              className={filterBtnClass(filtro === g.id)}
            >
              <span>{g.label}</span>
              <span className="text-xs font-medium tabular-nums opacity-75">{g.slugs.length}</span>
            </button>
          ))}
        </div>

        {featuredCourse ? (
          <article className="mt-8 overflow-hidden rounded-xl border border-[var(--h-border-strong)] bg-[var(--h-surface)]">
            <Link
              href={hrefLocal(`/cursos/${featuredCourse.slug}`)}
              onClick={() => trackCourseCardClick(featuredCourse.slug, "home_programs")}
              className="group grid grid-cols-1 no-underline lg:grid-cols-12"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--h-wash)] lg:col-span-6">
                <CourseImage
                  src={featuredCourse.imageUrl}
                  alt={featuredCourse.title}
                  width={960}
                  height={600}
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {(isNew(featuredCourse) || featuredDescuento > 0) ? (
                  <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                    {isNew(featuredCourse) ? (
                      <span className="rounded-md bg-[var(--h-ink)] px-2.5 py-1 text-xs font-semibold text-[var(--h-surface)]">
                        Nuevo
                      </span>
                    ) : (
                      <span />
                    )}
                    {featuredDescuento > 0 ? (
                      <span className="rounded-md border border-[var(--h-border-strong)] bg-[var(--h-surface)] px-2.5 py-1 text-xs font-bold tabular-nums text-[var(--h-ink)]">
                        {featuredDescuento}% descuento
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6 lg:p-10">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--h-muted)]"
                      data-cohort-strip=""
                      data-cohort-time={featuredCohorte?.time ?? ""}
                    >
                      <span
                        className={`size-2 shrink-0 rounded-full ${
                          featuredCohorte ? "bg-[var(--h-accent)]" : "bg-[var(--h-border-strong)]"
                        }`}
                        aria-hidden
                      />
                      {featuredCohorte
                        ? `Próxima cohorte: ${fechaCorta(featuredCohorte.date)}`
                        : OPEN_COHORT_LABEL}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs tabular-nums text-[var(--h-subtle)]">
                      <Clock size={13} aria-hidden />
                      {featuredCourse.durationHours} h en vivo
                      {featuredCourse.levelsCount > 1 ? ` · ${featuredCourse.levelsCount} niveles` : ""}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-[var(--h-ink)] transition-colors group-hover:text-[var(--h-accent)] sm:text-3xl">
                    {courseTitle(featuredCourse)}
                  </h3>
                  <p className="mt-3 max-w-[54ch] text-base leading-relaxed text-[var(--h-muted)]">
                    {featuredCourse.shortDescription}
                  </p>

                  {featuredCourse.techStack.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Herramientas del programa">
                      {featuredCourse.techStack.slice(0, 5).map((tech) => (
                        <li
                          key={tech}
                          className="rounded-md bg-[var(--h-wash)] px-2.5 py-1 text-xs font-medium text-[var(--h-muted)]"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {featuredCohorte ? (
                    <p className="mt-4 text-sm text-[var(--h-subtle)]">
                      {featuredCohorte.days} · {featuredCohorte.time}
                    </p>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--h-border)] pt-6">
                  <div>
                    {showPrice && featuredPrecio != null ? (
                      <p className="text-xl font-bold tabular-nums text-[var(--h-ink)]">
                        {formatMoneda(pais, featuredPrecio)}
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-[var(--h-subtle)]">
                        Temario, fechas y arancel vigentes
                      </p>
                    )}
                  </div>
                  <span className="inline-flex min-h-[44px] items-center rounded-lg bg-[var(--h-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--h-surface)] transition-opacity group-hover:opacity-90">
                    Ver programa completo
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ) : null}

        {noMatches ? (
          <div className="mt-8 rounded-xl border border-[var(--h-border)] bg-[var(--h-surface)] p-8 text-center">
            <p className="text-base font-semibold text-[var(--h-ink)]">
              No hay cursos disponibles en esta categoría.
            </p>
            <p className="mt-2 text-sm text-[var(--h-muted)]">
              Puedes volver al catálogo completo para revisar todos los programas en vivo.
            </p>
            <button
              type="button"
              onClick={() => setFiltro("todos")}
              className="mt-5 inline-flex min-h-[44px] items-center rounded-lg bg-[var(--h-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--h-surface)]"
            >
              Mostrar todos los cursos
            </button>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ALL.map((course, idx) => {
            const precio = precioVenta(pais, course.slug, promotions);
            const descuento = descuentoPublico(pais, course.slug, promotions);
            const cohorte = schedules.length
              ? nextCohortForCourse(course.slug, schedules, timeZone)
              : null;
            return (
              <Link
                key={course.slug}
                href={hrefLocal(`/cursos/${course.slug}`)}
                onClick={() => trackCourseCardClick(course.slug, "home_programs")}
                className={`group flex-col overflow-hidden rounded-xl border border-[var(--h-border)] bg-[var(--h-surface)] no-underline transition-colors duration-200 hover:border-[var(--h-border-strong)] ${
                  oculta(course.slug, idx) ? "hidden" : "flex"
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--h-wash)]">
                  <CourseImage
                    src={course.imageUrl}
                    alt={course.title}
                    width={640}
                    height={400}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {(isNew(course) || descuento > 0) ? (
                    <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                      {isNew(course) ? (
                        <span className="rounded-md bg-[var(--h-ink)] px-2.5 py-1 text-xs font-semibold text-[var(--h-surface)]">
                          Nuevo
                        </span>
                      ) : (
                        <span />
                      )}
                      {descuento > 0 ? (
                        <span className="rounded-md border border-[var(--h-border-strong)] bg-[var(--h-surface)] px-2.5 py-1 text-xs font-bold tabular-nums text-[var(--h-ink)]">
                          {descuento}% descuento
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p
                    className="flex items-center gap-2 text-xs font-semibold text-[var(--h-muted)]"
                    data-cohort-strip=""
                    data-cohort-time={cohorte?.time ?? ""}
                  >
                    <span
                      className={`size-2 shrink-0 rounded-full ${
                        cohorte ? "bg-[var(--h-accent)]" : "bg-[var(--h-border-strong)]"
                      }`}
                      aria-hidden
                    />
                    {cohorte ? `Inicia ${fechaCorta(cohorte.date)}` : OPEN_COHORT_LABEL}
                  </p>

                  <h3 className="mt-2.5 text-xl font-bold tracking-tight text-[var(--h-ink)] transition-colors group-hover:text-[var(--h-accent)]">
                    {courseTitle(course)}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--h-muted)]">
                    {course.shortDescription}
                  </p>

                  {course.techStack.length > 0 ? (
                    <p className="mt-3 truncate text-xs text-[var(--h-subtle)]">
                      {course.techStack.slice(0, 3).join(" · ")}
                    </p>
                  ) : null}

                  {cohorte ? (
                    <p className="mt-2 text-xs tabular-nums text-[var(--h-subtle)]">
                      {cohorte.days} · {cohorte.time}
                    </p>
                  ) : null}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--h-border)] pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs tabular-nums text-[var(--h-subtle)]">
                      <Clock size={13} aria-hidden /> {course.durationHours} h · En vivo
                      {course.levelsCount > 1 ? ` · ${course.levelsCount} niveles` : ""}
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--h-ink)] group-hover:text-[var(--h-accent)]">
                      {showPrice && precio != null ? formatMoneda(pais, precio) : "Ver programa"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!grupoActivo && ALL.length > VISIBLE_COUNT ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--h-border-strong)] bg-[var(--h-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--h-ink)] transition-colors hover:border-[var(--h-ink)]"
            >
              {expanded ? "Ocultar cursos adicionales" : `Mostrar todos los cursos (${ALL.length})`}
              <ChevronDown
                size={16}
                aria-hidden
                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
