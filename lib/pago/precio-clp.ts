import type { CheckoutPriceOverride, CheckoutPromotion } from "@/lib/pago/catalogo";

/**
 * Precio final en CLP de un curso: override del admin, si no el catálogo,
 * y encima la promo activa. Es el monto que cobra el checkout sin cupón.
 */
export function precioDescontadoClp(
  slug: string,
  basePrice: number | undefined,
  levelName: string | undefined,
  priceOverrides: CheckoutPriceOverride[],
  promotions: CheckoutPromotion[]
): { finalPrice: number; originalPrice: number; hasDiscount: boolean } {
  if (!basePrice) return { finalPrice: 0, originalPrice: 0, hasDiscount: false };
  const override = levelName
    ? priceOverrides.find((o) => o.item_type === "course" && o.item_id === slug && o.level_name === levelName)
    : undefined;
  const effectiveBase = override?.price ?? basePrice;
  const applicablePromo = promotions.find(
    (p) =>
      p.target_type === "all" ||
      p.target_type === "courses" ||
      (p.target_type === "specific_course" && p.target_id === slug)
  );

  if (applicablePromo) {
    if (applicablePromo.promo_price) {
      return { finalPrice: applicablePromo.promo_price, originalPrice: effectiveBase, hasDiscount: true };
    }
    const ratio = (100 - (applicablePromo.discount_percentage ?? 0)) / 100;
    return {
      finalPrice: Math.round(effectiveBase * ratio),
      originalPrice: effectiveBase,
      hasDiscount: true,
    };
  }
  return { finalPrice: effectiveBase, originalPrice: effectiveBase, hasDiscount: false };
}
