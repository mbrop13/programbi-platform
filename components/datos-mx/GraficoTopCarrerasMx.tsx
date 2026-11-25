"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { pesosMx } from "@/lib/datos-mx/formato";

export interface TopCarreraChartItem {
  slug: string;
  carrera: string;
  ingreso: number;
  tasaDesocupacion: number | null;
}

const chartConfig: ChartConfig = {
  ingreso: {
    label: "Ingreso mensual promedio",
    color: "#18181b",
  },
};

function acortarEtiqueta(nombre: string, max = 28): string {
  if (nombre.length <= max) return nombre;
  return `${nombre.slice(0, max - 1).trimEnd()}…`;
}

export default function GraficoTopCarrerasMx({
  data,
}: {
  data: TopCarreraChartItem[];
}) {
  const chartData = data.map((item) => ({
    ...item,
    nombreCorto: acortarEtiqueta(item.carrera),
  }));

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground">
          Top 10 carreras mejor pagadas en México (ingreso mensual promedio)
        </h3>
        <p className="text-xs text-muted-foreground">
          Cifras en pesos mexicanos (MXN) mensuales según IMCO Compara Carreras
          2026 con base en la ENOE del INEGI.
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-[380px] w-full">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 20, left: 8, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis
            type="number"
            tickFormatter={(v: number) => pesosMx(v)}
            tick={{ fontSize: 11, fill: "#71717a" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="nombreCorto"
            width={185}
            tick={{ fontSize: 11, fill: "#18181b" }}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip
            cursor={{ fill: "rgba(24, 24, 27, 0.05)" }}
            content={
              <ChartTooltipContent
                labelFormatter={(_label) => {
                  const found = chartData.find((d) => d.nombreCorto === _label);
                  return found ? found.carrera : String(_label);
                }}
                formatter={(value) => pesosMx(value)}
              />
            }
          />
          <Bar
            dataKey="ingreso"
            fill="var(--color-ingreso)"
            radius={[0, 6, 6, 0]}
            barSize={24}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
