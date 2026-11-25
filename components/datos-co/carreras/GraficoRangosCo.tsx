"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
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
import { enteroCo, porcentajeCo } from "@/lib/datos-co/formato";
import type { RangosSmmlvCo } from "@/lib/datos-co/types";

export interface GraficoRangosCoProps {
  rangos: RangosSmmlvCo;
  totalCotizantes: number;
  nombrePrograma: string;
  smmlvCop: number;
}

const CHART_CONFIG: ChartConfig = {
  graduados: {
    label: "Cotizantes",
    color: "#2563eb",
  },
};

export function GraficoRangosCo({
  rangos,
  totalCotizantes,
  nombrePrograma,
  smmlvCop,
}: GraficoRangosCoProps) {
  const data = useMemo(() => {
    const base = totalCotizantes > 0 ? totalCotizantes : 1;
    const tramos = [
      { tramo: "≤ 1 SMMLV", detalle: "Hasta 1 SMMLV", valor: rangos.n_1_sm, alto: false },
      { tramo: "1–1,5", detalle: "Entre 1 y 1,5 SMMLV", valor: rangos.n_1_y_1_5_sm, alto: false },
      { tramo: "1,5–2,5", detalle: "Entre 1,5 y 2,5 SMMLV", valor: rangos.n_1_5_y_2_5_sm, alto: false },
      { tramo: "2,5–4", detalle: "Entre 2,5 y 4 SMMLV", valor: rangos.n_2_5_y_4_sm, alto: false },
      { tramo: "4–6", detalle: "Entre 4 y 6 SMMLV", valor: rangos.n_4_y_6_sm, alto: true },
      { tramo: "6–9", detalle: "Entre 6 y 9 SMMLV", valor: rangos.n_6_y_9_sm, alto: true },
      { tramo: "> 9 SMMLV", detalle: "Más de 9 SMMLV", valor: rangos.n_mas_de_9_sm, alto: true },
    ];
    return tramos.map((t) => ({
      ...t,
      pct: Math.round((t.valor / base) * 1000) / 10,
    }));
  }, [rangos, totalCotizantes]);

  return (
    <Card className="gap-3 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
      <CardHeader className="px-6 pb-0">
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
          Distribución por rango de ingreso (7 tramos SMMLV)
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Graduados cotizantes en seguridad social de {nombrePrograma} según tramo salarial del OLE.
          En verde se destacan los tramos de 4 SMMLV o más (${enteroCo(smmlvCop * 4)} COP 2026 o superior).
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-2 sm:px-6">
        <ChartContainer config={CHART_CONFIG} className="h-64 w-full sm:h-72">
          <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/70" />
            <XAxis
              dataKey="tramo"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v) => enteroCo(Number(v))}
              className="text-xs fill-muted-foreground"
            />
            <ChartTooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => {
                    const item = data.find((d) => d.tramo === String(label));
                    return item ? `${item.detalle} (${porcentajeCo(item.pct)})` : String(label);
                  }}
                  formatter={(val) => `${enteroCo(val)} cotizantes`}
                />
              }
            />
            <Bar dataKey="graduados" name="graduados" radius={[6, 6, 0, 0]} maxBarSize={52}>
              {data.map((entry) => (
                <Cell
                  key={entry.tramo}
                  fill={entry.alto ? "#0e7a55" : "#2563eb"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/70 pt-3 text-xs sm:grid-cols-4 lg:grid-cols-7">
          {data.map((d) => (
            <div key={d.tramo} className="rounded-lg bg-muted/40 px-2.5 py-2">
              <p className="font-medium text-foreground">{d.tramo}</p>
              <p className="mt-0.5 font-semibold tabular-nums text-foreground">
                {enteroCo(d.valor)}
              </p>
              <p className="text-[11px] tabular-nums text-muted-foreground">
                {porcentajeCo(d.pct)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
