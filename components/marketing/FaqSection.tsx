"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, HelpCircle } from "lucide-react";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import SectionHeader from "@/components/shared/SectionHeader";

const faqs = [
  {
    question: "¿Necesito tener conocimientos previos de programación?",
    answer:
      "No, en absoluto. Nuestra metodología está diseñada para que puedas empezar desde cero. Te guiaremos paso a paso para que adquieras todos los fundamentos de la programación y el análisis de datos.",
  },
  {
    question: "¿Cómo es la modalidad de las clases?",
    answer:
      "El bootcamp se imparte en modalidad online con clases en directo. Esto te permite interactuar con los profesores y compañeros en tiempo real. Además, todas las clases quedan grabadas para que puedas repasarlas cuando quieras en nuestro campus virtual.",
  },
  {
    question: "¿Qué pasa si no puedo asistir a una clase en directo?",
    answer:
      "No hay problema. Todas las clases en directo se graban y se suben a nuestra plataforma. Tendrás acceso ilimitado a las grabaciones y a todo el material del curso para que puedas estudiar a tu propio ritmo.",
  },
  {
    question: "¿Recibiré un certificado al finalizar?",
    answer:
      "Sí. Al completar cada módulo obtendrás un certificado y, al finalizar el bootcamp y presentar tu Capstone Project, recibirás el certificado final que acredita todas las competencias adquiridas.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Soft visual background accents */}
      <div className="absolute top-1/4 left-[-10%] w-[350px] h-[350px] bg-blue-100/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-[-10%] w-[350px] h-[350px] bg-indigo-100/20 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto px-5 lg:px-10 relative z-10">
        {/* Unified Header */}
        <SectionHeader
          eyebrow="Resolvemos tus dudas"
          icon={HelpCircle}
          title={<>Preguntas <span className="text-[#1890FF]">frecuentes</span></>}
          subtitle="Resolvemos todas tus dudas para que tomes la mejor decisión para tu desarrollo y crecimiento profesional."
          align="center"
          maxWidth="md"
          className="mb-12 lg:mb-16"
        />

        {/* FAQ Accordion Cards */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <FadeIn key={i} delay={i * 0.05}>
                <div 
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? "border-[#1890FF]/25 bg-blue-50/5 shadow-[0_12px_40px_-12px_rgba(24,144,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)]" 
                      : "border-slate-200 bg-slate-50/30 hover:bg-white hover:border-slate-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex justify-between items-center w-full text-left bg-transparent border-none cursor-pointer p-5 sm:p-6 group outline-none select-none"
                  >
                    <span className={`text-sm md:text-base font-bold pr-4 transition-colors font-sans tracking-tight leading-snug ${
                      isOpen ? "text-[#1890FF]" : "text-slate-800"
                    }`}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                        isOpen ? "bg-[#1890FF] text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}
                    >
                      <Plus size={14} className="stroke-[3]" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-slate-100/50">
                          <p className="text-xs md:text-sm text-slate-500 leading-relaxed pt-4 font-sans">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* WhatsApp CTA Footer */}
        <FadeIn delay={0.25}>
          <div className="mt-12 text-center relative z-20">
            <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider mb-3 select-none">
              ¿Aún tienes dudas?
            </p>
            <a 
              href="https://wa.me/56935409699?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20cursos%20de%20ProgramBI." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-250/60 hover:border-slate-300 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all shadow-sm hover:shadow no-underline cursor-pointer"
            >
              Conversa con nosotros por WhatsApp
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
