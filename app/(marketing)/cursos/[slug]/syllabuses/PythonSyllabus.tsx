"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star, Target, Trophy, Play } from "lucide-react";

export default function PythonSyllabus() {
  const [activeTab, setActiveTab] = useState("nivel1");
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
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50/80 text-brand-blue font-bold tracking-wide uppercase text-xs mb-6 border border-blue-100/50 shadow-sm backdrop-blur-sm">
            Programa 2026
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight mb-6 font-display">
            Plan de Estudios <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#306998] to-[#FFD43B]">Python</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            48 horas de formación intensiva: Desde la sintaxis básica hasta la Ciencia de Datos y Machine Learning.
          </p>
        </div>

        {/* TABS - Segmented Control */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex flex-col sm:flex-row bg-gray-50/80 p-1.5 rounded-2xl sm:rounded-full border border-gray-200/60 shadow-sm backdrop-blur-md w-full sm:w-auto relative">
            
            {/* Tab 1 */}
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center ${
                activeTab === "nivel1" ? "bg-white text-[#306998] shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
              }`}
            >
              <span>Nivel I: Básico</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel1" ? "text-gray-400" : "text-gray-400"}`}>Fundamentos (16h)</span>
            </button>

            {/* Tab 2 */}
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center mt-2 sm:mt-0 sm:ml-2 ${
                 activeTab === "nivel2" ? "bg-white text-[#306998] shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span>Nivel II: Intermedio</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel2" ? "text-gray-400" : "text-gray-400"}`}>Análisis & Viz (16h)</span>
            </button>

            {/* Tab 3 */}
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center mt-2 sm:mt-0 sm:ml-2 ${
                 activeTab === "nivel3" ? "bg-white text-[#306998] shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span>Nivel III: Avanzado</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel3" ? "text-gray-400" : "text-gray-400"}`}>Data Science & AI (16h)</span>
            </button>
          </div>
        </div>

        {/* CONTAINER PANELES */}
        <div className="relative">

          {/* ======================= NIVEL BÁSICO ======================= */}
          {activeTab === "nivel1" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Tarjetas Informativas */}
              <div className="grid md:grid-cols-5 gap-6 mb-10">
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-blue-100 transition-colors">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-blue-50/50 transition-colors pointer-events-none" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#306998]" /> Dirigido a:
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Este curso es ideal para principiantes que desean aprender Python desde cero, enfocándose en conceptos fundamentales para automatizar tareas básicas y manipular datos en entornos empresariales. Dirigido a perfiles administrativos, financieros, comerciales, ingenieros y data analytics.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-blue-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-blue-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-[#306998] mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Automatización inicial de informes operativos.", "Aplicables al sector financiero e industrial.", "Alta demanda laboral inicial en datos.", "Preparación para análisis tabular simple.", "Mejora en toma de decisiones."].map((b, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="mt-0.5 bg-blue-100/50 p-1 rounded-full text-[#306998]">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-tight pt-0.5">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Acordeón de Módulos */}
              <div className="space-y-3">
                {[
                  { num: 1, title: "Introducción a Python (4 horas)", items: ["Objetivo: Familiarizarse con el entorno de Python y los tipos de datos básicos.", "Variables y Tipos de Datos: int, float, str.", "Operaciones básicas y asignación de variables.", "Estructuras de datos: Listas, Tuplas, Conjuntos, Diccionarios.", "Entrada y salida de datos con la función input().", "Uso de condicionales if/else para control de flujo.", "Funciones clave: type(), input(), operadores aritméticos."] },
                  { num: 2, title: "Estructuras de Datos Básicas (4 horas)", items: ["Objetivo: Profundizar en el manejo de tuplas y conjuntos.", "Tuplas: Creación, acceso a elementos, longitud (len()), comparación.", "Conjuntos: Creación, adición (add()), eliminación (remove()), pertenencia (in, not in).", "Funciones clave: len(), add(), remove(), in, not in."] },
                  { num: 3, title: "Introducción a Pandas (4 horas)", items: ["Objetivo: Aprender a cargar y explorar datos con Pandas.", "DataFrames: Creación a partir de archivos Excel.", "Lectura de datos: pd.read_excel().", "Exploración básica: df.head(), df.dtypes, df.iloc[].", "Selección de columnas.", "Librerías: pandas.", "Funciones clave: pd.read_excel(), df.head(), df.dtypes, df.iloc[]."] },
                  { num: 4, title: "Introducción a IA en Python (4 horas)", items: ["Exploración de conceptos fundamentales de Python, generando códigos con IA.", "Generación extractores de datos (Servidores, Web, APIs).", "Identificar patrones automáticos en conjuntos de datos pequeños."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`n1-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-[#306998]/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`n1-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-[#306998] text-white' : 'bg-blue-50/80 text-[#306998]'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#306998]' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => {
                              const isObjective = item.startsWith("Objetivo:");
                              return (
                                <li key={i} className="flex gap-3 items-start text-sm">
                                  <Play className={`w-3 h-3 mt-1 flex-shrink-0 ${isObjective ? 'text-[#FFD43B] fill-[#FFD43B]' : 'text-gray-300 fill-gray-300'}`} />
                                  <span className={isObjective ? "text-gray-800 font-medium" : "text-gray-600"}>
                                    {isObjective ? <span><strong className="text-gray-900">Objetivo: </strong>{item.replace("Objetivo:", "").trim()}</span> : item}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= NIVEL INTERMEDIO ======================= */}
          {activeTab === "nivel2" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-5 gap-6 mb-10">
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-emerald-100 transition-colors">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-emerald-50/50 transition-colors pointer-events-none" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" /> Dirigido a:
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Este curso construye sobre los fundamentos, enfocándose en manipulación de datos intermedia y visualizaciones básicas para generar informes más complejos en empresas.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-emerald-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-emerald-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-emerald-600 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Automatización con filtrados eficientes.", "Visualizaciones estructuradas.", "Demanda media en analytics.", "Integración de cálculos en reportes.", "Toma de decisiones gráfica."].map((b, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="mt-0.5 bg-emerald-100/50 p-1 rounded-full text-emerald-600">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-tight pt-0.5">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { num: 1, title: "Manipulación y Filtrado con Pandas (4 horas)", items: ["Objetivo: Manipular y filtrar DataFrames para crear reportes.", "Agrupación de datos: df.groupby().", "Agregación de datos: .agg([‘sum’, ‘count’, ‘min’, ‘max’, ‘mean’]).", "Filtrado de filas: Nuevos DataFrames.", "Transformación de tipos de datos: .astype().", "Conversión de texto a fechas: pd.to_datetime().", "Librerías: pandas, datetime.", "Funciones clave: groupby, agg, to_datetime."] },
                  { num: 2, title: "Visualización con Matplotlib (4 horas)", items: ["Objetivo: Crear visualizaciones básicas con Matplotlib.", "Gráficos de líneas: plt.plot().", "Personalización: xlabel(), ylabel(), title().", "Líneas de referencia: plt.axhline().", "Librerías: matplotlib.pyplot, numpy."] },
                  { num: 3, title: "Visualización con Seaborn (4 horas)", items: ["Objetivo: Crear visualizaciones más avanzadas con Seaborn.", "Gráficos de líneas: sns.lineplot().", "Gráficos de barras: sns.barplot().", "Personalización de gráficos.", "Librerías: seaborn, matplotlib.pyplot."] },
                  { num: 4, title: "Integración de IA Intermedia (4 horas)", items: ["Herramientas IA para automatizaciones medias.", "Procesando múltiples fuentes con IA."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`n2-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-emerald-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`n2-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-emerald-500 text-white' : 'bg-emerald-50/80 text-emerald-600'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => {
                              const isObjective = item.startsWith("Objetivo:");
                              return (
                                <li key={i} className="flex gap-3 items-start text-sm">
                                  <Play className={`w-3 h-3 mt-1 flex-shrink-0 ${isObjective ? 'text-[#FFD43B] fill-[#FFD43B]' : 'text-gray-300 fill-gray-300'}`} />
                                  <span className={isObjective ? "text-gray-800 font-medium" : "text-gray-600"}>
                                    {isObjective ? <span><strong className="text-gray-900">Objetivo: </strong>{item.replace("Objetivo:", "").trim()}</span> : item}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= NIVEL AVANZADO ======================= */}
          {activeTab === "nivel3" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid md:grid-cols-5 gap-6 mb-10">
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-purple-100 transition-colors">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-purple-50/50 transition-colors pointer-events-none" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" /> Dirigido a:
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Este curso avanzado profundiza en visualizaciones interactivas, combinación de datos y proyectos aplicados, perfecto para profesionales que buscan optimizar análisis predictivos.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-purple-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-purple-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-purple-600 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Dashboards interactivos predictivos.", "Automatización completa.", "Alta demanda en data science.", "Resolución de problemas de negocio.", "Integración total con IA."].map((b, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="mt-0.5 bg-purple-100/50 p-1 rounded-full text-purple-600">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-tight pt-0.5">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { num: 1, title: "Gráficos con Plotnine (3 horas)", items: ["Objetivo: Aprender la sintaxis declarativa de Plotnine.", "Creación: ggplot() + aes() + geom_line().", "Personalización: theme(), element_text().", "Librerías: plotnine.", "Funciones clave: ggplot, aes, theme."] },
                  { num: 2, title: "Manipulación de DataFrames Compleja (3 horas)", items: ["Objetivo: Combinar DataFrames y cálculos.", "Unión: pd.merge().", "Nuevas columnas y .apply().", "Librerías: pandas."] },
                  { num: 3, title: "Gráficos Interactivos con Plotly (4 horas)", items: ["Objetivo: Crear gráficos interactivos con Plotly.", "Dispersión, barras, histogramas, tortas.", "Sunburst, Treemap, Subgráficos.", "Librerías: plotly.express, graph_objects, subplots."] },
                  { num: 4, title: "Proyecto Aplicado (3 horas)", items: ["Objetivo: Aplicar todo en un proyecto práctico.", "Análisis completo de un dataset real.", "Creación de informes de negocio."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`n3-${module.num}`);
                  return (
                     <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-purple-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`n3-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-purple-600 text-white' : 'bg-purple-50/80 text-purple-600'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => {
                              const isObjective = item.startsWith("Objetivo:");
                              return (
                                <li key={i} className="flex gap-3 items-start text-sm">
                                  <Play className={`w-3 h-3 mt-1 flex-shrink-0 ${isObjective ? 'text-[#FFD43B] fill-[#FFD43B]' : 'text-gray-300 fill-gray-300'}`} />
                                  <span className={isObjective ? "text-gray-800 font-medium" : "text-gray-600"}>
                                    {isObjective ? <span><strong className="text-gray-900">Objetivo: </strong>{item.replace("Objetivo:", "").trim()}</span> : item}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* ITEM AI HIGHLIGHT */}
                <div className="bg-gradient-to-br from-[#306998]/10 to-transparent rounded-2xl border border-[#306998]/20 overflow-hidden hover:shadow-lg hover:shadow-[#306998]/5 transition-all duration-300 relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#306998]/10 blur-[80px] -z-10 group-hover:bg-[#306998]/20 transition-colors" />
                  <button onClick={() => toggleItem(`n3-5`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${openItems.includes(`n3-5`) ? 'bg-[#306998] text-white' : 'bg-white text-[#306998] border border-[#306998]/20'}`}>
                         <Star className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-base font-bold text-gray-900">Integración Avanzada con IA (3 horas)</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openItems.includes(`n3-5`) ? 'rotate-180 text-[#306998]' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes(`n3-5`) ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="px-6 pb-6 pt-2 border-t border-[#306998]/10">
                        <ul className="space-y-3">
                          {[
                            "Se usará constantemente IA para integrar las mejores herramientas de análisis de datos.",
                            "Aplicación de IA para la solución de múltiples problemas de complejidad alta."
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 items-start text-sm">
                              <Play className="w-3 h-3 mt-1 flex-shrink-0 text-[#FFD43B] fill-[#FFD43B]" />
                              <span className="text-gray-700">{item}</span>
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
