"use client";

import Link from "next/link";
import { ArrowUpRight, GraduationCap, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import type { CursoAfinCo } from "@/lib/datos-co/cursos-afines";
import { cn } from "@/lib/utils";

const CURSOS_BASE_CO: readonly CursoAfinCo[] = [
  {
    slug: "excel",
    href: "/co/cursos/excel",
    titulo: "Excel Avanzado",
    descripcion: "Automatiza reportes, tablas dinámicas y modelos financieros con precisión.",
  },
  {
    slug: "power-bi",
    href: "/co/cursos/power-bi",
    titulo: "Power BI",
    descripcion: "Construye tableros gerenciales con DAX y modelos de datos listos para negocio.",
  },
  {
    slug: "sql-server",
    href: "/co/cursos/sql-server",
    titulo: "SQL Server",
    descripcion: "Consulta, modela y automatiza bases de datos relacionales en entornos corporativos.",
  },
  {
    slug: "analisis-de-datos",
    href: "/co/cursos/analisis-de-datos",
    titulo: "Análisis de Datos",
    descripcion: "Domina análisis exploratorio, limpieza y visualización para roles analíticos.",
  },
];

export interface CtaDatosCoProps {
  pagina: string;
  cursos?: readonly CursoAfinCo[];
  titulo?: string;
  subtitulo?: string;
  carreraNombre?: string;
  ctaPosition?: string;
  className?: string;
}

export function CtaDatosCo({
  pagina,
  cursos,
  titulo = "¿Quieres armar este análisis tú? Aprende Excel y Power BI en vivo",
  subtitulo,
  carreraNombre,
  ctaPosition = "datos_co_cta",
  className,
}: CtaDatosCoProps) {
  const listaCursos = cursos && cursos.length > 0 ? cursos : CURSOS_BASE_CO;
  const descripcion =
    subtitulo ??
    (carreraNombre
      ? `Complementa tu perfil en ${carreraNombre} con clases en vivo y proyectos reales. Disponible en 3 cuotas sin interés y con clase gratis coordinada por WhatsApp.`
      : "Domina análisis de datos, tableros ejecutivos y automatización con clases en vivo y proyectos reales. Disponible en 3 cuotas sin interés y con clase gratis coordinada por WhatsApp.");

  const customText = carreraNombre
    ? `Hola, vengo de ${pagina} (${carreraNombre}) en ProgramBI Colombia y quiero información sobre temario y precios, las 3 cuotas sin interés y la clase gratis.`
    : `Hola, vengo de ${pagina} en ProgramBI Colombia y quiero información sobre temario y precios, las 3 cuotas sin interés y la clase gratis.`;

  return (
    <Card
      aria-labelledby="cta-datos-co-titulo"
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
              <span>Formación en vivo · ProgramBI Colombia</span>
            </div>
            <h2
              id="cta-datos-co-titulo"
              className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
            >
              {titulo}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {descripcion}
            </p>

            <div className="flex flex-wrap gap-2 pt-1.5">
              {listaCursos.map((curso) => (
                <Link
                  key={curso.href}
                  href={curso.href}
                  prefetch={false}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "h-7 gap-1 rounded-md px-2.5 text-xs font-medium"
                  )}
                >
                  {curso.titulo}
                  <ArrowUpRight className="size-3 text-muted-foreground" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:items-end">
            <WhatsAppCta
              page={pagina}
              country="co"
              ctaPosition={ctaPosition}
              customText={customText}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "min-h-11 w-full justify-center gap-2 rounded-lg px-4 text-sm font-medium sm:w-auto"
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Temario y precios por WhatsApp
            </WhatsAppCta>
            <p className="text-[11px] text-muted-foreground">
              3 cuotas sin interés · Clase gratis coordinada por WhatsApp
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
