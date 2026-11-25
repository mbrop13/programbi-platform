"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { periodoMesAr, pesosAr, variacionPctAr } from "@/lib/datos-ar/formato";
import type { PuntoIpcAr } from "@/lib/datos-ar/types";

export function CalculadoraInflacionAr({ serie }: { serie: readonly PuntoIpcAr[] }) {
  const ultimoMes = serie[serie.length - 1]?.mes ?? "";
  const mesDefaultOrigen =
    serie.length >= 13 ? serie[serie.length - 13].mes : (serie[0]?.mes ?? ultimoMes);

  const [montoStr, setMontoStr] = useState("100000");
  const [mesOrigen, setMesOrigen] = useState(mesDefaultOrigen);
  const [mesDestino, setMesDestino] = useState(ultimoMes);

  const resultado = useMemo(() => {
    const monto = Number(montoStr.replace(/[^0-9.,]/g, "").replace(",", "."));
    const origen = serie.find((p) => p.mes === mesOrigen);
    const destino = serie.find((p) => p.mes === mesDestino);

    if (!Number.isFinite(monto) || monto <= 0 || !origen || !destino || origen.indice <= 0) {
      return null;
    }

    const factor = destino.indice / origen.indice;
    const montoAjustado = monto * factor;
    const variacionPct = (factor - 1) * 100;

    return {
      montoAjustado,
      variacionPct,
      factor,
    };
  }, [montoStr, mesOrigen, mesDestino, serie]);

  const opcionesMes = useMemo(() => [...serie].reverse(), [serie]);

  return (
    <section
      aria-labelledby="calc-ipc-titulo"
      className="rounded-2xl border border-border bg-card p-5 shadow-xs sm:p-6"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
          <Calculator className="size-4" aria-hidden="true" />
        </div>
        <div>
          <h2 id="calc-ipc-titulo" className="text-base font-semibold text-foreground sm:text-lg">
            Calculadora de ajuste por inflación (IPC INDEC)
          </h2>
          <p className="text-xs text-muted-foreground">
            Actualizá un sueldo, alquiler o presupuesto entre dos meses de la serie oficial.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Monto en pesos (ARS)</span>
          <input
            type="number"
            min={1}
            step="any"
            value={montoStr}
            onChange={(e) => setMontoStr(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground tabular-nums focus:border-foreground focus:outline-none"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Mes de origen</span>
          <select
            value={mesOrigen}
            onChange={(e) => setMesOrigen(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-foreground focus:outline-none"
          >
            {opcionesMes.map((p) => (
              <option key={p.mes} value={p.mes}>
                {periodoMesAr(p.mes)}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Mes de destino</span>
          <select
            value={mesDestino}
            onChange={(e) => setMesDestino(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-foreground focus:outline-none"
          >
            {opcionesMes.map((p) => (
              <option key={p.mes} value={p.mes}>
                {periodoMesAr(p.mes)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
        {resultado ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Equivalente a precios de {periodoMesAr(mesDestino)}
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {pesosAr(resultado.montoAjustado)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-muted-foreground">Variación acumulada del período</p>
              <p className="text-base font-semibold text-foreground tabular-nums">
                {variacionPctAr(resultado.variacionPct)} (×{resultado.factor.toFixed(2).replace(".", ",")})
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Ingresá un monto mayor a 0 para calcular el ajuste por IPC.
          </p>
        )}
      </div>
    </section>
  );
}
