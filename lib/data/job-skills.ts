/**
 * Taxonomía de skills para la Bolsa de Trabajo.
 * Alineada con el catálogo de cursos de ProgramBI para que los
 * certificados emitidos se mapeen automáticamente a skills verificadas.
 */

export interface JobSkill {
  id: string;
  label: string;
  category: "programacion" | "datos" | "visualizacion" | "ia" | "automatizacion" | "otros";
}

export const JOB_SKILL_CATEGORIES: Record<JobSkill["category"], string> = {
  programacion: "Programación",
  datos: "Datos y Bases",
  visualizacion: "Visualización",
  ia: "Inteligencia Artificial",
  automatizacion: "Automatización",
  otros: "Otros",
};

export const JOB_SKILLS: JobSkill[] = [
  // Programación
  { id: "python", label: "Python", category: "programacion" },
  { id: "r", label: "R", category: "programacion" },
  { id: "vba", label: "VBA / Macros", category: "programacion" },
  { id: "sql", label: "SQL", category: "programacion" },
  // Datos y bases
  { id: "sql-server", label: "SQL Server", category: "datos" },
  { id: "mysql", label: "MySQL", category: "datos" },
  { id: "postgresql", label: "PostgreSQL", category: "datos" },
  { id: "etl", label: "ETL / Integración", category: "datos" },
  { id: "data-warehouse", label: "Data Warehouse", category: "datos" },
  // Visualización
  { id: "power-bi", label: "Power BI", category: "visualizacion" },
  { id: "excel", label: "Excel avanzado", category: "visualizacion" },
  { id: "tableau", label: "Tableau", category: "visualizacion" },
  { id: "looker-studio", label: "Looker Studio", category: "visualizacion" },
  { id: "dashboards", label: "Dashboards y KPIs", category: "visualizacion" },
  // IA
  { id: "machine-learning", label: "Machine Learning", category: "ia" },
  { id: "ia-generativa", label: "IA Generativa / LLMs", category: "ia" },
  { id: "copilot", label: "Copilot / M365", category: "ia" },
  { id: "estadistica", label: "Estadística", category: "ia" },
  // Automatización
  { id: "power-automate", label: "Power Automate / RPA", category: "automatizacion" },
  { id: "dax", label: "DAX", category: "automatizacion" },
  // Otros
  { id: "azure", label: "Azure", category: "otros" },
  { id: "aws", label: "AWS", category: "otros" },
  { id: "git", label: "Git", category: "otros" },
  { id: "powerpoint", label: "PowerPoint / Storytelling", category: "otros" },
];

export const JOB_SKILL_IDS = JOB_SKILLS.map((s) => s.id);

/** Mapa título de curso (certificado) → skill de la taxonomía. */
const COURSE_TITLE_SKILL_RULES: Array<{ match: string; skill: string }> = [
  { match: "python", skill: "python" },
  { match: "power bi", skill: "power-bi" },
  { match: "sql", skill: "sql-server" },
  { match: "excel", skill: "excel" },
  { match: "machine learning", skill: "machine-learning" },
  { match: "analitica financiera", skill: "estadistica" },
  { match: "analisis de datos", skill: "dashboards" },
  { match: "datos para la miner", skill: "dashboards" },
  { match: "copilot", skill: "copilot" },
  { match: "power automate", skill: "power-automate" },
  { match: "ia en productividad", skill: "ia-generativa" },
];

/**
 * Dado un listado de títulos de certificados, devuelve los ids de skills
 * verificadas (normalizados, sin duplicados).
 */
export function skillsFromCourseTitles(courseTitles: string[]): string[] {
  const found = new Set<string>();
  for (const title of courseTitles) {
    const normalized = title.toLowerCase().trim();
    for (const rule of COURSE_TITLE_SKILL_RULES) {
      if (normalized.includes(rule.match)) found.add(rule.skill);
    }
  }
  return Array.from(found);
}

export function getSkillLabel(id: string): string {
  return JOB_SKILLS.find((s) => s.id === id)?.label ?? id;
}

export function isValidSkill(id: string): boolean {
  return JOB_SKILL_IDS.includes(id);
}

export function skillsByCategory(): Array<{ category: string; label: string; skills: JobSkill[] }> {
  const groups = new Map<JobSkill["category"], JobSkill[]>();
  for (const skill of JOB_SKILLS) {
    const list = groups.get(skill.category) ?? [];
    list.push(skill);
    groups.set(skill.category, list);
  }
  return Array.from(groups.entries()).map(([category, skills]) => ({
    category,
    label: JOB_SKILL_CATEGORIES[category],
    skills,
  }));
}
