import Link from "next/link";
import { CalendarDays, Clock, MessageCircle } from "lucide-react";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getPais, ISO_CHILE, normalizarPais } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import { OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
import { fichaCurso, rutaFichaCurso } from "@/lib/guias/curso";
import InicioVigente from "@/components/guias/InicioVigente";
import type { InicioGuia } from "@/lib/guias/inicio";
import type { Guia } from "@/lib/guias/tipos";
import { horarioLocal } from "@/lib/paises/horarios";
import { etiquetaDescuentoCurso, type PromocionAplicable } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Bloque «En 30 segundos» que abre cada guía: porcentaje de descuento vigente
 * (cuando aplica), enlace al desbloqueo de temario y precios, duración,
 * horario local, modalidad y CTAs. Renderizado 100% en servidor (GEO-ready).
 */
export default function Bloque30Segundos({
  guia,
  inicio = null,
  promotions,
}: {
  guia: Guia;
  /** Próxima cohorte real del curso, fijada al construir el sitio. */
  inicio?: InicioGuia | null;
  promotions?: readonly PromocionAplicable[];
}) {
  const iso = !guia.country || guia.country === "transversal" ? ISO_CHILE : normalizarPais(guia.country);
  const curso = fichaCurso(guia.course);
  const horario = horarioLocal(iso);
  const lugar = iso === ISO_CHILE ? "Chile" : getPais(iso).nombre;
  const esGeneral = guia.course === "general";
  const nombreCurso = esGeneral ? "Cursos de ProgramBI" : curso.nombre;
  const rutaCurso = esGeneral ? rutaLocal(iso, "/cursos") : rutaFichaCurso(iso, guia.course);
  const rutaTemario = esGeneral ? rutaCurso : "#temario-curso";
  const etiquetaDescuento = esGeneral ? null : etiquetaDescuentoCurso(iso, guia.course, promotions);

  return (
    <section
      data-testid="en-30-segundos"
      aria-labelledby="en-30-segundos"
      className="mt-8 overflow-hidden rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--g-border)] px-5 py-3">
        <h2
          id="en-30-segundos"
          className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]"
        >
          En 30 segundos
        </h2>
        <p className="text-xs text-[var(--g-muted)]">
          {nombreCurso} · en vivo por Zoom · {lugar}
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-px bg-[var(--g-border)] sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[var(--g-surface)] px-5 py-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]">
            Precio y temario
          </dt>
          <dd className="mt-1.5">
            {etiquetaDescuento ? (
              <span className="block text-base font-bold tabular-nums tracking-tight text-[var(--g-ink)]">
                {etiquetaDescuento}
              </span>
            ) : null}
            <Link
              href={rutaTemario}
              className="mt-0.5 inline-flex min-h-[44px] items-center text-sm font-semibold leading-snug text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--g-accent)] sm:min-h-0"
            >
              Ver temario y precios (PDF)
            </Link>
            <span className="mt-0.5 block text-xs text-[var(--g-muted)]">
              {curso.porNivel ? "por nivel · " : ""}
              {textoCuotas(iso) || "pago único con tarjeta"}
            </span>
          </dd>
        </div>

        <div className="bg-[var(--g-surface)] px-5 py-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]">
            Duración
          </dt>
          <dd className="mt-1.5">
            <span className="text-lg font-bold tabular-nums tracking-tight text-[var(--g-ink)]">
              {curso.horasTexto}
            </span>
            <span className="mt-0.5 block text-xs text-[var(--g-muted)]">dos clases por semana, en vivo</span>
          </dd>
        </div>

        <div className="bg-[var(--g-surface)] px-5 py-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]">
            Horario
          </dt>
          <dd className="mt-1.5">
            <span className="text-lg font-bold tabular-nums tracking-tight text-[var(--g-ink)]">
              {horario.inicio} a {horario.fin}
            </span>
            <span className="mt-0.5 block text-xs text-[var(--g-muted)]">hora de {lugar}</span>
          </dd>
        </div>

        <div className="bg-[var(--g-surface)] px-5 py-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]">
            Incluye
          </dt>
          <dd className="mt-1.5">
            <span className="text-sm font-bold leading-snug text-[var(--g-ink)]">En vivo por Zoom</span>
            <span className="mt-0.5 block text-xs text-[var(--g-muted)]">
              Campus virtual con clases y material · certificado al terminar
            </span>
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2.5 border-t border-[var(--g-border)] px-5 py-4 sm:flex-row sm:items-center">
        <Link
          href={rutaCurso}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-[var(--g-accent)] px-5 text-sm font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95"
        >
          Ver el programa completo
        </Link>
        <WhatsAppCta
          page={rutaCurso}
          intent="curso"
          course={nombreCurso}
          courseSlug={guia.course}
          country={iso}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-5 text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
        >
          <MessageCircle size={15} aria-hidden />
          Hablar por WhatsApp
        </WhatsAppCta>
      </div>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--g-border)] px-5 py-3 text-xs text-[var(--g-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={13} aria-hidden /> Lunes y miércoles o martes y jueves
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={13} aria-hidden />
          <InicioVigente inicio={inicio} prefijo="Próximo inicio: " alterno={OPEN_COHORT_LABEL} />
        </span>
      </p>
    </section>
  );
}
