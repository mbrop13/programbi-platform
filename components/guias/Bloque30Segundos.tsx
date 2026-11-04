import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, Clock, MessageCircle, MonitorPlay } from "lucide-react";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getPais, ISO_CHILE } from "@/config/paises";
import { precioListaPublico, precioPublico } from "@/config/pricing";
import { fichaCurso, rutaFichaCurso } from "@/lib/guias/curso";
import type { Guia } from "@/lib/guias/tipos";
import { horarioLocal } from "@/lib/paises/horarios";
import { formatMoneda } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Bloque «En 30 segundos» que abre cada guía: precio local, duración, horario,
 * modalidad y los dos CTA. Se renderiza en el servidor (importante para GEO:
 * los asistentes de IA tienen que poder leer el precio sin ejecutar JS).
 */
export default function Bloque30Segundos({ guia }: { guia: Guia }) {
  const iso = guia.country === "transversal" ? ISO_CHILE : guia.country;
  const curso = fichaCurso(guia.course);
  const precio = precioPublico(iso, guia.course);
  const lista = precioListaPublico(iso, guia.course);
  const horario = horarioLocal(iso);
  const lugar = iso === ISO_CHILE ? "Chile" : getPais(iso).nombre;
  const esGeneral = guia.course === "general";
  const nombreCurso = esGeneral ? "Cursos de ProgramBI" : curso.nombre;
  const rutaCurso = esGeneral ? rutaLocal(iso, "/cursos") : rutaFichaCurso(iso, guia.course);

  return (
    <section
      data-testid="en-30-segundos"
      aria-labelledby="en-30-segundos"
      className="mt-8 overflow-hidden rounded-[26px] border border-line-strong bg-paper"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-3">
        <h2 id="en-30-segundos" className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          En 30 segundos
        </h2>
        <p className="text-xs text-faint">
          {nombreCurso} · en vivo por Zoom · {lugar}
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-paper px-5 py-4">
          <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-mute">
            <BadgeCheck size={13} aria-hidden /> Precio
          </dt>
          <dd className="mt-1.5">
            {precio != null ? (
              <>
                <span className="text-2xl font-bold tracking-tight text-ink">{formatMoneda(iso, precio)}</span>
                {lista != null ? (
                  <span className="ml-2 text-xs text-faint line-through">{formatMoneda(iso, lista)}</span>
                ) : null}
                <span className="mt-0.5 block text-xs text-mute">
                  {curso.porNivel ? "por nivel · " : ""}3 cuotas sin interés
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold leading-snug text-ink">Consulta el valor por WhatsApp</span>
            )}
          </dd>
        </div>

        <div className="bg-paper px-5 py-4">
          <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-mute">
            <Clock size={13} aria-hidden /> Duración
          </dt>
          <dd className="mt-1.5">
            <span className="text-lg font-bold tracking-tight text-ink">{curso.horasTexto}</span>
            <span className="mt-0.5 block text-xs text-mute">dos clases por semana, en vivo</span>
          </dd>
        </div>

        <div className="bg-paper px-5 py-4">
          <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-mute">
            <CalendarDays size={13} aria-hidden /> Horario
          </dt>
          <dd className="mt-1.5">
            <span className="text-lg font-bold tracking-tight text-ink">
              {horario.inicio}–{horario.fin}
            </span>
            <span className="mt-0.5 block text-xs text-mute">hora de {lugar}</span>
          </dd>
        </div>

        <div className="bg-paper px-5 py-4">
          <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-mute">
            <MonitorPlay size={13} aria-hidden /> Incluye
          </dt>
          <dd className="mt-1.5">
            <span className="text-sm font-bold leading-snug text-ink">En vivo por Zoom</span>
            <span className="mt-0.5 block text-xs text-mute">Grabaciones de por vida · certificado al terminar</span>
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2 border-t border-line px-5 py-4 sm:flex-row sm:items-center">
        <Link
          href={rutaCurso}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.99]"
        >
          Reservar mi cupo
          <ArrowRight size={15} aria-hidden />
        </Link>
        <WhatsAppCta
          page={rutaCurso}
          intent="curso"
          course={nombreCurso}
          courseSlug={guia.course}
          country={iso}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line-strong bg-canvas px-5 text-sm font-semibold text-ink no-underline hover:bg-wash"
        >
          <MessageCircle size={15} aria-hidden />
          Hablar por WhatsApp
        </WhatsAppCta>
      </div>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line px-5 py-3 text-xs text-mute">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={13} aria-hidden /> Lunes y miércoles o martes y jueves
        </span>
        <span>{curso.inicio ? `Próximo inicio: ${curso.inicio}` : "Cupos abiertos · fecha por confirmar"}</span>
      </p>
    </section>
  );
}
