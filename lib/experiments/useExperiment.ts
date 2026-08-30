"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  QA_PARAM,
  VARIANT_COOKIE,
  type PricingVisibilityVariant,
  getPricingVisibilityMode,
  isPricingVisibilityVariant,
  forcedVariantFromMode,
} from "@/lib/experiments/config";
import { readClientCookie, writeClientCookie } from "@/lib/experiments/cookie";
import { persistExperimentVariant } from "@/lib/analytics/marketing";

function emptySubscribe() {
  return () => {};
}

function readClientVariant(): PricingVisibilityVariant {
  const params = new URLSearchParams(window.location.search);
  const qa = params.get(QA_PARAM);
  if (isPricingVisibilityVariant(qa)) return qa;

  const forced = forcedVariantFromMode(getPricingVisibilityMode());
  if (forced) return forced;

  const fromCookie = readClientCookie(VARIANT_COOKIE);
  return isPricingVisibilityVariant(fromCookie) ? fromCookie : "gate";
}

function readServerVariant(): PricingVisibilityVariant | null {
  return null;
}

/**
 * Client island: server snapshot is null so SSR matches the auth skeleton.
 * Cookie/QA is read via useSyncExternalStore (no hydration mismatch, no setState-in-effect).
 */
export function usePricingVisibility(): {
  variant: PricingVisibilityVariant | null;
  ready: boolean;
} {
  const variant = useSyncExternalStore(emptySubscribe, readClientVariant, readServerVariant);

  useEffect(() => {
    if (!variant) return;
    persistExperimentVariant(variant);
    const qa = new URLSearchParams(window.location.search).get(QA_PARAM);
    if (isPricingVisibilityVariant(qa)) {
      writeClientCookie(VARIANT_COOKIE, qa);
    }
  }, [variant]);

  return { variant, ready: variant !== null };
}
