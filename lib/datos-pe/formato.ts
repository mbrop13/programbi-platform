const fmtEntero = new Intl.NumberFormat("es-CL", {
  useGrouping: true,
  maximumFractionDigits: 0,
});

const fmtDecimal = new Intl.NumberFormat("es-CL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Formatea soles peruanos con separador de miles por punto: `S/ 2.881`. */
export function soles(monto: number | null | undefined): string {
  if (monto === null || monto === undefined || !Number.isFinite(monto)) return "s/i";
  const redondeado = Math.round(monto);
  if (redondeado < 0) {
    return `−S/\u00a0${fmtEntero.format(Math.abs(redondeado))}`;
  }
  return `S/\u00a0${fmtEntero.format(redondeado)}`;
}

/** Formatea soles en texto plano sin espacio irrompible: `S/ 2.881`. */
export function solesTexto(monto: number | null | undefined): string {
  return soles(monto).replace("\u00a0", " ");
}

/**
 * Formatea un porcentaje expresado en puntos porcentuales (ej. `85.2` -> `85,2 %`).
 */
export function porcentaje(valor: number | null | undefined, conEspacio = true): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/i";
  const sep = conEspacio ? "\u00a0" : "";
  return `${fmtDecimal.format(valor)}${sep}%`;
}

/** Formatea un porcentaje en texto plano sin espacio irrompible: `85,2 %`. */
export function porcentajeTexto(valor: number | null | undefined): string {
  return porcentaje(valor, true).replace("\u00a0", " ");
}

/** Formatea un número entero con separador de miles por punto: `1.052`. */
export function entero(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/i";
  return fmtEntero.format(Math.round(valor));
}
