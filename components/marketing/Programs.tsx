"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Clock } from "lucide-react";
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
import { descuentoPublico, formatMoneda, precioVenta, type PromocionAplicable } from "@/lib/paises/precios";

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

/** «Lunes, 7 de diciembre de 2026» → «lunes 7 de diciembre». */
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

  // Todas las tarjetas quedan en el HTML (enlaces internos); el filtro y el
  // «ver todos» solo las ocultan con CSS.
  const oculta = (slug: string, idx: number) =>
    grupoActivo ? !grupoActivo.slugs.includes(slug) : !expanded && idx >= VISIBLE_COUNT;

  const pastilla = (activa: boolean) =>
    `inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors ${
      activa
        ? "border-ink bg-ink text-paper"
        : "border-line bg-paper text-mute hover:border-ink/25 hover:text-ink"
    }`;

  return (
    <section id="programas" className="cv-auto border-t border-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">Cursos</h2>
            <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">
              {ALL.length} programas en vivo por Zoom. Herramientas, especializaciones y análisis de datos
              en básico-intermedio.
            </p>
          </div>
          <Link
            href={hrefLocal("/cursos")}
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink no-underline hover:text-mute"
          >
            Ver catálogo
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <div
          role="group"
          aria-label="Filtrar cursos por categoría"
          className="scrollbar-hide -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          <button
            type="button"
            aria-pressed={filtro === "todos"}
            onClick={() => setFiltro("todos")}
            className={pastilla(filtro === "todos")}
          >
            Todos
            <span className="text-xs font-medium opacity-60">{ALL.length}</span>
          </button>
          {grupos.map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={filtro === g.id}
              onClick={() => setFiltro(g.id)}
              className={pastilla(filtro === g.id)}
            >
              {g.label}
              <span className="text-xs font-medium opacity-60">{g.slugs.length}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL.map((course, idx) => {
            const precio = precioVenta(pais, course.slug, promotions);
            const descuento = descuentoPublico(pais, course.slug, promotions);
            const cohorte = schedules.length ? nextCohortForCourse(course.slug, schedules, timeZone) : null;
            return (
              <Link
                key={course.slug}
                href={hrefLocal(`/cursos/${course.slug}`)}
                onClick={() => trackCourseCardClick(course.slug, "home_programs")}
                className={`group flex-col overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_18px_40px_-22px_rgba(23,23,22,0.45)] ${
                  oculta(course.slug, idx) ? "hidden" : "flex"
                }`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-wash">
                  <CourseImage
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                    {isNew(course) ? (
                      <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-canvas shadow-sm">
                        Nuevo
                      </span>
                    ) : (
                      <span />
                    )}
                    {descuento > 0 ? (
                      <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-bold text-ink shadow-sm">
                        {descuento}% de descuento
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <p
                    className="flex items-center gap-2 text-[13px] font-semibold text-ink"
                    data-cohort-strip=""
                    data-cohort-time={cohorte?.time ?? ""}
                  >
                    <span
                      className={`size-2 shrink-0 rounded-full ${cohorte ? "bg-ok" : "bg-line-strong"}`}
                      aria-hidden
                    />
                    {cohorte ? `Inicia ${fechaCorta(cohorte.date)}` : OPEN_COHORT_LABEL}
                  </p>
                  <h3 className="mt-2.5 text-xl font-bold tracking-tight text-ink">{courseTitle(course)}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-mute">{course.shortDescription}</p>
                  {cohorte ? (
                    <p className="mt-3 text-[13px] text-mute">
                      {cohorte.days} · {cohorte.time}
                    </p>
                  ) : null}

                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <span className="inline-flex items-center gap-1.5 border-t border-transparent text-xs text-faint">
                      <Clock size={13} aria-hidden /> {course.durationHours} h · En vivo
                      {course.levelsCount > 1 ? ` · ${course.levelsCount} niveles` : ""}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ink">
                      {showPrice && precio != null ? formatMoneda(pais, precio) : "Ver temario"}
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!grupoActivo && ALL.length > VISIBLE_COUNT ? (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30"
            >
              {expanded ? "Ver menos" : `Ver todos los cursos (${ALL.length})`}
              <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
