export interface CursoCarrera {
  slug: string;
  nombre: string;
  href: string;
}

const CURSOS_CATALOGO = {
  "analitica-mineria": {
    slug: "analitica-mineria",
    nombre: "Power BI para minería",
    href: "/cursos/analitica-mineria",
  },
  "power-bi": {
    slug: "power-bi",
    nombre: "Power BI",
    href: "/cursos/power-bi",
  },
  python: {
    slug: "python",
    nombre: "Python para datos",
    href: "/cursos/python",
  },
  "sql-server": {
    slug: "sql-server",
    nombre: "SQL Server",
    href: "/cursos/sql-server",
  },
  excel: {
    slug: "excel",
    nombre: "Excel",
    href: "/cursos/excel",
  },
  "analisis-de-datos": {
    slug: "analisis-de-datos",
    nombre: "Análisis de Datos",
    href: "/cursos/analisis-de-datos",
  },
  "ia-productividad": {
    slug: "ia-productividad",
    nombre: "IA en Productividad",
    href: "/cursos/ia-productividad",
  },
} as const satisfies Record<string, CursoCarrera>;

type CursoSlug = keyof typeof CURSOS_CATALOGO;

const CHIPS_BASE: readonly CursoSlug[] = [
  "analisis-de-datos",
  "power-bi",
  "sql-server",
  "python",
  "excel",
];

function parCursos(slug: string, area: string): [CursoSlug, CursoSlug] {
  if (/minas|mineria|metalurg|geolog|geomineria/i.test(slug)) {
    return ["analitica-mineria", "power-bi"];
  }
  if (/computacion|informatica|redes|telecomunicaciones|conectividad|matematica-y-estadistica/i.test(slug)) {
    return ["python", "sql-server"];
  }
  if (/contador|contabilidad|finanzas|financiera/i.test(slug)) {
    return ["excel", "power-bi"];
  }

  switch (area) {
    case "Salud":
      return ["excel", "analisis-de-datos"];
    case "Tecnología":
      return ["power-bi", "sql-server"];
    case "Administración y Comercio":
      return ["power-bi", "excel"];
    case "Ciencias Básicas":
      return ["python", "analisis-de-datos"];
    case "Agropecuaria":
      return ["excel", "power-bi"];
    case "Ciencias Sociales":
      return ["analisis-de-datos", "excel"];
    case "Educación":
    case "Arte y Arquitectura":
    case "Humanidades":
    case "Derecho":
      return ["ia-productividad", "excel"];
    default:
      return ["analisis-de-datos", "excel"];
  }
}

export function cursosParaCarrera(
  slug: string,
  area: string,
): {
  principal: CursoCarrera;
  secundario: CursoCarrera;
  chips: CursoCarrera[];
} {
  const [principalKey, secundarioKey] = parCursos(slug, area);
  const principal = CURSOS_CATALOGO[principalKey];
  const secundario = CURSOS_CATALOGO[secundarioKey];

  const vistos = new Set<CursoSlug>([principalKey, secundarioKey]);
  const chips: CursoCarrera[] = [principal, secundario];
  for (const key of CHIPS_BASE) {
    if (!vistos.has(key)) {
      vistos.add(key);
      chips.push(CURSOS_CATALOGO[key]);
    }
  }

  return { principal, secundario, chips };
}
