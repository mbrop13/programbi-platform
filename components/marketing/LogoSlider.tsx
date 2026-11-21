"use client";

import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { logos } from "@/lib/data/site";

/** className permite sobreescribir el fondo/bordes por página. */
export default function LogoSlider({ className }: { className?: string }) {
  const [paused, setPaused] = useState(false);
  const loop = [...logos, ...logos];

  return (
    <section
      id="empresas-logos"
      aria-label="Empresas donde trabajan nuestros alumnos"
      className={cn(
        "home-scope border-y border-[var(--h-border)] bg-[var(--h-surface)] py-8 lg:py-10",
        className,
      )}
    >
      <div className="mx-auto mb-5 flex max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        <p className="text-xs font-medium text-[var(--h-subtle)]">
          Equipos y profesionales formados con ProgramBI
        </p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg border border-[var(--h-border-strong)] bg-[var(--h-bg)] px-3 text-xs font-medium text-[var(--h-muted)] transition-colors hover:text-[var(--h-ink)]"
        >
          {paused ? (
            <>
              <Play size={12} aria-hidden />
              Reanudar
            </>
          ) : (
            <>
              <Pause size={12} aria-hidden />
              Pausar
            </>
          )}
        </button>
      </div>

      <div className="mx-auto max-w-[1440px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div
          className="logo-track"
          style={paused ? { animationPlayState: "paused" } : undefined}
        >
          {loop.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex h-14 w-44 shrink-0 items-center justify-center px-6 lg:h-16 lg:w-52"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={160}
                height={48}
                sizes="(max-width: 1024px) 128px, 160px"
                fetchPriority="low"
                style={logo.zoom ? { scale: String(logo.zoom) } : undefined}
                className="max-h-8 w-auto object-contain opacity-80 transition-opacity hover:opacity-100 dark:brightness-0 dark:invert dark:opacity-85 lg:max-h-10"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
