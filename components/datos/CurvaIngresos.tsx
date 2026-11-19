"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
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
import { pesos, pesosEje, variacionPorcentual } from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

interface CurvaIngresosProps {
  ing: (number | null)[];
  factorIpc?: number;
  etiquetaPesos?: string;
}

const ETIQUETAS_ANOS = ["1.er año", "2.º año", "3.er año", "4.º año", "5.º año"] as const;

const CHART_CONFIG: ChartConfig = {
  ingreso: {
    label: "Sueldo bruto promedio",
    color: "#2563eb",
  },
};

export function CurvaIngresos({
  ing,
  factorIpc = 1,
  etiquetaPesos = "pesos de sep-2025",
}: CurvaIngresosProps) {
  const puntos = ETIQUETAS_ANOS.map((ano, idx) => {
    const raw = ing[idx] ?? null;
    const valor = raw !== null ? Math.round(raw * factorIpc) : null;
    return { ano, valor, idx };
  });

  const conDatos = puntos.filter(
    (p): p is { ano: (typeof ETIQUETAS_ANOS)[number]; valor: number; idx: number } =>
      p.valor !== null
  );
  const primerDato = conDatos.length > 0 ? conDatos[0] : null;
  const ultimoDato = conDatos.length > 0 ? conDatos[conDatos.length - 1] : null;
  const ultimoIdx = ultimoDato ? ultimoDato.idx : -1;

  const crecimientoRatio =
    primerDato &&
    ultimoDato &&
    primerDato.idx !== ultimoDato.idx &&
    primerDato.valor > 0
      ? (ultimoDato.valor - primerDato.valor) / primerDato.valor
      : null;

  const etiquetaCrecimiento =
    primerDato && ultimoDato
      ? primerDato.idx === 0 && ultimoDato.idx === 4
        ? "del 1.º al 5.º año"
        : `de ${primerDato.ano} a ${ultimoDato.ano}`
      : "";

  if (conDatos.length === 0) {
    return (
      <Card className="gap-2 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
        <CardHeader className="px-6">
          <CardTitle className="text-base font-semibold text-foreground">
            Evolución del sueldo (1.er a 5.º año)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-6 text-sm text-muted-foreground">
          <p>
            No hay suficientes casos publicados para graficar la curva de ingresos por año de
            egreso.
          </p>
          <p className="text-xs">
            Cada año corresponde a cohortes distintas; no es el aumento de una misma persona.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-4 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
      <CardHeader className="px-6">
        <CardTitle className="text-base font-semibold text-foreground">
          Sueldo bruto mensual del 1.er al 5.º año
        </CardTitle>
        <CardDescription className="text-xs">
          Expresado en {etiquetaPesos} · Titulados con empleo formal
        </CardDescription>
        {crecimientoRatio !== null ? (
          <CardAction>
            <Badge
              variant="secondary"
              className={cn(
                "h-auto gap-1 rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums",
                crecimientoRatio >= 0
                  ? "border-emerald-200/80 bg-emerald-50 text-emerald-800"
                  : "border-rose-200/80 bg-rose-50 text-rose-800"
              )}
            >
              <TrendingUp className="size-3.5" aria-hidden="true" />
              {variacionPorcentual(crecimientoRatio)} {etiquetaCrecimiento}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>

      <CardContent className="px-6">
        {primerDato && ultimoDato && primerDato.idx !== ultimoDato.idx ? (
          <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border/70 bg-slate-50/70 px-3.5 py-2 text-xs tabular-nums">
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">{primerDato.ano}:</span>
              <span className="font-semibold text-foreground">{pesos(primerDato.valor)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground">{ultimoDato.ano}:</span>
              <span className="font-semibold text-blue-700">{pesos(ultimoDato.valor)}</span>
            </div>
          </div>
        ) : null}

        <ChartContainer config={CHART_CONFIG} className="h-[270px] w-full tabular-nums">
          <AreaChart data={puntos} margin={{ top: 32, right: 20, left: 6, bottom: 8 }}>
            <defs>
              <linearGradient id="curvaIngGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="ano"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={58}
              domain={[0, "auto"]}
              tickFormatter={(v: number) => pesosEje(v)}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(val) => pesos(val)}
                  labelFormatter={(lbl) => `${String(lbl)} desde la titulación`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="valor"
              name="ingreso"
              stroke="#2563eb"
              strokeWidth={2.25}
              fill="url(#curvaIngGrad)"
              connectNulls={false}
              dot={{ r: 4, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#1d4ed8", stroke: "#ffffff", strokeWidth: 2 }}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="valor"
                content={(props) => {
                  const { x, y, value, index } = props;
                  if (
                    index !== ultimoIdx ||
                    typeof value !== "number" ||
                    typeof x !== "number" ||
                    typeof y !== "number"
                  ) {
                    return null;
                  }
                  return (
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="end"
                      fill="#1d4ed8"
                      fontSize={12}
                      fontWeight={600}
                      className="tabular-nums"
                    >
                      {pesos(value)}
                    </text>
                  );
                }}
              />
            </Area>
          </AreaChart>
        </ChartContainer>

        <p className="mt-3 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          Cada punto refleja una generación distinta de egresados; sirve como referencia de
          progresión salarial, no como aumento garantizado.
        </p>
      </CardContent>
    </Card>
  );
}
