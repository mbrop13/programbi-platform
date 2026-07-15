import type { CourseSyllabusData } from "./types";

export const excelSyllabus: CourseSyllabusData = {
  slug: "excel",
  accent: "#107C41",
  programYear: "2026",
  levels: [
    {
      id: "nivel1",
      label: "Nivel I: Básico",
      shortLabel: "Fundamentos (16h)",
      theme: "#107C41",
      audience:
        "Administrativos principiantes o con conocimientos mínimos de Excel que realizan tareas diarias simples como ingreso de datos, organización de listas y cálculos básicos en informes.",
      benefits: [
        "Manejo eficiente de datos y reducción de errores.",
        "Automatización de cálculos básicos.",
        "Visualización clara con gráficos simples.",
        "Organización rápida de información.",
        "Aumento de productividad diaria.",
        "Base sólida para niveles avanzados.",
      ],
      modules: [
        {
          id: "n1-1",
          title: "Introducción a Excel y Entorno de Trabajo (2 horas)",
          hours: 2,
          topics: [
            "Interfaz de usuario: barras de herramientas, hojas de cálculo y navegación.",
            "Creación y guardado de archivos.",
            "Configuración básica para informes administrativos.",
          ],
        },
        {
          id: "n1-2",
          title: "Ingreso y Manejo de Datos (3 horas)",
          hours: 3,
          topics: [
            "Tipos de datos: texto, números, fechas.",
            "Formateo de celdas y tablas.",
            "Importación de datos desde archivos externos (CSV, texto).",
            "Ejercicios: Automatización simple de listas diarias.",
          ],
        },
        {
          id: "n1-3",
          title: "Fórmulas y Funciones Básicas (4 horas)",
          hours: 4,
          topics: [
            "Operadores aritméticos y referencias de celdas.",
            "Funciones esenciales: SUMA, PROMEDIO, CONTAR, MAX, MIN.",
            "Uso de fórmulas para cálculos automáticos en informes.",
            "Ejercicios: Cálculo de totales en reportes diarios.",
          ],
        },
        {
          id: "n1-4",
          title: "Gráficos y Visualización de Datos (3 horas)",
          hours: 3,
          topics: [
            "Creación de gráficos básicos (barras, líneas, pastel).",
            "Formateo de gráficos para informes claros.",
            "Inserción de gráficos en hojas de trabajo.",
            "Ejercicios: Visualización de datos administrativos.",
          ],
        },
        {
          id: "n1-5",
          title: "Herramientas de Organización y Filtros (2 horas)",
          hours: 2,
          topics: [
            "Ordenamiento y filtros básicos.",
            "Uso de tablas dinámicas para resúmenes simples.",
            "Protección de hojas y celdas.",
          ],
        },
        {
          id: "n1-6",
          title: "Revisión y Proyecto Final (2 horas)",
          hours: 2,
          icon: "star",
          highlight: true,
          topics: [
            "Repaso de conceptos.",
            "Proyecto: Automatización de un informe diario básico (e.g., registro de gastos).",
          ],
        },
      ],
    },
    {
      id: "nivel2",
      label: "Nivel II: Intermedio",
      shortLabel: "Análisis & Tablas (16h)",
      theme: "#7C3AED",
      audience:
        "Administrativos con conocimientos básicos que manejan volúmenes moderados de datos y necesitan automatizar resúmenes mensuales o búsquedas complejas.",
      benefits: [
        "Domina funciones lógicas y de búsqueda.",
        "Generación de resúmenes interactivos.",
        "Integración de fechas y texto avanzado.",
        "Seguridad en archivos compartidos.",
        "Mayor eficiencia en procesos diarios.",
      ],
      modules: [
        {
          id: "n2-1",
          title: "Fórmulas Avanzadas y Referencias (3 horas)",
          hours: 3,
          topics: [
            "Referencias absolutas, relativas y mixtas.",
            "Funciones lógicas: SI, Y, O.",
            "Funciones de búsqueda: BUSCARV, BUSCARH.",
            "Ejercicios: Automatización de búsquedas en bases de datos administrativas.",
          ],
        },
        {
          id: "n2-2",
          title: "Manejo de Datos Grandes (3 horas)",
          hours: 3,
          topics: [
            "Validación de datos y listas desplegables.",
            "Consolidación de datos de múltiples hojas.",
            "Uso de filtros avanzados y subtotales.",
            "Ejercicios: Organización de informes diarios con validaciones.",
          ],
        },
        {
          id: "n2-3",
          title: "Tablas Dinámicas (4 horas)",
          hours: 4,
          topics: [
            "Creación y configuración de tablas dinámicas.",
            "Agrupamiento, cálculos y campos calculados.",
            "Gráficos dinámicos para visualización interactiva.",
            "Ejercicios: Automatización de resúmenes en reportes administrativos.",
          ],
        },
        {
          id: "n2-4",
          title: "Funciones de Fecha, Texto y Matemáticas (3 horas)",
          hours: 3,
          topics: [
            "Funciones de fecha: HOY, FECHA, DIASEM.",
            "Funciones de texto: CONCATENAR, IZQUIERDA, DERECHA.",
            "Funciones matemáticas avanzadas: REDONDEAR, SUMAR.SI.",
            "Ejercicios: Automatización de cálculos temporales en informes.",
          ],
        },
        {
          id: "n2-5",
          title: "Colaboración y Seguridad (2 horas)",
          hours: 2,
          topics: [
            "Compartir archivos y control de versiones.",
            "Protección avanzada y contraseñas.",
            "Integración con otros programas de Office.",
          ],
        },
        {
          id: "n2-6",
          title: "Proyecto Final y Revisión (1 hora)",
          hours: 1,
          icon: "star",
          highlight: true,
          topics: [
            "Proyecto: Automatización de un informe intermedio.",
            "Discusión de casos reales administrativos.",
          ],
        },
      ],
    },
    {
      id: "nivel3",
      label: "Nivel III: Avanzado",
      shortLabel: "Macros & PQ (16h)",
      theme: "#EA580C",
      audience:
        "Administrativos experimentados que gestionan grandes volúmenes de datos y requieren automatización completa con Macros y Power Query.",
      benefits: [
        "Automatización absoluta con macros y VBA.",
        "Limpieza masiva con Power Query.",
        "Dashboards interactivos en tiempo real.",
        "Autonomía total de IT.",
        "Optimización crítica de reportes.",
      ],
      modules: [
        {
          id: "n3-1",
          title: "Funciones Avanzadas y Matrices (3 horas)",
          hours: 3,
          topics: [
            "Funciones de matriz: SUMAPRODUCTO, INDICE, COINCIDIR.",
            "Fórmulas anidadas y condicionales complejas.",
            "Uso de nombres definidos para automatización.",
          ],
        },
        {
          id: "n3-2",
          title: "Power Query para Importación y Limpieza (4 horas)",
          hours: 4,
          topics: [
            "Introducción a Power Query.",
            "Transformaciones: filtrado, combinación y limpieza.",
            "Automatización de consultas recurrentes.",
          ],
        },
        {
          id: "n3-3",
          title: "Macros y VBA Básico (4 horas)",
          hours: 4,
          topics: [
            "Grabación de macros para tareas repetitivas.",
            "Introducción a VBA: editor, variables, bucles.",
            "Creación de macros personalizadas.",
          ],
        },
        {
          id: "n3-4",
          title: "Análisis Avanzado y Dashboards (3 horas)",
          hours: 3,
          topics: [
            "Creación de dashboards interactivos con slicers.",
            "Uso de Power Pivot para modelado de datos.",
            "Análisis de escenarios y solver.",
          ],
        },
        {
          id: "n3-5",
          title: "Automatización Avanzada y Seguridad (1 hora)",
          hours: 1,
          topics: [
            "Integración con bases de datos externas.",
            "Manejo de errores en VBA y depuración.",
            "Mejores prácticas de seguridad.",
          ],
        },
        {
          id: "n3-6",
          title: "Proyecto Final y Casos Reales (1 hora)",
          hours: 1,
          topics: [
            "Proyecto: Automatización completa de un informe diario.",
            "Análisis de casos administrativos reales.",
          ],
        },
        {
          id: "n3-ai",
          title: "IA aplicada a Excel (Próximamente 2026)",
          icon: "star",
          highlight: true,
          topics: [
            "Próximamente integraremos Copilot y herramientas de IA para la generación automática de Macros, fórmulas complejas y análisis de datos avanzado.",
          ],
        },
      ],
    },
  ],
};
