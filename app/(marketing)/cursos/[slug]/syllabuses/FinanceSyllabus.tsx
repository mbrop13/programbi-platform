"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star, Target, Trophy, Play, BarChart, Database, Code, FileSpreadsheet } from "lucide-react";

export default function FinanceSyllabus() {
  const [activeTab, setActiveTab] = useState("modulo1");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-20 bg-white border-y border-gray-100 relative overflow-hidden font-sans">
      {/* Background Decorators */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl px-6 relative z-10">
        
        {/* CABECERA */}
        <div className="text-center mb-16 relative">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50/80 text-blue-900 font-bold tracking-wide uppercase text-xs mb-6 border border-blue-100/50 shadow-sm backdrop-blur-sm">
            Programa Data Analytics 2026
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight mb-6 font-display leading-tight">
            Análisis de Datos para el <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">Sector Financiero</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            Un recorrido integral de 64 horas diseñado para dominar las herramientas líderes aplicadas a valoración de activos, riesgos y presupuestos.
          </p>
        </div>

        {/* INFORMACIÓN GENERAL */}
        <div className="grid md:grid-cols-5 gap-6 mb-14">
            <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-blue-100 transition-colors">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-blue-50/50 transition-colors pointer-events-none" />
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-800" /> Dirigido a:
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Analistas de inversiones, contadores, gerentes y auditores en bancos, fondos de inversión y grandes corporaciones que buscan automatizar procesos y tomar decisiones basadas en datos.
                </p>
            </div>

            <div className="md:col-span-3 bg-gradient-to-br from-blue-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-blue-100/50 shadow-[0_4px_20_px_-4px_rgba(0,0,0,0.02)]">
                <h3 className="text-lg font-bold text-blue-900 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Automatización de reportes complejos.", "Dashboards de ROI y Riesgos.", "Integración de múltiples fuentes.", "Eficiencia avanzada con SQL & Python.", "Alta demanda en el sector bancario.", "Escenarios financieros reales."].map((b, i) => (
                        <li key={i} className="flex gap-3 items-start">
                            <div className="mt-0.5 bg-blue-100/50 p-1 rounded-full text-blue-800">
                                <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className="leading-tight pt-0.5">{b}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* TABS - Segmented Control (4 Módulos) */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex flex-wrap lg:flex-nowrap bg-gray-50/80 p-1.5 rounded-3xl border border-gray-200/60 shadow-sm backdrop-blur-md w-full max-w-4xl justify-center gap-1">
            
            {/* Tab 1: Excel */}
            <button
              onClick={() => setActiveTab("modulo1")}
              className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex-1 min-w-[140px] flex flex-col items-center ${
                activeTab === "modulo1" ? "bg-white text-green-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
              }`}
            >
              <span className="flex items-center gap-2"><FileSpreadsheet className="w-4 h-4" /> Módulo I</span>
              <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60">Excel Finanzas (16h)</span>
            </button>

            {/* Tab 2: Power BI */}
            <button
               onClick={() => setActiveTab("modulo2")}
               className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex-1 min-w-[140px] flex flex-col items-center ${
                 activeTab === "modulo2" ? "bg-white text-orange-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span className="flex items-center gap-2"><BarChart className="w-4 h-4" /> Módulo II</span>
              <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60">Power BI Inversiones (16h)</span>
            </button>

            {/* Tab 3: SQL */}
            <button
               onClick={() => setActiveTab("modulo3")}
               className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex-1 min-w-[140px] flex flex-col items-center ${
                 activeTab === "modulo3" ? "bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span className="flex items-center gap-2"><Database className="w-4 h-4" /> Módulo III</span>
              <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60">SQL Bases de Datos (16h)</span>
            </button>

            {/* Tab 4: Python */}
            <button
               onClick={() => setActiveTab("modulo4")}
               className={`relative px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex-1 min-w-[140px] flex flex-col items-center ${
                 activeTab === "modulo4" ? "bg-white text-indigo-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span className="flex items-center gap-2"><Code className="w-4 h-4" /> Módulo IV</span>
              <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60">Python DataFrames (16h)</span>
            </button>
          </div>
        </div>

        {/* CONTAINER PANELES */}
        <div className="relative">

          {/* ======================= MÓDULO I: EXCEL ======================= */}
          {activeTab === "modulo1" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <p className="text-base text-gray-500 max-w-3xl mx-auto italic">
                  Este módulo combina elementos intermedios y avanzados para manejar datos financieros grandes y automatizar cálculos críticos.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { num: 1, color: 'green', title: "Fórmulas Avanzadas y Referencias Financieras", items: ["Referencias absolutas, relativas y mixtas para modelado financiero.", "Funciones lógicas: SI, Y, O para validaciones de riesgos.", "Funciones de búsqueda: BUSCARV, BUSCARH para consultas contables."] },
                  { num: 2, color: 'green', title: "Manejo de Datos Grandes y Power Query", items: ["Validación de datos y listas desplegables para controles presupuestarios.", "Consolidación de datos de múltiples hojas (Balances mensuales).", "Introducción a Power Query: Carga de datos, filtrado y limpieza de transacciones."] },
                  { num: 3, color: 'green', title: "Tablas Dinámicas y Análisis Financiero", items: ["Configuración de tablas dinámicas para resúmenes de flujos de caja.", "Agrupamiento, cálculos y campos calculados (Márgenes de utilidad).", "Gráficos dinámicos para visualización de tendencias."] },
                  { num: 4, color: 'green', title: "Funciones Especializadas y Macros Básicas", items: ["Funciones de fecha para pronósticos temporales.", "Funciones de texto para formateo de reportes contables.", "Grabación de macros para tareas repetitivas en auditorías."] },
                  { num: 5, color: 'green', title: "Dashboards y Seguridad Financiera", items: ["Dashboards interactivos con slicers para KPIs financieros.", "Protección avanzada y colaboración en archivos compartidos.", "Proyecto: Automatización de un informe financiero completo."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`m1-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-green-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`m1-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-green-600 text-white' : 'bg-green-50/80 text-green-700'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-16 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-green-300 fill-green-300" />
                                <span className="text-gray-600">{item}</span>
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
                <p className="text-base text-gray-500 max-w-3xl mx-auto italic">
                  Enfoque total en escenarios financieros, desde conexiones de datos hasta dashboards predictivos para inversiones.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { num: 1, title: "Introducción y Conexión de Fuentes Financieras", items: ["Importando datos de Excel, SQL y APIs (ej. datos de mercado).", "Explorando conjuntos de datos para análisis de operaciones.", "Power Query para limpiezas de transacciones contables."] },
                  { num: 2, title: "Visualizaciones Intermedias para Finanzas", items: ["Gráficas de barras/columnas con saturación para balances.", "Gráficos de líneas/dispersión para tendencias de inversión.", "Introducción a DAX: Cálculos básicos de métricas financieras."] },
                  { num: 3, title: "DAX Avanzado y Relaciones de Datos", items: ["Funciones acumuladas (YTD, QTD) para reportes anuales.", "Administrando relaciones entre tablas de ventas vs costos.", "Time Intelligence para pronósticos de portafolios."] },
                  { num: 4, title: "Dashboards, Compartición e IA", items: ["Botones, marcadores y drillthrough para navegación financiera.", "Compartir paneles con seguridad incorporada (RLS).", "Uso de Copilot para generar DAX automáticas en análisis de riesgos."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`m2-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-orange-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`m2-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-orange-600 text-white' : 'bg-orange-50/80 text-orange-600'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-16 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-orange-300 fill-orange-300" />
                                <span className="text-gray-600">{item}</span>
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
                <p className="text-base text-gray-500 max-w-3xl mx-auto italic">
                  Aplicación de SQL a consultas financieras masivas para reportes contables y de cumplimiento.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { num: 1, title: "Introducción y Consultas Básicas", items: ["SELECT, WHERE, TOP para recuperación de transacciones.", "MONTH(), YEAR() para filtros temporales en balances.", "Creación de vistas de inventarios y ventas financieras."] },
                  { num: 2, title: "Joins y Filtros para Análisis Contable", items: ["Cruces de tablas (Ventas vs Costos) con JOINs.", "GROUP BY y SUM() para reportes agregados por periodo.", "Operadores lógicos para filtros en portafolios bursátiles."] },
                  { num: 3, title: "Consultas Complejas y Automatización", items: ["CASE WHEN para columnas condicionales en riesgos.", "CREATE PROC para automatización de reportes recurrentes.", "UPDATE y CAST() para saneamiento de datos financieros."] },
                  { num: 4, title: "Integración de IA en SQL Financiero", items: ["Generación de consultas personalizadas para reportes de riesgos.", "Preprocesamiento de agregaciones para datasets de inversión."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`m3-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-blue-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`m3-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-blue-50/80 text-blue-600'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-16 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-blue-300 fill-blue-300" />
                                <span className="text-gray-600">{item}</span>
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
                <p className="text-base text-gray-500 max-w-3xl mx-auto italic">
                  Manipulación avanzada de datos, visualización interactiva y automatización de controles de riesgo.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { num: 1, title: "Pandas para Manipulación Financiera", items: ["Lectura de APIs financieras e informes con pd.read_excel().", "df.groupby() y .agg() para medias en portafolios.", "Tratamiento de fechas en transacciones masivas."] },
                  { num: 2, title: "Visualizaciones e Inversiones", items: ["Matplotlib/Seaborn para gráficos de rendimientos históricos.", "Plotly interactivo para dashboards de riesgos dinámicos.", "Gráficos de dispersión para correlaciones de activos."] },
                  { num: 3, title: "Modelado y Combinación de Datos", items: ["pd.merge() para unión de datasets (Mercados vs Internos).", "Columnas calculadas para ratios financieros (ROI, ROE).", "Modelado de escenarios con parámetros variables."] },
                  { num: 4, title: "IA y Proyecto Aplicado", items: ["Scripts de análisis predictivo generados con IA.", "Proyecto Final: Análisis de portafolio automatizado end-to-end."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`m4-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-indigo-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`m4-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-indigo-50/80 text-indigo-700'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-16 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-indigo-300 fill-indigo-300" />
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* ITEM AI SPECIAL */}
                <div className="bg-gradient-to-br from-[#1E3A8A]/10 to-transparent rounded-2xl border border-[#1E3A8A]/20 overflow-hidden hover:shadow-lg hover:shadow-[#1E3A8A]/5 transition-all duration-300 relative group mt-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E3A8A]/10 blur-[80px] -z-10 group-hover:bg-[#1E3A8A]/20 transition-colors" />
                    <div className="flex justify-between items-center w-full p-5 lg:px-6 bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1E3A8A] text-white">
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <span className="text-base font-bold text-gray-900 italic">Especialización de Alto Nivel 2026</span>
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
