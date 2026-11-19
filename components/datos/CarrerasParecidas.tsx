import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowLeft, ArrowRight, GitCompare, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TIPO_ETIQUETAS, type RankingItem, type TipoIesKey } from "@/lib/datos/carreras-tipos";
import { pesos, porcentaje } from "@/lib/datos/formato";
import type { CarreraParecida } from "@/lib/datos/parecidas";

interface CarrerasParecidasProps {
  slugActual: string;
  nombreActual: string;
  tipoActual: TipoIesKey;
  similares: CarreraParecida[];
  menosAnos: CarreraParecida[];
  anteriorEnRanking: RankingItem | null;
  siguienteEnRanking: RankingItem | null;
}

export function CarrerasParecidas({
  slugActual,
  nombreActual,
  tipoActual,
  similares,
  menosAnos,
  anteriorEnRanking,
  siguienteEnRanking,
}: CarrerasParecidasProps) {
  const compararCon = similares.slice(0, 3);

  return (
    <section aria-labelledby="parecidas-titulo" className="space-y-6">
      <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 id="parecidas-titulo" className="h2-datos text-[#171716]">
              Carreras parecidas por ingreso y área
            </h2>
            <p className="mt-1 text-xs text-[#5c5c58]">
              Alternativas de {TIPO_ETIQUETAS[tipoActual].plural.toLowerCase()} con sueldos cercanos al 4.º año.
            </p>
          </div>
        </div>

        {similares.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {similares.map((c) => (
              <Link
                key={`${c.slug}-${c.tipo}`}
                href={`/datos/carreras/${c.slug}`}
                className="group flex flex-col justify-between rounded-lg border border-[#e2e2dc] bg-[#f7f7f4]/60 p-4 transition-colors hover:border-[#1890ff] hover:bg-white"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#171716] group-hover:text-[#1063b8]">
                      {c.nombre}
                    </h3>
                    <span className="shrink-0 rounded bg-[#e9f4ff] px-1.5 py-0.5 text-[10px] font-bold text-[#1063b8]">
                      {TIPO_ETIQUETAS[c.tipo].corto}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#5c5c58]">{c.area}</p>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline justify-between text-xs tabular-nums">
                    <span className="font-bold text-[#171716]">{pesos(c.ing4)}</span>
                    <span className="text-[#5c5c58]">Emp. {porcentaje(c.emp1)}</span>
                  </div>
                  {c.diferencias.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.diferencias.map((diff) => (
                        <Badge
                          key={diff}
                          variant="secondary"
                          className="border border-[#e2e2dc] bg-white text-[11px] font-medium text-[#5c5c58]"
                        >
                          {diff}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#5c5c58]">
            No hay suficientes carreras comparables en este segmento.
          </p>
        )}

        {/* Comparar con... */}
        {compararCon.length > 0 ? (
          <div className="mt-5 border-t border-[#f0f0ec] pt-4">
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-[#5c5c58] uppercase tracking-wide">
              <GitCompare className="size-3.5 text-[#1890ff]" aria-hidden="true" />
              Comparar {nombreActual} frente a frente
            </p>
            <div className="flex flex-wrap gap-2">
              {compararCon.map((c) => (
                <Link
                  key={`cmp-${c.slug}`}
                  href={`/datos/carreras/comparar?c=${encodeURIComponent(`${slugActual},${c.slug}`)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6e6f5] bg-[#e9f4ff]/70 px-3 py-1.5 text-xs font-semibold text-[#1063b8] transition-colors hover:bg-[#1063b8] hover:text-white"
                >
                  Comparar con {c.nombre}
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Mismo sueldo, menos años */}
      {menosAnos.length > 0 ? (
        <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 sm:p-6">
          <h3 className="text-base font-bold text-[#171716]">
            Mismo sueldo, menos años reales
          </h3>
          <p className="mt-0.5 text-xs text-[#5c5c58]">
            Carreras con ingreso al 4.º año dentro de ±10 % y menor duración real promedio.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {menosAnos.map((c) => (
              <Link
                key={`ma-${c.slug}-${c.tipo}`}
                href={`/datos/carreras/${c.slug}`}
                className="rounded-lg border border-[#e2e2dc] bg-[#f7f7f4]/60 p-3.5 transition-colors hover:border-[#1890ff] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-bold text-[#171716] leading-snug">
                    {c.nombre}
                  </span>
                  <span className="rounded bg-[#fff3db] px-1.5 py-0.5 text-[10px] font-bold text-[#8a5700]">
                    {TIPO_ETIQUETAS[c.tipo].corto}
                  </span>
                </div>
                <div className="mt-2 text-xs font-semibold text-[#1063b8] tabular-nums">
                  {pesos(c.ing4)}
                </div>
                {c.diferencias.length > 0 ? (
                  <div className="mt-1 text-[11px] text-[#5c5c58]">
                    {c.diferencias.join(" · ")}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Anterior / Siguiente en el ranking + Cursos ProgramBI */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl border border-[#e2e2dc] bg-white p-5">
          <span className="text-xs font-semibold text-[#5c5c58] uppercase tracking-wide">
            Navegación en el ranking ({TIPO_ETIQUETAS[tipoActual].corto})
          </span>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {anteriorEnRanking ? (
              <Link
                href={`/datos/carreras/${anteriorEnRanking.slug}`}
                className="flex items-center gap-2 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3 text-xs hover:border-[#1890ff]"
              >
                <ArrowLeft className="size-4 shrink-0 text-[#5c5c58]" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="block text-[10px] text-[#5c5c58]">Puesto superior</span>
                  <span className="block truncate font-semibold text-[#171716]">
                    {anteriorEnRanking.nombre}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed border-[#e2e2dc] p-3 text-xs text-[#5c5c58]">
                Primer lugar del ranking
              </div>
            )}

            {siguienteEnRanking ? (
              <Link
                href={`/datos/carreras/${siguienteEnRanking.slug}`}
                className="flex items-center justify-end gap-2 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3 text-right text-xs hover:border-[#1890ff]"
              >
                <div className="min-w-0">
                  <span className="block text-[10px] text-[#5c5c58]">Puesto siguiente</span>
                  <span className="block truncate font-semibold text-[#171716]">
                    {siguienteEnRanking.nombre}
                  </span>
                </div>
                <ArrowRight className="size-4 shrink-0 text-[#5c5c58]" aria-hidden="true" />
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed border-[#e2e2dc] p-3 text-right text-xs text-[#5c5c58]">
                Último lugar evaluado
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[#d6e6f5] bg-white p-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1063b8] uppercase tracking-wide">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Habilidades complementarias en ProgramBI
            </span>
            <p className="mt-1.5 text-xs text-[#5c5c58]">
              Herramientas prácticas de análisis de datos aplicables en cualquier área profesional.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/cursos/excel"
              className="rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] px-3 py-1.5 text-xs font-semibold text-[#171716] hover:border-[#1063b8] hover:text-[#1063b8]"
            >
              Curso de Excel →
            </Link>
            <Link
              href="/cursos/power-bi"
              className="rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] px-3 py-1.5 text-xs font-semibold text-[#171716] hover:border-[#1063b8] hover:text-[#1063b8]"
            >
              Curso de Power BI →
            </Link>
            <Link
              href="/cursos/analisis-de-datos"
              className="rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] px-3 py-1.5 text-xs font-semibold text-[#171716] hover:border-[#1063b8] hover:text-[#1063b8]"
            >
              Análisis de Datos →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
