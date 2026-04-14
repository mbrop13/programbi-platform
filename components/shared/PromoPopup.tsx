"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles, Clock, Tag, Megaphone, GraduationCap, Percent, Bell } from "lucide-react";
import { getActivePopups } from "@/lib/supabase/comunidad-ai";
import { createClient } from "@/lib/supabase/client";

interface PromoPopupData {
  id: string;
  title: string;
  description: string | null;
  cta_text: string;
  cta_url: string;
  badge_text: string | null;
  popup_type: "promo" | "course" | "discount" | "announcement";
  accent_color: string;
  image_url: string | null;
  display_delay_seconds: number;
  dismissible: boolean;
  show_once_per_session: boolean;
  show_to: "all" | "guests" | "members";
}

const typeConfig = {
  promo: { icon: Sparkles, gradient: "from-blue-600 to-indigo-600", glow: "shadow-blue-500/25" },
  course: { icon: GraduationCap, gradient: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/25" },
  discount: { icon: Percent, gradient: "from-amber-500 to-orange-600", glow: "shadow-amber-500/25" },
  announcement: { icon: Megaphone, gradient: "from-violet-600 to-purple-600", glow: "shadow-violet-500/25" },
};

export default function PromoPopup() {
  const [popups, setPopups] = useState<PromoPopupData[]>([]);
  const [visiblePopup, setVisiblePopup] = useState<PromoPopupData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    async function loadPopups() {
      try {
        // Check user auth state for targeting
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const all = await getActivePopups();

        // Filter by targeting
        const filtered = all.filter((p: PromoPopupData) => {
          if (p.show_to === "all") return true;
          if (p.show_to === "guests" && !user) return true;
          if (p.show_to === "members" && user) return true;
          return false;
        });

        // Filter by session (check sessionStorage)
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
      }
    }

    loadPopups();
  }, []);

  // Show the first popup after a delay
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

  // Auto-dismiss progress bar (12 seconds)
  useEffect(() => {
    if (!isVisible || !visiblePopup || isHovered) return;

    const AUTO_DISMISS_MS = 12000;
    const TICK = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += TICK;
      const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS_MS) * 100);
      setProgressWidth(remaining);

      if (elapsed >= AUTO_DISMISS_MS) {
        clearInterval(interval);
        handleDismiss();
      }
    }, TICK);

    return () => clearInterval(interval);
  }, [isVisible, visiblePopup, isHovered]);

  const handleDismiss = () => {
    if (visiblePopup) {
      sessionStorage.setItem(`popup_dismissed_${visiblePopup.id}`, "1");
    }
    setIsVisible(false);
    setTimeout(() => {
      setVisiblePopup(null);
      // Show next popup if available
      if (popups.length > 1) {
        const remaining = popups.slice(1);
        setPopups(remaining);
      }
    }, 400);
  };

  if (!visiblePopup) return null;

  const config = typeConfig[visiblePopup.popup_type] || typeConfig.promo;
  const TypeIcon = config.icon;
  const accentColor = visiblePopup.accent_color || "#1890FF";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 80, y: 20, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, y: 20, scale: 0.85 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          onMouseEnter={() => { setIsHovered(true); setProgressWidth(100); }}
          onMouseLeave={() => setIsHovered(false)}
          className={`fixed bottom-6 right-6 z-[99999] w-[380px] max-w-[calc(100vw-2rem)] 
            bg-white rounded-[1.4rem] overflow-hidden
            shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12),0_8px_20px_-5px_rgba(0,0,0,0.06)]
            ring-1 ring-black/[0.04]
            group`}
          style={{ 
            borderLeft: `3px solid ${accentColor}`,
          }}
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gray-100 z-20">
            <motion.div
              className="h-full rounded-full"
              style={{ 
                width: `${progressWidth}%`,
                background: `linear-gradient(90deg, ${accentColor}, ${accentColor}AA)`,
              }}
              transition={{ duration: 0.05 }}
            />
          </div>

          {/* Close button */}
          {visiblePopup.dismissible && (
            <button
              onClick={handleDismiss}
              className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-xl
                text-gray-300 hover:text-gray-600 hover:bg-gray-100
                transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="p-5">
            <div className="flex gap-4">
              {/* Icon Column */}
              <div className="shrink-0">
                <div 
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.gradient} 
                    flex items-center justify-center shadow-lg ${config.glow}
                    transform -rotate-3 group-hover:rotate-0 transition-transform duration-300`}
                >
                  <TypeIcon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-4">
                {/* Badge */}
                {visiblePopup.badge_text && (
                  <div className="mb-2">
                    <span 
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: accentColor + "15",
                        color: accentColor,
                      }}
                    >
                      <Bell className="w-2.5 h-2.5" />
                      {visiblePopup.badge_text}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h4 className="text-[15px] font-extrabold text-gray-900 leading-tight tracking-tight mb-1.5 line-clamp-2">
                  {visiblePopup.title}
                </h4>

                {/* Description */}
                {visiblePopup.description && (
                  <p className="text-[12.5px] text-gray-500 font-medium leading-relaxed mb-3.5 line-clamp-2">
                    {visiblePopup.description}
                  </p>
                )}

                {/* CTA Button */}
                <a
                  href={visiblePopup.cta_url}
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-2 text-[12.5px] font-bold 
                    py-2 px-4 rounded-xl transition-all duration-200
                    hover:gap-3 active:scale-95 no-underline group/btn"
                  style={{ 
                    backgroundColor: accentColor + "10",
                    color: accentColor,
                  }}
                >
                  {visiblePopup.cta_text || "Ver más"} 
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* Optional Image */}
            {visiblePopup.image_url && (
              <div className="mt-4 -mx-1 rounded-xl overflow-hidden border border-gray-100">
                <img 
                  src={visiblePopup.image_url} 
                  alt={visiblePopup.title}
                  className="w-full h-28 object-cover"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
