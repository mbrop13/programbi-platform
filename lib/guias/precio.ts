import { ISO_CHILE } from "@/config/paises";
import { precioPublico } from "@/config/pricing";
import type { Guia } from "@/lib/guias/tipos";
import { formatMoneda } from "@/lib/paises/precios";

/**
 * Texto de respaldo para superficies sin contexto de guía (comparativas o
 * tarjetas sin país/curso), donde no se expone un monto fijo.
 */
export const TEXTO_PRECIO_BROCHURE =
  "el arancel vigente de tu país (está en el PDF de temario y precios del curso)";

/**
 * Marcadores explícitos de precio dentro del Markdown o FAQs de las guías.
 */
const MARCADOR_PRECIO = /\{\{\s*precio\s*\}\}|\{precio_local\}/gi;

/**
 * Montos de curso que quedaron escritos en el Markdown histórico. Se cubren
 * las dos formas (con y sin separador de miles) y el código de moneda que las
 * acompaña. Las cifras de sueldos u otros datos de la guía no se tocan.
 */
const MONTO_CURSO =
  /(?:\$\s?)?\b(?:169|338|349|159|319|235|236)[.,]?(?:000|900)\b(?:\s*(?:CLP|ARS|MXN|PEN|COP|UYU))?/gi;

/**
 * Combina marcadores y montos históricos en una sola pasada para no volver a
 * coincidir sobre el monto recién resuelto por `precioTextoGuia`.
 */
const TOKEN_PRECIO_GUIA = new RegExp(
  `${MARCADOR_PRECIO.source}|${MONTO_CURSO.source}`,
  "gi"
);

/**
 * Reemplaza montos históricos de curso: si recibe `guia`, usa el precio inicial
 * público de ese país/curso (`precioTextoGuia`); sin `guia`, mantiene la
 * referencia al brochure para títulos, tarjetas o comparativas.
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
 * Texto visible de precio para guías, calculado desde `config/pricing.ts`.
 * Paraguay (y cualquier curso/país sin monto público) nunca expone cifras.
 */
export function precioTextoGuia(guia: Pick<Guia, "country" | "course">): string {
  const iso = guia.country === "transversal" ? ISO_CHILE : guia.country;
  const precio = precioPublico(iso, guia.course);
  if (precio == null) {
    return "consulta el valor vigente por WhatsApp";
  }
  const monto = formatMoneda(iso, precio).replace(/\u00a0/g, " ");
  if (guia.country === "transversal") {
    return `desde ${monto} (ref. Chile; arancel por país en el PDF)`;
  }
  return `desde ${monto} (arancel detallado y descuentos en el PDF)`;
}

/**
 * Reemplaza `{{precio}}`, `{precio_local}` y montos históricos del Markdown
 * en una sola pasada usando el precio vigente de `config/pricing.ts`.
 */
export function resolverPrecios(body: string, guia: Pick<Guia, "country" | "course">): string {
  const textoPrecio = precioTextoGuia(guia);
  return body.replace(TOKEN_PRECIO_GUIA, () => textoPrecio);
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
