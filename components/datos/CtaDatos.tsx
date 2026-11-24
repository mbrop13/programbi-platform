"use client";

import type { MouseEvent } from "react";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight, GraduationCap, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import {
  CLASE_GRATIS_HABILITADA,
  OFERTA_CLASE_GRATIS_WHATSAPP,
} from "@/config/flags";
import { CUOTAS_SIN_INTERES } from "@/config/cuotas";
import {
  trackCtaCursoClick,
  trackEvent,
  trackWhatsAppClick,
} from "@/lib/analytics/marketing";
import { cursosParaCarrera } from "@/lib/datos/carreras-cursos";
import { whatsappHref, withPageUtms } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const CURSOS_DATOS = [
  { slug: "analisis-de-datos", href: "/cursos/analisis-de-datos", nombre: "Análisis de Datos" },
  { slug: "power-bi", href: "/cursos/power-bi", nombre: "Power BI" },
  { slug: "sql-server", href: "/cursos/sql-server", nombre: "SQL Server" },
  { slug: "python", href: "/cursos/python", nombre: "Python" },
  { slug: "excel", href: "/cursos/excel", nombre: "Excel" },
] as const;

export interface CtaDatosProps {
  slug?: string;
  area?: string;
  nombreCorto?: string;
  pagina?: string;
  className?: string;
}

export function CtaDatos({ slug, area, nombreCorto, pagina, className }: CtaDatosProps) {
  const pagePath = pagina ?? (slug ? `/datos/carreras/${slug}` : "/datos");
  const esFichaCarrera = Boolean(slug && area);
  const recomendacion =
    slug && area ? cursosParaCarrera(slug, area) : null;

  if (esFichaCarrera && recomendacion?.banda === "baja") {
    return (
      <p
        className={cn(
          "rounded-xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground",
          className,
        )}
      >
        Puedes comparar esta carrera con otras en el{" "}
        <Link href="/datos/carreras/comparar" className="font-medium text-blue-700 hover:underline">
          comparador de sueldos y empleabilidad
        </Link>{" "}
        o volver al{" "}
        <Link href="/datos/carreras" className="font-medium text-blue-700 hover:underline">
          ranking de carreras en Chile
        </Link>
        .
      </p>
    );
  }

  const waBase = recomendacion && slug
    ? whatsappHref({
        page: pagePath,
        customText: `Hola, vengo de /datos/carreras/${slug} (final de la ficha) y quiero información del curso de ${recomendacion.principal.nombre}.`,
      })
    : whatsappHref({
        page: pagePath,
        intent: "general",
        country: "cl",
      });

  const handleWhatsApp = (e: MouseEvent<HTMLAnchorElement>) => {
    const hrefConUtm = withPageUtms(waBase);
    e.currentTarget.href = hrefConUtm;

    if (esFichaCarrera && recomendacion && slug) {
      trackWhatsAppClick({
        cta_location: "ficha_final",
        cta_position: "ficha_final",
        carrera_slug: slug,
        course_slug: recomendacion.principal.slug,
        country: "cl",
        page: pagePath,
        page_path: pagePath,
        href: hrefConUtm,
      });
      return;
    }

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

  const chips = recomendacion ? recomendacion.chips : CURSOS_DATOS;

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
              {recomendacion && slug
                ? recomendacion.banda === "alta" && recomendacion.chips.length === 3
                  ? `Para ${nombreCorto ?? slug} te recomendamos SQL Server, Python y Análisis de Datos. Clases en vivo con proyectos reales, ${CUOTAS_SIN_INTERES} cuotas sin interés${OFERTA_CLASE_GRATIS_WHATSAPP ? " y clase gratis." : "."}`
                  : recomendacion.banda === "mineria"
                    ? `Para ${nombreCorto ?? slug} te recomendamos Análisis de Datos para la Minería y ${recomendacion.secundario.nombre} para aplicar datos, Power BI y SQL en faena minera. Clases en vivo con proyectos reales, ${CUOTAS_SIN_INTERES} cuotas sin interés${OFERTA_CLASE_GRATIS_WHATSAPP ? " y clase gratis." : "."}`
                    : `Para ${nombreCorto ?? slug} te recomendamos ${recomendacion.principal.nombre} y ${recomendacion.secundario.nombre}. Clases en vivo con proyectos reales, ${CUOTAS_SIN_INTERES} cuotas sin interés${OFERTA_CLASE_GRATIS_WHATSAPP ? " y clase gratis." : "."}`
                : `Aprende herramientas prácticas de análisis, visualización y bases de datos con clases en vivo y proyectos reales. Disponible en ${CUOTAS_SIN_INTERES} cuotas sin interés.`}
            </p>

            <div className="flex flex-wrap gap-2 pt-1.5">
              {chips.map((curso) => (
                <Link
                  key={curso.href}
                  href={curso.href}
                  onClick={
                    esFichaCarrera && slug
                      ? () =>
                          trackCtaCursoClick({
                            cta_location: "ficha_final",
                            carrera_slug: slug,
                            course_slug: curso.slug,
                            page_path: pagePath,
                          })
                      : undefined
                  }
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "h-7 gap-1 rounded-md px-2.5 text-xs font-medium"
                  )}
                >
                  {curso.nombre}
                  <ArrowUpRight className="size-3 text-muted-foreground" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={waBase}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-tracked="1"
              onClick={handleWhatsApp}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "min-h-11 w-full justify-center gap-2 rounded-lg px-4 text-sm font-medium sm:w-auto"
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Consultar por WhatsApp
            </a>
            {CLASE_GRATIS_HABILITADA && OFERTA_CLASE_GRATIS_WHATSAPP ? (
              <Link
                href="/clase-gratis"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-11 w-full justify-center gap-1.5 rounded-lg bg-card px-4 text-sm font-medium sm:w-auto"
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
