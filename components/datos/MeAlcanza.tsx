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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Slider } from "@/components/ui/slider";
import type { ProgramaCarrera } from "@/lib/datos/carreras";
import { entero, pesos } from "@/lib/datos/formato";

interface MeAlcanzaProps {
  programas: ProgramaCarrera[];
}

const CHART_CONFIG: ChartConfig = {
  alcanza: { label: "Tu puntaje ≥ promedio 2025", color: "#2563eb" },
  arriba: { label: "Sobre tu puntaje", color: "#94a3b8" },
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
    <div className="max-w-xs rounded-lg border border-border bg-popover p-3 text-xs shadow-lg shadow-slate-900/10">
      <p className="font-semibold leading-snug text-foreground">{p.institucion}</p>
      <p className="mt-0.5 text-muted-foreground">
        {p.sede} · {p.jornada}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-border/70 pt-2 tabular-nums">
        <span className="text-muted-foreground">Prom. PAES 2025:</span>
        <span className="text-right font-semibold text-blue-700">
          {p.x.toFixed(1).replace(".", ",")} pts
        </span>
        <span className="text-muted-foreground">Arancel 2026:</span>
        <span className="text-right font-semibold text-foreground">{pesos(p.arancel)}</span>
        <span className="text-muted-foreground">Vacantes:</span>
        <span className="text-right font-semibold text-foreground">{entero(p.vacantes)}</span>
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
      <Card className="gap-2 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
        <CardHeader className="px-6">
          <CardTitle className="text-base font-semibold text-foreground">
            ¿Me alcanza el puntaje? (PAES 2025)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 text-sm text-muted-foreground">
          Los programas de esta carrera no reportan promedio PAES de matriculados 2025 (por
          ejemplo, admisión directa sin PAES).
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-4 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
      <CardHeader className="flex flex-col gap-3 px-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            ¿Me alcanza el puntaje? (Referencia PAES)
          </CardTitle>
          <CardDescription className="mt-0.5 text-xs">
            Mueve el deslizador para comparar con los matriculados 2025.
          </CardDescription>
        </div>
        <Badge
          variant="secondary"
          className="h-auto rounded-md border border-blue-200/80 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 tabular-nums"
        >
          {cantidadAlcanza} de {conPaes.length} programas ≤ {puntaje} pts
        </Badge>
      </CardHeader>

      <CardContent className="px-6">
        <div className="mb-4 rounded-lg border border-border bg-muted/40 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <label htmlFor="slider-paes" className="text-xs font-medium text-foreground">
              Tu puntaje aproximado
            </label>
            <span className="text-base font-bold text-blue-700 tabular-nums">{puntaje} pts</span>
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
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground tabular-nums">
            <span>400</span>
            <span>700</span>
            <span>1.000</span>
          </div>
        </div>

        <ChartContainer config={CHART_CONFIG} className="h-[210px] w-full tabular-nums">
          <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical />
            <XAxis
              type="number"
              dataKey="x"
              name="PAES"
              domain={[400, 1000]}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis type="number" dataKey="y" hide domain={[0, 85]} />
            <ReferenceLine
              x={puntaje}
              stroke="#2563eb"
              strokeWidth={2}
              strokeDasharray="4 3"
            />
            <Tooltip content={<PaesTooltip />} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={puntos} isAnimationActive={false}>
              {puntos.map((entry) => (
                <Cell
                  key={entry.codigo}
                  fill={entry.alcanza ? "#2563eb" : "#94a3b8"}
                  fillOpacity={entry.alcanza ? 0.9 : 0.55}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ChartContainer>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-blue-600" />
              Promedio ≤ tu puntaje
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-slate-400" />
              Sobre tu puntaje
            </span>
          </div>
          <span>Promedio de matriculados 2025, no puntaje de corte.</span>
        </div>
      </CardContent>
    </Card>
  );
}
