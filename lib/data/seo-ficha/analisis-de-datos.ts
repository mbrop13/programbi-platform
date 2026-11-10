import type { BloqueSeoFicha } from "./tipos";

/**
 * Bloques extra de la ficha de Análisis de datos (Chile).
 * Cada afirmación sale de lib/data/syllabuses/analisis-de-datos.ts,
 * config/pricing.ts, config/cuotas.ts o de las guías ya publicadas. No
 * inventar métricas de empleo ni sueldos.
 */
export const BLOQUES_ANALISIS_DE_DATOS: BloqueSeoFicha[] = [
  {
    eyebrow: "Qué se aprende en cada nivel",
    titulo: "Las 60 horas, materia por materia",
    parrafos: [
      "El nivel básico-intermedio recorre las tres herramientas con la misma carga: 20 horas de SQL Server, 20 de Power BI y 20 de Python. Las tres pesan lo mismo en el programa y cada módulo usa IA como apoyo para generar y revisar código.",
      "El avanzado repite la estructura de 60 horas, pero cambia el foco: menos sintaxis desde cero y más automatización, gobierno del tablero y modelos que se sostienen con datos de la empresa. Los dos niveles juntos suman las 120 horas del programa.",
    ],
    bullets: [
      "SQL Server, 20 h: SELECT, WHERE, JOIN (INNER, LEFT, RIGHT y FULL), GROUP BY/HAVING, vistas de valorización y consultas revisadas con IA. El avanzado suma CASE WHEN, procedimientos con CREATE PROC y EXECUTE, SELECT INTO, ALTER TABLE y optimización con índices.",
      "Power BI, 20 h: Power Query desde Excel, SQL y APIs; limpieza, columnas calculadas, unpivot y visualizaciones con KPIs; publicación con roles y seguridad. El avanzado entra en DAX de tiempo (YTD, MTD, SAMEPERIODLASTYEAR, RANKX), parámetros what-if, marcadores y RLS por usuario.",
      "Python, 20 h: fundamentos, DataFrames de Pandas desde Excel, groupby, limpieza de tipos y fechas, y gráficos con Matplotlib y Seaborn. El avanzado suma pd.merge, funciones con .apply(), Plotly con sunburst y treemaps, y un proyecto de análisis predictivo.",
      "Los dos niveles usan IA en cada módulo para escribir consultas, scripts y medidas, y para revisarlas. El criterio de negocio sigue siendo del alumno.",
    ],
  },
  {
    eyebrow: "Salida del programa",
    titulo: "Ruta laboral y qué incluye",
    parrafos: [
      "Al terminar el básico-intermedio quedas capaz de consultar una base SQL Server sin pedir el archivo a TI, limpiar y modelar los datos en Power BI y publicar un dashboard con roles. Python entra donde Excel se queda corto: limpiar una planilla desordenada, ordenar fechas y tipos, y repetir el análisis con un script.",
      "La diferencia con un curso suelto de Power BI es el alcance: ese curso son 20 horas por nivel y se concentra en tableros y DAX. Este programa son 60 horas por nivel y suma SQL Server y Python, que es lo que permite extraer el dato y automatizar el reporte, no solo visualizarlo.",
    ],
    bullets: [
      "Certificado digital de ProgramBI al completar y grabaciones de por vida en el campus.",
      "Clases en vivo por Zoom, en horario vespertino, hora de Chile.",
      "Cada nivel de 60 horas se paga en 3 cuotas sin interés con Mercado Pago o Webpay; el arancel vigente está en el PDF de temario y precios del curso.",
      "Puedes hacer el básico-intermedio y decidir después si tomas el avanzado: son niveles separados.",
    ],
    enlaces: [{ href: "/empresas", label: "Cotizar para un equipo" }],
  },
];
