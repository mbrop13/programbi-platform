"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Clock } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { getCourseDateLabel } from "@/lib/data/course-schedules";
import { trackCourseCardClick } from "@/lib/analytics/marketing";

const ORDER = [
  "analisis-de-datos",
  "power-bi",
  "sql-server",
  "python",
  "excel",
  "analitica-mineria",
  "analitica-financiera",
  "claude",
  "ia-productividad",
  "copilot",
  "power-automate",
  "machine-learning",
] as const;

const VISIBLE_COUNT = 6;

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

export default function Programs({ catalog }: { catalog: ProgramCard[] }) {
  const ALL = orderCatalog(catalog);
  const [expanded, setExpanded] = useState(false);
  if (!ALL.length) return null;
  const visible = expanded ? ALL : ALL.slice(0, VISIBLE_COUNT);

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
          <Link href="/cursos" className="shrink-0 text-sm font-semibold text-ink no-underline hover:text-mute">
            Ver catálogo
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            <Link
              key={course.slug}
              href={`/cursos/${course.slug}`}
              onClick={() => trackCourseCardClick(course.slug, "home_programs")}
              className="group overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-colors hover:border-ink/20"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-wash">
                <CourseImage
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                {isNew(course) ? (
                  <span className="absolute left-4 top-4 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-canvas shadow-sm">
                    Nuevo
                  </span>
                ) : null}
              </div>
              <div className="px-6 py-5">
                <h3 className="text-xl font-bold tracking-tight text-ink">{courseTitle(course)}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-mute">{course.shortDescription}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-xs text-faint">
                  <Clock size={12} /> {course.durationHours} h · En vivo
                  {course.levelsCount > 1 ? ` · ${course.levelsCount} niveles` : ""}
                </p>
                <p className="mt-2 text-xs font-semibold text-ink">{getCourseDateLabel(course.slug)}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-ink">Ver temario</span>
              </div>
            </Link>
          ))}
        </div>

        {ALL.length > VISIBLE_COUNT ? (
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
