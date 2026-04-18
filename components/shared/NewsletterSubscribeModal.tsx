"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Bell, Sparkles, Check, Newspaper, Clock, ChevronRight, Loader2 } from "lucide-react";
import { getNewsletterCategories, getNewsletterSubscription, subscribeToNewsletter } from "@/lib/supabase/comunidad-ai";

const FREQUENCIES = [
  { id: "daily", label: "Diario", desc: "Cada día lo más relevante", icon: "⚡" },
  { id: "weekly", label: "Semanal", desc: "Un resumen cada lunes", icon: "📅" },
  { id: "monthly", label: "Mensual", desc: "Lo mejor del mes", icon: "🗓️" },
];

interface NewsletterSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterSubscribeModal({ isOpen, onClose }: NewsletterSubscribeModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [existingSub, setExistingSub] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSuccess(false);

    async function load() {
      setLoading(true);
      try {
        const [cats, sub] = await Promise.all([
          getNewsletterCategories(),
          getNewsletterSubscription(),
        ]);
        setCategories(cats);

        if (sub && sub.is_active) {
          setExistingSub(sub);
          setSelectedCategories(sub.categories || []);
          setFrequency(sub.frequency || "weekly");
        } else {
          // Default: all categories selected
          setSelectedCategories(cats.map((c: any) => c.slug));
          setFrequency("weekly");
          setExistingSub(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isOpen]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  };

  const selectAll = () => {
    setSelectedCategories(categories.map(c => c.slug));
  };

  const handleSubscribe = async () => {
    setSaving(true);
    try {
      await subscribeToNewsletter({
        categories: selectedCategories,
        frequency,
      });
      setSuccess(true);
      setTimeout(() => onClose(), 2500);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-[10000] px-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all border-none cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Success State */}
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    >
                      <Check className="w-10 h-10 text-emerald-600" />
                    </motion.div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    ¡Estás suscrito!
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Recibirás las mejores noticias sobre análisis de datos directamente en tu correo.
                  </p>
                </motion.div>
              ) : loading ? (
                <div className="p-10 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-gray-300 animate-spin mb-3" />
                  <span className="text-sm text-gray-400">Cargando...</span>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-gray-900 to-slate-800 text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-[80px]" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-400 rounded-full blur-[60px]" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                          <Newspaper className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-300">
                          Newsletter ProgramBI
                        </span>
                      </div>
                      <h3 className="text-2xl font-black leading-tight mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {existingSub ? "Actualizar preferencias" : "Suscríbete al Newsletter"}
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed">
                        Elige qué temas te interesan y con qué frecuencia quieres recibir noticias.
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-8 py-6">

                    {/* Categories */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Temas de interés
                        </label>
                        <button
                          onClick={selectAll}
                          className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-wider bg-transparent border-none cursor-pointer"
                        >
                          Seleccionar todos
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map(cat => {
                          const isSelected = selectedCategories.includes(cat.slug);
                          return (
                            <button
                              key={cat.id}
                              onClick={() => toggleCategory(cat.slug)}
                              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-left transition-all border cursor-pointer ${
                                isSelected
                                  ? "bg-blue-50 border-blue-200 text-blue-900"
                                  : "bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <span className="text-lg">{cat.emoji}</span>
                              <span className="text-sm font-bold">{cat.name}</span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-blue-500 ml-auto" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Frequency */}
                    <div className="mb-6">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Frecuencia
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {FREQUENCIES.map(f => {
                          const isSelected = frequency === f.id;
                          return (
                            <button
                              key={f.id}
                              onClick={() => setFrequency(f.id)}
                              className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl transition-all border cursor-pointer ${
                                isSelected
                                  ? "bg-gray-900 border-gray-900 text-white"
                                  : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                              }`}
                            >
                              <span className="text-lg">{f.icon}</span>
                              <span className="text-xs font-bold">{f.label}</span>
                              <span className={`text-[9px] ${isSelected ? "text-white/60" : "text-gray-400"}`}>{f.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Subscribe Button */}
                    <button
                      onClick={handleSubscribe}
                      disabled={selectedCategories.length === 0 || saving}
                      className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-all border-none cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                      {existingSub ? "Actualizar Suscripción" : "Suscribirme Ahora"}
                    </button>

                    {selectedCategories.length === 0 && (
                      <p className="text-[11px] text-red-400 text-center mt-2 font-medium">
                        Selecciona al menos un tema de interés
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
