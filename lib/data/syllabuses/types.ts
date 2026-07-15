export type SyllabusTopicKind = "lesson" | "project" | "ai" | "lab" | "objective" | "functions" | "problems";

export type SyllabusModuleIcon =
  | "powerbi"
  | "sql"
  | "python"
  | "excel"
  | "generic"
  | "star"
  | "bot"
  | "chart"
  | "server"
  | "network"
  | "bolt"
  | "finance"
  | "trending";

export interface SyllabusTopic {
  title: string;
  kind?: SyllabusTopicKind;
}

export interface SyllabusModule {
  id: string;
  title: string;
  hours?: number;
  subtitle?: string;
  icon?: SyllabusModuleIcon;
  highlight?: boolean;
  topics: (string | SyllabusTopic)[];
}

export type BenefitItem = string | { title: string; description?: string };

export interface SyllabusLevelContent {
  id: string;
  label: string;
  shortLabel?: string;
  /** Per-level audience (used when program-level audience is absent) */
  audience?: string;
  benefits?: BenefitItem[];
  intro?: string;
  modules: SyllabusModule[];
  /** Theme accent for this level's UI (hex) */
  theme?: string;
}

export interface CourseSyllabusData {
  slug: string;
  accent?: string;
  programYear?: string;
  /** Shared "Dirigido a" across all levels */
  audience?: string;
  audienceNote?: string;
  /** Shared benefits across all levels */
  benefits?: BenefitItem[];
  levels: SyllabusLevelContent[];
}

export function normalizeTopic(topic: string | SyllabusTopic): SyllabusTopic {
  if (typeof topic === "string") {
    if (topic.startsWith("Objetivo:")) {
      return { title: topic.replace(/^Objetivo:\s*/, ""), kind: "objective" };
    }
    if (topic.startsWith("Funciones:")) {
      return { title: topic.replace(/^Funciones:\s*/, ""), kind: "functions" };
    }
    if (topic.startsWith("Problemas resueltos:")) {
      return { title: topic.replace(/^Problemas resueltos:\s*/, ""), kind: "problems" };
    }
    if (topic.startsWith("Aplicación integral:")) {
      return { title: topic.replace(/^Aplicación integral:\s*/, ""), kind: "project" };
    }
    const lower = topic.toLowerCase();
    if (lower.includes("proyecto") || lower.includes("capstone")) {
      return { title: topic, kind: "project" };
    }
    if (/\b(ia|ai|copilot|inteligencia artificial)\b/i.test(topic)) {
      return { title: topic, kind: "ai" };
    }
    return { title: topic, kind: "lesson" };
  }
  return { kind: "lesson", ...topic };
}

export function topicCount(module: SyllabusModule): number {
  return module.topics.length;
}

export function levelTopicCount(level: SyllabusLevelContent): number {
  return level.modules.reduce((sum, m) => sum + topicCount(m), 0);
}

export function levelHours(level: SyllabusLevelContent): number {
  const fromModules = level.modules.reduce((sum, m) => sum + (m.hours ?? 0), 0);
  if (fromModules > 0) return fromModules;
  // Parse "(16h)" or "(16 horas)" from shortLabel / titles
  const fromLabel = level.shortLabel?.match(/(\d+)\s*h/i);
  if (fromLabel) return Number(fromLabel[1]);
  return 0;
}

export function parseHoursFromTitle(title: string): number | undefined {
  const m = title.match(/\((\d+)\s*horas?\)/i) || title.match(/\((\d+)\s*h\)/i);
  return m ? Number(m[1]) : undefined;
}
