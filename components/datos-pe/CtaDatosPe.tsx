import Link from "next/link";
import { ArrowUpRight, GraduationCap, MessageCircle } from "lucide-react";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { CUOTAS_SIN_INTERES } from "@/config/cuotas";
import { cursosAfinesCarreraPe, type CursoAfinPe } from "@/lib/datos-pe/cursos-afines";
import type { CarreraPe } from "@/lib/datos-pe/types";
import { cn } from "@/lib/utils";

const CURSOS_BASE_PE: readonly CursoAfinPe[] = [
  { slug: "excel", nombre: "Excel", href: "/pe/cursos/excel" },
  { slug: "power-bi", nombre: "Power BI", href: "/pe/cursos/power-bi" },
  { slug: "analisis-de-datos", nombre: "Análisis de Datos", href: "/pe/cursos/analisis-de-datos" },
  { slug: "sql-server", nombre: "SQL Server", href: "/pe/cursos/sql-server" },
  { slug: "python", nombre: "Python", href: "/pe/cursos/python" },
];

export interface CtaDatosPeProps {
  carrera?: Pick<CarreraPe, "slug" | "nombre" | "codigoInei">;
  pagina?: string;
  className?: string;
}

export function CtaDatosPe({
  carrera,
  pagina = "/pe/datos",
  className,
}: CtaDatosPeProps) {
  const recomendacion = carrera ? cursosAfinesCarreraPe(carrera) : null;
  const chips = recomendacion ? recomendacion.chips : CURSOS_BASE_PE;

  const customText = carrera && recomendacion
    ? `Hola, vengo de ${pagina} (${carrera.nombre}) y quiero cotizar el curso de ${recomendacion.principal.nombre} en Perú y averiguar cómo me pueden ayudar.`
    : `Hola, vengo de ${pagina} y quiero cotizar un curso de Excel o Power BI en Perú y averiguar cómo me pueden ayudar.`;

  return (
    <Card
      aria-labelledby="cta-datos-pe-titulo"
      className={cn(
        "gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0",
        className,
      )}
    >
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <GraduationCap className="size-4 text-blue-600" aria-hidden="true" />
              <span>Formación aplicada en vivo · ProgramBI Perú</span>
            </div>
            <h2
              id="cta-datos-pe-titulo"
              className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
            >
              ¿Quieres armar este análisis tú? Aprende Excel y Power BI en vivo
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {recomendacion && carrera ? (
                <>
                  Para {carrera.nombre} te recomendamos empezar por{" "}
                  <strong className="font-medium text-foreground">
                    {recomendacion.principal.nombre}
                  </strong>{" "}
                  y{" "}
                  <strong className="font-medium text-foreground">
                    {recomendacion.secundario.nombre}
                  </strong>
                  . Clases en vivo con proyectos reales y {CUOTAS_SIN_INTERES} cuotas sin interés.
                  Revisa el curso completo o cotiza por WhatsApp y averigua cómo podríamos ayudarte.
                </>
              ) : (
                <>
                  Domina tablas dinámicas, Power Query, DAX y visualización de datos con proyectos
                  reales en {CUOTAS_SIN_INTERES} cuotas sin interés. Revisa el curso completo o
                  cotiza por WhatsApp y averigua cómo podríamos ayudarte.
                </>
              )}
            </p>

            <div className="flex flex-wrap gap-2 pt-1.5">
              {chips.map((curso) => (
                <Link
                  key={curso.href}
                  href={curso.href}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "h-7 gap-1 rounded-md px-2.5 text-xs font-medium",
                  )}
                >
                  {curso.nombre}
                  <ArrowUpRight className="size-3 text-muted-foreground" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={recomendacion ? recomendacion.principal.href : "/pe/cursos/excel"}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "min-h-11 w-full justify-center gap-1.5 rounded-lg px-4 text-sm font-medium sm:w-auto",
              )}
            >
              Ver curso de {recomendacion ? recomendacion.principal.nombre : "Excel"}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <WhatsAppCta
              page={pagina}
              intent="general"
              course={recomendacion?.principal.nombre ?? "Excel y Power BI"}
              courseSlug={recomendacion?.principal.slug ?? "excel"}
              country="pe"
              ctaPosition="datos_pe_cta"
              customText={customText}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 w-full justify-center gap-2 rounded-lg bg-card px-4 text-sm font-medium sm:w-auto",
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Cotiza el curso por WhatsApp
            </WhatsAppCta>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
