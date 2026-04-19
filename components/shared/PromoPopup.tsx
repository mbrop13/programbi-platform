"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Zap, Clock, Shield, Users, Star, TrendingUp } from "lucide-react";
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
  custom_html: string | null;
}

/* ─── Custom HTML Renderer (Ejecuta Scripts Inyectados) ────────── */
function CustomHtmlRenderer({ html, onDismiss }: { html: string, onDismiss: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const scripts = Array.from(containerRef.current.querySelectorAll('script'));
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' || target.closest('a')) {
          onDismiss();
        }
      }}
    />
  );
}

/* ─── Floating orbs background ─────────────────────────────────── */
function FloatingOrbs({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 120 + i * 60,
            height: 120 + i * 60,
            background: `radial-gradient(circle, ${color}15, transparent 70%)`,
            left: `${10 + i * 18}%`,
            top: `${10 + (i % 3) * 25}%`,
          }}
          animate={{
            x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, -20 * (i % 2 === 0 ? -1 : 1), 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Sparkle particles ────────────────────────────────────────── */
function Sparkles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -30, -60],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Price comparator ─────────────────────────────────────────── */
function PriceDisplay({ oldPrice, newPrice, color }: { oldPrice: string; newPrice: string; color: string }) {
  return (
    <div className="flex items-end gap-4 mt-1">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="relative"
      >
        <span className="text-lg font-medium text-white/40 line-through decoration-red-400 decoration-2">
          {oldPrice}
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      >
        <span className="text-3xl font-black text-white" style={{ textShadow: `0 0 30px ${color}60` }}>
          {newPrice}
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: -5 }}
        transition={{ delay: 1, type: "spring" }}
        className="px-2 py-0.5 rounded-md text-xs font-black uppercase tracking-wider"
        style={{ backgroundColor: `${color}30`, color }}
      >
        -40%
      </motion.div>
    </div>
  );
}

/* ─── Feature pills ────────────────────────────────────────────── */
function FeaturePills() {
  const features = [
    { icon: Users, label: "+300 egresados" },
    { icon: Shield, label: "Certificación" },
    { icon: Star, label: "4.9 ★" },
    { icon: TrendingUp, label: "Alta empleabilidad" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {features.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + i * 0.1 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.08] text-white/60 text-[11px] font-semibold backdrop-blur-sm"
        >
          <f.icon className="w-3 h-3" />
          {f.label}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Main Popup ───────────────────────────────────────────────── */
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

  const color = visiblePopup.accent_color || "#1890FF";
  const isDiscount = visiblePopup.popup_type === "discount";

  // Parse prices from description if discount (format: "Antes $249.000 — ahora solo $149.400")
  let oldPrice = "$249.000";
  let newPrice = "$149.400";
  let cleanDescription = visiblePopup.description || "";
  
  if (isDiscount && visiblePopup.description) {
    const priceMatch = visiblePopup.description.match(/Antes\s+(\$[\d.]+)\s*[—-]\s*ahora\s+(?:solo\s+)?(\$[\d.]+)/i);
    if (priceMatch) {
      oldPrice = priceMatch[1];
      newPrice = priceMatch[2];
      cleanDescription = visiblePopup.description
        .replace(/Antes\s+\$[\d.]+\s*[—-]\s*ahora\s+(?:solo\s+)?\$[\d.]+\.?/i, "")
        .trim();
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={visiblePopup.dismissible ? handleDismiss : undefined}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Custom HTML Mode */}
            {visiblePopup.custom_html ? (
              <div className="relative">
                {visiblePopup.dismissible && (
                  <motion.button
                    onClick={handleDismiss}
                    className="absolute -top-3 -right-3 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                  </motion.button>
                )}
                <CustomHtmlRenderer html={visiblePopup.custom_html} onDismiss={handleDismiss} />
              </div>
            ) : (
            <>
            {/* Default Designed Card */}
            {/* Outer glow ring */}
            <div
              className="absolute -inset-1 rounded-[2rem] opacity-50 blur-xl"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}40, transparent)` }}
            />

            {/* Main card */}
            <div
              className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08]"
              style={{
                background: "linear-gradient(160deg, #0c1220 0%, #111827 40%, #0f172a 100%)",
              }}
            >
              <FloatingOrbs color={color} />
              <Sparkles color={color} />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
              />

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Close button */}
                {visiblePopup.dismissible && (
                  <motion.button
                    onClick={handleDismiss}
                    className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.06] transition-all duration-300 cursor-pointer group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                  </motion.button>
                )}

                {/* Badge */}
                {visiblePopup.badge_text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-5"
                    style={{
                      background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                      border: `1px solid ${color}30`,
                      color: color,
                    }}
                  >
                    <Zap className="w-3 h-3" />
                    {visiblePopup.badge_text}
                  </motion.div>
                )}

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight pr-8"
                >
                  {visiblePopup.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-3 text-[15px] font-medium text-white/50 leading-relaxed max-w-md"
                >
                  {cleanDescription}
                </motion.p>

                {/* Price section for discounts */}
                {isDiscount && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-5 rounded-2xl border border-white/[0.06]"
                    style={{ background: `linear-gradient(135deg, ${color}08, transparent)` }}
                  >
                    <div className="text-[11px] font-bold text-white/30 uppercase tracking-[0.15em] mb-2">
                      Precio promocional
                    </div>
                    <PriceDisplay oldPrice={oldPrice} newPrice={newPrice} color={color} />
                    <div className="flex items-center gap-2 mt-3 text-white/30">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        Oferta por tiempo limitado
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Image */}
                {visiblePopup.image_url && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-5 rounded-xl overflow-hidden border border-white/[0.06]"
                  >
                    <img
                      src={visiblePopup.image_url}
                      alt="promo"
                      className="w-full h-40 object-cover"
                    />
                  </motion.div>
                )}

                {/* Feature pills */}
                {isDiscount && <FeaturePills />}

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <a
                    href={visiblePopup.cta_url}
                    onClick={handleDismiss}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-[15px] no-underline overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                      boxShadow: `0 8px 32px ${color}40, 0 0 0 1px ${color}20 inset`,
                    }}
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    <span className="relative z-10">{visiblePopup.cta_text || "Ver Oferta"}</span>
                    <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>

                  {visiblePopup.dismissible && (
                    <button
                      onClick={handleDismiss}
                      className="text-white/30 hover:text-white/60 text-sm font-medium transition-colors cursor-pointer"
                    >
                      Ahora no, gracias
                    </button>
                  )}
                </motion.div>
              </div>

              {/* Bottom gradient accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, ${color}08, transparent)`,
                }}
              />
            </div>
            </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
