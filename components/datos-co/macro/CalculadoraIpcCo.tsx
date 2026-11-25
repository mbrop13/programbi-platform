"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { pesosCo, tasaCo } from "@/lib/datos-co/formato";
import type { InflacionPuntoCo } from "@/lib/datos-co/types";
import { cn } from "@/lib/utils";

type ModoCalculadora = "ajustar" | "salario";
type RangoIpc = "5y" | "10y" | "all";

const CONFIG_IPC: ChartConfig = {
  var_12m_pct: {
    label: "Variación IPC 12 meses",
    color: "#b45309",
  },
};

const PRESETS_MONTO = [
  { label: "$1.000.000", valor: 1_000_000 },
  { label: "$1.750.905 (SMMLV 2026)", valor: 1_750_905 },
  { label: "$5.000.000", valor: 5_000_000 },
] as const;

export interface CalculadoraIpcCoProps {
  serie: InflacionPuntoCo[];
}

export function CalculadoraIpcCo({ serie }: CalculadoraIpcCoProps) {
  const ultimo = serie.at(-1);
  const periodoDefaultOrigen =
    serie.find((p) => p.periodo === "2021-10")?.periodo ?? serie[0]?.periodo ?? "2021-10";
  const periodoDefaultDestino = ultimo?.periodo ?? "2026-10";

  const [modo, setModo] = useState<ModoCalculadora>("ajustar");
  const [montoTexto, setMontoTexto] = useState("1750905");
  const [salarioInicialTexto, setSalarioInicialTexto] = useState("1423500");
  const [salarioFinalTexto, setSalarioFinalTexto] = useState("1750905");
  const [origen, setOrigen] = useState(periodoDefaultOrigen);
  const [destino, setDestino] = useState(periodoDefaultDestino);
  const [rango, setRango] = useState<RangoIpc>("10y");

  const mapaPeriodos = useMemo(() => {
    const mapa = new Map<string, InflacionPuntoCo>();
    for (const p of serie) mapa.set(p.periodo, p);
    return mapa;
  }, [serie]);

  const opcionesPeriodo = useMemo(() => serie.slice().reverse(), [serie]);

  const puntoOrigen = mapaPeriodos.get(origen);
  const puntoDestino = mapaPeriodos.get(destino);

  const montoNum = Math.max(0, Number(montoTexto.replace(/[^\d]/g, "")) || 0);
  const salIniNum = Math.max(0, Number(salarioInicialTexto.replace(/[^\d]/g, "")) || 0);
  const salFinNum = Math.max(0, Number(salarioFinalTexto.replace(/[^\d]/g, "")) || 0);

  const calculoAjuste = useMemo(() => {
    if (!puntoOrigen || !puntoDestino || puntoOrigen.indice_base_dic2018 <= 0) return null;
    const factor = puntoDestino.indice_base_dic2018 / puntoOrigen.indice_base_dic2018;
    const montoAjustado = montoNum * factor;
    const variacionPct = (factor - 1) * 100;
    const poderCompraHoyDeMontoOriginal = factor > 0 ? montoNum / factor : 0;
    return {
      factor,
      montoAjustado,
      variacionPct,
      diferencia: montoAjustado - montoNum,
      poderCompraHoyDeMontoOriginal,
    };
  }, [puntoOrigen, puntoDestino, montoNum]);

  const calculoSalario = useMemo(() => {
    if (
      !puntoOrigen ||
      !puntoDestino ||
      puntoOrigen.indice_base_dic2018 <= 0 ||
      salIniNum <= 0
    ) {
      return null;
    }
    const factorIpc = puntoDestino.indice_base_dic2018 / puntoOrigen.indice_base_dic2018;
    const inflacionPeriodoPct = (factorIpc - 1) * 100;
    const variacionNominalPct = ((salFinNum - salIniNum) / salIniNum) * 100;
    const salarioNecesario = salIniNum * factorIpc;
    const variacionRealPct = ((salFinNum / salarioNecesario) - 1) * 100;
    return {
      inflacionPeriodoPct,
      variacionNominalPct,
      salarioNecesario,
      variacionRealPct,
      diferenciaRealCop: salFinNum - salarioNecesario,
    };
  }, [puntoOrigen, puntoDestino, salIniNum, salFinNum]);

  const serieConVar = useMemo(() => {
    const validos = serie.filter(
      (p): p is InflacionPuntoCo & { var_12m_pct: number } => p.var_12m_pct !== null
    );
    if (rango === "all") return validos;
    const meses = rango === "5y" ? 60 : 120;
    return validos.slice(-meses);
  }, [serie, rango]);

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Calculadora de IPC y poder adquisitivo en Colombia
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Usa la serie oficial del DANE (base dic-2018 = 100) desde enero de 2003 hasta{" "}
                {ultimo ? `${ultimo.mes_nombre.toLowerCase()} de ${ultimo.anio}` : "octubre de 2026"}.
              </CardDescription>
            </div>
            <div className="flex gap-1.5" role="tablist" aria-label="Modo de calculadora">
              <button
                type="button"
                role="tab"
                aria-selected={modo === "ajustar"}
                onClick={() => setModo("ajustar")}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  modo === "ajustar"
                    ? "border-amber-700 bg-amber-700 text-white"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                Ajustar monto por IPC
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={modo === "salario"}
                onClick={() => setModo("salario")}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  modo === "salario"
                    ? "border-amber-700 bg-amber-700 text-white"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                ¿Mi salario le ganó al IPC?
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 pt-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            {modo === "ajustar" ? (
              <div className="space-y-2">
                <label
                  htmlFor="ipc-co-monto"
                  className="block text-sm font-medium text-foreground"
                >
                  Monto en pesos colombianos (COP)
                </label>
                <input
                  id="ipc-co-monto"
                  type="text"
                  inputMode="numeric"
                  value={montoTexto}
                  onChange={(e) => setMontoTexto(e.target.value.replace(/[^\d]/g, ""))}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-base font-medium tabular-nums text-foreground focus:border-amber-600 focus:outline-none"
                  placeholder="Ej. 1750905"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESETS_MONTO.map((preset) => (
                    <button
                      key={preset.valor}
                      type="button"
                      onClick={() => setMontoTexto(String(preset.valor))}
                      className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="ipc-co-sal-ini"
                    className="block text-sm font-medium text-foreground"
                  >
                    Salario inicial (COP)
                  </label>
                  <input
                    id="ipc-co-sal-ini"
                    type="text"
                    inputMode="numeric"
                    value={salarioInicialTexto}
                    onChange={(e) =>
                      setSalarioInicialTexto(e.target.value.replace(/[^\d]/g, ""))
                    }
                    className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-base font-medium tabular-nums text-foreground focus:border-amber-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="ipc-co-sal-fin"
                    className="block text-sm font-medium text-foreground"
                  >
                    Salario actual (COP)
                  </label>
                  <input
                    id="ipc-co-sal-fin"
                    type="text"
                    inputMode="numeric"
                    value={salarioFinalTexto}
                    onChange={(e) =>
                      setSalarioFinalTexto(e.target.value.replace(/[^\d]/g, ""))
                    }
                    className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-base font-medium tabular-nums text-foreground focus:border-amber-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="ipc-co-origen"
                  className="block text-sm font-medium text-foreground"
                >
                  Mes de origen
                </label>
                <select
                  id="ipc-co-origen"
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-amber-600 focus:outline-none"
                >
                  {opcionesPeriodo.map((p) => (
                    <option key={p.periodo} value={p.periodo}>
                      {p.mes_nombre} {p.anio} (IPC {p.indice_base_dic2018.toFixed(2).replace(".", ",")})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="ipc-co-destino"
                  className="block text-sm font-medium text-foreground"
                >
                  Mes de destino
                </label>
                <select
                  id="ipc-co-destino"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-amber-600 focus:outline-none"
                >
                  {opcionesPeriodo.map((p) => (
                    <option key={p.periodo} value={p.periodo}>
                      {p.mes_nombre} {p.anio} (IPC {p.indice_base_dic2018.toFixed(2).replace(".", ",")})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {puntoOrigen && puntoDestino ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Fórmula oficial DANE: monto × (IPC {puntoDestino.periodo} / IPC{" "}
                {puntoOrigen.periodo}) = monto × (
                {puntoDestino.indice_base_dic2018.toFixed(2).replace(".", ",")} /{" "}
                {puntoOrigen.indice_base_dic2018.toFixed(2).replace(".", ",")}).
              </p>
            ) : null}
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-amber-200/80 bg-amber-50/50 p-5">
            {modo === "ajustar" && calculoAjuste ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-amber-900/75">
                    Equivalente ajustado a {puntoDestino?.mes_nombre.toLowerCase()} {puntoDestino?.anio}
                  </p>
                  <p className="mt-1.5 text-3xl font-bold tracking-tight tabular-nums text-foreground sm:text-4xl">
                    {pesosCo(calculoAjuste.montoAjustado)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-amber-200/80 pt-3.5 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Inflación acumulada</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-foreground">
                      {tasaCo(calculoAjuste.variacionPct, 2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Diferencia nominal</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-foreground">
                      {pesosCo(calculoAjuste.diferencia)}
                    </p>
                  </div>
                </div>

                <p className="border-t border-amber-200/80 pt-3 text-xs leading-relaxed text-muted-foreground">
                  Si ese monto ({pesosCo(montoNum)}) no se reajustó desde {puntoOrigen?.mes_nombre.toLowerCase()}{" "}
                  {puntoOrigen?.anio}, hoy equivale en poder de compra a{" "}
                  <strong className="text-foreground">
                    {pesosCo(calculoAjuste.poderCompraHoyDeMontoOriginal)}
                  </strong>{" "}
                  de entonces.
                </p>
              </div>
            ) : modo === "salario" && calculoSalario ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-amber-900/75">
                    Variación real frente al IPC
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl",
                      calculoSalario.variacionRealPct >= 0
                        ? "text-emerald-700"
                        : "text-rose-700"
                    )}
                  >
                    {calculoSalario.variacionRealPct >= 0 ? "+" : ""}
                    {tasaCo(calculoSalario.variacionRealPct, 2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-amber-200/80 pt-3.5 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Tu alza nominal</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-foreground">
                      {tasaCo(calculoSalario.variacionNominalPct, 2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">IPC del período</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-foreground">
                      {tasaCo(calculoSalario.inflacionPeriodoPct, 2)}
                    </p>
                  </div>
                </div>

                <p className="border-t border-amber-200/80 pt-3 text-xs leading-relaxed text-muted-foreground">
                  Para empatar con la inflación necesitabas{" "}
                  <strong className="text-foreground">
                    {pesosCo(calculoSalario.salarioNecesario)}
                  </strong>
                  . Diferencia real:{" "}
                  <strong className="text-foreground">
                    {pesosCo(calculoSalario.diferenciaRealCop)}
                  </strong>
                  .
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ingresa un monto válido para calcular el ajuste por IPC.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-border bg-card shadow-xs ring-0">
        <CardHeader className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Inflación anual en Colombia (variación 12 meses del IPC)
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              Variación porcentual a 12 meses del índice nacional DANE (base dic-2018 = 100).
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Rango de inflación">
            {(
              [
                { id: "5y", label: "5 años" },
                { id: "10y", label: "10 años" },
                { id: "all", label: "2004–2026" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRango(opt.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  rango === opt.id
                    ? "border-amber-700 bg-amber-700 text-white"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer config={CONFIG_IPC} className="h-[290px] w-full tabular-nums">
            <AreaChart data={serieConVar} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="fillIpcCo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b45309" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#b45309" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="periodo"
                tickLine={false}
                axisLine={false}
                minTickGap={36}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, "auto"]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Período ${label}`}
                    formatter={(val) => tasaCo(val, 2)}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="var_12m_pct"
                stroke="#b45309"
                strokeWidth={2.2}
                fill="url(#fillIpcCo)"
                dot={false}
                activeDot={{ r: 4.5, fill: "#b45309" }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
