"use client";

import { motion } from "framer-motion";
import { Users, Code, Video, Bot, ArrowUpRight, Award, Zap } from "lucide-react";

const benefits = [
  {
    icon: Code,
    title: "Aulas Virtuales Interactivas",
    description: "Practica en vivo. Accede a entornos de programación directamente en tu navegador sin instalar nada, con feedback instantáneo y recursos sincronizados en cada clase.",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    icon: Bot,
    title: "Asistente Inteligente 24/7",
    description: "No te quedes con dudas. Nuestro Asistente de IA especializado en Data resolverá tus problemas de código en segundos y te guiará paso a paso hacia la solución.",
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    icon: Users,
    title: "Comunidad y Networking",
    description: "Conecta con otros analistas de datos, comparte tus proyectos en el Muro Global, resuelve dudas comunitarias y potencia tus oportunidades laborales.",
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    icon: Video,
    title: "Masterclasses en Vivo Semanales",
    description: "Participa de sesiones exclusivas en tiempo real donde expertos de la industria resuelven casos reales utilizando SQL, Python, Power BI y más.",
    color: "text-rose-600",
    bg: "bg-rose-50"
  },
  {
    icon: Award,
    title: "Precios Preferenciales Inclusivos",
    description: "Como miembro activo, tienes descuentos garantizados del 20% al 30% en cursos individuales, especializaciones pesadas y certificaciones oficiales.",
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    icon: Zap,
    title: "Mentoría y Acompañamiento",
    description: "Estudia acompañado. Nuestras rutas y feedback constante de mentores aseguran que nunca te estanques en un error.",
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  }
];

export default function CommunityBenefits() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50/50 relative overflow-hidden">
      {/* Decorative dots */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6"
          >
            ¿Por qué unirte a la <span className="text-brand-blue">Comunidad?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto"
          >
            Hemos diseñado un ecosistema educativo completo pensado exclusivamente para que domines los datos sin frustraciones.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${benefit.bg} rounded-2xl flex items-center justify-center mb-6 border border-gray-50 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
