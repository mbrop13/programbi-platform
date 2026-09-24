"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  captureUtmFromUrl,
  initGa4,
  trackEvent,
  trackPageView,
  trackPurchase,
  trackSubmitRegistro,
  trackWhatsAppClick,
} from "@/lib/analytics/marketing";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "";
const WA_HREF_RE = /(?:wa\.me|whatsapp\.com|api\.whatsapp\.com)/i;

/**
 * Loads GA4 + Microsoft Clarity and tracks SPA page views + purchase success.
 * Safe when env IDs are missing (no scripts loaded).
 * gtag.js stays lazyOnload (after hydrate / idle); the stub + config run on mount
 * so lead events queued in dataLayer are not lost.
 */
export default function MarketingAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    initGa4();
  }, []);

  useEffect(() => {
    captureUtmFromUrl();
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!pathname) return;
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("reg_ok");
    const qs = params.toString();
    const full = qs ? `${pathname}?${qs}` : pathname;
    if (lastPathRef.current === full) return;
    lastPathRef.current = full;
    const t = setTimeout(() => trackPageView(full), 50);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  useEffect(() => {
    const payment = searchParams?.get("payment");
    if (payment === "success") {
      trackPurchase({
        transactionId: searchParams?.get("payment_id") || searchParams?.get("collection_id") || undefined,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams?.get("reg_ok") !== "1") return;
    // Google OAuth: new user only (callback sets reg_ok after session insert).
    trackSubmitRegistro({ method: "oauth" });
    const url = new URL(window.location.href);
    url.searchParams.delete("reg_ok");
    const next = url.pathname + url.search + url.hash;
    window.history.replaceState({}, "", next);
  }, [searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (anchor instanceof HTMLAnchorElement && WA_HREF_RE.test(anchor.href)) {
        trackWhatsAppClick();
      }

      const tracked = target.closest("[data-analytics-event]");
      if (!(tracked instanceof HTMLElement)) return;
      const names = (tracked.dataset.analyticsEvent || "")
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
      if (!names.length) return;
      const params: Record<string, string> = {};
      if (tracked.dataset.ctaId) params.cta_id = tracked.dataset.ctaId;
      if (tracked.dataset.cursoSlug) params.curso_slug = tracked.dataset.cursoSlug;
      for (const name of names) {
        trackEvent(name, params);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      {GA_ID ? (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="lazyOnload"
        />
      ) : null}

      {CLARITY_ID ? (
        <Script id="ms-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      ) : null}
    </>
  );
}
