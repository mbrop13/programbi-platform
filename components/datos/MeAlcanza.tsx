"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  ReferenceLine,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Slider } from "@/components/ui/slider";
import type { ProgramaCarrera } from "@/lib/datos/carreras";
import { entero, pesos } from "@/lib/datos/formato";

interface MeAlcanzaProps {
  programas: ProgramaCarrera[];
}

const CHART_CONFIG: ChartConfig = {
  alcanza: { label: "Tu puntaje ≥ promedio 2025", color: "#1890ff" },
  arriba: { label: "Sobre tu puntaje", color: "#a3a3a0" },
};

interface PuntoPaes {
  x: number;
  y: number;
  codigo: string;
  institucion: string;
  sede: string;
  jornada: string;
  arancel: number | null;
  vacantes: number | null;
  alcanza: boolean;
}

function PaesTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: PuntoPaes }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  if (!p) return null;

  return (
    <div className="max-w-xs rounded-lg border border-[#e2e2dc] bg-white p-3 text-xs shadow-md">
      <p className="font-bold text-[#171716] leading-snug">{p.institucion}</p>
      <p className="mt-0.5 text-[#5c5c58]">
        {p.sede} · {p.jornada}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-[#f0f0ec] pt-2 tabular-nums">
        <span className="text-[#5c5c58]">Prom. PAES 2025:</span>
        <span className="font-bold text-[#1063b8] text-right">
          {p.x.toFixed(1).replace(".", ",")} pts
        </span>
        <span className="text-[#5c5c58]">Arancel 2026:</span>
        <span className="font-semibold text-[#171716] text-right">
          {pesos(p.arancel)}
        </span>
        <span className="text-[#5c5c58]">Vacantes:</span>
        <span className="font-semibold text-[#171716] text-right">
          {entero(p.vacantes)}
        </span>
      </div>
    </div>
  );
}

export function MeAlcanza({ programas }: MeAlcanzaProps) {
  const conPaes = useMemo(
    () =>
      programas
        .filter((p): p is ProgramaCarrera & { prom_paes: number } => p.prom_paes !== null)
        .sort((a, b) => a.prom_paes - b.prom_paes),
    [programas]
  );

  const medianaPaes = useMemo(() => {
    if (conPaes.length === 0) return 620;
    const mid = Math.floor(conPaes.length / 2);
    return Math.round(conPaes[mid].prom_paes);
  }, [conPaes]);

  const [puntaje, setPuntaje] = useState<number>(() =>
    Math.max(400, Math.min(1000, medianaPaes))
  );

  const puntos: PuntoPaes[] = useMemo(() => {
    return conPaes.map((p, idx) => ({
      x: p.prom_paes,
      y: ((idx % 7) + 1) * 10 + ((idx * 3) % 7),
      codigo: p.codigo,
      institucion: p.institucion,
      sede: p.sede,
      jornada: p.jornada,
      arancel: p.arancel,
      vacantes: p.vacantes,
      alcanza: p.prom_paes <= puntaje,
    }));
  }, [conPaes, puntaje]);

  const cantidadAlcanza = puntos.filter((p) => p.alcanza).length;

  if (conPaes.length === 0) {
    return (
      <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 sm:p-6">
        <h3 className="text-base font-bold text-[#171716]">
          ¿Me alcanza el puntaje? (PAES 2025)
        </h3>
        <p className="mt-2 text-sm text-[#5c5c58]">
          Los programas de esta carrera no reportan promedio PAES de matriculados 2025 en el Buscador de Carreras (por ejemplo, admisión directa sin PAES).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#171716]">
            ¿Me alcanza el puntaje? Referencia PAES 2025
          </h3>
          <p className="text-xs text-[#5c5c58]">
            Promedio de los matriculados 2025, no puntaje de corte.
          </p>
        </div>
        <div className="rounded-lg border border-[#d6e6f5] bg-[#e9f4ff] px-3 py-1.5 text-xs font-semibold text-[#1063b8] tabular-nums">
          {cantidadAlcanza} de {conPaes.length} programas ≤ {puntaje} pts
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <label
            htmlFor="slider-paes"
            className="text-xs font-semibold text-[#171716]"
          >
            Tu puntaje aproximado
          </label>
          <span className="text-lg font-extrabold text-[#1063b8] tabular-nums">
            {puntaje} pts
          </span>
        </div>
        <Slider
          id="slider-paes"
          min={400}
          max={1000}
          step={5}
          value={[puntaje]}
          onValueChange={(vals) => setPuntaje(vals[0] ?? 620)}
          aria-label="Tu puntaje aproximado"
        />
        <div className="mt-1 flex justify-between text-[11px] text-[#5c5c58] tabular-nums">
          <span>400</span>
          <span>700</span>
          <span>1.000</span>
        </div>
      </div>

      <ChartContainer config={CHART_CONFIG} className="h-[220px] w-full tabular-nums">
        <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e2dc" vertical />
          <XAxis
            type="number"
            dataKey="x"
            name="PAES"
            domain={[400, 1000]}
            tickLine={false}
            axisLine={{ stroke: "#e2e2dc" }}
            tick={{ fill: "#5c5c58", fontSize: 12 }}
          />
          <YAxis type="number" dataKey="y" hide domain={[0, 85]} />
          <ReferenceLine
            x={puntaje}
            stroke="#1890ff"
            strokeWidth={2}
            strokeDasharray="4 3"
          />
          <Tooltip content={<PaesTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={puntos} isAnimationActive={false}>
            {puntos.map((entry) => (
              <Cell
                key={entry.codigo}
                fill={entry.alcanza ? "#1890ff" : "#a3a3a0"}
                fillOpacity={entry.alcanza ? 0.9 : 0.55}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f0ec] pt-2.5 text-xs text-[#5c5c58]">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#1890ff]" />
            Promedio ≤ tu puntaje
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#a3a3a0]" />
            Sobre tu puntaje
          </span>
        </div>
        <span>Promedio de los matriculados 2025, no puntaje de corte.</span>
      </div>
    </div>
  );
}
