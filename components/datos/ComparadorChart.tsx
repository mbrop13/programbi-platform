"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TIPO_ETIQUETAS, type TipoIesKey } from "@/lib/datos/carreras-tipos";
import { pesos, pesosEje } from "@/lib/datos/formato";

export interface ComparadorChartItem {
  slug: string;
  nombre: string;
  tipo: TipoIesKey;
  color: string;
}

export function ComparadorChart({
  chartConfig,
  chartData,
  items,
}: {
  chartConfig: ChartConfig;
  chartData: Record<string, string | number | null>[];
  items: ComparadorChartItem[];
}) {
  return (
    <ChartContainer config={chartConfig} className="h-[320px] w-full">
      <LineChart data={chartData} margin={{ top: 16, right: 88, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e2dc" vertical={false} />
        <XAxis
          dataKey="anio"
          tick={{ fill: "#5c5c58", fontSize: 12 }}
          axisLine={{ stroke: "#e2e2dc" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => pesosEje(Number(v))}
          tick={{ fill: "#5c5c58", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={62}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(value) => pesos(value)} />} />
        {items.map((item, idx) => (
          <Line
            key={`${item.slug}-${item.tipo}`}
            type="monotone"
            dataKey={`c${idx}`}
            name={`${item.nombre} (${TIPO_ETIQUETAS[item.tipo].corto})`}
            stroke={item.color}
            strokeWidth={3}
            connectNulls
            dot={{ r: 4, fill: item.color, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
            label={(props: {
              x?: number | string;
              y?: number | string;
              index?: number;
              value?: number | string | boolean | null;
            }) => {
              const numX = Number(props.x);
              const numY = Number(props.y);
              if (props.index !== 4 || !Number.isFinite(numX) || !Number.isFinite(numY) || !props.value) {
                return <g />;
              }
              return (
                <text
                  x={numX + 8}
                  y={numY + 4}
                  fill={item.color}
                  fontSize={11}
                  fontWeight={700}
                >
                  {pesosEje(Number(props.value))}
                </text>
              );
            }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
