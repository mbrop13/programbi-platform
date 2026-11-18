import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, FileText, MessageCircle } from "lucide-react";
import InicioVigente from "@/components/guias/InicioVigente";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getPais, ISO_CHILE } from "@/config/paises";
import { OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
import { fichaCurso, rutaFichaCurso } from "@/lib/guias/curso";
import type { InicioGuia } from "@/lib/guias/inicio";
import { horarioLocal } from "@/lib/paises/horarios";
import { etiquetaDescuentoCurso, type PromocionAplicable } from "@/lib/paises/precios";

/**
 * Tarjeta fija del curso para la columna derecha de la guía (solo escritorio
 * ancho; `GuiaPage` la oculta bajo 1360 px).
 *
 * Gate PDF: nunca muestra montos. Solo el porcentaje de descuento vigente
 * (salvo Paraguay, donde el valor se consulta por WhatsApp).
 */
export default function GuiaCursoLateral({
  iso,
  course,
  inicio,
  promotions,
}: {
  iso: string;
  course: string;
  /** Próxima cohorte real del curso, fijada al construir el sitio. */
  inicio: InicioGuia | null;
  promotions?: readonly PromocionAplicable[];
}) {
  if (course === "general") return null;

  const ficha = fichaCurso(course);
  const horario = horarioLocal(iso);
  const lugar = iso === ISO_CHILE ? "Chile" : getPais(iso).nombre;
  const horaLocal = `de ${horario.inicio} a ${horario.fin}, hora de ${lugar}`;
  const rutaCurso = rutaFichaCurso(iso, course);
  const etiquetaDescuento = iso === "py" ? null : etiquetaDescuentoCurso(iso, course, promotions);

  return (
    <aside
      data-testid="guia-curso-lateral"
      aria-label={`Curso en vivo de ${ficha.nombre}`}
      className="sticky top-[var(--sticky-below-nav,6rem)] overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition-[top] duration-300 ease-out motion-reduce:transition-none"
    >
      <Image
        src={ficha.imagen}
        alt={`Curso en vivo de ${ficha.nombre} en ProgramBI`}
        width={520}
        height={325}
        sizes="260px"
        className="aspect-[16/10] h-auto w-full border-b border-line object-cover"
      />

      <div className="px-4 pb-4 pt-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mute">Curso en vivo por Zoom</p>
        <p className="mt-1 text-base font-bold leading-snug tracking-tight text-ink">{ficha.nombre}</p>

        <ul className="mt-3 space-y-1.5 text-xs leading-snug text-mute">
          <li className="flex items-start gap-1.5">
            <CalendarDays size={13} className="mt-px shrink-0 text-ink" aria-hidden />
            <span className="font-semibold text-ink">
              <InicioVigente inicio={inicio} prefijo="Próximo inicio: " alterno={OPEN_COHORT_LABEL} />
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <Clock size={13} className="mt-px shrink-0 text-ink" aria-hidden />
            <span>{horaLocal}</span>
          </li>
        </ul>

        {etiquetaDescuento ? (
          <p className="mt-3">
            <span className="inline-flex items-center rounded-full border border-line-strong bg-wash px-2.5 py-1 text-[11px] font-semibold text-ink">
              {etiquetaDescuento}
            </span>
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="#temario-curso"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-semibold text-canvas no-underline transition-transform active:scale-[0.99]"
          >
            <FileText size={14} aria-hidden /> Ver temario y precios
          </Link>
          <Link
            href={rutaCurso}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-line-strong bg-canvas px-4 text-[13px] font-semibold text-ink no-underline hover:bg-wash"
          >
            Ver curso <ArrowRight size={14} aria-hidden />
          </Link>
          <WhatsAppCta
            page={rutaCurso}
            intent="curso"
            course={ficha.nombre}
            courseSlug={course}
            country={iso}
            ctaPosition="guia_lateral"
            className="inline-flex h-9 items-center justify-center gap-1.5 text-xs font-semibold text-ink underline underline-offset-4 hover:text-mute"
          >
            <MessageCircle size={14} aria-hidden />
            Hablar por WhatsApp
          </WhatsAppCta>
        </div>
      </div>
    </aside>
  );
}
