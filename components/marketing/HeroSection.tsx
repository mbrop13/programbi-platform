"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Database } from "lucide-react";
import { FadeIn, CountUp } from "@/components/shared/AnimatedComponents";

/* ─── Modern Data Visual (Glassmorphism) ─── */
function ModernDataVisual() {
  return (
    <div className="relative w-full aspect-square lg:aspect-[4/3] flex items-center justify-center mt-10 lg:mt-0">
      {/* Background glowing orbs */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-10 lg:left-0 top-0 z-0 w-40 h-40 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute right-10 bottom-0 z-0 w-48 h-48 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl"
      />

      {/* Central Glass Card: Dashboard Abstraction */}
      <motion.div 
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-[420px] bg-white/70 backdrop-blur-2xl border border-white/80 shadow-2xl rounded-3xl p-6 lg:p-8"
        style={{ boxShadow: "0 20px 40px -10px rgba(24,144,255,0.15)" }}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h3 className="font-black text-gray-900 text-base">Rendimiento Global</h3>
            <p className="text-xs text-gray-500 font-semibold">Últimos 30 días</p>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            +24.5%
          </div>
        </div>

        {/* Abstract Bar Chart */}
        <div className="flex items-end justify-between h-36 gap-2 mb-6">
          {[40, 65, 45, 80, 55, 90, 100].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.1 + 0.5, type: "spring", stiffness: 60, damping: 15 }}
              className={`w-full rounded-t-lg relative group ${
                i === 6 
                  ? 'bg-gradient-to-t from-[#1890FF] to-indigo-500 shadow-lg shadow-blue-500/30' 
                  : 'bg-blue-100 hover:bg-blue-200 transition-colors'
              }`}
            >
              {i === 6 && (
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1890FF] text-white text-[10px] font-bold py-1 px-2 rounded-md whitespace-nowrap shadow-md">
                   Peak
                 </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="h-px w-full bg-gray-100 mb-4" />
        <div className="flex items-center justify-between text-xs font-bold text-gray-400">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mie</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sab</span>
          <span className="text-[#1890FF]">Dom</span>
        </div>
      </motion.div>

      {/* Floating Widget 1: Technology */}
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-2 lg:-right-8 top-12 lg:top-16 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
      >
        <div className="w-11 h-11 rounded-xl bg-[#F2C811]/15 flex items-center justify-center text-2xl">
          📊
        </div>
        <div className="pr-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Power BI</p>
          <p className="text-sm font-black text-gray-800">Master Level</p>
        </div>
      </motion.div>

      {/* Floating Widget 2: Data Science */}
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -left-2 lg:-left-12 bottom-16 lg:bottom-24 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
      >
        <div className="w-11 h-11 rounded-xl bg-[#3776AB]/15 flex items-center justify-center text-2xl">
          🐍
        </div>
        <div className="pr-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Python</p>
          <p className="text-sm font-black text-gray-800">Data Science</p>
        </div>
      </motion.div>
      
      {/* Floating Widget 3: SQL Database */}
      <motion.div
        animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
        className="absolute left-1/2 -translate-x-1/2 -top-6 lg:-top-10 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2"
      >
        <Database className="w-4 h-4 text-indigo-500" />
        <p className="text-xs font-bold text-gray-700">SQL Server & Cloud</p>
      </motion.div>
    </div>
  );
}

/* ─── MAIN HERO ─── */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-10 lg:py-20">
      {/* Bg decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundSize: "60px 60px",
            backgroundImage:
              "linear-gradient(to right, rgba(24,144,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,144,255,0.03) 1px, transparent 1px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] right-[10%] w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] bg-blue-50 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 relative z-10 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* ── Left Column ── */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Pill Badge */}
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#1890FF] text-xs sm:text-sm font-bold mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1890FF]" />
                </span>
                Clases en vivo online y presencial
              </div>
            </FadeIn>

            {/* Main Title */}
            <FadeIn delay={0.15}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 tracking-tight leading-tight lg:leading-[1.1] mb-8 font-display">
                Aprende Análisis de{" "}
                <br className="hidden lg:block" />
                Datos con{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">
                  Expertos
                </span>
              </h1>
            </FadeIn>

            {/* Subtitle */}
            <FadeIn delay={0.3}>
              <p className="text-lg lg:text-2xl text-gray-500 mb-10 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Capacitaciones diseñadas para profesionales que buscan potenciar su carrera con{" "}
                <strong className="text-gray-900 font-semibold">Power BI, Python, SQL, Excel y Big Data</strong>.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.45}>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link
                  href="/cursos/analisis-de-datos"
                  className="group px-8 py-5 sm:px-10 sm:py-6 rounded-2xl text-white font-bold text-xl sm:text-2xl flex items-center justify-center gap-4 no-underline transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, #1890FF 0%, #0050b3 100%)",
                    boxShadow: "0 12px 35px -8px rgba(24,144,255,0.4)",
                  }}
                >
                  <span>Cotiza Ahora</span>
                  <Briefcase className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </Link>
                <Link
                  href="/cursos"
                  className="px-8 py-5 sm:px-10 sm:py-6 rounded-2xl bg-white text-gray-700 font-bold text-xl sm:text-2xl border-2 border-gray-100 hover:border-[#1890FF] hover:text-[#1890FF] transition-all flex items-center justify-center gap-4 no-underline hover:-translate-y-1"
                >
                  <span>Ver Cursos</span>
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.6}>
              <div className="flex flex-wrap gap-8 lg:gap-12 mt-12 justify-center lg:justify-start">
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-gray-900">
                    +<CountUp target={5000} duration={2.5} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mt-1">Estudiantes</p>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-gray-900">
                    <CountUp target={10} duration={1.5} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mt-1">Cursos</p>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-gray-900">
                    <CountUp target={98} duration={2} suffix="%" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mt-1">Satisfacción</p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-5 relative w-full">
            <FadeIn delay={0.4} direction="left">
              <ModernDataVisual />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
