"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FileSpreadsheet, PieChart, Bot, Check, ArrowRight, Sparkles, Clock, AlertCircle, BarChart2 } from "lucide-react";
import { FadeIn, CountUp } from "@/components/shared/AnimatedComponents";

const quizSteps = [
  {
    title: "Diagnóstico Rápido",
    subtitle: "¿Cuál es tu principal desafío hoy con los datos?",
    options: [
      { 
        label: "Hago reportes manuales en Excel", 
        desc: "Dedico horas a copiar, pegar y limpiar planillas repetitivas.",
        icon: <FileSpreadsheet size={18} />, 
        color: "bg-emerald-50 text-emerald-600 border-emerald-150/40", 
        value: "reportes" 
      },
      { 
        label: "Tengo datos pero no sé visualizarlos", 
        desc: "Me cuesta contar historias claras y dinámicas con mis KPIs.",
        icon: <PieChart size={18} />, 
        color: "bg-amber-50 text-amber-600 border-amber-100/50", 
        value: "visual" 
      },
      { 
        label: "Quiero automatizar tareas repetitivas", 
        desc: "Busco optimizar mis tiempos con scripts o procesos autónomos.",
        icon: <Bot size={18} />, 
        color: "bg-blue-50 text-blue-600 border-blue-100/50", 
        value: "auto" 
      },
    ],
  },
  {
    title: "¿Cuál es tu nivel actual?",
    subtitle: "Sé honesto/a para recomendarte el mejor punto de partida.",
    options: [
      { 
        label: "Principiante (Desde cero)", 
        desc: "No tengo experiencia previa en bases de datos o programación.",
        value: "basico" 
      },
      { 
        label: "Intermedio (Usuario regular)", 
        desc: "Manejo fórmulas complejas, filtros y algunas tablas dinámicas.",
        value: "medio" 
      },
      { 
        label: "Avanzado (Especialización)", 
        desc: "Busco dominar modelos complejos, IA avanzada o Python profesional.",
        value: "avanzado" 
      },
    ],
  },
];

const results: Record<string, { title: string; desc: string; link: string }> = {
  "reportes-basico": { title: "Análisis de Datos 360°", desc: "El programa integral que te lleva de Excel a Power BI y Python.", link: "/cursos/analisis-de-datos" },
  "reportes-medio": { title: "Power BI Expert", desc: "Ideal para dejar los reportes manuales y crear dashboards.", link: "/cursos/power-bi" },
  "reportes-avanzado": { title: "Analítica Financiera", desc: "Tu nivel te permite pasar directo a especialización.", link: "/cursos/analitica-financiera" },
  "visual-basico": { title: "Power BI Expert", desc: "Aprende a transformar datos en visualizaciones impactantes.", link: "/cursos/power-bi" },
  "visual-medio": { title: "Python para Datos", desc: "Lleva tus visualizaciones al siguiente nivel con Python.", link: "/cursos/python" },
  "visual-avanzado": { title: "Machine Learning", desc: "Crea modelos predictivos con visualización avanzada.", link: "/cursos/machine-learning" },
  "auto-basico": { title: "Power Automate & RPA", desc: "El mejor primer paso para automatizar procesos.", link: "/cursos/power-automate" },
  "auto-medio": { title: "IA en Productividad", desc: "Automatiza con IA, Prompt Engineering y Agentes.", link: "/cursos/ia-productividad" },
  "auto-avanzado": { title: "Machine Learning", desc: "Automatización inteligente con modelos predictivos.", link: "/cursos/machine-learning" },
};

/* ─── Premium SVG Circular Gauge ─── */
function GaugeCircle({ percentage, strokeColor, label }: { percentage: number; strokeColor: string; label: string }) {
  const radius = 40;
  const strokeWidth = 5.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center shrink-0 select-none">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-slate-100"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            className={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black text-slate-900 leading-none">{percentage}%</span>
          <span className="text-[8px] text-slate-400 font-extrabold mt-0.5 uppercase tracking-wider">{label}</span>
        </div>
      </div>
    </div>
  );
}

export default function DiagnosticSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [workflowMode, setWorkflowMode] = useState<"tradicional" | "programbi">("programbi");

  const handleSelect = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    setStep(step + 1);
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers([]);
  };

  const resultKey = answers.length === 2 ? `${answers[0]}-${answers[1]}` : null;
  const result = resultKey ? results[resultKey] || results["reportes-basico"] : null;
  const progress = step === 0 ? 33 : step === 1 ? 66 : 100;

  return (
    <section className="pt-6 pb-16 lg:pt-8 lg:pb-24 bg-gradient-to-b from-slate-50/80 to-white border-b border-[#F1F5F9] relative overflow-hidden">
      {/* Background visual lights */}
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-blue-500/2 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-emerald-500/2 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Productivity Dashboard Info */}
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col gap-6">
            <FadeIn>
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1890FF] font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full mb-5 border border-blue-100/50 shadow-sm">
                <BarChart2 size={12} className="text-[#1890FF]" /> La Ventaja de los Datos
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-[44px] font-black text-slate-900 leading-tight mb-4 font-display tracking-tight">
                ¿Por qué capacitarse <br className="hidden lg:block" />en{" "}
                <span className="text-[#1890FF]">Datos?</span>
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-lg mb-2 font-sans">
                Las empresas ya no buscan intuición. Buscan profesionales que dominen el lenguaje de los datos y transformen información en decisiones.
              </p>
            </FadeIn>

            {/* Market Urgency Stats Block */}
            <FadeIn delay={0.12}>
              <div className="grid grid-cols-3 gap-3 mb-2 text-left">
                {[
                  { value: 1.4, suffix: "M", label: "Empleos en datos sin cubrir globalmente", decimals: 1 },
                  { value: 85, prefix: "+", suffix: "%", label: "Incremento salarial post-certificación" },
                  { value: 72, suffix: "%", label: "De empresas priorizan talento en datos" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-xl md:text-2xl font-black font-mono tracking-tight text-slate-900 leading-none mb-1">
                      <CountUp target={item.value} prefix={item.prefix} suffix={item.suffix} decimals={item.decimals} />
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold leading-normal font-sans">{item.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Premium Workflow Toggle Switcher */}
            <FadeIn delay={0.2}>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-xs mx-auto lg:mx-0 border border-slate-200/40 select-none">
                <button
                  onClick={() => setWorkflowMode("tradicional")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-none outline-none ${
                    workflowMode === "tradicional" 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Clock size={13} />
                  <span>Método Manual</span>
                </button>
                <button
                  onClick={() => setWorkflowMode("programbi")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border-none outline-none ${
                    workflowMode === "programbi" 
                      ? "bg-[#1890FF] text-white shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Bot size={13} />
                  <span>Método ProgramBI</span>
                </button>
              </div>
            </FadeIn>

            {/* Clean Visual Dashboard Card Mockup */}
            <FadeIn delay={0.3}>
              <div className="bg-slate-50 border border-slate-200/60 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Left: Task check list */}
                  <div className="flex-1 flex flex-col gap-4 text-left w-full">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      Flujo de Trabajo diario
                    </span>
                    <AnimatePresence mode="wait">
                      {workflowMode === "tradicional" ? (
                        <motion.div 
                          key="tradicional-flow" 
                          initial={{ opacity: 0, y: 5 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col gap-3"
                        >
                          {[
                            "Copiar y pegar reportes de múltiples fuentes.",
                            "Corregir fórmulas rotas e inconsistencias manuales.",
                            "Cruzamiento lento de planillas celda por celda."
                          ].map((text, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
                                <AlertCircle size={12} />
                              </div>
                              <span className="text-xs font-bold text-slate-600 leading-snug">{text}</span>
                            </div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="programbi-flow" 
                          initial={{ opacity: 0, y: 5 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col gap-3"
                        >
                          {[
                            "Conexión e importación automática de tus datos.",
                            "Modelamiento inteligente y limpieza libre de errores.",
                            "Tableros interactivos actualizados en tiempo real."
                          ].map((text, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1890FF] shrink-0 mt-0.5">
                                <Check size={12} className="stroke-[3]" />
                              </div>
                              <span className="text-xs font-bold text-slate-700 leading-snug">{text}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right: SVG Circle progress gauge */}
                  <AnimatePresence mode="wait">
                    {workflowMode === "tradicional" ? (
                      <motion.div 
                        key="tradicional-gauge" 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <GaugeCircle percentage={40} strokeColor="stroke-rose-500" label="Eficiencia" />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="programbi-gauge" 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <GaugeCircle percentage={95} strokeColor="stroke-blue-500" label="Eficiencia" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
            </FadeIn>

            {/* Premium Stats Grid */}
            <FadeIn delay={0.45}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { target: 15, prefix: "+", suffix: "h", label: "Tiempo liberado semanalmente", textColor: "" },
                  { target: 3.5, decimals: 1, suffix: "x", label: "Velocidad de reportabilidad", textColor: "text-[#1890FF]" },
                  { target: 92, suffix: "%", label: "Reducción de errores manuales", textColor: "text-emerald-600" }
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className="bg-white border border-slate-150/70 hover:border-blue-200 p-4 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.015)] transition-all duration-300 text-left"
                  >
                    <div className={`text-xl md:text-2xl font-black leading-none mb-1 font-mono tracking-tight ${stat.textColor}`}>
                      <CountUp target={stat.target} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold leading-normal font-sans">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right Column: AI Smart Advisor Console */}
          <div className="lg:col-span-6 w-full relative">
            {/* Background glowing blob */}
            <div className="absolute -inset-4 z-0 bg-gradient-to-tr from-blue-300/10 to-indigo-300/10 rounded-[2.5rem] blur-3xl opacity-60 pointer-events-none" />
            
            <FadeIn delay={0.3} className="relative z-10">
              <div
                className="bg-white border border-slate-150 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.04)]"
              >
                {/* Advisor Top Bar */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 select-none">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1890FF]"></span>
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1890FF] bg-blue-50/50 px-2.5 py-1 rounded-full border border-blue-100/50 shadow-sm">
                      Asistente de Ruta
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
                      Progreso: {progress}%
                    </span>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1 bg-slate-100 rounded-full mb-8 overflow-hidden select-none">
                  <motion.div
                    className="h-full bg-[#1890FF]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {step < 2 ? (
                    <motion.div
                      key={`step-${step}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-black text-slate-900 mb-2 font-display tracking-tight">
                        {quizSteps[step].title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-8 font-sans">{quizSteps[step].subtitle}</p>

                      <div className="space-y-3.5">
                        {quizSteps[step].options.map((opt: any) => (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className="group relative flex items-center w-full p-4 border border-slate-200/80 rounded-2xl bg-white text-left transition-all hover:border-[#1890FF] hover:bg-slate-50/50 hover:shadow-lg hover:shadow-blue-500/[0.02] hover:translate-x-1 cursor-pointer active:scale-98 select-none"
                          >
                            {"icon" in opt && opt.icon && (
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 border border-slate-200/50 shadow-sm transition-all group-hover:scale-105 group-hover:border-transparent ${opt.color} shrink-0`}>
                                {opt.icon}
                              </div>
                            )}
                            <div className="flex flex-col text-left">
                              <span className="font-extrabold text-slate-800 text-sm tracking-tight">{opt.label}</span>
                              {opt.desc && <span className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-tight">{opt.desc}</span>}
                            </div>
                            <div className="ml-auto w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-[#1890FF] group-hover:text-[#1890FF] group-hover:bg-blue-50 transition-all shrink-0">
                              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-100 shadow-sm">
                        <Check size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1 font-display tracking-tight">
                        ¡Ruta Encontrada!
                      </h3>
                      <p className="text-[10px] text-slate-400 font-extrabold mb-6 uppercase tracking-wider">
                        Recomendación personalizada basada en tu perfil
                      </p>

                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white text-left shadow-lg shadow-blue-500/10 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                        <span className="inline-block bg-white/20 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded mb-3 font-mono">
                          Programa Recomendado
                        </span>
                        <h4 className="text-xl font-black mb-1.5 font-display tracking-tight">{result?.title}</h4>
                        <p className="text-[11px] text-blue-50/90 leading-relaxed font-sans">{result?.desc}</p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Link
                          href={result?.link || "/cursos"}
                          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#1890FF] hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/10 hover:-translate-y-0.5 no-underline font-sans"
                        >
                          <span>Ver Temario & Precios</span>
                          <ArrowRight size={14} />
                        </Link>
                        
                        <Link
                          href="https://wa.me/56936776614"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-sm transition-all no-underline font-sans"
                        >
                          <span>Hablar con un asesor</span>
                        </Link>
                      </div>

                      <button
                        onClick={resetQuiz}
                        className="mt-6 bg-transparent border-none text-slate-400 text-xs font-semibold underline cursor-pointer hover:text-slate-600"
                      >
                        Comenzar de nuevo
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
