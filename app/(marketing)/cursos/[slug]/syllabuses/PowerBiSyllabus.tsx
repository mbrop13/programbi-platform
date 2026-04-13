"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star } from "lucide-react";

export default function PowerBiSyllabus() {
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
            Plan de Estudios
          </h2>
          <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            Un recorrido estructurado de 48 horas totales, diseñado para transformar tu carrera profesional desde los fundamentos hasta la Inteligencia Artificial.
          </p>
        </div>

        {/* NAVEGACIÓN DE PESTAÑAS */}
        <div className="border-b-2 border-gray-200 mb-16">
          <nav className="flex flex-wrap justify-center -mb-[2px]">
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`w-full md:w-auto text-2xl md:text-3xl font-bold py-6 px-10 bg-transparent transition-all border-b-4 focus:outline-none ${
                activeTab === "nivel1" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
              }`}
            >
              Nivel I: Básico
              <span className="block text-lg font-normal text-gray-400 mt-2">Fundamentos (16h)</span>
            </button>
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`w-full md:w-auto text-2xl md:text-3xl font-bold py-6 px-10 bg-transparent transition-all border-b-4 focus:outline-none ${
                 activeTab === "nivel2" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
               }`}
            >
              Nivel II: Intermedio
              <span className="block text-lg font-normal text-gray-400 mt-2">Análisis y DAX (16h)</span>
            </button>
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`w-full md:w-auto text-2xl md:text-3xl font-bold py-6 px-10 bg-transparent transition-all border-b-4 focus:outline-none ${
                 activeTab === "nivel3" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
               }`}
            >
              Nivel III: Avanzado
              <span className="block text-lg font-normal text-gray-400 mt-2">Expert & AI (16h)</span>
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
                  Este curso es ideal para principiantes que desean aprender Power BI desde cero, enfocándose en los fundamentos para automatizar reportes básicos y procesos de análisis de datos en sus empresas. Dirigido a particulares y profesionales en perfiles administrativos, financieros, comerciales, operaciones, ingenieros, contadores, técnicos, universitarios, RRHH, marketing y data analytics.
                </p>
              </div>
              <div className="bg-blue-50 p-8 md:p-10 rounded-3xl border border-blue-100 shadow-sm">
                <h3 className="text-3xl font-bold text-brand-blue mb-6">Beneficios:</h3>
                <ul className="text-xl text-gray-700 leading-relaxed space-y-4">
                  {[
                    "Apoyar decisiones básicas del negocio con informes dinámicos simples.",
                    "Informes a la medida para sectores como financiero, minero e industrial.",
                    "Automatización inicial de procesos manuales en Excel.",
                    "Alta demanda en el mercado laboral.",
                    "Conexión básica a bases de datos, SQL y APIs.",
                    "Compartir informes con usuarios en línea."
                  ].map((b, i) => (
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
              { num: 1, title: "Introducción a Power BI (aprox. 4 horas)", items: ["¿Qué es Power BI?", "¿Qué aprenderemos durante el curso?", "Obteniendo tu cuenta de Power BI.", "Instalaciones necesarias."] },
              { num: 2, title: "Conectando Fuentes de Datos a Power BI (aprox. 6 horas)", items: ["Importando Datos de Muestra.", "Explorando Conjuntos de Datos, Informes y Paneles.", "Creando Informes y Explorando tipos de Visualizaciones.", "Creando Visualizaciones de Barras y Columnas.", "Utilizando Filtros sobre los paneles.", "Visualizaciones de una Página del Informe de Power BI.", "Creando Gráficas de líneas.", "Power Query para realizar limpiezas de datos básicas.", "Cálculos y fórmulas simples de Power Query.", "Insertando columnas y filas nuevas con cálculos a la medida."] },
              { num: 3, title: "Visualizaciones Básicas y Dashboards Iniciales (aprox. 4 horas)", items: ["Guardando y Editando un Informe.", "Creando una Gráfica de Distribución.", "Utilizando Gráficos de Mapa y Saturación de Color.", "Agregar Gráficas de Pastel y Utilizando Filtros Relacionados.", "Gráficas de Dispersión.", "Medidores, Tablas y Tarjetas.", "Creación de KPIs básicos para visualizarlos en el dashboard."] },
              { num: 4, title: "Introducción a IA en Power BI (aprox. 2 horas)", items: ["Exploración de características AI básicas: Uso de Q&A natural language para consultas simples en dashboards.", "Ejemplos de insights automáticos generados por Power BI para detectar tendencias en datos básicos."] }
            ].map((module) => {
              const isOpen = openItems.includes(`n1-${module.num}`);
              return (
                <div key={module.num} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => toggleItem(`n1-${module.num}`)} className="flex justify-between items-center w-full text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-brand-blue font-bold text-2xl">{module.num}</span>
                      <span className="text-2xl md:text-3xl font-bold text-gray-800">{module.title}</span>
                    </div>
                    <ChevronDown className={`w-8 h-8 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-blue' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-8 text-2xl text-gray-600 border-t border-gray-100 leading-relaxed">
                      <ul className="space-y-3">
                        {module.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="text-brand-blue font-bold text-3xl leading-none mt-1">•</span>
                            <span>{item}</span>
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
                  Este curso es ideal para alumnos con conocimiento básico en Power BI, que desean aprender más herramientas de análisis de datos, enfocándose en técnicas intermedias para mejorar la limpieza de datos, visualizaciones y una introducción a DAX, ideal para automatizar reportes más complejos en empresas.
                </p>
              </div>
              <div className="bg-purple-50 p-8 md:p-10 rounded-3xl border border-purple-100 shadow-sm">
                <h3 className="text-3xl font-bold text-purple-600 mb-6">Beneficios:</h3>
                <ul className="text-xl text-gray-700 leading-relaxed space-y-4">
                  {[
                    "Creación de informes dinámicos con interacciones avanzadas.",
                    "Aplicables a sectores transversales como finanzas, minería e industria.",
                    "Reducción de tiempo en procesos de Excel a minutos con herramientas intermedias.",
                    "Demanda creciente en roles de data analytics.",
                    "Compartir y colaborar en informes con seguridad incorporada."
                  ].map((b, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <Check className="text-purple-600 w-6 h-6 mt-1 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACORDEÓN DE CONTENIDOS 2 */}
            {[
              { num: 1, title: "Visualizaciones Intermedias y Power Query Avanzado (aprox. 6 horas)", items: ["Gráficas de Barras con Saturación de Color y Colores Personalizados.", "Importando Gráficos desde la Tienda de Office.", "Anclando Visualizaciones a un nuevo Panel.", "Agregando Imágenes, Texto y Reacomodando un Panel.", "Modo de Enfoque, Detalles e Información Relacionada.", "Tratamiento inicial de matrices usando Unpivot Columns.", "Replicar consultas usando el editor avanzado.", "Tabla de métricas y selector de métricas (Funciones SWITCH y VALUES)."] },
              { num: 2, title: "Introducción a DAX y Relaciones (aprox. 5 horas)", items: ["Introducción a cálculos con DAX (Data Analysis Expressions).", "Administrando Relaciones entre Tablas.", "Creando Roles con Filtros de Datos.", "Asignando Personas a los Roles.", "Demostrando Filtros y Seguridad.", "Títulos dinámicos (SELECTEDVALUE).", "Tabla de Medidas.", "Completar valores (uso de funciones LOOKUPVALUE, EARLIER, FILTER(ALL)).", "Formato Condicional en base a medidas."] },
              { num: 3, title: "Compartiendo Paneles e Informes Intermedios (aprox. 3 horas)", items: ["Compartiendo un Panel con Personas de la misma Organización.", "Compartiendo un Reporte en Línea.", "Conexión al Banco Central (ejemplos prácticos)."] },
              { num: 4, title: "Integración de IA Intermedia (aprox. 2 horas)", items: ["Uso de herramientas de inteligencia de artificial para crear medidas en DAX y otras visualizaciones que apoyan la toma de decisiones."] }
            ].map((module) => {
              const isOpen = openItems.includes(`n2-${module.num}`);
              return (
                <div key={module.num} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => toggleItem(`n2-${module.num}`)} className="flex justify-between items-center w-full text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
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
                            <span className="text-brand-blue font-bold text-3xl leading-none mt-1">•</span>
                            <span>{item}</span>
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
                  Este curso avanzado profundiza en funciones complejas de DAX, integraciones externas y seguridad, perfecto para profesionales que buscan optimizar dashboards predictivos y automatizados en entornos empresariales.
                </p>
              </div>
              <div className="bg-orange-50 p-8 md:p-10 rounded-3xl border border-orange-100 shadow-sm">
                <h3 className="text-3xl font-bold text-orange-600 mb-6">Beneficios:</h3>
                <ul className="text-xl text-gray-700 leading-relaxed space-y-4">
                  {[
                    "Toma de decisiones avanzadas con análisis predictivos y prorrateos.",
                    "Automatización completa de procesos con integraciones a herramientas externas.",
                    "Alta demanda en roles de data science y analytics.",
                    "Seguridad y roles personalizados para equipos grandes.",
                    "Integración con IA para insights inteligentes."
                  ].map((b, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <Check className="text-orange-600 w-6 h-6 mt-1 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACORDEÓN DE CONTENIDOS 3 */}
            {[
              { num: 1, title: "Inteligencia de Tiempo y Funciones Avanzadas (aprox. 4 horas)", items: ["Funciones Acumuladas en el tiempo (YTD, QTD, MTD).", "Funciones para cálculos en tiempos diferidos (DATEADD, SAMEPERIODLASTYEAR, PARALLELPERIOD).", "Relaciones con tablas de Metas.", "Prorrateo de Metas (Uso de Funciones ISINSCOPE, ENDOFMONTH).", "Importar Matrices de Google Drive, Ranking de elementos (RANKX).", "Uso de Parámetros (What if)."] },
              { num: 2, title: "Google Drive, Tooltips y Segmentadores Avanzados (aprox. 4 horas)", items: ["Importación de Gráficos de la Tienda. Uso del gráfico PlayAxis.", "Tooltip Dinámico, Construcción de Segmentadores de totalizados (uso de funciones GENERATESERIES, SUMMARIZE, MINX, MAXX y Variables)."] },
              { num: 3, title: "Botones, Marcadores y Drillthrough (aprox. 3 horas)", items: ["Construcción de Botones y textos dinámicos (Navegación de Página, URLs) (función HASONEVALUE).", "Gráficos de Imágenes, uso de Marcadores.", "Propiedad de Drillthrough, Drillthrough Multireportes y sus alcances."] },
              { num: 4, title: "Relaciones Duales, Seguridad y Roles, Sintáxis DAX (aprox. 2 horas)", items: ["Uso de relaciones inactivas (USERELATIONSHIP).", "Reglas de Seguridad a Nivel de Filas (RLS), RLS con Medidas.", "Segmentación de vistas por usuario conectado (USERNAME).", "Uso de Sintáxis DAX y Tablas No Relacionadas para distintos funcionamientos de gráficos. (IN, NOT)."] }
            ].map((module) => {
              const isOpen = openItems.includes(`n3-${module.num}`);
              return (
                <div key={module.num} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => toggleItem(`n3-${module.num}`)} className="flex justify-between items-center w-full text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 text-orange-600 font-bold text-2xl">{module.num}</span>
                      <span className="text-2xl md:text-3xl font-bold text-gray-800">{module.title}</span>
                    </div>
                    <ChevronDown className={`w-8 h-8 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-8 text-2xl text-gray-600 border-t border-gray-100 leading-relaxed">
                      <ul className="space-y-3">
                        {module.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="text-brand-blue font-bold text-3xl leading-none mt-1">•</span>
                            <span>{item}</span>
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
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">Integración Avanzada de IA en Power BI (aprox. 3 horas)</span>
                  </div>
                  <ChevronDown className={`w-8 h-8 text-gray-400 transition-transform duration-300 ${openItems.includes(`n3-5`) ? 'rotate-180 text-brand-blue' : ''}`} />
               </button>
               <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openItems.includes(`n3-5`) ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-8 text-2xl text-gray-700 border-t border-blue-100 leading-relaxed">
                      <ul className="space-y-3">
                        {[
                          "Uso de Copilot para generar consultas DAX automáticas y narrativas inteligentes.",
                          "Visuales AI avanzados: Smart Narratives para resúmenes automáticos de datos y Predictive Analytics con integración a Microsoft Fabric.",
                          "Exploración de anomalías y tendencias con Automated Insights."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="text-brand-blue font-bold text-3xl leading-none mt-1">•</span>
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
