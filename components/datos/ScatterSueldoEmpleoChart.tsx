"use client";

import * as React from "react";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import {
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { TIPO_ETIQUETAS, type RankingItem } from "@/lib/datos/carreras-tipos";
import { pesos, pesosEje, porcentaje, semestres } from "@/lib/datos/formato";

export interface ScatterSueldoEmpleoProps {
  items: RankingItem[];
  factorIpc?: number;
  selectedSlug?: string | null;
  onSelectSlug?: (slug: string) => void;
}

interface ScatterPoint {
  slug: string;
  nombre: string;
  area: string;
  tipo: RankingItem["tipo"];
  empPct: number;
  ing4: number;
  durReal: number | null;
  titulados: number | null;
}

function medianValue(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export default function ScatterSueldoEmpleoChart({
  items,
  factorIpc = 1,
  selectedSlug,
  onSelectSlug,
}: ScatterSueldoEmpleoProps) {
  const [hovered, setHovered] = React.useState<ScatterPoint | null>(null);
  const [clickedSlug, setClickedSlug] = React.useState<string | null>(null);

  const points = React.useMemo<ScatterPoint[]>(() => {
    return items
      .filter((r) => r.ing4 !== null && r.emp1 !== null)
      .map((r) => ({
        slug: r.slug,
        nombre: r.nombre,
        area: r.area,
        tipo: r.tipo,
        empPct: Math.round((r.emp1 ?? 0) * 1000) / 10,
        ing4: Math.round((r.ing4 ?? 0) * factorIpc),
        durReal: r.dur_real,
        titulados: r.titulados,
      }));
  }, [items, factorIpc]);

  const activeSlug = selectedSlug ?? clickedSlug;
  const activePoint = React.useMemo(() => {
    if (activeSlug) {
      return points.find((p) => p.slug === activeSlug) ?? hovered;
    }
    return hovered ?? points[0] ?? null;
  }, [activeSlug, points, hovered]);

  const medEmp = React.useMemo(
    () => medianValue(points.map((p) => p.empPct)),
    [points]
  );
  const medIng = React.useMemo(
    () => medianValue(points.map((p) => p.ing4)),
    [points]
  );

  if (points.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-[#e2e2dc] bg-white p-6 text-sm text-[#5c5c58]">
        No hay carreras con datos simultáneos de ingreso al 4.º año y empleabilidad para graficar.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#e2e2dc] bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5c5c58]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#1890ff]" />
            Carreras filtradas ({points.length})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#f99c00]" />
            Seleccionada
          </span>
        </div>
        {medEmp !== null && medIng !== null ? (
          <span className="tabular-nums">
            Medianas: {medEmp.toFixed(1).replace(".", ",")} % empleo · {pesos(medIng)} sueldo
          </span>
        ) : null}
      </div>

      {/* Neutral quadrant labels */}
      <div className="mb-1 flex justify-between px-2 text-[11px] font-medium text-[#5c5c58]">
        <span>Menor empleabilidad · Mayor ingreso</span>
        <span>Mayor empleabilidad · Mayor ingreso</span>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 16, bottom: 10, left: 6 }}>
            <CartesianGrid stroke="#e2e2dc" strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="empPct"
              name="Empleabilidad 1.er año"
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fill: "#5c5c58", fontSize: 11 }}
              stroke="#d4d4ce"
            />
            <YAxis
              type="number"
              dataKey="ing4"
              name="Ingreso 4.º año"
              tickFormatter={(v: number) => pesosEje(v)}
              tick={{ fill: "#5c5c58", fontSize: 11 }}
              stroke="#d4d4ce"
              width={56}
            />
            <ZAxis range={[48, 48]} />
            {medEmp !== null ? (
              <ReferenceLine
                x={medEmp}
                stroke="#a3a3a0"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
              />
            ) : null}
            {medIng !== null ? (
              <ReferenceLine
                y={medIng}
                stroke="#a3a3a0"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
              />
            ) : null}
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "#a3a3a0" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as ScatterPoint;
                return (
                  <div className="rounded-lg border border-[#e2e2dc] bg-white px-3 py-2 text-xs shadow-sm">
                    <div className="font-semibold text-[#171716]">{p.nombre}</div>
                    <div className="text-[#5c5c58]">
                      {TIPO_ETIQUETAS[p.tipo].corto} · {p.area}
                    </div>
                    <div className="mt-1 font-medium text-[#171716] tabular-nums">
                      Ingreso 4.º año: {pesos(p.ing4)}
                    </div>
                    <div className="text-[#5c5c58] tabular-nums">
                      Empleabilidad 1.º: {porcentaje(p.empPct / 100)}
                    </div>
                  </div>
                );
              }}
            />
            <Scatter
              data={points}
              onClick={(data) => {
                const p = (data as unknown as { payload?: ScatterPoint })?.payload ?? (data as unknown as ScatterPoint);
                if (p?.slug) {
                  setClickedSlug(p.slug);
                  onSelectSlug?.(p.slug);
                }
              }}
              onMouseEnter={(data) => {
                const p = (data as unknown as { payload?: ScatterPoint })?.payload ?? (data as unknown as ScatterPoint);
                if (p?.slug) setHovered(p);
              }}
            >
              {points.map((p) => {
                const isSelected = p.slug === activeSlug;
                return (
                  <Cell
                    key={`${p.slug}-${p.tipo}`}
                    fill={isSelected ? "#f99c00" : "#1890ff"}
                    fillOpacity={isSelected ? 1 : 0.72}
                    stroke={isSelected ? "#171716" : "#ffffff"}
                    strokeWidth={isSelected ? 1.5 : 1}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1 flex justify-between px-2 text-[11px] font-medium text-[#5c5c58]">
        <span>Menor empleabilidad · Menor ingreso</span>
        <span>Mayor empleabilidad · Menor ingreso</span>
      </div>

      {activePoint ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] px-3.5 py-2.5 text-xs">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#171716]">{activePoint.nombre}</span>
              <span className="rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold text-[#5c5c58] border border-[#e2e2dc]">
                {TIPO_ETIQUETAS[activePoint.tipo].corto}
              </span>
              <span className="text-[#5c5c58]">{activePoint.area}</span>
            </div>
            <div className="mt-0.5 text-[#5c5c58] tabular-nums">
              Sueldo 4.º año: <strong className="text-[#171716]">{pesos(activePoint.ing4)}</strong> ·
              Empleabilidad 1.º: <strong className="text-[#171716]">{porcentaje(activePoint.empPct / 100)}</strong>
              {activePoint.durReal ? ` · Duración real: ${semestres(activePoint.durReal)}` : ""}
            </div>
          </div>
          <Link
            href={`/datos/carreras/${activePoint.slug}?tipo=${activePoint.tipo}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#1063b8] px-3 py-1.5 font-semibold text-white hover:bg-[#0d5095]"
          >
            Ver ficha
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
