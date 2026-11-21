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
    <section id="faq" className="cv-auto border-t border-[var(--h-border)] bg-[var(--h-bg)] py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--h-ink)] sm:text-4xl">
            {titulo}
          </h2>
          <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-[var(--h-muted)] sm:text-base">
            Respuestas directas sobre modalidad en vivo, horarios, certificados y proceso de inscripción.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="divide-y divide-[var(--h-border)] border-y border-[var(--h-border)]">
            {faqs.map((item) => (
              <details key={item.q} className="faq group py-4 sm:py-5">
                <summary className="flex min-h-[44px] cursor-pointer items-center justify-between gap-6 py-1 text-left">
                  <span className="text-base font-semibold tracking-tight text-[var(--h-ink)] sm:text-lg">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-md border border-[var(--h-border-strong)] bg-[var(--h-surface)] text-base font-medium leading-none text-[var(--h-ink)] transition-colors group-hover:border-[var(--h-ink)]"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">-</span>
                  </span>
                </summary>
                <p className="mt-3 max-w-[65ch] pb-1 text-sm leading-relaxed text-[var(--h-muted)] sm:text-base">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
