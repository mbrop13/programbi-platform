import { GuiaFaqList, type GuiaFaqItem } from "@/components/guias/GuiaEditorialPrimitives";

export default function GuiaPasoAPasoFaq({
  faqs,
}: {
  faqs: { q: string; a: string }[];
}) {
  if (faqs.length === 0) return null;

  const items: GuiaFaqItem[] = faqs.map((faq) => ({
    id: faq.q,
    question: faq.q,
    answer: <p>{faq.a}</p>,
  }));

  return (
    <section
      id="preguntas-frecuentes"
      aria-labelledby="preguntas-frecuentes-titulo"
      className="mt-12 scroll-mt-24 border-t border-[var(--g-border)] pt-8"
    >
      <h2
        id="preguntas-frecuentes-titulo"
        className="mb-5 text-2xl font-bold tracking-[-0.02em] text-[var(--g-ink)]"
      >
        Preguntas frecuentes
      </h2>
      <GuiaFaqList items={items} />
    </section>
  );
}
