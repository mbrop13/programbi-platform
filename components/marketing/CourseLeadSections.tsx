"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { Course } from "@/lib/data/courses";
import { getCourseSyllabus, getSyllabusLevel, type SyllabusLevelContent } from "@/lib/data/syllabuses";
import { COURSE_SEO } from "@/lib/seo/money";
import { localizarMercado } from "@/lib/paises/precios";
import { enlacesDeCurso } from "@/lib/seo/enlaces";
import { ISO_CHILE, normalizarPais } from "@/config/paises";
import { rutaLocal } from "@/lib/paises/rutas";

export const COURSE_CRO_SLUGS = [
  "analisis-de-datos",
  "power-bi",
  "power-automate",
  "python",
  "sql-server",
  "chatgpt",
  "gemini",
] as const;

export function isCourseCroSlug(slug: string): boolean {
  return (COURSE_CRO_SLUGS as readonly string[]).includes(slug);
}

function syllabusBullets(course: Course, max = 7): string[] {
  const out: string[] = [];
  let i = 0;
  while (out.length < max) {
    let added = false;
    for (const mod of course.syllabus) {
      const topic = mod.topics[i];
      if (topic) {
        out.push(topic);
        added = true;
        if (out.length >= max) break;
      }
    }
    if (!added) break;
    i += 1;
  }
  return out;
}

function formatItems(course: Course, hours: number): string[] {
  const levels = course.levels?.length ?? 1;
  const items = ["Clases en vivo por Zoom"];
  if (course.slug === "analisis-de-datos") {
    items.push("60 horas por nivel: básico-intermedio y avanzado");
    items.push("SQL Server, Power BI y Python, 20 horas de cada una");
    items.push("120 horas el programa completo");
  } else {
    if (hours) items.push(`${hours} horas por nivel`);
    if (levels > 1) items.push(`${levels} niveles`);
  }
  items.push("Campus virtual con clases y material para practicar durante el curso");
  items.push("Certificado al completar");
  return items;
}

export function CourseAudienceAndResults({
  course,
  selectedLevel,
  results,
  levelLabel,
  showLadderNote = true,
  levelContent,
}: {
  course: Course;
  selectedLevel: number;
  results: string[];
  levelLabel?: string;
  showLadderNote?: boolean;
  levelContent?: SyllabusLevelContent;
}) {
  const syllabus = getCourseSyllabus(course);
  const level = levelContent ?? getSyllabusLevel(syllabus, selectedLevel);
  const seo = COURSE_SEO[course.slug];
  const levelText = level.intro || level.audience;
  const programText =
    syllabus.audience && syllabus.audience !== levelText
      ? syllabus.audience
      : !levelText
        ? seo?.audience ||
          (course.description && course.description !== course.shortDescription ? course.description : "")
        : "";
  if (!levelText && !programText && !syllabus.audienceNote && results.length === 0) return null;

  return (
    <>
      {levelText || programText ? (
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Para quién</h2>
          {levelContent || syllabus.levels.length > 1 ? (
            <p className="mt-3 text-sm font-semibold text-ink">
              {levelLabel || level.label}
              {level.shortLabel ? ` · ${level.shortLabel}` : ""}
            </p>
          ) : null}
          {levelText ? <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">{levelText}</p> : null}
          {programText ? <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">{programText}</p> : null}
          {showLadderNote && syllabus.audienceNote ? (
            <p className="mt-3 max-w-[40rem] text-sm leading-relaxed text-mute">{syllabus.audienceNote}</p>
          ) : null}
        </div>
      ) : null}
      {results.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">En este nivel</h2>
          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {results.map((item) => {
              const notebookTarget = "Gemini Notebook (NotebookLM)";
              const linkNotebook = course.slug === "gemini" && item.includes(notebookTarget);
              const [before, after] = linkNotebook ? item.split(notebookTarget) : [item, ""];
              return (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <Check size={16} className="mt-0.5 shrink-0" strokeWidth={2.2} />
                  {linkNotebook ? (
                    <span>
                      {before}
                      <Link
                        href="/guias/notebooklm-que-es-y-como-usarlo"
                        className="underline decoration-line-strong underline-offset-4 hover:text-mute"
                      >
                        {notebookTarget}
                      </Link>
                      {after}
                    </span>
                  ) : (
                    item
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </>
  );
}

export function CourseSyllabusAndFormat({
  course,
  hours,
  embedded = false,
}: {
  course: Course;
  hours: number;
  embedded?: boolean;
}) {
  const bullets = syllabusBullets(course);
  const format = formatItems(course, hours);

  return (
    <section
      className={
        embedded
          ? "border-t border-line py-12 lg:py-16"
          : "border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      }
    >
      <div
        className={
          embedded
            ? "grid grid-cols-1 gap-10"
            : "mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16"
        }
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Temario</h2>
          <ul className="mt-6 space-y-3">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                <Check size={16} className="mt-0.5 shrink-0" strokeWidth={2.2} />
                {item}
              </li>
            ))}
          </ul>
          <a href="#temario" className="mt-5 inline-block text-sm font-semibold text-ink no-underline hover:text-mute">
            Ver temario completo
          </a>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Formato</h2>
          <ul className="mt-6 space-y-3">
            {format.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                <Check size={16} className="mt-0.5 shrink-0" strokeWidth={2.2} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const INTERNAL_ROUTE_RE =
  /(\/(?:[a-z]{2}\/)?cursos\/[a-z0-9-]+\?para=empresas|\/(?:[a-z]{2}\/)?cursos\/[a-z0-9-]+|\/(?:[a-z]{2}\/)?empresas|\/(?:[a-z]{2}\/)?cursos|\/power-bi-mineria-chile)/g;

function labelForInternalRoute(route: string): string {
  if (route.includes("?para=empresas")) return "cotizar para empresas";
  if (route === "/power-bi-mineria-chile") return "Power BI para minería en Chile";
  if (/^\/(?:[a-z]{2}\/)?empresas$/.test(route)) return "capacitación para empresas";
  if (/^\/(?:[a-z]{2}\/)?cursos$/.test(route)) return "catálogo de cursos";
  if (/^\/(?:[a-z]{2}\/)?cursos\/[a-z0-9-]+$/.test(route)) return "la ficha del curso";
  return route;
}

function hrefForInternalRoute(route: string, pais?: string): string {
  if (route === "/power-bi-mineria-chile") return route;
  if (/^\/[a-z]{2}\//.test(route)) return route;
  if (!pais || normalizarPais(pais) === ISO_CHILE) return route;
  return rutaLocal(pais, route);
}

export function renderInternalLinks(text: string, pais?: string) {
  const parts = text.split(INTERNAL_ROUTE_RE);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <Link
          key={`${part}-${i}`}
          href={hrefForInternalRoute(part, pais)}
          className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:text-mute"
        >
          {labelForInternalRoute(part)}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const COURSE_RESOURCE_LINKS: Record<string, { href: string; label: string }[]> = {
  "analisis-de-datos": [
    { href: "/guias/sueldo-analista-de-datos-latinoamerica", label: "Guía: sueldo de analista de datos en Latinoamérica" },
    { href: "/test-nivel", label: "Test de nivel SQL y Excel" },
    { href: "/casos", label: "Testimonios de alumnos" },
  ],
  "power-bi": [
    { href: "/guias/power-bi-vs-excel", label: "Guía: Power BI vs. Excel" },
    { href: "/casos", label: "Testimonios de alumnos" },
  ],
  "power-automate": [
    { href: "/guias/curso-power-automate-chile", label: "Guía: automatización con Power Automate" },
    { href: "/empresas", label: "Capacitación para empresas" },
  ],
  "sql-server": [
    { href: "/test-nivel/sql", label: "Test de nivel SQL" },
    { href: "/versus/sql-server-vs-postgresql", label: "Comparativa: SQL Server vs. PostgreSQL" },
  ],
  excel: [
    { href: "/test-nivel/excel", label: "Test de nivel Excel" },
    { href: "/guias/power-bi-vs-excel", label: "Guía: Power BI vs. Excel" },
  ],
  python: [
    { href: "/versus/python-vs-r", label: "Comparativa: Python vs. R" },
    { href: "/casos", label: "Testimonios de alumnos" },
  ],
  chatgpt: [
    { href: "/guias/chatgpt-para-analisis-de-datos", label: "Guía: ChatGPT para análisis de datos" },
    { href: "/guias/curso-chatgpt-chile", label: "Guía: curso de ChatGPT en Chile" },
    { href: "/empresas", label: "Capacitación para empresas" },
  ],
  gemini: [
    { href: "/guias/gemini-para-analisis-de-datos", label: "Guía: Gemini para análisis de datos" },
    { href: "/guias/curso-gemini-chile", label: "Guía: curso de Gemini en Chile" },
    { href: "/empresas", label: "Capacitación para empresas" },
  ],
};

export function CourseSeoInternalLinks({ slug }: { slug: string }) {
  const extraCurso = COURSE_RESOURCE_LINKS[slug] ?? [];
  const extra = enlacesDeCurso(slug);
  if (extraCurso.length === 0 && extra.length === 0) return null;

  // Landings propias del curso primero; guías, comparativas, testimonios y el catálogo cierran la lista.
  const vistos = new Set<string>();
  const enlaces = [
    ...extra,
    ...extraCurso,
    { href: "/cursos", label: "Todos los cursos" },
    { href: "/", label: "Inicio" },
  ].filter((enlace) => (vistos.has(enlace.href) ? false : (vistos.add(enlace.href), true)));

  return (
    <nav aria-label="Enlaces relacionados" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
      {enlaces.map((enlace) => (
        <Link
          key={enlace.href}
          href={enlace.href}
          className="font-semibold text-ink no-underline underline-offset-4 hover:underline"
        >
          {enlace.label}
        </Link>
      ))}
    </nav>
  );
}

export function CourseFaq({
  slug,
  extra = [],
  pais,
}: {
  slug: string;
  extra?: { q: string; a: string }[];
  /** Mercado de la versión: localiza la hora de las preguntas base. */
  pais?: string;
}) {
  const seo = COURSE_SEO[slug];
  // Las preguntas con monto en CLP no salen en fichas de otros mercados.
  const esChile = normalizarPais(pais) === ISO_CHILE;
  const tienePrecioEnExtra = extra.some((item) => /^¿cuánto cuesta\b/i.test(item.q));
  const base = (seo?.faqs ?? [])
    .filter((item) => !item.soloChile || esChile)
    .filter((item) => !(tienePrecioEnExtra && /^¿cuánto cuesta\b/i.test(item.q)))
    .map((item) => ({
      q: localizarMercado(item.q, pais),
      a: localizarMercado(item.a, pais),
    }));
  const vistos = new Set<string>();
  const items = [...base, ...extra].filter((item) => {
    const clave = item.q.trim().toLowerCase();
    if (vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });
  if (items.length === 0) return null;

  return (
    <section className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Preguntas frecuentes</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {items.map((item) => (
            <details key={item.q} className="faq group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                <span className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{item.q}</span>
                <span className="text-2xl leading-none text-faint group-open:hidden">+</span>
                <span className="hidden text-2xl leading-none text-faint group-open:block">–</span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-mute sm:text-base">
                {renderInternalLinks(item.a, pais)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
