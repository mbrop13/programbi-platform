"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, Database, BarChart, Clock } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedComponents";

export default function AsesoriasPromoSection() {
  return (
    <section className="py-24 bg-[#0A0F1C] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1890FF]/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <FadeIn>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wide uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Mentoría 1 a 1 en vivo
              </span>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] font-display">
                Desbloquea ese problema que te lleva <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">frenando días</span>.
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-xl">
                ¿Atascado con un modelo DAX complejo, una consulta SQL pesada o un script de Python que no corre? Agenda una sesión privada por hora y resolvamos tu problema técnico juntos en tiempo real.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <StaggerChildren className="grid sm:grid-cols-2 gap-4 mb-10">
                {[
                  { icon: <Database className="w-5 h-5 text-emerald-400" />, text: "Optimización SQL" },
                  { icon: <BarChart className="w-5 h-5 text-blue-400" />, text: "Modelado Power BI & DAX" },
                  { icon: <Code className="w-5 h-5 text-yellow-400" />, text: "Scripts de Python & ETL" },
                  { icon: <Clock className="w-5 h-5 text-purple-400" />, text: "Sesiones de 1 o más horas" },
                ].map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 transition-colors hover:bg-white/10 hover:border-white/20">
                      <div className="p-2 rounded-lg bg-white/5 shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-gray-300 font-medium text-sm">{item.text}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Link
                href="/asesorias"
                className="group inline-flex items-center gap-4 px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
              >
                Agendar Mentoría Ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeIn>
          </div>

          {/* Right Visual Element */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <FadeIn delay={0.3} className="w-full">
              <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full blur-[100px] opacity-40 animate-pulse" />
                <div className="relative w-full h-full bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden p-8 flex flex-col items-center justify-center text-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                  
                  <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-8 border border-blue-500/30">
                    <Code className="w-10 h-10 text-blue-400" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-4">No pierdas más tiempo buscando en foros.</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Nuestros expertos revisarán tu pantalla, entenderán tu negocio y escribirán el código exacto que necesitas para seguir avanzando.
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-[#111827] flex items-center justify-center">
                          <span className="text-xs">👨‍💻</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">Expertos Senior</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
