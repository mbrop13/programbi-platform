"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronRight, Book, ArrowRight } from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
  details: string;
  category: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "SQL (Structured Query Language)",
    definition: "Lenguaje estándar de programación utilizado para administrar, consultar y manipular bases de datos relacionales.",
    details: "Es la herramienta fundamental para cualquier analista de datos. Permite realizar consultas mediante sentencias como SELECT, JOIN y GROUP BY para extraer información estructurada de servidores como SQL Server, PostgreSQL o MySQL.",
    category: "Bases de Datos",
  },
  {
    term: "DAX (Data Analysis Expressions)",
    definition: "Lenguaje de fórmulas y expresiones matemáticas utilizado en Microsoft Power BI para crear cálculos y medidas personalizadas.",
    details: "DAX permite realizar cálculos avanzados de modelado de datos e inteligencia de tiempo (Time Intelligence), tales como calcular ventas acumuladas año a fecha (YTD) o variaciones porcentuales año contra año.",
    category: "Power BI",
  },
  {
    term: "ETL (Extract, Transform, Load)",
    definition: "Proceso de ingeniería de datos que extrae información de múltiples fuentes, la transforma/limpia y la carga en un repositorio central o Data Warehouse.",
    details: "En el análisis de datos, el flujo ETL permite automatizar la recolección de archivos planos, bases de datos y APIs para dejarlos unificados y listos para su visualización.",
    category: "Ingeniería de Datos",
  },
  {
    term: "Pandas",
    definition: "Librería de código abierto para el lenguaje de programación Python diseñada para el análisis y manipulación de datos.",
    details: "Ofrece estructuras de datos potentes como los DataFrames, ideales para realizar limpiezas, filtrados, agrupaciones y análisis estadísticos rápidos sobre grandes volúmenes de datos.",
    category: "Python",
  },
  {
    term: "Power Query",
    definition: "Motor de conexión y transformación de datos desarrollado por Microsoft para Power BI y Excel.",
    details: "Permite importar datos desde cientos de fuentes diferentes y realizar limpiezas complejas (como pivotar columnas o filtrar filas) de manera visual y sin escribir código complejo, registrando cada paso en código M.",
    category: "Power BI",
  },
  {
    term: "Machine Learning (Aprendizaje Automático)",
    definition: "Rama de la Inteligencia Artificial que permite a los sistemas informáticos aprender de los datos y hacer predicciones de forma autónoma sin programación explícita.",
    details: "Se clasifica principalmente en aprendizaje supervisado (regresiones y clasificaciones) y no supervisado (clustering). Se implementa principalmente en Python utilizando librerías como Scikit-Learn.",
    category: "Inteligencia Artificial",
  },
  {
    term: "Data Warehouse (Bodega de Datos)",
    definition: "Repositorio centralizado que almacena datos integrados de una o más fuentes diferentes para facilitar el análisis y la reportabilidad de negocios.",
    details: "A diferencia de las bases de datos transaccionales (OLTP), los Data Warehouses (OLAP) están diseñados y optimizados específicamente para realizar consultas rápidas e informes de agregación masivos.",
    category: "Bases de Datos",
  },
  {
    term: "CTE (Common Table Expression)",
    definition: "Conjunto de resultados temporal y con nombre que se puede definir dentro de la ejecución de una consulta SELECT, INSERT, UPDATE o DELETE en SQL.",
    details: "Mejora significativamente la legibilidad y mantenimiento de consultas complejas en SQL, actuando como una tabla virtual temporal en la consulta sin necesidad de crear una tabla física.",
    category: "Bases de Datos",
  },
  {
    term: "Churn (Tasa de Fuga de Clientes)",
    definition: "Métrica de negocios que mide el porcentaje de clientes que dejan de consumir el servicio o producto de una empresa en un periodo determinado.",
    details: "Es un indicador crítico para empresas con modelos de suscripción. Utilizando modelos predictivos en Python, es posible anticipar el churn analizando comportamientos de soporte y ausentismo.",
    category: "Negocios & Analytics",
  },
  {
    term: "KPI (Key Performance Indicator)",
    definition: "Métrica cuantificable utilizada para evaluar el éxito de una organización, campaña o profesional en el cumplimiento de objetivos estratégicos.",
    details: "Ejemplos comunes incluyen el Ticket Promedio, Costo de Adquisición de Clientes (CAC) y Margen Neto. Estos se visualizan típicamente en dashboards ejecutivos de Power BI.",
    category: "Negocios & Analytics",
  },
  {
    term: "Forecasting (Pronóstico de Demanda)",
    definition: "Proceso estadístico y analítico que predice eventos futuros basado en patrones y datos históricos.",
    details: "En el análisis logístico y de retail, permite calcular el stock de seguridad necesario y predecir ventas semanales mediante modelos predictivos de series de tiempo de Python.",
    category: "Negocios & Analytics",
  },
  {
    term: "JOIN",
    definition: "Operación de SQL que permite combinar registros de dos o más tablas en una base de datos relacional basada en un campo común.",
    details: "Los tipos principales son INNER JOIN (coincidencias exactas), LEFT JOIN (todos los de la izquierda más coincidentes de la derecha), RIGHT JOIN y FULL OUTER JOIN.",
    category: "Bases de Datos",
  },
  {
    term: "Python",
    definition: "Lenguaje de programación de alto nivel, interpretado y multipropósito, ampliamente adoptado en ciencia de datos por su legibilidad y robusto ecosistema.",
    details: "Su popularidad radica en su sintaxis amigable y en la gran cantidad de librerías especializadas (como Pandas, Numpy, Scikit-Learn y TensorFlow) dedicadas al procesamiento y modelamiento de datos.",
    category: "Python",
  },
  {
    term: "Modelado Dimensional (Esquema Estrella)",
    definition: "Técnica de diseño de bases de datos optimizada para sistemas de Business Intelligence, compuesta por tablas de hechos y tablas de dimensiones.",
    details: "En Power BI, organizar los datos en un esquema estrella (una tabla central de hechos conectada a dimensiones satélite) optimiza el rendimiento de las consultas y simplifica las fórmulas DAX.",
    category: "Power BI",
  },
  {
    term: "Prompt Engineering",
    definition: "Práctica de diseñar, optimizar y refinar instrucciones de entrada (prompts) para guiar el comportamiento y respuestas de modelos de Inteligencia Artificial (LLMs).",
    details: "Es una habilidad crucial en el desarrollo de software moderno y análisis de datos, permitiendo a los analistas co-programar y automatizar flujos mediante herramientas de IA de forma productiva.",
    category: "Inteligencia Artificial",
  }
];

export default function GlosarioPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Get unique starting letters from terms
  const availableLetters = useMemo(() => {
    const letters = GLOSSARY_TERMS.map((t) => t.term[0].toUpperCase());
    return [...new Set(letters)].sort();
  }, []);

  // Filter terms by query and starting letter
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((t) => {
      const matchesSearch = 
        t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLetter = selectedLetter 
        ? t.term[0].toUpperCase() === selectedLetter.toUpperCase() 
        : true;
      
      return matchesSearch && matchesLetter;
    });
  }, [searchQuery, selectedLetter]);

  // DefinedTermSet JSON-LD for AI search engines
  const glossaryJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": "https://www.programbi.com/glosario/#termset",
    name: "Glosario de Términos de Datos y Business Intelligence | ProgramBI",
    description: "Diccionario de términos técnicos explicados de forma concisa sobre bases de datos SQL, Power BI, fórmulas DAX, programación en Python y Machine Learning.",
    url: "https://www.programbi.com/glosario",
    hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      inDefinedTermSet: "https://www.programbi.com/glosario/#termset"
    }))
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.programbi.com" },
      { "@type": "ListItem", position: 2, name: "Glosario", item: "https://www.programbi.com/glosario" }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossaryJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="bg-[#FAFBFC] min-h-screen pt-28 pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-[1000px] mx-auto px-5 lg:px-10">
          
          {/* Breadcrumbs Row */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors no-underline text-slate-500">Inicio</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">Glosario</span>
          </div>

          <div className="mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#1890FF] bg-blue-50 px-3 py-1.5 rounded-full inline-block mb-3">
              Diccionario de Datos
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.1] mb-4">
              Glosario de Términos
            </h1>
            <p className="text-slate-500 text-base lg:text-lg leading-relaxed max-w-3xl">
              Aprende el vocabulario técnico clave que utilizan los analistas y profesionales de datos. Definiciones directas y amigables para estructurar tu conocimiento.
            </p>
          </div>

          {/* Search & Letter Filter */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar término o palabra clave..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedLetter(null);
                }}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Letter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 mr-2">Filtrar:</span>
              <button
                onClick={() => setSelectedLetter(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                  selectedLetter === null
                    ? "bg-[#1890FF] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Todos
              </button>
              {availableLetters.map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLetter(l)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                    selectedLetter === l
                      ? "bg-[#1890FF] text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Terms List */}
          <div className="space-y-6">
            {filteredTerms.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <Book className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg text-slate-800 mb-1">Término no encontrado</h3>
                <p className="text-slate-400 text-sm">Prueba buscando con palabras como SQL, Python o DAX.</p>
              </div>
            ) : (
              filteredTerms.map((t, idx) => (
                <article
                  key={idx}
                  className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display font-bold text-xl text-slate-900 group-hover:text-[#1890FF] transition-colors my-0">
                      {t.term}
                    </h2>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {t.category}
                    </span>
                  </div>
                  
                  {/* Definition Lead block (TL;DR) */}
                  <blockquote className="m-0 pl-4 border-l-2 border-[#1890FF] text-slate-700 text-sm font-semibold leading-relaxed">
                    <strong>TL;DR:</strong> {t.definition}
                  </blockquote>

                  {/* Details block */}
                  <p className="text-slate-500 text-sm leading-relaxed my-0 pt-2">
                    {t.details}
                  </p>
                </article>
              ))
            )}
          </div>

          {/* Call to action */}
          <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden mt-16 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF]/15 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-xl">
              <h3 className="font-display font-black text-2xl mb-3">Aprende a aplicar estos conceptos</h3>
              <p className="text-slate-350 text-sm leading-relaxed mb-6">
                No te quedes solo en la teoría. Aprende SQL, modelamiento de Power BI y programación en Python mediante proyectos prácticos guiados paso a paso con instructores en vivo.
              </p>
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 bg-[#1890FF] hover:bg-blue-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl no-underline transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
              >
                <span>Explorar Cursos en Vivo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
