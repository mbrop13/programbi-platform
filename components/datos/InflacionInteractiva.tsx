"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Calculator, ExternalLink, Info, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { trackEvent, trackEventOnce } from "@/lib/analytics/marketing";
import { mesCorto, mesLargo, pesos, variacionPorcentual } from "@/lib/datos/formato";
import { ajustarPorIpc, variacionIpc, type PuntoIpc } from "@/lib/datos/ipc";
import { cn } from "@/lib/utils";

const MONTOS_RAPIDOS = [100_000, 500_000, 1_000_000, 2_000_000] as const;

const CHART_CONFIG: ChartConfig = {
  v: {
    label: "Índice IPC (base 2023 = 100)",
    color: "#1890ff",
  },
};

export interface InflacionInteractivaProps {
  serie: readonly PuntoIpc[];
  defaultDesde?: string;
  defaultHasta?: string;
}

export function InflacionInteractiva({
  serie,
  defaultDesde,
  defaultHasta,
}: InflacionInteractivaProps) {
  const primerMes = serie[0]?.m ?? "2024-09";
  const ultimoMes = serie[serie.length - 1]?.m ?? "2026-10";
  const inicialDesde =
    defaultDesde && serie.some((p) => p.m === defaultDesde)
      ? defaultDesde
      : serie.some((p) => p.m === "2025-09")
        ? "2025-09"
        : primerMes;
  const inicialHasta =
    defaultHasta && serie.some((p) => p.m === defaultHasta) ? defaultHasta : ultimoMes;

  const [montoRaw, setMontoRaw] = useState<string>("1000000");
  const [mesOrigen, setMesOrigen] = useState<string>(inicialDesde);
  const [mesDestino, setMesDestino] = useState<string>(inicialHasta);

  useEffect(() => {
    trackEventOnce("datos_view:inflacion", "datos_view", { pagina: "inflacion" });
  }, []);

  const monto = useMemo(() => {
    const limpio = Number(montoRaw.replace(/[^\d]/g, ""));
    return Number.isFinite(limpio) && limpio >= 0 ? limpio : 0;
  }, [montoRaw]);

  const calculo = useMemo(
    () => ajustarPorIpc(monto, mesOrigen, mesDestino, serie),
    [monto, mesOrigen, mesDestino, serie]
  );

  const variacion = useMemo(
    () => variacionIpc(mesOrigen, mesDestino, serie),
    [mesOrigen, mesDestino, serie]
  );

  const chartData = useMemo(
    () =>
      serie.map((p) => ({
        m: p.m,
        etiqueta: mesCorto(p.m),
        v: p.v,
      })),
    [serie]
  );

  const notificarCalculo = () => {
    trackEvent("datos_calc", { calculadora: "ipc" });
  };

  const handleMontoChange = (val: string) => {
    setMontoRaw(val.replace(/[^\d]/g, ""));
    notificarCalculo();
  };

  const handleOrigenChange = (val: string) => {
    setMesOrigen(val);
    notificarCalculo();
  };

  const handleDestinoChange = (val: string) => {
    setMesDestino(val);
    notificarCalculo();
  };

  const handleSwap = () => {
    setMesOrigen(mesDestino);
    setMesDestino(mesOrigen);
    notificarCalculo();
  };

  const esSerieResumida = serie.length <= 6;

  return (
    <div className="space-y-8">
      <section
        aria-label="Calculadora de ajuste por IPC"
        className="grid gap-6 rounded-xl border border-[#e2e2dc] bg-white p-6 shadow-2xs lg:grid-cols-[1.05fr_0.95fr] lg:p-8"
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="ipc-monto"
              className="block text-xs font-semibold tracking-wide text-[#5c5c58] uppercase"
            >
              Monto en pesos chilenos (CLP)
            </label>
            <div className="relative mt-2">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-base font-semibold text-[#5c5c58]"
              >
                $
              </span>
              <input
                id="ipc-monto"
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                value={montoRaw}
                onChange={(e) => handleMontoChange(e.target.value)}
                className="w-full rounded-lg border border-[#d4d4ce] bg-[#f7f7f4] py-3 pr-4 pl-8 text-lg font-bold text-[#171716] tabular-nums transition-colors focus:border-[#1890ff] focus:bg-white focus:outline-none"
                placeholder="1000000"
              />
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {MONTOS_RAPIDOS.map((preset) => {
                const activo = monto === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleMontoChange(String(preset))}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors",
                      activo
                        ? "border-[#1890ff] bg-[#e9f4ff] text-[#1890ff]"
                        : "border-[#e2e2dc] bg-[#f7f7f4] text-[#5c5c58] hover:text-[#171716]"
                    )}
                  >
                    {pesos(preset)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <div>
              <label
                htmlFor="ipc-mes-origen"
                className="block text-xs font-semibold tracking-wide text-[#5c5c58] uppercase"
              >
                Mes de origen
              </label>
              <select
                id="ipc-mes-origen"
                value={mesOrigen}
                onChange={(e) => handleOrigenChange(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#d4d4ce] bg-[#f7f7f4] px-3 py-2.5 text-sm font-medium text-[#171716] transition-colors focus:border-[#1890ff] focus:bg-white focus:outline-none"
              >
                {serie.map((p) => (
                  <option key={p.m} value={p.m}>
                    {mesLargo(p.m)} ({p.m})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              aria-label="Invertir mes de origen y destino"
              title="Invertir meses"
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] px-3 text-[#5c5c58] transition-colors hover:border-[#1890ff] hover:text-[#1890ff] sm:w-10"
            >
              <ArrowLeftRight className="size-4" aria-hidden="true" />
            </button>

            <div>
              <label
                htmlFor="ipc-mes-destino"
                className="block text-xs font-semibold tracking-wide text-[#5c5c58] uppercase"
              >
                Mes de destino
              </label>
              <select
                id="ipc-mes-destino"
                value={mesDestino}
                onChange={(e) => handleDestinoChange(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#d4d4ce] bg-[#f7f7f4] px-3 py-2.5 text-sm font-medium text-[#171716] transition-colors focus:border-[#1890ff] focus:bg-white focus:outline-none"
              >
                {serie.map((p) => (
                  <option key={p.m} value={p.m}>
                    {mesLargo(p.m)} ({p.m})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f0ec] pt-4 text-xs text-[#5c5c58]">
            <span>Metodología oficial INE (empalme Base 2023 = 100)</span>
            <a
              href="https://calculadoraipc.ine.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#1890ff] hover:underline"
            >
              Calculadora oficial INE
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[#d6e6f5] bg-[#f7f7f4] p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#1890ff] uppercase">
                <Calculator className="size-3.5" aria-hidden="true" />
                Monto actualizado
              </span>
              {variacion !== null ? (
                <span className="inline-flex items-center rounded-full border border-[#e2e2dc] bg-white px-2.5 py-0.5 text-xs font-semibold text-[#171716] tabular-nums">
                  Variación: {variacionPorcentual(variacion)}
                </span>
              ) : null}
            </div>

            <p className="kpi-hero mt-4 text-[#171716] tabular-nums">
              {calculo ? pesos(calculo.montoAjustado) : "s/i"}
            </p>

            <p className="mt-2 text-sm text-[#5c5c58]">
              {calculo ? (
                <>
                  <strong className="font-semibold text-[#171716]">{pesos(monto)}</strong> de{" "}
                  {mesLargo(mesOrigen)} equivalen a{" "}
                  <strong className="font-semibold text-[#171716]">
                    {pesos(calculo.montoAjustado)}
                  </strong>{" "}
                  en {mesLargo(mesDestino)}.
                </>
              ) : (
                "Selecciona un rango válido para calcular el ajuste por IPC."
              )}
            </p>
          </div>

          {calculo ? (
            <div className="mt-6 rounded-lg border border-[#e2e2dc] bg-white p-3.5 text-xs">
              <p className="font-semibold text-[#171716]">Fórmula aplicada</p>
              <p className="mt-1 font-mono text-[11px] text-[#5c5c58] tabular-nums">
                {pesos(monto)} × ({calculo.ipcHasta.toFixed(2).replace(".", ",")} /{" "}
                {calculo.ipcDesde.toFixed(2).replace(".", ",")}) ={" "}
                <span className="font-semibold text-[#171716]">
                  {pesos(calculo.montoAjustado)}
                </span>
              </p>
              <p className="mt-1 text-[11px] text-[#5c5c58]">
                Factor de ajuste: {calculo.factor.toFixed(4).replace(".", ",")} (IPC{" "}
                {mesCorto(mesOrigen)} = {calculo.ipcDesde.toFixed(2).replace(".", ",")} → IPC{" "}
                {mesCorto(mesDestino)} = {calculo.ipcHasta.toFixed(2).replace(".", ",")})
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section
        aria-labelledby="ipc-grafico-titulo"
        className="rounded-xl border border-[#e2e2dc] bg-white p-6 shadow-2xs"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2
              id="ipc-grafico-titulo"
              className="flex items-center gap-2 text-lg font-bold text-[#171716]"
            >
              <TrendingUp className="size-4 text-[#1890ff]" aria-hidden="true" />
              Evolución del Índice de Precios al Consumidor (IPC)
            </h2>
            <p className="mt-1 text-xs text-[#5c5c58]">
              Serie oficial base 2023 = 100 ({mesCorto(primerMes)} a {mesCorto(ultimoMes)})
            </p>
          </div>
        </div>

        {esSerieResumida ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3.5 text-xs leading-relaxed text-[#5c5c58]">
            <Info className="mt-0.5 size-4 shrink-0 text-[#1890ff]" aria-hidden="true" />
            <p>
              Actualmente se muestran los puntos de referencia base de la serie ({serie.length}{" "}
              registros: {serie.map((p) => mesCorto(p.m)).join(", ")}). La serie mensual completa
              desde 2009 se incorpora automáticamente al sincronizar con la API del Banco Central de
              Chile (<code className="font-mono text-[#171716]">BCCH_API_TOKEN</code>).
            </p>
          </div>
        ) : null}

        <div className="mt-5 h-64 w-full">
          <ChartContainer config={CHART_CONFIG} className="h-full w-full">
            <LineChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="#f0f0ec" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="etiqueta"
                tickLine={false}
                axisLine={{ stroke: "#e2e2dc" }}
                tick={{ fill: "#5c5c58", fontSize: 12 }}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickLine={false}
                axisLine={false}
                width={48}
                tick={{ fill: "#5c5c58", fontSize: 12 }}
                tickFormatter={(val: number) => val.toFixed(0)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => {
                      const punto = chartData.find((d) => d.etiqueta === String(label));
                      return punto ? mesLargo(punto.m) : String(label);
                    }}
                    formatter={(value) => value.toFixed(2).replace(".", ",")}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="v"
                name="IPC"
                stroke="#1890ff"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#1890ff", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#f99c00", stroke: "#ffffff", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </section>
    </div>
  );
}
