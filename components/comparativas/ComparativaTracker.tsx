"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/marketing";

/** GA4: `view_comparativa` { rival, country }. */
export default function ComparativaTracker({
  rival,
  country,
}: {
  rival: string;
  country: string;
}) {
  useEffect(() => {
    trackEvent("view_comparativa", { rival, country });
  }, [rival, country]);

  return null;
}
