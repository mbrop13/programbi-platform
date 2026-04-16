"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star, Target, Trophy, Play, BarChart, Database, Code, Construction, Bot, MessageCircle, Phone, TrendingUp, HandCoins } from "lucide-react";

export default function FinanceSyllabus() {
  const [activeTab, setActiveTab] = useState("nivel1");
  const [openItems, setOpenItems] = useState<string[]>(["n1-pbi"]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-20 bg-blue-50/30 border-y border-blue-100 relative overflow-hidden font-sans">
      {/* Background Decorators */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/40 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl px-6 relative z-10">
        
        {/* CABECERA */}
        <div className="text-center mb-16 relative">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50/80 text-blue-700 font-bold tracking-wide uppercase text-xs mb-6 border border-blue-100/50 shadow-sm backdrop-blur-sm">
            Programa Data Analytics 2026
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-6 font-display leading-tight">
            Análisis de Datos para el <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Sector Financiero</span>
          </h2>
          <p className="text-base md:text-xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
            Un trayecto formativo de 144 horas divididas en 3 niveles, combinando el poder de <strong>Power BI, SQL Server y Python</strong> para optimizar reportes, pronósticos y controles.
          </p>
        </div>

        {/* INFORMACIÓN GENERAL */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-slate-50 rounded-full blur-2xl group-hover:bg-blue-50/50 transition-colors pointer-events-none" />
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-700" /> Dirigido a:
                </h3>
                <p className="text-base text-slate-600 leading-relaxed relative z-10">
                    Analistas de inversiones, contadores, gerentes de finanzas, auditores y especialistas que buscan dominar herramientas avanzadas. Perfecto para equipos en bancos, fondos de inversión y departamentos contables empresariales.
                </p>
                <div className="mt-8 pt-8 border-t border-slate-100">
                    <p className="text-xs text-blue-800 flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                        <HandCoins className="w-5 h-5" /> <strong>Enfoque Práctico:</strong> Valoración de activos, análisis de riesgos y presupuestos.
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-blue-700" /> Beneficios del Programa:
                </h3>
                <ul className="space-y-4 text-sm text-slate-700">
                    {[
                        { t: "Automatización Contable", d: "Reduce errores manuales en balances usando SQL." },
                        { t: "Monitoreo de KPIs", d: "Dashboards en tiempo real para ROI y flujos de caja." },
                        { t: "Modelado de Riesgos", d: "Python para correlación de activos y predictividad." },
                        { t: "Autonomía Tecnológica", d: "Extrae datos financieros sin depender de TI." },
                        { t: "Integración de IA", d: "IA en cada nivel para generar código y insights." },
                    ].map((b, i) => (
                        <li key={i} className="flex gap-3 items-start">
                            <div className="mt-0.5 bg-blue-100 p-1 rounded-lg text-blue-700 shadow-sm">
                                <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className="leading-tight"><strong className="text-slate-900">{b.t}:</strong> {b.d}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* NAVEGACIÓN DE PESTAÑAS (3 Niveles de 48h) */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex flex-wrap lg:flex-nowrap bg-slate-100/80 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner backdrop-blur-md w-full max-w-4xl justify-center gap-2">
            
            {/* Tab 1 */}
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`relative px-8 py-4 rounded-3xl text-sm font-bold transition-all duration-300 flex-1 min-w-[200px] flex flex-col items-center gap-1 ${
                activeTab === "nivel1" ? "bg-white text-blue-700 shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <span className="uppercase tracking-tighter text-[10px] opacity-70">48 Horas de Especialización</span>
              <span className="text-base">Nivel I: Básico</span>
              <span className="text-[11px] font-medium opacity-60">Fundamentos Contables</span>
            </button>

            {/* Tab 2 */}
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`relative px-8 py-4 rounded-3xl text-sm font-bold transition-all duration-300 flex-1 min-w-[200px] flex flex-col items-center gap-1 ${
                 activeTab === "nivel2" ? "bg-white text-blue-700 shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
               }`}
            >
              <span className="uppercase tracking-tighter text-[10px] opacity-70">48 Horas de Especialización</span>
              <span className="text-base">Nivel II: Intermedio</span>
              <span className="text-[11px] font-medium opacity-60">Modelado e Inversiones</span>
            </button>

            {/* Tab 3 */}
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`relative px-8 py-4 rounded-3xl text-sm font-bold transition-all duration-300 flex-1 min-w-[200px] flex flex-col items-center gap-1 ${
                 activeTab === "nivel3" ? "bg-white text-blue-700 shadow-xl scale-[1.02]" : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
               }`}
            >
              <span className="uppercase tracking-tighter text-[10px] opacity-70">48 Horas de Especialización</span>
              <span className="text-base">Nivel III: Avanzado</span>
              <span className="text-[11px] font-medium opacity-60">Predictividad de Riesgos</span>
            </button>
          </div>
        </div>

        {/* CONTENIDO DE PESTAÑAS */}
        <div className="relative min-h-[500px]">

          {/* NIVEL I */}
          {activeTab === "nivel1" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
              <p className="text-lg text-slate-500 text-center mb-10 max-w-3xl mx-auto italic font-light">
                Diseñado para introducir a los profesionales financieros en la automatización inicial, conectando fuentes de datos contables y generando las primeras visualizaciones de control.
              </p>
              
              {[
                { id: "n1-pbi", icon: <BarChart />, color: "amber", title: "Power BI: Conexión de Fuentes Financieras", h: "16h", items: ["Entorno e Importación: Excel, SQL y APIs financieras (ej. datos de mercado).", "Power Query Contable: Limpiezas básicas de transacciones y cálculos a la medida.", "Dashboards Iniciales: KPIs simples (ej. márgenes diarios) con visuales nativos.", "IA en Power BI: Uso de Q&A para consultas de balances en lenguaje natural."] },
                { id: "n1-sql", icon: <Database />, color: "blue", title: "SQL Server: Extracción de Registros Financieros", h: "16h", items: ["Consultas Básicas: SELECT y TOP aplicadas a miles de transacciones contables.", "Filtros Temporales: WHERE, MONTH(), YEAR() para cierres y balances de época.", "Cruce Básico (JOIN): Sincronización de tablas de ventas e ingresos vs costos.", "IA en SQL: Creación asistida de vistas y filtros en bases de datos empresariales."] },
                { id: "n1-py", icon: <Code />, color: "indigo", title: "Python: Fundamentos y Análisis de Portafolios", h: "16h", items: ["Fundamentos de Finanzas: Estructuras de datos para alertas de gastos y flujos.", "Pandas Inicial: Lectura de Excel contable y exploración de DataFrames.", "Manipulación: Filtrado y agrupación (groupby) de flujos de caja operativos.", "IA para Extracción: Scripts automáticos para descargar valores de activos web."] },
              ].map((m) => (
                <div key={m.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 group">
                  <button onClick={() => toggleItem(m.id)} className="flex justify-between items-center w-full p-6 md:p-8 cursor-pointer bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes(m.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                        {m.icon}
                      </div>
                      <div>
                        <span className="text-xl font-bold text-slate-900 block mb-1">{m.title}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{m.h}</span>
                            <span className="text-xs text-slate-400 font-medium">Contenido técnico nivel base</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-500 ${openItems.includes(m.id) ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-700 ease-in-out ${openItems.includes(m.id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="px-8 md:px-28 pb-10 pt-4 border-t border-slate-50">
                      <ul className="grid gap-4">
                        {m.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start group/li">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 group-hover/li:scale-150 transition-transform" />
                            <span className="text-slate-600 text-base leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NIVEL II */}
          {activeTab === "nivel2" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
              <p className="text-lg text-slate-500 text-center mb-10 max-w-3xl mx-auto italic font-light">
                Enfocado en analistas e inversores. Consolida información entre múltiples áreas contables, domina el lenguaje DAX y visualiza tendencias financieras.
              </p>
              
              {[
                { id: "n2-pbi", icon: <HandCoins className="w-6 h-6" />, color: "amber", title: "Power BI: Visualizaciones DAX Financieras", h: "16h", items: ["Visualizaciones Intermedias: Gráficas de saturación para balances y dispersión para inversiones.", "Relaciones y Matrices: Tratamiento multifuente (gastos vs ingresos) y modelado estrella.", "DAX Intermedio: SUM, AVERAGE, CALCULATE aplicados a rentabilidad y ROI.", "Compartición: Despliegue seguro de paneles conectados a datos de mercado/bancos."] },
                { id: "n2-sql", icon: <Target className="w-6 h-6" />, color: "blue", title: "SQL Server: Joins Avanzados y Auditoría", h: "16h", items: ["Joins Técnicos: Uso de FULL y RIGHT JOIN para detectar descuadres contables.", "Agrupaciones Temporales: GROUP BY y SUM() para reportes por trimestre o periodo.", "Requerimientos Complejos: Cruces multiobjeto para cálculos de impuestos y márgenes.", "Preprocesamiento: Preparación asistida por IA de datasets para análisis predictivo."] },
                { id: "n2-py", icon: <TrendingUp className="w-6 h-6" />, color: "indigo", title: "Python: Visualizaciones e Índices Financieros", h: "16h", items: ["Pandas Intermedio: Summarización de portafolios (.agg) y manejo de series de tiempo.", "Matplotlib: Análisis de rendimientos históricos con personalización técnica de ejes.", "Gráficos con Seaborn: Distribuciones estéticas de riesgo y correlación de activos.", "Automatización IA: Conciliación automática de múltiples fuentes bancarias vía scripts."] },
              ].map((m) => (
                <div key={m.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 group">
                  <button onClick={() => toggleItem(m.id)} className="flex justify-between items-center w-full p-6 md:p-8 cursor-pointer bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes(m.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                        {m.icon}
                      </div>
                      <div>
                        <span className="text-xl font-bold text-slate-900 block mb-1">{m.title}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{m.h}</span>
                            <span className="text-xs text-slate-400 font-medium">Contenido aplicado a inversiones</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-500 ${openItems.includes(m.id) ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-700 ease-in-out ${openItems.includes(m.id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="px-8 md:px-28 pb-10 pt-4 border-t border-slate-50">
                      <ul className="grid gap-4">
                        {m.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start group/li">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 group-hover/li:scale-150 transition-transform" />
                            <span className="text-slate-600 text-base leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NIVEL III */}
          {activeTab === "nivel3" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
              <p className="text-lg text-slate-500 text-center mb-10 max-w-3xl mx-auto italic font-light">
                Crea sistemas robustos e inteligentes: automatiza el servidor, evalúa escenarios What-if y construye algoritmos predictivos de inversión.
              </p>
              
              {[
                { id: "n3-pbi", icon: <Star className="w-6 h-6" />, color: "amber", title: "Power BI: Inteligencia de Tiempo y RLS Seguro", h: "16h", items: ["Inteligencia de Tiempo: Funciones acumuladas (YTD/QTD) para balances consolidados.", "Análisis What-if: Parámetros técnicos para escenarios contables y botones de navegación.", "Seguridad Transaccional: Implementación de RLS (Seguridad a nivel de fila) por área.", "Copilot & Smart Narratives: Explicación automática de anomalías en flujos de efectivo."] },
                { id: "n3-sql", icon: <Bot className="w-6 h-6" />, color: "blue", title: "SQL Server: Procedimientos y Automatización", h: "16h", items: ["Condicionales CASE WHEN: Categorización técnica de clientes por nivel de riesgo.", "Stored Procedures: Rutinas (CREATE PROC) para poblar automáticamente reportes diarios.", "Modificación Estructural: ALTER TABLE y ajustes de formatos financieros históricos.", "Flujo End-to-End: Integración SQL/Python para proyecciones presupuestarias reales."] },
                { id: "n3-py", icon: <Bot className="w-6 h-6" />, color: "indigo", title: "Python: Análisis Predictivo y Dashboards Plotly", h: "16h", items: ["Unión de Datos Maestros: Integración con pd.merge() y cálculo de ratios (ROI, EBITDA).", "Dashboards Interactivos: Dominio de Plotly para análisis profundo de riesgos y carteras.", "Calidad Directiva: Uso de Plotnine (ggplot) para gráficos de alta calidad corporativa.", "Algoritmo Predictivo: Construcción de proyecto final analizando escenarios macroeconómicos."] },
              ].map((m) => (
                <div key={m.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 group">
                  <button onClick={() => toggleItem(m.id)} className="flex justify-between items-center w-full p-6 md:p-8 cursor-pointer bg-transparent border-0 text-left">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${openItems.includes(m.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                        {m.icon}
                      </div>
                      <div>
                        <span className="text-xl font-bold text-slate-900 block mb-1">{m.title}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{m.h}</span>
                            <span className="text-xs text-slate-400 font-medium">Especialización de alto nivel</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-300 transition-transform duration-500 ${openItems.includes(m.id) ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-700 ease-in-out ${openItems.includes(m.id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="px-8 md:px-28 pb-10 pt-4 border-t border-slate-50">
                      <ul className="grid gap-4">
                        {m.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start group/li">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 group-hover/li:scale-150 transition-transform" />
                            <span className="text-slate-600 text-base leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
