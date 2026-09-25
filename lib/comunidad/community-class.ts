export type CommunityClassLevel = "clase" | "avanzada";

export type CommunityClass = {
  id: string;
  classDate: string;
  startTime: string;
  endTime: string;
  level: CommunityClassLevel;
  topic: string | null;
};

export const COMMUNITY_CLASS_LEVELS: Record<
  CommunityClassLevel,
  { label: string; body: string }
> = {
  clase: {
    label: "Clase",
    body: "Informes comerciales, control de gestión, proyectos e informes financieros.",
  },
  avanzada: {
    label: "Clase avanzada",
    body: "El mismo terreno de decisión, con Power BI, Python y SQL Server en un nivel más alto.",
  },
};

export function isCommunityClassLevel(value: string): value is CommunityClassLevel {
  return value === "clase" || value === "avanzada";
}
