"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Code, 
  Database, 
  BarChart, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Layers
} from "lucide-react";

// Mentoring slides configuration with specific themes and bullet lists
const SLIDES = [
  {
    id: "power-bi",
    subtitle: "Modelado & Reportes",
    title: "Modelado de Datos & Fórmulas DAX",
    description: "¿Atascado con cálculo de acumulados, relaciones complejas o rendimiento lento en tus tableros? Optimizamos tu modelo de datos y diseñamos medidas DAX limpias juntos.",
    icon: <BarChart className="w-4 h-4 text-blue-400" />,
    video: "https://mail.programbi.com/uploads/Excel_common_errors_video_202606021709.mp4",
    bullets: [
      "Medidas DAX Avanzadas",
      "Esquemas Estrella & Copo de Nieve",
      "Optimización de Consultas",
      "Modelado Tabular Limpio"
    ],
    theme: {
      glow: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.05) 50%, transparent 100%)",
      badgeBg: "bg-blue-500/10 border-blue-500/20",
      badgeText: "text-blue-400",
      activeDot: "bg-blue-500",
      textAccent: "text-blue-400",
      btnBg: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
    }
  },
  {
    id: "sql",
    subtitle: "Bases de Datos & ETL",
    title: "SQL y Optimización de Consultas",
    description: "¿Tus queries tardan minutos en responder o necesitas ayuda con joins complejos, subconsultas y funciones de ventana? Diseñemos la estructura ideal en Postgres, SQL Server o BigQuery.",
    icon: <Database className="w-4 h-4 text-emerald-400" />,
    video: "https://mail.programbi.com/uploads/Excel_common_errors_video_202606021709.mp4",
    bullets: [
      "Joins & Funciones de Ventana",
      "Indexación & Query Tuning",
      "Estructuración de Tablas",
      "Procedimientos Almacenados"
    ],
    theme: {
      glow: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(20,184,166,0.05) 50%, transparent 100%)",
      badgeBg: "bg-emerald-500/10 border-emerald-500/20",
      badgeText: "text-emerald-400",
      activeDot: "bg-emerald-500",
      textAccent: "text-[#00E676]",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
    }
  },
  {
    id: "python",
    subtitle: "Automatización & ETL",
    title: "Python y Automatización de Procesos",
    description: "¿Necesitas extraer datos de una API, limpiar archivos con Pandas o programar un script para que corra todos los días en la nube? Creamos soluciones robustas de código.",
    icon: <Code className="w-4 h-4 text-amber-400" />,
    video: "https://mail.programbi.com/uploads/Excel_common_errors_video_202606021709.mp4",
    bullets: [
      "Extracción de APIs & Scraping",
      "Limpieza de Datos con Pandas",
      "Scripts de Automatización (.py)",
      "Despliegue en Servidores/Nube"
    ],
    theme: {
      glow: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(249,115,22,0.05) 50%, transparent 100%)",
      badgeBg: "bg-amber-500/10 border-amber-500/20",
      badgeText: "text-amber-400",
      activeDot: "bg-amber-500",
      textAccent: "text-amber-400",
      btnBg: "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
    }
  },
  {
    id: "pipelines",
    subtitle: "Ingeniería de Datos",
    title: "Arquitectura de Datos y Pipelines",
    description: "Conecta tus orígenes de datos, automatiza flujos de extracción y almacena la información de forma segura. Te ayudamos a estructurar una base sólida para tu analítica.",
    icon: <Layers className="w-4 h-4 text-purple-400" />,
    video: "https://mail.programbi.com/uploads/Excel_common_errors_video_202606021709.mp4",
    bullets: [
      "Pipelines Automatizados",
      "Integración Multi-plataforma",
      "Data Warehousing Moderno",
      "Monitoreo de Errores"
    ],
    theme: {
      glow: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.05) 50%, transparent 100%)",
      badgeBg: "bg-purple-500/10 border-purple-500/20",
      badgeText: "text-purple-400",
      activeDot: "bg-purple-500",
      textAccent: "text-purple-400",
      btnBg: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
    }
  }
];

export default function AsesoriasPromoSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play cycle every 6 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [index, isPaused]);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "15%" : "-15%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "15%" : "-15%",
      opacity: 0,
    }),
  };

  const current = SLIDES[index];

  return (
    <section className="pt-8 pb-12 lg:pt-12 lg:pb-16 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 relative z-10">
        
        {/* Slider Main Container Card */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full rounded-[2.5rem] border border-slate-800 bg-slate-950/95 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.4)] p-6 sm:p-10 md:p-12 lg:p-16 select-none"
        >
          {/* Dynamic Ambient Glow Backdrop */}
          <motion.div 
            animate={{ background: current.theme.glow }} 
            transition={{ duration: 1 }}
            className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-40 pointer-events-none z-0" 
          />
          <motion.div 
            animate={{ background: current.theme.glow }} 
            transition={{ duration: 1 }}
            className="absolute -left-20 -bottom-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-25 pointer-events-none z-0" 
          />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none z-0" />

          {/* Slider Content Wrapper */}
          <div className="relative z-10 w-full min-h-[480px] flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 260, damping: 28 },
                  opacity: { duration: 0.25 },
                }}
                className="w-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                  
                  {/* Left Column - Service details */}
                  <div className="lg:col-span-7 text-left flex flex-col">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold tracking-wide uppercase mb-6 shadow-sm w-fit transition-colors duration-1000 ${current.theme.badgeBg} ${current.theme.badgeText}`}>
                      <span className={`w-2 h-2 rounded-full ${current.theme.activeDot} animate-pulse`} />
                      {current.subtitle}
                    </span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight font-sans">
                      {current.title}
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed mb-8 max-w-xl font-sans font-medium">
                      {current.description}
                    </p>

                    {/* Features list */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      {current.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-slate-900/30 border border-slate-800/40 rounded-xl p-3.5 shadow-sm hover:border-slate-700/80 transition-all hover:bg-slate-900/60 group">
                          <div className="p-1.5 rounded-lg bg-slate-800/80 shrink-0 transition-transform duration-300 group-hover:scale-110">
                            {current.icon}
                          </div>
                          <span className="text-slate-200 font-bold text-xs sm:text-sm font-sans">{bullet}</span>
                        </div>
                      ))}
                    </div>

                    {/* Call to Action */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href="/asesorias"
                        className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-[14px] sm:text-[15px] transition-all shadow-lg hover:-translate-y-0.5 no-underline font-sans cursor-pointer ${current.theme.btnBg}`}
                      >
                        <span>Agendar una Mentoría en Vivo</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column - Premium Browser Mockup */}
                  <div className="lg:col-span-5 relative flex items-center justify-center w-full">
                    <div className="w-full relative">
                      <div className="relative w-full aspect-[16/10] bg-slate-950 border border-slate-800 rounded-[1.8rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                        
                        {/* Browser Header Bar */}
                        <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-900/80 border-b border-slate-800/80">
                          <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                          <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                          <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                          <div className="ml-4 px-3 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-[9px] font-mono text-slate-500 tracking-wide select-none">
                            programbi.com/diagnostico
                          </div>
                        </div>
                        
                        {/* Video Container */}
                        <div className="absolute inset-x-0 bottom-0 top-[37px] bg-slate-950 flex items-center justify-center overflow-hidden">
                          {/* Grid layout */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-10" />
                          
                          {/* Dynamic loader */}
                          <div className={`absolute inset-0 bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0B0F19] flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 ${
                            isVideoLoaded ? "opacity-0" : "opacity-100"
                          }`}>
                            <div className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 mb-3 animate-pulse">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] text-slate-550 font-mono tracking-widest uppercase">Diagnóstico...</span>
                          </div>

                          <video
                            src={current.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            onPlay={() => setIsVideoLoaded(true)}
                            onLoadedData={() => setIsVideoLoaded(true)}
                            className={`w-full h-full object-cover transition-opacity duration-1000 ease-out pointer-events-none ${
                              isVideoLoaded ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          
                          {/* Subtle shade */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent h-12 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating Navigation Arrows (Desktop only) */}
          <button
            onClick={handlePrev}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-white items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-white items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Dots and Indicators */}
        <div className="flex justify-center gap-2.5 mt-8 select-none">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer p-0 border-none ${
                i === index 
                  ? `w-8 ${current.theme.activeDot}` 
                  : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
              title={`Diapositiva ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
