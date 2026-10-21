/**
 * Galería de "clases reales" por curso.
 *
 * Las capturas salen de `fotos web/` y se optimizan a WebP de 1280px con
 * `scripts/build-course-gallery.mjs`, que además deduplica por hash y escribe
 * el manifest en `public/images/courses/galeria/manifest.json`.
 *
 * Los rótulos describen lo que se ve en pantalla — son clases reales del
 * programa, no mockups, por eso el copy es literal y no aspiracional.
 */

export type GalleryTool = "Power BI" | "SQL Server" | "Python";

export interface GalleryShot {
  /** Captura optimizada dentro de /public. */
  src: string;
  /** Herramienta visible en la captura. */
  tool: GalleryTool;
  /** Qué se está haciendo en la clase. */
  caption: string;
}

const AD = "/images/courses/galeria/analisis-de-datos";
const BI = "/images/courses/galeria/power-bi";
const PY = "/images/courses/galeria/python";
const SQL = "/images/courses/galeria/sql-server";

export const COURSE_GALLERY: Record<string, GalleryShot[]> = {
  /* Programa completo: SQL Server + Power BI + Python en el mismo curso. */
  "analisis-de-datos": [
    {
      src: `${AD}/01.webp`,
      tool: "Power BI",
      caption: "Segmentación de datos, tarjetas KPI y evolución de ventas",
    },
    {
      src: `${AD}/02.webp`,
      tool: "Power BI",
      caption: "Informe con cascada de ingresos por categoría",
    },
    {
      src: `${AD}/03.webp`,
      tool: "Power BI",
      caption: "Tablero con segmentación y tarjetas de totales",
    },
    {
      src: `${AD}/04.webp`,
      tool: "Power BI",
      caption: "Modelo de datos construido en la vista Modelar",
    },
    {
      src: `${AD}/05.webp`,
      tool: "SQL Server",
      caption: "Consultas con JOIN y CASE para evaluar metas",
    },
    {
      src: `${AD}/06.webp`,
      tool: "SQL Server",
      caption: "Vista de la base de datos y ventas por comuna",
    },
    {
      src: `${AD}/07.webp`,
      tool: "Python",
      caption: "Carga del dataset con Pandas y primer vistazo",
    },
    {
      src: `${AD}/08.webp`,
      tool: "Python",
      caption: "Gráfico de dispersión con Pandas y Seaborn",
    },
    {
      src: `${AD}/09.webp`,
      tool: "Python",
      caption: "Python consultando SQL Server con SQLAlchemy",
    },
  ],

  "power-bi": [
    {
      src: `${BI}/01.webp`,
      tool: "Power BI",
      caption: "Segmentación de datos y tarjetas KPI",
    },
    {
      src: `${BI}/02.webp`,
      tool: "Power BI",
      caption: "Evolución de ventas por categoría y período",
    },
    {
      src: `${BI}/03.webp`,
      tool: "Power BI",
      caption: "Tabla de ventas por segmento y cliente",
    },
    {
      src: `${BI}/04.webp`,
      tool: "Power BI",
      caption: "Venta neta acumulada por cliente",
    },
    {
      src: `${BI}/05.webp`,
      tool: "Power BI",
      caption: "Modelo de datos en la vista Modelar",
    },
    {
      src: `${BI}/06.webp`,
      tool: "Power BI",
      caption: "Cascada de ingresos y participación por categoría",
    },
    {
      src: `${BI}/07.webp`,
      tool: "Power BI",
      caption: "Resumen de ventas en tabla dinámica",
    },
  ],

  python: [
    {
      src: `${PY}/01.webp`,
      tool: "Python",
      caption: "Lectura del CSV con Pandas",
    },
    {
      src: `${PY}/02.webp`,
      tool: "Python",
      caption: "Heatmap de pasajeros con Seaborn",
    },
    {
      src: `${PY}/03.webp`,
      tool: "Python",
      caption: "Agrupación de ventas por local y vendedor",
    },
    {
      src: `${PY}/04.webp`,
      tool: "Python",
      caption: "Consulta a SQL Server con SQLAlchemy",
    },
    {
      src: `${PY}/05.webp`,
      tool: "Python",
      caption: "Gráfico de dispersión con penguins",
    },
    {
      src: `${PY}/06.webp`,
      tool: "Python",
      caption: "Histograma de longitudes por especie",
    },
    {
      src: `${PY}/07.webp`,
      tool: "Python",
      caption: "Treemap de ventas por categoría",
    },
    {
      src: `${PY}/08.webp`,
      tool: "Python",
      caption: "DataFrame desde SQL Server con read_sql",
    },
  ],

  "sql-server": [
    {
      src: `${SQL}/01.webp`,
      tool: "SQL Server",
      caption: "Consultas con JOIN y cálculos de venta",
    },
    {
      src: `${SQL}/02.webp`,
      tool: "SQL Server",
      caption: "Lógica de metas con CASE WHEN",
    },
    {
      src: `${SQL}/03.webp`,
      tool: "SQL Server",
      caption: "Vistas con SUM, JOIN y GROUP BY",
    },
    {
      src: `${SQL}/04.webp`,
      tool: "SQL Server",
      caption: "Primer procedimiento almacenado",
    },
    {
      src: `${SQL}/05.webp`,
      tool: "SQL Server",
      caption: "Vista que cruza pedidos, ítems y productos",
    },
    {
      src: `${SQL}/06.webp`,
      tool: "SQL Server",
      caption: "Diagrama de la base de datos",
    },
    {
      src: `${SQL}/07.webp`,
      tool: "Power BI",
      caption: "Dashboard final construido sobre el modelo SQL",
    },
  ],
};

export function getCourseGallery(slug: string): GalleryShot[] {
  return COURSE_GALLERY[slug] ?? [];
}

export function hasCourseGallery(slug: string): boolean {
  return (COURSE_GALLERY[slug]?.length ?? 0) > 0;
}
