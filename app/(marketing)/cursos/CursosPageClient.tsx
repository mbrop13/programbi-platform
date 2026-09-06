"use client";

import { useState } from "react";
import Link from "next/link";
import CourseImage from "@/components/shared/CourseImage";
import { Clock, Search } from "lucide-react";
import { courses } from "@/lib/data/courses";
import { trackCourseCardClick } from "@/lib/analytics/marketing";
import { COURSE_SEO } from "@/lib/seo/money";
import { MONEY_COURSE_SLUGS } from "@/lib/seo";

export default function CursosPageClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      course.title.toLowerCase().includes(q) ||
      course.techStack.some((t) => t.toLowerCase().includes(q)) ||
      course.shortDescription.toLowerCase().includes(q)
    );
  });

  const featured = filteredCourses.find((c) => c.slug === "analisis-de-datos");
  const moneySet = new Set<string>(MONEY_COURSE_SLUGS);
  const rest = [
    ...filteredCourses.filter((c) => c.slug !== "analisis-de-datos" && moneySet.has(c.slug)),
    ...filteredCourses.filter((c) => c.slug !== "analisis-de-datos" && !moneySet.has(c.slug)),
  ];

  return (
    <>
      <section className="px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Cursos Power BI y análisis de datos en vivo — Chile
          </h1>
          <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">
            Formación individual en vivo por Zoom. Si tu empresa necesita el tablero en producción y un equipo
            autónomo, eso es el{" "}
            <Link href="/empresas" className="font-semibold text-ink">
              Pack Adopción
            </Link>
            , no un curso.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { href: "/cursos/power-bi", label: "Curso Power BI" },
              { href: "/cursos/analisis-de-datos", label: "Análisis de datos" },
              { href: "/cursos/analitica-mineria", label: "Minería" },
              { href: "/empresas", label: "Pack empresas" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink no-underline hover:bg-wash"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="relative mt-8 max-w-xl">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <label htmlFor="course-search" className="sr-only">
              Buscar curso
            </label>
            <input
              id="course-search"
              type="search"
              placeholder="Buscar Power BI, SQL, Python..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-xl border border-line-strong bg-paper pl-11 pr-4 text-base text-ink placeholder:text-faint"
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-line px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1400px] space-y-5">
          {featured && (
            <Link
              href={`/cursos/${featured.slug}`}
              onClick={() => trackCourseCardClick(featured.slug, "cursos_catalog")}
              className="group grid overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-colors hover:border-ink/20 lg:grid-cols-12"
            >
              <div className="relative aspect-[16/10] bg-wash lg:col-span-7 lg:aspect-auto lg:min-h-[320px]">
                <CourseImage
                  src={featured.imageUrl}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col justify-end px-6 py-6 lg:col-span-5 lg:px-8 lg:py-8">
                <p className="text-xs font-semibold text-mute">Programa de 144 horas</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Cursos de análisis de datos: SQL, Power BI y Python
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mute">{featured.shortDescription}</p>
                <p className="mt-4 text-sm font-semibold text-ink">SQL · Power BI · Python</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-ink">Ver temario</span>
              </div>
            </Link>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((course) => (
              <Link
                key={course.slug}
                href={`/cursos/${course.slug}`}
                onClick={() => trackCourseCardClick(course.slug, "cursos_catalog")}
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
                  <h2 className="text-xl font-bold tracking-tight text-ink">
                    {COURSE_SEO[course.slug]?.h1 || course.title}
                  </h2>
                  <p className="mt-1 text-sm text-mute">{course.shortDescription}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-xs text-faint">
                    <Clock size={12} /> {course.durationHours} h · En vivo
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <p className="py-16 text-center text-mute">No se encontraron cursos con esa búsqueda.</p>
          )}
        </div>
      </section>
    </>
  );
}
