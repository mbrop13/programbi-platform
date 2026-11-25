import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import type { CursoAfinMx } from "@/lib/datos-mx/types";

interface CtaDatosMxProps {
  page: string;
  cursosAfines?: CursoAfinMx[];
  ctaPosition?: string;
}

export default function CtaDatosMx({
  page,
  cursosAfines,
  ctaPosition = "datos_mx_cta",
}: CtaDatosMxProps) {
  const complementarios = (cursosAfines ?? []).filter(
    (c) => c.rol === "complementario"
  );

  return (
    <section
      aria-labelledby="cta-datos-mx-titulo"
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Capacitación en vivo para México
          </p>
          <h2
            id="cta-datos-mx-titulo"
            className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            ¿Quieres dominar Excel de verdad? Curso de Excel en vivo para México
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Aprende fórmulas, tablas dinámicas, Power Query y automatización con
            casos reales de nómina, ventas y finanzas. Clases en vivo con
            acompañamiento directo.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs font-medium text-foreground sm:text-sm">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              3 cuotas sin interés
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              Clase gratis coordinada por WhatsApp
            </li>
          </ul>
          {complementarios.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
              <span>Cursos complementarios para tu carrera:</span>
              {complementarios.map((curso) => (
                <Link
                  key={curso.slug}
                  href={curso.href}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 font-medium text-foreground transition-colors hover:bg-surface-hover"
                >
                  {curso.nombre}
                  <ArrowRight className="size-3" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href="/mx/cursos/excel"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Ver Curso de Excel en México
            <ArrowRight className="size-4" />
          </Link>
          <WhatsAppCta
            page={page}
            intent="curso"
            course="Curso de Excel en vivo"
            courseSlug="excel"
            country="mx"
            ctaPosition={ctaPosition}
            customText="Hola, me interesa el Curso de Excel en vivo para México y quiero coordinar mi clase gratis."
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover"
          >
            <MessageCircle className="size-4 text-emerald-600" />
            Coordinar clase gratis por WhatsApp
          </WhatsAppCta>
        </div>
      </div>
    </section>
  );
}
