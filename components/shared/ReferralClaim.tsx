"use client";

import { useEffect } from "react";

const KEY = "pb_ref_claimed";

/** Si hay sesión y cookie/metadata de referido, atribuye una vez. */
export default function ReferralClaim() {
  useEffect(() => {
    let unsubscribe = () => {};
    let dropped = false;

    const claim = () => {
      if (sessionStorage.getItem(KEY)) return;
      void fetch("/api/referrals/claim", { method: "POST" })
        .then((res) => {
          if (res.ok) sessionStorage.setItem(KEY, "1");
        })
        .catch(() => {});
    };

    void import("@/lib/supabase/client").then(({ createClient }) => {
      if (dropped) return;
      const supabase = createClient();
      void supabase.auth.getSession().then(({ data }) => {
        if (data.session) claim();
      });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) claim();
      });
      unsubscribe = () => subscription.unsubscribe();
    });

    return () => {
      dropped = true;
      unsubscribe();
    };
  }, []);

  return null;
}
