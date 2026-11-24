"use client";

import type { MouseEvent } from "react";
import { ArrowRight, GraduationCap, MessageCircle } from "lucide-react";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { trackWhatsAppClick } from "@/lib/analytics/marketing";
import { cn } from "@/lib/utils";
import { whatsappHref, withPageUtms } from "@/lib/whatsapp";

export interface CtaDatosPortadaProps {
  className?: string;
}

export function CtaDatosPortada({ className }: CtaDatosPortadaProps) {
  const waBase = whatsappHref({
    page: "/datos",
    intent: "general",
    country: "cl",
  });

  const handleWhatsApp = (e: MouseEvent<HTMLAnchorElement>) => {
    const hrefConUtm = withPageUtms(waBase);
    e.currentTarget.href = hrefConUtm;

    trackWhatsAppClick({
      cta_position: "datos_portada",
      cta_location: "datos_portada",
      course_slug: "general",
      country: "cl",
      page: "/datos",
      page_path: "/datos",
      href: hrefConUtm,
    });
  };

  return (
    <Card
      aria-labelledby="cta-datos-portada-titulo"
      className={cn(
        "gap-0 rounded-[1.75rem] border border-line bg-white py-0 shadow-xs ring-0",
        className
      )}
    >
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <GraduationCap className="size-4 text-carreras" aria-hidden="true" />
              <span>Formación aplicada · ProgramBI</span>
            </div>
            <h2
              id="cta-datos-portada-titulo"
              className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
            >
              ¿Quieres aprender a analizar estos datos tú mismo?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Domina Power BI, SQL, Python y análisis de datos con clases en vivo y proyectos reales
              sobre cifras públicas de Chile.
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/cursos/analisis-de-datos"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 w-full justify-center gap-2 rounded-xl border-line-strong px-4 text-sm font-semibold sm:w-auto"
              )}
            >
              Ver curso de Análisis de Datos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href={waBase}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-tracked="1"
              onClick={handleWhatsApp}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "min-h-11 w-full justify-center gap-2 rounded-xl px-4 text-sm font-semibold sm:w-auto"
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
