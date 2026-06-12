"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Briefcase, Database, Code, CheckCircle, BarChart2, Sparkles, Terminal, Play, Server, FileText } from "lucide-react";
import { FadeIn, CountUp } from "@/components/shared/AnimatedComponents";

/* ─── Modern Widescreen Data Visual (Video Pipeline) ─── */
const VIDEOS = [
  {
    id: "bi",
    title: "Power BI",
    icon: BarChart2,
    url: "https://mail.programbi.com/uploads/Dashboard_Power_BI_looks_better_202606112131.mp4",
    color: "text-emerald-600 border-emerald-500",
  },
  {
    id: "sql",
    title: "SQL Server",
    icon: Database,
    url: "https://mail.programbi.com/uploads/Base_de_datos_SQL_funcionando_202606112131.mp4",
    color: "text-blue-600 border-blue-500",
  },
  {
    id: "python",
    title: "Python Analytics",
    icon: Code,
    url: "https://mail.programbi.com/uploads/Python_code_looking_better_202606112131.mp4",
    color: "text-indigo-600 border-indigo-500",
  },
];

function ModernDataVisual() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    setActiveIndex((prev) => (prev + 1) % VIDEOS.length);
  };

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay was prevented or video is loading:", err);
      });
    }
  }, [activeIndex]);

  const activeVideo = VIDEOS[activeIndex];

  return (
    <div className="relative w-full flex items-center justify-end select-none">
      {/* Ambient background glowing blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-10 lg:left-0 top-0 z-0 w-52 h-52 bg-gradient-to-tr from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -15, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-10 bottom-0 z-0 w-56 h-56 bg-gradient-to-tr from-cyan-300/15 to-blue-300/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* Video Container (No browser frame, no floating, borderless, shadowless, rounded-3xl) */}
      <div className="relative z-10 w-full max-w-[760px] aspect-video rounded-3xl overflow-hidden lg:-ml-12 xl:-ml-20 bg-transparent">
        <div className="w-full h-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full"
            >
              <video
                ref={videoRef}
                src={activeVideo.url}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover mix-blend-multiply bg-transparent"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Liquid Glass Navigation Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] w-max">
          {VIDEOS.map((video, idx) => {
            const Icon = video.icon;
            const isActive = activeIndex === idx;
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => handleTabClick(idx)}
                className={`relative py-1.5 px-3.5 sm:px-5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap z-10 ${
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-r from-[#1890FF] to-blue-500 rounded-full -z-10 shadow-[0_4px_12px_rgba(24,144,255,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{video.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


/* ─── MAIN HERO ─── */
export default function HeroSection() {


  return (
    <section className="relative overflow-hidden pt-3 pb-2 lg:pt-6 lg:pb-4">
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

      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 relative z-10 pt-1 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* ── Left Column (6/12) ── */}
          <div className="lg:col-span-6 text-center lg:text-left relative z-20">
            {/* Pill Badge */}
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#1890FF] text-xs sm:text-sm font-bold mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1890FF]" />
                </span>
                <span>Clases en vivo online y presencial</span>
              </div>
            </FadeIn>

            {/* Main Title */}
            <FadeIn delay={0.15}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 tracking-tight leading-tight lg:leading-[1.1] mb-6 font-display">
                Aprende Análisis de <br className="hidden lg:block" />
                Datos con{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">
                  Expertos
                </span>
              </h1>
            </FadeIn>

            {/* Subtitle */}
            <FadeIn delay={0.3}>
              <p className="text-lg lg:text-2xl text-gray-500 mb-8 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
                Capacitaciones diseñadas para profesionales que buscan potenciar su carrera con <strong className="text-gray-900 font-semibold">Power BI, Python, SQL, Excel y Big Data</strong>.
              </p>
            </FadeIn>



            {/* CTAs */}
            <FadeIn delay={0.45}>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link
                  href="/cursos/analisis-de-datos"
                  className="group px-8 py-4 sm:px-10 sm:py-5 rounded-xl text-white font-bold text-[16px] sm:text-lg flex items-center justify-center gap-3 no-underline transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #1890FF 0%, #0050b3 100%)",
                    boxShadow: "0 12px 35px -8px rgba(24,144,255,0.4)",
                  }}
                >
                  <span>Cotiza Ahora</span>
                  <Briefcase className="w-5 h-5 group-hover:rotate-12 transition-transform text-white" />
                </Link>
                <Link
                  href="/cursos"
                  className="px-8 py-4 sm:px-10 sm:py-5 rounded-xl bg-white text-gray-700 font-bold text-[16px] sm:text-lg border border-gray-200 hover:border-[#1890FF] hover:text-[#1890FF] transition-all flex items-center justify-center gap-3 no-underline hover:-translate-y-1 shadow-sm hover:shadow"
                >
                  <span>Ver Cursos</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
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
                  <p className="text-sm text-gray-500 font-medium mt-1">Estudiantes egresados</p>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-gray-900">
                    <CountUp target={10} duration={1.5} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mt-1">Programas activos</p>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-black text-gray-900">
                    <CountUp target={98} duration={2} suffix="%" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mt-1">Tasa de satisfacción</p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Right Column (6/12) ── */}
          <div className="lg:col-span-6 relative w-full flex justify-end z-10">
            <FadeIn delay={0.4} direction="left" className="w-full">
              <ModernDataVisual />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
