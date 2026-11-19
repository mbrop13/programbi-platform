"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OfertaResumen, ProgramaCarrera } from "@/lib/datos/carreras";
import { entero, pesos } from "@/lib/datos/formato";

interface HistogramaArancelesProps {
  programas: ProgramaCarrera[];
  oferta: OfertaResumen | null;
}

const CHART_CONFIG: ChartConfig = {
  count: { label: "Programas", color: "#1890ff" },
};

function calcularMediana(vals: number[]): number | null {
  if (vals.length === 0) return null;
  const s = [...vals].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? Math.round((s[m - 1] + s[m]) / 2) : s[m];
}

function construirBins(aranceles: number[]) {
  if (aranceles.length === 0) return [];
  const minVal = Math.min(...aranceles);
  const maxVal = Math.max(...aranceles);
  const startM = Math.floor(minVal / 1_000_000);
  const endM = Math.max(startM + 1, Math.ceil(maxVal / 1_000_000));

  const bins: { label: string; min: number; max: number | null; count: number }[] = [];
  for (let m = startM; m < endM; m++) {
    const lo = m * 1_000_000;
    const hi = (m + 1) * 1_000_000;
    const isLast = m === endM - 1;
    const count = aranceles.filter((a) =>
      isLast ? a >= lo && a <= hi : a >= lo && a < hi
    ).length;
    bins.push({
      label: `$${m}M – $${m + 1}M`,
      min: lo,
      max: hi,
      count,
    });
  }
  return bins;
}

export function HistogramaAranceles({
  programas,
  oferta,
}: HistogramaArancelesProps) {
  const [jornada, setJornada] = useState("todas");
  const [region, setRegion] = useState("todas");

  const jornadasDisponibles = useMemo(() => {
    const set = new Set<string>();
    for (const p of programas) if (p.jornada) set.add(p.jornada);
    return [...set].sort((a, b) => a.localeCompare(b, "es"));
  }, [programas]);

  const regionesDisponibles = useMemo(() => {
    const set = new Set<string>();
    for (const p of programas) if (p.region) set.add(p.region);
    return [...set].sort((a, b) => a.localeCompare(b, "es"));
  }, [programas]);

  const filtrados = useMemo(() => {
    return programas.filter((p) => {
      if (jornada !== "todas" && p.jornada !== jornada) return false;
      if (region !== "todas" && p.region !== region) return false;
      return true;
    });
  }, [programas, jornada, region]);

  const aranceles = useMemo(
    () =>
      filtrados
        .map((p) => p.arancel)
        .filter((a): a is number => a !== null && a > 0),
    [filtrados]
  );

  const resumen = useMemo(() => {
    if (aranceles.length === 0) return null;
    return {
      min: Math.min(...aranceles),
      med: calcularMediana(aranceles),
      max: Math.max(...aranceles),
      n: aranceles.length,
    };
  }, [aranceles]);

  const bins = useMemo(() => {
    if (jornada === "todas" && region === "todas" && oferta?.arancel_histograma?.length) {
      return oferta.arancel_histograma;
    }
    return construirBins(aranceles);
  }, [jornada, region, oferta, aranceles]);

  if (programas.length === 0 && !oferta?.arancel_histograma?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[#e2e2dc] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#171716]">
            Distribución de aranceles anuales 2026
          </h3>
          <p className="text-xs text-[#5c5c58]">
            Oferta oficial del Buscador de Carreras (Mineduc) según jornada y región.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={jornada} onValueChange={setJornada}>
            <SelectTrigger size="sm" aria-label="Filtrar por jornada" className="bg-[#f7f7f4]">
              <SelectValue placeholder="Jornada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las jornadas</SelectItem>
              {jornadasDisponibles.map((j) => (
                <SelectItem key={j} value={j}>
                  {j}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger size="sm" aria-label="Filtrar por región" className="bg-[#f7f7f4]">
              <SelectValue placeholder="Región" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las regiones</SelectItem>
              {regionesDisponibles.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {resumen ? (
        <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3 text-xs tabular-nums">
          <div>
            <span className="block text-[#5c5c58]">Mínimo</span>
            <span className="text-sm font-bold text-[#171716]">{pesos(resumen.min)}</span>
          </div>
          <div>
            <span className="block text-[#5c5c58]">Mediana ({entero(resumen.n)} prog.)</span>
            <span className="text-sm font-bold text-[#1063b8]">{pesos(resumen.med)}</span>
          </div>
          <div>
            <span className="block text-[#5c5c58]">Máximo</span>
            <span className="text-sm font-bold text-[#171716]">{pesos(resumen.max)}</span>
          </div>
        </div>
      ) : null}

      {bins.length > 0 ? (
        <ChartContainer config={CHART_CONFIG} className="h-[260px] w-full tabular-nums">
          <BarChart data={bins} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e2dc" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "#e2e2dc" }}
              tick={{ fill: "#5c5c58", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={36}
              domain={[0, "auto"]}
              allowDecimals={false}
              tick={{ fill: "#5c5c58", fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(val) => `${entero(val)} programas`}
                  labelFormatter={(lbl) => `Tramo arancel: ${String(lbl)}`}
                />
              }
            />
            <Bar
              dataKey="count"
              fill="#1890ff"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-[#e2e2dc] text-sm text-[#5c5c58]">
          No hay programas con arancel publicado para la combinación seleccionada.
        </div>
      )}
    </div>
  );
}
