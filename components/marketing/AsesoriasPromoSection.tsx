"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code, Database, BarChart, Clock, Loader2, AlertTriangle, TableProperties } from "lucide-react";
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
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/30 to-amber-500/20 rounded-full blur-[100px] opacity-40 animate-pulse" />
              
              {/* Main Excel Mockup Window */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-[500px] mx-auto bg-white border border-gray-200 rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                {/* Excel Header */}
                <div className="bg-[#107C41] text-white px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <TableProperties className="w-4 h-4" />
                    <span className="truncate max-w-[200px] sm:max-w-xs">Reporte_Ventas_Historicas_FINAL_v4.xlsx</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                     <div className="w-3 h-3 border border-white/30 rounded-sm" />
                     <div className="w-3 h-3 border border-white/30 rounded-sm" />
                     <div className="w-3 h-3 border border-white/30 bg-red-500/80 rounded-sm" />
                  </div>
                </div>
                
                {/* Ribbon Mockup */}
                <div className="bg-[#F3F2F1] border-b border-gray-300 px-3 py-1.5 flex gap-4 text-[11px] text-gray-600">
                  <span className="font-semibold text-[#107C41] border-b-2 border-[#107C41] pb-1">Inicio</span>
                  <span className="hidden sm:inline">Insertar</span>
                  <span className="hidden sm:inline">Disposición</span>
                  <span>Fórmulas</span>
                  <span>Datos</span>
                </div>

                {/* Formula Bar */}
                <div className="bg-white border-b border-gray-300 px-3 py-1.5 flex gap-2 items-center text-[11px] text-gray-600">
                  <span className="font-bold text-gray-400 italic shrink-0">fx</span>
                  <div className="flex-1 border border-gray-200 rounded px-2 py-1 bg-red-50 text-red-600 font-mono truncate">
                     =BUSCARV(A2, 'C:\Users\Admin\[BD_Gigante.xlsx]Hoja1'!$A$1:$Z$1048576, 25, FALSO) * COINCIDIR(#REF!)
                  </div>
                </div>

                {/* Excel Grid */}
                <div className="overflow-hidden bg-white text-[11px] sm:text-xs font-mono select-none">
                  <table className="w-full text-center border-collapse">
                    <thead>
                       <tr className="bg-gray-100 border-b border-gray-300">
                         <th className="w-8 border-r border-gray-300 font-normal text-gray-500 bg-gray-200 py-1"></th>
                         <th className="border-r border-gray-300 font-normal text-gray-500 py-1">A</th>
                         <th className="border-r border-gray-300 font-normal text-gray-500 py-1">B</th>
                         <th className="border-r border-gray-300 font-normal text-gray-500 py-1">C</th>
                         <th className="border-r border-gray-300 font-normal text-gray-500 py-1">D</th>
                       </tr>
                    </thead>
                    <tbody>
                       {[
                         ["ID_Venta", "Cliente", "Monto", "Comisión"],
                         ["V-1029", "Empresa A", "$4,500", "#REF!"],
                         ["V-1030", "#N/A", "$1,200", "#¡VALOR!"],
                         ["V-1031", "Empresa C", "#¡DIV/0!", "0"],
                         ["V-1032", "#N/A", "$3,400", "#REF!"],
                         ["V-1033", "Empresa E", "#¿NOMBRE?", "#¡VALOR!"],
                         ["V-1034", "Empresa F", "$8,900", "#REF!"],
                         ["V-1035", "#N/A", "#¡DIV/0!", "0"]
                       ].map((row, rIdx) => (
                         <tr key={rIdx} className="border-b border-gray-200">
                           <td className="bg-gray-100 border-r border-gray-300 text-gray-500 py-1.5">{rIdx + 1}</td>
                           {row.map((cell, cIdx) => (
                             <td key={cIdx} className={`border-r border-gray-200 p-1 truncate max-w-[80px] ${
                               cell.startsWith('#') ? 'text-red-600 font-bold bg-red-50/50' : 
                               rIdx === 0 ? 'font-bold bg-gray-50 text-gray-800' : 'text-gray-600'
                             }`}>
                               {cell}
                             </td>
                           ))}
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>

                {/* Loading / Stuck Overlay */}
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 flex flex-col items-center text-center max-w-[260px] animate-pulse">
                    <Loader2 className="w-10 h-10 text-[#107C41] animate-spin mb-4" />
                    <p className="text-[#107C41] font-bold text-sm mb-1">Calculando subprocesos...</p>
                    <p className="text-gray-500 text-xs mb-4">Excel (No responde)</p>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                       <div className="bg-[#107C41] h-full w-[45%]" />
                    </div>
                    <p className="text-gray-400 text-[10px] mt-3 font-mono">12.045.192 celdas evaluadas (45%)</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Warning 1 */}
              <motion.div 
                initial={{ x: -50, y: 50, opacity: 0, rotate: -15 }}
                whileInView={{ x: 0, y: 0, opacity: 1, rotate: -5 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                className="absolute -left-4 lg:-left-12 top-1/4 bg-red-500 text-white px-4 py-3 rounded-2xl shadow-xl z-20 flex items-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold text-xs sm:text-sm">¡Basta de Excel colgado!</span>
              </motion.div>

              {/* Floating Warning 2 */}
              <motion.div 
                initial={{ x: 50, y: -50, opacity: 0, rotate: 15 }}
                whileInView={{ x: 0, y: 0, opacity: 1, rotate: 4 }}
                transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
                className="absolute -right-2 lg:-right-8 bottom-1/4 bg-[#1E293B] border border-gray-700 p-3 rounded-2xl shadow-2xl z-20 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-xs sm:text-sm">Migra a Base de Datos</span>
                  <span className="text-gray-400 text-[10px] leading-tight">Nosotros te guiamos paso a paso</span>
                </div>
              </motion.div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
