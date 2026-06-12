"use client";

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
  const updatePref = <K extends keyof BlogPrefs>(key: K, value: BlogPrefs[K]) => {
    const updated = { ...prefs, [key]: value };
    onChange(updated);
    localStorage.setItem("programbi-blog-prefs", JSON.stringify(updated));
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
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[10000]"
          />

          {/* Settings Container (Bottom Sheet on Mobile, Modal on Desktop) */}
          <motion.div
            initial={{ y: "100%", x: "-50%", opacity: 0.5 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: "100%", x: "-50%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-1/2 -translate-x-1/2 w-full md:max-w-md bg-white border border-slate-200 shadow-2xl rounded-t-3xl md:rounded-3xl z-[10001] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-800" />
                <span className="font-serif font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Ajustes de Lectura
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 text-slate-900">
              {/* Font Family */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Tipografía
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["serif", "sans", "mono"] as const).map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => updatePref("fontFamily", font)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        prefs.fontFamily === font
                          ? "bg-slate-950 border-slate-950 text-white shadow-md"
                          : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                      }`}
                    >
                      {font === "serif" ? (
                        <span className="font-serif">Serif (Lectura)</span>
                      ) : font === "mono" ? (
                        <span className="font-mono">Monospace</span>
                      ) : (
                        <span className="font-sans">Sans-Serif</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Tamaño de Letra
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["sm", "base", "lg", "xl"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updatePref("fontSize", size)}
                      className={`px-2 py-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        prefs.fontSize === size
                          ? "bg-slate-950 border-slate-950 text-white shadow-md font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <Type className={`w-3.5 h-3.5 mb-1 ${
                        size === "sm" ? "scale-90" : size === "base" ? "scale-100" : size === "lg" ? "scale-110" : "scale-125"
                      }`} />
                      <span className="text-[10px] uppercase font-bold">
                        {size === "sm" ? "Chico" : size === "base" ? "Normal" : size === "lg" ? "Grande" : "Súper"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme / Contrast */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Tema / Contraste
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["light", "sepia", "dark"] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => updatePref("theme", theme)}
                      className={`px-3 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        prefs.theme === theme
                          ? "border-slate-950 ring-2 ring-slate-950/20"
                          : "border-slate-200"
                      } ${
                        theme === "light"
                          ? "bg-white text-slate-950"
                          : theme === "sepia"
                          ? "bg-[#F4ECD8] text-[#5B4636]"
                          : "bg-slate-950 text-slate-200"
                      }`}
                    >
                      {theme === "light" ? (
                        <>
                          <Sun className="w-4 h-4 text-amber-500" />
                          <span>Claro</span>
                        </>
                      ) : theme === "sepia" ? (
                        <>
                          <Eye className="w-4 h-4 text-[#8C6D53]" />
                          <span>Sepia</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-4 h-4 text-indigo-400" />
                          <span>Oscuro</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Interlineado (Espacio)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["normal", "relaxed", "loose"] as const).map((lh) => (
                    <button
                      key={lh}
                      type="button"
                      onClick={() => updatePref("lineHeight", lh)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        prefs.lineHeight === lh
                          ? "bg-slate-950 border-slate-950 text-white shadow-md"
                          : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                      }`}
                    >
                      {lh === "normal" ? "Estrecho" : lh === "relaxed" ? "Cómodo" : "Amplio"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
