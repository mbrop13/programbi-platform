import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, FileText, MessageCircle } from "lucide-react";
import InicioVigente from "@/components/guias/InicioVigente";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { textoCuotas } from "@/config/cuotas";
import { getPais, ISO_CHILE } from "@/config/paises";
import { OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
import { fichaCurso, rutaFichaCurso } from "@/lib/guias/curso";
import type { InicioGuia } from "@/lib/guias/inicio";
import { horarioLocal } from "@/lib/paises/horarios";
import { etiquetaDescuentoCurso, type PromocionAplicable } from "@/lib/paises/precios";

/**
 * Tarjeta fija del curso para la columna derecha de la guía (escritorio `xl:`).
 * Gate PDF: nunca muestra montos. Solo el porcentaje de descuento vigente
 * cuando el país y el curso lo tienen publicado.
 */
export default function GuiaCursoLateral({
  iso,
  course,
  inicio,
  promotions,
  guiaSlug,
}: {
  iso: string;
  course: string;
  /** Próxima cohorte real del curso, fijada al construir el sitio. */
  inicio: InicioGuia | null;
  promotions?: readonly PromocionAplicable[];
  guiaSlug?: string;
}) {
  if (course === "general") return null;

  const ficha = fichaCurso(course);
  const horario = horarioLocal(iso);
  const lugar = iso === ISO_CHILE ? "Chile" : getPais(iso).nombre;
  const horaLocal = `de ${horario.inicio} a ${horario.fin}, hora de ${lugar}`;
  const rutaCurso = rutaFichaCurso(iso, course);
  const etiquetaDescuento = etiquetaDescuentoCurso(iso, course, promotions);
  const esVsExcel = guiaSlug === "power-bi-vs-excel";
  const cuotas = textoCuotas(iso);

  return (
    <aside
      data-testid="guia-curso-lateral"
      aria-label={`Curso en vivo de ${ficha.nombre}`}
      className="sticky top-[var(--sticky-below-nav,6rem)] overflow-hidden rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] transition-[top] duration-300 ease-out motion-reduce:transition-none"
    >
      <Image
        src={ficha.imagen}
        alt={`Curso en vivo de ${ficha.nombre} en ProgramBI`}
        width={520}
        height={325}
        sizes="280px"
        className="aspect-[16/10] h-auto w-full border-b border-[var(--g-border)] object-cover"
      />

      <div className="px-4 pb-4 pt-3.5">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
          Curso en vivo por Zoom
        </p>
        <p className="mt-1 text-base font-bold leading-snug tracking-tight text-[var(--g-ink)]">
          {ficha.nombre}
        </p>

        <ul className="mt-3 space-y-1.5 text-xs leading-snug text-[var(--g-muted)]">
          <li className="flex items-start gap-1.5">
            <CalendarDays size={13} className="mt-px shrink-0 text-[var(--g-ink)]" aria-hidden />
            <span className="font-semibold text-[var(--g-ink)]">
              <InicioVigente inicio={inicio} prefijo="Próximo inicio: " alterno={OPEN_COHORT_LABEL} />
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <Clock size={13} className="mt-px shrink-0 text-[var(--g-ink)]" aria-hidden />
            <span className="tabular-nums">{horaLocal}</span>
          </li>
        </ul>

        {esVsExcel ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-md border border-[var(--g-border-strong)] bg-[var(--g-accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--g-accent)]">
              Clase gratis
            </span>
            {cuotas ? (
              <span className="inline-flex items-center rounded-md border border-[var(--g-border)] bg-[var(--g-wash)] px-2.5 py-0.5 text-xs font-medium text-[var(--g-ink)]">
                {cuotas}
              </span>
            ) : null}
          </div>
        ) : etiquetaDescuento ? (
          <p className="mt-3">
            <span className="inline-flex items-center rounded-md border border-[var(--g-border-strong)] bg-[var(--g-wash)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--g-ink)]">
              {etiquetaDescuento}
            </span>
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="#temario-curso"
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-[var(--g-accent)] px-4 text-xs font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95"
          >
            <FileText size={14} aria-hidden /> Ver temario y precios
          </Link>
          <Link
            href={rutaCurso}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
          >
            Ver programa completo
          </Link>
          {esVsExcel ? (
            <Link
              href={rutaFichaCurso(iso, "excel")}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--g-border)] bg-[var(--g-wash)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-border-strong)]"
            >
              Ver curso de Excel
            </Link>
          ) : null}
          <WhatsAppCta
            page={esVsExcel ? "/guias/power-bi-vs-excel" : rutaCurso}
            intent="curso"
            course={ficha.nombre}
            courseSlug={course}
            country={iso}
            ctaPosition="guia_lateral"
            customText={
              esVsExcel
                ? "Hola, vengo de la guía Power BI vs Excel y quiero la clase gratis del curso de Power BI [power-bi-vs-excel]"
                : undefined
            }
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 text-xs font-semibold text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--g-accent)]"
          >
            <MessageCircle size={14} aria-hidden />
            {esVsExcel ? "Quiero mi clase gratis" : "Hablar por WhatsApp"}
          </WhatsAppCta>
        </div>
      </div>
    </aside>
  );
}
