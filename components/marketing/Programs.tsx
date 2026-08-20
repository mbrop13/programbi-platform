"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CourseImage from "@/components/shared/CourseImage";
import { COURSE_NAV_GROUPS, courses, type Course } from "@/lib/data/courses";
import { trackCourseCardClick } from "@/lib/analytics/marketing";

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

  const visible = useMemo(() => {
    if (filter === "todos") return ALL;
    const group = COURSE_NAV_GROUPS.find((f) => f.id === filter);
    return group ? ALL.filter((c) => (group.slugs as readonly string[]).includes(c.slug)) : ALL;
  }, [filter]);

  const current = visible.find((c) => c.slug === active) ?? visible[0];

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

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-12 lg:gap-10">
          <Link
            href={`/cursos/${current.slug}`}
            onClick={() => trackCourseCardClick(current.slug, "home_programs")}
            className="group order-1 overflow-hidden rounded-[26px] border border-line bg-paper no-underline lg:order-2 lg:col-span-7"
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

          <ul className="order-2 flex flex-col lg:order-1 lg:col-span-5">
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
      </div>
    </section>
  );
}
