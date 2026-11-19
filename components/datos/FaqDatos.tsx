"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FaqItemDatos {
  pregunta: string;
  respuesta: string;
}

export interface FaqDatosProps {
  faqs: readonly FaqItemDatos[];
  titulo?: string;
  id?: string;
  className?: string;
}

export function FaqDatos({
  faqs,
  titulo = "Preguntas frecuentes",
  id = "faq-datos-titulo",
  className,
}: FaqDatosProps) {
  if (faqs.length === 0) return null;

  return (
    <section
      aria-labelledby={id}
      className={cn("rounded-xl border border-[#e2e2dc] bg-white p-6", className)}
    >
      <h2 id={id} className="h2-datos text-[#171716]">
        {titulo}
      </h2>
      <Accordion className="mt-4">
        {faqs.map((item, idx) => (
          <AccordionItem key={item.pregunta} value={`faq-${idx}`}>
            <AccordionTrigger className="text-base text-[#171716]">
              {item.pregunta}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-[#3c3c39]">
              {item.respuesta}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
