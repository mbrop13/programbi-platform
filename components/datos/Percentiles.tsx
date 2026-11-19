"use client";

import type { CarreraTipoData } from "@/lib/datos/carreras";
import { pesos } from "@/lib/datos/formato";

interface PercentilesProps {
  pct: CarreraTipoData["pct"];
  factorIpc?: number;
  etiquetaPesos?: string;
}

interface CortePercentil {
  titulo: string;
  p10: number | null;
  p25: number | null;
  p50: number | null;
  p75: number | null;
  p90: number | null;
}

function BarraPercentil({
  corte,
  maxGlobal,
  factorIpc,
}: {
  corte: CortePercentil;
  maxGlobal: number;
  factorIpc: number;
}) {
  const esc = (v: number | null) => (v !== null ? Math.round(v * factorIpc) : null);
  const p10 = esc(corte.p10);
  const p25 = esc(corte.p25);
  const p50 = esc(corte.p50);
  const p75 = esc(corte.p75);
  const p90 = esc(corte.p90);

  if (p10 === null && p50 === null && p90 === null) {
    return (
      <div className="rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-4">
        <p className="text-sm font-semibold text-[#171716]">{corte.titulo}</p>
        <p className="mt-1 text-xs text-[#5c5c58]">
          Sin información suficiente de percentiles para este corte.
        </p>
      </div>
    );
  }

  const toPct = (v: number) => Math.max(0, Math.min(100, (v / maxGlobal) * 100));
  const leftOuter = p10 !== null ? toPct(p10) : p25 !== null ? toPct(p25) : 0;
  const rightOuter = p90 !== null ? toPct(p90) : p75 !== null ? toPct(p75) : 100;
  const leftIqr = p25 !== null ? toPct(p25) : leftOuter;
  const rightIqr = p75 !== null ? toPct(p75) : rightOuter;
  const medPos = p50 !== null ? toPct(p50) : null;

  return (
    <div className="rounded-lg border border-[#e2e2dc] bg-[#f7f7f4]/60 p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-[#171716]">{corte.titulo}</span>
        {p50 !== null ? (
          <span className="text-xs font-semibold text-[#1063b8] tabular-nums">
            Mediana (P50): {pesos(p50)}
          </span>
        ) : null}
      </div>

      <div className="relative h-7 w-full">
        {/* Eje base */}
        <div className="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full bg-[#e2e2dc]" />

        {/* Rango P10-P90 */}
        <div
          className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-[#1890ff]/25"
          style={{
            left: `${leftOuter}%`,
            width: `${Math.max(2, rightOuter - leftOuter)}%`,
          }}
        />

        {/* Rango intercuartil P25-P75 */}
        {p25 !== null && p75 !== null ? (
          <div
            className="absolute top-1/2 h-4 -translate-y-1/2 rounded-sm bg-[#1890ff]"
            style={{
              left: `${leftIqr}%`,
              width: `${Math.max(2, rightIqr - leftIqr)}%`,
            }}
          />
        ) : null}

        {/* Marcador P50 */}
        {medPos !== null ? (
          <div
            className="absolute top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#171716]"
            style={{ left: `${medPos}%` }}
            title={`Mediana P50: ${pesos(p50)}`}
          />
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
        <div>
          <span className="block text-[#5c5c58]">10 % menor (P10)</span>
          <span className="font-semibold text-[#171716] tabular-nums">{pesos(p10)}</span>
        </div>
        <div>
          <span className="block text-[#5c5c58]">P25</span>
          <span className="font-semibold text-[#171716] tabular-nums">{pesos(p25)}</span>
        </div>
        <div>
          <span className="block text-[#1063b8] font-medium">Mediana (P50)</span>
          <span className="font-bold text-[#171716] tabular-nums">{pesos(p50)}</span>
        </div>
        <div>
          <span className="block text-[#5c5c58]">P75</span>
          <span className="font-semibold text-[#171716] tabular-nums">{pesos(p75)}</span>
        </div>
        <div>
          <span className="block text-[#5c5c58]">10 % mayor (P90)</span>
          <span className="font-semibold text-[#171716] tabular-nums">{pesos(p90)}</span>
        </div>
      </div>
    </div>
  );
}

export function Percentiles({
  pct,
  factorIpc = 1,
  etiquetaPesos = "pesos de sep-2025",
}: PercentilesProps) {
  const cortes: CortePercentil[] = [
    {
      titulo: "1.er año de titulación",
      p10: pct.p10_1,
      p25: pct.p25_1,
      p50: pct.p50_1,
      p75: pct.p75_1,
      p90: pct.p90_1,
    },
    {
      titulo: "5.º año de titulación",
      p10: pct.p10_5,
      p25: pct.p25_5,
      p50: pct.p50_5,
      p75: pct.p75_5,
      p90: pct.p90_5,
    },
  ];

  const valores = [
    pct.p90_1,
    pct.p90_5,
    pct.p75_1,
    pct.p75_5,
    pct.p50_1,
    pct.p50_5,
  ]
    .filter((v): v is number => v !== null && v > 0)
    .map((v) => v * factorIpc);

  const maxGlobal = valores.length > 0 ? Math.max(...valores) * 1.08 : 1;

  return (
    <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#171716]">
          Dispersión salarial: percentiles P10 a P90
        </h3>
        <p className="text-xs text-[#5c5c58]">
          Rango entre el 10 % que menos gana (P10), el 50 % central (P25–P75) y el 10 % superior (P90) en {etiquetaPesos}.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {cortes.map((corte) => (
          <BarraPercentil
            key={corte.titulo}
            corte={corte}
            maxGlobal={maxGlobal}
            factorIpc={factorIpc}
          />
        ))}
      </div>
    </div>
  );
}
