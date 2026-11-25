const fmtEntero = new Intl.NumberFormat("es-AR", {
  useGrouping: true,
  maximumFractionDigits: 0,
});

const fmtDecimal1 = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const fmtDecimal2 = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const MESES_LARGOS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

const MESES_CORTOS = [
  "ene.",
  "feb.",
  "mar.",
  "abr.",
  "may.",
  "jun.",
  "jul.",
  "ago.",
  "sep.",
  "oct.",
  "nov.",
  "dic.",
] as const;

/** Formatea pesos argentinos con espacio tras el signo: `$ 123.456`. */
export function pesosAr(monto: number | null | undefined): string {
  if (monto === null || monto === undefined || !Number.isFinite(monto)) return "s/d";
  const redondeado = Math.round(monto);
  return redondeado < 0
    ? `−$ ${fmtEntero.format(Math.abs(redondeado))}`
    : `$ ${fmtEntero.format(redondeado)}`;
}

/** Formatea una proporción en [0, 1] como porcentaje argentino: `7,9 %`. */
export function porcentajeAr(ratio: number | null | undefined, decimales = 1): string {
  if (ratio === null || ratio === undefined || !Number.isFinite(ratio)) return "s/d";
  const fmt = decimales === 2 ? fmtDecimal2 : fmtDecimal1;
  return `${fmt.format(ratio * 100)} %`;
}

/** Formatea un valor ya expresado en puntos porcentuales: `7,9 %`. */
export function tasaAr(valorPct: number | null | undefined, decimales = 1): string {
  if (valorPct === null || valorPct === undefined || !Number.isFinite(valorPct)) return "s/d";
  const fmt = decimales === 2 ? fmtDecimal2 : fmtDecimal1;
  return `${fmt.format(valorPct)} %`;
}

/** Formatea una variación porcentual con signo: `+2,2 %` o `−1,4 %`. */
export function variacionPctAr(valorPct: number | null | undefined): string {
  if (valorPct === null || valorPct === undefined || !Number.isFinite(valorPct)) return "s/d";
  const abs = fmtDecimal1.format(Math.abs(valorPct));
  if (abs === "0,0") return "0,0 %";
  return `${valorPct > 0 ? "+" : "−"}${abs} %`;
}

/** Formatea enteros con separador de miles argentino: `146.490`. */
export function enteroAr(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/d";
  return fmtEntero.format(Math.round(valor));
}

/** Convierte `YYYY-MM` en `octubre 2026` o `oct. 2026`. */
export function periodoMesAr(ym: string, corto = false): string {
  const [anio, mesStr] = ym.split("-");
  const idx = Number(mesStr) - 1;
  const lista = corto ? MESES_CORTOS : MESES_LARGOS;
  const nombre = lista[idx];
  if (!nombre || !anio) return ym;
  return `${nombre} ${anio}`;
}

/** Convierte fecha trimestral EPH (`2026-04-01`) en `2.º trim. 2026`. */
export function periodoTrimestreAr(fecha: string): string {
  const [anio, mes] = fecha.split("-");
  const mapa: Record<string, string> = {
    "01": "1.º trim.",
    "04": "2.º trim.",
    "07": "3.º trim.",
    "10": "4.º trim.",
  };
  return `${mapa[mes] ?? mes} ${anio}`;
}
