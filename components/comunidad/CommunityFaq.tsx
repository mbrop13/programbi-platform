"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const communityFaqs = [
  {
    question: "¿Si me suscribo, tendré acceso a los cursos para siempre?",
    answer: "El modelo de membresía te da acceso completo a los cursos mientras tu suscripción esté activa. Si deseas acceso de por vida a un curso específico sin depender de una membresía, puedes adquirirlo individualmente (¡con un descuento especial por ser miembro!)."
  },
  {
    question: "¿Qué pasa si mis preguntas a la IA superan el límite de mi plan?",
    answer: "El Asistente IA tiene límites generosos diseñados para que no te quedes corto en el aprendizaje cotidiano. Si agotas tus preguntas de tu plan actual, puedes hacer un upgrade en cualquier momento o esperar al reinicio del ciclo mensual."
  },
  {
    question: "¿Puedo cancelar o cambiar de plan cuando yo quiera?",
    answer: "Por supuesto. Puedes gestionar, pausar o cancelar tu suscripción con un solo clic desde tu panel de usuario sin hacer preguntas ni llamadas. Todo es 100% autogestionado y automático."
  },
  {
    question: "¿Cómo se aplican los descuentos en la compra individual?",
    answer: "Al tener un plan activo y navegar por nuestro catálogo de cursos, los precios se rebajarán automáticamente según el descuento de tu plan (20% para el Pro, 30% para el Max y Ultra). Al comprar, adquirirás ese curso de por vida."
  },
  {
    question: "¿Cómo funciona el chat integrado con profesores del plan Ultra?",
    answer: "A diferencia del soporte estándar, el Plan Ultra te da acceso directo y prioritario a un chat privado con nuestro equipo docente. Podrás enviar fragmentos de código, hacer preguntas técnicas avanzadas sobre tus proyectos y recibir orientación experta sin esperas."
  }
];

export default function CommunityFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="pt-24 pb-40 bg-white relative">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
            <HelpCircle className="w-8 h-8" />
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            Preguntas Frecuentes
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-slate-500 max-w-2xl"
          >
            Aclara tus dudas antes de unirte a la mejor comunidad hispana de analistas de datos. Si tienes más consultas, nuestro equipo de soporte te ayudará.
          </motion.p>
        </div>

        <div className="space-y-4">
          {communityFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white border-blue-200 shadow-lg shadow-blue-500/5' : 'bg-gray-50/50 border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`text-lg md:text-xl font-bold pr-8 transition-colors ${isOpen ? 'text-brand-blue' : 'text-slate-800'}`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-brand-blue text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 shadow-sm'}`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-6 text-slate-500 text-base md:text-lg leading-relaxed border-t border-gray-100 pt-5 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  );
}
