/**
 * Marketing analytics helpers (GA4 gtag — not GTM).
 * Env (public measurement ID only, never a secret):
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
 *   NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
 * See ANALYTICS.md
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

/** Lead events — exact names for GA4 DebugView / explorations. */
export const GA_LEAD_EVENTS = {
  VIEW_CURSO: "view_curso",
  VIEW_EMPRESAS: "view_empresas",
  CLICK_CTA_PRIMARY: "click_cta_primary",
  CLICK_REGISTRO: "click_registro",
  SUBMIT_REGISTRO: "submit_registro",
  CLICK_WHATSAPP: "click_whatsapp",
  CLICK_COTIZAR_EMPRESAS: "click_cotizar_empresas",
} as const;

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

/**
 * Official gtag stub: events pushed here before gtag.js loads are replayed
 * in order (js → config → events). Safe to call on every client mount.
 */
export function initGa4(): void {
  if (!isBrowser() || !GA_MEASUREMENT_ID) return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // Official snippet uses Arguments, not a rest-array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  const flagged = window as Window & { __pbGa4Init?: boolean };
  if (flagged.__pbGa4Init) return;
  flagged.__pbGa4Init = true;
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    ...(process.env.NODE_ENV === "development" ? { debug_mode: true } : {}),
  });
}

/** Send event to GA4 (gtag) and tag Clarity custom event when available. */
export function trackEvent(eventName: string, params?: AnalyticsParams): void {
  if (!isBrowser()) return;
  const payload = withUtm(params);

  try {
    if (GA_MEASUREMENT_ID && typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }
  } catch {
    // no-op
  }

  try {
    if (typeof window.clarity === "function") {
      window.clarity("event", eventName);
      const tagKeys = [
        "course_slug",
        "curso_slug",
        "cta_id",
        "cta_label",
        "location",
        "lead_type",
        "variant",
        "experiment_id",
        "page_path",
      ] as const;
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

  try {
    if (typeof window.gtag === "function" && GA_MEASUREMENT_ID) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path,
        page_location: window.location.href,
        page_title: document.title,
        send_page_view: true,
        ...(process.env.NODE_ENV === "development" ? { debug_mode: true } : {}),
      });
    }
  } catch {
    // no-op
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", "page_view", { page_path });
  }
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

const firedOnce = new Set<string>();

export function trackEventOnce(key: string, eventName: string, params?: AnalyticsParams): void {
  if (firedOnce.has(key)) return;
  firedOnce.add(key);
  trackEvent(eventName, params);
}

export function trackCourseView(courseSlug: string, courseTitle?: string, value?: number): void {
  trackEventOnce(`view_curso:${courseSlug}`, GA_LEAD_EVENTS.VIEW_CURSO, {
    curso_slug: courseSlug,
    course_title: courseTitle,
    value: value ?? undefined,
    currency: value != null ? "CLP" : undefined,
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

export function trackWhatsAppClick(location?: string, courseSlug?: string): void {
  trackEvent(GA_LEAD_EVENTS.CLICK_WHATSAPP, {
    page_path: isBrowser()
      ? window.location.pathname + window.location.search
      : location,
    curso_slug: courseSlug,
  });
}

export function trackViewEmpresas(): void {
  trackEvent(GA_LEAD_EVENTS.VIEW_EMPRESAS);
}

export function trackClickCtaPrimary(ctaId: string): void {
  trackEvent(GA_LEAD_EVENTS.CLICK_CTA_PRIMARY, { cta_id: ctaId });
}

export function trackClickRegistro(): void {
  trackEvent(GA_LEAD_EVENTS.CLICK_REGISTRO);
}

let lastSubmitRegistroAt = 0;
export function trackSubmitRegistro(): void {
  const now = Date.now();
  if (now - lastSubmitRegistroAt < 2000) return;
  lastSubmitRegistroAt = now;
  trackEvent(GA_LEAD_EVENTS.SUBMIT_REGISTRO);
}

export function trackClickCotizarEmpresas(): void {
  trackEvent(GA_LEAD_EVENTS.CLICK_COTIZAR_EMPRESAS);
}

/** Home primary CTA that also starts registration. */
export function trackHomePrimaryRegistro(ctaId: string): void {
  trackClickCtaPrimary(ctaId);
  trackClickRegistro();
}

export function trackNavRegistro(pathname?: string): void {
  trackClickRegistro();
  if (pathname === "/") {
    trackClickCtaPrimary("home_nav_registrarse");
  }
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
