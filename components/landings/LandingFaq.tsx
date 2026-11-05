import type { NicheLanding } from "@/lib/data/landings-nicho";

export function LandingFaq({ faqs }: { faqs: NicheLanding["faqs"] }) {
  return (
    <section id="faq" className="mt-14 scroll-mt-24">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Preguntas</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Preguntas frecuentes
      </h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {faqs.map((faq) => (
          <details key={faq.q} className="group py-4">
            <summary className="cursor-pointer list-none text-base font-semibold text-ink">
              {faq.q}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-mute">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
