const fmtEntero = new Intl.NumberFormat("es-CO", {
  useGrouping: true,
  maximumFractionDigits: 0,
});

const fmt1Decimal = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const fmt2Decimales = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PALABRAS_MENORES = new Set([
  "de",
  "del",
  "la",
  "las",
  "los",
  "y",
  "e",
  "en",
  "a",
  "al",
  "para",
  "con",
  "por",
  "o",
  "u",
]);

const SIGLAS = new Set(["TIC", "SENA", "SQL", "BI", "CAD", "BIM", "CNC"]);

/** Formatea pesos colombianos completos: `$1.750.905`. */
export function pesosCo(monto: number | null | undefined): string {
  if (monto === null || monto === undefined || !Number.isFinite(monto)) return "s/d";
  const redondeado = Math.round(monto);
  return redondeado < 0
    ? `−$${fmtEntero.format(Math.abs(redondeado))}`
    : `$${fmtEntero.format(redondeado)}`;
}

/** Formatea millones abreviados para tarjetas: `$6,9 millones` o `$950 mil`. */
export function millonesCortoCo(monto: number | null | undefined): string {
  if (monto === null || monto === undefined || !Number.isFinite(monto)) return "s/d";
  if (monto >= 995_000) {
    return `$${fmt1Decimal.format(monto / 1_000_000)} millones`;
  }
  return `$${fmtEntero.format(Math.round(monto / 1_000))} mil`;
}

/** Formatea ingresos en SMMLV: `3,99 SMMLV`. */
export function smmlvCo(valor: number | null | undefined, conUnidad = true): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/d";
  const texto = fmt2Decimales.format(valor);
  return conUnidad ? `${texto}\u00a0SMMLV` : texto;
}

/** Formatea un porcentaje que ya viene en escala 0..100 (ej. `49.8` -> `49,8 %`). */
export function porcentajeCo(valorPct: number | null | undefined, conEspacio = true): string {
  if (valorPct === null || valorPct === undefined || !Number.isFinite(valorPct)) return "s/d";
  const sep = conEspacio ? "\u00a0" : "";
  return `${fmt1Decimal.format(valorPct)}${sep}%`;
}

/** Formatea tasas macroeconómicas (ej. `8.0` -> `8,0 %`, `12.25` -> `12,25 %`). */
export function tasaCo(valorPct: number | null | undefined, decimales = 1): string {
  if (valorPct === null || valorPct === undefined || !Number.isFinite(valorPct)) return "s/d";
  const texto = decimales === 2 ? fmt2Decimales.format(valorPct) : fmt1Decimal.format(valorPct);
  return `${texto}\u00a0%`;
}

/** Formatea enteros con separador de miles de Colombia: `14.422`. */
export function enteroCo(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/d";
  return fmtEntero.format(Math.round(valor));
}

/** Convierte nombres en MAYÚSCULAS del OLE/SNIES a formato legible en español. */
export function nombreProgramaCo(nombre: string): string {
  const limpio = (nombre || "").replace(/\s+/g, " ").trim();
  if (!limpio) return "";
  return limpio
    .split(" ")
    .map((palabra, idx) => {
      const upper = palabra.toUpperCase();
      if (SIGLAS.has(upper)) return upper;
      const lower = palabra.toLowerCase();
      if (idx > 0 && PALABRAS_MENORES.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}
