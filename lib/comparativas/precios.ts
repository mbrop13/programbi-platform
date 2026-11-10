/**
 * Texto de comparativas sin el precio propio.
 *
 * Las páginas de comparación (`/versus/*`, listicles de cursos) sí publican los
 * precios de terceros, que son dato citado de cada academia. El arancel de
 * ProgramBI, en cambio, vive solo en el brochure PDF del curso: acá se
 * reemplaza cualquier monto propio por la referencia al brochure.
 */
const MONTO = /(?:\$\s?\d[\d.,]*|\b\d{1,3}(?:\.\d{3})+\s?(?:CLP|ARS|MXN|PEN|COP|UYU|USD)\b)/g;

export const TEXTO_PRECIO_PROGRAMBI = "en el PDF de temario y precios";

export function sinMontosProgrambi(texto: string): string {
  if (!texto) return texto;
  return texto.replace(MONTO, TEXTO_PRECIO_PROGRAMBI).replace(/\s{2,}/g, " ").trim();
}
