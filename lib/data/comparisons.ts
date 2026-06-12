export interface ComparisonFeature {
  feature: string;
  toolAVal: string;
  toolBVal: string;
  winner: "A" | "B" | "Tie";
}

export interface ToolComparison {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  toolA: { name: string; desc: string; logo?: string };
  toolB: { name: string; desc: string; logo?: string };
  features: ComparisonFeature[];
  prosA: string[];
  consA: string[];
  prosB: string[];
  consB: string[];
  conclusion: string;
  ctaCourseSlug: string;
}

export const comparisons: ToolComparison[] = [
  {
    slug: "power-bi-vs-excel",
    title: "Power BI vs. Microsoft Excel: ¿Cuál elegir en 2026?",
    seoTitle: "Power BI vs. Excel: Comparativa Completa para Finanzas y Datos",
    seoDescription: "Descubre las diferencias entre Power BI y Microsoft Excel. Cuándo usar planillas tradicionales y cuándo migrar a dashboards interactivos automáticos.",
    intro: "Tanto Microsoft Excel como Power BI son herramientas fundamentales del ecosistema de Microsoft, pero están diseñadas para propósitos diferentes. Mientras Excel es la navaja suiza de la manipulación de celdas individuales, Power BI es un motor robusto de Business Intelligence diseñado para consolidación masiva y análisis interactivo a escala.",
    toolA: {
      name: "Power BI",
      desc: "Plataforma de Business Intelligence diseñada para modelado de datos empresariales, automatización de ETL y creación de dashboards compartibles."
    },
    toolB: {
      name: "Microsoft Excel",
      desc: "Hoja de cálculo tradicional ideal para análisis rápidos y ad-hoc, cálculos en cuadrículas independientes y manipulación manual de datos a pequeña escala."
    },
    features: [
      {
        feature: "Límite de Volumen de Datos",
        toolAVal: "Virtualmente ilimitado (compresión columnar x10). Soporta millones de filas sin congelarse.",
        toolBVal: "1,048,576 filas por hoja. Sufre lentitud crítica al superar las 200,000 filas.",
        winner: "A"
      },
      {
        feature: "Modelado e Inteligencia de Negocios",
        toolAVal: "Modelo en Estrella nativo con relaciones avanzadas y fórmulas DAX de Inteligencia de Tiempo.",
        toolBVal: "Fórmulas de celda (BUSCARV, SI). Soporta Power Pivot en versiones avanzadas pero no es nativo.",
        winner: "A"
      },
      {
        feature: "Automatización de Reportes",
        toolAVal: "Actualización programada directa desde bases de datos en la nube. Cero clics manuales.",
        toolBVal: "Requiere abrir el archivo, refrescar tablas dinámicas o ejecutar macros VBA manuales.",
        winner: "A"
      },
      {
        feature: "Seguridad y Gobernanza (RLS)",
        toolAVal: "Seguridad a nivel de fila (Row-Level Security) nativa para filtrar qué visualiza cada usuario.",
        toolBVal: "Protección de hojas básica con contraseñas que son fácilmente hackeables en internet.",
        winner: "A"
      },
      {
        feature: "Edición y Digitabilidad",
        toolAVal: "Solo lectura. Diseñado para consumir y auditar datos limpios extraídos de bases de datos.",
        toolBVal: "Edición instantánea. Ideal para crear tablas manuales, presupuestos iniciales y digitación.",
        winner: "B"
      }
    ],
    prosA: [
      "Dashboards dinámicos e interactivos en vivo.",
      "Excelente rendimiento con grandes volúmenes de datos.",
      "Actualización de reportes 100% automatizable.",
      "Compatible con seguridad de accesos móviles corporativos."
    ],
    consA: [
      "Curva de aprendizaje inicial para dominar fórmulas DAX.",
      "No permite la digitación o modificación manual directa de celdas."
    ],
    prosB: [
      "Sintaxis familiar y adopción universal.",
      "Excelente para modelos financieros rápidos de una sola vez.",
      "Flexibilidad absoluta para formatear celdas independientes."
    ],
    consB: [
      "Los reportes manuales son altamente propensos a errores de digitación.",
      "No escala bien con bases de datos modernas."
    ],
    conclusion: "Si tu objetivo es digitar datos, presupuestos rápidos o análisis de una sola vez, Excel sigue siendo la mejor opción. Si buscas automatizar reportes recurrentes, consolidar bases de datos y compartir tableros interactivos con directivos, debes migrar a Power BI.",
    ctaCourseSlug: "power-bi"
  },
  {
    slug: "sql-server-vs-postgresql",
    title: "SQL Server vs. PostgreSQL: Comparativa de Motores de Bases de Datos",
    seoTitle: "Microsoft SQL Server vs. PostgreSQL: ¿Cuál es mejor para Analistas?",
    seoDescription: "Comparación profunda entre SQL Server y PostgreSQL. Pros, contras, licenciamiento y rendimiento para proyectos de bases de datos empresariales.",
    intro: "Al estructurar un Data Warehouse o base de datos analítica, elegir el motor relacional correcto define la escalabilidad y las herramientas a utilizar. Microsoft SQL Server y PostgreSQL son dos gigantes de la industria con óptimo desempeño corporativo.",
    toolA: {
      name: "SQL Server",
      desc: "Motor de base de datos relacional de Microsoft corporativo, enfocado en integraciones con Azure, Power BI y herramientas nativas como SQL Server Agent."
    },
    toolB: {
      name: "PostgreSQL",
      desc: "Motor de base de datos relacional de código abierto (open-source) sumamente potente, preferido por startups y desarrolladores de software libre."
    },
    features: [
      {
        feature: "Costo y Licenciamiento",
        toolAVal: "Licenciamiento comercial por núcleos (Standard/Enterprise). Costo elevado para servidores grandes.",
        toolBVal: "100% Gratis y de Código Abierto. Sin cargos de licenciamiento.",
        winner: "B"
      },
      {
        feature: "Integración con Power BI",
        toolAVal: "Nativa y de altísimo rendimiento. Soporta DirectQuery óptimo y mapeo de seguridad Active Directory.",
        toolBVal: "Soportada mediante conectores estándar, pero requiere configuraciones adicionales de rendimiento.",
        winner: "A"
      },
      {
        feature: "Herramientas de Administración",
        toolAVal: "SSMS (SQL Server Management Studio) es el estándar de oro de administración de bases de datos.",
        toolBVal: "pgAdmin o herramientas de terceros como DBeaver. Funcionales pero menos integradas que SSMS.",
        winner: "A"
      },
      {
        feature: "Programación Interna",
        toolAVal: "T-SQL (Transact-SQL) con excelente soporte de Stored Procedures y funciones analíticas integradas.",
        toolBVal: "PL/pgSQL con soporte avanzado de JSONB para esquemas híbridos relacionales/no-relacionales.",
        winner: "Tie"
      }
    ],
    prosA: [
      "Integración impecable con herramientas de analítica Microsoft.",
      "SSMS es sumamente amigable para analistas de datos.",
      "Excelente programador de tareas (SQL Server Agent).",
      "Soporte corporativo directo de Microsoft."
    ],
    consA: [
      "Costos de licenciamiento prohibitivos para startups pequeñas.",
      "Mayor consumo de recursos de hardware en SO Windows Server."
    ],
    prosB: [
      "Completamente libre de costos de licencias.",
      "Excelente manejo de datos geográficos (PostGIS).",
      "Gran comunidad open-source y actualizaciones continuas.",
      "Extremadamente ligero y portable."
    ],
    consB: [
      "La suite de herramientas de administración nativa no es tan visual como SSMS.",
      "No cuenta con soporte comercial unificado de un solo fabricante."
    ],
    conclusion: "Si tu infraestructura y reportería corporativa está basada en el ecosistema Microsoft (Excel, Power BI, Azure, Active Directory), SQL Server es la opción idónea y más fácil de implementar. Para proyectos de software libre, desarrollo web general o presupuestos ajustados, PostgreSQL es el rey indiscutido.",
    ctaCourseSlug: "sql-server"
  },
  {
    slug: "python-vs-r",
    title: "Python vs. R para Ciencia y Análisis de Datos: Guía Comparativa",
    seoTitle: "Python vs. R en 2026: ¿Qué lenguaje aprender primero para Datos?",
    seoDescription: "Comparamos Python y R para análisis de datos, automatización y Machine Learning. Conoce sus diferencias de sintaxis y salidas laborales en Latinoamérica.",
    intro: "Para ir más allá de las bases de datos relacionales e interactuar con analítica predictiva, los lenguajes de programación son vitales. Python y R son los dos lenguajes más dominantes en ciencia de datos, cada uno con filosofías de diseño distintas.",
    toolA: {
      name: "Python",
      desc: "Lenguaje de programación de propósito general, multiparadigma y sumamente popular por su legibilidad y adaptabilidad a flujos de ingeniería."
    },
    toolB: {
      name: "R",
      desc: "Lenguaje y entorno de programación especializado para el análisis estadístico, computación gráfica y modelado de datos científicos."
    },
    features: [
      {
        feature: "Curva de Aprendizaje y Sintaxis",
        toolAVal: "Sintaxis limpia similar al inglés. Muy amigable para principiantes sin bases de código.",
        toolBVal: "Sintaxis orientada a vectores y matrices. Puede resultar confusa si no tienes bases de estadística.",
        winner: "A"
      },
      {
        feature: "Manipulación de Datos",
        toolAVal: "Librería Pandas. Es el estándar de oro en la industria informática.",
        toolBVal: "Ecosistema Tidyverse (dplyr, tidyr). Sintaxis extremadamente elegante para analistas.",
        winner: "Tie"
      },
      {
        feature: "Machine Learning e Ingeniería",
        toolAVal: "Dominio absoluto. Soporte de librerías como Scikit-Learn, TensorFlow, PyTorch y APIs.",
        toolBVal: "Enfocado en modelado estadístico puro (regresiones avanzadas). Soporte limitado para producción.",
        winner: "A"
      },
      {
        feature: "Gráficos y Visualización",
        toolAVal: "Matplotlib, Seaborn y Plotly. Funcionales pero requieren varias líneas de código para estética.",
        toolBVal: "ggplot2 es insuperable en la creación de gráficos estadísticos con calidad de publicación.",
        winner: "B"
      }
    ],
    prosA: [
      "Lenguaje de propósito general aplicable a web, APIs y scripts.",
      "Demanda laboral significativamente mayor en el sector corporativo.",
      "Excelente integración con herramientas de IA (OpenAI, LangChain).",
      "Sintaxis legible y fácil de mantener."
    ],
    consA: [
      "Menor densidad de paquetes puramente estadísticos que R."
    ],
    prosB: [
      "ggplot2 permite crear visualizaciones hermosas e instantáneas.",
      "Diseñado por estadísticos para estadísticos.",
      "Excelente para investigación académica y bioestadística."
    ],
    consB: [
      "Dificultad de integración en flujos de software y bases de datos en producción.",
      "Menor campo laboral en empresas tradicionales de LatAm frente a Python."
    ],
    conclusion: "Si tu objetivo es la investigación académica pura o la bioestadística avanzada, R te dará herramientas de gráficos insuperables. Sin embargo, para integrarte en la industria comercial, automatizar planillas corporativas y entrar al mundo de Machine Learning e Inteligencia Artificial, aprender Python es la mejor inversión laboral.",
    ctaCourseSlug: "python"
  }
];

export function getComparisonBySlug(slug: string): ToolComparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}
