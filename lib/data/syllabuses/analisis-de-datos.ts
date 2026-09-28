import type { CourseSyllabusData } from "./types";

export const analisisDeDatosSyllabus: CourseSyllabusData = {
  slug: "analisis-de-datos",
  accent: "#1890FF",
  programYear: "2026",
  audience:
    "Ideal para perfiles administrativos, financieros, comerciales, ingenieros y analistas que buscan dominar el ciclo completo del dato. Desde principiantes hasta quienes requieren análisis predictivo y automatización avanzada.",
  audienceNote:
    "Dos niveles de 60 horas. Cada nivel trabaja SQL Server, Power BI y Python: 20 horas por herramienta.",
  benefits: [
    { title: "Automatización Total", description: "Reduce horas de trabajo conectando directamente a BD corporativas." },
    { title: "Visualización de Impacto", description: "Dashboards dinámicos para decisiones críticas de negocio." },
    { title: "Consultas Eficientes", description: "Extrae y cruza información con SQL Server sin depender de TI." },
    { title: "Ciencia de Datos", description: "Analítica predictiva y limpieza tabular con Pandas y Plotly." },
    { title: "IA Transversal", description: "Uso de Inteligencia Artificial en cada módulo para generar código." },
  ],
  levels: [
    {
      id: "basico-intermedio",
      label: "Básico-Intermedio",
      shortLabel: "60 h",
      theme: "#1890FF",
      intro:
        "Nivel inicial del programa. Instala las bases sólidas en las tres herramientas: consultas a bases de datos, primeros tableros y análisis tabular en Python, con apoyo de IA en cada módulo.",
      modules: [
        {
          id: "bi-pbi",
          title: "Power BI",
          hours: 20,
          subtitle: "20 Horas • Tableros y DAX inicial",
          icon: "powerbi",
          topics: [
            "Introducción al entorno, instalaciones y cuentas.",
            "Power Query: importación desde Excel, SQL y APIs.",
            "Limpieza básica de datos, cálculos y columnas a medida.",
            "Visualizaciones iniciales: barras, líneas, mapas y KPIs.",
            "Unpivot Columns y títulos dinámicos con SELECTEDVALUE.",
            "Publicación online con roles y seguridad organizacional.",
            "IA en el informe: Q&A en lenguaje natural y Smart Narratives.",
          ],
        },
        {
          id: "bi-sql",
          title: "SQL Server",
          hours: 20,
          subtitle: "20 Horas • Consultas y agregaciones",
          icon: "sql",
          topics: [
            "Recuperación de datos (SELECT), TOP y cláusula WHERE.",
            "Operadores lógicos (AND/OR) y funciones de fecha (MONTH, YEAR).",
            "Cruce de tablas: INNER, LEFT, RIGHT y FULL JOIN.",
            "GROUP BY, HAVING y funciones de agregación (SUM, COUNT, ORDER BY).",
            "Vistas de valorización y consolidados departamentales.",
            "IA para generar y revisar consultas a medida.",
          ],
        },
        {
          id: "bi-py",
          title: "Python",
          hours: 20,
          subtitle: "20 Horas • Pandas y visualización",
          icon: "python",
          topics: [
            "Variables, tipos de datos, control de flujo y estructuras (listas, tuplas, diccionarios).",
            "Pandas: DataFrames desde Excel y exploración tabular.",
            "Groupby y agregaciones múltiples con Pandas.",
            "Limpieza de columnas, tipos y fechas de transacciones.",
            "Matplotlib y Seaborn para reportes de complejidad media.",
            "IA para generar scripts de análisis y automatizar reportes.",
          ],
        },
      ],
    },
    {
      id: "avanzado",
      label: "Avanzado",
      shortLabel: "60 h",
      theme: "#0F172A",
      intro:
        "Nivel avanzado del programa. Profundiza en automatización de servidores, inteligencia de tiempo en Power BI y modelos predictivos en Python, integrando IA en todo el flujo.",
      modules: [
        {
          id: "av-pbi",
          title: "Power BI",
          hours: 20,
          subtitle: "20 Horas • Inteligencia de tiempo y publicación",
          icon: "bolt",
          topics: [
            "DAX avanzado: YTD, MTD, SAMEPERIODLASTYEAR y RANKX.",
            "Parámetros dinámicos (what-if) y prorrateo de metas.",
            "Interactividad total: botones, marcadores y drillthrough.",
            "Seguridad RLS por usuario y funciones USERELATIONSHIP.",
            "Publicación y gobernanza en Power BI Service.",
            "IA generativa en el informe: Smart Narratives y Copilot.",
          ],
        },
        {
          id: "av-sql",
          title: "SQL Server",
          hours: 20,
          subtitle: "20 Horas • Automatización y administración",
          icon: "network",
          topics: [
            "Vistas avanzadas con condicionales CASE WHEN y funciones de cadena.",
            "Cruces de alta complejidad y consolidaciones entre áreas.",
            "Automatización con CREATE PROC y EXECUTE.",
            "Administración: SELECT INTO, ALTER TABLE y UPDATE.",
            "Diseño de esquemas, índices y optimización de consultas.",
            "Procesos ETL que conectan SQL con Python e IA.",
          ],
        },
        {
          id: "av-py",
          title: "Python",
          hours: 20,
          subtitle: "20 Horas • Dashboards interactivos y predicción",
          icon: "bot",
          topics: [
            "Unión de bases complejas con pd.merge y funciones propias con .apply().",
            "Modelos aplicados sobre datos reales de negocio.",
            "Gráficos declarativos e interactivos con Plotly.",
            "Sunburst, Treemaps y subgráficos de alta interactividad.",
            "Proyecto final: análisis predictivo con IA integrada.",
            "Automatización de reportes y publicación del análisis.",
          ],
        },
      ],
    },
  ],
};
