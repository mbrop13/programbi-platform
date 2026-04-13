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
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight font-display">
              Preguntas{" "}
              <span
                className="bg-clip-text text-transparent animate-gradient"
                style={{
                  backgroundImage: "linear-gradient(to right, #1890FF, #40a9ff, #1890FF)",
                  backgroundSize: "200% 200%",
                }}
              >
                Frecuentes
              </span>
            </h2>
            <p className="mt-8 max-w-3xl mx-auto text-lg lg:text-2xl text-gray-500">
              Resolvemos todas tus dudas para que tomes la mejor decisión para tu carrera profesional.
            </p>
          </div>
        </FadeIn>

        {/* FAQ Items */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="border-b border-gray-100 pb-6">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex justify-between items-center w-full text-left bg-transparent border-none cursor-pointer py-4 group"
                >
                  <span className="text-xl lg:text-2xl font-bold text-gray-800 pr-4 group-hover:text-[#1890FF] transition-colors">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex-shrink-0 h-10 w-10 rounded-full bg-[#1890FF] flex items-center justify-center text-white"
                  >
                    <Plus size={24} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <p className="text-lg text-gray-500 leading-relaxed pt-4 pb-2">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
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
