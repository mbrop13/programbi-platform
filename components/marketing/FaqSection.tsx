"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/shared/AnimatedComponents";

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
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-500/2 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-[44px] font-black text-slate-900 tracking-tight font-display mb-4">
              Preguntas{" "}
              <span
                className="bg-clip-text text-transparent animate-gradient"
                style={{
                  backgroundImage: "linear-gradient(to right, #1890FF, #6366F1, #1890FF)",
                  backgroundSize: "200% 200%",
                }}
              >
                Frecuentes
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-500 font-sans leading-relaxed">
              Resolvemos todas tus dudas para que tomes la mejor decisión para tu desarrollo y crecimiento profesional.
            </p>
          </div>
        </FadeIn>

        {/* FAQ Accordion Cards */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <FadeIn key={i} delay={i * 0.05}>
                <div 
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? "border-[#1890FF]/30 bg-white shadow-[0_12px_30px_-10px_rgba(24,144,255,0.08)]" 
                      : "border-slate-200/60 bg-slate-50/50 hover:bg-white hover:border-slate-350 hover:shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex justify-between items-center w-full text-left bg-transparent border-none cursor-pointer p-6 group outline-none select-none"
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
                      <Plus size={15} className="stroke-[3]" />
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
                        <div className="px-6 pb-6 pt-0 border-t border-slate-100/50">
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
      </div>

      <style jsx>{`
        @keyframes gradient-anim {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient-anim 4s ease infinite;
        }
      `}</style>
    </section>
  );
}
