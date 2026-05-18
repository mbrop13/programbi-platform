"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, Database, BarChart, Clock, Loader2, TableProperties, CheckCircle2, AlertTriangle } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/AnimatedComponents";

export default function AsesoriasPromoSection() {
  const [phase, setPhase] = useState<"working" | "loading" | "popup" | "discount">("working");

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("loading"), 2500);
    const timer2 = setTimeout(() => setPhase("popup"), 6500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden border-y border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <FadeIn>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold tracking-wide uppercase mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Mentoría 1 a 1 en vivo
              </span>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-[1.1] font-display">
                Desbloquea ese problema que te lleva <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">frenando días</span>.
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-xl">
                ¿Atascado con un modelo DAX complejo, una consulta SQL pesada o un script de Python que no corre? Agenda una sesión privada por hora y resolvamos tu problema técnico juntos en tiempo real.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <StaggerChildren className="grid sm:grid-cols-2 gap-4 mb-10">
                {[
                  { icon: <Database className="w-5 h-5 text-emerald-500" />, text: "Optimización SQL" },
                  { icon: <BarChart className="w-5 h-5 text-blue-500" />, text: "Modelado Power BI & DAX" },
                  { icon: <Code className="w-5 h-5 text-amber-500" />, text: "Scripts de Python & ETL" },
                  { icon: <Clock className="w-5 h-5 text-purple-500" />, text: "Sesiones de 1 o más horas" },
                ].map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm transition-shadow hover:shadow-md">
                      <div className="p-2 rounded-lg bg-gray-50 shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-gray-700 font-bold text-sm">{item.text}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </FadeIn>
          </div>

          {/* Right Visual Element (Excel Mockup) */}
          <div className="relative mt-12 lg:mt-0 lg:h-[600px] flex items-center justify-center w-full overflow-hidden">
            <FadeIn delay={0.3} className="w-full relative">
              
              {/* Main Excel Mockup Window */}
              <motion.div 
                className="relative w-full max-w-2xl mx-auto bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden"
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
                  <div className={`flex-1 border border-gray-200 rounded px-2 py-1 font-mono truncate ${phase === "working" ? "bg-gray-50 text-gray-700" : "bg-red-50 text-red-600"}`}>
                     {phase === "working" ? "=BUSCARV(A2, Ventas_Mes, 3, FALSO)" : "=BUSCARV(A2, 'C:\\Users\\Admin\\[BD_Gigante.xlsx]Hoja1'!$A$1:$Z$1048576, 25, FALSO) * COINCIDIR(#REF!)"}
                  </div>
                </div>

                {/* Excel Grid */}
                <div className="bg-white text-[11px] sm:text-xs font-mono select-none h-[280px] overflow-x-auto">
                  <table className="w-full text-center border-collapse min-w-[450px] sm:min-w-full">
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
                               (phase !== "working" && cell.startsWith('#')) ? 'text-red-600 font-bold bg-red-50/50' : 
                               rIdx === 0 ? 'font-bold bg-gray-50 text-gray-800' : 'text-gray-600'
                             }`}>
                               {phase === "working" && rIdx > 0 && (cIdx === 1 || cIdx === 2 || cIdx === 3) 
                                 ? <span className="text-gray-300 italic animate-pulse">Cargando...</span> 
                                 : cell}
                             </td>
                           ))}
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>

                {/* Overlays */}
                <AnimatePresence>
                  {/* Loading State Overlay */}
                  {(phase === "loading" || phase === "popup" || phase === "discount") && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10"
                    >
                      {phase === "loading" && (
                        <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-6 flex flex-col items-center text-center max-w-[260px]">
                          <Loader2 className="w-10 h-10 text-[#107C41] animate-spin mb-4" />
                          <p className="text-[#107C41] font-bold text-sm mb-1">Calculando subprocesos...</p>
                          <p className="text-gray-500 text-xs mb-4">Excel (No responde)</p>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                            <div className="bg-[#107C41] h-full w-[45%]" />
                          </div>
                          <p className="text-gray-400 text-[10px] mt-3 font-mono">12.045.192 celdas evaluadas (45%)</p>
                        </div>
                      )}

                      {/* Popup 1 */}
                      {phase === "popup" && (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0, y: 10 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          className="bg-white border border-gray-300 shadow-2xl rounded-sm w-[340px] overflow-hidden flex flex-col"
                        >
                          <div className="bg-gray-100 border-b border-gray-300 px-3 py-2 flex justify-between items-center text-xs text-gray-700">
                            <span>Microsoft Excel</span>
                            <div className="w-3 h-3 border border-gray-400 bg-red-500 flex items-center justify-center text-[8px] text-white cursor-pointer font-bold hover:bg-red-600">x</div>
                          </div>
                          <div className="p-6 flex flex-col items-center text-center">
                            <AlertTriangle className="w-10 h-10 text-amber-500 mb-4" />
                            <p className="text-gray-800 font-medium text-sm leading-relaxed mb-6">
                              ¿Cansado de quedarte hasta tarde actualizando Excel para la reunión de mañana?
                            </p>
                            <button 
                              onClick={() => setPhase("discount")}
                              className="px-6 py-1.5 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded-sm text-sm text-gray-800 transition-colors shadow-sm font-semibold"
                            >
                              Sí
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Discount Popup */}
                      {phase === "discount" && (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0, y: 10 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          className="bg-white border border-blue-200 shadow-2xl rounded-2xl w-[340px] overflow-hidden flex flex-col relative"
                        >
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                          <div className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h4 className="text-gray-900 font-black text-lg mb-2">¡Solo por eso!</h4>
                            <p className="text-blue-600 font-bold text-xl mb-2">40% de descuento</p>
                            <p className="text-gray-500 text-sm mb-6">
                              En asesorías para tu primera compra. ¡Agenda hoy mismo!
                            </p>
                            <Link 
                              href="/asesorias"
                              className="w-full px-6 py-3 bg-[#1890FF] hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                            >
                              Agendar Mentoría
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
