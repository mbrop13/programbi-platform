import type { Guia } from "@/lib/guias/tipos";

/**
 * Texto que reemplaza los marcadores `{{precio}}` / `{precio_local}` del
 * Markdown de las guías. Ya no es un monto: el arancel de cada país vive solo
 * en el brochure PDF del curso, que la guía enlaza en sus CTA.
 */
export const TEXTO_PRECIO_BROCHURE =
  "el arancel vigente de tu país (está en el brochure PDF del curso)";

/**
 * Montos de curso que quedaron escritos en el Markdown histórico. Se cubren
 * las dos formas (con y sin separador de miles) y el código de moneda que las
 * acompaña. Las cifras de sueldos u otros datos de la guía no se tocan.
 */
const MONTO_CURSO =
  /(?:\$\s?)?\b(?:169|338|349|159|319|235|236)[.,]?(?:000|900)\b(?:\s*(?:CLP|ARS|MXN|PEN|COP|UYU))?/gi;

/** Devuelve el texto sin precios de curso: solo queda la referencia al brochure. */
export function sinMontosDeCurso(texto: string): string {
  return texto.replace(MONTO_CURSO, TEXTO_PRECIO_BROCHURE);
}

/** Texto de precio para las guías: siempre apunta al brochure PDF. */
export function precioTextoGuia(_guia: Pick<Guia, "country" | "course">): string {
  return TEXTO_PRECIO_BROCHURE;
}

/** Reemplaza `{{precio}}` o `{precio_local}` del Markdown por la referencia al brochure. */
export function resolverPrecios(body: string, guia: Pick<Guia, "country" | "course">): string {
  return sinMontosDeCurso(
    body.replace(/\{\{\s*precio\s*\}\}|\{precio_local\}/gi, precioTextoGuia(guia))
  );
}

/** Fecha legible y estable para el «Actualizado» visible. */
export function fechaActualizado(iso: string): string {
  const [year, month, day] = iso.split("-").map((part) => Number(part));
  if (!year || !month || !day) return iso;
  const meses = [
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
  ];
  return `${day} de ${meses[month - 1]} de ${year}`;
}
