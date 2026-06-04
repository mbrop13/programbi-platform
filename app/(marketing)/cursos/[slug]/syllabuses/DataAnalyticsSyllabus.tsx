"use client";

import React, { useState } from "react";
import { ChevronDown, Check, GraduationCap, Trophy, Play, BarChart3, Database, Code2, LineChart, Server, Network, Bolt, Bot, Target, MessageCircle, Phone } from "lucide-react";

export default function DataAnalyticsSyllabus() {
  const [activeTab, setActiveTab] = useState("nivel1");
  const [openItems, setOpenItems] = useState<string[]>(["n1-pbi"]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-20 bg-slate-50 border-y border-slate-200 relative overflow-hidden font-sans">
      {/* Background Decorators */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-slate-100/50 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl px-6 relative z-10">
        
        {/* CABECERA */}
        <div className="text-center mb-16 relative">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 font-bold tracking-wide uppercase text-xs mb-6 border border-slate-200 shadow-sm backdrop-blur-sm">
            Programa Integral 2026
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-6 font-display leading-tight">
            Especialización en <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">Análisis de Datos</span>
          </h2>
          <p className="text-base md:text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
            Un trayecto formativo de 48 horas, combinando el poder de <strong>Power BI, SQL Server y Python</strong> con integración transversal de Inteligencia Artificial.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 sm:mb-16">
            <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-colors">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-slate-50 rounded-full blur-2xl group-hover:bg-slate-100/80 transition-colors pointer-events-none" />
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" /> Dirigido a:
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed relative z-10">
                  Ideal para perfiles administrativos, financieros, comerciales, ingenieros y analistas que buscan dominar el ciclo completo del dato. Desde principiantes hasta quienes requieren análisis predictivo y automatización avanzada.
                </p>
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100">
                    <p className="text-xs sm:text-sm text-slate-800 flex items-center gap-2.5 sm:gap-3 bg-slate-50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 shrink-0" /> <span><strong>Formación Escalonada:</strong> Dominio de Básico, Intermedio y Avanzado en las 3 herramientas.</span>
                    </p>
                </div>
            </div>

            <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-3">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" /> Beneficios del Programa:
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-700">
                    {[
                        { t: "Automatización Total", d: "Reduce horas de trabajo conectando directamente a BD corporativas." },
                        { t: "Visualización de Impacto", d: "Dashboards dinámicos para decisiones críticas de negocio." },
                        { t: "Consultas Eficientes", d: "Extrae y cruza información con SQL Server sin depender de TI." },
                        { t: "Ciencia de Datos", d: "Analítica predictiva y limpieza tabular con Pandas y Plotly." },
                        { t: "IA Transversal", d: "Uso de Inteligencia Artificial en cada módulo para generar código." }
                    ].map((b, i) => (
                        <li key={i} className="flex gap-3 sm:gap-4 items-start">
                            <div className="mt-0.5 bg-slate-900 p-1.5 rounded-full text-white shrink-0">
                                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </div>
                            <div>
                                <strong className="block text-slate-900 text-xs sm:text-sm">{b.t}</strong>
                                <span className="text-[10px] sm:text-xs leading-tight text-slate-500">{b.d}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
        {/* NAVEGACIÓN DE PESTAÑAS (3 Niveles de 48h) */}
        <div className="flex justify-center mb-12 sm:mb-16 max-w-full">
          <div className="inline-flex bg-slate-200/50 p-1 rounded-full border border-slate-200 shadow-sm backdrop-blur-md w-full max-w-4xl overflow-x-auto scrollbar-hide flex-nowrap gap-1 sm:p-2 sm:gap-2">
            
            {/* Tab 1: Nivel I */}
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`relative px-4 py-2.5 sm:px-8 sm:py-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex-1 min-w-[140px] sm:min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none shrink-0 ${
                activeTab === "nivel1" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <span className="text-sm sm:text-lg whitespace-nowrap">Nivel I: Básico</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5 sm:mt-1 opacity-60 whitespace-nowrap">Fundamentos (48h)</span>
            </button>

            {/* Tab 2: Nivel II */}
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`relative px-4 py-2.5 sm:px-8 sm:py-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex-1 min-w-[140px] sm:min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none shrink-0 ${
                 activeTab === "nivel2" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
               }`}
            >
              <span className="text-sm sm:text-lg whitespace-nowrap">Nivel II: Intermedio</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5 sm:mt-1 opacity-60 whitespace-nowrap">Visualización (48h)</span>
            </button>

            {/* Tab 3: Nivel III */}
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`relative px-4 py-2.5 sm:px-8 sm:py-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex-1 min-w-[140px] sm:min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none shrink-0 ${
                 activeTab === "nivel3" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
               }`}
            >
              <span className="text-sm sm:text-lg whitespace-nowrap">Nivel III: Avanzado</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5 sm:mt-1 opacity-60 whitespace-nowrap">Automatización (48h)</span>
            </button>
          </div>
        </div>

        {/* CONTAINER PANELES */}
        <div className="relative">

          {/* ======================= NIVEL I: BÁSICO ======================= */}
          {activeTab === "nivel1" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8 sm:mb-12">
                <p className="text-sm sm:text-lg text-slate-500 max-w-3xl mx-auto italic">
                  Ideal para principiantes. El objetivo es establecer bases sólidas en las tres tecnologías, enfocándose en la automatización inicial.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                
                {/* Power BI Nivel I */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-900/[0.02] transition-all duration-300">
                  <button onClick={() => toggleItem("n1-pbi")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n1-pbi") ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
                        <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-slate-900 truncate">Módulo Power BI</h4>
                        <span className="text-xs sm:text-sm font-bold text-amber-600 block truncate mt-0.5">16 Horas • Dashboards e Informes Iniciales</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n1-pbi") ? 'rotate-180 text-amber-500' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Introducción al entorno, instalaciones y cuentas.",
                          "Power Query: Importación desde Excel, SQL y APIs.",
                          "Limpieza básica de datos, cálculos y columnas a medida.",
                          "Visualizaciones iniciales: Barras, líneas, mapas y KPIs.",
                          "Integración de IA: Lenguaje natural (Q&A) y tendencias automáticas."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel I */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-900/[0.02] transition-all duration-300">
                  <button onClick={() => toggleItem("n1-sql")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n1-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Database className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-slate-900 truncate">Módulo SQL Server</h4>
                        <span className="text-xs sm:text-sm font-bold text-blue-600 block truncate mt-0.5">16 Horas • Consultas y Filtros Base</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n1-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Recuperación de datos (SELECT) y límites (TOP).",
                          "Funciones de fecha (MONTH, YEAR) para filtros temporales.",
                          "Operadores lógicos (AND/OR) y cláusula WHERE.",
                          "Cruce de tablas inicial (INNER y LEFT JOIN).",
                          "Uso de IA para generar consultas automatizadas a medida."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel I */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-900/[0.02] transition-all duration-300">
                  <button onClick={() => toggleItem("n1-py")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n1-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Code2 className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-slate-900 truncate">Módulo Python</h4>
                        <span className="text-xs sm:text-sm font-bold text-indigo-600 block truncate mt-0.5">16 Horas • Fundamentos y Análisis Tabular</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n1-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Variables, tipos de datos y control de flujo (if/else).",
                          "Estructuras de datos: Listas, Tuplas y Diccionarios.",
                          "Introducción a Pandas: DataFrames desde Excel.",
                          "Manipulación inicial de columnas y exploración tabular.",
                          "Generación de código IA para extraer datos y patrones."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================= NIVEL II: INTERMEDIO ======================= */}
          {activeTab === "nivel2" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8 sm:mb-12">
                <p className="text-sm sm:text-lg text-slate-500 max-w-3xl mx-auto italic">
                  Manipula datos de forma avanzada, domina modelado DAX y crea visualizaciones estéticas para informes consolidados.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                
                {/* Power BI Nivel II */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-pbi")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n2-pbi") ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
                        <LineChart className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-slate-900 truncate">Módulo Power BI</h4>
                        <span className="text-xs sm:text-sm font-bold text-amber-600 block truncate mt-0.5">16 Horas • DAX, Relaciones e Interacciones</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n2-pbi") ? 'rotate-180 text-amber-500' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Visualizaciones con saturación de color y Unpivot Columns.",
                          "Introducción a DAX: Tablas de medidas y relaciones.",
                          "Títulos dinámicos mediante SELECTEDVALUE y LOOKUPVALUE.",
                          "Publicación online con roles seguridad organizacional.",
                          "Estructura de medidas DAX inteligentes asistidas por IA."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel II */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-blue-400/50 shadow-sm hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-sql")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n2-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Server className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-slate-900 truncate">Módulo SQL Server</h4>
                        <span className="text-xs sm:text-sm font-bold text-blue-600 block truncate mt-0.5">16 Horas • Joins Avanzados y Agrupaciones</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n2-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Uso de FULL y RIGHT JOIN para detectar discrepancias.",
                          "GROUP BY y funciones de agregación (SUM, ORDER BY).",
                          "Cruces simultáneos de múltiples tablas con condiciones.",
                          "Vistas de valorización y consolidados departamentales.",
                          "Preprocesamiento de datos para modelos predictivos IA."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel II */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-indigo-400/50 shadow-sm hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-py")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n2-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Network className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-slate-900 truncate">Módulo Python</h4>
                        <span className="text-xs sm:text-sm font-bold text-indigo-600 block truncate mt-0.5">16 Horas • Pandas y Visualización Estética</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n2-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Pandas: Groupby, agregaciones múltiples y tipos.",
                          "Matplotlib: Gráficos de líneas, ejes y referencias.",
                          "Seaborn: Visualización estética avanzada para reportes.",
                          "Limpieza profunda de transacciones y fechas.",
                          "Automatización de reportes de complejidad media con IA."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================= NIVEL III: AVANZADO ======================= */}
          {activeTab === "nivel3" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8 sm:mb-12">
                <p className="text-sm sm:text-lg text-slate-500 max-w-3xl mx-auto italic">
                  Profundiza en automatización de servidores, Data Science con librerías interactivas y modelos predictivos integrando IA avanzada.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                
                {/* Power BI Nivel III */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-amber-400/50 shadow-sm hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-pbi")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n3-pbi") ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
                        <Bolt className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-slate-900 truncate">Módulo Power BI</h4>
                        <span className="text-xs sm:text-sm font-bold text-amber-600 block truncate mt-0.5">16 Horas • Inteligencia de Tiempo y AI Predictiva</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n3-pbi") ? 'rotate-180 text-amber-500' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "DAX avanzado: YTD, MTD, SAMEPERIODLASTYEAR.",
                          "Parámetros Dinámicos (What if) y prorrateo de metas.",
                          "Interactividad Total: Botones, Marcadores y Drillthrough.",
                          "Seguridad RLS avanzada y funciones USERELATIONSHIP.",
                          "IA Generativa en PBI: Smart Narratives y Copilot."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel III */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-blue-400/50 shadow-sm hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-sql")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n3-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Network className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-slate-900 truncate">Módulo SQL Server</h4>
                        <span className="text-xs sm:text-sm font-bold text-blue-600 block truncate mt-0.5">16 Horas • Procedimientos y Automatización</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n3-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Vistas avanzadas con condicionales CASE WHEN.",
                          "Funciones de cadena y cruces de alta complejidad.",
                          "Automatización con CREATE PROC y EXECUTE.",
                          "Administración: SELECT INTO, ALTER TABLE y UPDATE.",
                          "Procesos ETL vinculando SQL con Python e IA."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel III */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-indigo-400/50 shadow-sm hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-py")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n3-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Bot className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-slate-900 truncate">Módulo Python</h4>
                        <span className="text-xs sm:text-sm font-bold text-indigo-600 block truncate mt-0.5">16 Horas • Dashboards Interactivos y Predictividad</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n3-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Unión de bases complejas mediante pd.merge().",
                          "Aplicación de funciones personalizadas .apply().",
                          "Gráficos declarativos e interactivos con Plotly.",
                          "Sunburst, Treemaps y subgráficos de alta interactividad.",
                          "Proyecto Final: Análisis predictivo con IA integrada."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-slate-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
