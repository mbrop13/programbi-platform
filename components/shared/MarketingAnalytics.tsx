"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  captureUtmFromUrl,
  trackPageView,
  trackPurchase,
} from "@/lib/analytics/marketing";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "";

/**
 * Loads GA4 + Microsoft Clarity and tracks SPA page views + purchase success.
 * Safe when env IDs are missing (no scripts loaded).
 */
export default function MarketingAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef<string>("");

  // Capture UTM on first load and when query changes
  useEffect(() => {
    captureUtmFromUrl();
  }, [pathname, searchParams]);

  // SPA page views
  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    const full = qs ? `${pathname}?${qs}` : pathname;
    if (lastPathRef.current === full) return;
    lastPathRef.current = full;
    // Small delay so document.title is updated by Next
    const t = setTimeout(() => trackPageView(full), 50);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  // Purchase conversion after MP/Flow redirect
  useEffect(() => {
    const payment = searchParams?.get("payment");
    if (payment === "success") {
      trackPurchase({
        transactionId: searchParams?.get("payment_id") || searchParams?.get("collection_id") || undefined,
      });
    }
  }, [searchParams]);

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: false });
            `}
          </Script>
        </>
      ) : null}

      {CLARITY_ID ? (
        <Script id="ms-clarity" strategy="afterInteractive">
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
