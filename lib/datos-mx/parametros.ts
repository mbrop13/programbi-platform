import rawParametros from "@/data/mx/parametros-laborales-2026.json";
import type { ParametrosLaboralesMx, TramoIsrMx } from "./types";

const PARAMETROS = rawParametros as ParametrosLaboralesMx;

export function getParametrosLaboralesMx(): ParametrosLaboralesMx {
  return PARAMETROS;
}

export const UMA_2026_MX = PARAMETROS.uma;
export const SALARIO_MINIMO_2026_MX = PARAMETROS.salarioMinimo;
export const PRESTACIONES_LFT_2026_MX = PARAMETROS.prestacionesLft;

function calcularIsrConTabla(ingresoGravable: number, tramos: readonly TramoIsrMx[]): {
  isr: number;
  tramo: TramoIsrMx | null;
  tasaMarginalPct: number;
  tasaEfectivaPct: number;
} {
  if (!Number.isFinite(ingresoGravable) || ingresoGravable <= 0) {
    return { isr: 0, tramo: null, tasaMarginalPct: 0, tasaEfectivaPct: 0 };
  }

  const tramo =
    tramos.find(
      (t) =>
        ingresoGravable >= t.limiteInferior &&
        (t.limiteSuperior === null || ingresoGravable <= t.limiteSuperior)
    ) ?? tramos[tramos.length - 1];

  const excedente = Math.max(0, ingresoGravable - tramo.limiteInferior);
  const impuestoMarginal = excedente * (tramo.porcentajeExcedente / 100);
  const isr = Number((tramo.cuotaFija + impuestoMarginal).toFixed(2));
  const tasaEfectivaPct = Number(((isr / ingresoGravable) * 100).toFixed(2));

  return {
    isr,
    tramo,
    tasaMarginalPct: tramo.porcentajeExcedente,
    tasaEfectivaPct,
  };
}

export function calcularIsrMensualMx(ingresoGravableMensual: number) {
  return calcularIsrConTabla(ingresoGravableMensual, PARAMETROS.isrArt96Mensual.tramos);
}

export function calcularIsrQuincenalMx(ingresoGravableQuincenal: number) {
  return calcularIsrConTabla(ingresoGravableQuincenal, PARAMETROS.isrArt96Quincenal.tramos);
}
