import { homeFaqs } from "@/lib/data/site";

type Faq = { q: string; a: string };

export default function FaqSection({
  faqs = homeFaqs,
  titulo = "Preguntas frecuentes",
}: {
  faqs?: readonly Faq[];
  titulo?: string;
}) {
  return (
    <section id="faq" className="cv-auto border-t border-line px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{titulo}</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {faqs.map((item) => (
            <details key={item.q} className="faq group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                <span className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{item.q}</span>
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-xl leading-none text-ink transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-mute sm:text-base">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
