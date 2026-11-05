import type { NicheLanding } from "@/lib/data/landings-nicho";
import { LandingCta } from "./LandingCta";

export function LandingClosing({ closing }: { closing: NicheLanding["closing"] }) {
  return (
    <section className="mt-16 bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-canvas sm:text-3xl">
            {closing.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-canvas/70 sm:text-base">{closing.text}</p>
          <div className="mt-7">
            <LandingCta
              link={{ href: closing.href, label: closing.label }}
              variant="light"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
