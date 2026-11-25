import type { CarreraPe } from "./types";

export interface CursoAfinPe {
  slug: string;
  nombre: string;
  href: string;
}

const CATALOGO_CURSOS_PE = {
  "analitica-mineria": {
    slug: "analitica-mineria",
    nombre: "Análisis de Datos para la Minería",
    href: "/pe/cursos/analitica-mineria",
  },
  "power-bi": {
    slug: "power-bi",
    nombre: "Power BI",
    href: "/pe/cursos/power-bi",
  },
  python: {
    slug: "python",
    nombre: "Python",
    href: "/pe/cursos/python",
  },
  "sql-server": {
    slug: "sql-server",
    nombre: "SQL Server",
    href: "/pe/cursos/sql-server",
  },
  excel: {
    slug: "excel",
    nombre: "Excel",
    href: "/pe/cursos/excel",
  },
  "analisis-de-datos": {
    slug: "analisis-de-datos",
    nombre: "Análisis de Datos",
    href: "/pe/cursos/analisis-de-datos",
  },
  "ia-productividad": {
    slug: "ia-productividad",
    nombre: "IA en Productividad",
    href: "/pe/cursos/ia-productividad",
  },
} as const satisfies Record<string, CursoAfinPe>;

type CursoKey = keyof typeof CATALOGO_CURSOS_PE;

export type BandaAfinidadPe = "alta" | "mineria" | "baja" | "neutra";

const CHIPS_BASE: readonly CursoKey[] = [
  "analisis-de-datos",
  "power-bi",
  "sql-server",
  "python",
  "excel",
];

const PAR_POR_CODIGO: Record<string, [CursoKey, CursoKey]> = {
  "527": ["analitica-mineria", "power-bi"],
  "511": ["sql-server", "python"],
  "441": ["sql-server", "python"],
  "342": ["excel", "power-bi"],
  "331": ["power-bi", "excel"],
  "335": ["power-bi", "excel"],
  "341": ["power-bi", "python"],
  "521": ["power-bi", "analisis-de-datos"],
  "524": ["excel", "power-bi"],
  "526": ["excel", "power-bi"],
  "531": ["excel", "power-bi"],
  "533": ["excel", "analisis-de-datos"],
  "611": ["excel", "power-bi"],
  "332": ["excel", "analisis-de-datos"],
  "337": ["excel", "ia-productividad"],
  "222": ["analisis-de-datos", "ia-productividad"],
  "321": ["analisis-de-datos", "ia-productividad"],
  "594": ["analisis-de-datos", "python"],
  "711": ["excel", "analisis-de-datos"],
  "714": ["excel", "analisis-de-datos"],
  "715": ["excel", "analisis-de-datos"],
  "716": ["excel", "analisis-de-datos"],
  "717": ["excel", "analisis-de-datos"],
  "111": ["ia-productividad", "excel"],
  "112": ["ia-productividad", "excel"],
  "121": ["ia-productividad", "excel"],
  "313": ["ia-productividad", "analisis-de-datos"],
  "351": ["ia-productividad", "excel"],
};

const CODIGOS_BANDA_ALTA = new Set(["511", "441", "342", "331", "335", "341", "521"]);
const CODIGOS_BANDA_BAJA = new Set(["711", "714", "715", "716", "717", "111", "112", "121", "313", "351"]);

export function bandaAfinidadCarreraPe(carrera: Pick<CarreraPe, "codigoInei">): BandaAfinidadPe {
  if (carrera.codigoInei === "527") return "mineria";
  if (CODIGOS_BANDA_ALTA.has(carrera.codigoInei)) return "alta";
  if (CODIGOS_BANDA_BAJA.has(carrera.codigoInei)) return "baja";
  return "neutra";
}

export function cursosAfinesCarreraPe(carrera: Pick<CarreraPe, "codigoInei">): {
  principal: CursoAfinPe;
  secundario: CursoAfinPe;
  chips: CursoAfinPe[];
  banda: BandaAfinidadPe;
} {
  const banda = bandaAfinidadCarreraPe(carrera);
  const [k1, k2] = PAR_POR_CODIGO[carrera.codigoInei] ?? ["analisis-de-datos", "excel"];
  const principal = CATALOGO_CURSOS_PE[k1];
  const secundario = CATALOGO_CURSOS_PE[k2];

  const vistos = new Set<CursoKey>([k1, k2]);
  const chips: CursoAfinPe[] = [principal, secundario];
  for (const k of CHIPS_BASE) {
    if (!vistos.has(k)) {
      vistos.add(k);
      chips.push(CATALOGO_CURSOS_PE[k]);
    }
  }

  return { principal, secundario, chips, banda };
}
