"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ajustarPorIpc, getIpcSeries, getUltimoIpc, type PuntoIpc } from "@/lib/datos/ipc";
import { mesCorto, pesos } from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

export type ModoIpc = "pesos_fuente" | "pesos_hoy";

export interface AjustarPorIPCProps {
  monto: number;
  desde?: string;
  hasta?: string;
  serie?: readonly PuntoIpc[];
  modo?: ModoIpc;
  conToggle?: boolean;
  className?: string;
}

export function AjustarPorIPC({
  monto,
  desde = "2025-09",
  hasta,
  serie,
  modo = "pesos_fuente",
  conToggle = true,
  className,
}: AjustarPorIPCProps) {
  const serieActiva = serie && serie.length > 0 ? serie : getIpcSeries();
  const ultimo = serieActiva[serieActiva.length - 1] ?? getUltimoIpc();
  const mesDestino = hasta ?? ultimo.m;
  const [modoActivo, setModoActivo] = useState<ModoIpc>(modo);

  const calculo = ajustarPorIpc(monto, desde, mesDestino, serieActiva);
  const desdeLabel = mesCorto(desde);
  const hastaLabel = mesCorto(calculo?.mesHasta ?? mesDestino);

  const valorPrincipal =
    modoActivo === "pesos_hoy" && calculo ? pesos(calculo.montoAjustado) : pesos(monto);

  const formulaTexto = calculo
    ? `${pesos(monto)} × ${calculo.ipcHasta.toFixed(2).replace(".", ",")} / ${calculo.ipcDesde
        .toFixed(2)
        .replace(".", ",")} = ${pesos(calculo.montoAjustado)}`
    : "monto × IPC_hasta / IPC_desde";

  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="font-bold text-[#171716] tabular-nums">{valorPrincipal}</span>

        {calculo ? (
          <span className="inline-flex items-center gap-1 text-xs text-[#5c5c58] tabular-nums">
            {modoActivo === "pesos_fuente" ? (
              <span>≈ {pesos(calculo.montoAjustado)} en pesos de {hastaLabel}</span>
            ) : (
              <span>
                (pesos de {hastaLabel}; fuente: {pesos(monto)} en {desdeLabel})
              </span>
            )}

            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  aria-label="Ver fórmula de ajuste por IPC"
                  className="inline-flex size-4 items-center justify-center rounded-full text-[#5c5c58] transition-colors hover:bg-[#e9f4ff] hover:text-[#1890ff]"
                >
                  <Info className="size-3.5" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs border-[#e2e2dc] bg-white text-[#171716]">
                  <div className="space-y-1">
                    <p className="font-semibold text-[#171716]">
                      Fórmula oficial: monto × IPC_hasta / IPC_desde
                    </p>
                    <p className="text-[11px] text-[#5c5c58] tabular-nums">{formulaTexto}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        ) : null}
      </div>

      {conToggle && calculo ? (
        <div
          role="group"
          aria-label="Moneda de referencia"
          className="inline-flex w-fit items-center rounded-lg border border-[#e2e2dc] bg-[#f3f3f0] p-0.5 text-[11px]"
        >
          <button
            type="button"
            onClick={() => setModoActivo("pesos_fuente")}
            aria-pressed={modoActivo === "pesos_fuente"}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors",
              modoActivo === "pesos_fuente"
                ? "bg-white text-[#171716] shadow-2xs"
                : "text-[#5c5c58] hover:text-[#171716]"
            )}
          >
            Pesos de {desdeLabel} (fuente)
          </button>
          <button
            type="button"
            onClick={() => setModoActivo("pesos_hoy")}
            aria-pressed={modoActivo === "pesos_hoy"}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors",
              modoActivo === "pesos_hoy"
                ? "bg-white text-[#171716] shadow-2xs"
                : "text-[#5c5c58] hover:text-[#171716]"
            )}
          >
            Pesos de hoy (IPC)
          </button>
        </div>
      ) : null}
    </div>
  );
}
