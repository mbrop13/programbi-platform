"use client";

import { useState } from "react";
import { X, Send, LifeBuoy, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function SupportModal({ isOpen, onClose, userEmail }: SupportModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión para enviar un mensaje.");

      const { error } = await supabase.from("support_tickets").insert({
        user_id: user.id,
        subject,
        message,
        status: "pending"
      });

      if (error) throw new Error(error.message);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSubject("");
        setMessage("");
        onClose();
      }, 3000);

    } catch (error: any) {
      setErrorMsg(error.message || "Ocurrió un error al enviar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden ring-1 ring-black/5"
          >
            {/* Header con gradiente y patrón */}
            <div className="relative px-8 py-6 bg-gradient-to-br from-blue-50/80 to-white overflow-hidden border-b border-gray-50/80">
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none mix-blend-multiply"></div>
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-blue-500 flex items-center justify-center text-white shadow-lg shadow-brand-blue/30 transform -rotate-3 transition-transform hover:rotate-0">
                    <LifeBuoy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 tracking-tight text-lg">Soporte Técnico</h3>
                    <p className="text-xs font-medium text-brand-blue/80">Resolución prioritaria</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100/80 rounded-xl transition-all cursor-pointer backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-7 bg-white">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 relative">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 relative z-10" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">¡Mensaje Enviado!</h3>
                  <p className="text-sm font-medium text-gray-500 max-w-[250px] mx-auto leading-relaxed">
                    Hemos recibido tu consulta. Un experto de soporte te responderá directamente.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Asunto
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ej. Problema con mi suscripción"
                      className="w-full px-5 py-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-gray-100/80 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all text-sm font-semibold text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Descripción del Problema
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Cuéntanos detalladamente cómo podemos ayudarte hoy..."
                      rows={4}
                      className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-gray-100/80 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400 resize-none leading-relaxed"
                    />
                  </div>

                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 rounded-2xl bg-red-50/80 text-red-600 text-xs font-bold border border-red-100">
                      {errorMsg}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-brand-blue text-white font-extrabold rounded-2xl shadow-[0_8px_16px_rgba(24,144,255,0.25)] transition-all hover:-translate-y-0.5 active:translate-y-0 focus:ring-4 focus:ring-brand-blue/30 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Enviar Solicitud
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
