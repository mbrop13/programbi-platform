import { ArrowRight, CalendarDays, Check, Clock, MessageCircle } from "lucide-react";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";

/**
 * Resumen del brochure para teléfonos.
 *
 * Las hojas A4 se achican a ~42 % en un teléfono y su texto queda en unos
 * 6 px. Este bloque repite lo que la persona vino a buscar —arancel, cuotas,
 * próximas fechas y cómo inscribirse— en un diseño que se lee sin ampliar. El
 * documento completo sigue debajo, intacto.
 *
 * Sale de los mismos datos que las hojas (`CourseBrochureData`), así que no
 * puede contradecirlas. Solo se ve bajo `md`, no se imprime y no entra al PDF.
 */
export default function BrochureMobileSummary({ data }: { data: CourseBrochureData }) {
  const tieneDescuento =
    data.descuentoPct > 0 &&
    Boolean(data.precioListaFormateado) &&
    data.precioListaFormateado !== data.precioFormateado;
  const cuotas = data.cuotaTexto || data.etiquetaCuotas;
  const cohortes = data.schedules.slice(0, 3);
  const porNivel = data.levelsCount > 1;

  return (
    <section
      aria-label="Resumen del curso"
      className="brochure-no-print w-full max-w-[560px] md:hidden"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mute">
        Resumen · Edición {data.paisNombre}
      </p>
      <h2 className="mt-1.5 text-[26px] font-bold leading-tight tracking-tight text-ink">{data.title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-mute">{data.shortDescription}</p>

      <div className="mt-4 rounded-[22px] bg-ink p-5 text-paper shadow-[0_18px_40px_-18px_rgba(23,23,22,0.7)]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-paper/65">
            {porNivel ? "Arancel por nivel" : "Arancel"} · {data.moneda}
          </p>
          {tieneDescuento ? (
            <span className="rounded-full bg-[#F2C811] px-2 py-0.5 text-[11px] font-bold text-ink">
              −{data.descuentoPct}%
            </span>
          ) : null}
        </div>
        {tieneDescuento ? (
          <p className="mt-3 text-sm text-paper/55 line-through">Antes {data.precioListaFormateado}</p>
        ) : null}
        <p className={`${tieneDescuento ? "mt-0.5" : "mt-3"} text-4xl font-bold tracking-tight tabular-nums`}>
          {data.precioFormateado}
        </p>
        <p className="mt-2 text-sm font-semibold text-[#F2C811]">{cuotas}</p>
        <p className="mt-2 text-xs leading-relaxed text-paper/65">
          {data.hours} h en vivo por Zoom{porNivel ? " por nivel" : ""} · {data.modulesCount} módulos · Certificado
          digital
        </p>
      </div>

      <div className="mt-3 rounded-[22px] border border-line bg-paper p-5">
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <CalendarDays size={16} aria-hidden /> Próximas fechas de inicio
        </p>
        {cohortes.length > 0 ? (
          <ul className="mt-3 divide-y divide-line">
            {cohortes.map((cohorte) => (
              <li key={cohorte.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[15px] font-semibold leading-snug text-ink">{cohorte.fecha}</p>
                  <span className="shrink-0 rounded-full bg-wash px-2 py-0.5 text-[11px] font-semibold text-ink">
                    {cohorte.nivel}
                  </span>
                </div>
                <p className="mt-1 flex items-start gap-1.5 text-sm leading-snug text-mute">
                  <Clock size={14} className="mt-0.5 shrink-0" aria-hidden />
                  <span>
                    {cohorte.dias} · {cohorte.horario}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-mute">
            Cupos abiertos: escríbenos por WhatsApp y te confirmamos la próxima fecha.
          </p>
        )}
      </div>

      {data.mediosPago.length > 0 ? (
        <ul className="mt-3 space-y-1.5 rounded-[22px] border border-line bg-paper p-5">
          {data.mediosPago.map((medio) => (
            <li key={medio} className="flex items-start gap-2 text-sm leading-snug text-ink">
              <Check size={15} className="mt-0.5 shrink-0" strokeWidth={2.6} aria-hidden />
              {medio}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-col gap-2.5">
        <a
          href={data.inscripcionUrl}
          className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-semibold text-paper no-underline"
        >
          Inscribirme ahora <ArrowRight size={17} aria-hidden />
        </a>
        {data.whatsappUrl ? (
          <a
            href={data.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-line-strong bg-paper px-6 text-base font-semibold text-ink no-underline"
          >
            <MessageCircle size={17} aria-hidden /> Hablar por WhatsApp
          </a>
        ) : null}
      </div>

      <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-mute">
        Abajo está el documento completo con el temario módulo a módulo. Puedes ampliarlo con los dedos o
        descargarlo en PDF desde la barra superior.
      </p>
    </section>
  );
}
