/**
 * Titles / H1 / meta orientados a queries GSC reales (Chile, no-marca).
 * Title ≤60, description ≤155. Absolute titles incluyen marca.
 */
export type MoneyFaq = { q: string; a: string };

export const PAGE_SEO = {
  home: {
    title: "Pack Adopción Power BI y cursos Chile | ProgramBI",
    description:
      "Power BI para empresas en Chile: Pack Adopción (tablero + equipo). Cursos en vivo de Power BI, SQL y Python para particulares. Diagnóstico 30 min.",
  },
  empresas: {
    title: "Pack Adopción Power BI para empresas Chile | ProgramBI",
    description:
      "Power BI para empresas en Chile: 1–3 dashboards en producción y tu equipo autónomo en 4–6 semanas. Pack Adopción desde $2.9M CLP. Diagnóstico 30 min.",
  },
  cursos: {
    title: "Cursos Power BI y análisis de datos Chile | ProgramBI",
    description:
      "Cursos en vivo en Chile: Power BI, análisis de datos (SQL + Power BI + Python) y minería. Formación individual. Empresas: Pack Adopción, no un curso.",
  },
} as const;

export const COURSE_SEO: Record<
  string,
  {
    title: string;
    description: string;
    h1: string;
    audience: string;
    faqs: MoneyFaq[];
  }
> = {
  "power-bi": {
    title: "Curso Power BI Chile en vivo | ProgramBI",
    description:
      "Curso Power BI en vivo en Chile: Power Query, DAX y dashboards. Para analistas y control de gestión. Cupos abiertos. Si eres empresa, Pack Adopción.",
    h1: "Curso Power BI en vivo Chile",
    audience:
      "Para analistas, control de gestión y finanzas que quieren armar dashboards propios. No es el Pack para empresas.",
    faqs: [
      {
        q: "¿El curso Power BI es en vivo en Chile?",
        a: "Sí. Clases en vivo por Zoom, horario vespertino Chile, con grabaciones en el campus. Cupos abiertos: consulta la próxima cohorte.",
      },
      {
        q: "¿Sirve si mi empresa necesita el tablero en producción?",
        a: "El curso es formación individual. Si eres Controller o jefe de área y necesitas 1–3 dashboards con tus datos + el equipo autónomo, eso es el Pack Adopción BI, no este curso.",
      },
      {
        q: "¿Qué veo en el temario?",
        a: "Power Query (ETL), modelo estrella, DAX y publicación en Power BI Service, incluyendo seguridad a nivel de fila. Tres niveles de 16 horas.",
      },
    ],
  },
  "analisis-de-datos": {
    title: "Cursos de análisis de datos Chile | ProgramBI",
    description:
      "Cursos de análisis de datos en Chile: SQL Server + Power BI + Python, 144 horas en vivo. Para profesionales que salen de Excel. Empresas: Pack Adopción.",
    h1: "Cursos de análisis de datos: SQL, Power BI y Python",
    audience:
      "Para profesionales de finanzas, ops y control de gestión que quieren SQL, Power BI y Python de extremo a extremo (144 h). No reemplaza un Pack in-company.",
    faqs: [
      {
        q: "¿Qué incluye el programa de análisis de datos?",
        a: "Tres bloques de 48 horas: SQL Server, Power BI (modelo y DAX) y Python con Pandas. En total 144 horas en vivo, con proyecto integrador.",
      },
      {
        q: "¿Es lo mismo que un curso Power BI suelto?",
        a: "No. El curso Power BI es 16 h por nivel, solo visualización. Análisis de datos cubre extracción (SQL), tableros (Power BI) y Python.",
      },
      {
        q: "¿Y si somos una empresa?",
        a: "Este programa es cupo individual. Para tablero en producción + adopción del equipo, ve el Pack Adopción BI.",
      },
    ],
  },
  "analitica-mineria": {
    title: "Curso Power BI para minería Chile | ProgramBI",
    description:
      "Power BI y análisis de datos para minería en Chile: reportes de faena, OEE y SQL. 48 h en vivo. Empresas mineras: Pack Adopción in-company.",
    h1: "Power BI y análisis de datos para minería en Chile",
    audience:
      "Para analistas de faena, planificación y mantenimiento que reportan en Excel. Empresas mineras que necesitan el tablero en producción: Pack Adopción.",
    faqs: [
      {
        q: "¿El curso es Power BI aplicado a minería?",
        a: "Sí. Power BI para turnos y OEE, SQL a bases de faena y Python para logs. 48 horas en tres niveles, en vivo.",
      },
      {
        q: "¿Trabajan con datos de mina reales?",
        a: "En el curso usamos casos de vertical minera (producción, flota, mantenimiento). El Pack Adopción construye el tablero con los datos de tu área.",
      },
      {
        q: "¿Es capacitación SENCE?",
        a: "Los cursos abiertos y el Pack se facturan directo. El valor es la formación o la adopción, no un código SENCE.",
      },
    ],
  },
};

export const GUIDE_SEO = {
  "por-que-fallan-proyectos-power-bi": {
    path: "/por-que-fallan-proyectos-power-bi",
    title: "Por qué fallan los proyectos Power BI | ProgramBI",
    description:
      "Los proyectos Power BI en Chile no fallan por el dashboard: fallan por adopción. Qué hacer distinto (Pack Adopción vs curso vs consultora).",
    h1: "Los proyectos Power BI no fallan por el dashboard",
  },
  "curso-power-bi-vs-pack-adopcion": {
    path: "/curso-power-bi-vs-pack-adopcion",
    title: "Curso Power BI vs Pack Adopción Chile | ProgramBI",
    description:
      "Curso Power BI en vivo (formación individual) vs Pack Adopción in-company (tablero en producción + equipo). Cuál te sirve en Chile.",
    h1: "Curso Power BI vs Pack Adopción: no es lo mismo",
  },
  "power-bi-mineria-chile": {
    path: "/power-bi-mineria-chile",
    title: "Power BI para minería en Chile | ProgramBI",
    description:
      "Power BI en minería Chile: reportes de faena, OEE y Excel eterno. Curso abierto o Pack Adopción in-company, según si eres persona o empresa.",
    h1: "Power BI para minería en Chile",
  },
} as const;

const VANITY_RE =
  /tokenizad|neuralink|spacex|glm\b|mundial\s*20|criptomoned|bitcoin|openai\b|chatgpt\s+agente|ia\s+global/i;

export function isVanityBlogPost(
  title?: string | null,
  excerpt?: string | null,
  slug?: string | null
): boolean {
  const hay = `${title || ""} ${excerpt || ""} ${slug || ""}`;
  return VANITY_RE.test(hay);
}