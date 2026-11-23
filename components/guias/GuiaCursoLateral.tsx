import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, FileText, MessageCircle } from "lucide-react";
import { GuiaVisualBadge } from "@/components/guias/GuiaEditorialPrimitives";
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
 * Tarjeta fija del curso para el rail lateral de la guía.
 * Conserva el formato ancho y compacto arriba de «En esta guía».
 * Gate PDF: nunca muestra montos. Solo el porcentaje de descuento vigente
 * cuando el país y el curso lo tienen publicado.
 */
export default function GuiaCursoLateral({
  iso,
  course,
  inicio,
  promotions,
  guiaSlug,
  sticky = true,
}: {
  iso: string;
  course: string;
  /** Próxima cohorte real del curso, fijada al construir el sitio. */
  inicio: InicioGuia | null;
  promotions?: readonly PromocionAplicable[];
  guiaSlug?: string;
  sticky?: boolean;
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
      className={`overflow-hidden rounded-2xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] p-4 shadow-[var(--g-card-shadow)] sm:p-5 ${
        sticky
          ? "sticky top-[var(--sticky-below-nav,6rem)] transition-[top] duration-300 ease-out motion-reduce:transition-none"
          : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <Image
          src={ficha.imagen}
          alt={`Curso en vivo de ${ficha.nombre} en ProgramBI`}
          width={160}
          height={100}
          sizes="80px"
          className="h-12 w-20 shrink-0 rounded-lg border border-[var(--g-border)] object-cover"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
            Curso en vivo por Zoom
          </p>
          <p className="mt-0.5 text-base font-bold leading-snug tracking-tight text-[var(--g-ink)]">
            {ficha.nombre}
          </p>
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-x-3 gap-y-2 border-t border-[var(--g-border)] pt-3 text-xs leading-snug text-[var(--g-muted)] sm:grid-cols-2">
        <li className="flex items-start gap-1.5">
          <CalendarDays size={13} className="mt-px shrink-0 text-[var(--g-ink)]" aria-hidden />
          <span className="font-semibold text-[var(--g-ink)]">
            <InicioVigente inicio={inicio} prefijo="Inicio: " alterno={OPEN_COHORT_LABEL} />
          </span>
        </li>
        <li className="flex items-start gap-1.5">
          <Clock size={13} className="mt-px shrink-0 text-[var(--g-ink)]" aria-hidden />
          <span className="tabular-nums">{horaLocal}</span>
        </li>
      </ul>

      {esVsExcel ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <GuiaVisualBadge tone="accent">Clase gratis</GuiaVisualBadge>
          {cuotas ? <GuiaVisualBadge tone="neutral">{cuotas}</GuiaVisualBadge> : null}
        </div>
      ) : etiquetaDescuento ? (
        <p className="mt-2.5">
          <GuiaVisualBadge tone="accent" className="tabular-nums">
            {etiquetaDescuento}
          </GuiaVisualBadge>
        </p>
      ) : (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <GuiaVisualBadge tone="neutral">
            Precio normal en {getPais(iso).moneda}
          </GuiaVisualBadge>
          {cuotas ? <GuiaVisualBadge tone="neutral">{cuotas}</GuiaVisualBadge> : null}
          {!getPais(iso).precioDirecto ? (
            <GuiaVisualBadge tone="accent">Clase gratis</GuiaVisualBadge>
          ) : null}
        </div>
      )}

      <div className="mt-3.5 flex flex-col gap-2">
        <Link
          href="#temario-curso"
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[var(--g-accent)] px-4 text-xs font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95"
        >
          <FileText size={14} aria-hidden /> Ver temario y precios
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={rutaCurso}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-center text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
          >
            Ver programa
          </Link>
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
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)] px-3 text-center text-xs font-semibold text-[var(--g-accent)] no-underline transition-colors hover:border-[var(--g-border-strong)] hover:text-[var(--g-ink)]"
          >
            <MessageCircle size={13} aria-hidden />
            {esVsExcel ? "Clase gratis" : "WhatsApp"}
          </WhatsAppCta>
        </div>
        {esVsExcel ? (
          <Link
            href={rutaFichaCurso(iso, "excel")}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--g-border)] bg-[var(--g-bg)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-border-strong)]"
          >
            Ver curso de Excel
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
