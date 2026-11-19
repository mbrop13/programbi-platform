"use client";

import {
  CartesianGrid,
  LabelList,
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
import { pesos, pesosEje } from "@/lib/datos/formato";

interface CurvaIngresosProps {
  ing: (number | null)[];
  factorIpc?: number;
  etiquetaPesos?: string;
}

const ETIQUETAS_ANOS = ["1.er año", "2.º año", "3.er año", "4.º año", "5.º año"] as const;

const CHART_CONFIG: ChartConfig = {
  ingreso: {
    label: "Ingreso bruto promedio",
    color: "#1890ff",
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

  const conDatos = puntos.filter((p) => p.valor !== null);
  const ultimoIdx = conDatos.length > 0 ? conDatos[conDatos.length - 1].idx : -1;

  if (conDatos.length === 0) {
    return (
      <div className="rounded-xl border border-[#e2e2dc] bg-white p-6">
        <h3 className="text-base font-bold text-[#171716]">
          Curva de ingresos 1.er a 5.º año
        </h3>
        <p className="mt-3 text-sm text-[#5c5c58]">
          No hay suficientes casos publicados para graficar la curva de ingresos por año de egreso.
        </p>
        <p className="mt-2 text-xs text-[#5c5c58]">
          Cada año corresponde a cohortes distintas; no es el aumento de una misma persona.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#171716]">
            Ingreso bruto mensual promedio (1.er al 5.º año)
          </h3>
          <p className="text-xs text-[#5c5c58]">
            Expresado en {etiquetaPesos} · Titulados con ingresos ≥ sueldo mínimo
          </p>
        </div>
      </div>

      <ChartContainer config={CHART_CONFIG} className="h-[300px] w-full tabular-nums">
        <LineChart data={puntos} margin={{ top: 24, right: 68, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e2dc" vertical={false} />
          <XAxis
            dataKey="ano"
            tickLine={false}
            axisLine={{ stroke: "#e2e2dc" }}
            tick={{ fill: "#5c5c58", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={58}
            domain={[0, "auto"]}
            tickFormatter={(v: number) => pesosEje(v)}
            tick={{ fill: "#5c5c58", fontSize: 12 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(val) => pesos(val)}
                labelFormatter={(lbl) => `${String(lbl)} de titulación`}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="valor"
            name="ingreso"
            stroke="#1890ff"
            strokeWidth={2.5}
            connectNulls={false}
            dot={{ r: 4, fill: "#1890ff", stroke: "#ffffff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#1890ff", stroke: "#ffffff", strokeWidth: 2 }}
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
                    x={x + 8}
                    y={y + 4}
                    fill="#1890ff"
                    fontSize={12}
                    fontWeight={700}
                    className="tabular-nums"
                  >
                    {pesos(value)}
                  </text>
                );
              }}
            />
          </Line>
        </LineChart>
      </ChartContainer>

      <p className="mt-3 border-t border-[#f0f0ec] pt-2.5 text-xs text-[#5c5c58]">
        Cada año corresponde a cohortes distintas; no es el aumento de una misma persona.
      </p>
    </div>
  );
}
