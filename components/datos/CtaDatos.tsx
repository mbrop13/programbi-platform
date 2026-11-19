"use client";

import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowUpRight, GraduationCap, MessageCircle } from "lucide-react";
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
    <section
      aria-labelledby="cta-datos-titulo"
      className={cn(
        "rounded-xl border border-[#e2e2dc] border-l-4 border-l-[#1890ff] bg-white p-6 sm:p-7",
        className
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#1063b8] uppercase">
            <GraduationCap className="size-4" aria-hidden="true" />
            Formación aplicada · ProgramBI
          </div>
          <h2 id="cta-datos-titulo" className="text-xl font-bold text-[#171716] sm:text-2xl">
            ¿Quieres sumar habilidades de datos a tu carrera?
          </h2>
          <p className="text-sm leading-relaxed text-[#5c5c58]">
            Aprende herramientas prácticas de análisis, visualización y bases de datos con clases en
            vivo y proyectos reales. Disponible en {CUOTAS_SIN_INTERES} cuotas sin interés.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {CURSOS_DATOS.map((curso) => (
              <Link
                key={curso.href}
                href={curso.href}
                className="inline-flex items-center gap-1 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] px-3 py-1.5 text-xs font-semibold text-[#171716] transition-colors hover:border-[#1890ff] hover:bg-[#e9f4ff] hover:text-[#1890ff]"
              >
                {curso.label}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <a
            href={waBase}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1063b8] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d549c]"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Consultar por WhatsApp
          </a>
          {CLASE_GRATIS_HABILITADA ? (
            <Link
              href="/clase-gratis"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e2e2dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#171716] transition-colors hover:bg-[#f3f3f0]"
            >
              Clase gratis
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
