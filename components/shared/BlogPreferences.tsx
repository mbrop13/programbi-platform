"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Type, Sliders, Sun, Moon, Eye } from "lucide-react";

export interface BlogPrefs {
  fontFamily: "serif" | "sans" | "mono";
  fontSize: "sm" | "base" | "lg" | "xl";
  theme: "light" | "sepia" | "dark";
  lineHeight: "normal" | "relaxed" | "loose";
}

export const defaultPrefs: BlogPrefs = {
  fontFamily: "serif",
  fontSize: "base",
  theme: "light",
  lineHeight: "relaxed",
};

interface BlogPreferencesProps {
  isOpen: boolean;
  onClose: () => void;
  prefs: BlogPrefs;
  onChange: (newPrefs: BlogPrefs) => void;
}

export default function BlogPreferences({ isOpen, onClose, prefs, onChange }: BlogPreferencesProps) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updatePref = <K extends keyof BlogPrefs>(key: K, value: BlogPrefs[K]) => {
    const updated = { ...prefs, [key]: value };
    onChange(updated);
    localStorage.setItem("programbi-blog-prefs", JSON.stringify(updated));
  };

  // Dynamic theme class definitions to match preferences in real-time
  const themeClasses = {
    light: {
      bg: "bg-white border-slate-200/80 shadow-slate-900/10",
      text: "text-slate-900",
      headerBg: "bg-slate-50/80 border-slate-100",
      headerText: "text-slate-800",
      label: "text-slate-400",
      buttonActive: "bg-slate-950 border-slate-950 text-white shadow-md shadow-slate-950/10",
      buttonInactive: "bg-white border-slate-200 text-slate-600 hover:bg-slate-50/80 hover:border-slate-300",
      closeBtn: "bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50",
      divider: "border-slate-100",
      doneBtn: "bg-slate-950 text-white hover:bg-slate-900 shadow-md shadow-slate-950/10"
    },
    sepia: {
      bg: "bg-[#F4ECD8] border-[#E6D8B8]/80 shadow-[#5B4636]/10",
      text: "text-[#5B4636]",
      headerBg: "bg-[#ECE2C6]/80 border-[#DECFA9]",
      headerText: "text-[#5B4636] font-bold",
      label: "text-[#8C6D53]",
      buttonActive: "bg-[#5B4636] border-[#5B4636] text-[#F4ECD8] shadow-md shadow-[#5B4636]/10",
      buttonInactive: "bg-[#FDFBF7] border-[#DECFA9] text-[#5B4636] hover:bg-[#F9F5EA] hover:border-[#DECFA9]",
      closeBtn: "bg-[#FDFBF7] border-[#DECFA9] text-[#8C6D53] hover:text-[#5B4636] hover:bg-[#F9F5EA]",
      divider: "border-[#DECFA9]/50",
      doneBtn: "bg-[#5B4636] text-[#F4ECD8] hover:bg-[#4A382A] shadow-md shadow-[#5B4636]/10"
    },
    dark: {
      bg: "bg-slate-950 border-slate-800/80 shadow-black/40",
      text: "text-slate-100",
      headerBg: "bg-slate-900/60 border-slate-800",
      headerText: "text-slate-200",
      label: "text-slate-500",
      buttonActive: "bg-white border-white text-slate-950 shadow-md shadow-white/5",
      buttonInactive: "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900/80 hover:border-slate-700",
      closeBtn: "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800",
      divider: "border-slate-800",
      doneBtn: "bg-white text-slate-950 hover:bg-slate-100 shadow-md shadow-white/5"
    }
  }[prefs.theme];

  const modalVariants = {
    initial: isMobile 
      ? { y: "120%", x: "-50%", opacity: 0 } 
      : { y: "-40%", x: "-50%", opacity: 0 },
    animate: isMobile 
      ? { y: 0, x: "-50%", opacity: 1 } 
      : { y: "-50%", x: "-50%", opacity: 1 },
    exit: isMobile 
      ? { y: "120%", x: "-50%", opacity: 0 } 
      : { y: "-40%", x: "-50%", opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[10000]"
          />

          {/* Settings Container (Floating Card on Mobile, Modal on Desktop) */}
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className={`fixed z-[10001] w-[92%] md:w-full md:max-w-md ${
              isMobile ? "bottom-6 left-1/2" : "top-1/2 left-1/2"
            } ${themeClasses.bg} border shadow-2xl rounded-3xl overflow-hidden max-h-[80vh] md:max-h-[90vh] flex flex-col`}
          >
            {/* Grab handle / drag notch (Mobile only) */}
            {isMobile && (
              <div className="flex justify-center pt-2.5">
                <div className={`w-12 h-1.5 rounded-full ${
                  prefs.theme === "dark" 
                    ? "bg-slate-800" 
                    : prefs.theme === "sepia" 
                    ? "bg-[#DECFA9]" 
                    : "bg-slate-200"
                }`} />
              </div>
            )}

            {/* Header */}
            <div className={`px-5 py-3.5 border-b ${themeClasses.divider} flex items-center justify-between ${themeClasses.headerBg}`}>
              <div className="flex items-center gap-2">
                <Sliders className={`w-4 h-4 ${themeClasses.headerText}`} />
                <span className={`font-serif font-bold text-xs uppercase tracking-wider ${themeClasses.headerText}`}>
                  Ajustes de Lectura
                </span>
              </div>
              <button
                onClick={onClose}
                className={`w-7.5 h-7.5 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${themeClasses.closeBtn}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className={`flex-1 overflow-y-auto px-5 py-5 space-y-5 ${themeClasses.text} scrollbar-thin`}>
              {/* Font Family */}
              <div>
                <label className={`block text-[9px] font-bold uppercase tracking-widest mb-2.5 ${themeClasses.label}`}>
                  Tipografía
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["serif", "sans", "mono"] as const).map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => updatePref("fontFamily", font)}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        prefs.fontFamily === font
                          ? themeClasses.buttonActive
                          : themeClasses.buttonInactive
                      }`}
                    >
                      {font === "serif" ? (
                        <span className="font-serif">Serif</span>
                      ) : font === "mono" ? (
                        <span className="font-mono">Mono</span>
                      ) : (
                        <span className="font-sans">Sans</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className={`block text-[9px] font-bold uppercase tracking-widest mb-2.5 ${themeClasses.label}`}>
                  Tamaño de Letra
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["sm", "base", "lg", "xl"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updatePref("fontSize", size)}
                      className={`px-1.5 py-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        prefs.fontSize === size
                          ? themeClasses.buttonActive
                          : themeClasses.buttonInactive
                      }`}
                    >
                      <Type className={`w-3 h-3 mb-1 ${
                        size === "sm" ? "scale-90" : size === "base" ? "scale-100" : size === "lg" ? "scale-110" : "scale-125"
                      }`} />
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-tight">
                        {size === "sm" ? "Chico" : size === "base" ? "Normal" : size === "lg" ? "Grande" : "Súper"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme / Contrast */}
              <div>
                <label className={`block text-[9px] font-bold uppercase tracking-widest mb-2.5 ${themeClasses.label}`}>
                  Tema / Contraste
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["light", "sepia", "dark"] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => updatePref("theme", theme)}
                      className={`px-2 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        prefs.theme === theme
                          ? "border-[#1890FF] ring-2 ring-[#1890FF]/20"
                          : prefs.theme === "dark" 
                          ? "border-slate-800" 
                          : "border-slate-200"
                      } ${
                        theme === "light"
                          ? "bg-white text-slate-950"
                          : theme === "sepia"
                          ? "bg-[#F4ECD8] text-[#5B4636]"
                          : "bg-slate-900 text-slate-200"
                      }`}
                    >
                      {theme === "light" ? (
                        <>
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-[10px] sm:text-xs">Claro</span>
                        </>
                      ) : theme === "sepia" ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-[#8C6D53]" />
                          <span className="text-[10px] sm:text-xs">Sepia</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-[10px] sm:text-xs">Oscuro</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div>
                <label className={`block text-[9px] font-bold uppercase tracking-widest mb-2.5 ${themeClasses.label}`}>
                  Interlineado
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["normal", "relaxed", "loose"] as const).map((lh) => (
                    <button
                      key={lh}
                      type="button"
                      onClick={() => updatePref("lineHeight", lh)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        prefs.lineHeight === lh
                          ? themeClasses.buttonActive
                          : themeClasses.buttonInactive
                      }`}
                    >
                      {lh === "normal" ? "Estrecho" : lh === "relaxed" ? "Cómodo" : "Amplio"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer (Pinned) */}
            <div className={`flex-shrink-0 px-5 py-3 border-t ${themeClasses.divider} ${themeClasses.headerBg}`}>
              <button
                type="button"
                onClick={onClose}
                className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer text-center ${themeClasses.doneBtn}`}
              >
                Listo
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
