import {
  COOKIE_MAX_AGE_SECONDS,
  VARIANT_COOKIE,
  isPricingVisibilityVariant,
  type PricingVisibilityVariant,
} from "@/lib/experiments/config";

export function readClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function writeClientCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function readClientPricingVariant(): PricingVisibilityVariant | null {
  const value = readClientCookie(VARIANT_COOKIE);
  return isPricingVisibilityVariant(value) ? value : null;
}
