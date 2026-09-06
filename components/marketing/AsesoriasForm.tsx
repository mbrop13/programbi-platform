"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Building2, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getAntiBotFields, honeypotStyle } from "@/lib/antibot";
import { PACK } from "@/lib/data/pack-adopcion";
import { captureAndReadAttribution } from "@/lib/utm";

interface AsesoriasFormProps {
  type: "empresas" | "particulares";
}

export default function AsesoriasForm({ type }: AsesoriasFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const formLoadedAt = useRef(Date.now());

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [area, setArea] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;
    if (type === "empresas" && (!company.trim() || !position.trim())) return;
    if (!consent) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const attr = captureAndReadAttribution();
      const payload: Record<string, unknown> = {
        name: name.trim(),
        email: email.trim() || `pack-${Date.now()}@lead.programbi.cl`,
        whatsapp: whatsapp.trim(),
        message: message.trim() || null,
        leadType: type === "empresas" ? "enterprise" : "asesoria_b2c",
        landing_path: attr.landing_path,
        utm_source: attr.utm_source,
        utm_medium: attr.utm_medium,
        utm_campaign: attr.utm_campaign,
        utm_content: attr.utm_content,
        utm_term: attr.utm_term,
        ...getAntiBotFields(formLoadedAt.current, honeypot),
      };

      if (type === "empresas") {
        payload.company = company.trim();
        payload.position = position.trim();
        payload.area = area.trim() || null;
      }

      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar la solicitud");

      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-2xl rounded-[2rem] border-2 border-green-100 bg-white p-10 text-center shadow-lg shadow-green-500/5"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="font-display mb-3 text-2xl font-black text-gray-900">Solicitud enviada</h3>
        <p className="text-gray-500">
          Te contactamos a WhatsApp. La propuesta del Pack Adopción llega en menos de {PACK.proposalSlaHours} h
          hábiles.
        </p>
      </motion.div>
    );
  }

  const isB2B = type === "empresas";

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] md:p-10">
      <div className="relative z-10 mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#171716]">
          {isB2B ? <Building2 className="h-6 w-6" /> : <User className="h-6 w-6" />}
        </div>
        <div>
          <h3 className="font-display text-2xl font-black text-[#0F172A]">
            {isB2B ? "Diagnóstico Pack Adopción" : "Cotizar curso"}
          </h3>
          <p className="text-sm font-medium text-gray-500">
            {isB2B
              ? `${PACK.diagnosisMinutes} min. Nombre, empresa, cargo, WhatsApp y área.`
              : "Déjanos tus datos y te respondemos con fechas."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Nombre *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {isB2B ? (
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Empresa *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nombre de tu empresa"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@email.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {isB2B && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Cargo *</label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Controller, Jefe de área..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">WhatsApp *</label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+56 9..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {isB2B && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Área</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Control de gestión, finanzas, ops..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Email (opcional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@tuempresa.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Mensaje (opcional)</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isB2B ? "¿Qué reportes te están comiendo el mes?" : "¿Qué te gustaría resolver?"}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div style={honeypotStyle} aria-hidden="true">
          <label>No llenar este campo</label>
          <input
            type="text"
            name="_website"
            autoComplete="off"
            tabIndex={-1}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-500">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5"
            required
          />
          <span>
            Acepto la{" "}
            <Link href="/privacidad" className="font-semibold text-slate-800">
              política de privacidad
            </Link>{" "}
            y que ProgramBI me contacte por WhatsApp o email sobre esta solicitud.
          </span>
        </label>

        {errorMsg && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !consent}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-base font-semibold text-canvas transition-transform disabled:opacity-70 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Enviando...</span>
          ) : (
            <>
              {isB2B ? "Pedir diagnóstico 30 min" : "Enviar solicitud"} <Send className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
