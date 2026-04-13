"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FileSpreadsheet, PieChart, Bot, Check } from "lucide-react";
import { FadeIn, CountUp } from "@/components/shared/AnimatedComponents";

const quizSteps = [
  {
    title: "Diagnóstico Rápido",
    subtitle: "¿Cuál es tu principal dolor hoy?",
    options: [
      { label: "Hago reportes manuales en Excel", icon: <FileSpreadsheet size={22} />, color: "bg-green-50 text-green-500", value: "reportes" },
      { label: "Tengo datos pero no sé visualizarlos", icon: <PieChart size={22} />, color: "bg-yellow-50 text-yellow-600", value: "visual" },
      { label: "Quiero automatizar tareas repetitivas", icon: <Bot size={22} />, color: "bg-blue-50 text-blue-500", value: "auto" },
    ],
  },
  {
    title: "¿Tu nivel actual?",
    subtitle: "Sé honesto/a para una mejor recomendación.",
    options: [
      { label: "Principiante (Desde cero)", value: "basico" },
      { label: "Intermedio (Usuario regular)", value: "medio" },
      { label: "Avanzado (Busco especialización)", value: "avanzado" },
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

/* ─── Progress Bars ─── */
function AnimatedBar({ label, value, color, labelRight }: { label: string; value: number; color: string; labelRight: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setWidth(value), 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="mb-6">
      <div className="flex justify-between mb-2 text-sm font-bold">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-400">{labelRight}</span>
      </div>
      <div className="w-full h-12 bg-gray-100 rounded-xl overflow-hidden relative">
        <motion.div
          className={`h-full rounded-xl flex items-center justify-end pr-5 text-white font-extrabold text-sm ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {width > 30 && labelRight}
        </motion.div>
      </div>
    </div>
  );
}

export default function DiagnosticSection() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

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
    <section className="py-16 lg:py-24 bg-white border-b border-[#F1F5F9]">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Bars */}
          <div className="text-center lg:text-left">
            <FadeIn>
              <div className="inline-block bg-green-100 text-green-700 px-5 py-2 rounded-full font-bold text-xs tracking-widest uppercase mb-8">
                Resultados Comprobados
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6 font-display">
                ¿Por qué capacitarse <br />en{" "}
                <span className="text-[#1890FF]">Datos?</span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-500 leading-relaxed mb-10">
                La diferencia entre la intuición y la estrategia es el análisis de datos. Mira el impacto promedio en la carrera de nuestros alumnos.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner text-left">
                <AnimatedBar label="Sin Capacitación" value={40} color="bg-gray-300" labelRight="Eficiencia: 40%" />
                <AnimatedBar label="Con Excel Avanzado" value={65} color="bg-green-500" labelRight="Eficiencia: 65%" />
                <AnimatedBar label="Power BI + Python" value={95} color="bg-[#1890FF]" labelRight="Automatización Total 🚀" />
              </div>
            </FadeIn>
          </div>

          {/* Right: Quiz */}
          <FadeIn delay={0.3}>
            <div
              className="bg-white border border-[#E2E8F0] rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative"
              style={{ boxShadow: "0 40px 100px -20px rgba(24,144,255,0.12)" }}
            >
              {/* Progress */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-12 overflow-hidden">
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
                    <h3 className="text-3xl font-black text-gray-900 mb-3 font-display">
                      {quizSteps[step].title}
                    </h3>
                    <p className="text-lg text-gray-500 mb-10">{quizSteps[step].subtitle}</p>

                    <div className="space-y-4">
                      {quizSteps[step].options.map((opt: any) => (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => handleSelect(opt.value)}
                          className="flex items-center w-full p-5 border-2 border-gray-100 rounded-2xl bg-white text-left transition-all hover:border-[#1890FF] hover:bg-[#F8FAFF] hover:translate-x-2 cursor-pointer active:scale-95"
                        >
                          {"icon" in opt && opt.icon && (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-5 ${opt.color}`}>
                              {opt.icon}
                            </div>
                          )}
                          <span className="font-bold text-lg text-gray-800">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 shadow-sm">
                      <Check size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-3 font-display">
                      ¡Ruta Encontrada!
                    </h3>
                    <p className="text-base text-gray-500 mb-8">
                      Según tus respuestas, recomendamos:
                    </p>

                    <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-8 mb-10">
                      <h4 className="text-2xl font-black text-[#1890FF] mb-2">{result?.title}</h4>
                      <p className="text-base text-gray-600">{result?.desc}</p>
                    </div>

                    <Link
                      href={result?.link || "/cursos"}
                      className="block w-full py-4 rounded-xl bg-[#1890FF] text-white font-bold text-lg hover:bg-blue-800 transition-all shadow-md no-underline"
                    >
                      Ver Temario & Precios
                    </Link>
                    <button
                      onClick={resetQuiz}
                      className="mt-6 bg-transparent border-none text-gray-400 text-sm underline cursor-pointer hover:text-gray-600"
                    >
                      Volver a empezar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
