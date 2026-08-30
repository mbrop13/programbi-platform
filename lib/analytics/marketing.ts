/**
 * Marketing analytics helpers (GA4 + optional custom params for Clarity/session).
 * Env:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
 *   NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
 */

import {
  PRICING_VISIBILITY_EXPERIMENT_ID,
  VARIANT_COOKIE,
  isPricingVisibilityVariant,
} from "@/lib/experiments/config";

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

const UTM_STORAGE_KEY = "pb_marketing_utm";
const PURCHASE_FIRED_KEY = "pb_purchase_tracked";
const EXP_STORAGE_KEY = "pb_exp_pricing_visibility";
const EXP_IMPRESSION_KEY = "pb_exp_pricing_impression";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

/** Persist first-touch UTM from the current URL (session). */
export function captureUtmFromUrl(): void {
  if (!isBrowser()) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    let hasAny = false;
    for (const key of UTM_KEYS) {
      const val = params.get(key);
      if (val) {
        found[key] = val;
        hasAny = true;
      }
    }
    if (!hasAny) return;

    const existingRaw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (existingRaw) {
      // Keep first-touch; only fill missing keys
      const existing = JSON.parse(existingRaw) as Record<string, string>;
      const merged = { ...found, ...existing };
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
    } else {
      sessionStorage.setItem(
        UTM_STORAGE_KEY,
        JSON.stringify({ ...found, landing_path: window.location.pathname, captured_at: new Date().toISOString() })
      );
    }
  } catch {
    // ignore storage errors
  }
}

export function getStoredUtm(): Record<string, string> {
  if (!isBrowser()) return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export function persistExperimentVariant(variant: string): void {
  if (!isBrowser() || !isPricingVisibilityVariant(variant)) return;
  try {
    sessionStorage.setItem(
      EXP_STORAGE_KEY,
      JSON.stringify({
        experiment_id: PRICING_VISIBILITY_EXPERIMENT_ID,
        variant,
      }),
    );
  } catch {
    // ignore
  }
  try {
    if (typeof window.clarity === "function") {
      window.clarity("set", "exp_pricing", variant);
    }
  } catch {
    // ignore
  }
}

function getStoredExperiment(): { experiment_id?: string; variant?: string } {
  if (!isBrowser()) return {};
  try {
    const raw = sessionStorage.getItem(EXP_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { experiment_id?: string; variant?: string };
      if (parsed?.variant) return parsed;
    }
  } catch {
    // fall through to cookie
  }
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${VARIANT_COOKIE}=([^;]*)`));
    if (!match) return {};
    const value = decodeURIComponent(match[1]);
    if (!isPricingVisibilityVariant(value)) return {};
    return { experiment_id: PRICING_VISIBILITY_EXPERIMENT_ID, variant: value };
  } catch {
    return {};
  }
}

function withUtm(params?: AnalyticsParams): AnalyticsParams {
  const utm = getStoredUtm();
  const exp = getStoredExperiment();
  return {
    ...utm,
    experiment_id: exp.experiment_id,
    variant: exp.variant,
    page_path: isBrowser() ? window.location.pathname : undefined,
    page_location: isBrowser() ? window.location.href : undefined,
    ...params,
  };
}

/** One impression per tab session, anonymous course visitors only (caller filters). */
export function trackExperimentImpression(variant: string, courseSlug?: string): void {
  if (!isBrowser() || !isPricingVisibilityVariant(variant)) return;
  try {
    if (sessionStorage.getItem(EXP_IMPRESSION_KEY)) return;
    sessionStorage.setItem(EXP_IMPRESSION_KEY, variant);
  } catch {
    // still fire
  }
  persistExperimentVariant(variant);
  trackEvent("experiment_impression", {
    experiment_id: PRICING_VISIBILITY_EXPERIMENT_ID,
    variant,
    course_slug: courseSlug,
  });
  try {
    fetch("/api/experiments/exposure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variant, course_slug: courseSlug }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}

/** Send event to GA4 (gtag) and tag Clarity custom event when available. */
export function trackEvent(eventName: string, params?: AnalyticsParams): void {
  if (!isBrowser()) return;
  const payload = withUtm(params);

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }
  } catch {
    // no-op
  }

  try {
    if (typeof window.clarity === "function") {
      window.clarity("event", eventName);
      // Optional: attach a few string tags for session filtering
      const tagKeys = ["course_slug", "cta_label", "location", "lead_type", "variant", "experiment_id"] as const;
      for (const key of tagKeys) {
        const val = payload[key];
        if (typeof val === "string" && val) {
          window.clarity("set", key, val);
        }
      }
    }
  } catch {
    // no-op
  }

  if (process.env.NODE_ENV === "development") {
    // Helpful when validating without real IDs
    // eslint-disable-next-line no-console
    console.debug("[analytics]", eventName, payload);
  }
}

export function trackPageView(path?: string): void {
  if (!isBrowser()) return;
  const page_path = path || window.location.pathname + window.location.search;
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  try {
    if (typeof window.gtag === "function" && measurementId) {
      window.gtag("config", measurementId, {
        page_path,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  } catch {
    // no-op
  }

  trackEvent("page_view", { page_path });
}

export function trackCtaClick(ctaLabel: string, location: string, extra?: AnalyticsParams): void {
  trackEvent("cta_click", {
    cta_label: ctaLabel,
    location,
    ...extra,
  });
}

export function trackCourseCardClick(courseSlug: string, location: string): void {
  trackEvent("course_card_click", {
    course_slug: courseSlug,
    location,
  });
  // GA4 select_item (simplified params for reports)
  trackEvent("select_item", {
    item_list_id: location,
    item_list_name: location,
    item_id: courseSlug,
    course_slug: courseSlug,
  });
}

export function trackCourseView(courseSlug: string, courseTitle?: string, value?: number): void {
  trackEvent("course_view", {
    course_slug: courseSlug,
    course_title: courseTitle,
    value: value ?? undefined,
    currency: value != null ? "CLP" : undefined,
  });
  trackEvent("view_item", {
    currency: "CLP",
    value: value ?? 0,
    item_id: courseSlug,
    item_name: courseTitle,
    course_slug: courseSlug,
  });
}

export function trackCheckoutStart(opts: {
  courseSlugs: string[];
  value?: number;
  currency?: string;
  location?: string;
}): void {
  trackEvent("checkout_start", {
    course_slugs: opts.courseSlugs.join(","),
    value: opts.value,
    currency: opts.currency || "CLP",
    location: opts.location || "pago",
  });
  trackEvent("begin_checkout", {
    currency: opts.currency || "CLP",
    value: opts.value ?? 0,
    course_slugs: opts.courseSlugs.join(","),
  });
}

export function trackPurchase(opts?: {
  transactionId?: string;
  value?: number;
  currency?: string;
  courseSlugs?: string[];
}): void {
  if (!isBrowser()) return;
  try {
    // Avoid double-firing on React remount / back navigation in the same session
    const key = `${PURCHASE_FIRED_KEY}:${opts?.transactionId || "default"}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // continue
  }

  trackEvent("purchase", {
    transaction_id: opts?.transactionId,
    value: opts?.value,
    currency: opts?.currency || "CLP",
    course_slugs: opts?.courseSlugs?.join(","),
  });
}

export function trackWhatsAppClick(location: string, courseSlug?: string): void {
  trackEvent("whatsapp_click", {
    location,
    course_slug: courseSlug,
  });
}

export function trackLeadSubmit(leadType: string, source?: string, courseSlug?: string): void {
  trackEvent("lead_submit", {
    lead_type: leadType,
    source,
    course_slug: courseSlug,
  });
  trackEvent("generate_lead", {
    lead_type: leadType,
    source,
    course_slug: courseSlug,
  });
}
