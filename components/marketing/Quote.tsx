"use client";

import { useState } from "react";
import { TESTIMONIOS_PUBLICADOS, testimonials } from "@/lib/data/testimonials";

const INITIAL_VISIBLE = 6;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => !["de", "del", "la", "las", "los", "y"].includes(part.toLowerCase()))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Quote() {
  const [expanded, setExpanded] = useState(false);

  // Kill-switch compartido: si los testimonios están apagados, la home no
  // muestra la sección. Los datos quedan en lib/data/testimonials.ts.
  if (!TESTIMONIOS_PUBLICADOS || testimonials.length === 0) return null;

  const featured = testimonials.find((t) => t.name === "Jorge Kaisarieh") ?? testimonials[0];
  const others = testimonials.filter((t) => t.name !== featured.name);
  const visibleTestimonials = expanded ? others : others.slice(0, INITIAL_VISIBLE);
  const hasMore = others.length > INITIAL_VISIBLE;

  return (
    <section className="cv-auto bg-[#111214] py-20 text-[#f4f4f6] lg:py-28 dark:border-y dark:border-[var(--h-border)] dark:bg-[#141418]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[44rem]">
          <h2 className="text-3xl font-bold tracking-tight text-[#f4f4f6] sm:text-4xl lg:text-5xl">
            Lo que dicen nuestros alumnos
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#c8ccd4]">
            Opiniones verificables de profesionales que cursaron nuestros programas en vivo.
          </p>
        </div>

        <blockquote className="mt-12 max-w-[42ch] border-l-2 border-white/25 pl-5 sm:pl-7">
          <p className="text-2xl font-semibold leading-[1.25] tracking-tight text-[#f4f4f6] sm:text-3xl lg:text-4xl">
            &ldquo;{featured.message}&rdquo;
          </p>
          <footer className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
            <span className="font-semibold text-[#f4f4f6]">{featured.name}</span>
            <span className="text-[#a1a6b2]">{featured.role}</span>
          </footer>
        </blockquote>

        {visibleTestimonials.length > 0 ? (
          <div
            id="opiniones-alumnos-grid"
            className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleTestimonials.map((t) => (
              <article
                key={`${t.name}-${t.role}`}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-sm leading-relaxed text-[#c8ccd4]">
                  &ldquo;{t.message}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-[#f4f4f6]"
                  >
                    {initials(t.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#f4f4f6]">{t.name}</p>
                    <p className="truncate text-xs text-[#a1a6b2]">{t.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {hasMore ? (
          <div className="mt-10">
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              aria-controls="opiniones-alumnos-grid"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/20 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-[#f4f4f6] transition-colors hover:bg-white/[0.12] active:bg-white/[0.16]"
            >
              {expanded
                ? "Mostrar menos"
                : `Ver más opiniones (${others.length - INITIAL_VISIBLE})`}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
