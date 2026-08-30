/**
 * First-party A/B config for course price visibility.
 *
 * Kill switch / rollout via Vercel env:
 *   NEXT_PUBLIC_EXP_PRICING_VISIBILITY=off|gate|direct|split
 *
 * Default is split 50/50. off|gate = everyone sees the lock (rollback).
 * direct = everyone sees the price (winner).
 */

export const PRICING_VISIBILITY_EXPERIMENT_ID = "pricing_visibility";

export const VID_COOKIE = "pb_vid";
export const VARIANT_COOKIE = "pb_exp_pricing";
export const QA_PARAM = "pb_exp";

/** 90 days. Sticky so a visitor does not jump arms when weights change. */
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

export type PricingVisibilityVariant = "gate" | "direct";
export type PricingVisibilityMode = "off" | "gate" | "direct" | "split";

const VARIANTS: readonly PricingVisibilityVariant[] = ["gate", "direct"];

/** Used only when mode=split and the visitor has no cookie yet. */
export const PRICING_VISIBILITY_WEIGHTS: Record<PricingVisibilityVariant, number> = {
  gate: 50,
  direct: 50,
};

export function isPricingVisibilityVariant(value: string | null | undefined): value is PricingVisibilityVariant {
  return value === "gate" || value === "direct";
}

export function getPricingVisibilityMode(): PricingVisibilityMode {
  const raw = (process.env.NEXT_PUBLIC_EXP_PRICING_VISIBILITY || "split").trim().toLowerCase();
  if (raw === "split" || raw === "gate" || raw === "direct" || raw === "off") return raw;
  return "split";
}

export function formatPricingVariant(variant: string | null | undefined): string {
  if (variant === "direct") return "Vio precio";
  if (variant === "gate") return "Candado";
  return "";
}

export function experimentCookieOptions(): {
  path: string;
  maxAge: number;
  sameSite: "lax";
  secure: boolean;
  httpOnly: boolean;
} {
  return {
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  };
}

export function forcedVariantFromMode(mode: PricingVisibilityMode): PricingVisibilityVariant | null {
  if (mode === "direct") return "direct";
  if (mode === "off" || mode === "gate") return "gate";
  return null;
}

export { VARIANTS as PRICING_VISIBILITY_VARIANTS };
