"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star, Target, Trophy, Play } from "lucide-react";

export default function PowerBiSyllabus() {
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-blue/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl px-6 relative z-10">
        
        {/* CABECERA */}
        <div className="text-center mb-16 relative">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50/80 text-brand-blue font-bold tracking-wide uppercase text-xs mb-6 border border-blue-100/50 shadow-sm backdrop-blur-sm">
            Programa 2026
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight mb-6 font-display">
            Plan de Estudios <span className="text-brand-blue">Power BI</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            Un recorrido estructurado de 48 horas totales, diseñado para transformar tu carrera profesional desde los fundamentos hasta la Inteligencia Artificial.
          </p>
        </div>

        {/* TABS - Segmented Control */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex flex-col sm:flex-row bg-gray-50/80 p-1.5 rounded-2xl sm:rounded-full border border-gray-200/60 shadow-sm backdrop-blur-md w-full sm:w-auto relative">
            
            {/* Tab 1 */}
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center ${
                activeTab === "nivel1" ? "bg-white text-brand-blue shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
              }`}
            >
              <span>Nivel I: Básico</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel1" ? "text-gray-400" : "text-gray-400"}`}>Fundamentos (16h)</span>
            </button>

            {/* Tab 2 */}
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center mt-2 sm:mt-0 sm:ml-2 ${
                 activeTab === "nivel2" ? "bg-white text-brand-blue shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span>Nivel II: Intermedio</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel2" ? "text-gray-400" : "text-gray-400"}`}>Análisis y DAX (16h)</span>
            </button>

            {/* Tab 3 */}
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center mt-2 sm:mt-0 sm:ml-2 ${
                 activeTab === "nivel3" ? "bg-white text-brand-blue shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span>Nivel III: Avanzado</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel3" ? "text-gray-400" : "text-gray-400"}`}>Avanzado & AI (16h)</span>
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
                    <Target className="w-5 h-5 text-brand-blue" /> Dirigido a:
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Este curso es ideal para principiantes que desean aprender Power BI desde cero, enfocándose en los fundamentos para automatizar reportes básicos y procesos de análisis de datos en sus empresas.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-blue-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-blue-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-brand-blue mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Apoyar decisiones básicas con informes simples.", "Informes para sector financiero industrial.", "Automatización manual de Excel.", "Alta demanda en el mercado laboral.", "Conexión a SQL y APIs.", "Compartir informes en línea."].map((b, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="mt-0.5 bg-blue-100/50 p-1 rounded-full text-brand-blue">
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
                  { num: 1, title: "Introducción a Power BI (4 horas)", items: ["¿Qué es Power BI?", "¿Qué aprenderemos durante el curso?", "Obteniendo tu cuenta de Power BI.", "Instalaciones necesarias."] },
                  { num: 2, title: "Conectando Fuentes de Datos a Power BI (6 horas)", items: ["Importando Datos de Muestra.", "Explorando Conjuntos de Datos, Informes y Paneles.", "Creando Informes y Explorando tipos de Visualizaciones.", "Creando Visualizaciones de Barras y Columnas.", "Utilizando Filtros sobre los paneles.", "Visualizaciones de una Página del Informe de Power BI.", "Creando Gráficas de líneas.", "Power Query para realizar limpiezas de datos básicas.", "Cálculos y fórmulas simples de Power Query.", "Insertando columnas y filas nuevas con cálculos a la medida."] },
                  { num: 3, title: "Visualizaciones Básicas y Dashboards Iniciales (4 horas)", items: ["Guardando y Editando un Informe.", "Creando una Gráfica de Distribución.", "Utilizando Gráficos de Mapa y Saturación de Color.", "Agregar Gráficas de Pastel y Utilizando Filtros Relacionados.", "Gráficas de Dispersión.", "Medidores, Tablas y Tarjetas.", "Creación de KPIs básicos para visualizarlos en el dashboard."] },
                  { num: 4, title: "Introducción a IA en Power BI (2 horas)", items: ["Exploración de características AI básicas: Uso de Q&A natural language para consultas simples en dashboards.", "Ejemplos de insights automáticos generados por Power BI para detectar tendencias en datos básicos."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`n1-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-blue-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`n1-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-brand-blue text-white' : 'bg-blue-50/80 text-brand-blue'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-blue' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => {
                              return (
                                <li key={i} className="flex gap-3 items-start text-sm">
                                  <Play className={`w-3 h-3 mt-1 flex-shrink-0 text-gray-300 fill-gray-300`} />
                                  <span className={"text-gray-600"}>{item}</span>
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
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-purple-100 transition-colors">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-purple-50/50 transition-colors pointer-events-none" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" /> Dirigido a:
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Ideal para alumnos con conocimiento básico en Power BI, que desean aprender más herramientas de análisis de datos, enfocándose en técnicas intermedias para mejorar visualizaciones y una introducción a DAX.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-purple-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-purple-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-purple-600 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Informes dinámicos con interacciones avanzadas.", "Reducción de tiempo en procesos de Excel.", "Demanda creciente en data analytics.", "Compartir informes con seguridad."].map((b, i) => (
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
                  { num: 1, title: "Visualizaciones Intermedias y Power Query Avanzado (6 horas)", items: ["Gráficas de Barras con Saturación de Color y Colores Personalizados.", "Importando Gráficos desde la Tienda de Office.", "Anclando Visualizaciones a un nuevo Panel.", "Agregando Imágenes, Texto y Reacomodando un Panel.", "Modo de Enfoque, Detalles e Información Relacionada.", "Tratamiento inicial de matrices usando Unpivot Columns.", "Replicar consultas usando el editor avanzado.", "Tabla de métricas y selector de métricas (SWITCH, VALUES)."] },
                  { num: 2, title: "Introducción a DAX y Relaciones (5 horas)", items: ["Introducción a cálculos con DAX (Data Analysis Expressions).", "Administrando Relaciones entre Tablas.", "Creando Roles con Filtros de Datos.", "Asignando Personas a los Roles.", "Demostrando Filtros y Seguridad.", "Títulos dinámicos (SELECTEDVALUE).", "Tabla de Medidas.", "Completar valores (LOOKUPVALUE, EARLIER, FILTER).", "Formato Condicional en base a medidas."] },
                  { num: 3, title: "Compartiendo Paneles e Informes Intermedios (3 horas)", items: ["Compartiendo un Panel con Personas de la Organización.", "Compartiendo un Reporte en Línea.", "Conexión al Banco Central (ejemplos prácticos)."] },
                  { num: 4, title: "Integración de IA Intermedia (2 horas)", items: ["Uso de IA para crear medidas en DAX y visualizaciones que apoyan la toma de decisiones."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`n2-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-purple-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`n2-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
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
                              return (
                                <li key={i} className="flex gap-3 items-start text-sm">
                                  <Play className={`w-3 h-3 mt-1 flex-shrink-0 text-gray-300 fill-gray-300`} />
                                  <span className={"text-gray-600"}>{item}</span>
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
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-orange-100 transition-colors">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-orange-50/50 transition-colors pointer-events-none" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-600" /> Dirigido a:
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Este curso avanzado profundiza en funciones complejas de DAX, integraciones externas y seguridad, perfecto para profesionales que buscan optimizar dashboards predictivos y automatizados.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-orange-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-orange-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-orange-600 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Toma de decisiones avanzadas con análisis predictivos.", "Automatización completa con herramientas externas.", "Alta demanda en data science.", "Seguridad y roles personalizados.", "Integración con IA."].map((b, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="mt-0.5 bg-orange-100/50 p-1 rounded-full text-orange-600">
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
                  { num: 1, title: "Inteligencia de Tiempo y Funciones Avanzadas (4 horas)", items: ["Funciones Acumuladas en el tiempo (YTD, QTD, MTD).", "Funciones para cálculos diferidos (DATEADD, SAMEPERIODLASTYEAR).", "Relaciones con tablas de Metas.", "Prorrateo de Metas (ISINSCOPE, ENDOFMONTH).", "Importar Matrices, Ranking de elementos (RANKX).", "Uso de Parámetros (What if)."] },
                  { num: 2, title: "Google Drive, Tooltips y Segmentadores Avanzados (4 horas)", items: ["Importación de Gráficos de la Tienda. Uso del gráfico PlayAxis.", "Tooltip Dinámico, Construcción de Segmentadores de totalizados (GENERATESERIES, SUMMARIZE, MINX, MAXX, Variables)."] },
                  { num: 3, title: "Botones, Marcadores y Drillthrough (3 horas)", items: ["Construcción de Botones y textos dinámicos, URLs.", "Gráficos de Imágenes, uso de Marcadores.", "Propiedad de Drillthrough y alcances."] },
                  { num: 4, title: "Relaciones Duales, Seguridad y Roles, Sintáxis DAX (2 horas)", items: ["Uso de relaciones inactivas (USERELATIONSHIP).", "Reglas de Seguridad a Nivel de Filas (RLS).", "Segmentación de vistas por usuario conectado.", "Uso de Sintáxis DAX y Tablas No Relacionadas."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`n3-${module.num}`);
                  return (
                     <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-orange-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`n3-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-orange-600 text-white' : 'bg-orange-50/80 text-orange-600'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => {
                              return (
                                <li key={i} className="flex gap-3 items-start text-sm">
                                  <Play className={`w-3 h-3 mt-1 flex-shrink-0 text-gray-300 fill-gray-300`} />
                                  <span className={"text-gray-600"}>{item}</span>
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
                <div className="bg-gradient-to-br from-[#1890FF]/10 to-transparent rounded-2xl border border-[#1890FF]/20 overflow-hidden hover:shadow-lg hover:shadow-[#1890FF]/5 transition-all duration-300 relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF]/10 blur-[80px] -z-10 group-hover:bg-[#1890FF]/20 transition-colors" />
                  <button onClick={() => toggleItem(`n3-5`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${openItems.includes(`n3-5`) ? 'bg-[#1890FF] text-white' : 'bg-white text-[#1890FF] border border-[#1890FF]/20'}`}>
                         <Star className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-base font-bold text-gray-900">Integración Avanzada de IA en Power BI (3 horas)</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openItems.includes(`n3-5`) ? 'rotate-180 text-[#1890FF]' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes(`n3-5`) ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="px-6 pb-6 pt-2 border-t border-[#1890FF]/10">
                        <ul className="space-y-3">
                          {[
                            "Uso de Copilot para generar consultas DAX automáticas y narrativas inteligentes.",
                            "Visuales AI avanzados: Smart Narratives y Predictive Analytics con integración a Microsoft Fabric.",
                            "Exploración de anomalías y tendencias con Automated Insights."
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 items-start text-sm">
                              <Play className="w-3 h-3 mt-1 flex-shrink-0 text-[#1890FF]" />
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
