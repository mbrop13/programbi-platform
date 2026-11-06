import type { EnlaceCurso } from "./tipos";

/**
 * Landings y guías publicadas que amplían la ficha de Power BI en Chile.
 * Solo rutas que ya existen en el repo (verificadas con 200 en el smoke).
 */
export const ENLACES_POWER_BI: EnlaceCurso[] = [
  { href: "/power-bi-para-finanzas", label: "Power BI para finanzas" },
  { href: "/power-bi-mineria-chile", label: "Power BI para minería" },
  { href: "/migrar-excel-a-power-bi", label: "Migrar de Excel a Power BI" },
  {
    href: "/guias/como-aprender-power-bi-en-chile",
    label: "Guía: aprender Power BI en Chile",
  },
  {
    href: "/guias/certificacion-pl-300-power-bi",
    label: "Guía: certificación PL-300",
  },
  { href: "/empresas", label: "Capacitación para empresas" },
];
