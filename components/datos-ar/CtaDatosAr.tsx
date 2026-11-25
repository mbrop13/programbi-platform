import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { cn } from "@/lib/utils";

export interface CtaDatosArProps {
  /** Ruta actual para tracking de WhatsApp (ej. "/ar/datos/inflacion"). */
  page: string;
  /** Posición del CTA para analytics. */
  ctaPosition?: string;
  className?: string;
}

/**
 * Bloque de conversión en voseo argentino para las páginas de /ar/datos.
 */
export function CtaDatosAr({
  page,
  ctaPosition = "datos_ar_cta",
  className,
}: CtaDatosArProps) {
  return (
    <section
      aria-label="Capacitación en Excel y Power BI en vivo"
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8",
        className
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Clases en vivo · 3 cuotas sin interés
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            ¿Querés armar este análisis vos? Aprendé Excel y Power BI en vivo
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Trabajás con planillas reales, conectás series oficiales como las del INDEC y
            armás tableros listos para presentar en tu laburo. Podés sumarte en{" "}
            <strong className="font-semibold text-foreground">3 cuotas sin interés</strong> o
            pedir una{" "}
            <strong className="font-semibold text-foreground">
              clase gratis coordinada por WhatsApp
            </strong>{" "}
            para ver cómo enseñamos.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm font-medium">
            <Link
              href="/ar/cursos/excel"
              className="inline-flex items-center gap-1 text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              Curso de Excel en vivo
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/ar/cursos/power-bi"
              className="inline-flex items-center gap-1 text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              Curso de Power BI en vivo
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/ar/cursos/analisis-de-datos"
              className="inline-flex items-center gap-1 text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              Programa Análisis de Datos
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col">
          <WhatsAppCta
            page={page}
            country="ar"
            intent="pack"
            ctaPosition={ctaPosition}
            customText="Hola ProgramBI, estuve viendo los datos de Argentina y quiero coordinar una clase gratis de Excel / Power BI."
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Coordinar clase gratis por WhatsApp
          </WhatsAppCta>
          <Link
            href="/ar/cursos/analisis-de-datos"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Ver programas de Argentina
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
