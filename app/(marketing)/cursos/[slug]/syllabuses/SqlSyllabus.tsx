"use client";

import React, { useState } from "react";
import { ChevronDown, Check, Star } from "lucide-react";

export default function SqlSyllabus() {
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
            Plan de Estudios <span style={{ color: "#0891b2" }}>SQL Server</span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            48 horas de formación intensiva: Desde consultas básicas hasta la administración avanzada de bases de datos.
          </p>
        </div>

        {/* NAVEGACIÓN DE PESTAÑAS */}
        <div className="border-b-2 border-gray-200 mb-16">
          <nav className="flex flex-wrap justify-center -mb-[2px]">
            <button
              onClick={() => setActiveTab("nivel1")}
              className={`w-full md:w-auto text-2xl md:text-3xl font-bold py-6 px-10 bg-transparent transition-all border-b-4 focus:outline-none ${
                activeTab === "nivel1" ? "border-[#0891b2] text-[#0891b2]" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
              }`}
            >
              Nivel I: Básico
              <span className="block text-lg font-normal text-gray-400 mt-2">Fundamentos (16h)</span>
            </button>
            <button
               onClick={() => setActiveTab("nivel2")}
               className={`w-full md:w-auto text-2xl md:text-3xl font-bold py-6 px-10 bg-transparent transition-all border-b-4 focus:outline-none ${
                 activeTab === "nivel2" ? "border-[#0891b2] text-[#0891b2]" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
               }`}
            >
              Nivel II: Intermedio
              <span className="block text-lg font-normal text-gray-400 mt-2">Joins & Reporting (16h)</span>
            </button>
            <button
               onClick={() => setActiveTab("nivel3")}
               className={`w-full md:w-auto text-2xl md:text-3xl font-bold py-6 px-10 bg-transparent transition-all border-b-4 focus:outline-none ${
                 activeTab === "nivel3" ? "border-[#0891b2] text-[#0891b2]" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
               }`}
            >
              Nivel III: Avanzado
              <span className="block text-lg font-normal text-gray-400 mt-2">Admin & Stored Procs (16h)</span>
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
                  Este curso es ideal para principiantes que desean aprender SQL Server desde cero, enfocándose en consultas básicas y manipulación inicial de datos para automatizar reportes simples en entornos empresariales.
                </p>
              </div>
              <div className="bg-cyan-50 p-8 md:p-10 rounded-3xl border border-cyan-100 shadow-sm">
                <h3 className="text-3xl font-bold text-cyan-600 mb-6">Beneficios:</h3>
                <ul className="text-xl text-gray-700 leading-relaxed space-y-4">
                  {[
                    "Apoyar decisiones básicas con informes que toman horas en Excel.",
                    "Alta demanda en el mercado laboral para roles iniciales en datos.",
                    "Conexión a bases de datos para visualizaciones en Power BI.",
                    "Reducción de riesgos operacionales con consultas directas del servidor."
                  ].map((b, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <Check className="text-cyan-600 w-6 h-6 mt-1 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACORDEÓN DE CONTENIDOS 1 */}
            {[
              { num: 1, title: "Introducción a SQL (4 horas)", items: ["Funciones: SELECT (Recuperación de datos), WHERE (Filtrado), TOP (Límite de filas), MONTH() (Mes de fecha), YEAR() (Año de fecha).", "Problemas resueltos: Seleccionar datos de tablas (ej. ventas), filtrar por código, crear columnas calculadas (ej. Inventario_Seguridad como 20% de cantidad), columnas de mes/año, creación de vista básica (Reporte_1)."] },
              { num: 2, title: "Filtros y Operaciones Básicas (4 horas)", items: ["Funciones: Operadores (=, >=, <=), lógicos (AND, OR), IN (Conjunto de valores).", "Problemas resueltos: Filtrar por año/mes, vista filtrada (ej. Operaciones_Abril), múltiples condiciones, lista de códigos, columna constante."] },
              { num: 3, title: "Cruce de Tablas Básico (JOIN) (4 horas)", items: ["Funciones: INNER JOIN (Coincidentes), LEFT JOIN (Izquierda completa), IS NULL/NOT NULL (Nulos), COUNT() (Contar filas).", "Problemas resueltos: Cruce de tablas (ventas/productos), identificar no vendidos, comparación de joins."] },
              { num: 4, title: "Introducción a IA en SQL Server (4 horas)", items: ["Uso aplicado de herramientas de inteligencia artificial durante el curso, para crear consultas a la medida de reportes automatizados."] }
            ].map((module) => {
              const isOpen = openItems.includes(`n1-${module.num}`);
              return (
                <div key={module.num} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => toggleItem(`n1-${module.num}`)} className="flex justify-between items-center w-full text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-100 text-cyan-700 font-bold text-2xl">{module.num}</span>
                      <span className="text-2xl md:text-3xl font-bold text-gray-800">{module.title}</span>
                    </div>
                    <ChevronDown className={`w-8 h-8 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-600' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-8 text-2xl text-gray-600 border-t border-gray-100 leading-relaxed">
                      <ul className="space-y-3">
                        {module.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="text-[#0891b2] font-bold text-3xl leading-none mt-1">•</span>
                            <span dangerouslySetInnerHTML={{ __html: item.replace("Funciones:", "<strong>Funciones:</strong>").replace("Problemas resueltos:", "<strong>Problemas resueltos:</strong>") }}></span>
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
                  Este curso construye sobre los fundamentos, enfocándose en joins avanzados, ordenamiento y agrupaciones para generar informes consolidados en empresas.
                </p>
              </div>
              <div className="bg-green-50 p-8 md:p-10 rounded-3xl border border-green-100 shadow-sm">
                <h3 className="text-3xl font-bold text-green-600 mb-6">Beneficios:</h3>
                <ul className="text-xl text-gray-700 leading-relaxed space-y-4">
                  {[
                    "Creación de informes con cruces complejos para eficiencia operativa.",
                    "Automatización de filtros y cálculos para decisiones intermedias.",
                    "Demanda en roles de data analytics.",
                    "Integración con Power BI para dashboards dinámicos."
                  ].map((b, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <Check className="text-green-600 w-6 h-6 mt-1 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ACORDEÓN DE CONTENIDOS 2 */}
            {[
              { num: 1, title: "Tipos de JOIN y Vistas de Control (4 horas)", colorMenu: "green", items: ["Funciones: FULL JOIN (Todas filas), RIGHT JOIN (Derecha completa).", "Problemas resueltos: Vista de control (precio/venta, productos no vendidos), margen de utilidad, comparación de todos los joins."] },
              { num: 2, title: "Ordenamiento y Filtrado Avanzado (4 horas)", colorMenu: "green", items: ["Funciones: ORDER BY (Ordenar), DESC (Descendente), operadores de fecha, GROUP BY (Agrupar), SUM() (Suma).", "Problemas resueltos: Top ventas ordenadas, rango de fechas, cruce de tres tablas, vista de valorización (Venta_Total, Costo_Total, Bono_Total), reportes por vendedor/producto/familia."] },
              { num: 3, title: "Requerimientos Complejos (4 horas)", colorMenu: "green", items: ["Problemas resueltos: Cruce de cuatro/cinco tablas, columnas calculadas (Utilidad Total, Impuesto), vista agrupada por país (suma cantidad/venta/costo/impuesto), filtros para informes, consultas condicionales."] },
              { num: 4, title: "Integración de IA Intermedia (4 horas)", colorMenu: "green", items: ["Uso de herramientas de inteligencia artificial para resolver problemas de complejidad intermedia en reportes que serán a la medida.", "Preprocesamiento de datos para IA: Limpieza y agregación con GROUP BY para preparar datasets para modelos predictivos."] }
            ].map((module) => {
              const isOpen = openItems.includes(`n2-${module.num}`);
              return (
                <div key={module.num} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => toggleItem(`n2-${module.num}`)} className="flex justify-between items-center w-full text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 font-bold text-2xl">{module.num}</span>
                      <span className="text-2xl md:text-3xl font-bold text-gray-800">{module.title}</span>
                    </div>
                    <ChevronDown className={`w-8 h-8 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-600' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-8 text-2xl text-gray-600 border-t border-gray-100 leading-relaxed">
                      <ul className="space-y-3">
                        {module.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="text-[#0891b2] font-bold text-3xl leading-none mt-1">•</span>
                            <span dangerouslySetInnerHTML={{ __html: item.replace("Funciones:", "<strong>Funciones:</strong>").replace("Problemas resueltos:", "<strong>Problemas resueltos:</strong>") }}></span>
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
                  Este curso avanzado profundiza en vistas complejas, procedimientos almacenados y análisis predictivos, perfecto para profesionales que buscan optimizar reportes automatizados en entornos corporativos.
                </p>
              </div>
              <div className="bg-orange-50 p-8 md:p-10 rounded-3xl border border-orange-100 shadow-sm">
                <h3 className="text-3xl font-bold text-orange-600 mb-6">Beneficios:</h3>
                <ul className="text-xl text-gray-700 leading-relaxed space-y-4">
                  {[
                    "Automatización completa con procedimientos para decisiones predictivas.",
                    "Alta demanda en roles de data science.",
                    "Estrategias para metas y actualizaciones en tiempo real.",
                    "Integración con IA para insights avanzados en bases de datos."
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
              { num: 1, title: "Creación de Vistas Complejas (4 horas)", items: ["Funciones: LEFT() (Extraer texto), CASE WHEN (Condicionales), CONCAT() (Concatenar).", "Problemas resueltos: Cruce con múltiples joins, columna Tipo_Transporte por país, vistas agrupadas por país/año/mes/vendedor, top mayores/menores ventas."] },
              { num: 2, title: "Tablas de Reportes y Procedimientos (3 horas)", items: ["Funciones: SELECT INTO (Crear tabla de consulta), DROP TABLE (Eliminar), CREATE PROC (Procedimiento), EXECUTE (Ejecutar).", "Problemas resueltos: Tabla de vista, actualización de reportes, procedimientos para múltiples tablas/vistas, caso práctico de negocio."] },
              { num: 3, title: "Análisis de Datos y Reportes (3 horas)", items: ["Funciones: ALTER TABLE (Modificar), ADD CONSTRAINT (Restricciones), UPDATE (Actualizar), CAST() (Convertir tipos).", "Problemas resueltos: Modificar tipos/claves primarias, vistas por comuna/región, procedimientos para actualizar vistas, estrategia de metas (comparación ventas reales vs. metas)."] },
              { num: 4, title: "Trabajo Final Aplicado (3 horas)", items: ["Aplicación integral: Trabajo práctico con todas las herramientas, certificación al aprobar."] }
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
                            <span className="text-[#0891b2] font-bold text-3xl leading-none mt-1">•</span>
                            <span dangerouslySetInnerHTML={{ __html: item.replace("Funciones:", "<strong>Funciones:</strong>").replace("Problemas resueltos:", "<strong>Problemas resueltos:</strong>").replace("Aplicación integral:", "<strong>Aplicación integral:</strong>") }}></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Item 3.5 AI Highlight */}
            <div className="bg-gradient-to-br from-white to-cyan-50 p-8 md:p-10 rounded-3xl border border-cyan-100 shadow-sm hover:shadow-md transition-shadow">
               <button onClick={() => toggleItem(`n3-5`)} className="flex justify-between items-center w-full text-left bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                  <div className="flex items-center gap-6">
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-[#0891b2] text-white font-bold text-2xl">
                         <Star className="w-6 h-6 fill-white" />
                      </span>
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">Integración Avanzada de IA (3 horas)</span>
                  </div>
                  <ChevronDown className={`w-8 h-8 text-gray-400 transition-transform duration-300 ${openItems.includes(`n3-5`) ? 'rotate-180 text-[#0891b2]' : ''}`} />
               </button>
               <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openItems.includes(`n3-5`) ? 'max-h-[1500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-8 text-2xl text-gray-700 border-t border-cyan-100 leading-relaxed">
                      <ul className="space-y-3">
                        {[
                          "Uso de herramientas de inteligencia artificial para resolver problemas complejos de consultas (querys) y procedimientos almacenados.",
                          "Uso de la inteligencia artificial para integrar consultas de SQL con códigos de Python para ejecutar informes y procesos."
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <span className="text-[#0891b2] font-bold text-3xl leading-none mt-1">•</span>
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
