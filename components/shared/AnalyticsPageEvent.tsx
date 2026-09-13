"use client";

import { useEffect, useRef } from "react";
import { trackEventOnce, type AnalyticsParams } from "@/lib/analytics/marketing";

/** Fires a GA4 event once on mount. No UI. */
export default function AnalyticsPageEvent({
  event,
  params,
}: {
  event: string;
  params?: AnalyticsParams;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEventOnce(`view:${event}`, event, params);
    // params is a static view payload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return null;
}
