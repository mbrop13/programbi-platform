"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { COURSE_NAV_GROUPS, courses, type Course } from "@/lib/data/courses";
import { trackCourseCardClick } from "@/lib/analytics/marketing";
import {
  type CourseSchedule,
  staticSchedules,
  analisisDeDatosSlugs,
  getNearestSchedule,
  convertSchedule,
  SCHEDULE_COUNTRIES,
} from "@/lib/data/course-schedules";
import { useCountry } from "@/lib/context/CountryContext";

const ORDER = [
  "analisis-de-datos",
  "power-bi",
  "sql-server",
  "python",
  "excel",
  "analitica-mineria",
  "analitica-financiera",
  "ia-productividad",
  "copilot",
  "power-automate",
  "machine-learning",
] as const;

const FILTERS = [{ id: "todos" as const, label: "Todos" }, ...COURSE_NAV_GROUPS];

type FilterId = (typeof FILTERS)[number]["id"];

function catalog(): Course[] {
  const bySlug = new Map(courses.map((c) => [c.slug, c]));
  const listed = ORDER.map((slug) => bySlug.get(slug)).filter((c): c is Course => Boolean(c));
  const rest = courses.filter((c) => !ORDER.includes(c.slug as (typeof ORDER)[number]));
  return [...listed, ...rest];
}

const ALL = catalog();

function isNew(course: Course) {
  return course.badgeLabel?.toLowerCase().includes("nuevo") ?? false;
}

export default function Programs() {
  const [filter, setFilter] = useState<FilterId>("todos");
  const [active, setActive] = useState("analisis-de-datos");
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const { country } = useCountry();

  const scheduleCountry = useMemo(
    () => SCHEDULE_COUNTRIES.find((c) => c.code === country.iso) ?? SCHEDULE_COUNTRIES[0],
    [country.iso]
  );

  useEffect(() => {
    fetch("/api/schedules")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setSchedules(data);
      })
      .catch(() => {});
  }, []);

  const visible = useMemo(() => {
    if (filter === "todos") return ALL;
    const group = COURSE_NAV_GROUPS.find((f) => f.id === filter);
    return group ? ALL.filter((c) => (group.slugs as readonly string[]).includes(c.slug)) : ALL;
  }, [filter]);

  const current = visible.find((c) => c.slug === active) ?? visible[0];

  function getStartMeta(course: Course) {
    let relevant: CourseSchedule[] = [];
    if (course.slug === "analisis-de-datos") {
      relevant = schedules.filter(
        (s) => analisisDeDatosSlugs.includes(s.course_slug) && s.level_name === "Básico"
      );
      if (relevant.length === 0) {
        relevant = staticSchedules
          .filter((s) => analisisDeDatosSlugs.includes(s.course_slug))
          .map((s, i) => ({ ...s, id: `static-${i}` }) as CourseSchedule);
      }
    } else {
      relevant = schedules.filter((s) => s.course_slug === course.slug);
      if (relevant.length === 0) {
        relevant = staticSchedules
          .filter((s) => s.course_slug === course.slug)
          .map((s, i) => ({ ...s, id: `static-${i}` }) as CourseSchedule);
      }
    }
    const nearest = getNearestSchedule(relevant);
    if (!nearest) return null;
    const conv = convertSchedule(
      nearest.start_date,
      nearest.schedule_time,
      nearest.schedule_days,
      scheduleCountry.timeZone
    );
    const capitalized =
      conv.dateFormatted.charAt(0).toUpperCase() + conv.dateFormatted.slice(1);
    return { date: capitalized, days: conv.days, time: conv.time };
  }

  if (!current) return null;

  return (
    <section id="programas" className="border-t border-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">Cursos</h2>
        <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">
          {ALL.length} programas en vivo por Zoom. Herramientas, especializaciones y el camino de 144
          horas.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={`rounded-md border-2 px-3.5 py-2 text-sm font-semibold transition-colors ${
                  on
                    ? "border-[rgb(23_23_22_/_0.28)] bg-paper text-ink"
                    : "border-transparent bg-wash text-mute hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* ── Desktop: featured + list ─────────────────────────────── */}
        <div className="mt-10 hidden items-start gap-6 lg:grid lg:grid-cols-12 lg:gap-10">
          <Link
            href={`/cursos/${current.slug}`}
            onClick={() => trackCourseCardClick(current.slug, "home_programs")}
            className="group order-2 overflow-hidden rounded-[26px] border border-line bg-paper no-underline lg:col-span-7"
          >
            <div className="relative aspect-[16/10] bg-wash">
              <CourseImage
                key={current.slug}
                src={current.imageUrl}
                alt={current.title}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="px-6 py-5 lg:px-8 lg:py-7">
              <div className="flex items-center gap-2 text-xs font-semibold text-mute">
                <span>
                  {current.durationHours} h · En vivo
                  {current.levels?.length ? ` · ${current.levels.length} niveles` : ""}
                </span>
                {isNew(current) ? <span className="text-ink">Nuevo</span> : null}
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{current.title}</p>
              <p className="mt-3 max-w-[38rem] text-sm leading-relaxed text-mute">{current.shortDescription}</p>
              <p className="mt-4 text-sm font-semibold text-ink">{current.techStack.join(" · ")}</p>
              <span className="mt-6 inline-flex text-sm font-semibold text-ink">Ver temario</span>
            </div>
          </Link>

          <ul className="order-1 flex flex-col lg:col-span-5">
            {visible.map((course, i) => {
              const on = course.slug === current.slug;
              return (
                <li key={course.slug}>
                  <Link
                    href={`/cursos/${course.slug}`}
                    onMouseEnter={() => setActive(course.slug)}
                    onFocus={() => setActive(course.slug)}
                    onClick={() => trackCourseCardClick(course.slug, "home_programs_list")}
                    className={`flex items-baseline justify-between gap-4 rounded-md px-3 py-3 no-underline transition-colors ${
                      on ? "bg-paper text-ink" : "text-mute hover:text-ink"
                    }`}
                  >
                    <span className="flex min-w-0 items-baseline gap-3">
                      <span className="w-6 shrink-0 font-mono text-[11px] text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate text-[15px] font-semibold">{course.title}</span>
                      {isNew(course) ? (
                        <span className="hidden shrink-0 text-[11px] font-semibold text-ink sm:inline">
                          Nuevo
                        </span>
                      ) : null}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-faint">{course.durationHours} h</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Mobile: horizontal snap slider ────────────────────────── */}
        <div className="mt-8 lg:hidden">
          <div
            className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 pb-4 sm:-mx-6 sm:px-6"
            style={{ WebkitOverflowScrolling: "touch" as const }}
            aria-label="Carrusel de cursos"
          >
            {visible.map((course) => {
              const meta = getStartMeta(course);
              return (
                <Link
                  key={course.slug}
                  href={`/cursos/${course.slug}`}
                  onClick={() => trackCourseCardClick(course.slug, "home_programs_mobile")}
                  className="group flex w-[84%] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border border-line bg-paper no-underline shadow-[0_8px_24px_rgba(23,23,22,0.06)] transition-[transform,box-shadow] active:scale-[0.99] sm:w-[360px]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-wash">
                    <CourseImage
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      sizes="340px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute left-3 top-3 flex items-center gap-1.5">
                      <span className="rounded-full bg-paper/95 px-2.5 py-1 text-xs font-semibold tabular-nums text-ink shadow-sm backdrop-blur">
                        {course.durationHours} h
                      </span>
                      {isNew(course) ? (
                        <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-canvas shadow-sm">
                          Nuevo
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-5 py-5">
                    <p className="line-clamp-2 text-lg font-bold leading-tight tracking-tight text-ink">
                      {course.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mute">
                      {course.shortDescription}
                    </p>
                    {course.techStack.length ? (
                      <p className="mt-3 line-clamp-1 text-xs font-semibold text-mute">
                        {course.techStack.join(" · ")}
                      </p>
                    ) : null}

                    {meta ? (
                      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-line bg-wash px-3 py-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper">
                          <Calendar size={14} className="text-ink" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold capitalize leading-none text-ink">
                            {meta.date}
                          </p>
                          <p className="mt-1 truncate text-[11px] font-medium leading-none text-faint">
                            {meta.days} · {meta.time}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-dashed border-line bg-wash/60 px-3.5 py-2.5">
                        <p className="text-xs font-semibold text-mute">Fecha por confirmar</p>
                      </div>
                    )}

                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                      Ver temario <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-faint">
            <span className="inline-block h-1 w-6 rounded-full bg-line-strong" />
            Desliza para ver todos los cursos
          </p>
        </div>
      </div>
    </section>
  );
}
