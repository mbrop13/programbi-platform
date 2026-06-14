"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star, Target, Trophy, Play, BarChart, Database, Code, FileSpreadsheet, Construction, Bot, MessageCircle, Phone, HardHat } from "lucide-react";

export default function MiningSyllabus({ selectedLevel, hideSelector = false, cleanLayout = false }: { selectedLevel?: number; hideSelector?: boolean; cleanLayout?: boolean }) {
  const [localTab, setLocalTab] = useState("nivel1");
  const activeTab = selectedLevel !== undefined
    ? (selectedLevel === 0 ? "nivel1" : selectedLevel === 1 ? "nivel2" : "nivel3")
    : localTab;
  const setActiveTab = selectedLevel !== undefined ? () => {} : setLocalTab;
  const [openItems, setOpenItems] = useState<string[]>(["n1-pbi"]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={cleanLayout ? "font-sans relative z-10 w-full" : "py-12 sm:py-20 bg-stone-50 border-y border-stone-200 relative overflow-hidden font-sans"}>
      {/* Background Decorators */}
      {!cleanLayout && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-50/50 blur-[100px] rounded-full -z-10 pointer-events-none" />
      )}
      
      <div className={cleanLayout ? "relative z-10 w-full" : "container mx-auto max-w-5xl px-4 sm:px-6 relative z-10"}>
        
        {/* CABECERA */}
        {!cleanLayout && (
          <div className="text-center mb-10 sm:mb-16 relative">
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-amber-50/80 text-amber-700 font-bold tracking-wide uppercase text-xs mb-4 sm:mb-6 border border-amber-100/50 shadow-sm backdrop-blur-sm">
              Programa Industrial & Minero 2026
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-stone-900 tracking-tight mb-4 sm:mb-6 font-display leading-tight">
              Especialización en <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800">Datos para la Minería</span>
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-stone-600 max-w-4xl mx-auto font-light leading-relaxed">
              Un trayecto formativo de 48 horas divididas en 3 niveles, combinando el poder de <strong>Power BI, SQL Server y Python</strong> para optimizar procesos y predecir fallas en la operación minera.
            </p>
          </div>
        )}

        {/* INFORMACIÓN GENERAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 sm:mb-16">
            <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-stone-50 rounded-full blur-2xl group-hover:bg-amber-50/50 transition-colors pointer-events-none" />
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-4 sm:mb-6 flex items-center gap-3">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" /> Dirigido a:
                </h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed relative z-10">
                    Especialización técnica de 48h para profesionales mineros e industriales. Domina el ciclo completo del dato, desde la automatización de flotas hasta el mantenimiento predictivo.
                </p>
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-stone-100">
                    <p className="text-xs sm:text-sm text-amber-800 flex items-center gap-2.5 sm:gap-3 bg-amber-50/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-100/50">
                        <HardHat className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> <span><strong>Respaldo ProgramBI:</strong> CAP, AngloAmerican y Minera Meridian.</span>
                    </p>
                </div>
            </div>

            <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-stone-200 shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-4 sm:mb-6 flex items-center gap-3">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" /> Beneficios del Programa:
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-stone-700">
                    {[
                        { t: "Visibilidad Operativa", d: "Dashboards en tiempo real de producción y mantenimiento." },
                        { t: "Control de Datos Nativos", d: "Conexión SQL directa a servidores (PI System, SCADA)." },
                        { t: "Mantenimiento Predictivo", d: "Modelado de vida útil de activos con Python." },
                        { t: "Optimización de Tiempos", d: "Reduce reportes de horas a simples minutos." },
                        { t: "Integración de IA", d: "Uso de IA para generar códigos y resolver problemas complejos." }
                    ].map((b, i) => (
                        <li key={i} className="flex gap-3 sm:gap-4 items-start">
                            <div className="mt-0.5 bg-amber-100/50 p-1.5 rounded-full text-amber-700 shrink-0">
                                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </div>
                            <div>
                                <strong className="block text-stone-900 text-xs sm:text-sm">{b.t}</strong>
                                <span className="text-[10px] sm:text-xs leading-tight text-stone-500">{b.d}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
        {/* NAVEGACIÓN DE PESTAÑAS (3 Niveles de 16h) */}
        {!hideSelector && !cleanLayout && (
        <div className="flex justify-center mb-12 sm:mb-16 max-w-full">
          <div className="inline-flex bg-stone-200/50 p-1 rounded-full border border-stone-200 shadow-sm backdrop-blur-md w-full max-w-4xl overflow-x-auto scrollbar-hide flex-nowrap gap-1 sm:p-2 sm:gap-2">
            
            {/* Tab 1: Nivel I */}
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`relative px-4 py-2.5 sm:px-8 sm:py-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex-1 min-w-[140px] sm:min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none shrink-0 ${
                activeTab === "nivel1" ? "bg-white text-amber-700 shadow-md" : "text-stone-500 hover:text-stone-800 hover:bg-white/40"
              }`}
            >
              <span className="text-sm sm:text-lg whitespace-nowrap">Nivel I: Básico</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5 sm:mt-1 opacity-60 whitespace-nowrap">Fundamentos (16h)</span>
            </button>

            {/* Tab 2: Nivel II */}
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`relative px-4 py-2.5 sm:px-8 sm:py-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex-1 min-w-[140px] sm:min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none shrink-0 ${
                 activeTab === "nivel2" ? "bg-white text-amber-700 shadow-md" : "text-stone-500 hover:text-stone-800 hover:bg-white/40"
               }`}
            >
              <span className="text-sm sm:text-lg whitespace-nowrap">Nivel II: Intermedio</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5 sm:mt-1 opacity-60 whitespace-nowrap">Análisis & KPIs (16h)</span>
            </button>

            {/* Tab 3: Nivel III */}
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`relative px-4 py-2.5 sm:px-8 sm:py-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex-1 min-w-[140px] sm:min-w-[160px] flex flex-col items-center border-none cursor-pointer outline-none shrink-0 ${
                 activeTab === "nivel3" ? "bg-white text-amber-700 shadow-md" : "text-stone-500 hover:text-stone-800 hover:bg-white/40"
               }`}
            >
              <span className="text-sm sm:text-lg whitespace-nowrap">Nivel III: Avanzado</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5 sm:mt-1 opacity-60 whitespace-nowrap">Predictividad (16h)</span>
            </button>
          </div>
        </div>
        )}

        {/* CONTAINER PANELES */}
        <div className="relative">

          {/* ======================= NIVEL I: BÁSICO ======================= */}
          {activeTab === "nivel1" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8 sm:mb-12">
                <p className="text-sm sm:text-lg text-stone-500 max-w-3xl mx-auto italic">
                  Ideal para quienes inician. Establece las bases en las tres tecnologías, enfocándose en la automatización de la captura de datos de turnos.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                
                {/* Power BI Nivel I */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n1-pbi")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n1-pbi") ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'}`}>
                        <BarChart className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-stone-900 truncate">Módulo Power BI</h4>
                        <span className="text-xs sm:text-sm font-bold text-amber-600 block truncate mt-0.5">16 Horas • Dashboards de Operación</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-stone-300 transition-transform duration-300 shrink-0 ${openItems.includes("n1-pbi") ? 'rotate-180 text-amber-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Comprensión del flujo de datos en minería e instalaciones.",
                          "Importación de reportes de turnos (Excel, CSV, APIs).",
                          "Limpieza de datos de maquinaria y cálculos de disponibilidad.",
                          "Gráficos de tonelaje, seguridad y KPIs de horas hombre.",
                          "Integración de IA para consultas en lenguaje natural operativos."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-stone-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel I */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-blue-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n1-sql")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n1-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Database className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-stone-900 truncate">Módulo SQL Server</h4>
                        <span className="text-xs sm:text-sm font-bold text-blue-600 block truncate mt-0.5">16 Horas • Consultas a Bases de la Mina</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n1-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "SELECT, filtrado de sensores (TOP) y funciones de turno.",
                          "Cláusula WHERE para aislar equipos o incidentes específicos.",
                          "INNER JOIN para cruzar Personal con Equipos Operados.",
                          "Identificación de fallos y limpieza de registros nulos.",
                          "Queries asistidas por IA para reportes de mantenimiento."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-stone-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel I */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-indigo-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n1-py")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n1-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Code className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-stone-900 truncate">Módulo Python</h4>
                        <span className="text-xs sm:text-sm font-bold text-indigo-600 block truncate mt-0.5">16 Horas • Automatización y Análisis Tabular</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n1-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n1-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Control de flujo para alertas de presión y temperatura.",
                          "Clasificación de flotas y recursos mediante diccionarios.",
                          "Pandas: Carga de históricos de perforación o transporte.",
                          "Selección y limpieza de columnas en procesos masivos.",
                          "SCRIPTS IA para formatear logs de sensores diarios."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-stone-600 leading-relaxed">{item}</span>
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
                <p className="text-sm sm:text-lg text-stone-500 max-w-3xl mx-auto italic">
                  Consolida datos de diferentes áreas, crea relaciones robustas y visualiza las leyes de mineral y eficiencia avanzada.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                
                {/* Power BI Nivel II */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-pbi")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n2-pbi") ? 'bg-amber-650 text-white' : 'bg-amber-50 text-amber-700'}`}>
                        <BarChart className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-stone-900 truncate">Módulo Power BI</h4>
                        <span className="text-xs sm:text-sm font-bold text-amber-600 block truncate mt-0.5">16 Horas • DAX y Relaciones de Área</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-stone-300 transition-transform duration-300 shrink-0 ${openItems.includes("n2-pbi") ? 'rotate-180 text-amber-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Mapas geolocalizados de faena y matrices operativas.",
                          "DAX para Ley Promedio, Costo por Tonelada y Eficiencia.",
                          "Uso de CALCULATE, SWITCH y LOOKUPVALUE.",
                          "Roles de lectura (RLS) segmentados por Jefatura de Turno.",
                          "IA para estructurar medidas de eficiencia general de equipos."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-stone-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel II */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-blue-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-sql")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n2-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Database className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-stone-900 truncate">Módulo SQL Server</h4>
                        <span className="text-xs sm:text-sm font-bold text-blue-600 block truncate mt-0.5">16 Horas • Agrupaciones y Resúmenes Consolidado</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n2-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Auditoría de inventario vs extracción (FULL JOIN).",
                          "Consolidados por mes, área y tipo de material (GROUP BY).",
                          "Cruce de Combustible, Flota, Personal y Tonelaje.",
                          "Creación de vistas de control operativo automatizadas.",
                          "Preparación de datasets optimizados para Machine Learning."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-stone-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel II */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-indigo-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n2-py")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n2-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Code className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-stone-900 truncate">Módulo Python</h4>
                        <span className="text-xs sm:text-sm font-bold text-indigo-600 block truncate mt-0.5">16 Horas • DataFrames y Gráficos Exploratorios</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n2-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n2-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Pandas: Evaluación de neumáticos y consumo eléctrico.",
                          "Análisis de series de tiempo para métricas de vibración.",
                          "Gráficos de tendencias para molinos y maquinaria pesada.",
                          "Análisis de correlación: Clima vs Eficiencia operativa.",
                          "IA para validar automáticamente datos de sensores diarios."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-stone-600 leading-relaxed">{item}</span>
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
                <p className="text-sm sm:text-lg text-stone-500 max-w-3xl mx-auto italic">
                  Nivel definitivo: domina proyecciones, automatiza Data Warehouse y desarrolla modelos predictivos para adelantarte a fallos.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                
                {/* Power BI Nivel III */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-pbi")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n3-pbi") ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'}`}>
                        <BarChart className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-stone-900 truncate">Módulo Power BI</h4>
                        <span className="text-xs sm:text-sm font-bold text-amber-600 block truncate mt-0.5">16 Horas • Inteligencia de Tiempo y RLS Dinámico</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-stone-300 transition-transform duration-300 shrink-0 ${openItems.includes("n3-pbi") ? 'rotate-180 text-amber-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-pbi") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Producción acumulada (YTD) y proyecciones de extracción.",
                          "Análisis What-if para simulación de metas y rendimientos.",
                          "UX: Tooltips de equipo, marcadores y vistas gerenciales.",
                          "RLS dinámico (USERNAME) y relaciones inactivas.",
                          "IA para informes ejecutivos y detección de anomalías."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-amber-400 fill-amber-400" />
                            <span className="text-stone-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SQL Nivel III */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-blue-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-sql")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n3-sql") ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                        <Database className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-stone-900 truncate">Módulo SQL Server</h4>
                        <span className="text-xs sm:text-sm font-bold text-blue-600 block truncate mt-0.5">16 Horas • Procedimientos y Automatización Servidor</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n3-sql") ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-sql") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-stone-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "T-SQL: Alertas de maquinaria mediante CASE WHEN.",
                          "Automatización con Stored Procedures para Data Warehouse.",
                          "Modificación masiva (UPDATE) y restricciones de calidad.",
                          "Arquitectura ETL predictiva asistida por IA.",
                          "Optimización de queries para entornos de alta concurrencia."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-blue-400 fill-blue-400" />
                            <span className="text-stone-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Python Nivel III */}
                <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-stone-200 overflow-hidden hover:border-indigo-400/50 hover:shadow-xl transition-all duration-300">
                  <button onClick={() => toggleItem("n3-py")} className="flex justify-between items-center w-full p-4 sm:p-6 lg:p-8 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${openItems.includes("n3-py") ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Bot className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base sm:text-xl font-black text-stone-900 truncate">Módulo Python</h4>
                        <span className="text-xs sm:text-sm font-bold text-indigo-600 block truncate mt-0.5">16 Horas • Análisis Predictivo y Dashboards Plotly</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300 transition-transform duration-300 shrink-0 ${openItems.includes("n3-py") ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes("n3-py") ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 sm:px-8 lg:px-28 pb-6 sm:pb-10 pt-2 border-t border-indigo-50">
                      <ul className="space-y-2.5 sm:space-y-3 pt-4 sm:pt-6">
                        {[
                          "Merge masivo de Operaciones, Mantenimiento y RRHH.",
                          "Funciones personalizadas (.apply) de riesgo operativo.",
                          "Plotly: Sunburst de fallas y diagramas de desgaste.",
                          "Proyecto Final: Modelo predictivo de fallos en flota.",
                          "Dashboard interactivo de alta calidad para gerencia."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 items-start text-xs sm:text-base">
                            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-1.5 flex-shrink-0 text-indigo-400 fill-indigo-400" />
                            <span className="text-indigo-600 leading-relaxed">{item}</span>
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
