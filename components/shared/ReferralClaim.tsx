"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const KEY = "pb_ref_claimed";

/** Si hay sesión y cookie/metadata de referido, atribuye una vez. */
export default function ReferralClaim() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;

    const supabase = createClient();
    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      void fetch("/api/referrals/claim", { method: "POST" })
        .then(() => {
          sessionStorage.setItem(KEY, "1");
        })
        .catch(() => {});
    });
  }, []);

  return null;
}
