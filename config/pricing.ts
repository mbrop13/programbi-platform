import { getPais, ISO_CHILE, normalizarPais, type SlugCurso } from "@/config/paises";

/**
 * Fuente única de verdad de precios de venta.
 *
 * Todo lo que muestra, declara o cobra un precio lee de aquí:
 * fichas, tarjetas, niveles del catálogo (`lib/data/courses.ts`), JSON-LD
 * `Offer`, landings, guías, `llms.txt` y el checkout.
 *
 * Los países con tabla local (`config/paises.ts`) mantienen su monto fijo en su
 * moneda. Chile no usa tabla local: su precio vive en `PRECIOS_CLP`.
 */

/**
 * Fecha fija de entrada en vigencia de la lista de precios.
 * No se regenera en cada request: Google necesita un `validFrom` estable.
 */
export const PRECIOS_VALID_FROM = "2026-11-01T00:00:00-03:00";

/**
 * Precio de venta en Chile, en pesos, por curso.
 * Un curso estándar vale 169.000; Análisis de datos 338.000 y Mercado
 * financiero 349.000. «Análisis de datos para la Minería» es el mismo curso
 * que Análisis de datos, así que comparte su monto. Es el monto que ve el
 * usuario, el que declara el JSON-LD y la base del checkout.
 */
const ANALISIS_DE_DATOS_CLP = 338000;

export const PRECIOS_CLP: Record<SlugCurso, number> = {
  "analisis-de-datos": ANALISIS_DE_DATOS_CLP,
  copilot: 169000,
  claude: 169000,
  "power-automate": 169000,
  // Mismo curso y mismo valor que Análisis de datos.
  "analitica-mineria": ANALISIS_DE_DATOS_CLP,
  "ia-productividad": 169000,
  "power-bi": 169000,
  python: 169000,
  "sql-server": 169000,
  excel: 169000,
  access: 169000,
  "machine-learning": 169000,
  "mercado-financiero": 349000,
};

/** Cursos con precio publicado. */
export function esCursoConPrecio(slug: string): slug is SlugCurso {
  return Object.prototype.hasOwnProperty.call(PRECIOS_CLP, slug);
}

/** Precio de venta en Chile. `null` si el slug no es un curso del catálogo. */
export function precioChile(slug: string): number | null {
  if (!esCursoConPrecio(slug)) return null;
  const valor = PRECIOS_CLP[slug];
  return Number.isFinite(valor) && valor > 0 ? valor : null;
}

/**
 * Precio de venta en la moneda del país.
 * Chile: tabla CLP. Resto: tabla fija de `config/paises.ts`.
 * `null` significa «sin precio público aprobado» (hoy solo Paraguay):
 * la página debe mostrar «Consulta el valor por WhatsApp» y el JSON-LD no
 * debe declarar `Offer`.
 */
export function precioPublico(iso: string | null | undefined, slug: string): number | null {
  const paisIso = normalizarPais(iso);
  if (paisIso === ISO_CHILE) return precioChile(slug);
  const pais = getPais(paisIso);
  if (pais.precios === "catalogo") return null;
  const valor = pais.precios[slug as SlugCurso];
  return typeof valor === "number" && valor > 0 ? valor : null;
}

/** Precio de lista (tachado) en la moneda del país, si existe y es mayor. */
export function precioListaPublico(iso: string | null | undefined, slug: string): number | null {
  const paisIso = normalizarPais(iso);
  if (paisIso === ISO_CHILE) return null;
  const pais = getPais(paisIso);
  if (pais.listas === "catalogo") return null;
  const lista = pais.listas[slug as SlugCurso];
  const cobro = precioPublico(paisIso, slug);
  if (typeof lista !== "number" || lista <= 0 || cobro == null || lista <= cobro) return null;
  return lista;
}

/** Moneda en que se publica el precio de ese mercado. */
export function monedaPublica(iso: string | null | undefined): string {
  return getPais(normalizarPais(iso)).moneda;
}

/** ¿El país tiene un precio publicado? Hoy Paraguay queda pendiente de Manu. */
export function tienePrecioPublico(iso: string | null | undefined): boolean {
  const paisIso = normalizarPais(iso);
  return Object.keys(PRECIOS_CLP).some((slug) => precioPublico(paisIso, slug) != null);
}
