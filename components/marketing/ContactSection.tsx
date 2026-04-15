"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, Lock, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { contactGallery } from "@/lib/data/images";

const interestChips = [
  "Análisis de Datos", "Power BI", "Python", "SQL Server", "Excel",
  "Machine Learning", "IA en Productividad", "Power Automate", "Minería", "Finanzas",
];

export default function ContactSection() {
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [acceptsPrivacy, setAcceptsPrivacy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim() || null,
          message: message.trim() || null,
          selectedCourses: selectedChips,
          leadType: "contact",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-16 lg:py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)" }}>
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left: Gallery */}
          <div className="space-y-10">
            <FadeIn>
              <span className="text-[#1890FF] font-bold tracking-widest uppercase text-xs block mb-3">
                Certificación 2026
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight font-display">
                Domina los Datos,<br />Lidera el Futuro
              </h2>
              <p className="text-lg lg:text-xl text-gray-500 mt-6 leading-relaxed">
                La única certificación que integra <strong>SQL, Power BI y Python</strong> en 144 horas
                de práctica intensiva. De principiante a experto en datos.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 grid-rows-2 gap-4" style={{ gridTemplateRows: "220px 220px" }}>
                {contactGallery.map((img, i) => (
                  <motion.div
                    key={i}
                    className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                      img.tall ? "row-span-2" : ""
                    }`}
                    style={{ boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                    whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(24,144,255,0.2)" }}
                  >
                    <Image
                      src={img.url}
                      alt={img.label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    <div className={`absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 ${
                      img.tall ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                      style={{ background: "linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 70%)" }}>
                      <span className="text-white font-bold text-xl">{img.label}</span>
                      <span className="text-gray-300 text-sm mt-1">{img.subtitle}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right: Form */}
          <FadeIn delay={0.3}>
            <div
              className="bg-white border border-[#F1F5F9] rounded-[2.5rem] p-8 md:p-10 lg:p-12 sticky top-28"
              style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.08)" }}
            >
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 text-4xl">
                    ✓
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">¡Mensaje Enviado!</h3>
                  <p className="text-gray-500">Te contactaremos en menos de 24 horas.</p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-display">
                    Postula al Programa
                  </h3>
                  <p className="text-base lg:text-lg text-gray-500 mb-8">
                    Recibe el plan de estudios detallado. 48 horas por nivel.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
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
                        className="w-full rounded-xl p-4 text-base bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="juan@empresa.com"
                          className="w-full rounded-xl p-4 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">WhatsApp</label>
                        <input
                          type="tel"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="+56 9..."
                          className="w-full rounded-xl p-4 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Interest Chips */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                        ¿Qué cursos te interesan?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {interestChips.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => toggleChip(chip)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                              selectedChips.includes(chip)
                                ? "bg-[#E6F7FF] text-[#1890FF] border border-[#1890FF] shadow-sm"
                                : "bg-[#F1F5F9] text-[#64748B] border border-transparent hover:bg-[#E2E8F0]"
                            }`}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                        Mensaje adicional
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="¿Dudas sobre el temario?"
                        className="w-full rounded-xl p-4 resize-none text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-gray-900 focus:bg-white focus:border-[#1890FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    {errorMsg && (
                      <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                        {errorMsg}
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 rounded-xl bg-[#1890FF] hover:bg-blue-600 text-white font-bold text-lg flex justify-center items-center gap-3 transition-all disabled:opacity-70"
                      style={{ boxShadow: "0 10px 30px -5px rgba(24,144,255,0.3)" }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Solicitar información</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </motion.button>

                    {/* Privacy checkbox */}
                    <div className="flex items-start gap-3 mt-2">
                      <input
                        type="checkbox"
                        id="privacy-contact"
                        checked={acceptsPrivacy}
                        onChange={(e) => setAcceptsPrivacy(e.target.checked)}
                        required
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1890FF] focus:ring-blue-500 cursor-pointer accent-[#1890FF] flex-shrink-0"
                      />
                      <label htmlFor="privacy-contact" className="text-[11px] text-gray-500 cursor-pointer leading-relaxed">
                        Acepto la{" "}
                        <Link href="/privacidad" className="text-[#1890FF] font-semibold no-underline hover:underline" target="_blank">Política de Privacidad</Link>{" "}
                        y autorizo a ProgramBI a utilizar mis datos para contactarme sobre los cursos seleccionados.
                      </label>
                    </div>
                  </form>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
