/**
 * Flags de producto.
 *
 * Se leen de variables NEXT_PUBLIC_* para que la decisión de publicar algo sea
 * de despliegue, no de código. Por defecto, todo lo que todavía no tiene datos
 * reales queda apagado: nunca se anuncia una fecha ni cupos que no existan.
 */

function env(valor: string | undefined): string {
  return (valor || "").trim();
}

/** `/clase-gratis` se publica solo con este flag en "1". Hoy está APAGADO. */
export const CLASE_GRATIS_HABILITADA = env(process.env.NEXT_PUBLIC_CLASE_GRATIS).toLowerCase() === "1";

/** Fecha ISO (YYYY-MM-DD) de la próxima clase gratis. null = sin fecha. */
function fechaValida(valor: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;
  const fecha = new Date(`${valor}T12:00:00Z`);
  return Number.isNaN(fecha.getTime()) ? null : valor;
}

const cuposRaw = Number(env(process.env.NEXT_PUBLIC_CLASE_GRATIS_CUPOS));

/**
 * Datos de la clase gratis. Todos pueden venir de entorno para no tocar código
 * el día que Manu confirme fecha, hora y cupos.
 */
export const CLASE_GRATIS = {
  fecha: fechaValida(env(process.env.NEXT_PUBLIC_CLASE_GRATIS_FECHA)),
  cupos: Number.isFinite(cuposRaw) && cuposRaw > 0 ? Math.floor(cuposRaw) : null,
  hora: env(process.env.NEXT_PUBLIC_CLASE_GRATIS_HORA) || null,
  modalidad: "Zoom" as const,
} as const;

/**
 * ¿Ya se puede anunciar la clase? Requiere el flag encendido y una fecha real.
 * Con esto apagado, la página existe pero no muestra formulario ni promesas.
 */
export function claseGratisPublicada(): boolean {
  return CLASE_GRATIS_HABILITADA && CLASE_GRATIS.fecha != null;
}
