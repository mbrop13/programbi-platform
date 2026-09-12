/**
 * Titles / H1 / meta orientados a queries GSC reales (Chile, no-marca).
 * Title ≤60, description ≤155. Absolute titles incluyen marca.
 */
export type MoneyFaq = { q: string; a: string };

export const PAGE_SEO = {
  home: {
    title: "Cursos Power BI, SQL y Python en Chile | ProgramBI",
    description:
      "Cursos en vivo de Power BI, SQL y Python en Chile. Capacitación para profesionales y empresas. Clases online con expertos de la industria.",
  },
  empresas: {
    title: "Power BI para empresas Chile | Capacitación y BI",
    description:
      "Capacitación corporativa de Power BI, SQL y Python para empresas en Chile. Programas in-company, en vivo, con factura. Pide una propuesta.",
  },
  cursos: {
    title: "Cursos Power BI y análisis de datos Chile | ProgramBI",
    description:
      "Cursos en vivo en Chile: Power BI, análisis de datos (SQL + Power BI + Python) y minería. Formación profesional con expertos.",
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
      "Curso Power BI en vivo en Chile: Power Query, DAX y dashboards. Para analistas y control de gestión. Cupos abiertos — consulta fecha.",
    h1: "Curso Power BI en vivo Chile",
    audience:
      "Para analistas, control de gestión y finanzas que quieren armar dashboards propios.",
    faqs: [
      {
        q: "¿El curso Power BI es en vivo en Chile?",
        a: "Sí. Clases en vivo por Zoom, horario vespertino Chile, con grabaciones en el campus. Cupos abiertos: consulta la próxima cohorte.",
      },
      {
        q: "¿Sirve si mi empresa necesita el tablero en producción?",
        a: "El curso es formación individual. Si tu empresa necesita dashboards con datos propios y capacitación in-company, revisa /empresas.",
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
      "Cursos de análisis de datos en Chile: SQL Server + Power BI + Python, 144 horas en vivo. Para profesionales que salen de Excel.",
    h1: "Cursos de análisis de datos: SQL, Power BI y Python",
    audience:
      "Para profesionales de finanzas, ops y control de gestión que quieren SQL, Power BI y Python de extremo a extremo (144 h).",
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
        a: "Este programa es cupo individual. Para un proyecto in-company, ve /empresas.",
      },
    ],
  },
  "analitica-mineria": {
    title: "Curso Power BI para minería Chile | ProgramBI",
    description:
      "Power BI y análisis de datos para minería en Chile: reportes de faena, OEE y SQL. 48 h en vivo.",
    h1: "Power BI y análisis de datos para minería en Chile",
    audience:
      "Para analistas de faena, planificación y mantenimiento que reportan en Excel.",
    faqs: [
      {
        q: "¿El curso es Power BI aplicado a minería?",
        a: "Sí. Power BI para turnos y OEE, SQL a bases de faena y Python para logs. 48 horas en tres niveles, en vivo.",
      },
      {
        q: "¿Trabajan con datos de mina reales?",
        a: "En el curso usamos casos de vertical minera (producción, flota, mantenimiento). Un proyecto in-company se arma con los datos de tu área — ver /empresas.",
      },
      {
        q: "¿Es capacitación SENCE?",
        a: "Los cursos abiertos y el Pack se facturan directo. El valor es la formación o la adopción, no un código SENCE.",
      },
    ],
  },
  excel: {
    title: "Curso Excel Chile en vivo | ProgramBI",
    description:
      "Curso de Excel en vivo en Chile: tablas dinámicas, fórmulas avanzadas, Power Query y dashboards para reportes de gestión. Consulta la próxima cohorte.",
    h1: "Excel",
    audience:
      "Para analistas y control de gestión que arman reportes en Excel y quieren ir más allá de las tablas dinámicas.",
    faqs: [
      {
        q: "¿El curso Excel es en vivo?",
        a: "Sí. Clases en vivo por Zoom, con grabaciones en el campus. Cupos abiertos: consulta la próxima cohorte.",
      },
      {
        q: "¿Qué veo en el temario de Excel?",
        a: "Fórmulas avanzadas, tablas dinámicas, Power Query para ETL y dashboards. También macros VBA a nivel práctico.",
      },
    ],
  },
  python: {
    title: "Curso Python para datos Chile | ProgramBI",
    description:
      "Curso de Python para datos en Chile, en vivo: Pandas, visualización y automatización, desde fundamentos hasta análisis aplicado a negocios.",
    h1: "Python para Datos",
    audience:
      "Para profesionales que quieren analizar datos con Python y Pandas, sin un programa de ciencia de datos de meses.",
    faqs: [
      {
        q: "¿El curso Python es para análisis de datos?",
        a: "Sí. Está enfocado en Pandas, limpieza, visualización y automatización de reportes, no en desarrollo de software genérico.",
      },
      {
        q: "¿Necesito saber programar antes?",
        a: "No. El nivel básico parte desde fundamentos de Python y sube hasta análisis con Pandas.",
      },
    ],
  },
  "sql-server": {
    title: "Curso SQL Server Chile en vivo | ProgramBI",
    description:
      "Curso SQL Server en vivo en Chile: consultas, JOINs, procedimientos almacenados y diseño de esquemas. Para analistas que trabajan con datos.",
    h1: "SQL Server",
    audience:
      "Para analistas que salen de Excel y necesitan extraer datos de bases SQL Server con consultas propias.",
    faqs: [
      {
        q: "¿El curso SQL Server es en vivo en Chile?",
        a: "Sí. Clases en vivo por Zoom, horario Chile, con grabaciones en el campus. Consulta la próxima cohorte.",
      },
      {
        q: "¿Qué cubre el temario?",
        a: "SELECT, JOINs, CTEs, procedimientos almacenados y diseño de esquemas. Tres niveles de 16 horas.",
      },
    ],
  },
  "machine-learning": {
    title: "Curso Machine Learning Chile | ProgramBI",
    description:
      "Curso de Machine Learning en vivo en Chile: modelos predictivos con Python, Scikit-learn y redes neuronales aplicados a negocios.",
    h1: "Machine Learning",
    audience:
      "Para quienes ya manejan Python y quieren armar modelos predictivos aplicados a negocios.",
    faqs: [
      {
        q: "¿Qué conocimientos previos pide Machine Learning?",
        a: "Python intermedio (Pandas/NumPy) ayuda. El curso cubre regresión, clasificación, clustering y redes neuronales.",
      },
      {
        q: "¿Es un curso teórico?",
        a: "No. Se trabaja con modelos aplicados a negocios: predicción, clasificación y deploy básico.",
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

/** Higher score → list first on /blog (Power BI, SQL, Python, datos en Chile). */
export function blogIcpScore(
  title?: string | null,
  excerpt?: string | null,
  slug?: string | null,
  category?: string | null
): number {
  if (isVanityBlogPost(title, excerpt, slug)) return -100;
  const hay = `${title || ""} ${excerpt || ""} ${slug || ""} ${category || ""}`;
  let score = 0;
  if (/power\s*bi|dax|power query/i.test(hay)) score += 5;
  if (/\bsql\b|sql server/i.test(hay)) score += 4;
  if (/python|pandas/i.test(hay)) score += 4;
  if (/an[áa]lisis de datos|business intelligence|\bbi\b/i.test(hay)) score += 3;
  if (/chile/i.test(hay)) score += 2;
  return score;
}