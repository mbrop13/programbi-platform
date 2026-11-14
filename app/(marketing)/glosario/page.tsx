import type { Metadata } from "next";
import GlosarioClient, { type GlossaryTerm } from "./GlosarioClient";
import {
  DEFAULT_OG_IMAGE,
  ORG_ID,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl,
  jsonLdString,
  twitterShare,
} from "@/lib/seo";

const TITLE = "Glosario de Datos: Power BI, DAX, SQL y Python";
const DESCRIPTION =
  "Diccionario de SQL, Power BI, DAX, Python y Machine Learning. Definiciones claras para analistas y profesionales de datos en Chile.";
const CANONICAL = absoluteUrl("/glosario");
const TERM_SET_ID = `${CANONICAL}#termset`;

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "sql",
    term: "SQL (Structured Query Language)",
    definition:
      "Lenguaje estándar de programación utilizado para administrar, consultar y manipular bases de datos relacionales.",
    details:
      "Es la herramienta fundamental para cualquier analista de datos. Permite realizar consultas mediante sentencias como SELECT, JOIN y GROUP BY para extraer información estructurada de servidores como SQL Server, PostgreSQL o MySQL.",
    category: "Bases de Datos",
  },
  {
    slug: "dax",
    term: "DAX (Data Analysis Expressions)",
    definition:
      "Lenguaje de fórmulas y expresiones matemáticas utilizado en Microsoft Power BI para crear cálculos y medidas personalizadas.",
    details:
      "DAX permite realizar cálculos avanzados de modelado de datos e inteligencia de tiempo (Time Intelligence), tales como calcular ventas acumuladas año a fecha (YTD) o variaciones porcentuales año contra año.",
    category: "Power BI",
  },
  {
    slug: "etl",
    term: "ETL (Extract, Transform, Load)",
    definition:
      "Proceso de ingeniería de datos que extrae información de múltiples fuentes, la transforma/limpia y la carga en un repositorio central o Data Warehouse.",
    details:
      "En el análisis de datos, el flujo ETL permite automatizar la recolección de archivos planos, bases de datos y APIs para dejarlos unificados y listos para su visualización.",
    category: "Ingeniería de Datos",
  },
  {
    slug: "pandas",
    term: "Pandas",
    definition:
      "Librería de código abierto para el lenguaje de programación Python diseñada para el análisis y manipulación de datos.",
    details:
      "Ofrece estructuras de datos potentes como los DataFrames, ideales para realizar limpiezas, filtrados, agrupaciones y análisis estadísticos rápidos sobre grandes volúmenes de datos.",
    category: "Python",
  },
  {
    slug: "power-query",
    term: "Power Query",
    definition:
      "Motor de conexión y transformación de datos desarrollado por Microsoft para Power BI y Excel.",
    details:
      "Permite importar datos desde cientos de fuentes diferentes y realizar limpiezas complejas (como pivotar columnas o filtrar filas) de manera visual y sin escribir código complejo, registrando cada paso en código M.",
    category: "Power BI",
  },
  {
    slug: "machine-learning",
    term: "Machine Learning (Aprendizaje Automático)",
    definition:
      "Rama de la Inteligencia Artificial que permite a los sistemas informáticos aprender de los datos y hacer predicciones de forma autónoma sin programación explícita.",
    details:
      "Se clasifica principalmente en aprendizaje supervisado (regresiones y clasificaciones) y no supervisado (clustering). Se implementa principalmente en Python utilizando librerías como Scikit-Learn.",
    category: "Inteligencia Artificial",
  },
  {
    slug: "data-warehouse",
    term: "Data Warehouse (Bodega de Datos)",
    definition:
      "Repositorio centralizado que almacena datos integrados de una o más fuentes diferentes para facilitar el análisis y la reportabilidad de negocios.",
    details:
      "A diferencia de las bases de datos transaccionales (OLTP), los Data Warehouses (OLAP) están diseñados y optimizados específicamente para realizar consultas rápidas e informes de agregación masivos.",
    category: "Bases de Datos",
  },
  {
    slug: "cte",
    term: "CTE (Common Table Expression)",
    definition:
      "Conjunto de resultados temporal y con nombre que se puede definir dentro de la ejecución de una consulta SELECT, INSERT, UPDATE o DELETE en SQL.",
    details:
      "Mejora significativamente la legibilidad y mantenimiento de consultas complejas en SQL, actuando como una tabla virtual temporal en la consulta sin necesidad de crear una tabla física.",
    category: "Bases de Datos",
  },
  {
    slug: "churn",
    term: "Churn (Tasa de Fuga de Clientes)",
    definition:
      "Métrica de negocios que mide el porcentaje de clientes que dejan de consumir el servicio o producto de una empresa en un periodo determinado.",
    details:
      "Es un indicador crítico para empresas con modelos de suscripción. Utilizando modelos predictivos en Python, es posible anticipar el churn analizando comportamientos de soporte y ausentismo.",
    category: "Negocios & Analytics",
  },
  {
    slug: "kpi",
    term: "KPI (Key Performance Indicator)",
    definition:
      "Métrica cuantificable utilizada para evaluar el éxito de una organización, campaña o profesional en el cumplimiento de objetivos estratégicos.",
    details:
      "Ejemplos comunes incluyen el Ticket Promedio, Costo de Adquisición de Clientes (CAC) y Margen Neto. Estos se visualizan típicamente en dashboards ejecutivos de Power BI.",
    category: "Negocios & Analytics",
  },
  {
    slug: "forecasting",
    term: "Forecasting (Pronóstico de Demanda)",
    definition:
      "Proceso estadístico y analítico que predice eventos futuros basado en patrones y datos históricos.",
    details:
      "En el análisis logístico y de retail, permite calcular el stock de seguridad necesario y predecir ventas semanales mediante modelos predictivos de series de tiempo de Python.",
    category: "Negocios & Analytics",
  },
  {
    slug: "join",
    term: "JOIN",
    definition:
      "Operación de SQL que permite combinar registros de dos o más tablas en una base de datos relacional basada en un campo común.",
    details:
      "Los tipos principales son INNER JOIN (coincidencias exactas), LEFT JOIN (todos los de la izquierda más coincidentes de la derecha), RIGHT JOIN y FULL OUTER JOIN.",
    category: "Bases de Datos",
  },
  {
    slug: "python",
    term: "Python",
    definition:
      "Lenguaje de programación de alto nivel, interpretado y multipropósito, ampliamente adoptado en ciencia de datos por su legibilidad y robusto ecosistema.",
    details:
      "Su popularidad radica en su sintaxis amigable y en la gran cantidad de librerías especializadas (como Pandas, Numpy, Scikit-Learn y TensorFlow) dedicadas al procesamiento y modelamiento de datos.",
    category: "Python",
  },
  {
    slug: "modelado-dimensional",
    term: "Modelado Dimensional (Esquema Estrella)",
    definition:
      "Técnica de diseño de bases de datos optimizada para sistemas de Business Intelligence, compuesta por tablas de hechos y tablas de dimensiones.",
    details:
      "En Power BI, organizar los datos en un esquema estrella (una tabla central de hechos conectada a dimensiones satélite) optimiza el rendimiento de las consultas y simplifica las fórmulas DAX.",
    category: "Power BI",
  },
  {
    slug: "prompt-engineering",
    term: "Prompt Engineering",
    definition:
      "Práctica de diseñar, optimizar y refinar instrucciones de entrada (prompts) para guiar el comportamiento y respuestas de modelos de Inteligencia Artificial (LLMs).",
    details:
      "Es una habilidad crucial en el desarrollo de software moderno y análisis de datos, permitiendo a los analistas co-programar y automatizar flujos mediante herramientas de IA de forma productiva.",
    category: "Inteligencia Artificial",
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/glosario" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: twitterShare(TITLE, DESCRIPTION),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DefinedTermSet",
      "@id": TERM_SET_ID,
      name: TITLE,
      description: DESCRIPTION,
      url: CANONICAL,
      inLanguage: "es",
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": WEBSITE_ID },
      hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
        "@type": "DefinedTerm",
        "@id": `${CANONICAL}#${t.slug}`,
        name: t.term,
        description: t.definition,
        url: `${CANONICAL}#${t.slug}`,
        inDefinedTermSet: { "@id": TERM_SET_ID },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${CANONICAL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Glosario", item: CANONICAL },
      ],
    },
  ],
};

export default function GlosarioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <GlosarioClient terms={GLOSSARY_TERMS} />
    </>
  );
}
