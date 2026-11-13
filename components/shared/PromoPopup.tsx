"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { getActivePopups } from "@/lib/supabase/comunidad-ai";
import { createClient } from "@/lib/supabase/client";
import type { PromoPopupData } from "./PromoPopupView";

const PromoPopupView = dynamic(() => import("./PromoPopupView"), { ssr: false });

export default function PromoPopup() {
  const [popups, setPopups] = useState<PromoPopupData[]>([]);
  const [visiblePopup, setVisiblePopup] = useState<PromoPopupData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadPopups() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const all = await getActivePopups();

        const filtered = all.filter((p: PromoPopupData) => {
          if (p.show_to === "all") return true;
          if (p.show_to === "guests" && !user) return true;
          if (p.show_to === "members" && user) return true;
          return false;
        });

        // Solo popups activos del admin. Sin fallback de "3 clases gratis".
        const sessionFiltered = filtered.filter((p: PromoPopupData) => {
          if (p.show_once_per_session) {
            const dismissed = sessionStorage.getItem(`popup_dismissed_${p.id}`);
            return !dismissed;
          }
          return true;
        });

        setPopups(sessionFiltered);
      } catch (err) {
        console.error("Error loading popups:", err);
        setPopups([]);
      }
    }
    loadPopups();
  }, []);

  useEffect(() => {
    if (popups.length === 0) return;
    const popup = popups[0];
    const delay = (popup.display_delay_seconds || 3) * 1000;

    const timer = setTimeout(() => {
      setVisiblePopup(popup);
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [popups]);

  const handleDismiss = useCallback(() => {
    if (visiblePopup) {
      sessionStorage.setItem(`popup_dismissed_${visiblePopup.id}`, "1");
    }
    setIsVisible(false);
    setTimeout(() => {
      setVisiblePopup(null);
      if (popups.length > 1) {
        setPopups((prev) => prev.slice(1));
      }
    }, 600);
  }, [visiblePopup, popups]);

  if (!visiblePopup) return null;
  return <PromoPopupView visiblePopup={visiblePopup} isVisible={isVisible} handleDismiss={handleDismiss} />;
}
