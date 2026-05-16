"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code, Database, BarChart, Clock } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedComponents";
import { founderImage } from "@/lib/data/images";

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
            <FadeIn delay={0.3} className="w-full relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1890FF] to-indigo-500 rounded-full blur-[100px] opacity-30 animate-pulse" />
              
              {/* Main IDE Window */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-[500px] mx-auto bg-[#0D1117] border border-gray-800 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                {/* IDE Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#161B22] border-b border-gray-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-mono text-gray-500">optimizacion_avanzada.py</span>
                </div>
                {/* IDE Body */}
                <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed text-gray-300">
                  <div className="text-gray-500 mb-3"># Corrigiendo cuello de botella en ETL</div>
                  <div className="flex gap-4"><span className="text-gray-600">1</span><div><span className="text-pink-400">def</span> <span className="text-blue-400">procesar_millones_filas</span>(df):</div></div>
                  <div className="flex gap-4"><span className="text-gray-600">2</span><div className="ml-4"><span className="text-purple-400">yield from</span> (chunk <span className="text-pink-400">for</span> chunk <span className="text-pink-400">in</span> np.array_split(df, 10000))</div></div>
                  <div className="flex gap-4"><span className="text-gray-600">3</span></div>
                  <div className="flex gap-4"><span className="text-gray-600">4</span><div><span className="text-gray-500"># Ejecutando script optimizado...</span></div></div>
                  <div className="flex gap-4"><span className="text-gray-600">5</span><div><span className="text-emerald-400">print</span>(<span className="text-green-300">"✅ Rendimiento mejorado +300%"</span>)</div></div>
                  <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
                    <span className="w-2 h-4 bg-blue-400 animate-pulse inline-block" />
                    <span className="text-gray-500 text-xs">Esperando input del experto...</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 1: Power BI DAX */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -right-2 sm:-right-8 top-1/4 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl max-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BarChart className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-white text-xs">DAX Fix</span>
                </div>
                <div className="font-mono text-[10px] text-gray-300 leading-tight">
                  <span className="text-blue-300">CALCULATE</span>(
                  <br />&nbsp;&nbsp;[Total Sales],
                  <br />&nbsp;&nbsp;<span className="text-blue-300">USERELATIONSHIP</span>(...)
                  <br />)
                </div>
              </motion.div>

              {/* Floating Element 2: Mentor Video Call Mockup */}
              <motion.div 
                initial={{ x: -50, y: 50, opacity: 0 }}
                whileInView={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="absolute -left-2 sm:-left-8 -bottom-6 bg-[#1E293B] border border-gray-700 p-2 rounded-2xl shadow-2xl flex items-center gap-3 w-52"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500 overflow-hidden relative shrink-0">
                  <Image src={founderImage} alt="Mentor" fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">En Vivo</span>
                  </div>
                  <span className="text-xs text-gray-400 leading-tight block truncate">Compartiendo pantalla</span>
                </div>
              </motion.div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
