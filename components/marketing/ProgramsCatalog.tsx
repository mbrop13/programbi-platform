"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { courses, COURSE_NAV_GROUPS, getCoursesBySlugs } from "@/lib/data/courses";
import { getCourseDateLabel } from "@/lib/data/course-schedules";
import { HOME_COURSE_SLUGS } from "@/lib/seo";
import { trackCourseCardClick } from "@/lib/analytics/marketing";

const FILTERS = [
  { id: "todos", label: "Todos" },
  ...COURSE_NAV_GROUPS.map((g) => ({ id: g.id, label: g.label })),
] as const;

export default function ProgramsCatalog() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("todos");

  const visible = useMemo(() => {
    if (filter === "todos") return getCoursesBySlugs(HOME_COURSE_SLUGS);
    const group = COURSE_NAV_GROUPS.find((g) => g.id === filter);
    if (!group) return courses;
    const set = new Set<string>(group.slugs);
    return courses.filter((c) => set.has(c.slug));
  }, [filter]);

  return (
    <section id="programas" className="border-t border-line px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Cursos abiertos</h2>
            <p className="mt-3 max-w-[40rem] text-base leading-relaxed text-mute">
              Formación en vivo por Zoom para particulares. Si eres empresa y necesitas el tablero en producción, eso
              es el{" "}
              <Link href="/empresas" className="font-semibold text-ink">
                Pack Adopción
              </Link>
              , no un curso.
            </p>
          </div>
          <Link href="/cursos" className="text-sm font-semibold text-ink no-underline hover:text-mute">
            Ver catálogo
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                filter === f.id ? "bg-ink text-canvas" : "border border-line bg-paper text-mute hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.slice(0, 6).map((course) => (
            <Link
              key={course.slug}
              href={`/cursos/${course.slug}`}
              onClick={() => trackCourseCardClick(course.slug, "home_programs")}
              className="group overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-colors hover:border-ink/20"
            >
              <div className="relative aspect-[16/10] bg-wash">
                <CourseImage
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-6 py-5">
                <h3 className="text-xl font-bold tracking-tight text-ink">{course.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-mute">{course.shortDescription}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-xs text-faint">
                  <Clock size={12} /> {course.durationHours} h · En vivo
                </p>
                <p className="mt-2 text-xs font-semibold text-ink">{getCourseDateLabel(course.slug)}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-ink">Ver temario</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
