"use client";

import { useEffect } from "react";
import { captureAndReadAttribution } from "@/lib/utm";
import { normalizeReferralCode, writeBrowserReferralCode } from "@/lib/referrals/cookie";

/** Persiste UTM first-touch y cookie ?ref= (90 días) en páginas de marketing. */
export default function AttributionCapture() {
  useEffect(() => {
    captureAndReadAttribution();
    const params = new URLSearchParams(window.location.search);
    const code = normalizeReferralCode(params.get("ref"));
    if (code) writeBrowserReferralCode(code);
  }, []);
  return null;
}
