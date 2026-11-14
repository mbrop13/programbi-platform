import type { Guia } from "@/lib/guias/tipos";

export type IlustracionGuia = {
  src: string;
  width: 1280;
  height: 720;
  alt: string;
  caption: string;
  kicker: string;
};

const ILUSTRACIONES = {
  claudeDatos: {
    src: "/images/guias/claude-analisis-datos.webp",
    width: 1280 as const,
    height: 720 as const,
    alt: "Flujo de análisis de datos con Claude AI: de hojas Excel y archivos CSV hacia análisis estructurado e indicadores KPI verificados",
    caption: "De Excel y CSV a tablas e indicadores verificables con Claude.",
    kicker: "Claude + Datos",
  },
  claudeOficina: {
    src: "/images/guias/claude-productividad-oficina.webp",
    width: 1280 as const,
    height: 720 as const,
    alt: "Flujo con Claude para oficina: Projects con base documental, prompt de cuatro partes y control humano sobre informes y presentaciones",
    caption: "Projects reutilizables + prompt en 4 partes (Rol, Contexto, Tarea y Formato).",
    kicker: "Productividad con Claude",
  },
  copilotFlujos: {
    src: "/images/guias/ia-copilot-flujos.webp",
    width: 1280 as const,
    height: 720 as const,
    alt: "Automatización de flujos de trabajo con inteligencia artificial: correos y planillas conectados a decisiones automáticas e informes validados",
    caption: "Automatización paso a paso desde planillas y correos hacia reportes listos.",
    kicker: "Automatización e IA",
  },
  stackBi: {
    src: "/images/guias/stack-datos-bi-sql-python.webp",
    width: 1280 as const,
    height: 720 as const,
    alt: "Arquitectura moderna de datos: SQL Server para consultas limpias, Python con Pandas para automatización y Power BI para tableros ejecutivos",
    caption: "El circuito completo: SQL Server extrae, Python automatiza y Power BI decide.",
    kicker: "Arquitectura BI",
  },
  excelCarrera: {
    src: "/images/guias/excel-access-carrera-bi.webp",
    width: 1280 as const,
    height: 720 as const,
    alt: "Ruta profesional de analista de datos: evolución desde Excel aplicado y Access hacia modelo estrella en Power BI, certificación PL-300 y crecimiento salarial",
    caption: "Ruta práctica desde planillas operativas hasta modelado estrella y tableros pro.",
    kicker: "Carrera y Fundamentos",
  },
  mercadoMl: {
    src: "/images/guias/mercado-financiero-ml.webp",
    width: 1280 as const,
    height: 720 as const,
    alt: "Panel cuantitativo de Machine Learning y análisis financiero con backtesting, métricas AUC y variables explicativas",
    caption: "Series históricas, backtesting y evaluación cuantitativa con Python y Scikit-learn.",
    kicker: "Quant & ML",
  },
} satisfies Record<string, IlustracionGuia>;

/**
 * Ilustración editorial 16:9 asignada a cada guía según su curso e intención
 * (`analisis-de-datos`, oficina, carrera/sueldos/certificación, SQL/Python/BI, ML).
 */
export function ilustracionDeGuia(
  guia: Pick<Guia, "course" | "slug" | "layout">
): IlustracionGuia {
  const { course, slug, layout } = guia;

  if (course === "claude") {
    return slug.includes("analisis-de-datos")
      ? ILUSTRACIONES.claudeDatos
      : ILUSTRACIONES.claudeOficina;
  }

  if (course === "copilot" || course === "power-automate" || course === "ia-productividad") {
    return ILUSTRACIONES.copilotFlujos;
  }

  if (course === "machine-learning" || course === "mercado-financiero") {
    return ILUSTRACIONES.mercadoMl;
  }

  if (
    course === "excel" ||
    course === "access" ||
    course === "general" ||
    layout === "sueldos" ||
    layout === "certificacion" ||
    slug.includes("vs-excel") ||
    slug.includes("sueldo") ||
    slug.includes("trabajo") ||
    slug.includes("certificacion")
  ) {
    return ILUSTRACIONES.excelCarrera;
  }

  return ILUSTRACIONES.stackBi;
}

/** Cuenta palabras visibles del cuerpo Markdown sin sintaxis de enlaces ni tags HTML. */
export function palabrasDeGuia(body: string): number {
  const plano = body
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/```[\s\S]*?```/g, " codigo ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`|-]/g, " ")
    .trim();
  if (!plano) return 0;
  return plano.split(/\s+/).filter(Boolean).length;
}

/** Estima tiempo de lectura en minutos (200 palabras/min en español técnico). */
export function tiempoLecturaMinutos(body: string): number {
  const palabras = palabrasDeGuia(body);
  return Math.max(2, Math.round(palabras / 200));
}
