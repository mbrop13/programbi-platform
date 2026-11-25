"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { tasaCo } from "@/lib/datos-co/formato";
import type { DesempleoCiudadCo, DesempleoNacionalPuntoCo } from "@/lib/datos-co/types";
import { cn } from "@/lib/utils";

type RangoSerie = "5y" | "10y" | "all";

const CONFIG_NACIONAL: ChartConfig = {
  tasa_desocupacion_pct: {
    label: "Tasa de desocupación nacional",
    color: "#0e7a55",
  },
};

const CONFIG_CIUDADES: ChartConfig = {
  tasa_desocupacion_pct: {
    label: "Tasa de desocupación",
    color: "#2563eb",
  },
};

export interface GraficoDesempleoCoProps {
  serieNacional: DesempleoNacionalPuntoCo[];
  ciudades: DesempleoCiudadCo[];
  tasaAgregado23: number;
  periodoCiudades: string;
}

export function GraficoDesempleoCo({
  serieNacional,
  ciudades,
  tasaAgregado23,
  periodoCiudades,
}: GraficoDesempleoCoProps) {
  const [rango, setRango] = useState<RangoSerie>("10y");
  const [orden, setOrden] = useState<"menor" | "mayor">("menor");

  const puntosFiltrados = useMemo(() => {
    if (rango === "all") return serieNacional;
    const meses = rango === "5y" ? 60 : 120;
    return serieNacional.slice(-meses);
  }, [serieNacional, rango]);

  const ciudadesOrdenadas = useMemo(() => {
    const copia = ciudades.slice();
    copia.sort((a, b) =>
      orden === "menor"
        ? a.tasa_desocupacion_pct - b.tasa_desocupacion_pct
        : b.tasa_desocupacion_pct - a.tasa_desocupacion_pct
    );
    return copia;
  }, [ciudades, orden]);

  const ultimo = serieNacional.at(-1);

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
        <CardHeader className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Serie nacional mensual de desempleo (2001–2026)
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              Tasa de desocupación total nacional (DANE GEIH). Último dato:{" "}
              {ultimo ? `${tasaCo(ultimo.tasa_desocupacion_pct)} (${ultimo.periodo})` : "s/d"}.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Rango de años">
            {(
              [
                { id: "5y", label: "5 años" },
                { id: "10y", label: "10 años" },
                { id: "all", label: "2001–2026" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRango(opt.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  rango === opt.id
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer config={CONFIG_NACIONAL} className="h-[300px] w-full tabular-nums">
            <AreaChart data={puntosFiltrados} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="fillDesempleoCo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0e7a55" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#0e7a55" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="periodo"
                tickLine={false}
                axisLine={false}
                minTickGap={36}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, "auto"]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Período ${label}`}
                    formatter={(val) => tasaCo(val)}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="tasa_desocupacion_pct"
                stroke="#0e7a55"
                strokeWidth={2.2}
                fill="url(#fillDesempleoCo)"
                dot={false}
                activeDot={{ r: 4.5, fill: "#0e7a55" }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
        <CardHeader className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Desempleo por ciudad ({periodoCiudades})
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              23 ciudades y áreas metropolitanas (trimestre móvil). La línea punteada marca el agregado de 23 ciudades ({tasaCo(tasaAgregado23)}).
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Orden de ciudades">
            <button
              type="button"
              onClick={() => setOrden("menor")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                orden === "menor"
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Menor a mayor
            </button>
            <button
              type="button"
              onClick={() => setOrden("mayor")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                orden === "mayor"
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Mayor a menor
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer config={CONFIG_CIUDADES} className="h-[620px] w-full tabular-nums">
            <BarChart
              data={ciudadesOrdenadas}
              layout="vertical"
              margin={{ top: 4, right: 28, left: 12, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                domain={[0, 26]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="ciudad"
                width={136}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#0f172a", fontSize: 12 }}
              />
              <ReferenceLine
                x={tasaAgregado23}
                stroke="#0f172a"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(val) => tasaCo(val)}
                  />
                }
              />
              <Bar
                dataKey="tasa_desocupacion_pct"
                fill="#2563eb"
                radius={[0, 6, 6, 0]}
                barSize={16}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
