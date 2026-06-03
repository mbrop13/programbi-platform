"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Briefcase, Database, Code, CheckCircle, BarChart2, Sparkles, Terminal, Play, Server, FileText } from "lucide-react";
import { FadeIn, CountUp } from "@/components/shared/AnimatedComponents";

/* ─── Modern Widescreen Data Visual (Single Screen Pipeline) ─── */
function ModernDataVisual() {
  const [activeTab, setActiveTab] = useState<"bi" | "sql" | "python">("bi");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Dynamic animations states triggered by active tab
  const [biKpiVal, setBiKpiVal] = useState(25000);
  const [sqlStep, setSqlStep] = useState<"executing" | "results">("executing");
  const [pythonStep, setPythonStep] = useState<"training" | "results">("training");

  // Tab autoplay loop - switches tabs every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === "bi") return "sql";
        if (prev === "sql") return "python";
        return "bi";
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Tab specific state triggers
  useEffect(() => {
    if (activeTab === "bi") {
      setSqlStep("executing");
      setPythonStep("training");

      // Animate KPI value count up from 25,000 to 142,800 over 2 seconds
      const start = 25000;
      const end = 142800;
      const duration = 2000;
      const startTime = performance.now();

      let animationFrameId: number;
      const animateCount = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        setBiKpiVal(Math.floor(start + easeProgress * (end - start)));
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateCount);
        }
      };
      animationFrameId = requestAnimationFrame(animateCount);
      return () => cancelAnimationFrame(animationFrameId);
    } else if (activeTab === "sql") {
      setPythonStep("training");
      // Animate SQL executing for 900ms, then show results table
      const timer = setTimeout(() => {
        setSqlStep("results");
      }, 900);
      return () => clearTimeout(timer);
    } else if (activeTab === "python") {
      setSqlStep("executing");
      // Animate Python training for 1100ms, then show output plots
      const timer = setTimeout(() => {
        setPythonStep("results");
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleTabClick = (tab: "bi" | "sql" | "python") => {
    setActiveTab(tab);
    setIsAutoPlaying(false); // Pause autoplay when user interacts
  };

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

      {/* Widescreen Browser Mockup - Taller Aspect Ratio [4/3.6] for more detail */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-[520px] aspect-[4/3.6] bg-white/75 backdrop-blur-2xl border border-white/80 rounded-[1.8rem] overflow-hidden shadow-[0_25px_65px_rgba(24,144,255,0.12)] flex flex-col"
        style={{ aspectRatio: "4/3.6" }}
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
          <button
            type="button"
            onClick={() => handleTabClick("bi")}
            className={`flex-1 py-2.5 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === "bi"
                ? "bg-white text-emerald-600 border-b-2 border-emerald-500 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" /> Power BI
          </button>
          <button
            type="button"
            onClick={() => handleTabClick("sql")}
            className={`flex-1 py-2.5 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === "sql"
                ? "bg-white text-blue-600 border-b-2 border-blue-500 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Database className="w-3 h-3" /> SQL Server
          </button>
          <button
            type="button"
            onClick={() => handleTabClick("python")}
            className={`flex-1 py-2.5 text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === "python"
                ? "bg-white text-indigo-600 border-b-2 border-indigo-500 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Python Analytics
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-4 overflow-hidden bg-white/20 relative flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* 1. POWER BI DASHBOARD TAB */}
            {activeTab === "bi" && (
              <motion.div
                key="bi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-col justify-between"
              >
                {/* Slicers Row */}
                <div className="flex gap-2 mb-2.5 shrink-0">
                  {["Año: 2026", "País: Chile", "Canal: Web"].map((filter, i) => (
                    <div
                      key={i}
                      className="bg-slate-100 border border-slate-200/60 rounded-md px-2 py-0.5 text-[7.5px] text-slate-500 font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <span>{filter}</span>
                      <span className="text-slate-400 text-[6px]">▼</span>
                    </div>
                  ))}
                </div>

                {/* KPI Cards Row */}
                <div className="grid grid-cols-3 gap-2.5 mb-2.5 shrink-0">
                  <div className="bg-white border border-slate-150 rounded-xl p-2 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Ventas Consolidadas</span>
                    <div className="mt-0.5 flex items-baseline gap-0.5">
                      <span className="text-[11px] font-black text-slate-900 font-mono">
                        ${biKpiVal.toLocaleString("es-CL")}
                      </span>
                      <span className="text-[6px] text-slate-450 font-bold">USD</span>
                    </div>
                    <span className="text-[5.5px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                      ▲ +14.8% vs. plan
                    </span>
                  </div>

                  <div className="bg-white border border-slate-150 rounded-xl p-2 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Tasa Conversión</span>
                    <div className="mt-0.5">
                      <span className="text-[11px] font-black text-slate-900 font-mono">3.42%</span>
                    </div>
                    <span className="text-[5.5px] text-slate-400 font-bold block mt-0.5">
                      Meta: 3.00%
                    </span>
                  </div>

                  <div className="bg-white border border-slate-150 rounded-xl p-2 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Pedidos Nuevos</span>
                    <div className="mt-0.5">
                      <span className="text-[11px] font-black text-slate-900 font-mono">1,482</span>
                    </div>
                    <span className="text-[5.5px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                      ▲ +8.2% vs. ayer
                    </span>
                  </div>
                </div>

                {/* Charts Area: Trend Chart & Channels Donut Chart */}
                <div className="flex-grow grid grid-cols-5 gap-2.5 min-h-[135px] items-stretch">
                  {/* Left: Trend Chart (3/5 columns) */}
                  <div className="col-span-3 bg-white border border-slate-150 rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
                    <div className="flex justify-between items-center mb-1 shrink-0">
                      <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-wider">Tendencia de Ventas (Ene - Jun)</span>
                      <span className="text-[6px] text-slate-400 font-bold font-mono">Prom: $24K</span>
                    </div>
                    {/* SVG Sparkline/Area Chart */}
                    <div className="relative flex-grow h-[70px] w-full mt-1.5">
                      <svg className="w-full h-full" viewBox="0 0 180 70" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="15" x2="180" y2="15" stroke="#f8fafc" strokeWidth="0.75" />
                        <line x1="0" y1="45" x2="180" y2="45" stroke="#f1f5f9" strokeWidth="0.75" />
                        
                        {/* Animated Area path */}
                        <motion.path
                          d="M 0 60 Q 30 45 60 48 T 120 25 T 180 10 L 180 70 L 0 70 Z"
                          fill="url(#areaGrad)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8 }}
                        />

                        {/* Animated Stroke path */}
                        <motion.path
                          d="M 0 60 Q 30 45 60 48 T 120 25 T 180 10"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.4, ease: "easeInOut" }}
                        />

                        {/* Indicator Dot */}
                        <motion.circle
                          cx="180"
                          cy="10"
                          r="3"
                          fill="#10b981"
                          stroke="white"
                          strokeWidth="1.2"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.3, 1] }}
                          transition={{ delay: 1.3, duration: 0.4 }}
                        />
                      </svg>
                      {/* Pulsing indicator animation */}
                      <div className="absolute right-0 top-[10%] w-2 h-2 -mr-1 -mt-1 bg-emerald-500 rounded-full animate-ping pointer-events-none" />
                    </div>
                    <div className="flex justify-between text-[6px] text-slate-400 font-bold font-mono mt-1 pt-1 border-t border-slate-100 shrink-0">
                      <span>ENE</span>
                      <span>FEB</span>
                      <span>MAR</span>
                      <span>ABR</span>
                      <span>MAY</span>
                      <span>JUN</span>
                    </div>
                  </div>

                  {/* Right: Distribution Donut Chart (2/5 columns) */}
                  <div className="col-span-2 bg-white border border-slate-150 rounded-xl p-2.5 flex flex-col justify-between shadow-sm items-center">
                    <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-wider text-center w-full">Canal de Venta</span>
                    
                    {/* Animated SVG Donut Chart */}
                    <div className="w-13 h-13 relative my-1.5 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        {/* Base gray circle */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
                        
                        {/* segment 1 (55%): Web */}
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="5"
                          strokeDasharray="55 100"
                          strokeDashoffset="0"
                          initial={{ strokeDasharray: "0 100" }}
                          animate={{ strokeDasharray: "55 100" }}
                          transition={{ duration: 1.0, ease: "easeOut" }}
                        />
                        {/* segment 2 (30%): Direct */}
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="5"
                          strokeDasharray="30 100"
                          strokeDashoffset="-55"
                          initial={{ strokeDasharray: "0 100" }}
                          animate={{ strokeDasharray: "30 100" }}
                          transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
                        />
                        {/* segment 3 (15%): Partners */}
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#cbd5e1"
                          strokeWidth="5"
                          strokeDasharray="15 100"
                          strokeDashoffset="-85"
                          initial={{ strokeDasharray: "0 100" }}
                          animate={{ strokeDasharray: "15 100" }}
                          transition={{ duration: 1.0, ease: "easeOut", delay: 0.4 }}
                        />
                      </svg>
                      <div className="absolute text-center flex flex-col items-center">
                        <span className="text-[7.5px] font-black text-slate-800 font-mono leading-none">Web</span>
                        <span className="text-[5.5px] text-slate-400 font-bold">55%</span>
                      </div>
                    </div>

                    <div className="w-full flex flex-col gap-0.5 text-[5.5px] font-bold text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500" /> Web</span>
                        <span className="font-mono text-slate-700">55%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-blue-500" /> Directo</span>
                        <span className="font-mono text-slate-700">30%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. SQL SERVER DATABASE TAB */}
            {activeTab === "sql" && (
              <motion.div
                key="sql"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-row items-stretch text-[9px] font-mono select-none"
              >
                {/* Left Sidebar: Schema Browser */}
                <div className="w-[105px] bg-slate-900 text-slate-400 border border-slate-800/80 rounded-l-xl p-2 flex flex-col gap-2 shrink-0">
                  <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1 flex items-center gap-1">
                    <Server size={9} className="text-[#1890FF]" /> CONEXIONES
                  </div>
                  <div className="space-y-1.5 text-[7px] overflow-hidden">
                    <div className="flex items-center gap-1 font-bold text-slate-200 truncate">
                      <span>🌐 sql-prod-cluster</span>
                    </div>
                    <div className="pl-1.5 space-y-1">
                      <div className="flex items-center gap-1 text-slate-400">
                        <span>📁 bases_datos</span>
                      </div>
                      <div className="pl-2 space-y-1">
                        <div className="flex items-center gap-1 font-bold text-slate-300 truncate">
                          <span>🗄️ programbi_db</span>
                        </div>
                        <div className="pl-2 space-y-1 text-slate-500">
                          <div className="flex items-center gap-1">
                            <span>📁 tablas</span>
                          </div>
                          <div className="pl-2 space-y-0.5 text-slate-400 font-sans">
                            <div className="flex items-center gap-0.5 text-[6.5px] text-[#1890FF] font-semibold">
                              <span>📄 dbo.ventas</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-[6.5px]">
                              <span>📄 dbo.clientes</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-[6.5px]">
                              <span>📄 dbo.regiones</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Pane: Query Editor & Output */}
                <div className="flex-1 flex flex-col justify-between bg-slate-950 border-y border-r border-slate-900 rounded-r-xl overflow-hidden">
                  {/* Editor Header / Tab bar */}
                  <div className="flex items-center justify-between bg-slate-900 px-3 py-1 border-b border-slate-950 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-950 border border-slate-800/80 rounded px-2 py-0.5 text-[7.5px] font-bold text-[#1890FF] flex items-center gap-1">
                        <span>🔍 query_ventas.sql</span>
                        <span className="text-slate-500 hover:text-white cursor-pointer text-[7px]">×</span>
                      </div>
                      <span className="text-slate-500 text-[8px] hover:text-slate-350 cursor-pointer">+</span>
                    </div>
                    <div className="text-[7px] text-slate-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      <span>master</span>
                    </div>
                  </div>

                  {/* SQL Code Editor Area */}
                  <div className="p-2.5 text-slate-100 flex-grow relative bg-slate-950 min-h-[90px]">
                    <div className="flex gap-2 text-[7.5px] leading-normal font-mono">
                      {/* Line numbers */}
                      <div className="text-slate-600 select-none text-right w-2 font-semibold font-mono">
                        <p>1</p>
                        <p>2</p>
                        <p>3</p>
                        <p>4</p>
                        <p>5</p>
                        <p>6</p>
                      </div>
                      {/* Query content with syntax highlighting */}
                      <div className="flex-1 font-mono">
                        <p className="text-emerald-500 font-sans italic">// Agrupar ventas por región de clientes</p>
                        <p>
                          <span className="text-indigo-400 font-bold">SELECT</span> r.nombre_region, <span className="text-amber-400 font-bold">COUNT</span>(v.id) <span className="text-indigo-400 font-bold">AS</span> Pedidos,
                        </p>
                        <p>
                          <span className="text-amber-400 font-bold">SUM</span>(v.monto) <span className="text-indigo-400 font-bold">AS</span> TotalVentas
                        </p>
                        <p>
                          <span className="text-indigo-400 font-bold">FROM</span> dbo.ventas v <span className="text-indigo-400 font-bold">INNER JOIN</span> dbo.regiones r
                        </p>
                        <p>
                          <span className="text-indigo-400 font-bold">ON</span> v.id_region = r.id
                        </p>
                        <p>
                          <span className="text-indigo-400 font-bold">GROUP BY</span> r.nombre_region;
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1.0, repeat: Infinity }}
                            className="w-1 h-2.5 bg-[#1890FF] inline-block ml-0.5 align-middle"
                          />
                        </p>
                      </div>
                    </div>

                    {/* Floating Execute Button */}
                    <div className="absolute top-2 right-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[6.5px] font-bold text-slate-350 rounded px-1.5 py-0.5 flex items-center gap-1 shadow">
                      <span>⚡ F5 Run</span>
                    </div>
                  </div>

                  {/* Execution Output Panel (Results Table) */}
                  <div className="h-[115px] border-t border-slate-900 bg-white flex flex-col justify-between shrink-0">
                    <div className="flex items-center gap-3 bg-slate-50 px-2.5 py-1 border-b border-slate-200 text-[7px] font-bold text-slate-500 shrink-0">
                      <span className="text-blue-600 border-b border-blue-600 pb-0.5">📋 Grilla de Resultados</span>
                      <span>Mensajes</span>
                    </div>

                    <div className="flex-grow overflow-auto p-1 relative">
                      {sqlStep === "executing" ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-20 gap-1">
                          <div className="w-3.5 h-3.5 border-2 border-[#1890FF] border-t-transparent rounded-full animate-spin" />
                          <span className="text-[7px] font-medium text-slate-500 font-sans">Ejecutando consulta en prod-cluster...</span>
                        </div>
                      ) : (
                        <table className="w-full text-[7px] text-left text-slate-650 font-sans">
                          <thead className="bg-slate-100 text-[6px] text-slate-400 font-bold uppercase border-b border-slate-200">
                            <tr>
                              <th className="px-1.5 py-0.5 border-r border-slate-200 w-4 text-center">#</th>
                              <th className="px-2 py-0.5 border-r border-slate-200">nombre_region</th>
                              <th className="px-2 py-0.5 border-r border-slate-200 text-right">Pedidos</th>
                              <th className="px-2 py-0.5 text-right">TotalVentas</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { r: 1, region: "Metropolitana", p: 842, sales: "$74.800 USD" },
                              { r: 2, region: "Valparaíso", p: 356, sales: "$31.200 USD" },
                              { r: 3, region: "Biobío", p: 222, sales: "$18.500 USD" }
                            ].map((row, idx) => (
                              <motion.tr
                                key={idx}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.12 }}
                                className="border-b border-slate-100 hover:bg-slate-50/50"
                              >
                                <td className="px-1.5 py-0.5 border-r border-slate-200 text-slate-400 text-center font-bold font-mono">{row.r}</td>
                                <td className="px-2 py-0.5 border-r border-slate-200 font-bold text-slate-800">{row.region}</td>
                                <td className="px-2 py-0.5 border-r border-slate-200 text-right font-mono text-slate-650">{row.p}</td>
                                <td className="px-2 py-0.5 text-right font-mono font-bold text-blue-600">{row.sales}</td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {/* Status Bar */}
                    <div className="bg-slate-50 border-t border-slate-200 px-2.5 py-0.5 flex justify-between text-[6.5px] text-slate-400 font-sans shrink-0">
                      {sqlStep === "executing" ? (
                        <span className="text-slate-400 flex items-center gap-1 font-mono">
                          ● Ejecutando...
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          ✔ Ejecutado con éxito
                        </span>
                      )}
                      <span>{sqlStep === "executing" ? "--" : "3 filas afectadas (14ms)"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. PYTHON ANALYTICS TAB */}
            {activeTab === "python" && (
              <motion.div
                key="python"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-col justify-between text-[9px] font-mono select-none"
              >
                {/* Google Colab Header Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-100 flex justify-between items-center shrink-0 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-600 -ml-1.5 opacity-80" />
                    </div>
                    <span className="font-bold text-[8px] text-slate-350">Colab: prediccion_ventas.ipynb</span>
                  </div>
                  <div className="flex items-center gap-2 text-[7px] font-sans text-slate-400">
                    <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> RAM</span>
                    <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Disco</span>
                  </div>
                </div>

                {/* Cell 1: pandas and regression setup */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 text-slate-200 shrink-0 mb-2 relative">
                  <div className="absolute top-1 left-1.5 text-[6.5px] text-slate-500 font-bold select-none">[1]</div>
                  <div className="pl-4 space-y-0.5 text-[7.5px] font-mono">
                    <p>
                      <span className="text-purple-400 font-bold">import</span> pandas <span className="text-purple-400 font-bold">as</span> pd
                    </p>
                    <p>
                      <span className="text-purple-400 font-bold">from</span> sklearn.linear_model <span className="text-purple-400 font-bold">import</span> LinearRegression
                    </p>
                    <p>
                      df = pd.read_csv(<span className="text-amber-300">"ventas_anuales.csv"</span>)
                    </p>
                    <p>
                      X, y = df[[<span className="text-amber-300">"mes_num"</span>]], df[<span className="text-amber-300">"ventas"</span>]
                    </p>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[6.5px] text-emerald-500 font-bold">✔ 0.3s</div>
                </div>

                {/* Cell 2: training model */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 text-slate-200 shrink-0 mb-2 relative">
                  <div className="absolute top-1 left-1.5 text-[6.5px] text-slate-500 font-bold select-none">[2]</div>
                  <div className="pl-4 space-y-0.5 text-[7.5px] font-mono">
                    <p>
                      model = LinearRegression().fit(X, y)
                    </p>
                    <p>
                      <span className="text-amber-400">print</span>(f<span className="text-amber-300">{"\"R² Score: {model.score(X, y):.3f}\""}</span>)
                    </p>
                  </div>
                  {pythonStep === "results" && (
                    <div className="absolute bottom-1 right-2 text-[6.5px] text-emerald-500 font-bold">✔ 0.4s</div>
                  )}
                </div>

                {/* Output Panel: Scatter plot and training log side-by-side */}
                <div className="flex-grow flex gap-2.5 items-stretch min-h-[110px]">
                  {/* Left: Matplotlib Plot (3/5 columns) */}
                  <div className="flex-1 bg-white border border-slate-150 rounded-xl p-2.5 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-1 shrink-0">
                      <span className="text-[6.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Matplotlib: Linear Fit</span>
                      <span className="text-[6px] text-indigo-500 font-bold">y = 12.45x + 4.82</span>
                    </div>

                    <div className="relative flex-grow h-[60px]">
                      {pythonStep === "training" ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/95">
                          <span className="text-[7.5px] text-slate-400 font-sans animate-pulse">Graficando regresión...</span>
                        </div>
                      ) : (
                        <svg className="w-full h-full" viewBox="0 0 200 70">
                          {/* Grid lines */}
                          <line x1="10" y1="10" x2="190" y2="10" stroke="#f8fafc" strokeWidth="0.75" />
                          <line x1="10" y1="35" x2="190" y2="35" stroke="#f8fafc" strokeWidth="0.75" />
                          <line x1="10" y1="60" x2="190" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="10" y1="10" x2="10" y2="60" stroke="#f1f5f9" strokeWidth="1" />

                          {/* Scatter points representing dataset */}
                          {[
                            { x: 30, y: 52 }, { x: 55, y: 44 }, { x: 80, y: 40 },
                            { x: 100, y: 32 }, { x: 130, y: 25 }, { x: 160, y: 16 }
                          ].map((pt, i) => (
                            <motion.circle
                              key={i}
                              cx={pt.x}
                              cy={pt.y}
                              r="2.5"
                              fill="#3b82f6"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.75 }}
                              transition={{ delay: i * 0.06 }}
                            />
                          ))}

                          {/* Fitted Regression line */}
                          <motion.path
                            d="M 10 58 L 190 12"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="2"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.9, ease: "easeInOut", delay: 0.4 }}
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex justify-between text-[5px] text-slate-400 font-bold font-mono mt-1 pt-0.5 border-t border-slate-100 shrink-0">
                      <span>Ene (1)</span>
                      <span>Dic (12)</span>
                    </div>
                  </div>

                  {/* Right: Output Logs (2/5 columns) */}
                  <div className="w-[115px] bg-slate-950 rounded-xl p-2.5 font-mono text-[7px] text-slate-350 leading-normal flex flex-col justify-between shrink-0">
                    <div className="text-indigo-400 font-bold border-b border-slate-900 pb-1 mb-1 flex items-center gap-1 shrink-0">
                      <span>📋 Terminal Logs</span>
                    </div>
                    
                    <div className="space-y-1 flex-grow py-1">
                      {pythonStep === "training" ? (
                        <div className="space-y-1">
                          <p className="text-slate-500 animate-pulse">Entrenando modelo...</p>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.8 }}
                              className="bg-indigo-500 h-full"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5 leading-relaxed font-mono">
                          <p className="text-emerald-400 font-bold">✔ Entrenado OK</p>
                          <p className="text-slate-200 mt-1 font-mono">R² Score: <span className="text-indigo-300 font-bold font-mono">0.942</span></p>
                          <p className="text-slate-200 font-mono">MSE Error: <span className="text-indigo-300 font-bold font-mono">0.021</span></p>
                        </div>
                      )}
                    </div>

                    <div className="text-[6px] text-slate-500 border-t border-slate-900 pt-1 mt-1 font-bold shrink-0">
                      {pythonStep === "training" ? "Status: training..." : "Exec: OK • GPU"}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}


/* ─── MAIN HERO ─── */
export default function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const difference = +new Date("2026-06-03T23:59:59") - +new Date();
      if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculate());
    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-2 lg:pt-20 lg:pb-4">
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
          {/* ── Left Column (7/12) ── */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Pill Badge */}
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-50 border border-red-150 text-red-600 text-xs sm:text-sm font-black mb-6 animate-pulse">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                </span>
                <span>⚡ ¡CYBER DAY PROGRAMBI! — HASTA 60% DCTO ⚡</span>
              </div>
            </FadeIn>

            {/* Main Title */}
            <FadeIn delay={0.15}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 tracking-tight leading-tight lg:leading-[1.1] mb-6 font-display">
                Impulsa tu carrera <br className="hidden lg:block" />
                con las ofertas de{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse">
                  Cyber Day ⚡
                </span>
              </h1>
            </FadeIn>

            {/* Subtitle */}
            <FadeIn delay={0.3}>
              <p className="text-lg lg:text-2xl text-gray-500 mb-8 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
                Ahorra hasta un <strong className="text-[#1890FF] font-black">60%</strong> en nuestros cursos en vivo de Análisis de Datos, Power BI, Python y SQL. Asegura tu cupo con matrícula gratis.
              </p>
            </FadeIn>

            {/* Countdown timer */}
            <FadeIn delay={0.38}>
              <div className="bg-white/95 border-2 border-red-500/20 rounded-3xl p-6 mb-8 max-w-xl mx-auto lg:mx-0 shadow-[0_20px_50px_rgba(239,68,68,0.12)] relative overflow-hidden backdrop-blur-md text-left">
                {/* Cyber decoration pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#1890FF]/5 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-650" />
                    </span>
                    <p className="text-[11px] font-black text-red-600 tracking-wider uppercase font-sans">El Cyber Day finaliza en:</p>
                  </div>
                  <span className="text-[9px] font-black text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.75 rounded-full uppercase tracking-wider font-mono">CUPOS LIMITADOS</span>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center relative z-10">
                  {[
                    { label: "Días", val: timeLeft.days },
                    { label: "Horas", val: timeLeft.hours },
                    { label: "Minutos", val: timeLeft.minutes },
                    { label: "Segundos", val: timeLeft.seconds },
                  ].map((t) => (
                    <div key={t.label} className="bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-sm rounded-2xl py-3 px-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 block mb-0.5 leading-none font-mono">
                        {String(t.val).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block font-sans">
                        {t.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.45}>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link
                  href="/cursos"
                  className="group px-8 py-4 sm:px-10 sm:py-5 rounded-xl text-white font-bold text-[16px] sm:text-lg flex items-center justify-center gap-3 no-underline transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
                    boxShadow: "0 12px 35px -8px rgba(239,68,68,0.4)",
                  }}
                >
                  <span>Ver Oferta Cyber ⚡</span>
                  <Briefcase className="w-5 h-5 group-hover:rotate-12 transition-transform text-white" />
                </Link>
                <Link
                  href="/cursos"
                  className="px-8 py-4 sm:px-10 sm:py-5 rounded-xl bg-white text-gray-700 font-bold text-[16px] sm:text-lg border border-gray-200 hover:border-red-500 hover:text-red-500 transition-all flex items-center justify-center gap-3 no-underline hover:-translate-y-1 shadow-sm hover:shadow"
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
