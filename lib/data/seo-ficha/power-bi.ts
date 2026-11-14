import type { BloqueSeoFicha } from "./tipos";
import { textoCuotas } from "@/config/cuotas";
import { ISO_CHILE } from "@/config/paises";
import { HORA_CLASE_CHILE } from "@/lib/paises/horarios";

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
      "El programa está organizado en dos niveles de 20 horas —Básico-Intermedio y Avanzado— con módulos progresivos. Estos son los contenidos reales, en el orden en que se dictan.",
    ],
    bullets: [
      "Básico-Intermedio · Introducción y conexión de fuentes: instalación, Power BI Desktop, importar datos, explorar informes, filtros, limpieza y columnas calculadas con Power Query.",
      "Básico-Intermedio · Visualizaciones, dashboards e IA: distribución, mapas con saturación de color, pastel, dispersión, medidores, tablas, tarjetas, KPIs, Q&A en lenguaje natural e insights automáticos.",
      "Básico-Intermedio · Power Query avanzado: gráficos personalizados, Unpivot Columns, editor avanzado y selector de métricas con SWITCH y VALUES.",
      "Básico-Intermedio · DAX y relaciones: relaciones entre tablas y roles con filtros; CALCULATE, FILTER, LOOKUPVALUE y EARLIER; tabla de medidas, títulos dinámicos con SELECTEDVALUE y formato condicional.",
      "Básico-Intermedio · Compartir paneles e IA: publicación en Power BI Service, permisos para la organización, caso práctico con datos del Banco Central y apoyo de IA para medidas DAX.",
      "Avanzado · Inteligencia de tiempo: YTD, QTD y MTD, DATEADD, SAMEPERIODLASTYEAR, metas con ISINSCOPE y ranking con RANKX.",
      "Avanzado · Tooltips, botones y drillthrough: tooltips dinámicos, segmentadores con GENERATESERIES y SUMMARIZE, botones, marcadores y detalle por clic.",
      "Avanzado · Seguridad y DAX: RLS, relaciones inactivas con USERELATIONSHIP y segmentación de vistas por usuario.",
      "Avanzado · IA con Fabric: Copilot para medidas DAX, Smart Narratives y análisis predictivo.",
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
      `Pago: el arancel vigente de tu país y las ${textoCuotas(ISO_CHILE)} están en el PDF de temario y precios del curso.`,
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
