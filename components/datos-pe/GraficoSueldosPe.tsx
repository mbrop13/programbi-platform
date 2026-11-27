import Link from "next/link";
import { solesTexto } from "@/lib/datos-pe/formato";
import type { CarreraPe } from "@/lib/datos-pe/types";

export interface GraficoSueldosPeProps {
  carreras: readonly CarreraPe[];
  titulo: string;
  descripcion?: string;
  maxItems?: number;
  className?: string;
}

/**
 * Barras horizontales de sueldo mediano con el rango p25–p75 detrás.
 * Antes usaba recharts dentro de un contenedor sin alto y no se dibujaba nada;
 * ahora es HTML y CSS: aparece completo desde el servidor y se lee igual en móvil.
 */
export function GraficoSueldosPe({
  carreras,
  titulo,
  descripcion,
  maxItems = 15,
  className,
}: GraficoSueldosPeProps) {
  const data = [...carreras]
    .filter((c) => c.enaho.mediana > 0)
    .sort((a, b) => b.enaho.mediana - a.enaho.mediana)
    .slice(0, maxItems);

  if (data.length === 0) return null;

  // Escala desde cero hasta el p75 más alto, para que el rango quepa completo.
  const max = Math.max(...data.map((c) => c.enaho.p75 ?? c.enaho.mediana), 1);
  const pct = (v: number) => `${Math.min(100, (v / max) * 100).toFixed(1)}%`;

  return (
    <figure className={`rounded-3xl border border-line bg-paper p-5 sm:p-7 ${className ?? ""}`}>
      <figcaption className="max-w-[62ch]">
        <span className="block text-xl font-bold tracking-tight text-ink">{titulo}</span>
        {descripcion ? (
          <span className="mt-1.5 block text-sm leading-relaxed text-mute">{descripcion}</span>
        ) : null}
      </figcaption>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-mute">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-4 rounded-sm bg-[#0b63c5]" aria-hidden="true" />
          Sueldo mediano
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-4 rounded-sm bg-[#0b63c5]/15" aria-hidden="true" />
          Mitad central de los egresados (p25–p75)
        </span>
      </div>

      <ol className="mt-5 space-y-3.5">
        {data.map((c, i) => (
          <li
            key={c.slug}
            className="relative grid gap-1.5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_6rem] sm:items-center sm:gap-4"
          >
            <Link
              href={`/pe/datos/carreras/${c.slug}`}
              prefetch={false}
              className="min-w-0 text-sm leading-snug font-semibold text-ink underline-offset-4 hover:underline"
            >
              <span className="mr-1.5 text-mute tabular-nums">{i + 1}.</span>
              {c.nombre}
              <span className="font-normal text-mute">
                {" "}
                · {c.tipo === "universitaria" ? "Universitaria" : "Técnica"}
              </span>
            </Link>
            <div className="flex items-center gap-3 sm:contents">
              <div className="relative h-3 min-w-0 flex-1 rounded-full bg-wash" aria-hidden="true">
                {c.enaho.p25 && c.enaho.p75 ? (
                  <span
                    className="absolute inset-y-0 rounded-full bg-[#0b63c5]/15"
                    style={{
                      left: pct(c.enaho.p25),
                      width: `calc(${pct(c.enaho.p75)} - ${pct(c.enaho.p25)})`,
                    }}
                  />
                ) : null}
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-[#0b63c5]"
                  style={{ width: pct(c.enaho.mediana) }}
                />
              </div>
              <p className="shrink-0 text-right text-sm font-bold text-ink tabular-nums">
                {solesTexto(c.enaho.mediana)}
                {c.enaho.p25 && c.enaho.p75 ? (
                  <span className="sr-only">
                    {" "}
                    (p25 {solesTexto(c.enaho.p25)}, p75 {solesTexto(c.enaho.p75)})
                  </span>
                ) : null}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
