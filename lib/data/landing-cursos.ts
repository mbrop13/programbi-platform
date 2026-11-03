/**
 * Copy de las landings /curso-sql-online y /curso-python.
 *
 * Todo lo que se afirma aquí sale del catálogo (`lib/data/courses.ts` y
 * `lib/data/syllabuses/*`), de `lib/paises/*` o de la configuración del sitio.
 * No hay precios, fechas, horarios ni casos de clientes inventados. La
 * integración con el contenido por país de P8 y con la plantilla de P9 queda
 * documentada en `docs/p14-landings-sql-python.md`.
 */

export type UsoLanding = {
  title: string;
  body: string;
};

export type LandingCursoCopy = {
  path: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  kicker: string;
  h1: string;
  lead: string;
  audience: string;
  intro: string;
  usos: UsoLanding[];
  faqs: { q: string; a: string }[];
};

export const LANDING_CURSOS = {
  "curso-sql-online": {
    path: "/curso-sql-online",
    slug: "sql-server",
    seoTitle: "Curso SQL online en vivo en Chile | ProgramBI",
    seoDescription:
      "Curso SQL online en vivo en Chile: SELECT, JOINs, GROUP BY, vistas y procedimientos almacenados. 20 horas por nivel, con grabaciones.",
    kicker: "Curso SQL online · Chile",
    h1: "Curso SQL online en vivo en Chile",
    lead:
      "Aprende a consultar bases SQL Server con tus propias consultas: SELECT, WHERE, JOINs, GROUP BY, vistas y procedimientos almacenados. Clases en vivo por Zoom, 20 horas por nivel.",
    audience:
      "Para analistas que salen de Excel y necesitan extraer datos de bases SQL Server con consultas propias, sin depender de TI para cada reporte.",
    intro:
      "El curso abierto (Básico-Intermedio) cubre SELECT, WHERE, filtros, INNER/LEFT JOIN, GROUP BY, ORDER BY, cruces de varias tablas y una introducción a IA aplicada a SQL. El nivel avanzado suma vistas complejas, tablas de reportes, procedimientos almacenados y un trabajo final aplicado. Se trabaja sobre SQL Server y T-SQL.",
    usos: [
      {
        title: "Reportes de ventas y stock",
        body:
          "Cruza ventas, productos y clientes con INNER/LEFT JOIN, GROUP BY y columnas calculadas para responder preguntas de negocio.",
      },
      {
        title: "Conciliaciones y control de gestión",
        body:
          "Usa filtros por fecha, ORDER BY, SUM y cruces de varias tablas para comparar períodos y detectar diferencias.",
      },
      {
        title: "Reportes reutilizables",
        body:
          "Crea vistas, tablas de reportes y procedimientos almacenados para dejar consultas reutilizables.",
      },
    ],
    faqs: [
      {
        q: "¿Necesito saber programar para tomar el curso SQL?",
        a: "No. El curso abierto (Básico-Intermedio) parte desde SELECT, WHERE y filtros, y sigue con JOINs, GROUP BY y cruces de tablas; el nivel avanzado cubre vistas complejas y procedimientos almacenados.",
      },
      {
        q: "¿Qué herramientas se usan?",
        a: "SQL Server y T-SQL. El temario incluye SELECT, WHERE, JOINs, GROUP BY, ORDER BY, vistas, tablas de reportes, procedimientos almacenados y un trabajo final aplicado.",
      },
      {
        q: "¿Entregan certificado?",
        a: "Sí. Al completar el curso recibes un certificado digital de ProgramBI y acceso a las grabaciones en el campus virtual.",
      },
      {
        q: "¿El curso es para empresas?",
        a: "El curso abierto es cupo individual. Para cotizar los niveles de un equipo, usa la vista de empresas de la ficha del curso.",
      },
    ],
  },
  "curso-python": {
    path: "/curso-python",
    slug: "python",
    seoTitle: "Curso Python para datos online en Chile | ProgramBI",
    seoDescription:
      "Curso Python para datos online en vivo en Chile: fundamentos, Pandas, Matplotlib, Seaborn y Plotly. 20 horas por nivel, con grabaciones.",
    kicker: "Curso Python para datos · Chile",
    h1: "Curso Python para datos online en vivo en Chile",
    lead:
      "Aprende Python aplicado al análisis de datos: fundamentos, Pandas, visualización con Matplotlib y Seaborn, y automatización de reportes. Clases en vivo por Zoom, 20 horas por nivel.",
    audience:
      "Para profesionales que quieren analizar datos con Python y Pandas, sin un programa de ciencia de datos de meses.",
    intro:
      "El curso abierto (Básico-Intermedio) parte desde variables, tipos de datos, listas, tuplas, conjuntos y diccionarios, y sigue con Pandas, groupby, filtros, Matplotlib y Seaborn. El nivel avanzado cubre Plotnine, merge, Plotly y un proyecto aplicado. Está enfocado en análisis de datos, no en desarrollo de software genérico.",
    usos: [
      {
        title: "Limpieza y consolidación",
        body:
          "Carga archivos Excel con Pandas, filtra filas, transforma tipos y combina DataFrames para dejar una base de análisis consistente.",
      },
      {
        title: "Análisis y visualización",
        body:
          "Resume datos con groupby y agg, y crea gráficos con Matplotlib, Seaborn y Plotly.",
      },
      {
        title: "Automatización de reportes",
        body:
          "Usa Python e IA para generar extractores de datos y reportes repetibles desde servidores, web o APIs.",
      },
    ],
    faqs: [
      {
        q: "¿Necesito saber programar para tomar el curso Python?",
        a: "No. El curso abierto (Básico-Intermedio) parte desde variables, tipos de datos y estructuras básicas, y sigue con Pandas, groupby y visualización; el nivel avanzado cubre Plotnine, Plotly y un proyecto aplicado.",
      },
      {
        q: "¿Qué herramientas se usan?",
        a: "Python, Pandas, Matplotlib, Seaborn y Plotly. El temario incluye carga desde Excel, filtros, groupby, merge, visualización y un proyecto aplicado.",
      },
      {
        q: "¿Entregan certificado?",
        a: "Sí. Al completar el curso recibes un certificado digital de ProgramBI y acceso a las grabaciones en el campus virtual.",
      },
      {
        q: "¿El curso es para empresas?",
        a: "El curso abierto es cupo individual. Para cotizar los niveles de un equipo, usa la vista de empresas de la ficha del curso.",
      },
    ],
  },
} satisfies Record<string, LandingCursoCopy>;

export type LandingCursoPath = keyof typeof LANDING_CURSOS;
