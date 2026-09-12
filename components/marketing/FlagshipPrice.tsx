"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

/** Authenticated-only price line. Do not change the amount. */
export default function FlagshipPrice() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !isAuthenticated) return null;
  return <p className="mt-4 text-sm font-medium text-ink">Desde $299.000 CLP el nivel básico.</p>;
}
