import { homeFaqs } from "@/lib/data/site";

export default function FaqSection() {
  return (
    <section id="faq" className="border-t border-line px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Preguntas frecuentes</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {homeFaqs.map((item) => (
            <details key={item.q} className="faq group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                <span className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{item.q}</span>
                <span className="text-2xl leading-none text-faint group-open:hidden">+</span>
                <span className="hidden text-2xl leading-none text-faint group-open:block">–</span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-mute sm:text-base">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
