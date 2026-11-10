/**
 * Activos visuales del brochure: logos de marca, logos de empresas clientes y
 * galerías de capturas reales de clases.
 *
 * Todo apunta a archivos locales dentro de `public/` (same-origin) para que la
 * vista previa, la captura con `html-to-image` y el respaldo en canvas puedan
 * leerlos sin CORS. Este módulo corre en servidor y cliente: no importa React.
 */

export type BrochureBrandLogos = {
  /** Wordmark horizontal grande (PNG con transparencia). */
  main: string;
  /** Wordmark compacto para barras de navegación (WebP). */
  nav: string;
  /** Versión cuadrada para sellos y certificados. */
  square: string;
};

export const BROCHURE_BRAND_LOGOS: BrochureBrandLogos = {
  main: "/images/logo.png",
  nav: "/images/logo-nav.webp",
  square: "/logo.png",
};

export type BrochureCompanyLogo = {
  name: string;
  logoUrl: string;
};

/** Los 12 logos reales de empresas que ya capacitaron equipos con ProgramBI. */
export const BROCHURE_COMPANY_LOGOS: BrochureCompanyLogo[] = [
  { name: "AngloAmerican", logoUrl: "/images/logos/anglo-american.webp" },
  { name: "Deloitte", logoUrl: "/images/logos/deloitte.webp" },
  { name: "Banco de Chile", logoUrl: "/images/logos/banco-chile.webp" },
  { name: "SQM", logoUrl: "/images/logos/sqm.webp" },
  { name: "Cencosud", logoUrl: "/images/logos/cencosud.webp" },
  { name: "BCI", logoUrl: "/images/logos/bci.webp" },
  { name: "Tottus", logoUrl: "/images/logos/tottus.webp" },
  { name: "Midea", logoUrl: "/images/logos/midea.webp" },
  { name: "Pucobre", logoUrl: "/images/logos/pucobre.webp" },
  { name: "Bridgestone", logoUrl: "/images/logos/bridgestone.webp" },
  { name: "Verisure", logoUrl: "/images/logos/verisure.webp" },
  { name: "Fonasa", logoUrl: "/images/logos/fonasa.webp" },
];

export type BrochureGalleryImage = {
  src: string;
  title: string;
  subtitle: string;
};

const GALERIA_POWER_BI: BrochureGalleryImage[] = [
  {
    src: "/images/courses/galeria/power-bi/01.webp",
    title: "Dashboard ejecutivo en Power BI",
    subtitle: "Modelo semántico, medidas DAX y visuales interactivos construidos en vivo.",
  },
  {
    src: "/images/courses/galeria/power-bi/02.webp",
    title: "Modelo de datos estrella",
    subtitle: "Tablas de hechos, dimensiones y relaciones optimizadas para analizar.",
  },
  {
    src: "/images/courses/galeria/power-bi/03.webp",
    title: "Power Query y ETL",
    subtitle: "Limpieza, combinación y transformación de datos reales de negocio.",
  },
  {
    src: "/images/courses/galeria/power-bi/04.webp",
    title: "Informes y storytelling",
    subtitle: "Publicación, permisos y narrativa visual para tomar decisiones.",
  },
];

const GALERIA_PYTHON: BrochureGalleryImage[] = [
  {
    src: "/images/courses/galeria/python/01.webp",
    title: "Análisis con Pandas",
    subtitle: "Carga, limpieza y transformación de datasets reales en Python.",
  },
  {
    src: "/images/courses/galeria/python/02.webp",
    title: "Visualización de datos",
    subtitle: "Matplotlib y Seaborn para explorar y comunicar hallazgos.",
  },
  {
    src: "/images/courses/galeria/python/03.webp",
    title: "Automatización de reportes",
    subtitle: "Scripts que reemplazan horas de trabajo manual repetitivo.",
  },
  {
    src: "/images/courses/galeria/python/04.webp",
    title: "Modelos predictivos",
    subtitle: "Scikit-learn aplicado a casos concretos de negocio.",
  },
];

const GALERIA_SQL: BrochureGalleryImage[] = [
  {
    src: "/images/courses/galeria/sql-server/01.webp",
    title: "Consultas SQL profesionales",
    subtitle: "SELECT, JOINs, funciones de ventana y CTEs sobre datos reales.",
  },
  {
    src: "/images/courses/galeria/sql-server/02.webp",
    title: "Modelo relacional",
    subtitle: "Diseño de tablas, claves e integridad para analizar con confianza.",
  },
  {
    src: "/images/courses/galeria/sql-server/03.webp",
    title: "Vistas y procedimientos",
    subtitle: "Automatización y capas de datos dentro de SQL Server.",
  },
  {
    src: "/images/courses/galeria/sql-server/04.webp",
    title: "Optimización de consultas",
    subtitle: "Índices, planes de ejecución y rendimiento a escala.",
  },
];

const GALERIA_ANALISIS: BrochureGalleryImage[] = [
  {
    src: "/images/courses/galeria/analisis-de-datos/01.webp",
    title: "Del dato a la decisión",
    subtitle: "Dashboards ejecutivos con los KPIs que mira el negocio.",
  },
  {
    src: "/images/courses/galeria/analisis-de-datos/02.webp",
    title: "Exploración y calidad de datos",
    subtitle: "Perfilado, limpieza y validación de fuentes dispersas.",
  },
  {
    src: "/images/courses/galeria/analisis-de-datos/03.webp",
    title: "Análisis estadístico aplicado",
    subtitle: "Tendencias, segmentación y correlaciones con criterio.",
  },
  {
    src: "/images/courses/galeria/analisis-de-datos/04.webp",
    title: "Proyecto integrador",
    subtitle: "Caso completo de punta a punta con datos de la industria.",
  },
];

/** Slugs cuyo stack principal es Power BI / modelado / gestión. */
const STACK_POWER_BI = new Set([
  "power-bi",
  "excel",
  "power-automate",
  "copilot",
  "analitica-mineria",
  "mercado-financiero",
]);
/** Slugs cuyo stack principal es Python / IA aplicada. */
const STACK_PYTHON = new Set([
  "python",
  "machine-learning",
  "ia-productividad",
  "claude",
]);
/** Slugs cuyo stack principal es SQL / bases de datos. */
const STACK_SQL = new Set(["sql-server", "access"]);

/**
 * Devuelve 3–4 capturas reales de clases para el brochure del curso.
 * Los cursos con galería propia la usan; el resto hereda la galería de su
 * stack para que ninguna hoja quede sin imágenes reales.
 */
export function getCourseGalleryForBrochure(slug: string): BrochureGalleryImage[] {
  const normalizado = (slug || "").trim().toLowerCase();
  if (normalizado === "analisis-de-datos") return GALERIA_ANALISIS.slice(0, 4);
  if (normalizado === "power-bi") return GALERIA_POWER_BI.slice(0, 4);
  if (normalizado === "python") return GALERIA_PYTHON.slice(0, 4);
  if (normalizado === "sql-server") return GALERIA_SQL.slice(0, 4);
  if (STACK_PYTHON.has(normalizado)) return GALERIA_PYTHON.slice(0, 3);
  if (STACK_SQL.has(normalizado)) return GALERIA_SQL.slice(0, 3);
  if (STACK_POWER_BI.has(normalizado)) return GALERIA_POWER_BI.slice(0, 3);
  return GALERIA_ANALISIS.slice(0, 3);
}

/** Nombre del archivo PDF que ve el usuario al descargar. */
export function brochurePdfFileName(data: { slug: string; pais: string }): string {
  return `Temario-y-precios_ProgramBI_${data.slug}_${data.pais.toUpperCase()}.pdf`;
}
