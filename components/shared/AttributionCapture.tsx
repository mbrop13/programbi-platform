"use client";

import { useEffect } from "react";
import { captureAndReadAttribution } from "@/lib/utm";

/** Persiste UTM first-touch en sessionStorage en cuanto carga una página de marketing. */
export default function AttributionCapture() {
  useEffect(() => {
    captureAndReadAttribution();
  }, []);
  return null;
}
