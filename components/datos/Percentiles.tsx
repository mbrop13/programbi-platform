"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CarreraTipoData } from "@/lib/datos/carreras";
import { pesos } from "@/lib/datos/formato";

interface PercentilesProps {
  pct: CarreraTipoData["pct"];
  factorIpc?: number;
  etiquetaPesos?: string;
}

interface CortePercentil {
  titulo: string;
  p10: number | null;
  p25: number | null;
  p50: number | null;
  p75: number | null;
  p90: number | null;
}

function BarraPercentil({
  corte,
  maxGlobal,
  factorIpc,
}: {
  corte: CortePercentil;
  maxGlobal: number;
  factorIpc: number;
}) {
  const esc = (v: number | null) => (v !== null ? Math.round(v * factorIpc) : null);
  const p10 = esc(corte.p10);
  const p25 = esc(corte.p25);
  const p50 = esc(corte.p50);
  const p75 = esc(corte.p75);
  const p90 = esc(corte.p90);

  if (p10 === null && p50 === null && p90 === null) {
    return (
      <div className="rounded-lg border border-border bg-muted/40 p-4">
        <p className="text-sm font-semibold text-foreground">{corte.titulo}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Sin información suficiente de dispersión salarial para este año.
        </p>
      </div>
    );
  }

  const toPct = (v: number) => Math.max(0, Math.min(100, (v / maxGlobal) * 100));
  const leftOuter = p10 !== null ? toPct(p10) : p25 !== null ? toPct(p25) : 0;
  const rightOuter = p90 !== null ? toPct(p90) : p75 !== null ? toPct(p75) : 100;
  const leftIqr = p25 !== null ? toPct(p25) : leftOuter;
  const rightIqr = p75 !== null ? toPct(p75) : rightOuter;
  const medPos = p50 !== null ? toPct(p50) : null;

  return (
    <div className="rounded-lg border border-border bg-muted/35 p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{corte.titulo}</span>
        {p50 !== null ? (
          <span className="text-xs font-semibold text-blue-700 tabular-nums">
            Sueldo típico (mediana): {pesos(p50)}
          </span>
        ) : null}
      </div>

      <div className="relative h-7 w-full">
        <div className="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full bg-slate-200/80" />
        <div
          className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-blue-500/25"
          style={{
            left: `${leftOuter}%`,
            width: `${Math.max(2, rightOuter - leftOuter)}%`,
          }}
        />
        {p25 !== null && p75 !== null ? (
          <div
            className="absolute top-1/2 h-3.5 -translate-y-1/2 rounded-sm bg-blue-600"
            style={{
              left: `${leftIqr}%`,
              width: `${Math.max(2, rightIqr - leftIqr)}%`,
            }}
          />
        ) : null}
        {medPos !== null ? (
          <div
            className="absolute top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900"
            style={{ left: `${medPos}%` }}
            title={`Mediana (P50): ${pesos(p50)}`}
          />
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs sm:grid-cols-5">
        <div>
          <span className="block text-[11px] text-muted-foreground">10 % menor</span>
          <span className="font-semibold text-foreground tabular-nums">{pesos(p10)}</span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Percentil 25</span>
          <span className="font-semibold text-foreground tabular-nums">{pesos(p25)}</span>
        </div>
        <div>
          <span className="block text-[11px] font-medium text-blue-700">Mediana (P50)</span>
          <span className="font-bold text-foreground tabular-nums">{pesos(p50)}</span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">Percentil 75</span>
          <span className="font-semibold text-foreground tabular-nums">{pesos(p75)}</span>
        </div>
        <div>
          <span className="block text-[11px] text-muted-foreground">10 % mayor</span>
          <span className="font-semibold text-foreground tabular-nums">{pesos(p90)}</span>
        </div>
      </div>
    </div>
  );
}

export function Percentiles({
  pct,
  factorIpc = 1,
  etiquetaPesos = "pesos de sep-2025",
}: PercentilesProps) {
  const cortes: CortePercentil[] = [
    {
      titulo: "Al 1.er año de egresar",
      p10: pct.p10_1,
      p25: pct.p25_1,
      p50: pct.p50_1,
      p75: pct.p75_1,
      p90: pct.p90_1,
    },
    {
      titulo: "Al 5.º año de egresar",
      p10: pct.p10_5,
      p25: pct.p25_5,
      p50: pct.p50_5,
      p75: pct.p75_5,
      p90: pct.p90_5,
    },
  ];

  const valores = [
    pct.p90_1,
    pct.p90_5,
    pct.p75_1,
    pct.p75_5,
    pct.p50_1,
    pct.p50_5,
  ]
    .filter((v): v is number => v !== null && v > 0)
    .map((v) => v * factorIpc);

  const maxGlobal = valores.length > 0 ? Math.max(...valores) * 1.08 : 1;

  return (
    <Card className="gap-4 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
      <CardHeader className="px-6">
        <CardTitle className="text-base font-semibold text-foreground">
          ¿Cuánto varía el sueldo dentro de esta carrera?
        </CardTitle>
        <CardDescription className="text-xs">
          Rango entre el 10 % que menos gana (P10), la mitad central en azul (P25–P75) y el 10 %
          superior (P90) en {etiquetaPesos}.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-6">
        {cortes.map((corte) => (
          <BarraPercentil
            key={corte.titulo}
            corte={corte}
            maxGlobal={maxGlobal}
            factorIpc={factorIpc}
          />
        ))}
      </CardContent>
    </Card>
  );
}
