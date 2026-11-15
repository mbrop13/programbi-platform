import { getPais, ISO_CHILE, normalizarPais, SLUGS_CURSO, type SlugCurso } from "@/config/paises";
import { precioListaPublico, precioPublico } from "@/config/pricing";
import { voseoTitular } from "@/config/textos";
import { localizarHoras } from "@/lib/paises/horarios";

/**
 * Nota única bajo el botón de pago. Sin montos y sin «Se cobra en CLP» junto
 * al precio: el monto que ve el usuario es el de su mercado.
 */
export const NOTA_PAGO = "Pagas con tarjeta internacional; el cargo final lo define tu banco.";
export const NOTA_PROCESA_CLP = "El cobro se procesa en pesos chilenos.";

/**
 * Precio de venta en la moneda del país, incluido Chile.
 * Es la API que deben usar la UI, el JSON-LD, las guías, `llms.txt` y el
 * checkout: sale de `config/pricing.ts`, la única fuente de verdad.
 */
export function precioVenta(iso: string | null | undefined, slug: string): number | null {
  return precioPublico(iso, slug);
}

/** Precio de lista (tachado) de la moneda del país, si existe. */
export function precioListaVenta(iso: string | null | undefined, slug: string): number | null {
  return precioListaPublico(iso, slug);
}

/** Precio local (sin Chile). Se mantiene para los consumidores históricos. */
export function precioCurso(iso: string | null | undefined, slug: string): number | null {
  const pais = getPais(normalizarPais(iso));
  if (pais.precios === "catalogo") return null;
  const valor = pais.precios[slug as SlugCurso];
  return typeof valor === "number" && valor > 0 ? valor : null;
}

/** Precio normal (tachado) del curso en la moneda del país. */
export function precioLista(iso: string | null | undefined, slug: string): number | null {
  const lista = precioListaPublico(iso, slug);
  const cobro = precioCurso(iso, slug);
  if (lista == null || cobro == null || lista <= cobro) return null;
  return lista;
}

export function porcentajeDescuento(lista: number, cobro: number): number {
  if (lista <= cobro) return 0;
  return Math.round(((lista - cobro) / lista) * 100);
}

/** Porcentaje de descuento vigente para un curso en el país (0 si no aplica). */
export function descuentoPublico(iso: string | null | undefined, slug: string): number {
  const cobro = precioPublico(iso, slug);
  const lista = precioListaPublico(iso, slug);
  if (cobro == null || lista == null || lista <= cobro) return 0;
  return porcentajeDescuento(lista, cobro);
}

/** Etiqueta de descuento para mostrar antes del PDF ("32% de descuento"), o null si no aplica. */
export function etiquetaDescuentoCurso(iso: string | null | undefined, slug: string): string | null {
  const pct = descuentoPublico(iso, slug);
  return pct > 0 ? `${pct}% de descuento` : null;
}

/** Etiqueta de descuento del catálogo ("32% a 55% de descuento"), sin usar "Desde". */
export function etiquetaDescuentoCatalogo(
  iso: string | null | undefined,
  slugs: readonly string[] = SLUGS_CURSO,
): string | null {
  const pcts = slugs.map((slug) => descuentoPublico(iso, slug)).filter((pct) => pct > 0);
  if (pcts.length === 0) return null;
  const min = Math.min(...pcts);
  const max = Math.max(...pcts);
  return min === max ? `${min}% de descuento` : `${min}% a ${max}% de descuento`;
}

export function formatMoneda(iso: string | null | undefined, monto: number): string {
  const pais = getPais(normalizarPais(iso));
  return new Intl.NumberFormat(pais.locale, {
    style: "currency",
    currency: pais.moneda,
    minimumFractionDigits: pais.decimales,
    maximumFractionDigits: pais.decimales,
  }).format(monto);
}

export function formatCLP(monto: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(monto);
}

/** Argentina, México, Perú, Colombia y Uruguay: precio propio y Mercado Pago local. */
export function muestraPrecioLocal(iso: string | null | undefined): boolean {
  return getPais(normalizarPais(iso)).precios !== "catalogo";
}

/**
 * Nota de cobro. Ya no repite el monto ni la moneda junto al precio: el
 * usuario ve el precio de su mercado y esta nota explica el cargo de tarjeta.
 * Si el checkout cobra con la cuenta de Chile, se avisa sin monto para no
 * contradecir el precio publicado.
 */
export function notaCobroClp(_montoClp?: number): string {
  return `${NOTA_PAGO} ${NOTA_PROCESA_CLP}`;
}

/**
 * Sustituye el mercado "Chile" en títulos, metas y H1.
 * En es-CL devuelve el texto igual, para no tocar la versión chilena.
 * No la uses en "Santiago de Chile".
 */
export function localizarMercado(texto: string, iso: string | null | undefined): string {
  const paisIso = normalizarPais(iso);
  if (paisIso === ISO_CHILE) return texto;
  const nombre = getPais(paisIso).nombre;
  let salida = localizarHoras(texto, paisIso)
    .replaceAll("en Chile", `en ${nombre}`)
    .replaceAll("Chile", nombre);
  if (getPais(paisIso).dispositivo === "computadora") {
    salida = salida.replace(/\bcomputador\b/gi, "computadora");
  }
  return voseoTitular(paisIso, salida);
}

export function totalLocal(
  iso: string,
  items: { slug: string; quantity: number }[]
): number | null {
  let total = 0;
  for (const item of items) {
    if (item.slug === "asesoria") return null;
    const unitario = precioCurso(iso, item.slug);
    if (unitario == null) return null;
    total += unitario * (item.quantity || 1);
  }
  return total > 0 ? total : null;
}

export type CuponLocal = { pct: number; stacking: boolean };

/**
 * Total en moneda local con cupón. La usan el checkout (servidor) y el
 * resumen de pago (cliente) para que ambos cobren con la misma fórmula.
 * Devuelve null cuando no se puede cobrar local.
 */
export function totalLocalConCupon(
  iso: string,
  items: { slug: string; quantity: number; conPromo: boolean }[],
  cupon: CuponLocal | null
): number | null {
  if (items.length === 0) return null;

  const subtotales: { subtotal: number; conPromo: boolean }[] = [];
  let total = 0;
  for (const item of items) {
    if (item.slug === "asesoria") return null;
    const unitario = precioCurso(iso, item.slug);
    if (unitario == null) return null;
    const subtotal = unitario * item.quantity;
    if (!Number.isFinite(subtotal)) return null;
    subtotales.push({ subtotal, conPromo: item.conPromo === true });
    total += subtotal;
  }

  // Sin cupón: se cobra la suma completa.
  if (cupon == null || cupon.pct <= 0) return total;

  // Con stacking el cupón se aplica sobre el total ya promocionado.
  if (cupon.stacking === true) {
    const conDescuento = Math.floor(total * (1 - cupon.pct / 100));
    return Number.isFinite(conDescuento) ? Math.max(1, conDescuento) : null;
  }

  // Sin stacking: los ítems en promo mantienen su subtotal completo.
  let resultado = 0;
  for (const { subtotal, conPromo } of subtotales) {
    resultado += conPromo ? subtotal : Math.floor(subtotal * (1 - cupon.pct / 100));
  }
  return Number.isFinite(resultado) ? Math.max(1, resultado) : null;
}
