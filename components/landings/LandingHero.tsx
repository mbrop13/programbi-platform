import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses";
import { catalogHours, levelsForView } from "@/lib/data/course-views";
import type { NicheLanding } from "@/lib/data/landings-nicho";
import { LandingCta } from "./LandingCta";

function unirNiveles(nombres: string[]): string {
  if (nombres.length === 0) return "Según ficha";
  if (nombres.length === 1) return nombres[0];
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`;
}

function factsDelCurso(slug: string): { label: string; value: string }[] {
  const course = getCourseBySlug(slug);
  if (!course) return [];
  const niveles = levelsForView(course, "publico");
  const horas = catalogHours(course);
  return [
    {
      label: "Duración",
      value: `${horas} horas${niveles.length > 1 ? " por nivel" : ""}`,
    },
    { label: "Nivel", value: unirNiveles(niveles.map((nivel) => nivel.name)) },
    { label: "Modalidad", value: "Online en vivo" },
    { label: "Certificado", value: "ProgramBI" },
  ];
}

export function LandingHero({ landing }: { landing: NicheLanding }) {
  const facts = landing.courseSlug ? factsDelCurso(landing.courseSlug) : (landing.facts ?? []);

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <nav className="mb-8 text-sm text-mute" aria-label="Migas">
          <Link href="/" className="no-underline hover:text-ink">
            Inicio
          </Link>
          <span className="mx-2 text-faint">/</span>
          <Link href={landing.parentCrumb.href} className="no-underline hover:text-ink">
            {landing.parentCrumb.label}
          </Link>
          <span className="mx-2 text-faint">/</span>
          <span className="text-ink">{landing.h1}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
              {landing.kicker}
            </p>
            <h1 className="mt-3 max-w-[20ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
              {landing.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mute">{landing.lead}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LandingCta link={landing.primaryCta} />
              <LandingCta link={landing.secondaryCta} variant="secondary" />
            </div>

            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-faint">
              <Link href="/precios" className="font-semibold text-mute no-underline hover:text-ink">
                Precio y cuotas
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/faq" className="font-semibold text-mute no-underline hover:text-ink">
                Preguntas frecuentes
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/test-nivel" className="font-semibold text-mute no-underline hover:text-ink">
                Test de nivel
              </Link>
            </p>
          </div>

          <aside className="rounded-[26px] border border-line bg-paper p-6 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
              En resumen
            </p>
            <dl className="mt-5 divide-y divide-line">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <dt className="text-sm text-mute">{fact.label}</dt>
                  <dd className="text-right text-sm font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {landing.courseSlug ? (
              <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-faint">
                El precio publicado y la nota de cuotas están más abajo, leídos de la tabla del
                sitio.
              </p>
            ) : (
              <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-faint">
                La cotización se arma según el alcance del equipo. El formulario para pedirla está
                al final de la página.
              </p>
            )}
            {landing.courseSlug ? (
              <Link
                href={`/cursos/${landing.courseSlug}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink no-underline hover:text-mute"
              >
                Ver la ficha completa <ArrowRight size={14} strokeWidth={2.4} />
              </Link>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
