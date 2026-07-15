import type { CourseSyllabusData } from "./types";

export const analiticaFinancieraSyllabus: CourseSyllabusData = {
  slug: "analitica-financiera",
  accent: "#1D4ED8",
  programYear: "2026",
  audience:
    "Analistas de inversiones, contadores, gerentes de finanzas, auditores y especialistas que buscan dominar herramientas avanzadas. Perfecto para equipos en bancos, fondos de inversión y departamentos contables empresariales.",
  audienceNote: "Enfoque Práctico: Valoración de activos, análisis de riesgos y presupuestos.",
  benefits: [
    { title: "Automatización Contable", description: "Reduce errores manuales en balances usando SQL." },
    { title: "Monitoreo de KPIs", description: "Dashboards en tiempo real para ROI y flujos de caja." },
    { title: "Modelado de Riesgos", description: "Python para correlación de activos y predictividad." },
    { title: "Autonomía Tecnológica", description: "Extrae datos financieros sin depender de TI." },
    { title: "Integración de IA", description: "IA en cada nivel para generar código y insights." },
  ],
  levels: [
    {
      id: "nivel1",
      label: "Nivel I: Básico",
      shortLabel: "Fundamentos (16h)",
      theme: "#1D4ED8",
      intro:
        "Diseñado para introducir a los profesionales financieros en la automatización inicial, conectando fuentes de datos contables y generando las primeras visualizaciones de control.",
      modules: [
        {
          id: "n1-pbi",
          title: "Power BI: Conexión de Fuentes Financieras",
          hours: 16,
          subtitle: "16h · Contenido técnico nivel base",
          icon: "powerbi",
          topics: [
            "Entorno e Importación: Excel, SQL y APIs financieras (ej. datos de mercado).",
            "Power Query Contable: Limpiezas básicas de transacciones y cálculos a la medida.",
            "Dashboards Iniciales: KPIs simples (ej. márgenes diarios) con visuales nativos.",
            "IA en Power BI: Uso de Q&A para consultas de balances en lenguaje natural.",
          ],
        },
        {
          id: "n1-sql",
          title: "SQL Server: Extracción de Registros Financieros",
          hours: 16,
          subtitle: "16h · Contenido técnico nivel base",
          icon: "sql",
          topics: [
            "Consultas Básicas: SELECT y TOP aplicadas a miles de transacciones contables.",
            "Filtros Temporales: WHERE, MONTH(), YEAR() para cierres y balances de época.",
            "Cruce Básico (JOIN): Sincronización de tablas de ventas e ingresos vs costos.",
            "IA en SQL: Creación asistida de vistas y filtros en bases de datos empresariales.",
          ],
        },
        {
          id: "n1-py",
          title: "Python: Fundamentos y Análisis de Portafolios",
          hours: 16,
          subtitle: "16h · Contenido técnico nivel base",
          icon: "python",
          topics: [
            "Fundamentos de Finanzas: Estructuras de datos para alertas de gastos y flujos.",
            "Pandas Inicial: Lectura de Excel contable y exploración de DataFrames.",
            "Manipulación: Filtrado y agrupación (groupby) de flujos de caja operativos.",
            "IA para Extracción: Scripts automáticos para descargar valores de activos web.",
          ],
        },
      ],
    },
    {
      id: "nivel2",
      label: "Nivel II: Intermedio",
      shortLabel: "Modelado (16h)",
      theme: "#1D4ED8",
      intro:
        "Enfocado en analistas e inversores. Consolida información entre múltiples áreas contables, domina el lenguaje DAX y visualiza tendencias financieras.",
      modules: [
        {
          id: "n2-pbi",
          title: "Power BI: Visualizaciones DAX Financieras",
          hours: 16,
          subtitle: "16h · Contenido aplicado a inversiones",
          icon: "finance",
          topics: [
            "Visualizaciones Intermedias: Gráficas de saturación para balances y dispersión para inversiones.",
            "Relaciones y Matrices: Tratamiento multifuente (gastos vs ingresos) y modelado estrella.",
            "DAX Intermedio: SUM, AVERAGE, CALCULATE aplicados a rentabilidad y ROI.",
            "Compartición: Despliegue seguro de paneles conectados a datos de mercado/bancos.",
          ],
        },
        {
          id: "n2-sql",
          title: "SQL Server: Joins Avanzados y Auditoría",
          hours: 16,
          subtitle: "16h · Contenido aplicado a inversiones",
          icon: "sql",
          topics: [
            "Joins Técnicos: Uso de FULL y RIGHT JOIN para detectar descuadres contables.",
            "Agrupaciones Temporales: GROUP BY y SUM() para reportes por trimestre o periodo.",
            "Requerimientos Complejos: Cruces multiobjeto para cálculos de impuestos y márgenes.",
            "Preprocesamiento: Preparación asistida por IA de datasets para análisis predictivo.",
          ],
        },
        {
          id: "n2-py",
          title: "Python: Visualizaciones e Índices Financieros",
          hours: 16,
          subtitle: "16h · Contenido aplicado a inversiones",
          icon: "trending",
          topics: [
            "Pandas Intermedio: Summarización de portafolios (.agg) y manejo de series de tiempo.",
            "Matplotlib: Análisis de rendimientos históricos con personalización técnica de ejes.",
            "Gráficos con Seaborn: Distribuciones estéticas de riesgo y correlación de activos.",
            "Automatización IA: Conciliación automática de múltiples fuentes bancarias vía scripts.",
          ],
        },
      ],
    },
    {
      id: "nivel3",
      label: "Nivel III: Avanzado",
      shortLabel: "Predictividad (16h)",
      theme: "#1D4ED8",
      intro:
        "Crea sistemas robustos e inteligentes: automatiza el servidor, evalúa escenarios What-if y construye algoritmos predictivos de inversión.",
      modules: [
        {
          id: "n3-pbi",
          title: "Power BI: Inteligencia de Tiempo y RLS Seguro",
          hours: 16,
          subtitle: "16h · Especialización de alto nivel",
          icon: "star",
          topics: [
            "Inteligencia de Tiempo: Funciones acumuladas (YTD/QTD) para balances consolidados.",
            "Análisis What-if: Parámetros técnicos para escenarios contables y botones de navegación.",
            "Seguridad Transaccional: Implementación de RLS (Seguridad a nivel de fila) por área.",
            "Copilot & Smart Narratives: Explicación automática de anomalías en flujos de efectivo.",
          ],
        },
        {
          id: "n3-sql",
          title: "SQL Server: Procedimientos y Automatización",
          hours: 16,
          subtitle: "16h · Especialización de alto nivel",
          icon: "bot",
          topics: [
            "Condicionales CASE WHEN: Categorización técnica de clientes por nivel de riesgo.",
            "Stored Procedures: Rutinas (CREATE PROC) para poblar automáticamente reportes diarios.",
            "Modificación Estructural: ALTER TABLE y ajustes de formatos financieros históricos.",
            "Flujo End-to-End: Integración SQL/Python para proyecciones presupuestarias reales.",
          ],
        },
        {
          id: "n3-py",
          title: "Python: Análisis Predictivo y Dashboards Plotly",
          hours: 16,
          subtitle: "16h · Especialización de alto nivel",
          icon: "bot",
          topics: [
            "Unión de Datos Maestros: Integración con pd.merge() y cálculo de ratios (ROI, EBITDA).",
            "Dashboards Interactivos: Dominio de Plotly para análisis profundo de riesgos y carteras.",
            "Calidad Directiva: Uso de Plotnine (ggplot) para gráficos de alta calidad corporativa.",
            "Algoritmo Predictivo: Construcción de proyecto final analizando escenarios macroeconómicos.",
          ],
        },
      ],
    },
  ],
};
