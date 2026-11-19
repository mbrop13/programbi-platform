import { aplicarPisoChile, getPais, ISO_CHILE, normalizarPais, type SlugCurso } from "@/config/paises";

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
const ESTANDAR_LISTA_CLP = 249000;
const ANALISIS_LISTA_CLP = ESTANDAR_LISTA_CLP * 3;
const MERCADO_FINANCIERO_LISTA_CLP = 514000;

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

/**
 * Precio de lista (referencia normal antes de descuento) en Chile.
 * Estándar: $249.000 (32% dcto vs $169.000); Análisis de Datos / Minería:
 * $747.000 (3 cursos individuales, 55% dcto vs $338.000, misma proporción que
 * `listas()` en `config/paises.ts`); Mercado Financiero: $514.000 (32% dcto).
 */
export const PRECIOS_LISTA_CLP: Record<SlugCurso, number> = {
  "analisis-de-datos": ANALISIS_LISTA_CLP,
  copilot: ESTANDAR_LISTA_CLP,
  claude: ESTANDAR_LISTA_CLP,
  "power-automate": ESTANDAR_LISTA_CLP,
  "analitica-mineria": ANALISIS_LISTA_CLP,
  "ia-productividad": ESTANDAR_LISTA_CLP,
  "power-bi": ESTANDAR_LISTA_CLP,
  python: ESTANDAR_LISTA_CLP,
  "sql-server": ESTANDAR_LISTA_CLP,
  excel: ESTANDAR_LISTA_CLP,
  access: ESTANDAR_LISTA_CLP,
  "machine-learning": ESTANDAR_LISTA_CLP,
  "mercado-financiero": MERCADO_FINANCIERO_LISTA_CLP,
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
 * Chile: tabla CLP. Resto: tabla fija de `config/paises.ts` con piso comercial respecto de Chile.
 * `null` significa «sin precio público aprobado»:
 * la página debe mostrar «Consulta el valor por WhatsApp» y el JSON-LD no
 * debe declarar `Offer`.
 */
export function precioPublico(iso: string | null | undefined, slug: string): number | null {
  const paisIso = normalizarPais(iso);
  if (paisIso === ISO_CHILE) return precioChile(slug);
  const pais = getPais(paisIso);
  if (pais.precios === "catalogo") return null;
  const valor = pais.precios[slug as SlugCurso];
  if (typeof valor !== "number" || valor <= 0) return null;
  return aplicarPisoChile(valor, slug as SlugCurso, pais.iso, "vigente");
}

/** Precio de lista (tachado) en la moneda del país, si existe y es mayor. */
export function precioListaPublico(iso: string | null | undefined, slug: string): number | null {
  const paisIso = normalizarPais(iso);
  const cobro = precioPublico(paisIso, slug);
  if (cobro == null) return null;
  if (paisIso === ISO_CHILE) {
    if (!esCursoConPrecio(slug)) return null;
    const lista = PRECIOS_LISTA_CLP[slug];
    return Number.isFinite(lista) && lista > cobro ? lista : null;
  }
  const pais = getPais(paisIso);
  if (pais.sinDescuento || pais.listas === "catalogo") return null;
  const listaBase = pais.listas[slug as SlugCurso];
  if (typeof listaBase !== "number" || listaBase <= 0) return null;
  const lista = aplicarPisoChile(listaBase, slug as SlugCurso, pais.iso, "lista");
  return lista > cobro ? lista : null;
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
