import type { CourseSyllabusData } from "./types";

export const pythonSyllabus: CourseSyllabusData = {
  slug: "python",
  accent: "#306998",
  programYear: "2026",
  levels: [
    {
      id: "nivel1",
      label: "Nivel I: Básico",
      shortLabel: "Fundamentos (16h)",
      theme: "#306998",
      audience:
        "Este curso es ideal para principiantes que desean aprender Python desde cero, enfocándose en conceptos fundamentales para automatizar tareas básicas y manipular datos en entornos empresariales. Dirigido a perfiles administrativos, financieros, comerciales, ingenieros y data analytics.",
      benefits: [
        "Automatización inicial de informes operativos.",
        "Aplicables al sector financiero e industrial.",
        "Alta demanda laboral inicial en datos.",
        "Preparación para análisis tabular simple.",
        "Mejora en toma de decisiones.",
      ],
      modules: [
        {
          id: "n1-1",
          title: "Introducción a Python (4 horas)",
          hours: 4,
          topics: [
            "Objetivo: Familiarizarse con el entorno de Python y los tipos de datos básicos.",
            "Variables y Tipos de Datos: int, float, str.",
            "Operaciones básicas y asignación de variables.",
            "Estructuras de datos: Listas, Tuplas, Conjuntos, Diccionarios.",
            "Entrada y salida de datos con la función input().",
            "Uso de condicionales if/else para control de flujo.",
            "Funciones clave: type(), input(), operadores aritméticos.",
          ],
        },
        {
          id: "n1-2",
          title: "Estructuras de Datos Básicas (4 horas)",
          hours: 4,
          topics: [
            "Objetivo: Profundizar en el manejo de tuplas y conjuntos.",
            "Tuplas: Creación, acceso a elementos, longitud (len()), comparación.",
            "Conjuntos: Creación, adición (add()), eliminación (remove()), pertenencia (in, not in).",
            "Funciones clave: len(), add(), remove(), in, not in.",
          ],
        },
        {
          id: "n1-3",
          title: "Introducción a Pandas (4 horas)",
          hours: 4,
          topics: [
            "Objetivo: Aprender a cargar y explorar datos con Pandas.",
            "DataFrames: Creación a partir de archivos Excel.",
            "Lectura de datos: pd.read_excel().",
            "Exploración básica: df.head(), df.dtypes, df.iloc[].",
            "Selección de columnas.",
            "Librerías: pandas.",
            "Funciones clave: pd.read_excel(), df.head(), df.dtypes, df.iloc[].",
          ],
        },
        {
          id: "n1-4",
          title: "Introducción a IA en Python (4 horas)",
          hours: 4,
          icon: "star",
          highlight: true,
          topics: [
            "Exploración de conceptos fundamentales de Python, generando códigos con IA.",
            "Generación extractores de datos (Servidores, Web, APIs).",
            "Identificar patrones automáticos en conjuntos de datos pequeños.",
          ],
        },
      ],
    },
    {
      id: "nivel2",
      label: "Nivel II: Intermedio",
      shortLabel: "Análisis & Viz (16h)",
      theme: "#059669",
      audience:
        "Este curso construye sobre los fundamentos, enfocándose en manipulación de datos intermedia y visualizaciones básicas para generar informes más complejos en empresas.",
      benefits: [
        "Automatización con filtrados eficientes.",
        "Visualizaciones estructuradas.",
        "Demanda media en analytics.",
        "Integración de cálculos en reportes.",
        "Toma de decisiones gráfica.",
      ],
      modules: [
        {
          id: "n2-1",
          title: "Manipulación y Filtrado con Pandas (4 horas)",
          hours: 4,
          topics: [
            "Objetivo: Manipular y filtrar DataFrames para crear reportes.",
            "Agrupación de datos: df.groupby().",
            "Agregación de datos: .agg(['sum', 'count', 'min', 'max', 'mean']).",
            "Filtrado de filas: Nuevos DataFrames.",
            "Transformación de tipos de datos: .astype().",
            "Conversión de texto a fechas: pd.to_datetime().",
            "Librerías: pandas, datetime.",
            "Funciones clave: groupby, agg, to_datetime.",
          ],
        },
        {
          id: "n2-2",
          title: "Visualización con Matplotlib (4 horas)",
          hours: 4,
          topics: [
            "Objetivo: Crear visualizaciones básicas con Matplotlib.",
            "Gráficos de líneas: plt.plot().",
            "Personalización: xlabel(), ylabel(), title().",
            "Líneas de referencia: plt.axhline().",
            "Librerías: matplotlib.pyplot, numpy.",
          ],
        },
        {
          id: "n2-3",
          title: "Visualización con Seaborn (4 horas)",
          hours: 4,
          topics: [
            "Objetivo: Crear visualizaciones más avanzadas con Seaborn.",
            "Gráficos de líneas: sns.lineplot().",
            "Gráficos de barras: sns.barplot().",
            "Personalización de gráficos.",
            "Librerías: seaborn, matplotlib.pyplot.",
          ],
        },
        {
          id: "n2-4",
          title: "Integración de IA Intermedia (4 horas)",
          hours: 4,
          icon: "star",
          highlight: true,
          topics: [
            "Herramientas IA para automatizaciones medias.",
            "Procesando múltiples fuentes con IA.",
          ],
        },
      ],
    },
    {
      id: "nivel3",
      label: "Nivel III: Avanzado",
      shortLabel: "Data Science & AI (16h)",
      theme: "#7C3AED",
      audience:
        "Este curso avanzado profundiza en visualizaciones interactivas, combinación de datos y proyectos aplicados, perfecto para profesionales que buscan optimizar análisis predictivos.",
      benefits: [
        "Dashboards interactivos predictivos.",
        "Automatización completa.",
        "Alta demanda en data science.",
        "Resolución de problemas de negocio.",
        "Integración total con IA.",
      ],
      modules: [
        {
          id: "n3-1",
          title: "Gráficos con Plotnine (3 horas)",
          hours: 3,
          topics: [
            "Objetivo: Aprender la sintaxis declarativa de Plotnine.",
            "Creación: ggplot() + aes() + geom_line().",
            "Personalización: theme(), element_text().",
            "Librerías: plotnine.",
            "Funciones clave: ggplot, aes, theme.",
          ],
        },
        {
          id: "n3-2",
          title: "Manipulación de DataFrames Compleja (3 horas)",
          hours: 3,
          topics: [
            "Objetivo: Combinar DataFrames y cálculos.",
            "Unión: pd.merge().",
            "Nuevas columnas y .apply().",
            "Librerías: pandas.",
          ],
        },
        {
          id: "n3-3",
          title: "Gráficos Interactivos con Plotly (4 horas)",
          hours: 4,
          topics: [
            "Objetivo: Crear gráficos interactivos con Plotly.",
            "Dispersión, barras, histogramas, tortas.",
            "Sunburst, Treemap, Subgráficos.",
            "Librerías: plotly.express, graph_objects, subplots.",
          ],
        },
        {
          id: "n3-4",
          title: "Proyecto Aplicado (3 horas)",
          hours: 3,
          topics: [
            "Objetivo: Aplicar todo en un proyecto práctico.",
            "Análisis completo de un dataset real.",
            "Creación de informes de negocio.",
          ],
        },
        {
          id: "n3-5",
          title: "Integración Avanzada con IA (3 horas)",
          hours: 3,
          icon: "star",
          highlight: true,
          topics: [
            "Se usará constantemente IA para integrar las mejores herramientas de análisis de datos.",
            "Aplicación de IA para la solución de múltiples problemas de complejidad alta.",
          ],
        },
      ],
    },
  ],
};
