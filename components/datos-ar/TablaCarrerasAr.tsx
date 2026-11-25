"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { enteroAr, pesosAr, tasaAr } from "@/lib/datos-ar/formato";
import type { DisciplinaAraucano } from "@/lib/datos-ar/types";
import { cn } from "@/lib/utils";

type SortKey =
  | "disciplinaId"
  | "medianaAjustadaOct2026"
  | "medianaNominal"
  | "porcentajeSipaPct"
  | "nConSalarioSipa";

interface TablaCarrerasArProps {
  disciplinas: readonly DisciplinaAraucano[];
  diccionarioDisponible: boolean;
  anioBase: string;
  mesAjusteLabel: string;
  mostrarGrafico?: boolean;
}

const CHART_CONFIG: ChartConfig = {
  medianaAjustada: {
    label: "Mediana ajustada (ARS oct. 2026)",
    color: "#2563eb",
  },
};

export function TablaCarrerasAr({
  disciplinas,
  diccionarioDisponible,
  anioBase,
  mesAjusteLabel,
  mostrarGrafico = true,
}: TablaCarrerasArProps) {
  const [busqueda, setBusqueda] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("medianaAjustadaOct2026");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir(key === "disciplinaId" ? "asc" : "desc");
    }
  };

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const base = q
      ? disciplinas.filter((d) => {
          const etiqueta = d.nombreOficial
            ? `${d.nombreOficial} disciplina #${d.disciplinaId}`.toLowerCase()
            : `disciplina #${d.disciplinaId} ${d.disciplinaId}`;
          return etiqueta.includes(q);
        })
      : [...disciplinas];

    base.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === "asc" ? diff : -diff;
    });
    return base;
  }, [disciplinas, busqueda, sortKey, sortDir]);

  const topChartData = useMemo(() => {
    return [...disciplinas]
      .sort((a, b) => b.medianaAjustadaOct2026 - a.medianaAjustadaOct2026)
      .slice(0, 12)
      .map((d) => ({
        etiqueta: d.nombreOficial ?? `Disc. #${d.disciplinaId}`,
        medianaAjustada: d.medianaAjustadaOct2026,
      }));
  }, [disciplinas]);

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="size-3.5 text-muted-foreground/60" aria-hidden="true" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="size-3.5 text-foreground" aria-hidden="true" />
    ) : (
      <ArrowDown className="size-3.5 text-foreground" aria-hidden="true" />
    );
  };

  return (
    <div className="space-y-6">
      {mostrarGrafico && topChartData.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Top 12 disciplinas por mediana salarial ajustada
              </h3>
              <p className="text-xs text-muted-foreground">
                Base SIPA {anioBase} ajustada por IPC INDEC a {mesAjusteLabel} · disciplinas con{" "}
                <span className="font-medium text-foreground">n &ge; 100</span>
              </p>
            </div>
            {!diccionarioDisponible ? (
              <span className="inline-flex w-fit rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                Códigos oficiales (diccionario pendiente)
              </span>
            ) : null}
          </div>

          <ChartContainer config={CHART_CONFIG} className="h-[320px] w-full">
            <BarChart
              data={topChartData}
              layout="vertical"
              margin={{ top: 4, right: 20, left: 12, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v) => `$ ${Math.round(Number(v) / 1_000_000)}M`}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="etiqueta"
                width={96}
                tick={{ fill: "#334155", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent formatter={(value) => pesosAr(value)} />
                }
              />
              <Bar
                dataKey="medianaAjustada"
                fill="var(--color-medianaAjustada)"
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card shadow-xs">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Las {disciplinas.length} disciplinas publicables (n &ge; 100)
            </h3>
            <p className="text-xs text-muted-foreground">
              Salarios registrados en SIPA ({anioBase}) actualizados por IPC a {mesAjusteLabel}.
            </p>
          </div>
          <label className="relative block w-full sm:w-64">
            <span className="sr-only">Filtrar disciplina por código</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por código (ej. #12)"
              className="w-full rounded-lg border border-border bg-background py-2 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3 sm:px-6">
                  <button
                    type="button"
                    onClick={() => toggleSort("disciplinaId")}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    Disciplina oficial
                    {renderSortIcon("disciplinaId")}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort("medianaAjustadaOct2026")}
                    className="inline-flex items-center justify-end gap-1 hover:text-foreground"
                  >
                    Mediana ajustada ({mesAjusteLabel})
                    {renderSortIcon("medianaAjustadaOct2026")}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort("medianaNominal")}
                    className="inline-flex items-center justify-end gap-1 hover:text-foreground"
                  >
                    Nominal ({anioBase})
                    {renderSortIcon("medianaNominal")}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort("porcentajeSipaPct")}
                    className="inline-flex items-center justify-end gap-1 hover:text-foreground"
                  >
                    % empleo SIPA
                    {renderSortIcon("porcentajeSipaPct")}
                  </button>
                </th>
                <th className="px-4 py-3 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={() => toggleSort("nConSalarioSipa")}
                    className="inline-flex items-center justify-end gap-1 hover:text-foreground"
                  >
                    Graduados SIPA (n)
                    {renderSortIcon("nConSalarioSipa")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular-nums">
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No hay disciplinas que coincidan con «{busqueda}».
                  </td>
                </tr>
              ) : (
                filtradas.map((d) => (
                  <tr
                    key={d.disciplinaId}
                    className={cn("transition-colors hover:bg-muted/30")}
                  >
                    <td className="px-4 py-3 font-medium text-foreground sm:px-6">
                      {d.nombreOficial ?? `Disciplina #${d.disciplinaId}`}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {pesosAr(d.medianaAjustadaOct2026)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {pesosAr(d.medianaNominal)}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {tasaAr(d.porcentajeSipaPct)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground sm:px-6">
                      {enteroAr(d.nConSalarioSipa)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
