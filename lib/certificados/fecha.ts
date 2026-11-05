/**
 * Fechas de emisión en es-CL.
 *
 * Se formatea en UTC a propósito: los CSV importan fechas sin hora
 * (`2026-07-08`), que JavaScript interpreta como medianoche UTC. Formatear en
 * America/Santiago las mostraría un día antes. UTC conserva la fecha que el
 * administrador escribió.
 */
const FORMATO_FECHA = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatearFechaEmision(valor: string | null | undefined): string | null {
  if (!valor) return null;
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;
  return FORMATO_FECHA.format(fecha);
}

export function partesFechaEmision(
  valor: string | null | undefined
): { anio: number; mes: number } | null {
  if (!valor) return null;
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;
  return { anio: fecha.getUTCFullYear(), mes: fecha.getUTCMonth() + 1 };
}
