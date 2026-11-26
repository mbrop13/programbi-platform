import { ISO_CHILE, normalizarPais } from "@/config/paises";
import type { Guia } from "@/lib/guias/tipos";
import {
  descuentoPublico,
  precioVenta,
  promocionesParaPais,
  type PromocionAplicable,
} from "@/lib/paises/precios";

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
  /(?:\$\s?)?\b(?:169|249|338|349|159|319|235|236)[.,]?(?:000|900)\b(?:\s*(?:CLP|ARS|MXN|PEN|COP|UYU))?/gi;

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
 * cifras monetarias al frente; si un país no tiene monto publicado consulta por WhatsApp.
 */
export function precioTextoGuia(
  guia: Pick<Guia, "country" | "course">,
  promotions?: readonly PromocionAplicable[]
): string {
  const targetIso = resolverIsoGuia(guia.country);
  const promosPais = promocionesParaPais(targetIso, promotions);
  if (precioVenta(targetIso, guia.course, promosPais) == null) {
    return "consulta el valor vigente por WhatsApp";
  }
  const pct = descuentoPublico(targetIso, guia.course, promosPais);
  if (pct <= 0) {
    return "consulta los valores en el PDF de temario y precios";
  }
  return `${pct}% de descuento vigente (valor en tu moneda en el PDF)`;
}

/**
 * Reemplaza `{{precio}}`, `{precio_local}` y montos históricos del cuerpo de la
 * guía en una sola pasada usando `precioTextoGuia`.
 */
export function resolverPrecios(
  body: string,
  guia: Pick<Guia, "country" | "course">,
  promotions?: readonly PromocionAplicable[]
): string {
  const textoPrecio = precioTextoGuia(guia, promotions);
  return body.replace(TOKEN_PRECIO_GUIA, () => textoPrecio);
}

/**
 * Texto de precio sin montos visibles para las FAQs finales de la guía:
 * mantiene oculto el arancel numérico en el HTML público y remite al PDF
 * de temario y precios o a WhatsApp si el país no tiene monto publicado.
 */
export function precioTextoFaqGuia(
  guia: Pick<Guia, "country" | "course">,
  promotions?: readonly PromocionAplicable[]
): string {
  const targetIso = resolverIsoGuia(guia.country);
  const promosPais = promocionesParaPais(targetIso, promotions);
  if (precioVenta(targetIso, guia.course, promosPais) == null) {
    return "consulta el valor vigente por WhatsApp";
  }
  const pct = descuentoPublico(targetIso, guia.course, promosPais);
  if (pct <= 0) {
    return "consulta los valores en el PDF de temario y precios";
  }
  return `${pct}% de descuento vigente (valor en tu moneda en el PDF de temario y precios)`;
}

/**
 * Reemplaza `{{precio}}`, `{{precio:*}}`, `{precio_local}` y montos
 * históricos en las FAQs de la guía usando `precioTextoFaqGuia`.
 */
export function resolverPreciosFaq(
  texto: string,
  guia: Pick<Guia, "country" | "course">,
  promotions?: readonly PromocionAplicable[]
): string {
  const textoPrecio = precioTextoFaqGuia(guia, promotions);
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
