import { Check } from "lucide-react";
import type { LandingSection } from "@/lib/data/landings-nicho";

export function LandingSectionBlock({ section }: { section: LandingSection }) {
  return (
    <section id={section.id} className="mt-12 scroll-mt-24 first:mt-0">
      {section.eyebrow ? (
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          {section.eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {section.h2}
      </h2>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-4 text-base leading-relaxed text-mute">
          {paragraph}
        </p>
      ))}

      {section.bullets?.length ? (
        <ul className="mt-5 space-y-3">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3 text-base leading-relaxed text-mute">
              <Check className="mt-1 size-4 shrink-0 text-ink" strokeWidth={2.4} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {section.cards?.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {section.cards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-line bg-paper p-5">
              <h3 className="text-base font-semibold tracking-tight text-ink">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{card.text}</p>
            </div>
          ))}
        </div>
      ) : null}

      {section.steps?.length ? (
        <ol className="mt-6 space-y-4">
          {section.steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-line bg-paper p-5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-canvas">
                {index + 1}
              </span>
              <div>
                <h3 className="text-sm font-bold text-ink">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-mute">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
