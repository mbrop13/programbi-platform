"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star, Target, Trophy, Play } from "lucide-react";

export default function ExcelSyllabus() {
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-50/50 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl px-6 relative z-10">
        
        {/* CABECERA */}
        <div className="text-center mb-16 relative">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-green-50/80 text-green-700 font-bold tracking-wide uppercase text-xs mb-6 border border-green-100/50 shadow-sm backdrop-blur-sm">
            Programa 2026
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight mb-6 font-display">
            Plan de Estudios <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">Microsoft Excel</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            Un recorrido estructurado de 48 horas totales, diseñado para transformar tu trabajo diario desde los fundamentos hasta la automatización total.
          </p>
        </div>

        {/* TABS - Segmented Control */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex flex-col sm:flex-row bg-gray-50/80 p-1.5 rounded-2xl sm:rounded-full border border-gray-200/60 shadow-sm backdrop-blur-md w-full sm:w-auto relative">
            
            {/* Tab 1 */}
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center ${
                activeTab === "nivel1" ? "bg-white text-green-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
              }`}
            >
              <span>Nivel I: Básico</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel1" ? "text-gray-400" : "text-gray-400"}`}>Fundamentos (16h)</span>
            </button>

            {/* Tab 2 */}
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center mt-2 sm:mt-0 sm:ml-2 ${
                 activeTab === "nivel2" ? "bg-white text-green-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span>Nivel II: Intermedio</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel2" ? "text-gray-400" : "text-gray-400"}`}>Análisis & Tablas (16h)</span>
            </button>

            {/* Tab 3 */}
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`relative px-8 py-3 rounded-xl sm:rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto flex flex-col items-center mt-2 sm:mt-0 sm:ml-2 ${
                 activeTab === "nivel3" ? "bg-white text-green-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
               }`}
            >
              <span>Nivel III: Avanzado</span>
              <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${activeTab === "nivel3" ? "text-gray-400" : "text-gray-400"}`}>Macros & PQ (16h)</span>
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
                <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:border-green-100 transition-colors">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:bg-green-50/50 transition-colors pointer-events-none" />
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-700" /> Dirigido a:
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                    Administrativos principiantes o con conocimientos mínimos de Excel que realizan tareas diarias simples como ingreso de datos, organización de listas y cálculos básicos en informes.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-green-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-green-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-green-700 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Manejo eficiente de datos y reducción de errores.", "Automatización de cálculos básicos.", "Visualización clara con gráficos simples.", "Organización rápida de información.", "Aumento de productividad diaria.", "Base sólida para niveles avanzados."].map((b, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="mt-0.5 bg-green-100/50 p-1 rounded-full text-green-700">
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
                  { num: 1, title: "Introducción a Excel y Entorno de Trabajo (2 horas)", items: ["Interfaz de usuario: barras de herramientas, hojas de cálculo y navegación.", "Creación y guardado de archivos.", "Configuración básica para informes administrativos."] },
                  { num: 2, title: "Ingreso y Manejo de Datos (3 horas)", items: ["Tipos de datos: texto, números, fechas.", "Formateo de celdas y tablas.", "Importación de datos desde archivos externos (CSV, texto).", "Ejercicios: Automatización simple de listas diarias."] },
                  { num: 3, title: "Fórmulas y Funciones Básicas (4 horas)", items: ["Operadores aritméticos y referencias de celdas.", "Funciones esenciales: SUMA, PROMEDIO, CONTAR, MAX, MIN.", "Uso de fórmulas para cálculos automáticos en informes.", "Ejercicios: Cálculo de totales en reportes diarios."] },
                  { num: 4, title: "Gráficos y Visualización de Datos (3 horas)", items: ["Creación de gráficos básicos (barras, líneas, pastel).", "Formateo de gráficos para informes claros.", "Inserción de gráficos en hojas de trabajo.", "Ejercicios: Visualización de datos administrativos."] },
                  { num: 5, title: "Herramientas de Organización y Filtros (2 horas)", items: ["Ordenamiento y filtros básicos.", "Uso de tablas dinámicas para resúmenes simples.", "Protección de hojas y celdas."] },
                  { num: 6, title: "Revisión y Proyecto Final (2 horas)", items: ["Repaso de conceptos.", "Proyecto: Automatización de un informe diario básico (e.g., registro de gastos)."] }
                ].map((module) => {
                  const isOpen = openItems.includes(`n1-${module.num}`);
                  return (
                    <div key={module.num} className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:border-green-300/30 hover:shadow-md transition-all duration-300">
                      <button onClick={() => toggleItem(`n1-${module.num}`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${isOpen ? 'bg-green-600 text-white' : 'bg-green-50/80 text-green-700'}`}>
                            {module.num}
                          </div>
                          <span className="text-base font-bold text-gray-900">{module.title}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-600' : ''}`} />
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                          <ul className="space-y-2.5">
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-gray-300 fill-gray-300" />
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
                    Administrativos con conocimientos básicos que manejan volúmenes moderados de datos y necesitan automatizar resúmenes mensuales o búsquedas complejas.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-purple-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-purple-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-purple-600 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Domina funciones lógicas y de búsqueda.", "Generación de resúmenes interactivos.", "Integración de fechas y texto avanzado.", "Seguridad en archivos compartidos.", "Mayor eficiencia en procesos diarios."].map((b, i) => (
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
                  { num: 1, title: "Fórmulas Avanzadas y Referencias (3 horas)", items: ["Referencias absolutas, relativas y mixtas.", "Funciones lógicas: SI, Y, O.", "Funciones de búsqueda: BUSCARV, BUSCARH.", "Ejercicios: Automatización de búsquedas en bases de datos administrativas."] },
                  { num: 2, title: "Manejo de Datos Grandes (3 horas)", items: ["Validación de datos y listas desplegables.", "Consolidación de datos de múltiples hojas.", "Uso de filtros avanzados y subtotales.", "Ejercicios: Organización de informes diarios con validaciones."] },
                  { num: 3, title: "Tablas Dinámicas (4 horas)", items: ["Creación y configuración de tablas dinámicas.", "Agrupamiento, cálculos y campos calculados.", "Gráficos dinámicos para visualización interactiva.", "Ejercicios: Automatización de resúmenes en reportes administrativos."] },
                  { num: 4, title: "Funciones de Fecha, Texto y Matemáticas (3 horas)", items: ["Funciones de fecha: HOY, FECHA, DIASEM.", "Funciones de texto: CONCATENAR, IZQUIERDA, DERECHA.", "Funciones matemáticas avanzadas: REDONDEAR, SUMAR.SI.", "Ejercicios: Automatización de cálculos temporales en informes."] },
                  { num: 5, title: "Colaboración y Seguridad (2 horas)", items: ["Compartir archivos y control de versiones.", "Protección avanzada y contraseñas.", "Integración con otros programas de Office."] },
                  { num: 6, title: "Proyecto Final y Revisión (1 hora)", items: ["Proyecto: Automatización de un informe intermedio.", "Discusión de casos reales administrativos."] }
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
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-gray-300 fill-gray-300" />
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
                    Administrativos experimentados que gestionan grandes volúmenes de datos y requieren automatización completa con Macros y Power Query.
                  </p>
                </div>

                <div className="md:col-span-3 bg-gradient-to-br from-orange-50/40 to-white p-6 md:p-8 rounded-[2rem] border border-orange-100/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-orange-600 mb-5 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Beneficios Principales:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    {["Automatización absoluta con macros y VBA.", "Limpieza masiva con Power Query.", "Dashboards interactivos en tiempo real.", "Autonomía total de IT.", "Optimización crítica de reportes."].map((b, i) => (
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
                  { num: 1, title: "Funciones Avanzadas y Matrices (3 horas)", items: ["Funciones de matriz: SUMAPRODUCTO, INDICE, COINCIDIR.", "Fórmulas anidadas y condicionales complejas.", "Uso de nombres definidos para automatización."] },
                  { num: 2, title: "Power Query para Importación y Limpieza (4 horas)", items: ["Introducción a Power Query.", "Transformaciones: filtrado, combinación y limpieza.", "Automatización de consultas recurrentes."] },
                  { num: 3, title: "Macros y VBA Básico (4 horas)", items: ["Grabación de macros para tareas repetitivas.", "Introducción a VBA: editor, variables, bucles.", "Creación de macros personalizadas."] },
                  { num: 4, title: "Análisis Avanzado y Dashboards (3 horas)", items: ["Creación de dashboards interactivos con slicers.", "Uso de Power Pivot para modelado de datos.", "Análisis de escenarios y solver."] },
                  { num: 5, title: "Automatización Avanzada y Seguridad (1 hora)", items: ["Integración con bases de datos externas.", "Manejo de errores en VBA y depuración.", "Mejores prácticas de seguridad."] },
                  { num: 6, title: "Proyecto Final y Casos Reales (1 hora)", items: ["Proyecto: Automatización completa de un informe diario.", "Análisis de casos administrativos reales."] }
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
                            {module.items.map((item, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm">
                                <Play className="w-3 h-3 mt-1 flex-shrink-0 text-gray-300 fill-gray-300" />
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* ITEM AI HIGHLIGHT */}
                <div className="bg-gradient-to-br from-green-600/10 to-transparent rounded-2xl border border-green-600/20 overflow-hidden hover:shadow-lg hover:shadow-green-600/5 transition-all duration-300 relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 blur-[80px] -z-10 group-hover:bg-green-600/20 transition-colors" />
                  <button onClick={() => toggleItem(`n3-5`)} className="flex justify-between items-center w-full p-5 lg:px-6 cursor-pointer focus:outline-none bg-transparent border-0 text-left">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner transition-colors ${openItems.includes(`n3-5`) ? 'bg-green-600 text-white' : 'bg-white text-green-700 border border-green-600/20'}`}>
                         <Star className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-base font-bold text-gray-900">IA aplicada a Excel (Próximamente 2026)</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openItems.includes(`n3-5`) ? 'rotate-180 text-green-600' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${openItems.includes(`n3-5`) ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="px-6 pb-6 pt-2 border-t border-green-600/10">
                        <ul className="space-y-3">
                          {[
                            "Próximamente integraremos Copilot y herramientas de IA para la generación automática de Macros, fórmulas complejas y análisis de datos avanzado."
                          ].map((item, i) => (
                            <li key={i} className="flex gap-3 items-start text-sm">
                              <Play className="w-3 h-3 mt-1 flex-shrink-0 text-green-500 fill-green-500" />
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
