import type { CourseSyllabusData } from "./types";

export const powerBiSyllabus: CourseSyllabusData = {
  slug: "power-bi",
  accent: "#F2C811",
  programYear: "2026",
  levels: [
    {
      id: "nivel1",
      label: "Nivel I: Básico",
      shortLabel: "Fundamentos (16h)",
      theme: "#1890FF",
      audience:
        "Este curso es ideal para principiantes que desean aprender Power BI desde cero, enfocándose en los fundamentos para automatizar reportes básicos y procesos de análisis de datos en sus empresas.",
      benefits: [
        "Apoyar decisiones básicas con informes simples.",
        "Informes para sector financiero industrial.",
        "Automatización manual de Excel.",
        "Alta demanda en el mercado laboral.",
        "Conexión a SQL y APIs.",
        "Compartir informes en línea.",
      ],
      modules: [
        {
          id: "n1-1",
          title: "Introducción a Power BI (2 horas)",
          hours: 2,
          topics: [
            "¿Qué es Power BI?",
            "¿Qué aprenderemos durante el curso?",
            "Obteniendo tu cuenta de Power BI.",
            "Instalaciones necesarias.",
          ],
        },
        {
          id: "n1-2",
          title: "Conectando Fuentes de Datos a Power BI (6 horas)",
          hours: 6,
          topics: [
            "Importando Datos de Muestra.",
            "Explorando Conjuntos de Datos, Informes y Paneles.",
            "Creando Informes y Explorando tipos de Visualizaciones.",
            "Creando Visualizaciones de Barras y Columnas.",
            "Utilizando Filtros sobre los paneles.",
            "Visualizaciones de una Página del Informe de Power BI.",
            "Creando Gráficas de líneas.",
            "Power Query para realizar limpiezas de datos básicas.",
            "Cálculos y fórmulas simples de Power Query.",
            "Insertando columnas y filas nuevas con cálculos a la medida.",
          ],
        },
        {
          id: "n1-3",
          title: "Visualizaciones Básicas y Dashboards Iniciales (6 horas)",
          hours: 6,
          topics: [
            "Guardando y Editando un Informe.",
            "Creando una Gráfica de Distribución.",
            "Utilizando Gráficos de Mapa y Saturación de Color.",
            "Agregar Gráficas de Pastel y Utilizando Filtros Relacionados.",
            "Gráficas de Dispersión.",
            "Medidores, Tablas y Tarjetas.",
            "Creación de KPIs básicos para visualizarlos en el dashboard.",
          ],
        },
        {
          id: "n1-4",
          title: "Introducción a IA en Power BI (2 horas)",
          hours: 2,
          icon: "star",
          highlight: true,
          topics: [
            "Exploración de características AI básicas: Uso de Q&A natural language para consultas simples en dashboards.",
            "Ejemplos de insights automáticos generados por Power BI para detectar tendencias en datos básicos.",
          ],
        },
      ],
    },
    {
      id: "nivel2",
      label: "Nivel II: Intermedio",
      shortLabel: "Análisis y DAX (16h)",
      theme: "#7C3AED",
      audience:
        "Ideal para alumnos con conocimiento básico en Power BI, que desean aprender más herramientas de análisis de datos, enfocándose en técnicas intermedias para mejorar visualizaciones y una introducción a DAX.",
      benefits: [
        "Informes dinámicos con interacciones avanzadas.",
        "Reducción de tiempo en procesos de Excel.",
        "Demanda creciente en data analytics.",
        "Compartir informes con seguridad.",
      ],
      modules: [
        {
          id: "n2-1",
          title: "Visualizaciones Intermedias y Power Query Avanzado (6 horas)",
          hours: 6,
          topics: [
            "Gráficas de Barras con Saturación de Color y Colores Personalizados.",
            "Importando Gráficos desde la Tienda de Office.",
            "Anclando Visualizaciones a un nuevo Panel.",
            "Agregando Imágenes, Texto y Reacomodando un Panel.",
            "Modo de Enfoque, Detalles e Información Relacionada.",
            "Tratamiento inicial de matrices usando Unpivot Columns.",
            "Replicar consultas usando el editor avanzado.",
            "Tabla de métricas y selector de métricas (SWITCH, VALUES).",
          ],
        },
        {
          id: "n2-2",
          title: "Introducción a DAX y Relaciones (5 horas)",
          hours: 5,
          topics: [
            "Introducción a cálculos con DAX (Data Analysis Expressions).",
            "Administrando Relaciones entre Tablas.",
            "Creando Roles con Filtros de Datos.",
            "Asignando Personas a los Roles.",
            "Demostrando Filtros y Seguridad.",
            "Títulos dinámicos (SELECTEDVALUE).",
            "Tabla de Medidas.",
            "Completar valores (LOOKUPVALUE, EARLIER, FILTER).",
            "Formato Condicional en base a medidas.",
          ],
        },
        {
          id: "n2-3",
          title: "Compartiendo Paneles e Informes Intermedios (3 horas)",
          hours: 3,
          topics: [
            "Compartiendo un Panel con Personas de la Organización.",
            "Compartiendo un Reporte en Línea.",
            "Conexión al Banco Central (ejemplos prácticos).",
          ],
        },
        {
          id: "n2-4",
          title: "Integración de IA Intermedia (2 horas)",
          hours: 2,
          icon: "star",
          highlight: true,
          topics: [
            "Uso de IA para crear medidas en DAX y visualizaciones que apoyan la toma de decisiones.",
          ],
        },
      ],
    },
    {
      id: "nivel3",
      label: "Nivel III: Avanzado",
      shortLabel: "Avanzado & AI (16h)",
      theme: "#EA580C",
      audience:
        "Este curso avanzado profundiza en funciones complejas de DAX, integraciones externas y seguridad, perfecto para profesionales que buscan optimizar dashboards predictivos y automatizados.",
      benefits: [
        "Toma de decisiones avanzadas con análisis predictivos.",
        "Automatización completa con herramientas externas.",
        "Alta demanda en data science.",
        "Seguridad y roles personalizados.",
        "Integración con IA.",
      ],
      modules: [
        {
          id: "n3-1",
          title: "Inteligencia de Tiempo y Funciones Avanzadas (4 horas)",
          hours: 4,
          topics: [
            "Funciones Acumuladas en el tiempo (YTD, QTD, MTD).",
            "Funciones para cálculos diferidos (DATEADD, SAMEPERIODLASTYEAR).",
            "Relaciones con tablas de Metas.",
            "Prorrateo de Metas (ISINSCOPE, ENDOFMONTH).",
            "Importar Matrices, Ranking de elementos (RANKX).",
            "Uso de Parámetros (What if).",
          ],
        },
        {
          id: "n3-2",
          title: "Google Drive, Tooltips y Segmentadores Avanzados (4 horas)",
          hours: 4,
          topics: [
            "Importación de Gráficos de la Tienda. Uso del gráfico PlayAxis.",
            "Tooltip Dinámico, Construcción de Segmentadores de totalizados (GENERATESERIES, SUMMARIZE, MINX, MAXX, Variables).",
          ],
        },
        {
          id: "n3-3",
          title: "Botones, Marcadores y Drillthrough (3 horas)",
          hours: 3,
          topics: [
            "Construcción de Botones y textos dinámicos, URLs.",
            "Gráficos de Imágenes, uso de Marcadores.",
            "Propiedad de Drillthrough y alcances.",
          ],
        },
        {
          id: "n3-4",
          title: "Relaciones Duales, Seguridad y Roles, Sintáxis DAX (2 horas)",
          hours: 2,
          topics: [
            "Uso de relaciones inactivas (USERELATIONSHIP).",
            "Reglas de Seguridad a Nivel de Filas (RLS).",
            "Segmentación de vistas por usuario conectado.",
            "Uso de Sintáxis DAX y Tablas No Relacionadas.",
          ],
        },
        {
          id: "n3-5",
          title: "Integración Avanzada de IA en Power BI (3 horas)",
          hours: 3,
          icon: "star",
          highlight: true,
          topics: [
            "Uso de Copilot para generar consultas DAX automáticas y narrativas inteligentes.",
            "Visuales AI avanzados: Smart Narratives y Predictive Analytics con integración a Microsoft Fabric.",
            "Exploración de anomalías y tendencias con Automated Insights.",
          ],
        },
      ],
    },
  ],
};
