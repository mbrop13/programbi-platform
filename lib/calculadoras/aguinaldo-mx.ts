import { calcularIsrMensualMx, PRESTACIONES_LFT_2026_MX, UMA_2026_MX } from "@/lib/datos-mx/parametros";

/**
 * Aguinaldo 2026 en México, con las mismas reglas que la guía y la plantilla .xlsx:
 * - LFT art. 87: al menos 15 días de salario, proporcional a los días trabajados del año.
 * - Salario diario = sueldo mensual / 30 (cuota diaria, sin integrar prestaciones).
 * - LISR art. 93 fracc. XIV: exento hasta 30 UMA diarias.
 * - ISR del excedente con el método del art. 96: ISR(sueldo + gravado) − ISR(sueldo).
 *   No incluye el subsidio para el empleo ni el procedimiento opcional del art. 174 RLISR.
 */

export const ANIO_AGUINALDO = 2026;
export const DIAS_ANIO = 365;
export const DIAS_LEY = PRESTACIONES_LFT_2026_MX.aguinaldoDiasMinimo;
export const UMA_DIARIA = UMA_2026_MX.diaria;
export const EXENTO_UMAS = PRESTACIONES_LFT_2026_MX.aguinaldoExentoUmas;
export const TOPE_EXENTO = redondear2(UMA_DIARIA * EXENTO_UMAS);

const MS_DIA = 86_400_000;

function redondear2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** "2026-03-01" → días desde 1970 en UTC (sin zonas horarias de por medio). */
function diaUtc(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isFinite(t) ? Math.floor(t / MS_DIA) : null;
}

/**
 * Días trabajados dentro de 2026, contando el primer y el último día.
 * `fechaSalida` vacía = sigue trabajando al 31 de diciembre.
 */
export function diasTrabajadosEnAnio(fechaIngreso: string, fechaSalida?: string | null): number | null {
  const inicioAnio = diaUtc(`${ANIO_AGUINALDO}-01-01`)!;
  const finAnio = diaUtc(`${ANIO_AGUINALDO}-12-31`)!;
  const ingreso = diaUtc(fechaIngreso);
  if (ingreso === null) return null;
  const salida = fechaSalida ? diaUtc(fechaSalida) : finAnio;
  if (salida === null) return null;
  const desde = Math.max(inicioAnio, ingreso);
  const hasta = Math.min(finAnio, salida);
  return Math.max(0, Math.min(DIAS_ANIO, hasta - desde + 1));
}

export type ResultadoAguinaldo = {
  salarioDiario: number;
  diasTrabajados: number;
  diasAguinaldo: number;
  /** Días de aguinaldo que tocan por la proporción del año (p. ej. 12,58). */
  diasProporcionales: number;
  bruto: number;
  exento: number;
  gravado: number;
  isr: number;
  neto: number;
};

export function calcularAguinaldoMx(input: {
  sueldoMensual: number;
  diasTrabajados: number;
  diasAguinaldo?: number;
}): ResultadoAguinaldo | null {
  const sueldo = redondear2(input.sueldoMensual);
  const dias = Math.round(input.diasTrabajados);
  const diasAguinaldo = input.diasAguinaldo ?? DIAS_LEY;
  if (!(sueldo > 0) || !(dias >= 0) || dias > DIAS_ANIO || !(diasAguinaldo > 0)) return null;

  const salarioDiario = redondear2(sueldo / 30);
  const bruto = redondear2(((salarioDiario * diasAguinaldo) / DIAS_ANIO) * dias);
  const exento = Math.min(bruto, TOPE_EXENTO);
  const gravado = redondear2(Math.max(0, bruto - exento));
  const isr =
    gravado > 0
      ? redondear2(Math.max(0, calcularIsrMensualMx(sueldo + gravado).isr - calcularIsrMensualMx(sueldo).isr))
      : 0;

  return {
    salarioDiario,
    diasTrabajados: dias,
    diasAguinaldo,
    diasProporcionales: redondear2((diasAguinaldo * dias) / DIAS_ANIO),
    bruto,
    exento: redondear2(exento),
    gravado,
    isr,
    neto: redondear2(bruto - isr),
  };
}
