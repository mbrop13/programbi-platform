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
            Un trayecto formativo de 144 horas divididas en 3 niveles, combinando el poder de <strong>Power BI, SQL Server y Python</strong> con integración transversal de Inteligencia Artificial.
          </p>
        </div>

        {/* INFORMACIÓN GENERAL */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-colors">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-slate-50 rounded-full blur-2xl group-hover:bg-slate-100/80 transition-colors pointer-events-none" />
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-slate-700" /> Dirigido a:
                </h3>
                <p className="text-base text-slate-600 leading-relaxed relative z-10">
                  Ideal para perfiles administrativos, financieros, comerciales, ingenieros y analistas que buscan dominar el ciclo completo del dato. Desde principiantes hasta quienes requieren análisis predictivo y automatización avanzada.
                </p>
                <div className="mt-8 pt-8 border-t border-slate-100">
                    <p className="text-sm text-slate-800 flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <Target className="w-5 h-5 text-slate-600" /> <strong>Formación Escalonada:</strong> Dominio de Básico, Intermedio y Avanzado en las 3 herramientas.
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-slate-700" /> Beneficios del Programa:
                </h3>
                <ul className="space-y-4 text-sm text-slate-700">
                    {[
                        { t: "Automatización Total", d: "Reduce horas de trabajo conectando directamente a BD corporativas." },
                        { t: "Visualización de Impacto", d: "Dashboards dinámicos para decisiones críticas de negocio." },
                        { t: "Consultas Eficientes", d: "Extrae y cruza información con SQL Server sin depender de TI." },
                        { t: "Ciencia de Datos", d: "Analítica predictiva y limpieza tabular con Pandas y Plotly." },
                        { t: "IA Transversal", d: "Uso de Inteligencia Artificial en cada módulo para generar código." }
                    ].map((b, i) => (
                        <li key={i} className="flex gap-4 items-start">
                            <div className="mt-0.5 bg-slate-900 p-1.5 rounded-full text-white shrink-0">
                                <Check className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <strong className="block text-slate-900">{b.t}</strong>
                                <span className="text-xs leading-tight text-slate-500">{b.d}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
        {/* NAVEGACIÓN DE PESTAÑAS (3 Niveles de 48h) */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex flex-wrap lg:flex-nowrap bg-slate-200/50 p-2 rounded-[2rem] border border-slate-200 shadow-sm backdrop-blur-md w-full max-w-4xl justify-center gap-2">
            
            {/* Tab 1: Nivel I */}
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`relative px-8 py-4 rounded-3xl text-sm font-bold transition-all duration-300 flex-1 min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none ${
                activeTab === "nivel1" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <span className="text-lg">Nivel I: Básico</span>
              <span className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Fundamentos (48h)</span>
            </button>

            {/* Tab 2: Nivel II */}
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`relative px-8 py-4 rounded-3xl text-sm font-bold transition-all duration-300 flex-1 min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none ${
                 activeTab === "nivel2" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
               }`}
            >
              <span className="text-lg">Nivel II: Intermedio</span>
              <span className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Visualización (48h)</span>
            </button>

            {/* Tab 3: Nivel III */}
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`relative px-8 py-4 rounded-3xl text-sm font-bold transition-all duration-300 flex-1 min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none ${
                 activeTab === "nivel3" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
               }`}
            >
              <span className="text-lg">Nivel III: Avanzado</span>
              <span className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Automatización (48h)</span>
            </button>
          </div>
        </div>

        {/* CONTAINER PANELES */}
        <div className="relative">

          {/* ======================= NIVEL I: BÁSICO ======================= */}
          {activeTab === "nivel1" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-12">
                <p className="text-lg text-slate-500 max-w-3xl mx-auto italic">
                  Ideal para principiantes. El objetivo es establecer bases sólidas en las tres tecnologías, enfocándose en la automatización inicial.
                </p>
              </div>
              <div className="space-y-4">
                
                {/* Power BI Nive I */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-900/[0.02] transition-all duration-300">
                  <button onClick={() => toggleItem("n1-pbi")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n1-pbi") ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
                        <BarChart3 className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">Módulo Power BI</h4>
                        <span className="text-sm font-bold text-amber-600">16 Horas • Dashboards e Informes Iniciales</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n1-pbi") ? 'rotate-180 text-amber-500' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Introducción al entorno, instalaciones y cuentas.",
                          "Power Query: Importación desde Excel, SQL y APIs.",
                          "Limpieza básica de datos, cálculos y columnas a medida.",
                          "Visualizaciones iniciales: Barras, líneas, mapas y KPIs.",
                          "Integración de IA: Lenguaje natural (Q&A) y tendencias automáticas."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-slate-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel I */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-900/[0.02] transition-all duration-300">
                  <button onClick={() => toggleItem("n1-sql")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n1-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Database className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">Módulo SQL Server</h4>
                        <span className="text-sm font-bold text-blue-600">16 Horas • Consultas y Filtros Base</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n1-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Recuperación de datos (SELECT) y límites (TOP).",
                          "Funciones de fecha (MONTH, YEAR) para filtros temporales.",
                          "Operadores lógicos (AND/OR) y cláusula WHERE.",
                          "Cruce de tablas inicial (INNER y LEFT JOIN).",
                          "Uso de IA para generar consultas automatizadas a medida."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-slate-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel I */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-900/[0.02] transition-all duration-300">
                  <button onClick={() => toggleItem("n1-py")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n1-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Code2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">Módulo Python</h4>
                        <span className="text-sm font-bold text-indigo-600">16 Horas • Fundamentos y Análisis Tabular</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n1-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Variables, tipos de datos y control de flujo (if/else).",
                          "Estructuras de datos: Listas, Tuplas y Diccionarios.",
                          "Introducción a Pandas: DataFrames desde Excel.",
                          "Manipulación inicial de columnas y exploración tabular.",
                          "Generación de código IA para extraer datos y patrones."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-slate-600">{item}</span>
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
              <div className="text-center mb-12">
                <p className="text-lg text-slate-500 max-w-3xl mx-auto italic">
                  Manipula datos de forma avanzada, domina modelado DAX y crea visualizaciones estéticas para informes consolidados.
                </p>
              </div>
              <div className="space-y-4">
                
                {/* Power BI Nive II */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-pbi")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n2-pbi") ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
                        <LineChart className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">Módulo Power BI</h4>
                        <span className="text-sm font-bold text-amber-600">16 Horas • DAX, Relaciones e Interacciones</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n2-pbi") ? 'rotate-180 text-amber-500' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Visualizaciones con saturación de color y Unpivot Columns.",
                          "Introducción a DAX: Tablas de medidas y relaciones.",
                          "Títulos dinámicos mediante SELECTEDVALUE y LOOKUPVALUE.",
                          "Publicación online con roles seguridad organizacional.",
                          "Estructura de medidas DAX inteligentes asistidas por IA."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-slate-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel II */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-blue-400/50 shadow-sm hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-sql")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n2-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Server className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">Módulo SQL Server</h4>
                        <span className="text-sm font-bold text-blue-600">16 Horas • Joins Avanzados y Agrupaciones</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n2-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Uso de FULL y RIGHT JOIN para detectar discrepancias.",
                          "GROUP BY y funciones de agregación (SUM, ORDER BY).",
                          "Cruces simultáneos de múltiples tablas con condiciones.",
                          "Vistas de valorización y consolidados departamentales.",
                          "Preprocesamiento de datos para modelos predictivos IA."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-slate-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel II */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-indigo-400/50 shadow-sm hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-py")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n2-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Network className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">Módulo Python</h4>
                        <span className="text-sm font-bold text-indigo-600">16 Horas • Pandas y Visualización Estética</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n2-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Pandas: Groupby, agregaciones múltiples y tipos.",
                          "Matplotlib: Gráficos de líneas, ejes y referencias.",
                          "Seaborn: Visualización estética avanzada para reportes.",
                          "Limpieza profunda de transacciones y fechas.",
                          "Automatización de reportes de complejidad media con IA."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-slate-600">{item}</span>
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
              <div className="text-center mb-12">
                <p className="text-lg text-slate-500 max-w-3xl mx-auto italic">
                  Profundiza en automatización de servidores, Data Science con librerías interactivas y modelos predictivos integrando IA avanzada.
                </p>
              </div>
              <div className="space-y-4">
                
                {/* Power BI Nive III */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-amber-400/50 shadow-sm hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-pbi")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n3-pbi") ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
                        <Bolt className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">Módulo Power BI</h4>
                        <span className="text-sm font-bold text-amber-600">16 Horas • Inteligencia de Tiempo y AI Predictiva</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n3-pbi") ? 'rotate-180 text-amber-500' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "DAX avanzado: YTD, MTD, SAMEPERIODLASTYEAR.",
                          "Parámetros Dinámicos (What if) y prorrateo de metas.",
                          "Interactividad Total: Botones, Marcadores y Drillthrough.",
                          "Seguridad RLS avanzada y funciones USERELATIONSHIP.",
                          "IA Generativa en PBI: Smart Narratives y Copilot."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-slate-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel III */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-blue-400/50 shadow-sm hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-sql")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n3-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Network className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">Módulo SQL Server</h4>
                        <span className="text-sm font-bold text-blue-600">16 Horas • Procedimientos y Automatización</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n3-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Vistas avanzadas con condicionales CASE WHEN.",
                          "Funciones de cadena y cruces de alta complejidad.",
                          "Automatización con CREATE PROC y EXECUTE.",
                          "Administración: SELECT INTO, ALTER TABLE y UPDATE.",
                          "Procesos ETL vinculando SQL con Python e IA."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-slate-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel III */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-indigo-400/50 shadow-sm hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-py")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n3-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Bot className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900">Módulo Python</h4>
                        <span className="text-sm font-bold text-indigo-600">16 Horas • Dashboards Interactivos y Predictividad</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n3-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-slate-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Unión de bases complejas mediante pd.merge().",
                          "Aplicación de funciones personalizadas .apply().",
                          "Gráficos declarativos e interactivos con Plotly.",
                          "Sunburst, Treemaps y subgráficos de alta interactividad.",
                          "Proyecto Final: Análisis predictivo con IA integrada."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-slate-600">{item}</span>
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

        {/* AYUDA / CONTACTO */}
        <div className="mt-20 bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-12 text-center shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full blur-3xl -z-10 group-hover:bg-slate-100 transition-colors" />
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">¿Necesitas ayuda con el plan de estudios?</h3>
            <p className="text-base md:text-lg text-slate-600 mb-10 max-w-2xl mx-auto font-light">
                Si tienes dudas sobre el contenido detallado, la modalidad o facilidades de pago, conversémoslo directamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                    href="https://wa.me/56935409699" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold text-base hover:scale-105 transition-transform no-underline shadow-lg shadow-green-100"
                >
                    <MessageCircle className="w-6 h-6" /> Contactar por WhatsApp
                </a>
                <a 
                    href="tel:+56935409699" 
                    className="flex items-center gap-3 bg-slate-100 text-slate-700 px-8 py-4 rounded-xl font-bold text-base hover:bg-slate-200 transition-colors no-underline"
                >
                    <Phone className="w-6 h-6" /> +56 9 3540 9699
                </a>
            </div>
        </div>

      </div>
    </div>
  );
}
