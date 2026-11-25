import type { CarreraMxRecord, CursoAfinMx } from "./types";

const CURSOS_MX = {
  excel: {
    slug: "excel",
    nombre: "Excel",
    href: "/mx/cursos/excel",
  },
  "power-bi": {
    slug: "power-bi",
    nombre: "Power BI",
    href: "/mx/cursos/power-bi",
  },
  "analisis-de-datos": {
    slug: "analisis-de-datos",
    nombre: "Análisis de Datos",
    href: "/mx/cursos/analisis-de-datos",
  },
} as const;

const RE_DATOS_O_TI =
  /matem[aá]tic|computaci[oó]n|software|inform[aá]tic|tecnolog[ií]as de la informaci[oó]n/i;
const RE_FINANZAS_ADMIN =
  /finanzas|contabilidad|econom[ií]a|negocios|administraci[oó]n|mercadotecnia/i;
const RE_INGENIERIA =
  /ingenier[ií]a|mec[aá]nica|electricidad|electr[oó]nica|industria|arquitectura|construcci[oó]n|veh[ií]culos/i;

/**
 * Devuelve los cursos afines en /mx/cursos/* para una carrera en México.
 * `/mx/cursos/excel` es siempre la entrada principal; en carreras de datos,
 * finanzas, ingeniería o administración agrega `/mx/cursos/power-bi` o
 * `/mx/cursos/analisis-de-datos`.
 */
export function cursosAfinesCarreraMx(carrera: CarreraMxRecord): CursoAfinMx[] {
  const resultado: CursoAfinMx[] = [
    {
      ...CURSOS_MX.excel,
      rol: "principal",
    },
  ];

  const nombre = carrera.carrera;
  if (RE_DATOS_O_TI.test(nombre)) {
    resultado.push({
      ...CURSOS_MX["analisis-de-datos"],
      rol: "complementario",
    });
    resultado.push({
      ...CURSOS_MX["power-bi"],
      rol: "complementario",
    });
  } else if (RE_FINANZAS_ADMIN.test(nombre) || RE_INGENIERIA.test(nombre)) {
    resultado.push({
      ...CURSOS_MX["power-bi"],
      rol: "complementario",
    });
    resultado.push({
      ...CURSOS_MX["analisis-de-datos"],
      rol: "complementario",
    });
  }

  return resultado;
}
