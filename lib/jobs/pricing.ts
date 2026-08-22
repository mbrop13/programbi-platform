/**
 * Planes de vacante destacada — Bolsa de Trabajo ProgramBI.
 * Ajusta los precios aquí; el flujo de pago se adapta solo.
 */
export const FEATURED_PLANS = [
  { days: 7, amount_clp: 29990, label: "7 días" },
  { days: 14, amount_clp: 49990, label: "14 días" },
  { days: 30, amount_clp: 79990, label: "30 días" },
] as const;

export type FeaturedPlanDays = (typeof FEATURED_PLANS)[number]["days"];

export function getFeaturedPlan(days: number) {
  return FEATURED_PLANS.find((p) => p.days === days) ?? null;
}

export function formatFeaturedPrice(amount: number): string {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(amount);
}
