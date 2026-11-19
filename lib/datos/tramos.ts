export interface TramoIngreso {
  texto: string;
  min: number;
  max: number | null;
}

const VALORES_FALTANTES = new Set(["", "s/i", "n/a", "na", "-", "—"]);

/**
 * Convierte una expresión monetaria chilena de mifuturo.cl a pesos enteros.
 * Soporta formas como "$900 mil", "$1 millón", "$1 millón 100 mil",
 * "$2 millones", "$3 millones 500 mil" o "$1.200.000".
 */
export function parseMontoTramo(fragmento: string): number {
  const limpio = fragmento.replace(/\s+/g, " ").trim();
  const soloNumero = limpio.match(/^\$\s*([\d.]+)$/);
  if (soloNumero) {
    const val = Number(soloNumero[1].replace(/\./g, ""));
    if (Number.isFinite(val) && val > 0) return val;
  }

  const conPalabras = limpio.match(
    /^\$\s*(?:(\d+)\s*mill[oó]n(?:es)?)?\s*(?:(\d+)\s*mil)?$/i
  );
  if (conPalabras && (conPalabras[1] || conPalabras[2])) {
    const millones = conPalabras[1] ? Number(conPalabras[1]) * 1_000_000 : 0;
    const miles = conPalabras[2] ? Number(conPalabras[2]) * 1_000 : 0;
    const total = millones + miles;
    if (total > 0) return total;
  }

  throw new Error(`Formato de monto de tramo no reconocido: "${fragmento}"`);
}

/**
 * Parsea un tramo de ingreso de mifuturo.cl (Archivo B).
 * Devuelve `null` para `'s/i'`, `'n/a'`, `'-'` o vacío.
 * Lanza Error si aparece un formato nuevo no reconocido.
 */
export function parseTramo(raw: string | null | undefined): TramoIngreso | null {
  const texto = (raw ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  if (VALORES_FALTANTES.has(texto.toLowerCase())) return null;

  const cerrado = texto.match(/^(?:De|Desde)\s+(.+?)\s+a\s+(.+)$/i);
  if (cerrado) {
    const min = parseMontoTramo(cerrado[1]);
    const max = parseMontoTramo(cerrado[2]);
    if (min > max) {
      throw new Error(`Tramo invertido (${min} > ${max}): "${texto}"`);
    }
    return { texto, min, max };
  }

  const sobre = texto.match(/^Sobre\s+(.+)$/i);
  if (sobre) {
    const min = parseMontoTramo(sobre[1]);
    return { texto, min, max: null };
  }

  const bajo = texto.match(/^(?:Bajo|Menor a|Menos de)\s+(.+)$/i);
  if (bajo) {
    const max = parseMontoTramo(bajo[1]);
    return { texto, min: 0, max };
  }

  throw new Error(`Formato de tramo de ingreso no reconocido: "${texto}"`);
}

/**
 * Punto medio referencial en pesos para ordenar tramos cerrados.
 * Para el tramo abierto ("Sobre $X"), devuelve `null` (va arriba al ordenar descendente).
 */
export function puntoMedioTramo(tramo: Pick<TramoIngreso, "min" | "max"> | null): number | null {
  if (!tramo) return null;
  if (tramo.max === null) return null;
  return Math.round((tramo.min + tramo.max) / 2);
}

/**
 * Comparador para ordenar tramos de ingreso de mayor a menor.
 * "Sobre $3,5 millones" queda primero; `null` (s/i) queda al final.
 */
export function compararTramosDesc(
  a: Pick<TramoIngreso, "min" | "max"> | null,
  b: Pick<TramoIngreso, "min" | "max"> | null
): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  const valA = a.max === null ? a.min + 1_000_000 : (a.min + a.max) / 2;
  const valB = b.max === null ? b.min + 1_000_000 : (b.min + b.max) / 2;
  return valB - valA;
}

/** Versión compacta para barras y tooltips: "De $1,1 a $1,2 millones" / "Sobre $3,5 millones". */
export function formatearTramoCorto(tramo: TramoIngreso | null): string {
  if (!tramo) return "Sin información suficiente";
  const fmt = (n: number) => {
    if (n >= 1_000_000) {
      const m = n / 1_000_000;
      return `$${Number.isInteger(m) ? String(m) : m.toFixed(1).replace(".", ",")}M`;
    }
    return `$${Math.round(n / 1_000)} mil`;
  };
  if (tramo.max === null) return `Sobre ${fmt(tramo.min)}`;
  return `${fmt(tramo.min)} – ${fmt(tramo.max)}`;
}
