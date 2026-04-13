"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Play, Briefcase } from "lucide-react";
import { FadeIn, CountUp } from "@/components/shared/AnimatedComponents";
import { heroVideos } from "@/lib/data/images";

/* ─── Typing code animation ─── */
const codeLines = [
  { text: "import pandas as pd", cls: "text-[#c586c0]" },
  { text: "import matplotlib.pyplot as plt", cls: "text-[#c586c0]" },
  { text: "", cls: "" },
  { text: "# Conectar a base de datos empresarial", cls: "text-[#6a9955]" },
  { text: 'df = pd.read_sql("SELECT * FROM ventas", conn)', cls: "text-[#9cdcfe]" },
  { text: "", cls: "" },
  { text: "# Análisis exploratorio", cls: "text-[#6a9955]" },
  { text: "resumen = df.groupby('region')['monto'].sum()", cls: "text-[#9cdcfe]" },
  { text: "", cls: "" },
  { text: "resumen.plot(kind='bar', color='#1890FF')", cls: "text-[#9cdcfe]" },
  { text: "plt.title('Ventas por Región 2026')", cls: "text-[#ce9178]" },
  { text: "", cls: "" },
  { text: "✓ Dashboard generado exitosamente", cls: "text-[#4ec9b0]" },
];

function TypingCode() {
  const [visibleLines, setVisibleLines] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= codeLines.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={ref} className="code-editor">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1e1e1e] border-b border-[#333] rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[#858585] text-xs font-mono">analisis_datos.py</span>
        <div className="w-16" />
      </div>
      {/* Code Content */}
      <div className="bg-[#1e1e1e] p-5 rounded-b-2xl font-mono text-sm leading-relaxed overflow-hidden min-h-[280px] lg:min-h-[340px]">
        {codeLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`${line.cls} ${!line.text ? "h-5" : ""}`}
          >
            {line.text}
          </motion.div>
        ))}
        {visibleLines < codeLines.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2.5 h-5 bg-[#569cd6] ml-0.5"
          />
        )}
      </div>
    </div>
  );
}

/* ─── Floating Tech Tags ─── */
const techTags = [
  { label: "Power BI", icon: "📊", x: "right-0 top-4", delay: 0.8 },
  { label: "Python", icon: "🐍", x: "right-4 top-1/2", delay: 1.2 },
  { label: "SQL Server", icon: "🗄️", x: "left-0 bottom-8", delay: 1.5 },
];

/* ─── Video Carousel ─── */
function VideoCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % heroVideos.length), 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
        >
          <iframe
            src={`https://www.youtube.com/embed/${heroVideos[active].id}?rel=0&modestbranding=1`}
            title={heroVideos[active].title}
            allow="fullscreen"
            loading="lazy"
            className="w-full h-full"
          />
        </motion.div>
      </AnimatePresence>
      <p className="text-center text-lg font-bold text-gray-900 mt-4">
        {heroVideos[active].title}
      </p>
      <div className="flex justify-center gap-3 mt-4">
        {heroVideos.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-[#1890FF]" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── TABS: Code / Video ─── */
function HeroVisual() {
  const [tab, setTab] = useState<"code" | "video">("code");

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("code")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            tab === "code"
              ? "bg-[#1890FF] text-white shadow-lg shadow-blue-500/20"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          &lt;/&gt; Código
        </button>
        <button
          onClick={() => setTab("video")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            tab === "video"
              ? "bg-[#1890FF] text-white shadow-lg shadow-blue-500/20"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <Play size={14} /> Video
        </button>
      </div>
      <AnimatePresence mode="wait">
        {tab === "code" ? (
          <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="relative">
              <TypingCode />
              {techTags.map((tag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: tag.delay, type: "spring" }}
                  className={`absolute ${tag.x} hidden lg:flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-lg border border-gray-100 text-sm font-bold text-gray-700`}
                >
                  <span>{tag.icon}</span> {tag.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <VideoCarousel />
          </motion.div>
        )}
      </AnimatePresence>
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
                  href="#contacto"
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
                    +<CountUp target={1500} duration={2.5} />
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
              <HeroVisual />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
