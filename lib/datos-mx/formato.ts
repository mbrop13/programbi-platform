const fmtEntero = new Intl.NumberFormat("es-MX", {
  useGrouping: true,
  maximumFractionDigits: 0,
});

const fmtDecimal2 = new Intl.NumberFormat("es-MX", {
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formatea pesos mexicanos enteros: `$29,887`. */
export function pesosMx(monto: number | null | undefined): string {
  if (monto === null || monto === undefined || !Number.isFinite(monto)) return "s/i";
  const redondeado = Math.round(monto);
  return redondeado < 0
    ? `-$${fmtEntero.format(Math.abs(redondeado))}`
    : `$${fmtEntero.format(redondeado)}`;
}

/** Formatea pesos mexicanos con centavos: `$117.31`, `$3,519.30`. */
export function pesosMxExacto(monto: number | null | undefined): string {
  if (monto === null || monto === undefined || !Number.isFinite(monto)) return "s/i";
  return monto < 0
    ? `-$${fmtDecimal2.format(Math.abs(monto))}`
    : `$${fmtDecimal2.format(monto)}`;
}

/** Formatea una proporción en [0, 1] como porcentaje mexicano: `1.3 %`. */
export function porcentajeMx(
  valor: number | null | undefined,
  decimales = 1,
  conEspacio = true
): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/i";
  const pct = (valor * 100).toFixed(decimales);
  return `${pct}${conEspacio ? " " : ""}%`;
}

/** Formatea un número entero con separador de miles mexicano: `14,422`. */
export function enteroMx(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/i";
  return fmtEntero.format(Math.round(valor));
}
