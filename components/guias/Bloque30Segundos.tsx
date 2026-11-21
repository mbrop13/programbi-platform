import Link from "next/link";
import { CalendarDays, Check, Clock, MessageCircle } from "lucide-react";
import { GuiaToolVisual, GuiaVisualBadge } from "@/components/guias/GuiaEditorialPrimitives";
import InicioVigente from "@/components/guias/InicioVigente";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { textoCuotas } from "@/config/cuotas";
import { getPais, ISO_CHILE, normalizarPais } from "@/config/paises";
import { OPEN_COHORT_LABEL } from "@/lib/data/course-schedules";
import { fichaCurso, rutaFichaCurso } from "@/lib/guias/curso";
import type { InicioGuia } from "@/lib/guias/inicio";
import type { Guia } from "@/lib/guias/tipos";
import { horarioLocal } from "@/lib/paises/horarios";
import { etiquetaDescuentoCurso, type PromocionAplicable } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Bloque «Resumen en 30 segundos» que abre cada guía: porcentaje de descuento
 * vigente (cuando aplica), enlace al desbloqueo de temario y precios,
 * duración, horario local, modalidad y CTAs. Renderizado 100% en servidor.
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

  const puntosClave = [
    {
      etiqueta: "Precio y temario",
      valor: etiquetaDescuento || "Arancel vigente en PDF",
      detalle: `${curso.porNivel ? "por nivel, " : ""}${textoCuotas(iso) || "pago único con tarjeta"}`,
      esTemario: true,
    },
    {
      etiqueta: "Duración",
      valor: curso.horasTexto,
      detalle: "Dos clases por semana, en vivo",
      esTemario: false,
    },
    {
      etiqueta: "Horario local",
      valor: `${horario.inicio} a ${horario.fin}`,
      detalle: `Hora de ${lugar}`,
      esTemario: false,
    },
    {
      etiqueta: "Modalidad",
      valor: "En vivo por Zoom",
      detalle: "Campus virtual con clases y certificado",
      esTemario: false,
    },
  ];

  return (
    <section
      data-testid="en-30-segundos"
      aria-labelledby="en-30-segundos"
      className="mt-8 rounded-2xl border border-[var(--g-accent)]/20 bg-[var(--g-accent-soft)]/50 p-2 sm:p-3"
    >
      <div className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5 shadow-[var(--g-card-shadow)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--g-border)] pb-4">
          <div className="flex items-center gap-3">
            <GuiaToolVisual tool={guia.course} course={guia.course} size="sm" />
            <div>
              <h2
                id="en-30-segundos"
                className="text-base font-bold tracking-tight text-[var(--g-ink)] sm:text-lg"
              >
                Resumen en 30 segundos
              </h2>
              <p className="text-xs text-[var(--g-muted)]">
                {nombreCurso} en vivo por Zoom
              </p>
            </div>
          </div>
          <GuiaVisualBadge tone="accent">{lugar}</GuiaVisualBadge>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {puntosClave.map((punto) => (
            <div
              key={punto.etiqueta}
              className="flex items-start gap-2.5 rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)]/55 p-3.5"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--g-ok-soft)] text-[var(--g-ok)]"
              >
                <Check size={12} strokeWidth={2.4} />
              </span>
              <div className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]">
                  {punto.etiqueta}
                </dt>
                <dd className="mt-0.5">
                  <span className="block text-sm font-bold tabular-nums tracking-tight text-[var(--g-ink)]">
                    {punto.valor}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-[var(--g-muted)]">
                    {punto.detalle}
                  </span>
                  {punto.esTemario ? (
                    <Link
                      href={rutaTemario}
                      className="mt-1 inline-flex min-h-[44px] items-center text-xs font-semibold text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--g-accent)] sm:min-h-0"
                    >
                      Ver temario y precios (PDF)
                    </Link>
                  ) : null}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <Link
            href={rutaCurso}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[var(--g-accent)] px-5 text-sm font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95"
          >
            Ver el programa completo
          </Link>
          <WhatsAppCta
            page={rutaCurso}
            intent="curso"
            course={nombreCurso}
            courseSlug={guia.course}
            country={iso}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-5 text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
          >
            <MessageCircle size={15} aria-hidden />
            Hablar por WhatsApp
          </WhatsAppCta>
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[var(--g-border)] pt-3.5 text-xs text-[var(--g-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} aria-hidden /> Lunes y miércoles o martes y jueves
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} aria-hidden />
            <InicioVigente inicio={inicio} prefijo="Próximo inicio: " alterno={OPEN_COHORT_LABEL} />
          </span>
        </p>
      </div>
    </section>
  );
}
