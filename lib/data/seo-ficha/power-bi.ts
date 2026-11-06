import type { BloqueSeoFicha } from "./tipos";
import { textoCuotas } from "@/config/cuotas";
import { PRECIOS_CLP } from "@/config/pricing";
import { formatCLP } from "@/lib/paises/precios";
import { HORA_CLASE_CHILE } from "@/lib/paises/horarios";

const PRECIO = formatCLP(PRECIOS_CLP["power-bi"]);
const CUOTAS = textoCuotas("cl");
const HORARIO = `${HORA_CLASE_CHILE.inicio} a ${HORA_CLASE_CHILE.fin}`;

/**
 * Bloques extra de la ficha de Power BI (Chile).
 * Cada afirmación sale de lib/data/syllabuses/power-bi.ts, config/pricing.ts,
 * config/cuotas.ts o de las guías ya publicadas. No inventar cifras.
 */
export const BLOQUES_POWER_BI: BloqueSeoFicha[] = [
  {
    eyebrow: "Qué se ve en cada clase",
    titulo: "Temario clase por clase",
    parrafos: [
      "El programa está separado en tres niveles —básico, intermedio y avanzado— y cada módulo tiene sus horas asignadas. Estos son los contenidos reales, en el orden en que se dictan.",
    ],
    bullets: [
      "Básico · Introducción (2 h): qué es Power BI, cómo obtener la cuenta y qué instalaciones necesitas.",
      "Básico · Conexión de fuentes (6 h): importar datos, explorar conjuntos e informes, barras, columnas, líneas y filtros; limpieza y columnas calculadas con Power Query.",
      "Básico · Visualizaciones y dashboards (6 h): distribución, mapas con saturación de color, pastel, dispersión, medidores, tablas, tarjetas y KPIs.",
      "Básico · IA (2 h): Q&A en lenguaje natural e insights automáticos para detectar tendencias.",
      "Intermedio · Power Query avanzado (6 h): Unpivot Columns, editor avanzado y selector de métricas con SWITCH y VALUES.",
      "Intermedio · DAX y relaciones (5 h): DAX, relaciones y roles con filtros; CALCULATE, FILTER, LOOKUPVALUE y EARLIER; tabla de medidas, títulos dinámicos con SELECTEDVALUE y formato condicional.",
      "Intermedio · Compartir paneles (3 h): publicación en Power BI Service, permisos para la organización y un caso práctico con datos del Banco Central.",
      "Avanzado · Inteligencia de tiempo (4 h): YTD, QTD y MTD, DATEADD, SAMEPERIODLASTYEAR, metas con ISINSCOPE y ranking con RANKX.",
      "Avanzado · Tooltips, botones y drillthrough (7 h): tooltips dinámicos, segmentadores con GENERATESERIES y SUMMARIZE, botones, marcadores y detalle por clic.",
      "Avanzado · Seguridad y DAX (2 h): RLS, relaciones inactivas con USERELATIONSHIP y segmentación de vistas por usuario.",
      "Avanzado · IA con Fabric (3 h): Copilot para medidas DAX, Smart Narratives y análisis predictivo.",
    ],
  },
  {
    eyebrow: "Entregable y logística",
    titulo: "Proyecto final y cómo se cursa",
    parrafos: [
      "El curso cierra con un proyecto de tablero: eliges un caso, lo limpias con Power Query, lo modelas y lo presentas. La idea es que puedas mostrarlo en una entrevista o usarlo en tu trabajo, no que quede como un ejercicio de clase.",
    ],
    bullets: [
      "Proyecto final: un tablero construido con datos de ejemplo o con tus propios extractos anonimizados, usando Power Query, modelo y DAX.",
      `Horario: dos veces por semana, de ${HORARIO}, hora de Chile; los días exactos dependen de la cohorte.`,
      "Grabaciones: cada clase queda en el campus y puedes verla cuando quieras; no expiran.",
      `Pago: ${PRECIO} CLP, con ${CUOTAS}.`,
      "Certificado: certificado digital de ProgramBI al completar el curso.",
      "Mac: Power BI Desktop es solo para Windows; si usas Mac, sigues el curso con Power BI web desde el navegador.",
    ],
    enlaces: [
      { href: "/precios", label: "Precios y formas de pago" },
      {
        href: "/guias/certificacion-pl-300-power-bi",
        label: "Certificación PL-300: qué evalúa",
      },
    ],
  },
];
