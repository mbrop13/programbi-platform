/** Iniciales para el fallback de foto. No se inventan imágenes. */
export function inicialesDe(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length >= 2) {
    return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
  }
  return nombre.slice(0, 2).toUpperCase();
}
