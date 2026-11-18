import { getPais, ISO_CHILE, normalizarPais, SLUGS_CURSO } from "@/config/paises";
import { precioListaPublico, precioPublico } from "@/config/pricing";
import { voseoTitular } from "@/config/textos";
import { localizarHoras } from "@/lib/paises/horarios";

/**
 * Nota única bajo el botón de pago. Sin montos y sin «Se cobra en CLP» junto
 * al precio: el monto que ve el usuario es el de su mercado.
 */
export const NOTA_PAGO = "Pagas con tarjeta internacional; el cargo final lo define tu banco.";
export const NOTA_PROCESA_CLP = "El cobro se procesa en pesos chilenos.";

export type PromocionAplicable = {
  id?: string;
  name?: string | null;
  target_type?: string | null;
  target_id?: string | null;
  discount_percentage?: number | null;
  promo_price?: number | null;
  is_active?: boolean | null;
  valid_until?: string | null;
  countries?: string[] | null;
};

export type OverridePrecio = {
  item_type?: string | null;
  item_id?: string | null;
  level_name?: string | null;
  price?: number | null;
};

export type OrigenPrecioPais =
  | "catalog"
  | "override"
  | "promotion_percentage"
  | "promotion_fixed";

export type PrecioPaisResuelto = {
  finalPrice: number;
  basePrice: number;
  listPrice: number | null;
  discountPercentage: number;
  hasPromoDiscount: boolean;
  promoName: string | null;
  promoDiscountPercentage: number;
  promoId: string | null;
  source: OrigenPrecioPais;
};

function redondearMoneda(monto: number, decimales = 0): number {
  const escala = 10 ** decimales;
  return Math.round(monto * escala) / escala;
}

export function aplicarPorcentajeDescuento(
  monto: number,
  porcentaje: number,
  decimales = 0
): number {
  const factor = Math.max(0, 1 - porcentaje / 100);
  return redondearMoneda(monto * factor, decimales);
}

function promoPrecioParaPais(
  promo: PromocionAplicable,
  baseAmount: number,
  paisIso: string,
  decimales: number
): number {
  if (paisIso === ISO_CHILE && typeof promo.promo_price === "number" && promo.promo_price > 0) {
    return Math.min(baseAmount, Math.round(promo.promo_price));
  }
  const pct = typeof promo.discount_percentage === "number" ? promo.discount_percentage : 0;
  if (pct > 0) {
    return aplicarPorcentajeDescuento(baseAmount, pct, decimales);
  }
  return baseAmount;
}

/**
 * Selecciona la promoción activa aplicable a un curso en un país.
 * Prioriza reglas específicas de curso (`specific_course`) sobre generales
 * (`courses` / `all`), y ante empate elige la que ofrece el menor precio final.
 */
export function seleccionarPromocionCurso(
  promotions: readonly PromocionAplicable[] | undefined,
  slug: string,
  iso: string | null | undefined,
  baseAmount: number,
  nowMs = Date.now()
): PromocionAplicable | null {
  if (!promotions || promotions.length === 0 || baseAmount <= 0) return null;
  const paisIso = normalizarPais(iso);
  const decimales = getPais(paisIso).decimales;

  const vigentes = promotions.filter((p) => {
    if (p.is_active === false) return false;
    if (p.valid_until) {
      const exp = new Date(p.valid_until).getTime();
      if (Number.isFinite(exp) && exp <= nowMs) return false;
    }
    if (Array.isArray(p.countries) && p.countries.length > 0 && !p.countries.includes(paisIso)) {
      return false;
    }
    return (
      p.target_type === "all" ||
      p.target_type === "courses" ||
      (p.target_type === "specific_course" && p.target_id === slug)
    );
  });

  if (vigentes.length === 0) return null;

  const especificas = vigentes.filter((p) => p.target_type === "specific_course");
  const candidatas = especificas.length > 0 ? especificas : vigentes;

  let ganadora: PromocionAplicable | null = null;
  let menorPrecio = baseAmount;
  for (const promo of candidatas) {
    const candidato = promoPrecioParaPais(promo, baseAmount, paisIso, decimales);
    if (ganadora == null || candidato < menorPrecio) {
      ganadora = promo;
      menorPrecio = candidato;
    }
  }
  return ganadora;
}

const PUBLIC_LEVEL_PRIORITY = ["Básico", "Básico-Intermedio", "Completo"];

function buscarOverrideChile(
  priceOverrides: readonly OverridePrecio[] | undefined,
  slug: string,
  levelName?: string
): OverridePrecio | undefined {
  if (!priceOverrides || priceOverrides.length === 0) return undefined;
  const delCurso = priceOverrides.filter(
    (o) => o.item_type === "course" && o.item_id === slug
  );
  if (delCurso.length === 0) return undefined;

  if (levelName) {
    const exacto = delCurso.find((o) => o.level_name === levelName);
    if (exacto) return exacto;
  }

  for (const candidate of PUBLIC_LEVEL_PRIORITY) {
    const hit = delCurso.find((o) => o.level_name === candidate);
    if (hit) return hit;
  }
  return delCurso[0];
}

/**
 * Resuelve el precio vigente de un curso en cualquier país aplicando
 * overrides de Chile (si corresponden) y promociones activas del panel admin.
 */
export function resolverPrecioCursoPais(
  iso: string | null | undefined,
  slug: string,
  promotions: readonly PromocionAplicable[] = [],
  options?: {
    priceOverrides?: readonly OverridePrecio[];
    levelName?: string;
    nowMs?: number;
  }
): PrecioPaisResuelto | null {
  const paisIso = normalizarPais(iso);
  const pais = getPais(paisIso);
  const baseSale = precioPublico(paisIso, slug);
  if (baseSale == null) return null;

  const override =
    paisIso === ISO_CHILE
      ? buscarOverrideChile(options?.priceOverrides, slug, options?.levelName)
      : undefined;
  const effectiveBase =
    typeof override?.price === "number" && override.price > 0 && override.price < baseSale
      ? override.price
      : baseSale;
  let source: OrigenPrecioPais = effectiveBase < baseSale ? "override" : "catalog";

  const promo = seleccionarPromocionCurso(
    promotions,
    slug,
    paisIso,
    effectiveBase,
    options?.nowMs
  );

  let finalPrice = effectiveBase;
  if (promo) {
    const candidato = promoPrecioParaPais(promo, effectiveBase, paisIso, pais.decimales);
    if (candidato < effectiveBase) {
      finalPrice = candidato;
      source =
        paisIso === ISO_CHILE && typeof promo.promo_price === "number" && promo.promo_price > 0
          ? "promotion_fixed"
          : "promotion_percentage";
    }
  }

  const catalogList = precioListaPublico(paisIso, slug);
  const listCandidates = [effectiveBase, catalogList ?? 0].filter(
    (amount) => amount > finalPrice
  );
  const listPrice =
    finalPrice > 0 && listCandidates.length > 0 ? Math.max(...listCandidates) : null;
  const discountPercentage = listPrice != null ? porcentajeDescuento(listPrice, finalPrice) : 0;
  const hasPromoDiscount = promo != null && finalPrice < effectiveBase;
  const promoDiscountPercentage = hasPromoDiscount
    ? Math.round(((effectiveBase - finalPrice) / effectiveBase) * 100)
    : 0;

  return {
    finalPrice,
    basePrice: effectiveBase,
    listPrice,
    discountPercentage,
    hasPromoDiscount,
    promoName: hasPromoDiscount ? (promo?.name ?? null) : null,
    promoDiscountPercentage,
    promoId: hasPromoDiscount ? (promo?.id ?? null) : null,
    source,
  };
}

/**
 * Precio de venta en la moneda del país, incluido Chile.
 * Es la API que deben usar la UI, el JSON-LD, las guías, `llms.txt` y el
 * checkout: parte de `config/pricing.ts` y aplica promociones/overrides activos.
 */
export function precioVenta(
  iso: string | null | undefined,
  slug: string,
  promotions?: readonly PromocionAplicable[],
  priceOverrides?: readonly OverridePrecio[]
): number | null {
  return (
    resolverPrecioCursoPais(iso, slug, promotions, { priceOverrides })?.finalPrice ?? null
  );
}

/** Precio de lista (tachado) de la moneda del país, si existe. */
export function precioListaVenta(
  iso: string | null | undefined,
  slug: string,
  promotions?: readonly PromocionAplicable[],
  priceOverrides?: readonly OverridePrecio[]
): number | null {
  return (
    resolverPrecioCursoPais(iso, slug, promotions, { priceOverrides })?.listPrice ?? null
  );
}

/** Precio local (sin Chile). Se mantiene para los consumidores históricos. */
export function precioCurso(
  iso: string | null | undefined,
  slug: string,
  promotions?: readonly PromocionAplicable[]
): number | null {
  const pais = getPais(normalizarPais(iso));
  if (pais.precios === "catalogo") return null;
  return resolverPrecioCursoPais(pais.iso, slug, promotions)?.finalPrice ?? null;
}

/** Precio normal (tachado) del curso en la moneda del país. */
export function precioLista(
  iso: string | null | undefined,
  slug: string,
  promotions?: readonly PromocionAplicable[]
): number | null {
  const pais = getPais(normalizarPais(iso));
  if (pais.precios === "catalogo") return null;
  return resolverPrecioCursoPais(pais.iso, slug, promotions)?.listPrice ?? null;
}

export function porcentajeDescuento(lista: number, cobro: number): number {
  if (lista <= cobro) return 0;
  return Math.round(((lista - cobro) / lista) * 100);
}

/** Porcentaje de descuento vigente para un curso en el país (0 si no aplica). */
export function descuentoPublico(
  iso: string | null | undefined,
  slug: string,
  promotions?: readonly PromocionAplicable[],
  priceOverrides?: readonly OverridePrecio[]
): number {
  return (
    resolverPrecioCursoPais(iso, slug, promotions, { priceOverrides })?.discountPercentage ?? 0
  );
}

/** Etiqueta de descuento para mostrar antes del PDF ("32% de descuento"), o null si no aplica. */
export function etiquetaDescuentoCurso(
  iso: string | null | undefined,
  slug: string,
  promotions?: readonly PromocionAplicable[],
  priceOverrides?: readonly OverridePrecio[]
): string | null {
  const pct = descuentoPublico(iso, slug, promotions, priceOverrides);
  return pct > 0 ? `${pct}% de descuento` : null;
}

/** Etiqueta de descuento del catálogo ("32% a 55% de descuento"), sin usar "Desde". */
export function etiquetaDescuentoCatalogo(
  iso: string | null | undefined,
  slugs: readonly string[] = SLUGS_CURSO,
  promotions?: readonly PromocionAplicable[],
  priceOverrides?: readonly OverridePrecio[]
): string | null {
  const pcts = slugs
    .map((slug) => descuentoPublico(iso, slug, promotions, priceOverrides))
    .filter((pct) => pct > 0);
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
  items: { slug: string; quantity: number }[],
  promotions?: readonly PromocionAplicable[]
): number | null {
  const decimales = getPais(normalizarPais(iso)).decimales;
  let total = 0;
  for (const item of items) {
    if (item.slug === "asesoria") return null;
    const unitario = precioCurso(iso, item.slug, promotions);
    if (unitario == null) return null;
    total += unitario * (item.quantity || 1);
  }
  const redondeado = redondearMoneda(total, decimales);
  return redondeado > 0 ? redondeado : null;
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
  cupon: CuponLocal | null,
  promotions?: readonly PromocionAplicable[]
): number | null {
  if (items.length === 0) return null;
  const decimales = getPais(normalizarPais(iso)).decimales;
  const escala = 10 ** decimales;
  const pisoMoneda = (valor: number) => Math.floor(valor * escala + 1e-9) / escala;

  const subtotales: { subtotal: number; conPromo: boolean }[] = [];
  let total = 0;
  for (const item of items) {
    if (item.slug === "asesoria") return null;
    const unitario = precioCurso(iso, item.slug, promotions);
    if (unitario == null) return null;
    const subtotal = redondearMoneda(unitario * item.quantity, decimales);
    if (!Number.isFinite(subtotal)) return null;
    subtotales.push({ subtotal, conPromo: item.conPromo === true });
    total = redondearMoneda(total + subtotal, decimales);
  }

  // Sin cupón: se cobra la suma completa.
  if (cupon == null || cupon.pct <= 0) return total;

  // Con stacking el cupón se aplica sobre el total ya promocionado.
  if (cupon.stacking === true) {
    const conDescuento = pisoMoneda(total * (1 - cupon.pct / 100));
    return Number.isFinite(conDescuento) ? Math.max(1 / escala, conDescuento) : null;
  }

  // Sin stacking: los ítems en promo mantienen su subtotal completo.
  let resultado = 0;
  for (const { subtotal, conPromo } of subtotales) {
    resultado += conPromo ? subtotal : pisoMoneda(subtotal * (1 - cupon.pct / 100));
  }
  resultado = redondearMoneda(resultado, decimales);
  return Number.isFinite(resultado) ? Math.max(1 / escala, resultado) : null;
}
