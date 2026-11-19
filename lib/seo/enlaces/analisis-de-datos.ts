import type { EnlaceCurso } from "./tipos";

/**
 * Landings y guías publicadas que amplían la ficha de Análisis de datos.
 * Solo rutas que ya existen en el repo (verificadas con 200 en el smoke).
 */
export const ENLACES_ANALISIS_DE_DATOS: EnlaceCurso[] = [
  { href: "/plantillas", label: "Plantillas y datasets gratis" },
  { href: "/simulador-pl-300", label: "Simulador gratuito PL-300" },
  { href: "/herramientas/excel-a-dax", label: "Conversor Excel a DAX" },
  { href: "/sueldos-analista-datos-chile", label: "Sueldos analista de datos Chile" },
  { href: "/power-bi-mineria-chile", label: "Power BI y análisis de datos para minería" },
  { href: "/cursos/sql-server", label: "Curso SQL online en vivo" },
  { href: "/cursos/power-bi", label: "Curso Power BI en vivo" },
  { href: "/cursos/python", label: "Curso Python para datos" },
  { href: "/precios", label: "Precios y cuotas" },
];
