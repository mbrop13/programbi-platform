"use client";

import type { MouseEvent } from "react";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { CUOTAS_SIN_INTERES } from "@/config/cuotas";
import { OFERTA_CLASE_GRATIS_WHATSAPP } from "@/config/flags";
import { trackCtaCursoClick, trackWhatsAppClick } from "@/lib/analytics/marketing";
import { cursosParaCarrera } from "@/lib/datos/carreras-cursos";
import { cn } from "@/lib/utils";
import { whatsappHref, withPageUtms } from "@/lib/whatsapp";

export interface CtaCarreraSueldoProps {
  slug: string;
  nombreCorto: string;
  area: string;
  className?: string;
}

export function CtaCarreraSueldo({
  slug,
  nombreCorto,
  area,
  className,
}: CtaCarreraSueldoProps) {
  const { principal, banda } = cursosParaCarrera(slug, area);

  if (banda === "baja") {
    return null;
  }

  const pagePath = `/datos/carreras/${slug}`;

  const mensajeWa = OFERTA_CLASE_GRATIS_WHATSAPP
    ? `Hola, vengo de /datos/carreras/${slug} (bloque sueldo) y quiero la clase gratis del curso de ${principal.nombre}.`
    : `Hola, vengo de /datos/carreras/${slug} (bloque sueldo) y quiero información del curso de ${principal.nombre}.`;

  const waHref = whatsappHref({
    page: pagePath,
    customText: mensajeWa,
  });

  const handleCursoClick = () => {
    trackCtaCursoClick({
      cta_location: "ficha_sueldo",
      carrera_slug: slug,
      course_slug: principal.slug,
      page_path: pagePath,
    });
  };

  const handleWhatsAppClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const hrefConUtm = withPageUtms(waHref);
    e.currentTarget.href = hrefConUtm;
    trackWhatsAppClick({
      cta_location: "ficha_sueldo",
      cta_position: "ficha_sueldo",
      carrera_slug: slug,
      course_slug: principal.slug,
      country: "cl",
      page: pagePath,
      page_path: pagePath,
      href: hrefConUtm,
    });
  };

  return (
    <Card
      aria-labelledby="cta-carrera-sueldo-titulo"
      className={cn(
        "gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0",
        className,
      )}
    >
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-2xl space-y-1.5">
            <h2
              id="cta-carrera-sueldo-titulo"
              className="text-base font-semibold tracking-tight text-foreground sm:text-lg"
            >
              ¿Quieres subir tu sueldo? Aprende análisis de datos
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {banda === "mineria" ? "Aplica datos, Power BI y SQL en faena minera. " : null}
              {OFERTA_CLASE_GRATIS_WHATSAPP
                ? `Suma ${principal.nombre} a tu perfil de ${nombreCorto}: clases en vivo por Zoom, ${CUOTAS_SIN_INTERES} cuotas sin interés y clase gratis para probar.`
                : `Suma ${principal.nombre} a tu perfil de ${nombreCorto}: clases en vivo por Zoom y ${CUOTAS_SIN_INTERES} cuotas sin interés.`}
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={principal.href}
              onClick={handleCursoClick}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "min-h-11 w-full justify-center gap-1.5 rounded-lg px-4 text-sm font-medium sm:w-auto",
              )}
            >
              Ver curso de {principal.nombre}
              <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-tracked="1"
              onClick={handleWhatsAppClick}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 w-full justify-center gap-2 rounded-lg bg-card px-4 text-sm font-medium text-foreground sm:w-auto",
              )}
            >
              <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
              {OFERTA_CLASE_GRATIS_WHATSAPP
                ? "Coordinar clase gratis"
                : "Consultar por WhatsApp"}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
