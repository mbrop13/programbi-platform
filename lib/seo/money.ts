/**
 * Titles / H1 / meta orientados a queries GSC reales (Chile, no-marca).
 * Title ≤60, description ≤155. Absolute titles incluyen marca.
 */
export type MoneyFaq = { q: string; a: string };

export const PAGE_SEO = {
  home: {
    title: "Cursos de análisis de datos en vivo Chile | ProgramBI",
    h1: "Cursos de análisis de datos en vivo en Chile",
    description:
      "Academia de datos en Chile: cursos en vivo de análisis de datos, Power BI y Power Automate. Clases por Zoom para profesionales. Inscríbete en ProgramBI.",
  },
  empresas: {
    title: "De Excel a Power BI para empresas Chile | ProgramBI",
    description:
      "Adopción de Power BI en empresas de Chile: capacitación in-company, de Excel a tableros, en vivo y con factura. Pide una propuesta.",
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
    intro?: string;
    faqs: MoneyFaq[];
  }
> = {
  "power-bi": {
    title: "Curso Power BI Chile en vivo: DAX y Query | ProgramBI",
    description:
      "Curso Power BI en Chile, en vivo: Power Query, DAX y dashboards. Para analistas y control de gestión. 16 h por nivel. Cupos abiertos — inscríbete.",
    h1: "Curso Power BI en vivo en Chile",
    audience:
      "Para analistas, control de gestión y finanzas que hoy reportan en Excel y quieren armar dashboards propios en Power BI.",
    intro:
      "Este es un curso Power BI en Chile, en vivo por Zoom, para analistas, control de gestión y finanzas que hoy consolidan cifras en Excel y necesitan un dashboard que ellos mismos puedan mantener.\n\nEn tres niveles de 16 horas —horario vespertino Chile, con grabaciones en el campus— trabajas Power Query (ETL), el modelo estrella, DAX (CALCULATE, FILTER, time intelligence) y la publicación en Power BI Service, incluida la seguridad a nivel de fila. El objetivo es un tablero usable en el trabajo, no una captura de pantalla.\n\nSi buscas cursos de Power BI en Chile para formarte como persona, este es el camino. Si tu empresa necesita el tablero en producción con datos propios y capacitación in-company, eso vive en /empresas. El siguiente paso es registrarte: con una cuenta ves fechas, cupos y el valor de la próxima cohorte.",
    faqs: [
      {
        q: "¿Hay un curso Power BI en Chile, en vivo?",
        a: "Sí. ProgramBI dicta el curso Power BI en vivo por Zoom, en horario vespertino Chile, con grabaciones en el campus. Tres niveles de 16 horas: Query, modelo y DAX, y publicación.",
      },
      {
        q: "¿Qué cubren los cursos de Power BI?",
        a: "Power Query para transformar datos, modelo estrella, DAX y dashboards en Power BI Service, con seguridad a nivel de fila. Cada nivel son 16 horas en vivo.",
      },
      {
        q: "¿El curso Power BI es para empresas o para personas?",
        a: "Esta landing es formación individual. Power BI para empresas en Chile (tablero en producción + equipo) está en /empresas. El catálogo de cursos abiertos está en /cursos.",
      },
      {
        q: "¿Necesito saber DAX antes de inscribirme?",
        a: "No. El nivel básico parte en Power Query. DAX y time intelligence entran en el nivel intermedio; publicación y RLS en el avanzado.",
      },
      {
        q: "¿Cómo me inscribo al curso Power BI Chile?",
        a: "Usa Registrarme en esta página: es el mismo registro del sitio. Con la cuenta ves fechas y valor de la próxima cohorte.",
      },
    ],
  },
  "analisis-de-datos": {
    title: "Curso de análisis de datos en vivo Chile | ProgramBI",
    description:
      "Curso de análisis de datos en Chile, en vivo: SQL, Power BI y Python. 144 h para profesionales que salen de Excel y quieren ser analistas de datos. Inscríbete.",
    h1: "Curso de análisis de datos en vivo en Chile",
    audience:
      "Para profesionales de finanzas, control de gestión y operaciones que hoy reportan en Excel y quieren el oficio de analista de datos: SQL, Power BI y Python.",
    intro:
      "Este es un curso de análisis de datos en Chile, en vivo por Zoom, para profesionales de finanzas, control de gestión y operaciones que hoy arman reportes en Excel y necesitan un oficio completo de analista de datos.\n\nEn 144 horas —tres bloques de 48 horas, horario vespertino Chile, con grabaciones en el campus— aprendes a extraer datos con SQL Server, a modelar y publicar tableros en Power BI (Power Query y DAX) y a limpiar y automatizar con Python y Pandas. El cierre es un proyecto integrador, no un módulo teórico suelto.\n\nSi buscas cursos de análisis de datos para dar el salto de Excel a SQL, Power BI y Python, este es el programa largo de ProgramBI. Sales sabiendo consultar una base, armar un modelo de negocio y entregar un dashboard usable. El siguiente paso es registrarte: con una cuenta ves fechas, cupos y el valor de la próxima cohorte.",
    faqs: [
      {
        q: "¿Hay un curso de análisis de datos en Chile, en vivo?",
        a: "Sí. ProgramBI dicta el curso de análisis de datos en vivo por Zoom, en horario vespertino Chile, con grabaciones en el campus. Son 144 horas: SQL Server, Power BI y Python.",
      },
      {
        q: "¿Qué se aprende en los cursos de análisis de datos?",
        a: "Extraer datos con SQL Server, armar tableros con Power Query y DAX en Power BI, y limpiar o automatizar con Python y Pandas. Tres bloques de 48 horas y un proyecto integrador.",
      },
      {
        q: "¿Sirve como curso para analista de datos?",
        a: "Está pensado para profesionales que quieren el oficio de analista de datos: consultas propias, modelo de negocio y un dashboard publicable. No es un curso Power BI de 16 horas ni un bootcamp genérico.",
      },
      {
        q: "¿Es lo mismo que un curso Power BI suelto?",
        a: "El curso Power BI cubre visualización (16 h por nivel). Este programa cubre extracción (SQL), tableros (Power BI) y Python. El catálogo de cursos sueltos está en /cursos.",
      },
      {
        q: "¿Cómo me inscribo al curso de análisis de datos?",
        a: "Usa Registrarme en esta página: es el mismo registro del sitio. Con la cuenta ves fechas y valor. Si eres empresa y necesitas un proyecto in-company, ve /empresas.",
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
    h1: "Curso Python para datos en vivo en Chile",
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
      {
        q: "¿Y si somos una empresa?",
        a: "Este programa es cupo individual. Para un proyecto in-company, ve /empresas.",
      },
    ],
  },
  "sql-server": {
    title: "Curso SQL Server Chile en vivo | ProgramBI",
    description:
      "Curso SQL Server en vivo en Chile: consultas, JOINs, procedimientos almacenados y diseño de esquemas. Para analistas que trabajan con datos.",
    h1: "Curso SQL Server en vivo en Chile",
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
      {
        q: "¿Y si somos una empresa?",
        a: "Este programa es cupo individual. Para un proyecto in-company, ve /empresas.",
      },
    ],
  },
  "analitica-financiera": {
    title: "Curso analítica financiera Chile | ProgramBI",
    description:
      "Curso de analítica financiera en Chile, en vivo: Excel, SQL, Power BI y Python para reportes contables, riesgo y dashboards de inversión.",
    h1: "Analítica Financiera",
    audience:
      "Para analistas financieros y control de gestión que automatizan reportes y quieren tableros de inversión.",
    faqs: [
      {
        q: "¿Qué cubre el curso de analítica financiera?",
        a: "Automatización de reportes contables con SQL, dashboards de ROI y flujos en Power BI, y modelado de riesgo con Python. 48 horas en vivo.",
      },
      {
        q: "¿Necesito ser contador para tomarlo?",
        a: "Sirve tener nociones de contabilidad y finanzas corporativas. El curso enseña las herramientas (Excel, SQL, Power BI y Python) sobre esos casos.",
      },
    ],
  },
  "power-automate": {
    title: "Curso Power Automate Chile: flujos y RPA | ProgramBI",
    description:
      "Curso Power Automate en Chile, en vivo: flujos en la nube, RPA de escritorio y aprobaciones. Para analistas que automatizan sin código. Inscríbete.",
    h1: "Curso Power Automate y RPA en vivo en Chile",
    audience:
      "Para analistas y operaciones que pierden horas en correos, aprobaciones y copiar datos entre Excel, Outlook y Teams.",
    intro:
      "Este es un curso Power Automate en Chile, en vivo por Zoom, para analistas y operaciones que pierden horas en correos, aprobaciones y copiar datos entre Excel, Outlook y Teams.\n\nEn 16 horas —horario vespertino Chile, con grabaciones en el campus— armas flujos en la nube (automatizados, instantáneos y programados), conectores de Microsoft 365, expresiones y aprobaciones. También ves RPA de escritorio y Copilot para diseñar flujos sin código. Sales con automatizaciones que puedes publicar, no con una demo suelta.\n\nSi buscas un curso Power Automate o cursos Power Automate para el día a día en Chile, este es el programa. No hace falta programar: es no-code, con conectores de Microsoft 365. El siguiente paso es registrarte: con una cuenta ves fechas, cupos y el valor. El catálogo completo está en /cursos.",
    faqs: [
      {
        q: "¿Hay un curso Power Automate en Chile, en vivo?",
        a: "Sí. ProgramBI dicta el curso Power Automate en vivo por Zoom, en horario vespertino Chile, con grabaciones en el campus. Son 16 horas, enfocadas en flujos reales.",
      },
      {
        q: "¿Qué se aprende en un curso Power Automate?",
        a: "Flujos de nube (automatizados, instantáneos y programados), conectores de Outlook, Teams, OneDrive y SharePoint, expresiones, aprobaciones, RPA de escritorio y Copilot para diseñar flujos.",
      },
      {
        q: "¿Power Automate es lo mismo que RPA?",
        a: "Power Automate cubre flujos en la nube y RPA de escritorio. En este curso ves ambos: automatizar Microsoft 365 y procesos que hoy viven en el PC.",
      },
      {
        q: "¿Necesito saber programar?",
        a: "No. Es un curso no-code: conectores, condiciones y Copilot. Sirve si ya usas Excel, Outlook o Teams y quieres dejar de copiar datos a mano.",
      },
      {
        q: "¿Cómo me inscribo al curso Power Automate?",
        a: "Usa Registrarme en esta página: es el mismo registro del sitio. Con la cuenta ves fechas y valor. El resto de cursos está en /cursos.",
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
  /tokenizad|neuralink|spacex|glm\b|mundial|criptomoned|bitcoin|openai\b|chatgpt|claude|fable|\bgpt\b|anthropic|en-bolsa|ia[-\s]+global|gran[\s-]*partido|bolsa[-\s]de[-\s]trabajo/i;

const SPORTS_RE = /\b(deporte|futbol|fútbol|running|mundial|partido|u de chile|colo[\s-]?colo)\b/i;

export function isVanityBlogPost(
  title?: string | null,
  excerpt?: string | null,
  slug?: string | null
): boolean {
  const hay = `${title || ""} ${excerpt || ""} ${slug || ""}`;
  return VANITY_RE.test(hay) || SPORTS_RE.test(hay);
}

/** Higher score → list first on /blog (Power BI, SQL, Python, datos en Chile). */
export function blogIcpScore(
  title?: string | null,
  excerpt?: string | null,
  slug?: string | null,
  category?: string | null
): number {
  if (isVanityBlogPost(title, excerpt, slug)) return -100;
  const cat = (category || "").toLowerCase();
  if (["deporte", "futbol", "running", "deportes"].includes(cat)) return -50;
  const hay = `${title || ""} ${excerpt || ""} ${slug || ""} ${category || ""}`;
  let score = 0;
  if (/power\s*bi|dax|power query|powerquery/i.test(hay)) score += 5;
  if (/\bsql\b|sql server|t-sql/i.test(hay)) score += 4;
  if (/python|pandas|numpy/i.test(hay)) score += 4;
  if (/an[áa]lisis de datos|business intelligence|dashboard|tablero/i.test(hay)) score += 3;
  if (["power-bi", "sql", "python", "tecnologia"].includes(cat)) score += 2;
  if (score > 0 && /chile/i.test(hay)) score += 2;
  return score;
}