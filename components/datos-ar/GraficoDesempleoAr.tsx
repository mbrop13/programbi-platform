"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { tasaAr } from "@/lib/datos-ar/formato";
import type { PuntoDesempleoAr } from "@/lib/datos-ar/types";

const CHART_CONFIG: ChartConfig = {
  tasaPct: {
    label: "Tasa de desocupación (%)",
    color: "#0e7a55",
  },
};

export function GraficoDesempleoAr({ serie }: { serie: readonly PuntoDesempleoAr[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground sm:text-lg">
          Evolución trimestral de la tasa de desocupación
        </h2>
        <p className="text-xs text-muted-foreground">
          Total 31 aglomerados urbanos · EPH continua INDEC (serie 45.2_ECTDT_0_T_33)
        </p>
      </div>

      <ChartContainer config={CHART_CONFIG} className="h-[280px] w-full">
        <LineChart data={[...serie]} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="trimestre"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            domain={["dataMin - 1", "dataMax + 1"]}
            tickFormatter={(v) => `${Number(v).toFixed(1).replace(".", ",")} %`}
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={52}
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
            dataKey="tasaPct"
            stroke="var(--color-tasaPct)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "var(--color-tasaPct)", stroke: "#ffffff", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
