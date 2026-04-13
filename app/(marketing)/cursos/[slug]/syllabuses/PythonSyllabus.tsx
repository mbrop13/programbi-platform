"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star } from "lucide-react";

export default function PythonSyllabus() {
  const [activeTab, setActiveTab] = useState("nivel1");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-24 lg:py-32 bg-gray-50 border-y border-gray-200 font-sans">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* CABECERA DE SECCIÓN */}
        <div className="text-center mb-20">
          <span className="text-brand-blue font-bold tracking-wider uppercase text-lg md:text-xl">
            Programa 2026
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight mt-4 mb-8 font-display">
            Plan de Estudios <span style={{ color: "#306998" }}>Python</span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            48 horas de formación intensiva: Desde la sintaxis básica hasta la Ciencia de Datos y Machine Learning.
          </p>
        </div>

        {/* NAVEGACIÓN DE PESTAÑAS */}
        <div className="border-b-2 border-gray-200 mb-16">
          <nav className="flex flex-wrap justify-center -mb-[2px]">
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`w-full md:w-auto text-2xl md:text-3xl font-bold py-6 px-10 bg-transparent transition-all border-b-4 focus:outline-none ${
                activeTab === "nivel1" ? "border-[#FFD43B] text-[#306998]" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
              }`}
            >
              Nivel I: Básico
              <span className="block text-lg font-normal text-gray-400 mt-2">Fundamentos (16h)</span>
            </button>
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`w-full md:w-auto text-2xl md:text-3xl font-bold py-6 px-10 bg-transparent transition-all border-b-4 focus:outline-none ${
                 activeTab === "nivel2" ? "border-[#FFD43B] text-[#306998]" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
               }`}
            >
              Nivel II: Intermedio
              <span className="block text-lg font-normal text-gray-400 mt-2">Análisis & Viz (16h)</span>
            </button>
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`w-full md:w-auto text-2xl md:text-3xl font-bold py-6 px-10 bg-transparent transition-all border-b-4 focus:outline-none ${
                 activeTab === "nivel3" ? "border-[#FFD43B] text-[#306998]" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
               }`}
            >
              Nivel III: Avanzado
              <span className="block text-lg font-normal text-gray-400 mt-2">Data Science & AI (16h)</span>
            </button>
          </nav>
        </div>

        {/* ============================================== */}
        {/* PANEL 1: NIVEL BÁSICO */}
        {/* ============================================== */}
        {activeTab === "nivel1" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* INFORMACIÓN GENERAL DEL NIVEL */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Dirigido a:</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Este curso es ideal para principiantes que desean aprender Python desde cero, enfocándose en conceptos fundamentales para automatizar tareas básicas y manipular datos en entornos empresariales. Dirigido a particulares y profesionales en perfiles administrativos, financieros, comerciales, operaciones, ingenieros, contadores, técnicos, universitarios, RRHH, marketing y data analytics.
                </p>
              </div>
              <div className="bg-blue-50 p-8 md:p-10 rounded-3xl border border-blue-100 shadow-sm">
                <h3 className="text-3xl font-bold text-brand-blue mb-6">Beneficios:</h3>
                <ul className="text-xl text-gray-700 leading-relaxed space-y-4">
                  {["Automatización inicial de informes y procesos para reducir errores operativos.", "Aplicables a sectores como financiero, minero e industrial.", "Alta demanda en el mercado laboral para roles básicos en datos.", "Preparación para análisis tabular simple con bibliotecas clave.", "Mejora en la toma de decisiones con scripts básicos."].map((b, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <Check className="text-brand-blue w-6 h-6 mt-1 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACORDEÓN DE CONTENIDOS 1 */}
            {[
              { num: 1, title: "Introducción a Python (4 horas)", items: ["Objetivo: Familiarizarse con el entorno de Python y los tipos de datos básicos.", "Variables y Tipos de Datos: int, float, str.", "Operaciones básicas y asignación de variables.", "Estructuras de datos: Listas, Tuplas, Conjuntos, Diccionarios.", "Entrada y salida de datos con la función input().", "Uso de condicionales if/else para control de flujo.", "Funciones clave: type(), input(), operadores aritméticos."] },
              { num: 2, title: "Estructuras de Datos Básicas (4 horas)", items: ["Objetivo: Profundizar en el manejo de tuplas y conjuntos.", "Tuplas: Creación, acceso a elementos, longitud (len()), comparación.", "Conjuntos: Creación, adición (add()), eliminación (remove()), pertenencia (in, not in).", "Funciones clave: len(), add(), remove(), in, not in."] },
              { num: 3, title: "Introducción a Pandas (4 horas)", items: ["Objetivo: Aprender a cargar y explorar datos con Pandas.", "DataFrames: Creación a partir de archivos Excel.", "Lectura de datos: pd.read_excel().", "Exploración básica: df.head(), df.dtypes, df.iloc[].", "Selección de columnas.", "Librerías: pandas.", "Funciones clave: pd.read_excel(), df.head(), df.dtypes, df.iloc[]."] },
              { num: 4, title: "Introducción a IA en Python (4 horas)", items: ["Exploración de conceptos fundamentales de Python, generando códigos con soluciones a cálculos de reportes a la medida, usando inteligencia artificial.", "Generación de códigos para extraer datos de distintas fuentes (Servidores, Web, APIs).", "Ejemplos prácticos: Identificar patrones automáticos en conjuntos de datos pequeños."] }
            ].map((module) => {
              const isOpen = openItems.includes(`n1-${module.num}`);
              return (
                <div key={module.num} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => toggleItem(`n1-${module.num}`)} className="flex justify-between items-center w-full text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-brand-blue font-bold text-2xl">{module.num}</span>
                      <span className="text-2xl md:text-3xl font-bold text-gray-800">{module.title}</span>
                    </div>
                    <ChevronDown className={`w-8 h-8 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#306998]' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-8 text-2xl text-gray-600 border-t border-gray-100 leading-relaxed">
                      <ul className="space-y-3">
                        {module.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="text-[#FFD43B] font-bold text-3xl leading-none mt-1">•</span>
                            <span dangerouslySetInnerHTML={{ __html: item.replace("Objetivo:", "<strong>Objetivo:</strong>") }}></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================== */}
        {/* PANEL 2: NIVEL INTERMEDIO */}
        {/* ============================================== */}
        {activeTab === "nivel2" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Dirigido a:</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Este curso construye sobre los fundamentos, enfocándose en manipulación de datos intermedia y visualizaciones básicas para generar informes más complejos en empresas.
                </p>
              </div>
              <div className="bg-emerald-50 p-8 md:p-10 rounded-3xl border border-emerald-100 shadow-sm">
                <h3 className="text-3xl font-bold text-emerald-600 mb-6">Beneficios:</h3>
                <ul className="text-xl text-gray-700 leading-relaxed space-y-4">
                  {["Automatización de procesos con filtrados y agregaciones para eficiencia operativa.", "Visualizaciones iniciales para comunicar resultados de datos.", "Demanda en roles de data analytics intermedios.", "Integración de fechas y cálculos para reportes dinámicos.", "Mejora en la toma de decisiones con gráficos personalizados."].map((b, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <Check className="text-emerald-600 w-6 h-6 mt-1 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACORDEÓN DE CONTENIDOS 2 */}
            {[
              { num: 1, title: "Manipulación y Filtrado de Datos con Pandas (4 horas)", colorMenu: "emerald", items: ["Objetivo: Manipular y filtrar DataFrames para crear reportes.", "Agrupación de datos: df.groupby().", "Agregación de datos: .agg([‘sum’, ‘count’, ‘min’, ‘max’, ‘mean’]).", "Filtrado de filas: Creación de nuevos DataFrames basados en condiciones.", "Transformación de tipos de datos: .astype().", "Conversión de texto a fechas: pd.to_datetime().", "Librerías: pandas, datetime.", "Funciones clave: df.groupby(), .agg(), pd.to_datetime(), .astype()."] },
              { num: 2, title: "Visualización de Datos con Matplotlib (4 horas)", colorMenu: "emerald", items: ["Objetivo: Crear visualizaciones básicas con Matplotlib.", "Gráficos de líneas: plt.plot().", "Personalización: plt.xlabel(), plt.ylabel(), plt.title(), plt.tick_params().", "Líneas de referencia: plt.axhline().", "Librerías: matplotlib.pyplot, numpy.", "Funciones clave: plt.plot(), plt.xlabel(), plt.ylabel(), plt.title(), plt.axhline()."] },
              { num: 3, title: "Visualización de Datos con Seaborn (4 horas)", colorMenu: "emerald", items: ["Objetivo: Crear visualizaciones más avanzadas con Seaborn.", "Gráficos de líneas: sns.lineplot().", "Gráficos de barras: sns.barplot().", "Personalización de gráficos.", "Librerías: seaborn, matplotlib.pyplot.", "Funciones clave: sns.lineplot(), sns.barplot()."] },
              { num: 4, title: "Integración de IA Intermedia (4 horas)", colorMenu: "emerald", items: ["Usando herramientas de inteligencia artificial para resolver automatizaciones de reportes con Python de complejidad media.", "Procesando múltiples fuentes de datos y visualizaciones apoyados con las herramientas de inteligencia artificial."] }
            ].map((module) => {
              const isOpen = openItems.includes(`n2-${module.num}`);
              return (
                <div key={module.num} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => toggleItem(`n2-${module.num}`)} className="flex justify-between items-center w-full text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 font-bold text-2xl">{module.num}</span>
                      <span className="text-2xl md:text-3xl font-bold text-gray-800">{module.title}</span>
                    </div>
                    <ChevronDown className={`w-8 h-8 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-8 text-2xl text-gray-600 border-t border-gray-100 leading-relaxed">
                      <ul className="space-y-3">
                        {module.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="text-[#FFD43B] font-bold text-3xl leading-none mt-1">•</span>
                            <span dangerouslySetInnerHTML={{ __html: item.replace("Objetivo:", "<strong>Objetivo:</strong>") }}></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================== */}
        {/* PANEL 3: NIVEL AVANZADO */}
        {/* ============================================== */}
        {activeTab === "nivel3" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Dirigido a:</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Este curso avanzado profundiza en visualizaciones interactivas, combinación de datos y proyectos aplicados, perfecto para profesionales que buscan optimizar análisis predictivos en entornos corporativos.
                </p>
              </div>
              <div className="bg-purple-50 p-8 md:p-10 rounded-3xl border border-purple-100 shadow-sm">
                <h3 className="text-3xl font-bold text-purple-600 mb-6">Beneficios:</h3>
                <ul className="text-xl text-gray-700 leading-relaxed space-y-4">
                  {["Creación de dashboards interactivos para decisiones predictivas.", "Automatización completa con integraciones avanzadas.", "Alta demanda en roles de data science.", "Resolución de problemas de negocio reales con proyectos.", "Integración con IA para insights automatizados."].map((b, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <Check className="text-purple-600 w-6 h-6 mt-1 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACORDEÓN DE CONTENIDOS 3 */}
            {[
              { num: 1, title: "Creación de Gráficos con Plotnine (3 horas)", items: ["Objetivo: Aprender a usar la sintaxis declarativa de Plotnine para la visualización de datos.", "Creación de gráficos: ggplot() + aes() + geom_line().", "Personalización: theme(), element_text().", "Librerías: plotnine.", "Funciones clave: ggplot(), aes(), geom_line(), theme()."] },
              { num: 2, title: "Manipulación Avanzada de DataFrames y Combinación de Datos (3 horas)", items: ["Objetivo: Combinar DataFrames y crear nuevas columnas basadas en cálculos.", "Unión de DataFrames: pd.merge().", "Creación de nuevas columnas: Realizar cálculos y aplicar funciones (.apply()).", "Librerías: pandas.", "Funciones clave: pd.merge(), .apply()."] },
              { num: 3, title: "Gráficos Interactivos con Plotly (4 horas)", items: ["Objetivo: Crear gráficos interactivos con Plotly.", "Gráficos de dispersión: px.scatter().", "Gráficos de barras: px.bar().", "Histogramas: px.histogram().", "Gráficos de torta: px.pie().", "Gráficos Sunburst y Treemap: px.sunburst(), px.treemap().", "Subgráficos: make_subplots().", "Librerías: plotly.express, plotly.graph_objects, plotly.subplots.", "Funciones clave: px.scatter(), px.bar(), px.pie(), px.sunburst(), px.treemap(), make_subplots()."] },
              { num: 4, title: "Proyecto Aplicado (3 horas)", items: ["Objetivo: Aplicar todos los conocimientos adquiridos en un proyecto práctico.", "Análisis completo de un conjunto de datos.", "Creación de informes y visualizaciones.", "Resolución de problemas de negocio.", "Librerías: Todas las vistas en el curso: pandas, numpy, matplotlib, seaborn, plotnine, plotly, datetime.", "Funciones clave: Todas las vistas en el curso."] }
            ].map((module) => {
              const isOpen = openItems.includes(`n3-${module.num}`);
              return (
                <div key={module.num} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => toggleItem(`n3-${module.num}`)} className="flex justify-between items-center w-full text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 text-purple-600 font-bold text-2xl">{module.num}</span>
                      <span className="text-2xl md:text-3xl font-bold text-gray-800">{module.title}</span>
                    </div>
                    <ChevronDown className={`w-8 h-8 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-600' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-8 text-2xl text-gray-600 border-t border-gray-100 leading-relaxed">
                      <ul className="space-y-3">
                        {module.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="text-[#FFD43B] font-bold text-3xl leading-none mt-1">•</span>
                            <span dangerouslySetInnerHTML={{ __html: item.replace("Objetivo:", "<strong>Objetivo:</strong>") }}></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Item 3.5 AI Highlight */}
            <div className="bg-gradient-to-br from-white to-blue-50 p-8 md:p-10 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
               <button onClick={() => toggleItem(`n3-5`)} className="flex justify-between items-center w-full text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                  <div className="flex items-center gap-6">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-blue text-white font-bold text-2xl">
                         <Star className="w-6 h-6 fill-white" />
                      </span>
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">Integración Avanzada de IA en Python (3 horas)</span>
                  </div>
                  <ChevronDown className={`w-8 h-8 text-gray-400 transition-transform duration-300 ${openItems.includes(`n3-5`) ? 'rotate-180 text-brand-blue' : ''}`} />
               </button>
               <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openItems.includes(`n3-5`) ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-8 text-2xl text-gray-700 border-t border-blue-100 leading-relaxed">
                      <ul className="space-y-3">
                        {[
                          "En el curso se usará constantemente inteligencia artificial para poder integrar las mejores herramientas de análisis de datos.",
                          "Aplicando herramientas de inteligencia artificial para la solución de múltiples problemas de complejidad alta."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="text-[#FFD43B] font-bold text-3xl leading-none mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
               </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
