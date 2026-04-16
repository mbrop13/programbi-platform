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
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const all = await getActivePopups();

        const filtered = all.filter((p: PromoPopupData) => {
          if (p.show_to === "all") return true;
          if (p.show_to === "guests" && !user) return true;
          if (p.show_to === "members" && user) return true;
          return false;
        });

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

  useEffect(() => {
    if (!isVisible || !visiblePopup || isHovered) return;
    const AUTO_DISMISS_MS = 15000;
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
      if (popups.length > 1) {
        const remaining = popups.slice(1);
        setPopups(remaining);
      }
    }, 500);
  };

  if (!visiblePopup) return null;

  const accentColor = visiblePopup.accent_color || "#1890FF";
  const type = visiblePopup.popup_type;

  // Creative Style Selection
  const getStyle = () => {
    switch (type) {
      case 'discount':
        return {
          container: "bg-gradient-to-br from-amber-500/10 via-white to-orange-500/10 border-amber-200/50",
          iconBg: "bg-gradient-to-br from-amber-400 to-orange-600 shadow-amber-500/40",
          glow: "rgba(245, 158, 11, 0.15)",
          particleColor: "#f59e0b"
        };
      case 'promo':
        return {
          container: "bg-white/80 backdrop-blur-xl border-blue-100 shadow-[0_20px_50px_-12px_rgba(24,144,255,0.2)]",
          iconBg: "bg-gradient-to-r from-[#1890FF] to-[#00D2FF] shadow-blue-500/40",
          glow: "rgba(24, 144, 255, 0.12)",
          particleColor: "#1890FF"
        };
      case 'announcement':
        return {
          container: "bg-[#0F172A] text-white border-slate-700 shadow-[0_20px_50px_-12px_rgba(99,102,241,0.3)]",
          iconBg: "bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-violet-500/40",
          glow: "rgba(139, 92, 246, 0.2)",
          particleColor: "#8b5cf6"
        };
      default:
        return {
          container: "bg-white border-emerald-100",
          iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30",
          glow: "rgba(16, 185, 129, 0.1)",
          particleColor: "#10b981"
        };
    }
  };

  const styleSet = getStyle();

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-[9999] pointer-events-none">
          {/* Animated Glow Aura */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 blur-[60px] rounded-full"
            style={{ background: styleSet.glow, pointerEvents: 'none' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 50, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30, filter: "blur(10px)" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`pointer-events-auto relative w-[400px] max-w-[calc(100vw-4rem)] p-1 rounded-[2.5rem] ${type === 'announcement' ? 'dark' : ''}`}
            style={{ 
              background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}05)`,
              boxShadow: isHovered ? `0 40px 80px -15px ${accentColor}30` : '0 25px 60px -15px rgba(0,0,0,0.1)'
            }}
          >
            {/* Inner Content with Glassmorphism */}
            <div className={`relative overflow-hidden rounded-[2.2rem] border p-6 ${styleSet.container}`}>
              
              {/* Floating Particles Decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -40, 0],
                      x: [0, 20, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ 
                      backgroundColor: styleSet.particleColor,
                      left: `${15 + i * 15}%`,
                      top: `${70 + (i % 3) * 10}%`
                    }}
                  />
                ))}
              </div>

              {/* Dismiss Button */}
              {visiblePopup.dismissible && (
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 z-30 p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer group/close"
                >
                  <X className={`w-4 h-4 ${type === 'announcement' ? 'text-slate-400 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-900'}`} />
                </button>
              )}

              {/* Header with Icon & Badge */}
              <div className="flex items-start gap-4 relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white ${styleSet.iconBg}`}
                >
                  {type === 'discount' ? <Tag className="w-7 h-7" /> :
                   type === 'announcement' ? <Megaphone className="w-7 h-7" /> :
                   type === 'course' ? <GraduationCap className="w-7 h-7" /> :
                   <Sparkles className="w-7 h-7" />}
                </motion.div>
                
                <div className="flex-1 space-y-1">
                  {visiblePopup.badge_text && (
                    <motion.span
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="inline-block text-[10px] font-black uppercase tracking-[0.2em] mb-1 px-2 py-0.5 rounded bg-white/10"
                      style={{ color: type === 'announcement' ? '#8b5cf6' : accentColor }}
                    >
                      {visiblePopup.badge_text}
                    </motion.span>
                  )}
                  <h4 className={`text-lg font-black leading-tight tracking-tight ${type === 'announcement' ? 'text-white' : 'text-slate-900'}`}>
                    {visiblePopup.title}
                  </h4>
                </div>
              </div>

              {/* Body */}
              <div className="mt-4 relative z-10">
                <p className={`text-sm font-medium leading-relaxed ${type === 'announcement' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {visiblePopup.description}
                </p>

                {/* Optional Hero Image for the popup */}
                {visiblePopup.image_url && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 rounded-xl overflow-hidden border border-black/5 grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                  >
                    <img src={visiblePopup.image_url} alt="promo" className="w-full h-32 object-cover" />
                  </motion.div>
                )}
              </div>

              {/* Footer / CTA */}
              <div className="mt-6 flex items-center justify-between relative z-10">
                <a
                  href={visiblePopup.cta_url}
                  onClick={handleDismiss}
                  className="flex items-center gap-2 group/btn px-6 py-3 rounded-xl font-bold text-sm transition-all no-underline overflow-hidden relative"
                  style={{ backgroundColor: type === 'announcement' ? '#4f46e5' : accentColor, color: 'white' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"
                  />
                  <span>{visiblePopup.cta_text || 'Ver Oferta'}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>

                {type === 'discount' && (
                  <div className="flex items-center gap-2 text-amber-500/80">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Tiempo Limitado</span>
                  </div>
                )}
              </div>

              {/* Progress dismiss line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
                <motion.div
                  className="h-full origin-left"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: isHovered ? 1 : progressWidth / 100 }}
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
