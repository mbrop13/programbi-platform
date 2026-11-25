"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { periodoMesAr, tasaAr } from "@/lib/datos-ar/formato";
import type { PuntoIpcAr } from "@/lib/datos-ar/types";
import { cn } from "@/lib/utils";

const CHART_CONFIG: ChartConfig = {
  variacionMensual: {
    label: "Variación mensual (%)",
    color: "#ea580c",
  },
  variacionInteranual: {
    label: "Variación interanual (%)",
    color: "#2563eb",
  },
};

export function GraficoInflacionAr({ serie }: { serie: readonly PuntoIpcAr[] }) {
  const [vista, setVista] = useState<"mensual" | "interanual">("mensual");
  const ultimos24 = serie.slice(-24).map((p) => ({
    mes: p.mes,
    mesCorto: periodoMesAr(p.mes, true),
    variacionMensual: p.variacionMensual,
    variacionInteranual: p.variacionInteranual,
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground sm:text-lg">
            Evolución del IPC (últimos 24 meses)
          </h2>
          <p className="text-xs text-muted-foreground">
            Nivel General Nacional · Fuente: INDEC (Base diciembre 2016 = 100)
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setVista("mensual")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              vista === "mensual"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Mensual (%)
          </button>
          <button
            type="button"
            onClick={() => setVista("interanual")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              vista === "interanual"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Interanual (%)
          </button>
        </div>
      </div>

      <ChartContainer config={CHART_CONFIG} className="h-[300px] w-full">
        {vista === "mensual" ? (
          <BarChart data={ultimos24} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="mesCorto"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              minTickGap={20}
            />
            <YAxis
              tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => tasaAr(value)}
                  labelFormatter={(label) => String(label)}
                />
              }
            />
            <Bar
              dataKey="variacionMensual"
              fill="var(--color-variacionMensual)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        ) : (
          <LineChart data={ultimos24} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="mesCorto"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              minTickGap={20}
            />
            <YAxis
              tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={46}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => tasaAr(value)}
                  labelFormatter={(label) => String(label)}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="variacionInteranual"
              stroke="var(--color-variacionInteranual)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--color-variacionInteranual)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        )}
      </ChartContainer>
    </div>
  );
}
