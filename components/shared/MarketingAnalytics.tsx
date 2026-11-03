"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  captureUtmFromUrl,
  initGa4,
  markGa4Loaded,
  trackEvent,
  trackPageView,
  trackPurchase,
  trackSubmitRegistro,
  trackWhatsAppClick,
} from "@/lib/analytics/marketing";
import { ISO_CHILE } from "@/config/paises";
import { paisDesdeRuta } from "@/lib/paises/rutas";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "";
const WA_HREF_RE = /(?:wa\.me|whatsapp\.com|api\.whatsapp\.com)/i;

/**
 * Loads GA4 + Microsoft Clarity and tracks SPA page views + purchase success.
 * Safe when env IDs are missing (no scripts loaded).
 *
 * gtag.js loads afterInteractive so the bootstrap page_view goes out as soon as
 * possible. `initGa4()` queues stub → config(send_page_view:false) → page_view;
 * calling it from every tracking helper means page_view is always the first hit
 * even when a child component fires an event before this component mounts.
 *
 * The SPA effect only calls trackPageView(): the dedupe key lives in
 * lib/analytics/marketing.ts, so mount + route changes never duplicate page_view.
 */
export default function MarketingAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initGa4();
  }, []);

  useEffect(() => {
    captureUtmFromUrl();
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!pathname) return;
    // Pass the rendered route explicitly: window.location can lag behind the
    // router during a transition and would break the path+query dedupe key.
    const qs = searchParams?.toString() || "";
    trackPageView(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, searchParams]);

  useEffect(() => {
    const payment = searchParams?.get("payment");
    if (payment === "success") {
      trackPurchase({
        transactionId: searchParams?.get("payment_id") || searchParams?.get("collection_id") || undefined,
        pais: searchParams?.get("pais") || undefined,
        currency: searchParams?.get("moneda") || undefined,
        value: searchParams?.get("valor") ? Number(searchParams.get("valor")) : undefined,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams?.get("reg_ok") !== "1") return;
    // Remove the one-shot OAuth flag before sending the lead so page_location
    // is not split by reg_ok. The page_view effect above already strips it too.
    const url = new URL(window.location.href);
    url.searchParams.delete("reg_ok");
    const next = url.pathname + url.search + url.hash;
    window.history.replaceState({}, "", next);
    // Google OAuth: new user only (callback sets reg_ok after session insert).
    trackSubmitRegistro({ method: "oauth" });
  }, [searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (
        anchor instanceof HTMLAnchorElement &&
        WA_HREF_RE.test(anchor.href) &&
        !anchor.hasAttribute("data-wa-tracked")
      ) {
        const pathname = window.location.pathname;
        const courseMatch = pathname.match(/\/cursos\/([^/?#]+)/);
        trackWhatsAppClick({
          course: courseMatch?.[1],
          country: paisDesdeRuta(pathname) ?? ISO_CHILE,
          page: pathname + window.location.search,
        });
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
          strategy="afterInteractive"
          onLoad={() => markGa4Loaded()}
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
