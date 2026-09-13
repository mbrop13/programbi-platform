"use client";

import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import type { Course } from "@/lib/data/courses";
import { COURSE_SEO } from "@/lib/seo/money";
import { whatsappHref } from "@/lib/whatsapp";

export const COURSE_CRO_SLUGS = [
  "analisis-de-datos",
  "power-bi",
  "python",
  "sql-server",
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
    items.push("144 horas en total");
    items.push("3 niveles de 48 horas: SQL Server, Power BI y Python");
  } else {
    if (hours) items.push(`${hours} horas por nivel`);
    if (levels > 1) items.push(`${levels} niveles`);
  }
  items.push("Grabaciones de por vida en el campus");
  items.push("Certificado al completar");
  return items;
}

export function CourseAudienceAndResults({
  course,
  results,
}: {
  course: Course;
  results: string[];
}) {
  const seo = COURSE_SEO[course.slug];
  if (!seo) return null;

  return (
    <>
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Para quién</h2>
        <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">{seo.audience}</p>
      </div>
      {results.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Resultados</h2>
          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {results.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                <Check size={16} className="mt-0.5 shrink-0" strokeWidth={2.2} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

export function CourseSyllabusAndFormat({
  course,
  hours,
}: {
  course: Course;
  hours: number;
}) {
  const bullets = syllabusBullets(course);
  const format = formatItems(course, hours);

  return (
    <section className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
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

export function CourseLeadCtas({
  course,
  onRegister,
  primaryLabel = "Registrarme",
}: {
  course: Course;
  onRegister: () => void;
  primaryLabel?: string;
}) {
  const wa = whatsappHref({
    page: `/cursos/${course.slug}`,
    intent: "curso",
    course: course.title,
  });

  return (
    <section className="border-t border-line bg-paper px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">¿Siguiente paso?</h2>
          <p className="mt-2 max-w-[36rem] text-sm leading-relaxed text-mute">
            Crea una cuenta para ver fechas y valor, o escríbenos por WhatsApp.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRegister}
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-7 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
          >
            {primaryLabel}
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-canvas px-7 text-sm font-medium text-ink no-underline hover:bg-wash"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export function CourseFaq({ slug }: { slug: string }) {
  const seo = COURSE_SEO[slug];
  if (!seo?.faqs?.length) return null;

  return (
    <section className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Preguntas frecuentes</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {seo.faqs.map((item) => (
            <details key={item.q} className="faq group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                <span className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{item.q}</span>
                <span className="text-2xl leading-none text-faint group-open:hidden">+</span>
                <span className="hidden text-2xl leading-none text-faint group-open:block">–</span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-mute sm:text-base">
                {item.a.includes("/empresas") ? (
                  <>
                    {item.a.split("/empresas")[0]}
                    <Link href="/empresas" className="font-semibold text-ink underline-offset-4 hover:underline">
                      /empresas
                    </Link>
                    {item.a.split("/empresas")[1] ?? ""}
                  </>
                ) : (
                  item.a
                )}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
