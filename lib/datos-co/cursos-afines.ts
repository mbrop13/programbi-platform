import type { CarreraCo } from "./types";

export interface CursoAfinCo {
  slug: "analisis-de-datos" | "sql-server" | "power-bi" | "excel";
  href: string;
  titulo: string;
  descripcion: string;
}

const CATALOGO_CURSOS_CO: Record<CursoAfinCo["slug"], CursoAfinCo> = {
  "analisis-de-datos": {
    slug: "analisis-de-datos",
    href: "/co/cursos/analisis-de-datos",
    titulo: "Análisis de Datos",
    descripcion: "Domina análisis exploratorio, limpieza y visualización para roles analíticos.",
  },
  "sql-server": {
    slug: "sql-server",
    href: "/co/cursos/sql-server",
    titulo: "SQL Server",
    descripcion: "Consulta, modela y automatiza bases de datos relacionales en entornos corporativos.",
  },
  "power-bi": {
    slug: "power-bi",
    href: "/co/cursos/power-bi",
    titulo: "Power BI",
    descripcion: "Construye tableros gerenciales con DAX y modelos de datos listos para negocio.",
  },
  excel: {
    slug: "excel",
    href: "/co/cursos/excel",
    titulo: "Excel Avanzado",
    descripcion: "Automatiza reportes, tablas dinámicas y modelos financieros con precisión.",
  },
};

const RE_DATOS_SISTEMAS =
  /\b(datos|sistemas|inform[aá]tica|software|computaci[oó]n|estad[ií]stica|telem[aá]tica|matem[aá]tica)\b/i;

const RE_GESTION_NEGOCIOS =
  /\b(administraci[oó]n|contadur[ií]a|industrial|econom[ií]a|finanzas|negocios|comercio|mercadeo|log[ií]stica|empresarial)\b/i;

/**
 * Mapea una carrera colombiana a los cursos de `/co/cursos/*` más afines
 * según su nombre normalizado y área de conocimiento.
 */
export function cursosAfinesCo(carrera: Pick<CarreraCo, "programa_normalizado" | "area_conocimiento">): CursoAfinCo[] {
  const texto = `${carrera.programa_normalizado} ${carrera.area_conocimiento}`;
  if (RE_DATOS_SISTEMAS.test(texto)) {
    return [
      CATALOGO_CURSOS_CO["analisis-de-datos"],
      CATALOGO_CURSOS_CO["sql-server"],
      CATALOGO_CURSOS_CO["power-bi"],
    ];
  }
  if (RE_GESTION_NEGOCIOS.test(texto)) {
    return [CATALOGO_CURSOS_CO.excel, CATALOGO_CURSOS_CO["power-bi"]];
  }
  return [CATALOGO_CURSOS_CO.excel];
}
