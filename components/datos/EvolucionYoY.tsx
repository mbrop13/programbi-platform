"use client";

import {
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
import type { CarreraTipoData } from "@/lib/datos/carreras";
import { pesos, pesosEje, variacionPorcentual } from "@/lib/datos/formato";

interface EvolucionYoYProps {
  evolIng4: Record<string, number | null>;
  evolEmp1: Record<string, number | null>;
  evolEmp2: Record<string, number | null>;
  variacion: CarreraTipoData["variacion"];
  factorIpc?: number;
  etiquetaPesos?: string;
}

const ANOS_SERIE = ["2020", "2021", "2022", "2023", "2024"] as const;

const ING_CONFIG: ChartConfig = {
  ing4: { label: "Ingreso real 4.º año", color: "#1890ff" },
};

const EMP_CONFIG: ChartConfig = {
  emp1: { label: "Empleabilidad 1.er año", color: "#1890ff" },
  emp2: { label: "Empleabilidad 2.º año", color: "#f99c00" },
};

export function EvolucionYoY({
  evolIng4,
  evolEmp1,
  evolEmp2,
  variacion,
  factorIpc = 1,
  etiquetaPesos = "pesos de sep-2025",
}: EvolucionYoYProps) {
  const dataIng = ANOS_SERIE.map((ano) => {
    const raw = evolIng4[ano] ?? null;
    return {
      ano,
      ing4: raw !== null ? Math.round(raw * factorIpc) : null,
    };
  });

  const dataEmp = ANOS_SERIE.map((ano) => {
    const e1 = evolEmp1[ano] ?? null;
    const e2 = evolEmp2[ano] ?? null;
    return {
      ano,
      emp1: e1 !== null ? Math.round(e1 * 1000) / 10 : null,
      emp2: e2 !== null ? Math.round(e2 * 1000) / 10 : null,
    };
  });

  const tieneIng = dataIng.some((d) => d.ing4 !== null);
  const tieneEmp = dataEmp.some((d) => d.emp1 !== null || d.emp2 !== null);

  return (
    <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#171716]">
            Evolución histórica 2020–2024 (términos reales)
          </h3>
          <p className="text-xs text-[#5c5c58]">
            Serie histórica del SIES en {etiquetaPesos}. Los vacíos muestran años sin mínimo de casos.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs tabular-nums">
          {variacion.yoy_23_24 !== null ? (
            <span className="rounded-md border border-[#e2e2dc] bg-[#f7f7f4] px-2.5 py-1 font-medium text-[#171716]">
              2023→2024: {variacionPorcentual(variacion.yoy_23_24)}
            </span>
          ) : null}
          {variacion.crec_20_24 !== null ? (
            <span className="rounded-md border border-[#e2e2dc] bg-[#f7f7f4] px-2.5 py-1 font-medium text-[#171716]">
              2020→2024: {variacionPorcentual(variacion.crec_20_24)}
            </span>
          ) : null}
          {variacion.edicion_anterior_yoy_real !== null ? (
            <span className="rounded-md border border-[#e2e2dc] bg-[#f7f7f4] px-2.5 py-1 font-medium text-[#171716]">
              vs ed. 2024–2025 (IPC): {variacionPorcentual(variacion.edicion_anterior_yoy_real)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold text-[#5c5c58] uppercase tracking-wide">
            Ingreso real al 4.º año
          </p>
          {tieneIng ? (
            <ChartContainer config={ING_CONFIG} className="h-[240px] w-full tabular-nums">
              <LineChart data={dataIng} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
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
                  width={56}
                  domain={[0, "auto"]}
                  tickFormatter={(v: number) => pesosEje(v)}
                  tick={{ fill: "#5c5c58", fontSize: 12 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(val) => pesos(val)}
                      labelFormatter={(lbl) => `Año de cálculo ${String(lbl)}`}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="ing4"
                  stroke="#1890ff"
                  strokeWidth={2.5}
                  connectNulls={false}
                  dot={{ r: 3.5, fill: "#1890ff", stroke: "#ffffff", strokeWidth: 1.5 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-[#e2e2dc] text-xs text-[#5c5c58]">
              Sin serie histórica de ingresos disponible.
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-[#5c5c58] uppercase tracking-wide">
            Empleabilidad 1.er y 2.º año (%)
          </p>
          {tieneEmp ? (
            <ChartContainer config={EMP_CONFIG} className="h-[240px] w-full tabular-nums">
              <LineChart data={dataEmp} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
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
                  width={44}
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                  tick={{ fill: "#5c5c58", fontSize: 12 }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(val) => `${val.toFixed(1).replace(".", ",")} %`}
                      labelFormatter={(lbl) => `Año de cálculo ${String(lbl)}`}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="emp1"
                  stroke="#1890ff"
                  strokeWidth={2.5}
                  connectNulls={false}
                  dot={{ r: 3.5, fill: "#1890ff", stroke: "#ffffff", strokeWidth: 1.5 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="emp2"
                  stroke="#f99c00"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  connectNulls={false}
                  dot={{ r: 3, fill: "#f99c00", stroke: "#ffffff", strokeWidth: 1.5 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-[#e2e2dc] text-xs text-[#5c5c58]">
              Sin serie histórica de empleabilidad disponible.
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 border-t border-[#f0f0ec] pt-2.5 text-xs text-[#5c5c58]">
        Nota metodológica: cada año compara cohortes distintas de titulados y la comparación frente a la edición 2024–2025 ajustada por IPC puede reflejar rectificaciones de series del SIES.
      </p>
    </div>
  );
}
