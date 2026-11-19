import type { BloqueSeoFicha } from "./tipos";
import { textoCuotas } from "@/config/cuotas";
import { ISO_CHILE } from "@/config/paises";
import { HORA_CLASE_CHILE } from "@/lib/paises/horarios";

const HORARIO = `${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin}`;

/**
 * Bloques extra de la ficha de Python para Datos (Chile).
 * Cada afirmación sale de lib/data/syllabuses/python.ts, lib/data/courses.ts,
 * config/pricing.ts o config/cuotas.ts. No inventar cifras.
 */
export const BLOQUES_PYTHON: readonly BloqueSeoFicha[] = [
  {
    eyebrow: "Aprendizaje paso a paso",
    titulo: "Python para datos desde cero (sin saber programar)",
    parrafos: [
      "El curso está diseñado para profesionales de finanzas, control de gestión, administración, operaciones e ingeniería que necesitan analizar y automatizar datos en su trabajo sin haber programado antes. Se divide en dos niveles de 20 horas en vivo por Zoom: Básico-Intermedio y Avanzado.",
    ],
    bullets: [
      "Desde cero en el nivel Básico-Intermedio (20 h): entorno de trabajo, variables (int, float, str), operadores, condicionales if/else y estructuras de datos (listas, tuplas, conjuntos y diccionarios).",
      "De Excel a Pandas: carga y exploración de planillas con pd.read_excel(), df.head(), df.dtypes y df.iloc[], transformación de tipos (.astype()), fechas (pd.to_datetime()) y agrupaciones con df.groupby() y .agg().",
      "Visualización e IA aplicada: gráficos de líneas y barras con Matplotlib y Seaborn, más generación y revisión de scripts con apoyo de inteligencia artificial.",
      "Nivel Avanzado (20 h): combinación de fuentes con pd.merge() y funciones con .apply(), gráficos declarativos con Plotnine, visualizaciones interactivas con Plotly (dispersión, sunburst, treemap y subgráficos) y proyecto aplicado.",
    ],
  },
  {
    eyebrow: "Certificación y modalidad",
    titulo: "Certificado, campus virtual y cómo se cursa en Chile",
    parrafos: [
      "Cada clase se dicta en vivo por Zoom con ejercicios guiados sobre conjuntos de datos de negocio, de modo que termines el nivel con scripts reutilizables para limpiar planillas, cruzar archivos y automatizar reportes periódicos.",
    ],
    bullets: [
      "Certificado: recibes el certificado digital de ProgramBI al completar el curso y su proyecto práctico aplicado.",
      `Horario en vivo: dos clases por semana de ${HORARIO} (hora de Chile), con acceso al campus virtual donde quedan las clases grabadas y el material de práctica.`,
      `Arancel y cuotas: el valor vigente de cada nivel de 20 horas, los descuentos y las ${textoCuotas(ISO_CHILE)} se descargan en el PDF de temario y precios de la ficha.`,
      "Continuidad: puedes cursar Python como programa individual o integrarlo con SQL Server y Power BI en la ruta de Análisis de Datos, y luego avanzar hacia Machine Learning.",
    ],
    enlaces: [
      { href: "/cursos/analisis-de-datos", label: "Curso de Análisis de Datos (SQL, Power BI y Python)" },
      { href: "/cursos/machine-learning", label: "Curso de Machine Learning con Python" },
      { href: "/precios", label: "Precios y formas de pago" },
    ],
  },
];
