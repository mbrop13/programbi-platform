import { ISO_CHILE, normalizarPais } from "@/config/paises";
import { precioListaPublico, precioPublico } from "@/config/pricing";
import type { Guia } from "@/lib/guias/tipos";
import { descuentoPublico, formatMoneda, porcentajeDescuento } from "@/lib/paises/precios";

/**
 * Texto de respaldo para superficies sin contexto de guía (comparativas o
 * tarjetas sin país/curso), donde no se expone un monto fijo.
 */
export const TEXTO_PRECIO_BROCHURE =
  "el arancel vigente de tu país (está en el PDF de temario y precios del curso)";

/**
 * Marcadores explícitos de precio dentro del Markdown o FAQs de las guías.
 */
const MARCADOR_PRECIO = /\{\{\s*precio(?::[^}]*)?\s*\}\}|\{precio_local\}/gi;

/**
 * Montos de curso que quedaron escritos en el Markdown histórico. Se cubren
 * las dos formas (con y sin separador de miles) y el código de moneda que las
 * acompaña. Las cifras de sueldos u otros datos de la guía no se tocan.
 */
const MONTO_CURSO =
  /(?:\$\s?)?\b(?:169|338|349|159|319|235|236)[.,]?(?:000|900)\b(?:\s*(?:CLP|ARS|MXN|PEN|COP|UYU))?/gi;

/**
 * Combina marcadores y montos históricos en una sola pasada para no volver a
 * coincidir sobre el texto recién resuelto.
 */
const TOKEN_PRECIO_GUIA = new RegExp(
  `${MARCADOR_PRECIO.source}|${MONTO_CURSO.source}`,
  "gi"
);

function resolverIsoGuia(country: string | null | undefined): string {
  return country ? normalizarPais(country) : ISO_CHILE;
}

function formatearMonedaGuia(iso: string, monto: number): string {
  return formatMoneda(iso, monto).replace(/\u00a0/g, " ");
}

/**
 * Reemplaza montos históricos de curso: si recibe `guia`, usa la etiqueta de
 * descuento vigente de ese país/curso (`precioTextoGuia`); sin `guia`, mantiene
 * la referencia al brochure para títulos, tarjetas o comparativas.
 */
export function sinMontosDeCurso(
  texto: string,
  guia?: Pick<Guia, "country" | "course">
): string {
  if (!guia) return texto.replace(MONTO_CURSO, TEXTO_PRECIO_BROCHURE);
  const textoPrecio = precioTextoGuia(guia);
  return texto.replace(MONTO_CURSO, () => textoPrecio);
}

/**
 * Meta descripción segura para SEO (<= `max` chars) y libre de montos de
 * curso en el HTML inicial. Evita que el reemplazo de montos infle el meta
 * más allá de 155 caracteres.
 */
export function metaDescripcionGuia(texto: string, max = 155): string {
  const limpia = texto
    .replace(TOKEN_PRECIO_GUIA, "arancel local vigente (ver PDF)")
    .replace(/\s+/g, " ")
    .trim();
  if (limpia.length <= max) return limpia;
  const corte = limpia.slice(0, max - 1);
  const ultimoEspacio = corte.lastIndexOf(" ");
  const base = ultimoEspacio > max * 0.65 ? corte.slice(0, ultimoEspacio) : corte;
  return `${base.replace(/[.,;:–-]+$/, "")}.`;
}

/**
 * Texto visible de descuento para el cuerpo de las guías, calculado desde
 * `config/pricing.ts` y `lib/paises/precios.ts`. No usa «Desde» ni expone
 * cifras monetarias al frente; Paraguay consulta por WhatsApp sin porcentaje.
 */
export function precioTextoGuia(guia: Pick<Guia, "country" | "course">): string {
  const targetIso = resolverIsoGuia(guia.country);
  if (targetIso === "py") {
    return "consulta el valor vigente por WhatsApp";
  }
  const pct = descuentoPublico(targetIso, guia.course);
  if (pct <= 0) {
    return "consulta los valores en el PDF de temario y precios";
  }
  return `${pct}% de descuento vigente (valor en tu moneda en el PDF)`;
}

/**
 * Reemplaza `{{precio}}`, `{precio_local}` y montos históricos del cuerpo de la
 * guía en una sola pasada usando `precioTextoGuia`.
 */
export function resolverPrecios(body: string, guia: Pick<Guia, "country" | "course">): string {
  const textoPrecio = precioTextoGuia(guia);
  return body.replace(TOKEN_PRECIO_GUIA, () => textoPrecio);
}

/**
 * Texto completo de precio para las FAQs finales de la guía y su JSON-LD
 * `FAQPage`: expone el valor vigente con descuento, el precio normal y el
 * porcentaje de descuento (sin «Desde»). Paraguay consulta por WhatsApp.
 */
export function precioTextoFaqGuia(guia: Pick<Guia, "country" | "course">): string {
  const targetIso = resolverIsoGuia(guia.country);
  if (targetIso === "py") {
    return "consulta el valor vigente por WhatsApp";
  }
  const cobro = precioPublico(targetIso, guia.course);
  if (cobro == null) {
    return "consulta los valores en el PDF de temario y precios";
  }
  const cobroTexto = formatearMonedaGuia(targetIso, cobro);
  const lista = precioListaPublico(targetIso, guia.course);
  const pct = lista != null ? porcentajeDescuento(lista, cobro) : 0;
  if (lista != null && pct > 0) {
    const listaTexto = formatearMonedaGuia(targetIso, lista);
    return `${cobroTexto} (precio normal ${listaTexto}, con ${pct}% de descuento vigente)`;
  }
  return cobroTexto;
}

/**
 * Reemplaza `{{precio}}`, `{{precio:*}}`, `{precio_local}` y montos
 * históricos en las FAQs de la guía usando `precioTextoFaqGuia`.
 */
export function resolverPreciosFaq(texto: string, guia: Pick<Guia, "country" | "course">): string {
  const textoPrecio = precioTextoFaqGuia(guia);
  return texto.replace(TOKEN_PRECIO_GUIA, () => textoPrecio);
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
