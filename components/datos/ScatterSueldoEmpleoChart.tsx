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
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAreaVisual } from "@/lib/datos/areas-visual";
import { TIPO_ETIQUETAS, type RankingItem } from "@/lib/datos/carreras-tipos";
import { anosDesdeSemestres, pesos, pesosEje, porcentaje } from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

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
  accent: string;
}

function medianValue(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export default function ScatterSueldoEmpleoChart({
  items,
  factorIpc = 1,
  selectedSlug,
  onSelectSlug,
}: ScatterSueldoEmpleoProps) {
  const [hovered, setHovered] = React.useState<ScatterPoint | null>(null);
  const [clickedSlug, setClickedSlug] = React.useState<string | null>(null);
  const [activeArea, setActiveArea] = React.useState<string | null>(null);

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
        accent: getAreaVisual(r.area).accent,
      }));
  }, [items, factorIpc]);

  const areasPresentes = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of points) {
      counts.set(p.area, (counts.get(p.area) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([area, count]) => ({ area, count, visual: getAreaVisual(area) }));
  }, [points]);

  const activeSlug = selectedSlug ?? clickedSlug;
  const activePoint = React.useMemo(() => {
    if (activeSlug) {
      return points.find((p) => p.slug === activeSlug) ?? hovered;
    }
    if (activeArea) {
      return hovered?.area === activeArea
        ? hovered
        : points.find((p) => p.area === activeArea) ?? points[0] ?? null;
    }
    return hovered ?? points[0] ?? null;
  }, [activeSlug, activeArea, points, hovered]);

  const medEmp = React.useMemo(() => medianValue(points.map((p) => p.empPct)), [points]);
  const medIng = React.useMemo(() => medianValue(points.map((p) => p.ing4)), [points]);

  if (points.length === 0) {
    return (
      <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
        <CardContent className="flex h-[360px] items-center justify-center p-6 text-sm text-muted-foreground">
          No hay carreras con datos simultáneos de sueldo y empleabilidad para graficar con estos
          filtros.
        </CardContent>
      </Card>
    );
  }

  const activeVisual = activePoint ? getAreaVisual(activePoint.area) : null;

  return (
    <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-foreground tabular-nums">
              {points.length} carreras graficadas
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-slate-900 ring-2 ring-blue-500/40" />
              Seleccionada
            </span>
          </div>
          {medEmp !== null && medIng !== null ? (
            <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground tabular-nums">
              Medianas: {medEmp.toFixed(1).replace(".", ",")} % empleo · {pesos(medIng)}
            </span>
          ) : null}
        </div>

        {/* Leyenda interactiva por área */}
        {areasPresentes.length > 1 ? (
          <div
            role="group"
            aria-label="Resaltar área en el gráfico"
            className="mb-4 flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => setActiveArea(null)}
              aria-pressed={activeArea === null}
              className={cn(
                "rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
                activeArea === null
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              Todas ({points.length})
            </button>
            {areasPresentes.map(({ area, count, visual }) => {
              const isActive = activeArea === area;
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => setActiveArea(isActive ? null : area)}
                  aria-pressed={isActive}
                  style={
                    isActive
                      ? {
                          backgroundColor: visual.softBg,
                          borderColor: visual.accent,
                          color: visual.accent,
                        }
                      : undefined
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
                    isActive
                      ? "font-semibold"
                      : "border-border bg-card text-muted-foreground hover:border-slate-300 hover:text-foreground"
                  )}
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: visual.accent }}
                    aria-hidden="true"
                  />
                  <span>{visual.nombre}</span>
                  <span className="text-[10px] opacity-75 tabular-nums">({count})</span>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mb-1.5 flex justify-between px-2 text-[11px] font-medium text-muted-foreground">
          <span>Alto sueldo · Empleo más competitivo</span>
          <span className="text-emerald-700">Alto sueldo · Alta empleabilidad</span>
        </div>

        <div className="h-[310px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 16, bottom: 10, left: 6 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="empPct"
                name="Empleabilidad 1.er año"
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fill: "#64748b", fontSize: 11 }}
                stroke="#cbd5e1"
              />
              <YAxis
                type="number"
                dataKey="ing4"
                name="Ingreso 4.º año"
                tickFormatter={(v: number) => pesosEje(v)}
                tick={{ fill: "#64748b", fontSize: 11 }}
                stroke="#cbd5e1"
                width={58}
              />
              <ZAxis range={[56, 56]} />
              {medEmp !== null ? (
                <ReferenceLine
                  x={medEmp}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  ifOverflow="extendDomain"
                />
              ) : null}
              {medIng !== null ? (
                <ReferenceLine
                  y={medIng}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  ifOverflow="extendDomain"
                />
              ) : null}
              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: "#94a3b8" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0].payload as ScatterPoint;
                  return (
                    <div className="rounded-lg border border-border bg-popover px-3 py-2.5 text-xs shadow-lg shadow-slate-900/10">
                      <div className="font-semibold text-foreground">{p.nombre}</div>
                      <div className="text-muted-foreground">
                        {TIPO_ETIQUETAS[p.tipo].corto} · {p.area}
                      </div>
                      <div className="mt-1.5 font-semibold text-foreground tabular-nums">
                        Sueldo 4.º año: {pesos(p.ing4)}
                      </div>
                      <div className="text-muted-foreground tabular-nums">
                        Empleabilidad 1.er año: {porcentaje(p.empPct / 100)}
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter
                data={points}
                onClick={(data) => {
                  const p =
                    (data as unknown as { payload?: ScatterPoint })?.payload ??
                    (data as unknown as ScatterPoint);
                  if (p?.slug) {
                    setClickedSlug(p.slug);
                    onSelectSlug?.(p.slug);
                  }
                }}
                onMouseEnter={(data) => {
                  const p =
                    (data as unknown as { payload?: ScatterPoint })?.payload ??
                    (data as unknown as ScatterPoint);
                  if (p?.slug) setHovered(p);
                }}
              >
                {points.map((p) => {
                  const isSelected = p.slug === activeSlug;
                  const isDimmed = activeArea !== null && p.area !== activeArea && !isSelected;
                  return (
                    <Cell
                      key={`${p.slug}-${p.tipo}`}
                      fill={isSelected ? "#0f172a" : p.accent}
                      fillOpacity={isSelected ? 1 : isDimmed ? 0.14 : 0.78}
                      stroke={isSelected ? "#2563eb" : "#ffffff"}
                      strokeWidth={isSelected ? 2.25 : 1}
                      style={{ cursor: "pointer" }}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-1 flex justify-between px-2 text-[11px] font-medium text-muted-foreground">
          <span>Menor sueldo · Menor empleo</span>
          <span>Menor sueldo · Alta empleabilidad</span>
        </div>

        {activePoint && activeVisual ? (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-muted/35 p-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="hidden size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-slate-100 sm:block">
                <img
                  src={activeVisual.image}
                  alt={activeVisual.nombre}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{activePoint.nombre}</span>
                  <Badge variant="secondary" className="h-auto rounded px-1.5 py-0 text-[11px]">
                    {TIPO_ETIQUETAS[activePoint.tipo].corto}
                  </Badge>
                  <span
                    style={{
                      backgroundColor: activeVisual.softBg,
                      color: activeVisual.accent,
                      borderColor: activeVisual.border,
                    }}
                    className="rounded border px-1.5 py-0 text-[11px] font-medium"
                  >
                    {activePoint.area}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground tabular-nums">
                  <span>
                    Sueldo 4.º año:{" "}
                    <strong className="font-semibold text-foreground">{pesos(activePoint.ing4)}</strong>
                  </span>
                  <span>
                    Empleabilidad:{" "}
                    <strong className="font-semibold text-foreground">
                      {porcentaje(activePoint.empPct / 100)}
                    </strong>
                  </span>
                  {activePoint.durReal ? (
                    <span>
                      Duración real:{" "}
                      <strong className="font-semibold text-foreground">
                        {anosDesdeSemestres(activePoint.durReal)}
                      </strong>
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <Link
              href={`/datos/carreras/${activePoint.slug}?tipo=${activePoint.tipo}`}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "h-8 w-fit shrink-0 gap-1 rounded-lg px-3 text-xs font-medium"
              )}
            >
              Ver ficha
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
