"use client";

import { useState } from "react";
import {
  X,
  Send,
  LifeBuoy,
  Loader2,
  CheckCircle2,
  MessageCircle,
  Mail,
  Clock,
  HelpCircle,
  CreditCard,
  BookOpen,
  Bug,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const TOPICS = [
  {
    id: "acceso",
    label: "Acceso y cuenta",
    icon: User,
    desc: "Login, contraseña o perfil",
  },
  {
    id: "pagos",
    label: "Pagos y facturación",
    icon: CreditCard,
    desc: "Suscripciones y comprobantes",
  },
  {
    id: "cursos",
    label: "Cursos y contenido",
    icon: BookOpen,
    desc: "Materiales, clases o certificados",
  },
  {
    id: "tecnico",
    label: "Problema técnico",
    icon: Bug,
    desc: "Errores o fallos de la plataforma",
  },
  {
    id: "otro",
    label: "Otra consulta",
    icon: HelpCircle,
    desc: "Cualquier otra duda",
  },
];

const WHATSAPP_URL =
  "https://wa.me/56935409699?text=" +
  encodeURIComponent("Hola, necesito ayuda con ProgramBI.");

export default function SupportModal({ isOpen, onClose, userEmail }: SupportModalProps) {
  const [topic, setTopic] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  const resetAndClose = () => {
    setSuccess(false);
    setSubject("");
    setMessage("");
    setTopic("");
    setErrorMsg("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) {
      setErrorMsg("Selecciona un tipo de consulta.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión para enviar un mensaje.");

      const topicLabel = TOPICS.find((t) => t.id === topic)?.label || topic;
      const fullSubject = `[${topicLabel}] ${subject.trim()}`;

      const { error } = await supabase.from("support_tickets").insert({
        user_id: user.id,
        subject: fullSubject,
        message: message.trim(),
        status: "pending",
      });

      if (error) throw new Error(error.message);

      setSuccess(true);
      setTimeout(() => {
        resetAndClose();
      }, 3200);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Ocurrió un error al enviar el mensaje.";
      setErrorMsg(msg);
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
            onClick={resetAndClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-neutral-100 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-neutral-100 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-slate-900 text-lg tracking-tight">
                      Centro de Soporte
                    </h3>
                    <p className="text-[12px] text-slate-400 mt-0.5">
                      Te respondemos en menos de 24 horas hábiles
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-slate-500 transition-colors border-0 bg-transparent cursor-pointer shrink-0"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 relative">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 relative z-10" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                    ¡Solicitud enviada!
                  </h3>
                  <p className="text-[13px] font-medium text-slate-500 max-w-[300px] mx-auto leading-relaxed">
                    Hemos recibido tu consulta. Un especialista te responderá al correo
                    asociado a tu cuenta.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Quick contact channels */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Contacto rápido
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-100 bg-neutral-50/80 hover:bg-emerald-50/60 hover:border-emerald-200 transition-all no-underline group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-bold text-slate-800">WhatsApp</div>
                          <div className="text-[11px] text-slate-400">Respuesta en minutos</div>
                        </div>
                      </a>
                      <a
                        href="mailto:soporte@programbi.com"
                        className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-100 bg-neutral-50/80 hover:bg-indigo-50/60 hover:border-indigo-200 transition-all no-underline group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-bold text-slate-800">Email</div>
                          <div className="text-[11px] text-slate-400 truncate">
                            soporte@programbi.com
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* SLA note */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-50/70 border border-amber-100/80">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-[11px] text-amber-800/80 font-medium leading-snug">
                      Horario de atención: lun–vie, 9:00–19:00 (CLT). Tickets fuera de horario se
                      revisan al siguiente día hábil.
                    </p>
                  </div>

                  <div className="h-px bg-neutral-100" />

                  {/* Ticket form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Tipo de consulta
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {TOPICS.map((t) => {
                          const Icon = t.icon;
                          const active = topic === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTopic(t.id)}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                                active
                                  ? "bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-200/60"
                                  : "bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                  active
                                    ? "bg-indigo-100 text-indigo-600"
                                    : "bg-neutral-100 text-slate-400"
                                )}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[12px] font-bold text-slate-800">
                                  {t.label}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {t.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {userEmail && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span>
                          Responderemos a{" "}
                          <span className="font-semibold text-slate-600">{userEmail}</span>
                        </span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Asunto
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Ej. No puedo acceder a mi curso"
                        className="w-full px-4 py-3 bg-neutral-50 hover:bg-white rounded-xl border border-neutral-200 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all text-[13px] font-medium text-slate-800 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Descripción
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Cuéntanos con detalle qué ocurre, qué esperabas y qué viste en pantalla..."
                        rows={4}
                        className="w-full px-4 py-3 bg-neutral-50 hover:bg-white rounded-xl border border-neutral-200 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all text-[13px] font-medium text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed"
                      />
                    </div>

                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3.5 rounded-xl bg-red-50 text-red-600 text-[12px] font-semibold border border-red-100"
                      >
                        {errorMsg}
                      </motion.div>
                    )}

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={resetAndClose}
                        className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-slate-700 font-semibold rounded-xl text-[13px] transition-colors border-0 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border-0"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Enviar solicitud
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
