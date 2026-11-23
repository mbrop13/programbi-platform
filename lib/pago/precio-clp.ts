import { ISO_CHILE } from "@/config/paises";
import { esCursoConPrecio, PRECIOS_LISTA_CLP } from "@/config/pricing";
import type { CheckoutPriceOverride, CheckoutPromotion } from "@/lib/pago/catalogo";
import { aplicarPorcentajeDescuento, seleccionarPromocionCurso } from "@/lib/paises/precios";

export type OrigenPrecioClp =
  | "missing"
  | "catalog"
  | "override"
  | "promotion_percentage"
  | "promotion_fixed";

export type PrecioClpResuelto = {
  finalPrice: number;
  listPrice: number | null;
  discountPercentage: number;
  source: OrigenPrecioClp;
  /** Campos conservados para los consumidores existentes. */
  originalPrice: number;
  hasDiscount: boolean;
};

/**
 * Resuelve el precio de un curso en CLP sin depender del catálogo ni de React.
 * El descuento se calcula sobre el precio efectivo del curso después del
 * override del admin y se contrasta con la lista pública para obtener el
 * porcentaje que ve la persona.
 */
export function resolverPrecioClp(
  slug: string,
  basePrice: number | undefined,
  levelName: string | undefined,
  priceOverrides: CheckoutPriceOverride[],
  promotions: CheckoutPromotion[],
  catalogListPrice?: number
): PrecioClpResuelto {
  if (!basePrice) {
    return {
      finalPrice: 0,
      listPrice: null,
      discountPercentage: 0,
      source: "missing",
      originalPrice: 0,
      hasDiscount: false,
    };
  }

  const override = levelName
    ? priceOverrides.find((o) => o.item_type === "course" && o.item_id === slug && o.level_name === levelName)
    : undefined;
  // El precio publicado manda: el panel puede bajar el precio con un override,
  // nunca subirlo por sobre lo que la ficha y el JSON-LD declaran.
  const effectiveBase =
    typeof override?.price === "number" && override.price > 0 && override.price < basePrice
      ? override.price
      : basePrice;
  const baseSource: OrigenPrecioClp = effectiveBase < basePrice ? "override" : "catalog";
  const applicablePromo = seleccionarPromocionCurso(promotions, slug, ISO_CHILE, effectiveBase);

  let finalPrice = effectiveBase;
  let source: OrigenPrecioClp = baseSource;
  let hasDiscount = false;

  if (applicablePromo?.promo_price && applicablePromo.promo_price > 0) {
    finalPrice = Math.min(effectiveBase, Math.round(applicablePromo.promo_price));
    source = "promotion_fixed";
    hasDiscount = finalPrice < effectiveBase;
  } else if (applicablePromo && (applicablePromo.discount_percentage ?? 0) > 0) {
    finalPrice = aplicarPorcentajeDescuento(effectiveBase, applicablePromo.discount_percentage ?? 0, 0);
    source = "promotion_percentage";
    hasDiscount = finalPrice < effectiveBase;
  }

  const resolvedCatalogListPrice =
    catalogListPrice !== undefined
      ? catalogListPrice
      : esCursoConPrecio(slug)
        ? PRECIOS_LISTA_CLP[slug]
        : 0;
  const listCandidates = [effectiveBase, resolvedCatalogListPrice].filter(
    (amount) => amount > finalPrice
  );
  const listPrice = finalPrice > 0 && listCandidates.length > 0
    ? Math.max(...listCandidates)
    : null;
  const discountPercentage = listPrice
    ? Math.round(((listPrice - finalPrice) / listPrice) * 100)
    : 0;

  return {
    finalPrice,
    listPrice,
    discountPercentage,
    source,
    originalPrice: effectiveBase,
    hasDiscount,
  };
}

/**
 * Contrato legado utilizado por checkout, cotizaciones y fichas.
 * Conserva exactamente la forma anterior mientras el nuevo resolutor
 * expone la lista y el porcentaje por separado.
 */
export function precioDescontadoClp(
  slug: string,
  basePrice: number | undefined,
  levelName: string | undefined,
  priceOverrides: CheckoutPriceOverride[],
  promotions: CheckoutPromotion[]
): { finalPrice: number; originalPrice: number; hasDiscount: boolean } {
  const { finalPrice, originalPrice, hasDiscount } = resolverPrecioClp(
    slug,
    basePrice,
    levelName,
    priceOverrides,
    promotions
  );

  return { finalPrice, originalPrice, hasDiscount };
}
