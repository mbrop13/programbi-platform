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
    <div className="relative w-full flex items-center justify-center select-none">
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

      {/* Widescreen Browser Mockup */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-[520px] aspect-[16/11] bg-white/75 backdrop-blur-2xl border border-white/80 rounded-[1.8rem] overflow-hidden shadow-[0_25px_65px_rgba(24,144,255,0.12)] flex flex-col"
        style={{ aspectRatio: "16/11" }}
      >
        {/* Browser Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/90 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="bg-gray-50 border border-gray-100/50 rounded-lg px-6 py-0.5 text-[9px] text-gray-400 font-mono flex items-center gap-1">
            <span className="text-gray-300">https://</span>
            <span className="text-gray-600 font-medium">campus.programbi.com</span>
          </div>
          <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-bold text-[#1890FF]">
            JD
          </div>
        </div>

        {/* Tab Selector inside mock app */}
        <div className="flex border-b border-gray-100 bg-white/40 shrink-0">
          {VIDEOS.map((video, idx) => {
            const Icon = video.icon;
            const isActive = activeIndex === idx;
            const activeColorClasses = video.color.split(" ");
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => handleTabClick(idx)}
                className={`flex-1 py-2.5 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  isActive
                    ? `bg-white ${activeColorClasses[0]} border-b-2 ${activeColorClasses[1]} shadow-sm`
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {video.title}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-hidden bg-slate-950 relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              <video
                ref={videoRef}
                src={activeVideo.url}
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* ── Left Column (7/12) ── */}
          <div className="lg:col-span-7 text-center lg:text-left">
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

          {/* ── Right Column (5/12) ── */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <FadeIn delay={0.4} direction="left" className="w-full">
              <ModernDataVisual />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
