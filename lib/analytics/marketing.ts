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
import { analyticsContext } from "@/lib/analytics/context";

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

/** Params that identify a handoff (OAuth) and must not split page_view / landing_page. */
const VOLATILE_PAGE_PARAMS = ["reg_ok"] as const;
const DEBUG_STORAGE_KEY = "pb_ga_debug";
const DEBUG_FLAGS = ["debug_mode", "pb_debug", "pb_ga_debug"] as const;
/** Same window GA4 uses to start a new session. */
const GA_SESSION_TIMEOUT_MS = 30 * 60 * 1000;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    /** gtag stub + config + first page_view already queued in dataLayer. */
    __pbGa4Init?: boolean;
    /** gtag.js finished loading, so the queued page_view has been sent. */
    __pbGtagLoaded?: boolean;
    /** Last page_view sent (path + query) to avoid SPA duplicates. */
    __pbLastPageViewKey?: string;
    /** Timestamp of the last page_view, used to detect a new GA4 session. */
    __pbLastPageViewAt?: number;
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
    page_location: isBrowser() ? buildPageViewTarget().page_location : undefined,
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
  GENERATE_LEAD: "generate_lead",
  CLICK_WHATSAPP: "click_whatsapp",
  CLICK_COTIZAR_EMPRESAS: "click_cotizar_empresas",
  QUIZ_COMPLETE: "quiz_complete",
} as const;

export type GenerateLeadMethod = "form" | "oauth";

const REGISTRO_LEAD_KEY = "pb_generate_lead_registro";
const REGISTRO_LEAD_WINDOW_MS = 60_000;

function isQuietLeadPath(): boolean {
  if (!isBrowser()) return false;
  const path = window.location.pathname;
  return path === "/login" || path.startsWith("/login/") || path === "/admin" || path.startsWith("/admin/");
}

function registroLeadFiredRecently(): boolean {
  if (!isBrowser()) return false;
  try {
    const at = Number(sessionStorage.getItem(REGISTRO_LEAD_KEY));
    return Number.isFinite(at) && Date.now() - at < REGISTRO_LEAD_WINDOW_MS;
  } catch {
    return false;
  }
}

function markRegistroLeadFired(): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(REGISTRO_LEAD_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

/**
 * True only for a user Supabase just created.
 * An existing confirmed email comes back as identities: [] and role "" (no error).
 * A new email signup includes the email identity. An invited user can have a role
 * and a fresh created_at with identities stripped.
 */
export function signUpCreatedUser(user: {
  id?: string;
  role?: string | null;
  created_at?: string | null;
  identities?: unknown[] | null;
} | null | undefined): boolean {
  if (!user?.id) return false;
  if (Array.isArray(user.identities) && user.identities.length > 0) return true;
  if (Array.isArray(user.identities) && user.identities.length === 0 && !user.role) return false;
  const created = user.created_at ? Date.parse(user.created_at) : NaN;
  return Number.isFinite(created) && Date.now() - created < 120_000;
}

/** Pull /cursos/[slug] or ?curso= from a path or full URL. */
export function courseSlugFromLocation(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  let path = raw;
  let search = "";
  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      path = url.pathname;
      search = url.search;
    } catch {
      return undefined;
    }
  } else {
    const q = raw.indexOf("?");
    if (q >= 0) {
      path = raw.slice(0, q);
      search = raw.slice(q);
    }
  }
  const courseMatch = path.match(/\/cursos\/([a-z0-9-]+)/i);
  if (courseMatch?.[1]) return courseMatch[1];
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return params.get("curso") || params.get("course") || undefined;
}

function inferCourseSlug(explicit?: string | null): string | undefined {
  const given = explicit?.trim();
  if (given) return given;
  if (!isBrowser()) return undefined;
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem("pb_registration_source");
  } catch {
    stored = null;
  }
  return (
    courseSlugFromLocation(window.location.pathname + window.location.search) ||
    courseSlugFromLocation(stored)
  );
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

/**
 * Debug eligibility for GA4 hits.
 * Only outside a production build, or when the visitor asks for it with
 * ?debug_mode / ?pb_debug / ?pb_ga_debug (persisted for the tab so SPA navigation keeps it).
 * Production traffic without the flag must never receive `_dbg`/`debug_mode`.
 */
export function analyticsDebugEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  if (!isBrowser()) return false;
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of DEBUG_FLAGS) {
      const flag = params.get(key);
      if (flag !== null && flag !== "0" && flag !== "false") {
        sessionStorage.setItem(DEBUG_STORAGE_KEY, "1");
        return true;
      }
    }
    return sessionStorage.getItem(DEBUG_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Stable diagnostic field: always present ("1"/"0"), safe to filter in DebugView.
 * `debug_mode` is gtag's official flag: gtag adds the protocol-level `_dbg=1` and
 * routes the hit to the debug endpoint. It is omitted in normal production
 * traffic, so a production hit without the flag is never a debug hit.
 */
function debugHitParams(): AnalyticsParams {
  const on = analyticsDebugEnabled();
  return { pb_dbg: on ? "1" : "0", ...(on ? { debug_mode: true } : {}) };
}

/** ?pb_ga_debug=1, localhost, or a Vercel preview. Never logs on www without the flag. */
export function gaDebugEnabled(): boolean {
  if (!isBrowser()) return false;
  const host = window.location.hostname;
  if (host === "localhost" || host.endsWith(".vercel.app")) return true;
  return analyticsDebugEnabled();
}

export function gaDebug(label: string, detail?: unknown): void {
  if (!gaDebugEnabled()) return;
  console.info("[pb-ga]", label, detail ?? "");
}

/** Signup fields only. No email, password, or token. */
export function debugSignUpResult(
  scope: string,
  user: {
    id?: string;
    role?: string | null;
    created_at?: string | null;
    identities?: unknown[] | null;
  } | null | undefined,
  error?: { message?: string } | null
): void {
  gaDebug(scope, {
    error: error?.message || null,
    id: Boolean(user?.id),
    role: user?.role ?? null,
    identities: Array.isArray(user?.identities) ? user.identities.length : null,
    created_at: user?.created_at ?? null,
    created: signUpCreatedUser(user),
  });
}

/**
 * Read the GA4 client id. Never create it: gtag owns that cookie. Writing a
 * fake `_ga` here (the old behaviour) made gtag adopt a client id before its
 * first hit and produced sessions without a landing page.
 */
function readGaClientId(): string | undefined {
  try {
    const match = document.cookie.match(/(?:^|; )_ga=([^;]+)/);
    if (match) {
      const parts = decodeURIComponent(match[1]).split(".");
      const cid = parts.slice(-2).join(".");
      if (/^\d+\.\d+$/.test(cid)) return cid;
    }
  } catch {
    // ignore
  }
  return undefined;
}

function gaSessionId(): string | undefined {
  if (!GA_MEASUREMENT_ID) return undefined;
  const name = `_ga_${GA_MEASUREMENT_ID.replace(/^G-/, "")}`;
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    if (!match) return undefined;
    const value = decodeURIComponent(match[1]);
    return (value.match(/(?:^|\$|\.)s(\d{6,})/) || value.match(/^GS\d+\.\d+\.(\d{6,})/))?.[1];
  } catch {
    return undefined;
  }
}

/**
 * generate_lead is sent with sendBeacon (Measurement Protocol) because the
 * registro/OAuth redirect can abort a queued gtag hit.
 *
 * _dbg=1 is added ONLY when debug is enabled: the old code hardcoded it, so every
 * production generate_lead was a DebugView-only hit that standard GA4 reports
 * do not count. pb_dbg ("1"/"0") is always sent as a stable diagnostic field.
 *
 * Without a GA client id gtag has not run yet in this session, so a beacon now
 * would start a session whose first hit is generate_lead (landing_page = (not set)).
 * Same if gtag.js has not loaded yet: its page_view is still queued in dataLayer
 * and the beacon would reach GA first. In both cases the caller falls back to the
 * gtag event, queued after the page_view.
 */
function sendGenerateLeadBeacon(opts: {
  method: GenerateLeadMethod;
  course_slug?: string;
  page_path?: string;
}): boolean {
  if (!GA_MEASUREMENT_ID || typeof navigator.sendBeacon !== "function") return false;
  if (!window.__pbGtagLoaded) return false;
  const cid = readGaClientId();
  if (!cid) return false;
  const debug = analyticsDebugEnabled();
  const params = new URLSearchParams({
    v: "2",
    tid: GA_MEASUREMENT_ID,
    cid,
    en: GA_LEAD_EVENTS.GENERATE_LEAD,
    dl: buildPageViewTarget().page_location,
    dt: document.title,
    "ep.method": opts.method,
    "ep.page_path": opts.page_path || window.location.pathname,
    "ep.pb_dbg": debug ? "1" : "0",
  });
  if (debug) params.set("_dbg", "1");
  const sid = gaSessionId();
  if (sid) params.set("sid", sid);
  if (opts.course_slug) params.set("ep.course_slug", opts.course_slug);
  // The normal /g/collect endpoint with _dbg=1 feeds DebugView. Do NOT use
  // /debug/g/collect: that validates the payload but records nothing anywhere.
  try {
    return navigator.sendBeacon(`https://www.google-analytics.com/g/collect?${params.toString()}`);
  } catch {
    return false;
  }
}

/**
 * Marcar generate_lead como evento clave en GA4 Admin.
 * Only call after real success (signUp OK, lead insert OK, OAuth new-user redirect).
 */
export function trackGenerateLead(opts: {
  method: GenerateLeadMethod;
  course_slug?: string | null;
  page_path?: string;
}): void {
  if (!isBrowser()) return;
  // Public /registro, /referidos and marketing modals must count. Only auth walls stay quiet.
  if (isQuietLeadPath()) {
    gaDebug("generate_lead skipped", { reason: "quiet", path: window.location.pathname });
    return;
  }
  const course_slug = inferCourseSlug(opts.course_slug);
  // (b) Never let a lead be the first hit: queue the page_view before it.
  ensurePageViewBeforeHit();
  const transport = sendGenerateLeadBeacon({
    method: opts.method,
    course_slug,
    page_path: opts.page_path,
  })
    ? "beacon"
    : GA_MEASUREMENT_ID
      ? "gtag"
      : "none";
  if (transport === "gtag") {
    // debug_mode (in debugHitParams) makes gtag send _dbg=1 at protocol level;
    // the explicit param keeps the same name visible in the DebugView payload.
    // In normal production neither is present, so the hit counts in reports.
    const debug = analyticsDebugEnabled();
    trackEvent(GA_LEAD_EVENTS.GENERATE_LEAD, {
      method: opts.method,
      course_slug,
      page_path: opts.page_path,
      ...(debug ? { _dbg: 1 } : {}),
    });
  }
  gaDebug("generate_lead", {
    transport,
    method: opts.method,
    course_slug: course_slug || null,
    pb_dbg: analyticsDebugEnabled() ? "1" : "0",
  });
}

type PageViewTarget = { key: string; page_path: string; page_location: string };

/**
 * Build a full page_location (origin + path + query). `reg_ok` is a one-shot
 * OAuth flag and must not fragment the landing page.
 */
function buildPageViewTarget(rawPath?: string): PageViewTarget {
  const origin = window.location.origin;
  let pathname = window.location.pathname || "/";
  let search = window.location.search || "";
  if (rawPath) {
    const q = rawPath.indexOf("?");
    pathname = q >= 0 ? rawPath.slice(0, q) : rawPath;
    search = q >= 0 ? rawPath.slice(q) : "";
  }
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  for (const key of VOLATILE_PAGE_PARAMS) params.delete(key);
  const qs = params.toString();
  const page_path = `${pathname}${qs ? `?${qs}` : ""}`;
  return { key: page_path, page_path, page_location: `${origin}${page_path}` };
}

/** One page_view via gtag event (not config: config re-runs duplicated hits). */
function sendPageViewHit(target: PageViewTarget): void {
  if (typeof window.gtag !== "function") return;
  const { country, page_type } = analyticsContext(target.page_path);
  window.gtag("event", "page_view", {
    page_location: target.page_location,
    page_path: target.page_path,
    page_title: document.title,
    country,
    page_type,
    ...debugHitParams(),
  });
  window.__pbLastPageViewKey = target.key;
  window.__pbLastPageViewAt = Date.now();
}

/**
 * gtag stub + config + the FIRST page_view of the session, in that order.
 *
 * (b) Why landing_page was "(not set)" in ~68% of sessions:
 * config used send_page_view:false and the manual pageview was queued 50 ms
 * after mount, while mount-time events (view_curso, experiment_impression,
 * view_empresas) pushed immediately from child effects. Any of those could be
 * the first hit of a session, and GA4 only takes landing_page from the session's
 * first page_view. The SPA pageview also repeated `gtag('config', ...)` instead
 * of sending a page_view event, which can reorder/duplicate hits. Consent is not
 * the cause: this app has no consent gate in front of gtag.
 *
 * ensureGa4() is idempotent and every tracking entry point calls it, so
 * page_view is always the first command queued in dataLayer (and replayed first
 * by gtag.js), even if a component effect fires an event before this mount.
 */
function ensureGa4(): boolean {
  if (!isBrowser() || !GA_MEASUREMENT_ID) return false;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // Official snippet uses Arguments, not a rest-array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  if (window.__pbGa4Init) return true;
  window.__pbGa4Init = true;
  const debug = analyticsDebugEnabled();
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    ...(debug ? { debug_mode: true } : {}),
  });
  sendPageViewHit(buildPageViewTarget());
  return true;
}

/**
 * Guarantee the hit that opens a session (or a new SPA route) is a page_view:
 * - after 30 min of inactivity GA4 would start a new session with the event;
 * - on client navigation the child page effects can fire before this component,
 *   so the event would otherwise be the first hit of the new route.
 */
function ensurePageViewBeforeHit(): void {
  if (!ensureGa4()) return;
  const target = buildPageViewTarget();
  const sessionExpired = Date.now() - (window.__pbLastPageViewAt ?? 0) > GA_SESSION_TIMEOUT_MS;
  if (sessionExpired || window.__pbLastPageViewKey !== target.key) {
    sendPageViewHit(target);
  }
}

/** Safe to call on every client mount. */
export function initGa4(): void {
  ensureGa4();
}

/**
 * Called from next/script onLoad. gtag.js drains dataLayer in order, so after
 * this the queued js → config → page_view commands have been sent.
 */
export function markGa4Loaded(): void {
  if (!isBrowser()) return;
  window.__pbGtagLoaded = true;
}

/** gtag drops a recommended event such as generate_lead when a param is undefined. */
function definedParams(params: AnalyticsParams): AnalyticsParams {
  const out: AnalyticsParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    out[key] = value;
  }
  return out;
}

/** Send event to GA4 (gtag) and tag Clarity custom event when available. */
export function trackEvent(eventName: string, params?: AnalyticsParams): void {
  if (!isBrowser()) return;
  // Guarantees the session's first hit (and any post-30-min hit) is a page_view.
  ensurePageViewBeforeHit();
  // Country / page_type / course / guide_slug viajan en todos los eventos.
  // Lo explícito del llamador pisa el contexto (p. ej. una landing que empuja
  // a otro curso distinto del de la URL).
  const payload = definedParams({ ...analyticsContext(), ...withUtm(params), ...debugHitParams() });

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

/**
 * SPA page_view. Deduped by path + query so React re-renders, Suspense
 * remounts or the mount effect never send the same route twice.
 */
export function trackPageView(path?: string): void {
  if (!isBrowser()) return;
  if (!ensureGa4()) return;
  const target = buildPageViewTarget(path);
  if (window.__pbLastPageViewKey === target.key) return;
  sendPageViewHit(target);

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", "page_view", { page_path: target.page_path });
  }
}

export function trackCtaClick(ctaLabel: string, location: string, extra?: AnalyticsParams): void {
  trackEvent("cta_click", {
    cta_label: ctaLabel,
    location,
    ...extra,
  });
}

/** Descarga de la plantilla CSV de las landings de Power BI por país. */
export function trackPlantillaDownload(opts: {
  recurso: string;
  pais?: string;
  location?: string;
}): void {
  trackEvent("download_template", {
    recurso: opts.recurso,
    pais: opts.pais,
    location: opts.location ?? "curso_power_bi",
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

export function trackCourseView(
  courseSlug: string,
  courseTitle?: string,
  value?: number,
  pais?: string,
  currency?: string
): void {
  const country = pais || "cl";
  trackEventOnce(`view_curso:${country}:${courseSlug}`, GA_LEAD_EVENTS.VIEW_CURSO, {
    curso_slug: courseSlug,
    course_title: courseTitle,
    value: value ?? undefined,
    currency: value != null ? (currency || "CLP") : undefined,
    pais: country,
  });
  // GA4 recommended event, con los mismos datos para los informes de monetización.
  trackEventOnce(`view_item:${country}:${courseSlug}`, "view_item", {
    currency: currency || "CLP",
    value: value ?? undefined,
    items: JSON.stringify([
      {
        item_id: courseSlug,
        item_name: courseTitle || courseSlug,
        price: value ?? undefined,
        quantity: 1,
      },
    ]),
    course: courseSlug,
  });
}

export function trackCheckoutStart(opts: {
  courseSlugs: string[];
  value?: number;
  currency?: string;
  location?: string;
  pais?: string;
}): void {
  trackEvent("checkout_start", {
    course_slugs: opts.courseSlugs.join(","),
    value: opts.value,
    currency: opts.currency || "CLP",
    location: opts.location || "pago",
    pais: opts.pais || "cl",
  });
  trackEvent("begin_checkout", {
    currency: opts.currency || "CLP",
    value: opts.value ?? 0,
    course_slugs: opts.courseSlugs.join(","),
    pais: opts.pais || "cl",
  });
}

export function trackPurchase(opts?: {
  transactionId?: string;
  value?: number;
  currency?: string;
  courseSlugs?: string[];
  pais?: string;
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
    pais: opts?.pais || "cl",
  });
}

/**
 * `click_whatsapp` with the parameters requested by P6/P21:
 * course (slug), country (ISO or name) and page (current path).
 */
export function trackWhatsAppClick(opts?: {
  course?: string | null;
  country?: string | null;
  page?: string;
  cta_position?: string;
}): void {
  const page =
    opts?.page ||
    (isBrowser() ? window.location.pathname + window.location.search : undefined);
  trackEvent(GA_LEAD_EVENTS.CLICK_WHATSAPP, {
    course: opts?.course || undefined,
    country: opts?.country || undefined,
    cta_position: opts?.cta_position || undefined,
    page,
    // Keep legacy params for existing GA4 reports/explorations.
    page_path: page,
    curso_slug: opts?.course || undefined,
  });
}

export function trackQuizComplete(opts: {
  tema: string;
  nivel: string;
  pais: string;
  aciertos?: number;
  total?: number;
}): void {
  trackEvent(GA_LEAD_EVENTS.QUIZ_COMPLETE, {
    tema: opts.tema,
    nivel: opts.nivel,
    pais: opts.pais,
    aciertos: opts.aciertos,
    total: opts.total,
  });
}

export function trackViewEmpresas(): void {
  trackEvent(GA_LEAD_EVENTS.VIEW_EMPRESAS);
}

export function trackClickCtaPrimary(ctaId: string): void {
  trackEvent(GA_LEAD_EVENTS.CLICK_CTA_PRIMARY, { cta_id: ctaId });
}

export function trackClickRegistro(opts?: { cta_position?: string; course?: string | null }): void {
  trackEvent(GA_LEAD_EVENTS.CLICK_REGISTRO, {
    cta_position: opts?.cta_position || undefined,
    course: opts?.course || undefined,
  });
}

let lastSubmitRegistroAt = 0;
export function trackSubmitRegistro(opts?: {
  method?: GenerateLeadMethod;
  course_slug?: string | null;
}): void {
  const now = Date.now();
  if (now - lastSubmitRegistroAt < 2000) {
    gaDebug("trackSubmitRegistro skipped", { reason: "2s" });
    return;
  }
  lastSubmitRegistroAt = now;
  if (isQuietLeadPath()) {
    gaDebug("trackSubmitRegistro skipped", { reason: "quiet", path: window.location.pathname });
    return;
  }
  trackEvent(GA_LEAD_EVENTS.SUBMIT_REGISTRO);
  // Formulario y confirmación OAuth del mismo alta comparten sesión <60s.
  if (registroLeadFiredRecently()) {
    gaDebug("trackSubmitRegistro skipped", { reason: "dedupe-60s" });
    return;
  }
  gaDebug("trackSubmitRegistro", { method: opts?.method ?? "form", course_slug: opts?.course_slug || null });
  trackGenerateLead({
    method: opts?.method ?? "form",
    course_slug: opts?.course_slug,
  });
  markRegistroLeadFired();
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
  // Marcar generate_lead como evento clave en GA4 Admin
  trackGenerateLead({
    method: "form",
    course_slug: courseSlug,
  });
}
