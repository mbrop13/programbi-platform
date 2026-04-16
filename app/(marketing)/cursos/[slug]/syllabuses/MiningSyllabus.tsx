"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star, Target, Trophy, Play, BarChart, Database, Code, FileSpreadsheet, Construction, Bot, MessageCircle, Phone, HardHat } from "lucide-react";

export default function MiningSyllabus() {
  const [activeTab, setActiveTab] = useState("nivel1");
  const [openItems, setOpenItems] = useState<string[]>(["n1-pbi"]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-20 bg-stone-50 border-y border-stone-200 relative overflow-hidden font-sans">
      {/* Background Decorators */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-50/50 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl px-6 relative z-10">
        
        {/* CABECERA */}
        <div className="text-center mb-16 relative">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-amber-50/80 text-amber-700 font-bold tracking-wide uppercase text-xs mb-6 border border-amber-100/50 shadow-sm backdrop-blur-sm">
            Programa Industrial & Minero 2026
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-stone-900 tracking-tight mb-6 font-display leading-tight">
            Especialización en <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800">Datos para la Minería</span>
          </h2>
          <p className="text-base md:text-xl text-stone-600 max-w-4xl mx-auto font-light leading-relaxed">
            Un trayecto formativo de 144 horas divididas en 3 niveles, combinando el poder de <strong>Power BI, SQL Server y Python</strong> para optimizar procesos y predecir fallas en la operación minera.
          </p>
        </div>

        {/* INFORMACIÓN GENERAL */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-stone-50 rounded-full blur-2xl group-hover:bg-amber-50/50 transition-colors pointer-events-none" />
                <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                    <Target className="w-6 h-6 text-amber-700" /> Dirigido a:
                </h3>
                <p className="text-base text-stone-600 leading-relaxed relative z-10">
                    Profesionales y técnicos del sector minero e industrial (operaciones, finanzas, planificación, mantenimiento y RRHH) que buscan dominar el ciclo completo del dato. Ideal para automatizar paneles de control de flota y modelos predictivos.
                </p>
                <div className="mt-8 pt-8 border-t border-stone-100">
                    <p className="text-xs text-amber-800 flex items-center gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                        <HardHat className="w-5 h-5" /> <strong>Respaldo ProgramBI:</strong> CAP, AngloAmerican y Minera Meridian.
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 shadow-sm">
                <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-amber-700" /> Beneficios del Programa:
                </h3>
                <ul className="space-y-4 text-sm text-stone-700">
                    {[
                        { t: "Visibilidad Operativa", d: "Dashboards en tiempo real de producción y mantenimiento." },
                        { t: "Control de Datos Nativos", d: "Conexión SQL directa a servidores (PI System, SCADA)." },
                        { t: "Mantenimiento Predictivo", d: "Modelado de vida útil de activos con Python." },
                        { t: "Optimización de Tiempos", d: "Reduce reportes de horas a simples minutos." },
                        { t: "Integración de IA", d: "Uso de IA para generar códigos y resolver problemas complejos." }
                    ].map((b, i) => (
                        <li key={i} className="flex gap-4 items-start">
                            <div className="mt-0.5 bg-amber-100/50 p-1.5 rounded-full text-amber-700 shrink-0">
                                <Check className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <strong className="block text-stone-900">{b.t}</strong>
                                <span className="text-xs leading-tight text-stone-500">{b.d}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
        {/* NAVEGACIÓN DE PESTAÑAS (3 Niveles de 48h) */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex flex-wrap lg:flex-nowrap bg-stone-200/50 p-2 rounded-[2rem] border border-stone-200 shadow-sm backdrop-blur-md w-full max-w-4xl justify-center gap-2">
            
            {/* Tab 1: Nivel I */}
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`relative px-8 py-4 rounded-3xl text-sm font-bold transition-all duration-300 flex-1 min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none ${
                activeTab === "nivel1" ? "bg-white text-amber-700 shadow-md" : "text-stone-500 hover:text-stone-800 hover:bg-white/40"
              }`}
            >
              <span className="text-lg">Nivel I: Básico</span>
              <span className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Fundamentos Operativos (48h)</span>
            </button>

            {/* Tab 2: Nivel II */}
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`relative px-8 py-4 rounded-3xl text-sm font-bold transition-all duration-300 flex-1 min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none ${
                 activeTab === "nivel2" ? "bg-white text-amber-700 shadow-md" : "text-stone-500 hover:text-stone-800 hover:bg-white/40"
               }`}
            >
              <span className="text-lg">Nivel II: Intermedio</span>
              <span className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Análisis y KPIs (48h)</span>
            </button>

            {/* Tab 3: Nivel III */}
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`relative px-8 py-4 rounded-3xl text-sm font-bold transition-all duration-300 flex-1 min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none ${
                 activeTab === "nivel3" ? "bg-white text-amber-700 shadow-md" : "text-stone-500 hover:text-stone-800 hover:bg-white/40"
               }`}
            >
              <span className="text-lg">Nivel III: Avanzado</span>
              <span className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Predictividad (48h)</span>
            </button>
          </div>
        </div>

        {/* CONTAINER PANELES */}
        <div className="relative">

          {/* ======================= NIVEL I: BÁSICO ======================= */}
          {activeTab === "nivel1" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-12">
                <p className="text-lg text-stone-500 max-w-3xl mx-auto italic">
                  Ideal para quienes inician. Establece las bases en las tres tecnologías, enfocándose en la automatización de la captura de datos de turnos.
                </p>
              </div>
              <div className="space-y-4">
                
                {/* Power BI Nivel I */}
                <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n1-pbi")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n1-pbi") ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'}`}>
                        <BarChart className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-stone-900">Módulo Power BI</h4>
                        <span className="text-sm font-bold text-amber-600">16 Horas • Dashboards de Operación</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-stone-300 transition-transform duration-300 ${openItems.includes("n1-pbi") ? 'rotate-180 text-amber-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Comprensión del flujo de datos en minería e instalaciones.",
                          "Importación de reportes de turnos (Excel, CSV, APIs).",
                          "Limpieza de datos de maquinaria y cálculos de disponibilidad.",
                          "Gráficos de tonelaje, seguridad y KPIs de horas hombre.",
                          "Integración de IA para consultas en lenguaje natural operativos."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-stone-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel I */}
                <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-blue-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n1-sql")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n1-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Database className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-stone-900">Módulo SQL Server</h4>
                        <span className="text-sm font-bold text-blue-600">16 Horas • Consultas a Bases de la Mina</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n1-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "SELECT, filtrado de sensores (TOP) y funciones de turno.",
                          "Cláusula WHERE para aislar equipos o incidentes específicos.",
                          "INNER JOIN para cruzar Personal con Equipos Operados.",
                          "Identificación de fallos y limpieza de registros nulos.",
                          "Queries asistidas por IA para reportes de mantenimiento."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-stone-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel I */}
                <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-indigo-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n1-py")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n1-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Code className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-stone-900">Módulo Python</h4>
                        <span className="text-sm font-bold text-indigo-600">16 Horas • Automatización y Análisis Tabular</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n1-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Control de flujo para alertas de presión y temperatura.",
                          "Clasificación de flotas y recursos mediante diccionarios.",
                          "Pandas: Carga de históricos de perforación o transporte.",
                          "Selección y limpieza de columnas en procesos masivos.",
                          "SCRIPTS IA para formatear logs de sensores diarios."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-stone-600">{item}</span>
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
                <p className="text-lg text-stone-500 max-w-3xl mx-auto italic">
                  Consolida datos de diferentes áreas, crea relaciones robustas y visualiza las leyes de mineral y eficiencia avanzada.
                </p>
              </div>
              <div className="space-y-4">
                
                {/* Power BI Nive II */}
                <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-pbi")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n2-pbi") ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'}`}>
                        <BarChart className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-stone-900">Módulo Power BI</h4>
                        <span className="text-sm font-bold text-amber-600">16 Horas • DAX y Relaciones de Área</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-stone-300 transition-transform duration-300 ${openItems.includes("n2-pbi") ? 'rotate-180 text-amber-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Mapas geolocalizados de faena y matrices operativas.",
                          "DAX para Ley Promedio, Costo por Tonelada y Eficiencia.",
                          "Uso de CALCULATE, SWITCH y LOOKUPVALUE.",
                          "Roles de lectura (RLS) segmentados por Jefatura de Turno.",
                          "IA para estructurar medidas de eficiencia general de equipos."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-stone-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel II */}
                <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-blue-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-sql")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n2-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Database className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-stone-900">Módulo SQL Server</h4>
                        <span className="text-sm font-bold text-blue-600">16 Horas • Agrupaciones y Resúmenes Consolidado</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n2-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Auditoría de inventario vs extracción (FULL JOIN).",
                          "Consolidados por mes, área y tipo de material (GROUP BY).",
                          "Cruce de Combustible, Flota, Personal y Tonelaje.",
                          "Creación de vistas de control operativo automatizadas.",
                          "Preparación de datasets optimizados para Machine Learning."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-stone-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel II */}
                <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-indigo-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-py")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n2-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Code className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-stone-900">Módulo Python</h4>
                        <span className="text-sm font-bold text-indigo-600">16 Horas • DataFrames y Gráficos Exploratorios</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n2-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Pandas: Evaluación de neumáticos y consumo eléctrico.",
                          "Análisis de series de tiempo para métricas de vibración.",
                          "Gráficos de tendencias para molinos y maquinaria pesada.",
                          "Análisis de correlación: Clima vs Eficiencia operativa.",
                          "IA para validar automáticamente datos de sensores diarios."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-stone-600">{item}</span>
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
                <p className="text-lg text-stone-500 max-w-3xl mx-auto italic">
                  Nivel definitivo: domina proyecciones, automatiza Data Warehouse y desarrolla modelos predictivos para adelantarte a fallos.
                </p>
              </div>
              <div className="space-y-4">
                
                {/* Power BI Nive III */}
                <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-pbi")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n3-pbi") ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'}`}>
                        <BarChart className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-stone-900">Módulo Power BI</h4>
                        <span className="text-sm font-bold text-amber-600">16 Horas • Inteligencia de Tiempo y RLS Dinámico</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-stone-300 transition-transform duration-300 ${openItems.includes("n3-pbi") ? 'rotate-180 text-amber-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Producción acumulada (YTD) y proyecciones de extracción.",
                          "Análisis What-if para simulación de metas y rendimientos.",
                          "UX: Tooltips de equipo, marcadores y vistas gerenciales.",
                          "RLS dinámico (USERNAME) y relaciones inactivas.",
                          "IA para informes ejecutivos y detección de anomalías."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-stone-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel III */}
                <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-blue-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-sql")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n3-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Database className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-stone-900">Módulo SQL Server</h4>
                        <span className="text-sm font-bold text-blue-600">16 Horas • Procedimientos y Automatización Servidor</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n3-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "T-SQL: Alertas de maquinaria mediante CASE WHEN.",
                          "Automatización con Stored Procedures para Data Warehouse.",
                          "Modificación masiva (UPDATE) y restricciones de calidad.",
                          "Arquitectura ETL predictiva asistida por IA.",
                          "Optimización de queries para entornos de alta concurrencia."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-base">
                            <Play className="w-3.5 h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-stone-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel III */}
                <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-indigo-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-py")} className="flex justify-between items-center w-full p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes("n3-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Bot className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-stone-900">Módulo Python</h4>
                        <span className="text-sm font-bold text-indigo-600">16 Horas • Análisis Predictivo y Dashboards Plotly</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${openItems.includes("n3-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-8 lg:px-28 pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-3 pt-6">
                        {[
                          "Merge masivo de Operaciones, Mantenimiento y RRHH.",
                          "Funciones personalizadas (.apply) de riesgo operativo.",
                          "Plotly: Sunburst de fallas y diagramas de desgaste.",
                          "Proyecto Final: Modelo predictivo de fallos en flota.",
                          "Dashboard interactivo de alta calidad para gerencia."
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
        <div className="mt-20 bg-white border border-stone-200 rounded-[2.5rem] p-10 md:p-12 text-center shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full blur-3xl -z-10 group-hover:bg-amber-100 transition-colors" />
            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">¿Necesitas ayuda con el plan de estudios?</h3>
            <p className="text-base md:text-lg text-stone-600 mb-10 max-w-2xl mx-auto font-light">
                Si tienes dudas sobre el contenido específico para tu área, la modalidad o facilidades de pago, conversémoslo directamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                    href="https://wa.me/56935409699" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold text-base hover:scale-105 transition-transform no-underline shadow-lg shadow-green-200"
                >
                    <MessageCircle className="w-6 h-6" /> Contactar por WhatsApp
                </a>
                <a 
                    href="tel:+56935409699" 
                    className="flex items-center gap-3 bg-stone-100 text-stone-700 px-8 py-4 rounded-xl font-bold text-base hover:bg-stone-200 transition-colors no-underline"
                >
                    <Phone className="w-6 h-6" /> +56 9 3540 9699
                </a>
            </div>
        </div>

      </div>
    </div>
  );
}
