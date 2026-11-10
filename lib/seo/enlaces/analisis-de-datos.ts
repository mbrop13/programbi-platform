import type { EnlaceCurso } from "./tipos";

/**
 * Landings y guías publicadas que amplían la ficha de Análisis de datos.
 * Solo rutas que ya existen en el repo (verificadas con 200 en el smoke).
 */
export const ENLACES_ANALISIS_DE_DATOS: EnlaceCurso[] = [
  { href: "/analisis-de-datos-mineria", label: "Análisis de datos para minería" },
  { href: "/cursos/sql-server", label: "Curso SQL online en vivo" },
  { href: "/cursos/power-bi", label: "Curso Power BI en vivo" },
  { href: "/cursos/python", label: "Curso Python para datos" },
  { href: "/precios", label: "Precios y cuotas" },
];
