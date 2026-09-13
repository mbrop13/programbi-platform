/** Shared interest options for registro / AuthModal (lead minimum field). */
export const LEAD_INTERESTS = [
  "Análisis de Datos",
  "Power BI",
  "Python",
  "SQL Server",
  "Capacitación para empresas",
  "Otro",
] as const;

export type LeadInterest = (typeof LEAD_INTERESTS)[number];

export function interestFromCoursePath(path: string | null | undefined): LeadInterest | "" {
  if (!path) return "";
  if (path.includes("empresas")) return "Capacitación para empresas";
  if (path.includes("analisis-de-datos")) return "Análisis de Datos";
  if (path.includes("power-bi")) return "Power BI";
  if (path.includes("python")) return "Python";
  if (path.includes("sql-server")) return "SQL Server";
  return "";
}
