/**
 * Formato de los códigos de validación de certificados.
 *
 * Los códigos reales los genera el panel de administración como
 * `PBI-<prefijo>-<aleatorio>` (por ejemplo `PBI-DATA-93K29`) y la importación
 * CSV permite escribir uno propio. Por eso la validación es deliberadamente
 * laxa: solo exige caracteres seguros para una URL y acota el largo. No se
 * inventa un prefijo obligatorio para no rechazar certificados ya emitidos.
 */

const LARGO_MINIMO = 4;
const LARGO_MAXIMO = 48;

/** Solo A-Z, 0-9 y guiones internos: nada de espacios, `/`, `%` ni `_`. */
const FORMATO = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

/** Normaliza para comparar: sin espacios accidentales y en mayúsculas. */
export function normalizarCodigoCertificado(valor: string): string {
  return valor.trim().toUpperCase();
}

export function esCodigoCertificadoValido(valor: string): boolean {
  const codigo = normalizarCodigoCertificado(valor);
  return codigo.length >= LARGO_MINIMO && codigo.length <= LARGO_MAXIMO && FORMATO.test(codigo);
}

/**
 * Acepta un código suelto o una URL pegada del certificado.
 * Devuelve siempre el código normalizado (posiblemente inválido; validar aparte).
 */
export function codigoDesdeEntrada(entrada: string): string {
  const limpio = entrada.trim();
  const enUrl = limpio.match(/\/certificado\/([^/?#\s]+)/i);
  const candidato = enUrl?.[1] ?? limpio;
  try {
    return normalizarCodigoCertificado(decodeURIComponent(candidato));
  } catch {
    // `%` mal escapado: se deja tal cual para que la validación lo rechace.
    return normalizarCodigoCertificado(candidato);
  }
}

export const AYUDA_FORMATO_CODIGO =
  "El código tiene entre 4 y 48 caracteres y usa solo letras, números y guiones. Por ejemplo: PBI-DATA-93K29.";
