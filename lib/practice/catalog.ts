export type PracticeUnitMeta = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  emoji: string;
  levelCount: number;
};

export const PRACTICE_UNIT_META: PracticeUnitMeta[] = [
  {
    id: "power-bi",
    slug: "power-bi",
    title: "Power BI",
    description: "Business Intelligence, Power Query, DAX y Visualización de alto impacto.",
    icon: "BarChart3",
    accentColor: "#F2C811",
    emoji: "📊",
    levelCount: 50,
  },
  {
    id: "sql-server",
    slug: "sql-server",
    title: "SQL Server",
    description: "Consultas, joins y bases relacionales con T-SQL.",
    icon: "Database",
    accentColor: "#CC2935",
    emoji: "🛢️",
    levelCount: 50,
  },
  {
    id: "inteligencia-artificial",
    slug: "inteligencia-artificial",
    title: "Inteligencia Artificial",
    description: "Prompting, RAG y fundamentos de LLMs.",
    icon: "Brain",
    accentColor: "#7C3AED",
    emoji: "🧠",
    levelCount: 50,
  },
  {
    id: "python",
    slug: "python",
    title: "Python",
    description: "Sintaxis, tipos de datos y librerías.",
    icon: "Code2",
    accentColor: "#3B82F6",
    emoji: "🐍",
    levelCount: 50,
  },
  {
    id: "excel",
    slug: "excel",
    title: "Excel Avanzado",
    description: "Fórmulas, tablas dinámicas y dashboards.",
    icon: "FileSpreadsheet",
    accentColor: "#10B981",
    emoji: "📈",
    levelCount: 50,
  },
];

export const PRACTICE_UNIT_LOADERS: Record<string, () => Promise<{ default: import("./types").Unit }>> = {
  "power-bi": () => import("./units/power-bi"),
  "sql-server": () => import("./units/sql-server"),
  "inteligencia-artificial": () => import("./units/inteligencia-artificial"),
  python: () => import("./units/python"),
  excel: () => import("./units/excel"),
};

export async function loadPracticeUnit(id: string) {
  const loader = PRACTICE_UNIT_LOADERS[id] || PRACTICE_UNIT_LOADERS["power-bi"];
  const mod = await loader();
  return mod.default;
}
