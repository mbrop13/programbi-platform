export interface CursoCarrera {
  slug: string;
  nombre: string;
  href: string;
}

const CURSOS_CATALOGO = {
  "analitica-mineria": {
    slug: "analitica-mineria",
    nombre: "Análisis de Datos para la Minería",
    href: "/cursos/analitica-mineria",
  },
  "power-bi": {
    slug: "power-bi",
    nombre: "Power BI",
    href: "/cursos/power-bi",
  },
  python: {
    slug: "python",
    nombre: "Python",
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

export type BandaAfinidad = "alta" | "mineria" | "baja" | "neutra";

const RE_CONTADOR = /contador|contabilidad/i;
const RE_INFORMATICA = /computacion|informatica/i;
const RE_FINANZAS = /finanzas|financiera/i;

export function bandaAfinidadCarrera(slug: string, area: string): BandaAfinidad {
  // 1) Banda 3 ("baja") primero para evitar falsos positivos (ej. pedagogia-en-matematicas-y-computacion)
  if (
    area === "Salud" ||
    slug === "medicina-veterinaria" ||
    slug === "tecnico-veterinario" ||
    area === "Educación" ||
    /pedagog/i.test(slug) ||
    area === "Derecho" ||
    area === "Arte y Arquitectura" ||
    area === "Humanidades" ||
    /periodismo|^comunicacion|-comunicacion/i.test(slug)
  ) {
    return "baja";
  }

  // 2) Banda 2 ("mineria")
  if (/minas|mineria|metalurg|geomineria/i.test(slug)) {
    return "mineria";
  }

  // 3) Banda 1 ("alta")
  if (
    slug === "ingenieria-comercial" ||
    slug === "contador-auditor" ||
    RE_CONTADOR.test(slug) ||
    slug === "ingenieria-industrial" ||
    slug === "ingenieria-civil-industrial" ||
    slug === "ingenieria-en-computacion-e-informatica" ||
    slug === "ingenieria-civil-en-computacion-e-informatica" ||
    slug === "tecnico-en-computacion-e-informatica" ||
    RE_INFORMATICA.test(slug) ||
    slug === "ingenieria-en-control-de-gestion" ||
    slug === "ingenieria-en-finanzas" ||
    slug === "tecnico-en-administracion-financiera-y-finanzas" ||
    RE_FINANZAS.test(slug)
  ) {
    return "alta";
  }

  // 4) Resto
  return "neutra";
}

function crearRecomendacion(
  claves: readonly [CursoSlug, CursoSlug, ...CursoSlug[]],
  banda: BandaAfinidad,
): {
  principal: CursoCarrera;
  secundario: CursoCarrera;
  chips: CursoCarrera[];
  banda: BandaAfinidad;
} {
  const [principalKey, secundarioKey] = claves;
  return {
    principal: CURSOS_CATALOGO[principalKey],
    secundario: CURSOS_CATALOGO[secundarioKey],
    chips: claves.map((k) => CURSOS_CATALOGO[k]),
    banda,
  };
}

export function cursosParaCarrera(
  slug: string,
  area: string,
): {
  principal: CursoCarrera;
  secundario: CursoCarrera;
  chips: CursoCarrera[];
  banda: BandaAfinidad;
} {
  const banda = bandaAfinidadCarrera(slug, area);

  if (banda === "mineria") {
    return crearRecomendacion(["analitica-mineria", "power-bi"], banda);
  }

  if (banda === "alta") {
    if (slug === "contador-auditor" || RE_CONTADOR.test(slug)) {
      return crearRecomendacion(["excel", "power-bi"], banda);
    }
    if (slug === "ingenieria-industrial" || slug === "ingenieria-civil-industrial") {
      return crearRecomendacion(["power-bi", "analisis-de-datos"], banda);
    }
    if (
      slug === "ingenieria-en-computacion-e-informatica" ||
      slug === "ingenieria-civil-en-computacion-e-informatica" ||
      slug === "tecnico-en-computacion-e-informatica" ||
      RE_INFORMATICA.test(slug)
    ) {
      return crearRecomendacion(["sql-server", "python", "analisis-de-datos"], banda);
    }
    return crearRecomendacion(["power-bi", "excel"], banda);
  }

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

  return { principal, secundario, chips, banda };
}
