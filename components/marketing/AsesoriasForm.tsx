"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Building2, User, CheckCircle2 } from "lucide-react";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import { readBrowserReferralCode } from "@/lib/referrals/cookie";

interface AsesoriasFormProps {
  type: "empresas" | "particulares";
}

export default function AsesoriasForm({ type }: AsesoriasFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const formLoadedAt = useRef(Date.now());

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !whatsapp.trim()) return;
    if (type === "empresas" && !company.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload: any = {
        name: name.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        message: message.trim() || null,
        leadType: type === "empresas" ? "asesoria_b2b" : "asesoria_b2c",
        referral_code: readBrowserReferralCode(),
        ...getAntiBotFields(formLoadedAt.current, honeypot),
      };

      if (type === "empresas") {
        payload.company = company.trim();
      }

      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar la solicitud");

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border-2 border-green-100 rounded-[2rem] p-10 text-center shadow-lg shadow-green-500/5 max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-3 font-display">¡Solicitud Enviada!</h3>
        <p className="text-gray-500">
          Hemos recibido tus datos correctamente. Nos pondremos en contacto contigo a la brevedad.
        </p>
      </motion.div>
    );
  }

  const isB2B = type === "empresas";

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-[#171716]">
          {isB2B ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
        </div>
        <div>
          <h3 className="text-2xl font-black text-[#0F172A] font-display">
            {isB2B ? "Postular Empresa" : "Postular Particular"}
          </h3>
          <p className="text-gray-500 text-sm font-medium">
            {isB2B ? "Cuéntanos sobre tu organización y desafíos." : "Déjanos tus datos y qué te gustaría destrabar."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className={`w-full rounded-xl p-4 text-sm bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white outline-none transition-all focus:ring-4 ${isB2B ? "focus:border-blue-500 focus:ring-blue-100" : "focus:border-indigo-500 focus:ring-indigo-100"}`}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isB2B ? "juan@tuempresa.com" : "juan@email.com"}
              className={`w-full rounded-xl p-4 text-sm bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white outline-none transition-all focus:ring-4 ${isB2B ? "focus:border-blue-500 focus:ring-blue-100" : "focus:border-indigo-500 focus:ring-indigo-100"}`}
            />
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isB2B ? "md:grid-cols-2" : ""} gap-5`}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+56 9..."
              className={`w-full rounded-xl p-4 text-sm bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white outline-none transition-all focus:ring-4 ${isB2B ? "focus:border-blue-500 focus:ring-blue-100" : "focus:border-indigo-500 focus:ring-indigo-100"}`}
            />
          </div>
          {isB2B && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                Empresa *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nombre de tu empresa"
                className="w-full rounded-xl p-4 text-sm bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white outline-none transition-all focus:ring-4 focus:border-blue-500 focus:ring-blue-100"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            Mensaje (Opcional)
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isB2B ? "¿En qué podemos ayudar a tu equipo?" : "¿Qué te gustaría resolver en tu asesoría?"}
            className={`w-full rounded-xl p-4 resize-none text-sm bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white outline-none transition-all focus:ring-4 ${isB2B ? "focus:border-blue-500 focus:ring-blue-100" : "focus:border-indigo-500 focus:ring-indigo-100"}`}
          />
        </div>

        {/* Anti-bot Honeypot */}
        <div style={honeypotStyle} aria-hidden="true">
          <label>No llenar este campo</label>
          <input type="text" name="_website" autoComplete="off" tabIndex={-1} value={honeypot} onChange={e => setHoneypot(e.target.value)} />
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full font-semibold text-canvas text-base bg-ink transition-transform flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Enviando...</span>
          ) : (
            <>Enviar Solicitud <Send className="w-5 h-5" /></>
          )}
        </button>
      </form>
    </div>
  );
}
