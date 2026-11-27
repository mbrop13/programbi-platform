import { solesTexto } from "@/lib/datos-pe/formato";
import type { CarreraPe } from "@/lib/datos-pe/types";

/**
 * Rango de ingresos de la carrera: la mitad central de los egresados (p25–p75), su
 * mediana y, como referencia, la mediana de su nivel. Escala desde S/ 0.
 */
export function RangoIngresoPe({
  carrera,
  medianaNivel,
  nivel,
}: {
  carrera: CarreraPe;
  medianaNivel: number;
  nivel: string;
}) {
  const { p25, p75, mediana } = carrera.enaho;
  if (!mediana) return null;
  const tope = Math.max(p75 ?? mediana, medianaNivel, mediana) * 1.12;
  const pos = (v: number) => `${Math.min(100, (v / tope) * 100).toFixed(1)}%`;
  const diff = mediana - medianaNivel;
  const comparacion =
    Math.abs(diff) < 50
      ? `en línea con la mediana de las carreras ${nivel}s`
      : diff > 0
        ? `${solesTexto(diff)} más que la mediana de las carreras ${nivel}s`
        : `${solesTexto(Math.abs(diff))} menos que la mediana de las carreras ${nivel}s`;

  return (
    <figure className="rounded-3xl border border-line bg-paper p-5 sm:p-7">
      <figcaption>
        <span className="block text-xl font-bold tracking-tight text-ink">¿Cuánto ganan sus egresados?</span>
        <span className="mt-1.5 block text-sm leading-relaxed text-mute">
          La mitad de los egresados gana entre {p25 ? solesTexto(p25) : "s/i"} y {p75 ? solesTexto(p75) : "s/i"} al mes.
          La mediana, {solesTexto(mediana)}, está {comparacion} ({solesTexto(medianaNivel)}).
        </span>
      </figcaption>

      <div className="relative mt-10 mb-12 h-4" aria-hidden="true">
        <div className="absolute inset-0 rounded-full bg-wash" />
        {p25 && p75 ? (
          <div
            className="absolute inset-y-0 rounded-full bg-[#0b63c5]/20"
            style={{ left: pos(p25), width: `calc(${pos(p75)} - ${pos(p25)})` }}
          />
        ) : null}
        {/* Mediana de la carrera */}
        <div className="absolute -top-8 -translate-x-1/2 text-center" style={{ left: pos(mediana) }}>
          <span className="block text-sm font-bold whitespace-nowrap text-ink tabular-nums">{solesTexto(mediana)}</span>
        </div>
        <div
          className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#0b63c5] shadow-sm"
          style={{ left: pos(mediana) }}
        />
        {/* Mediana del nivel */}
        <div className="absolute -inset-y-1.5 w-0.5 -translate-x-1/2 bg-ink/60" style={{ left: pos(medianaNivel) }} />
        <div className="absolute top-7 -translate-x-1/2 text-center" style={{ left: pos(medianaNivel) }}>
          <span className="block text-xs whitespace-nowrap text-mute">Mediana {nivel}s</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-mute">
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#0b63c5]" aria-hidden="true" />
          Mediana de la carrera
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-5 rounded-sm bg-[#0b63c5]/20" aria-hidden="true" />
          Mitad central (p25–p75)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-0.5 bg-ink/60" aria-hidden="true" />
          Mediana de las carreras {nivel}s
        </span>
      </div>
    </figure>
  );
}
