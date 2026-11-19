"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card
      aria-labelledby={id}
      className={cn(
        "gap-2 rounded-xl border border-border bg-card py-6 shadow-xs ring-0",
        className
      )}
    >
      <CardHeader className="px-6 pb-1">
        <CardTitle id={id} className="text-lg font-semibold tracking-tight text-foreground">
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <Accordion>
          {faqs.map((item, idx) => (
            <AccordionItem key={item.pregunta} value={`faq-${idx}`}>
              <AccordionTrigger className="text-[15px] font-medium text-foreground">
                {item.pregunta}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.respuesta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
