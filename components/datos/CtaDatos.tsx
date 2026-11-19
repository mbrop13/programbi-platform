"use client";

import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight, GraduationCap, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CLASE_GRATIS_HABILITADA } from "@/config/flags";
import { CUOTAS_SIN_INTERES } from "@/config/cuotas";
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics/marketing";
import { whatsappHref, withPageUtms } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const CURSOS_DATOS = [
  { href: "/cursos/analisis-de-datos", label: "Análisis de Datos" },
  { href: "/cursos/power-bi", label: "Power BI" },
  { href: "/cursos/sql-server", label: "SQL Server" },
  { href: "/cursos/python", label: "Python" },
  { href: "/cursos/excel", label: "Excel" },
] as const;

export interface CtaDatosProps {
  slug?: string;
  pagina?: string;
  className?: string;
}

export function CtaDatos({ slug, pagina, className }: CtaDatosProps) {
  const pagePath = pagina ?? (slug ? `/datos/carreras/${slug}` : "/datos");
  const waBase = whatsappHref({
    page: pagePath,
    intent: "general",
    country: "cl",
  });

  const handleWhatsApp = () => {
    const hrefConUtm = withPageUtms(waBase);
    trackWhatsAppClick({
      cta_position: "datos_carreras",
      course_slug: slug ?? "general",
      country: "cl",
      page: pagePath,
      href: hrefConUtm,
    });
    trackEvent("datos_whatsapp_click", {
      origen: "datos_carreras",
      origen_detalle: slug ?? "general",
    });
  };

  return (
    <Card
      aria-labelledby="cta-datos-titulo"
      className={cn(
        "gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0",
        className
      )}
    >
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <GraduationCap className="size-4 text-blue-600" aria-hidden="true" />
              <span>Formación aplicada · ProgramBI</span>
            </div>
            <h2
              id="cta-datos-titulo"
              className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
            >
              ¿Quieres sumar habilidades de datos a tu carrera?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Aprende herramientas prácticas de análisis, visualización y bases de datos con clases
              en vivo y proyectos reales. Disponible en {CUOTAS_SIN_INTERES} cuotas sin interés.
            </p>

            <div className="flex flex-wrap gap-2 pt-1.5">
              {CURSOS_DATOS.map((curso) => (
                <Link
                  key={curso.href}
                  href={curso.href}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "h-7 gap-1 rounded-md px-2.5 text-xs font-medium"
                  )}
                >
                  {curso.label}
                  <ArrowUpRight className="size-3 text-muted-foreground" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <a
              href={waBase}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsApp}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-10 gap-2 rounded-lg px-4 text-sm font-medium"
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Consultar por WhatsApp
            </a>
            {CLASE_GRATIS_HABILITADA ? (
              <Link
                href="/clase-gratis"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-10 gap-1.5 rounded-lg bg-card px-4 text-sm font-medium"
                )}
              >
                Clase gratis
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
