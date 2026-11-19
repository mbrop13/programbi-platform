"use client";

import { useEffect } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID, trackEvent } from "@/lib/analytics/marketing";

export function EmbedAnalytics({ territorio }: { territorio: string }) {
  useEffect(() => {
    let referrer_host = "";
    try { referrer_host = document.referrer ? new URL(document.referrer).hostname : ""; } catch { /* no referrer */ }
    trackEvent("datos_embed_view", { territorio, referrer_host });
  }, [territorio]);
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />;
}
