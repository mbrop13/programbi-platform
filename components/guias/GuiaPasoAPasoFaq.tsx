import { ChevronDown } from "lucide-react";

export default function GuiaPasoAPasoFaq({
  faqs,
}: {
  faqs: { q: string; a: string }[];
}) {
  if (faqs.length === 0) return null;

  return (
    <section
      id="preguntas-frecuentes"
      aria-labelledby="preguntas-frecuentes-titulo"
      className="mt-12 border-t border-line pt-8"
    >
      <h2
        id="preguntas-frecuentes-titulo"
        className="text-2xl font-bold tracking-tight text-ink"
      >
        Preguntas frecuentes
      </h2>
      <div className="mt-5 space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group rounded-2xl border border-line bg-paper px-4 py-3.5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink">
              <span>{faq.q}</span>
              <ChevronDown
                size={16}
                aria-hidden
                className="shrink-0 text-mute transition-transform group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <p className="mt-2.5 text-sm leading-relaxed text-mute">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
