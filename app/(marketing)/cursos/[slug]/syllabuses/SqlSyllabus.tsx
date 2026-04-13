"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star, Target, Trophy, Play } from "lucide-react";

export default function SqlSyllabus() {
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-50/50 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl px-6 relative z-10">
        
        {/* CABECERA */}
        <div className="text-center mb-16 relative">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-cyan-50/80 text-cyan-700 font-bold tracking-wide uppercase text-xs mb-6 border border-cyan-100/50 shadow-sm backdrop-blur-sm">
            Programa 2026
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight mb-6 font-display">
            Plan de Estudios <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-500">SQL Server</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            48 horas de formación intensiva: Desde consultas básicas hasta la administración avanzada de bases de datos.
          </p>
        </div>

        {/* TABS - Segmented Control */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex flex-col sm:flex-row bg-gray-50/80 p-1.5 rounded-2xl sm:rounded-full border border-gray-200/60 shadow-sm backdrop-blur-md w-full sm:w-auto relative">
            
            {/* Tab 1 */}
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center ${
                activeTab === "nivel1" ? "bg-white text-cyan-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
              }`}
            >
              <span>Nivel I: Básico</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel1" ? "text-gray-400" : "text-gray-400"}`}>Fundamentos (16h)</span>
            </button>

            {/* Tab 2 */}
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center mt-2 sm:mt-0 sm:ml-2 ${
                 activeTab === "nivel2" ? "bg-white text-cyan-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span>Nivel II: Intermedio</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel2" ? "text-gray-400" : "text-gray-400"}`}>Joins & Reporting (16h)</span>
            </button>

            {/* Tab 3 */}
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center mt-2 sm:mt-0 sm:ml-2 ${
                 activeTab === "nivel3" ? "bg-white text-cyan-600 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span>Nivel III: Avanzado</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel3" ? "text-gray-400" : "text-gray-400"}`}>Admin & Stored Procs (16h)</span>
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
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-cyan-100 transition-colors">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-cyan-50/50 transition-colors pointer-events-none" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-cyan-600" /> Dirigido a:
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Este curso es ideal para principiantes que desean aprender SQL Server desde cero, enfocándose en consultas básicas y manipulación inicial de datos para automatizar reportes simples en entornos empresariales.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-cyan-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-cyan-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-cyan-600 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Apoyar decisiones básicas con informes eficientes.", "Alta demanda en roles iniciales de datos.", "Conexión a bases de datos para Power BI.", "Reducción de riesgos operacionales."].map((b, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="mt-0.5 bg-cyan-100/50 p-1 rounded-full text-cyan-600">
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
                  { num: 1, title: "Introducción a SQL (4 horas)", items: ["Funciones: SELECT (Recuperación de datos), WHERE (Filtrado), TOP (Límite de filas), MONTH() (Mes de fecha), YEAR() (Año de fecha).", "Problemas resueltos: Seleccionar datos de tablas, filtrar por código, crear columnas calculadas, creación de vista básica."] },
                  { num: 2, title: "Filtros y Operaciones Básicas (4 horas)", items: ["Funciones: Operadores (=, >=, <=), lógicos (AND, OR), IN (Conjunto de valores).", "Problemas resueltos: Filtrar por año/mes, vista filtrada, múltiples condiciones, lista de códigos, columna constante."] },
                  { num: 3, title: "Cruce de Tablas Básico (JOIN) (4 horas)", items: ["Funciones: INNER JOIN (Coincidentes), LEFT JOIN (Izquierda completa), IS NULL/NOT NULL (Nulos), COUNT() (Contar filas).", "Problemas resueltos: Cruce de tablas (ventas/productos), identificar no vendidos, comparación de joins."] },
                  { num: 4, title: "Introducción a IA en SQL Server (4 horas)", items: ["Uso aplicado de herramientas de IA durante el curso, para crear consultas a la medida de reportes automatizados."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`n1-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-cyan-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`n1-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-cyan-600 text-white' : 'bg-cyan-50/80 text-cyan-600'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => {
                              const isFunc = item.startsWith("Funciones:");
                              const isProb = item.startsWith("Problemas resueltos:");
                              return (
                                <li key={i} className="flex gap-3 items-start text-sm">
                                  <Play className={`w-3 h-3 mt-1 flex-shrink-0 ${isFunc || isProb ? 'text-cyan-400 fill-cyan-400' : 'text-gray-300 fill-gray-300'}`} />
                                  <span className={isFunc || isProb ? "text-gray-600" : "text-gray-600"}>
                                    {isFunc ? <span><strong className="text-gray-900">Funciones: </strong>{item.replace("Funciones:", "").trim()}</span> : isProb ? <span><strong className="text-gray-900">Problemas resueltos: </strong>{item.replace("Problemas resueltos:", "").trim()}</span> : item}
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
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-green-100 transition-colors">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-green-50/50 transition-colors pointer-events-none" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" /> Dirigido a:
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Este curso construye sobre los fundamentos, enfocándose en joins avanzados, ordenamiento y agrupaciones para generar informes consolidados en empresas.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-green-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-green-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-green-600 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Informes con cruces complejos para eficiencia operativa.", "Automatización de filtros y cálculos.", "Alta demanda en data analytics.", "Integración ágil con Power BI."].map((b, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="mt-0.5 bg-green-100/50 p-1 rounded-full text-green-600">
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
                  { num: 1, title: "Tipos de JOIN y Vistas de Control (4 horas)", items: ["Funciones: FULL JOIN (Todas filas), RIGHT JOIN (Derecha completa).", "Problemas resueltos: Vista de control, margen de utilidad, comparación de todos los joins."] },
                  { num: 2, title: "Ordenamiento y Filtrado Avanzado (4 horas)", items: ["Funciones: ORDER BY (Ordenar), DESC (Descendente), operadores de fecha, GROUP BY (Agrupar), SUM() (Suma).", "Problemas resueltos: Top ventas ordenadas, rango de fechas, cruce de tres tablas, vista de valorización."] },
                  { num: 3, title: "Requerimientos Complejos (4 horas)", items: ["Problemas resueltos: Cruce de cuatro/cinco tablas, columnas calculadas (Utilidad Total, Impuesto), vista agrupada por país, consultas condicionales."] },
                  { num: 4, title: "Integración de IA Intermedia (4 horas)", items: ["Uso de IA para resolver problemas de complejidad intermedia en reportes a la medida.", "Preprocesamiento de datos para IA: Limpieza y agregación con GROUP BY para modelos predictivos."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`n2-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-green-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`n2-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-green-600 text-white' : 'bg-green-50/80 text-green-600'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => {
                              const isFunc = item.startsWith("Funciones:");
                              const isProb = item.startsWith("Problemas resueltos:");
                              return (
                                <li key={i} className="flex gap-3 items-start text-sm">
                                  <Play className={`w-3 h-3 mt-1 flex-shrink-0 ${isFunc || isProb ? 'text-green-400 fill-green-400' : 'text-gray-300 fill-gray-300'}`} />
                                  <span className={isFunc || isProb ? "text-gray-600" : "text-gray-600"}>
                                    {isFunc ? <span><strong className="text-gray-900">Funciones: </strong>{item.replace("Funciones:", "").trim()}</span> : isProb ? <span><strong className="text-gray-900">Problemas resueltos: </strong>{item.replace("Problemas resueltos:", "").trim()}</span> : item}
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
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-orange-100 transition-colors">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-orange-50/50 transition-colors pointer-events-none" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-600" /> Dirigido a:
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Este curso avanzado profundiza en vistas complejas, procedimientos almacenados y análisis predictivos, perfecto para optimizar reportes automatizados consolidados.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-orange-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-orange-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-orange-600 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Automatización completa con procedimientos predictivos.", "Alta demanda en data science.", "Estrategias para metas en tiempo real.", "Integración con IA avanzada en DBs."].map((b, i) => (
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
                  { num: 1, title: "Creación de Vistas Complejas (4 horas)", items: ["Funciones: LEFT() (Extraer texto), CASE WHEN (Condicionales), CONCAT() (Concatenar).", "Problemas resueltos: Cruce con múltiples joins, columna Tipo_Transporte por país, vistas agrupadas."] },
                  { num: 2, title: "Tablas de Reportes y Procedimientos (3 horas)", items: ["Funciones: SELECT INTO, DROP TABLE, CREATE PROC, EXECUTE.", "Problemas resueltos: Tabla de vista, actualización de reportes, procs para múltiples tablas."] },
                  { num: 3, title: "Análisis de Datos y Reportes (3 horas)", items: ["Funciones: ALTER TABLE, ADD CONSTRAINT, UPDATE, CAST().", "Problemas resueltos: Modificar claves primarias, actualización de vistas, estrategia de metas vs. ventas."] },
                  { num: 4, title: "Trabajo Final Aplicado (3 horas)", items: ["Aplicación integral: Trabajo práctico con todas las herramientas, certificación al aprobar."] }
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
                              const isFunc = item.startsWith("Funciones:");
                              const isProb = item.startsWith("Problemas resueltos:");
                              const isApp = item.startsWith("Aplicación integral:");
                              return (
                                <li key={i} className="flex gap-3 items-start text-sm">
                                  <Play className={`w-3 h-3 mt-1 flex-shrink-0 ${isFunc || isProb || isApp ? 'text-orange-400 fill-orange-400' : 'text-gray-300 fill-gray-300'}`} />
                                  <span className={isFunc || isProb || isApp ? "text-gray-600" : "text-gray-600"}>
                                    {isFunc ? <span><strong className="text-gray-900">Funciones: </strong>{item.replace("Funciones:", "").trim()}</span> : isProb ? <span><strong className="text-gray-900">Problemas resueltos: </strong>{item.replace("Problemas resueltos:", "").trim()}</span> : isApp ? <span><strong className="text-gray-900">Aplicación: </strong>{item.replace("Aplicación integral:", "").trim()}</span> : item}
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
                <div className="bg-gradient-to-br from-cyan-600/10 to-transparent rounded-2xl border border-cyan-600/20 overflow-hidden hover:shadow-lg hover:shadow-cyan-600/5 transition-all duration-300 relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 blur-[80px] -z-10 group-hover:bg-cyan-600/20 transition-colors" />
                  <button onClick={() => toggleItem(`n3-5`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${openItems.includes(`n3-5`) ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-700 border border-cyan-600/20'}`}>
                         <Star className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-base font-bold text-gray-900">Integración Avanzada de IA (3 horas)</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openItems.includes(`n3-5`) ? 'rotate-180 text-cyan-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes(`n3-5`) ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="px-6 pb-6 pt-2 border-t border-cyan-600/10">
                        <ul className="space-y-3">
                          {[
                            "Uso de IA para resolver problemas complejos de consultas (querys) y procedimientos almacenados.",
                            "Uso de la inteligencia artificial para integrar consultas de SQL con códigos de Python para ejecutar informes y procesos."
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 items-start text-sm">
                              <Play className="w-3 h-3 mt-1 flex-shrink-0 text-cyan-500 fill-cyan-500" />
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
