"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { solesTexto } from "@/lib/datos-pe/formato";
import type { CarreraPe } from "@/lib/datos-pe/types";

export interface GraficoSueldosPeProps {
  carreras: readonly CarreraPe[];
  titulo: string;
  descripcion?: string;
  maxItems?: number;
  className?: string;
}

const CHART_CONFIG: ChartConfig = {
  mediana: {
    label: "Mediana mensual ENAHO (S/ 2024)",
    color: "#2563eb",
  },
};

export function GraficoSueldosPe({
  carreras,
  titulo,
  descripcion,
  maxItems = 15,
  className,
}: GraficoSueldosPeProps) {
  const data = [...carreras]
    .sort((a, b) => b.enaho.mediana - a.enaho.mediana)
    .slice(0, maxItems)
    .map((c) => ({
      nombre: c.nombre.length > 34 ? `${c.nombre.slice(0, 32)}…` : c.nombre,
      nombreCompleto: c.nombre,
      mediana: c.enaho.mediana,
      medianaLabel: solesTexto(c.enaho.mediana),
    }));

  const alturaPx = Math.max(320, data.length * 36 + 48);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
          {titulo}
        </CardTitle>
        {descripcion ? (
          <CardDescription className="text-sm text-muted-foreground">{descripcion}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG} className="w-full">
          <div style={{ height: alturaPx, width: "100%" }}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 72, left: 8, bottom: 8 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `S/ ${Math.round(v)}`}
              />
              <YAxis
                type="category"
                dataKey="nombre"
                width={190}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(val) => solesTexto(val)}
                    labelFormatter={(lbl) => String(lbl)}
                  />
                }
              />
              <Bar dataKey="mediana" fill="var(--color-mediana)" radius={[0, 6, 6, 0]}>
                <LabelList
                  dataKey="medianaLabel"
                  position="right"
                  className="fill-foreground text-xs font-medium"
                />
              </Bar>
            </BarChart>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
