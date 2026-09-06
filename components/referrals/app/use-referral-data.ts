"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReferralWithCommission, Referrer, ReferrerStats } from "@/lib/referrals/types";

export function useReferralData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<Referrer | null>(null);
  const [stats, setStats] = useState<ReferrerStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralWithCommission[]>([]);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/referrals/me");
    if (!res.ok) {
      setError("No se pudo cargar el panel. Si es la primera vez, ProgramBI aún debe activar la base de referidos.");
      setLoading(false);
      return;
    }
    const json = await res.json();
    setReferrer(json.referrer);
    setStats(json.stats);
    setReferrals(json.referrals);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { loading, error, referrer, stats, referrals, reload: load };
}
