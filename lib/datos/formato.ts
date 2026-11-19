const fmtEntero = new Intl.NumberFormat("es-CL", {
  useGrouping: true,
  maximumFractionDigits: 0,
});

const fmtPorcentaje = new Intl.NumberFormat("es-CL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const fmtDecimal = new Intl.NumberFormat("es-CL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const MESES_CORTOS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

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

/** Formatea pesos chilenos completos: `$2.203.057`. */
export function pesos(monto: number | null | undefined): string {
  if (monto === null || monto === undefined || !Number.isFinite(monto)) return "s/i";
  const redondeado = Math.round(monto);
  return redondeado < 0 ? `−$${fmtEntero.format(Math.abs(redondeado))}` : `$${fmtEntero.format(redondeado)}`;
}

/**
 * Formatea millones abreviados para tarjetas y títulos: `$2,2 millones` o `$950 mil`.
 * Si es < $1.000.000 devuelve `$XXX mil` (ej. `$850 mil`).
 */
export function millonesCorto(monto: number | null | undefined): string {
  if (monto === null || monto === undefined || !Number.isFinite(monto)) return "s/i";
  if (monto >= 995_000) {
    const mill = monto / 1_000_000;
    return `$${fmtDecimal.format(mill)} millones`;
  }
  return `$${fmtEntero.format(Math.round(monto / 1_000))} mil`;
}

/** Versión ultra-corta para ejes de gráficos: `$2,2M` o `$800k`. */
export function pesosEje(monto: number): string {
  if (monto >= 1_000_000) {
    const mill = monto / 1_000_000;
    const texto = Number.isInteger(mill) ? String(mill) : fmtDecimal.format(mill);
    return `$${texto}M`;
  }
  if (monto === 0) return "$0";
  return `$${Math.round(monto / 1_000)}k`;
}

/** Formatea una proporción en [0, 1] como porcentaje es-CL: `82,0 %`. */
export function porcentaje(valor: number | null | undefined, conEspacio = true): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/i";
  const sep = conEspacio ? "\u00a0" : "";
  return `${fmtPorcentaje.format(valor * 100)}${sep}%`;
}

/** Formatea un número decimal que ya está en puntos porcentuales (ej. 8.5 → `8,5 %`). */
export function cifra(valor: number): string {
  return fmtPorcentaje.format(valor);
}

export function tasa(valor: number): string {
  return `${cifra(valor)}\u00a0%`;
}

export function puntos(delta: number, conSigno = true): string {
  const absoluta = cifra(Math.abs(delta));
  const signo = conSigno && absoluta !== "0,0" ? (delta > 0 ? "+" : "−") : "";
  return `${signo}${absoluta}\u00a0pp.`;
}

/** Formatea variación relativa en porcentaje (ej. 0.028 → `+2,8 %`, -0.031 → `−3,1 %`). */
export function variacionPorcentual(ratio: number | null | undefined): string {
  if (ratio === null || ratio === undefined || !Number.isFinite(ratio)) return "s/i";
  const pct = ratio * 100;
  const abs = fmtPorcentaje.format(Math.abs(pct));
  if (abs === "0,0") return "0,0\u00a0%";
  return `${pct > 0 ? "+" : "−"}${abs}\u00a0%`;
}

export function entero(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/i";
  return fmtEntero.format(Math.round(valor));
}

export function semestres(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/i";
  const redondeado = Math.round(valor * 10) / 10;
  const texto = Number.isInteger(redondeado) ? String(redondeado) : fmtDecimal.format(redondeado);
  return `${texto} semestres`;
}

export function anosDesdeSemestres(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/i";
  const anos = valor / 2;
  const texto = Number.isInteger(anos) ? String(anos) : fmtDecimal.format(anos);
  return `${texto} años`;
}

/** `2025-09` → `sep-2025` */
export function mesCorto(ym: string): string {
  const [ano, mes] = ym.split("-").map(Number);
  if (!ano || !mes || mes < 1 || mes > 12) return ym;
  return `${MESES_CORTOS[mes - 1]}-${ano}`;
}

/** `2025-09` → `septiembre de 2025` */
export function mesLargo(ym: string): string {
  const [ano, mes] = ym.split("-").map(Number);
  if (!ano || !mes || mes < 1 || mes > 12) return ym;
  return `${MESES_LARGOS[mes - 1]} de ${ano}`;
}

/** `2026-11-19T...` → `19-11-2026` */
export function fechaCorta(fecha: string): string {
  const [ano, mes, dia] = fecha.slice(0, 10).split("-");
  return `${dia}-${mes}-${ano}`;
}

/** Normaliza texto para búsqueda y generación de slugs (minúsculas, sin tildes). */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
