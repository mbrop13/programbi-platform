"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star, Target, Trophy, Play, BarChart, Database, Code, FileSpreadsheet, Construction, Bot } from "lucide-react";

export default function MiningSyllabus() {
  const [activeTab, setActiveTab] = useState("modulo1");
  const [openItems, setOpenItems] = useState<string[]>(["m1-1"]);

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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight mb-6 font-display leading-tight">
            Análisis de Datos para la <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800">Industria Minera</span>
          </h2>
          <p className="text-base md:text-lg text-stone-600 max-w-3xl mx-auto font-light leading-relaxed">
            Optimización de Procesos y Toma de Decisiones en Entornos Mineros. Un trayecto estructurado de 64 horas para transformar datos operativos en activos estratégicos.
          </p>
        </div>

        {/* INFORMACIÓN GENERAL */}
        <div className="grid md:grid-cols-5 gap-6 mb-14">
            <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-stone-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-amber-200 transition-colors">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-stone-50 rounded-full blur-2xl group-hover:bg-amber-50/50 transition-colors pointer-events-none" />
                <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-700" /> Dirigido a:
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed relative z-10 font-medium">
                    Profesionales y técnicos del sector minero (operaciones, finanzas, planificación, RRHH y mantenimiento) que gestionan volúmenes de datos operativos y buscan automatizar el control de proyectos.
                </p>
                <div className="mt-6 pt-6 border-t border-stone-100">
                    <p className="text-xs text-amber-800 flex items-center gap-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                        <Check className="w-4 h-4" /> <strong>Respaldo ProgramBI:</strong> AngloAmerican, CAP y Minera Meridian.
                    </p>
                </div>
            </div>

            <div className="md:col-span-3 bg-gradient-to-br from-amber-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-amber-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                <h3 className="text-lg font-bold text-amber-800 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios del Programa:
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4 text-sm text-stone-700">
                    {[
                        { t: "Automatización Extrema", d: "Elimina tareas repetitivas con Macros y Python." },
                        { t: "Visualización de Impacto", d: "Dashboards en tiempo real de KPIs críticos." },
                        { t: "Integración de Datos", d: "Limpia datos de SQL, APIs y Excel." },
                        { t: "Decisiones Predictivas", d: "Uso de IA para detectar tendencias." },
                        { t: "Eficiencia Operativa", d: "Reduce horas de trabajo a minutos." },
                        { t: "Proyectos Reales", d: "Aplicación directa a casos de faena." }
                    ].map((b, i) => (
                        <li key={i} className="flex gap-3 items-start">
                            <div className="mt-0.5 bg-amber-100/50 p-1 rounded-full text-amber-700 shrink-0">
                                <Check className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <strong className="block text-stone-900">{b.t}</strong>
                                <span className="text-[11px] leading-tight text-stone-500">{b.d}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* TABS - Segmented Control (4 Módulos) */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex flex-wrap lg:flex-nowrap bg-stone-100 p-1.5 rounded-3xl border border-stone-200 shadow-sm backdrop-blur-md w-full max-w-4xl justify-center gap-1">
            
            {/* Tab 1: Excel */}
            <button
              onClick={() => setActiveTab("modulo1")}
              className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex-1 min-w-[140px] flex flex-col items-center border-none cursor-pointer outline-none ${
                activeTab === "modulo1" ? "bg-white text-amber-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-stone-500 hover:text-stone-800 hover:bg-stone-200/50"
              }`}
            >
              <span className="flex items-center gap-2"><FileSpreadsheet className="w-4 h-4" /> Módulo I</span>
              <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60">Excel Gestión (16h)</span>
            </button>

            {/* Tab 2: Power BI */}
            <button
               onClick={() => setActiveTab("modulo2")}
               className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex-1 min-w-[140px] flex flex-col items-center border-none cursor-pointer outline-none ${
                 activeTab === "modulo2" ? "bg-white text-amber-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-stone-500 hover:text-stone-800 hover:bg-stone-200/50"
               }`}
            >
              <span className="flex items-center gap-2"><BarChart className="w-4 h-4" /> Módulo II</span>
              <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60">Power BI Minería (16h)</span>
            </button>

            {/* Tab 3: SQL */}
            <button
               onClick={() => setActiveTab("modulo3")}
               className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex-1 min-w-[140px] flex flex-col items-center border-none cursor-pointer outline-none ${
                 activeTab === "modulo3" ? "bg-white text-amber-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-stone-500 hover:text-stone-800 hover:bg-stone-200/50"
               }`}
            >
              <span className="flex items-center gap-2"><Database className="w-4 h-4" /> Módulo III</span>
              <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60">SQL Server (16h)</span>
            </button>

            {/* Tab 4: Python */}
            <button
               onClick={() => setActiveTab("modulo4")}
               className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex-1 min-w-[140px] flex flex-col items-center border-none cursor-pointer outline-none ${
                 activeTab === "modulo4" ? "bg-white text-amber-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-stone-500 hover:text-stone-800 hover:bg-stone-200/50"
               }`}
            >
              <span className="flex items-center gap-2"><Code className="w-4 h-4" /> Módulo IV</span>
              <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60">Python Predictivo (16h)</span>
            </button>
          </div>
        </div>

        {/* CONTAINER PANELES */}
        <div className="relative">

          {/* ======================= MÓDULO I: EXCEL ======================= */}
          {activeTab === "modulo1" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <p className="text-base text-stone-500 max-w-3xl mx-auto italic">
                  Robustece la base de datos y elimina el trabajo manual en reportes de faena mediante automatización y gestión avanzada.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { num: 1, title: "Entorno y Datos Mineros", items: ["Configuración de informes administrativos mineros.", "Manejo de tipos de datos: texto, números y fechas operativas.", "Referencias absolutas y mixtas para control de costos."] },
                  { num: 2, title: "Fórmulas de Control y Validaciones", items: ["Implementación de funciones lógicas (SI, Y, O) para alertas.", "Validaciones automáticas para ingreso de datos en terreno.", "Protección de hojas para integridad de datos."] },
                  { num: 3, title: "Búsquedas Inteligentes en Faena", items: ["BUSCARV e INDICE/COINCIDIR para cruces de personal.", "Validación de bases de datos de activos mineros.", "Búsquedas dinámicas de insumos y equipos."] },
                  { num: 4, title: "Power Query Inicial para Operaciones", items: ["Importación, limpieza y combinación de datos de faena.", "Consolidación de reportes recurrentes de operacion.", "Transformación de formatos CSV/Text a tablas mineras."] },
                  { num: 5, title: "Macros y VBA de Reportabilidad", items: ["Grabación y edición de macros para reportes diarios.", "Automatización para generación de informes sin errores.", "Optimización del tiempo administrativo en oficina técnica."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`m1-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`m1-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-amber-600 text-white' : 'bg-amber-50/80 text-amber-700'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-stone-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-16 pb-6 pt-2 border-t border-stone-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-amber-300 fill-amber-300" />
                                <span className="text-stone-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= MÓDULO II: POWER BI ======================= */}
          {activeTab === "modulo2" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <p className="text-base text-stone-500 max-w-3xl mx-auto italic">
                  Transforma datos estáticos en paneles dinámicos de control de proyectos y seguimiento de KPIs mineros.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { num: 1, title: "Modelado y Relaciones Estructuradas", items: ["Administración de relaciones entre tablas operativas.", "Modelado Estrella para grandes volúmenes de datos.", "Creación de tablas de medidas ordenadas."] },
                  { num: 2, title: "DAX Intermedio para Producción", items: ["Uso de funciones fundamentales: CALCULATE y FILTER.", "Métricas dinámicas mediante SWITCH y SELECTEDVALUE.", "Títulos y etiquetas inteligentes que responden a filtros."] },
                  { num: 3, title: "Inteligencia de Tiempo en Finanzas/Op", items: ["Cálculos acumulados (YTD, MTD) para producción.", "Comparativos vs año anterior (SAMEPERIODLASTYEAR).", "Análisis de desviaciones en cumplimiento de metas."] },
                  { num: 4, title: "Visualización Avanzada y Seguridad RLS", items: ["Tooltips dinámicos y segmentadores avanzados.", "Uso de marcadores para navegación entre departamentos.", "Configuración de RLS: seguridad por jefe de área o faena."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`m2-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`m2-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-amber-600 text-white' : 'bg-amber-50/80 text-amber-700'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-stone-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-16 pb-6 pt-2 border-t border-stone-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-amber-300 fill-amber-300" />
                                <span className="text-stone-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= MÓDULO III: SQL ======================= */}
          {activeTab === "modulo3" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="text-center mb-10">
                <p className="text-base text-stone-500 max-w-3xl mx-auto italic">
                  Extrae información directamente de los servidores mineros sin intermediarios mediante consultas robustas.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { num: 1, title: "Consultas de Extracción Directa", items: ["Cláusula SELECT esencial para captura masiva.", "Filtros WHERE y operadores lógicos aplicados a turnos.", "Funciones de fecha (MONTH, YEAR) para reportes diarios."] },
                  { num: 2, title: "Cruces y Resúmenes Departamentales", items: ["Joins (INNER, LEFT) para consolidar flota y equipos.", "GROUP BY y funciones de agregación (SUM, AVG).", "Valorización de producción mediante consultas SQL."] },
                  { num: 3, title: "Programación T-SQL y Automatización", items: ["Creación de Vistas para reportería constante.", "Stored Procedures para automatización total de queries.", "Manejo de tablas de reporte temporales."] },
                  { num: 4, title: "Integración de IA en Bases de Datos", items: ["Generación de queries complejas mediante IA.", "Optimización de captura masiva en servidores mineros."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`m3-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`m3-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-amber-600 text-white' : 'bg-amber-50/80 text-amber-700'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-stone-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-16 pb-6 pt-2 border-t border-stone-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-amber-300 fill-amber-300" />
                                <span className="text-stone-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= MÓDULO IV: PYTHON ======================= */}
          {activeTab === "modulo4" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="text-center mb-10">
                <p className="text-base text-stone-500 max-w-3xl mx-auto italic">
                  Análisis predictivo y procesamiento de volúmenes masivos de datos operativos característicos de la minería.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { num: 1, title: "Librería Pandas y Manipulación Masiva", items: ["DataFrames desde SQL, filtrado y transformación.", "Unión de DataFrames (Merge) de distintas faenas.", "Aplicación de funciones (.apply) para limpieza."] },
                  { num: 2, title: "Visualización Interactiva Industrial", items: ["Gráficos estadísticos con Seaborn para sensorización.", "Dashboards con Plotly (Sunburst, Dispersión).", "Visualización de ciclos de carguío y transporte."] },
                  { num: 3, title: "IA Predictiva en Operaciones", items: ["Detección de patrones operativos mediante IA.", "Generación de scripts para captura de APIs mineras.", "Integración de modelos para alerta temprana."] },
                  { num: 4, title: "Proyecto Final: Inteligencia de Faena", items: ["Desarrollo de caso real de negocio minero.", "Captura, limpieza y visualización end-to-end."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`m4-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-amber-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`m4-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-amber-600 text-white' : 'bg-amber-50/80 text-amber-700'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-stone-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-16 pb-6 pt-2 border-t border-stone-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-amber-300 fill-amber-300" />
                                <span className="text-stone-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* ITEM AI SPECIAL */}
                <div className="bg-gradient-to-br from-amber-600/10 to-transparent rounded-2xl border border-amber-600/20 overflow-hidden hover:shadow-lg hover:shadow-amber-600/5 transition-all duration-300 relative group mt-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 blur-[80px] -z-10 group-hover:bg-amber-600/20 transition-colors" />
                    <div className="flex justify-between items-center w-full p-5 lg:px-6 bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-600 text-white">
                                <Bot className="w-5 h-5" />
                            </div>
                            <span className="text-base font-bold text-stone-900 italic">Especialización Industrial 2026</span>
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
