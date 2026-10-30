import type { DetalleCursoLocal } from "@/lib/paises/detalle-curso";

/** Preguntas locales de la ficha. No incluye el precio: eso se ve con la cuenta. */
export default function CourseLocalSeo({ detalle }: { detalle: DetalleCursoLocal }) {
  if (detalle.faqs.length === 0) return null;

  return (
    <section className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Preguntas frecuentes</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {detalle.faqs.map((item) => (
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
