"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Briefcase, Database, Play, Code, CheckCircle, BarChart2 } from "lucide-react";
import { FadeIn, CountUp } from "@/components/shared/AnimatedComponents";

/* ─── Modern Data Visual (Glassmorphism Campus Mockup) ─── */
function ModernDataVisual() {
  const [activeTab, setActiveTab] = useState<"bi" | "python" | "sql">("bi");
  const [sqlQueryIndex, setSqlQueryIndex] = useState(0);

  const sqlQueries = [
    { query: "SELECT region, SUM(ventas) FROM transacciones GROUP BY region;", results: [
      { region: "Metropolitana", ventas: "$45.2M" },
      { region: "Valparaíso", ventas: "$18.7M" },
      { region: "Biobío", ventas: "$15.4M" }
    ]},
    { query: "SELECT curso, COUNT(*) FROM inscripciones WHERE estado = 'activo';", results: [
      { curso: "Power BI Pro", alumnos: "1,240" },
      { curso: "Python Data Science", alumnos: "850" },
      { curso: "SQL & Big Data", alumnos: "620" }
    ]}
  ];

  return (
    <div className="relative w-full aspect-square lg:aspect-[4/3] flex items-center justify-center mt-12 lg:mt-0 select-none">
      {/* Ambient background glowing blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-10 lg:left-0 top-0 z-0 w-44 h-44 bg-gradient-to-tr from-blue-300/30 to-indigo-300/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -15, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-10 bottom-0 z-0 w-52 h-52 bg-gradient-to-tr from-cyan-300/25 to-blue-300/25 rounded-full blur-3xl"
      />

      {/* Main floating browser mockup */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-[460px] bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(24,144,255,0.15)] flex flex-col h-[340px] md:h-[380px]"
      >
        {/* Browser Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/80 border-b border-gray-100 shrink-0">
          {/* Windows/Mac buttons */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {/* Address Bar */}
          <div className="bg-gray-50 border border-gray-100/50 rounded-lg px-6 py-0.5 text-[10px] text-gray-400 font-mono flex items-center gap-1">
            <span className="text-gray-300">https://</span>
            <span className="text-gray-600 font-medium">campus.programbi.com</span>
          </div>
          {/* User profile representation */}
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-[#1890FF]">
            JD
          </div>
        </div>

        {/* Tab Selector inside mock app */}
        <div className="flex border-b border-gray-100 bg-white/40 shrink-0">
          <button type="button"
            onClick={() => setActiveTab("bi")}
            className={`flex-1 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "bi"
                ? "bg-white text-[#1890FF] border-b-2 border-[#1890FF]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" /> Power BI
          </button>
          <button type="button"
            onClick={() => setActiveTab("python")}
            className={`flex-1 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "python"
                ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Python
          </button>
          <button type="button"
            onClick={() => setActiveTab("sql")}
            className={`flex-1 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "sql"
                ? "bg-white text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Database className="w-3.5 h-3.5" /> SQL Query
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-5 overflow-hidden bg-white/20 relative">
          <AnimatePresence mode="wait">
            
            {/* POWER BI DASHBOARD TAB */}
            {activeTab === "bi" && (
              <motion.div
                key="bi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-gray-800">Ventas por Sucursal</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Reporte Dinámico</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-gray-900">$124,500 USD</span>
                    <p className="text-[8px] font-bold text-emerald-500">+12% este mes</p>
                  </div>
                </div>

                {/* Simulated Chart Bars */}
                <div className="flex items-end justify-between h-24 gap-3">
                  {[30, 50, 75, 40, 95, 60, 85].map((h, idx) => (
                    <div key={idx} className="w-full h-full flex flex-col justify-end group relative cursor-pointer">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ type: "spring", stiffness: 80 }}
                        className={`w-full rounded-t-sm transition-all ${
                          idx === 4 
                            ? "bg-gradient-to-t from-[#1890FF] to-blue-400"
                            : "bg-[#1890FF]/15 hover:bg-[#1890FF]/35"
                        }`}
                      />
                      <span className="text-[8px] font-black text-gray-400 text-center mt-1">S{idx+1}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PYTHON TAB (Jupyter Notebook / Data Science mockup) */}
            {activeTab === "python" && (
              <motion.div
                key="python"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col justify-between text-xs"
              >
                {/* Jupyter Cell Input */}
                <div className="bg-gray-50 border border-gray-150 rounded-xl p-2.5 font-mono text-[9px] text-gray-750 shadow-sm shrink-0 mb-2">
                  <div className="flex justify-between items-center text-[8px] text-gray-400 font-sans mb-1.5">
                    <span className="font-bold text-[#1890FF]">Jupyter Notebook — In [1]</span>
                    <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">python 3.8</span>
                  </div>
                  <div className="space-y-0.5 leading-normal">
                    <p><span className="text-purple-600 font-bold">import</span> pandas <span className="text-purple-600 font-bold">as</span> pd</p>
                    <p><span className="text-purple-600 font-bold">import</span> matplotlib.pyplot <span className="text-purple-600 font-bold">as</span> plt</p>
                    <p>df = pd.read_csv(<span className="text-emerald-600">'ventas.csv'</span>)</p>
                    <p>df.plot(x=<span className="text-emerald-600">'mes'</span>, y=<span className="text-emerald-600">'crecimiento'</span>, color=<span className="text-indigo-600">'indigo'</span>)</p>
                  </div>
                </div>

                {/* Notebook Output (Visual Line Chart) */}
                <div className="flex-1 bg-white border border-gray-100 rounded-xl p-2.5 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-center text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    <span>Salida [1] — Gráfico de Crecimiento</span>
                    <span className="text-indigo-600 font-black">Pandas + Matplotlib</span>
                  </div>

                  {/* High fidelity SVG line chart */}
                  <div className="relative flex-1 min-h-[70px] md:min-h-[85px]">
                    <svg className="w-full h-full" viewBox="0 0 200 80">
                      {/* Grid Lines */}
                      <line x1="10" y1="10" x2="190" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="10" y1="35" x2="190" y2="35" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="10" y1="60" x2="190" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="10" y1="75" x2="190" y2="75" stroke="#e2e8f0" strokeWidth="1" />

                      {/* Smooth Path (Line Chart) */}
                      <motion.path
                        d="M 10 70 Q 40 60 70 45 T 130 30 T 190 15"
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />

                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                      </defs>

                      {/* Pulsing end point */}
                      <motion.circle
                        cx="190"
                        cy="15"
                        r="3.5"
                        fill="#4f46e5"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: [1, 1.5, 1] }}
                        transition={{ delay: 1.3, duration: 1, repeat: Infinity }}
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SQL QUERY TAB */}
            {activeTab === "sql" && (
              <motion.div
                key="sql"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col justify-between"
              >
                {/* Query selector bar */}
                <div className="flex gap-2 mb-3">
                  {sqlQueries.map((q, idx) => (
                    <button type="button"
                      key={idx}
                      onClick={() => setSqlQueryIndex(idx)}
                      className={`text-[9px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
                        sqlQueryIndex === idx
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-white border-gray-150 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      Consulta {idx + 1}
                    </button>
                  ))}
                </div>

                {/* SQL Code Box */}
                <div className="bg-gray-50 border border-gray-150 p-2.5 rounded-lg font-mono text-[9px] text-gray-700 mb-3 shadow-sm">
                  <span className="text-purple-600 font-bold">SELECT</span> {sqlQueries[sqlQueryIndex].query.split("SELECT")[1].split("FROM")[0]}
                  <span className="text-purple-600 font-bold">FROM</span> {sqlQueries[sqlQueryIndex].query.split("FROM")[1].split("GROUP BY")[0].split("WHERE")[0]}
                  {sqlQueries[sqlQueryIndex].query.includes("WHERE") && (
                    <>
                      <span className="text-purple-600 font-bold">WHERE</span> {sqlQueries[sqlQueryIndex].query.split("WHERE")[1].split("GROUP BY")[0]}
                    </>
                  )}
                  {sqlQueries[sqlQueryIndex].query.includes("GROUP BY") && (
                    <>
                      <span className="text-purple-600 font-bold">GROUP BY</span> {sqlQueries[sqlQueryIndex].query.split("GROUP BY")[1]}
                    </>
                  )}
                </div>

                {/* Simulated Results Table */}
                <div className="flex-1 overflow-hidden border border-gray-100 rounded-lg bg-white shadow-sm">
                  <table className="w-full text-[9px] text-left text-gray-600">
                    <thead className="bg-gray-50 text-[8px] font-bold text-gray-400 uppercase border-b border-gray-100">
                      <tr>
                        {Object.keys(sqlQueries[sqlQueryIndex].results[0]).map((key) => (
                          <th key={key} className="px-3 py-1.5">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlQueries[sqlQueryIndex].results.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                          {Object.values(row).map((val, valIdx) => (
                            <td key={valIdx} className="px-3 py-1.5 font-bold text-gray-700">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      {/* Floating Elements surrounding the browser window */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 lg:-right-8 top-16 z-20 bg-white/95 backdrop-blur-sm px-3.5 py-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
      >
        <span className="text-xl">🎓</span>
        <div>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Tu Progreso</p>
          <div className="flex items-center gap-1.5">
            <div className="w-14 h-1.5 bg-gray-150 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1.5, delay: 1 }}
                className="h-full bg-gradient-to-r from-[#1890FF] to-indigo-500"
              />
            </div>
            <span className="text-[9px] font-black text-gray-800">85%</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-4 lg:-left-10 bottom-24 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2.5"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold border border-emerald-100">
          🏆
        </div>
        <div>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Certificación</p>
          <p className="text-[10px] font-black text-gray-800 flex items-center gap-0.5">
            Completado <CheckCircle className="w-3 h-3 text-emerald-500 fill-current" />
          </p>
        </div>
      </motion.div>

      {/* SQL schema bubble */}
      <motion.div
        animate={{ y: [0, 8, 0], x: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute left-[38%] -top-8 z-20 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-md border border-gray-100 flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
      >
        <span className="text-xs">🗄️</span>
        <span className="text-[9px] font-black text-gray-700">SQL Server Live Connection</span>
      </motion.div>
    </div>
  );
}

/* ─── MAIN HERO ─── */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 lg:pt-12 lg:pb-20">
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
