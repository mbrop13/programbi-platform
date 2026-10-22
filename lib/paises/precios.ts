import { getPais, ISO_CHILE, normalizarPais, type SlugCurso } from "@/config/paises";
import { voseoTitular } from "@/config/textos";

export const MARCA_DEFINIR_PRECIO = "[DEFINIR PRECIO]";

export function precioCurso(iso: string | null | undefined, slug: string): number | null {
  const pais = getPais(normalizarPais(iso));
  if (pais.precios === "catalogo") return null;
  const valor = pais.precios[slug as SlugCurso];
  return typeof valor === "number" && valor > 0 ? valor : null;
}

/** Precio tachado. Null en Chile: ahí lo pone el catálogo y la promo. */
export function precioLista(iso: string | null | undefined, slug: string): number | null {
  const pais = getPais(normalizarPais(iso));
  if (pais.listas === "catalogo") return null;
  const lista = pais.listas[slug as SlugCurso];
  const cobro = precioCurso(iso, slug);
  if (typeof lista !== "number" || lista <= 0 || cobro == null || lista <= cobro) return null;
  return lista;
}

export function porcentajeDescuento(lista: number, cobro: number): number {
  if (lista <= cobro) return 0;
  return Math.round(((lista - cobro) / lista) * 100);
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
  return getPais(normalizarPais(iso)).pago === "mp";
}

/** Nota junto al precio local mientras el cobro siga en la cuenta de Chile. */
export function notaCobroClp(montoClp: number): string {
  const numero = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(montoClp);
  return `Se cobra en pesos chilenos (CLP $${numero}), equivalente aprox.`;
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
  let salida = texto.replaceAll("en Chile", `en ${nombre}`).replaceAll("Chile", nombre);
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
