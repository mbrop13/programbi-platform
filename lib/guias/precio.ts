import { formatMoneda, precioVenta } from "@/lib/paises/precios";
import type { Guia } from "@/lib/guias/tipos";

/**
 * Precio local que se inyecta en el texto de la guía (`{{precio}}`).
 * Chile, Argentina, México, Perú, Colombia y Uruguay tienen precio aprobado;
 * Paraguay todavía no, así que el texto invita a consultar por WhatsApp en vez
 * de mostrar un monto inventado.
 */
export function precioTextoGuia(guia: Pick<Guia, "country" | "course">): string {
  const precio = precioVenta(guia.country, guia.course);
  if (precio == null) return "consulta el valor por WhatsApp";
  return formatMoneda(guia.country, precio);
}

/** Reemplaza `{{precio}}` o `{precio_local}` del Markdown por el monto del mercado. */
export function resolverPrecios(body: string, guia: Pick<Guia, "country" | "course">): string {
  return body.replace(/\{\{\s*precio\s*\}\}|\{precio_local\}/gi, precioTextoGuia(guia));
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
