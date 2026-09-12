/** Slim course rows for client nav (avoids shipping full syllabi in the navbar bundle). */
export type NavCourse = {
  slug: string;
  title: string;
  imageUrl: string;
  durationHours: number;
};

export const COURSE_FILTER_GROUPS = [
  { id: "herramientas" as const, label: "Herramientas", slugs: ["excel", "sql-server", "power-bi", "python"] },
  {
    id: "especializacion" as const,
    label: "Especializaciones",
    slugs: ["analisis-de-datos", "analitica-mineria", "analitica-financiera"],
  },
  {
    id: "ia" as const,
    label: "IA",
    slugs: ["ia-productividad", "copilot", "power-automate", "machine-learning"],
  },
];

export const NAV_COURSE_GROUPS: { id: string; label: string; items: NavCourse[] }[] = [
  {
    id: "herramientas",
    label: "Herramientas",
    items: [
      { slug: "excel", title: "Excel", imageUrl: "/images/courses/excel-card.webp", durationHours: 16 },
      { slug: "sql-server", title: "SQL Server", imageUrl: "/images/courses/sql-server-card.webp", durationHours: 16 },
      { slug: "power-bi", title: "Power BI", imageUrl: "/images/courses/power-bi-card.webp", durationHours: 16 },
      { slug: "python", title: "Python para Datos", imageUrl: "/images/courses/python-card.webp", durationHours: 16 },
    ],
  },
  {
    id: "especializacion",
    label: "Especializaciones",
    items: [
      {
        slug: "analisis-de-datos",
        title: "Análisis de Datos",
        imageUrl: "/images/courses/analisis-de-datos-card.webp",
        durationHours: 144,
      },
      {
        slug: "analitica-mineria",
        title: "Análisis de Datos para la Minería",
        imageUrl: "/images/courses/analitica-mineria-card.webp",
        durationHours: 48,
      },
      {
        slug: "analitica-financiera",
        title: "Analítica Financiera",
        imageUrl: "/images/courses/analitica-financiera-card.webp",
        durationHours: 48,
      },
    ],
  },
  {
    id: "ia",
    label: "IA",
    items: [
      {
        slug: "ia-productividad",
        title: "IA en Productividad",
        imageUrl: "/images/courses/ia-productividad-card.webp",
        durationHours: 16,
      },
      {
        slug: "copilot",
        title: "Copilot y Copilot Studio",
        imageUrl: "/images/courses/copilot-card.webp",
        durationHours: 16,
      },
      {
        slug: "power-automate",
        title: "Power Automate & RPA",
        imageUrl: "/images/courses/power-automate-card.webp",
        durationHours: 16,
      },
      {
        slug: "machine-learning",
        title: "Machine Learning",
        imageUrl: "/images/courses/machine-learning-card.webp",
        durationHours: 16,
      },
    ],
  },
];
