import type { Course } from "@/lib/data/courses";
import type { CourseSyllabusData, SyllabusLevelContent } from "./types";
import { powerBiSyllabus } from "./power-bi";
import { excelSyllabus } from "./excel";
import { pythonSyllabus } from "./python";
import { sqlServerSyllabus } from "./sql-server";
import { analisisDeDatosSyllabus } from "./analisis-de-datos";
import { analiticaFinancieraSyllabus } from "./analitica-financiera";
import { analiticaMineriaSyllabus } from "./analitica-mineria";

const dedicatedSyllabuses: Record<string, CourseSyllabusData> = {
  "power-bi": powerBiSyllabus,
  excel: excelSyllabus,
  python: pythonSyllabus,
  "sql-server": sqlServerSyllabus,
  "analisis-de-datos": analisisDeDatosSyllabus,
  "analitica-financiera": analiticaFinancieraSyllabus,
  "analitica-mineria": analiticaMineriaSyllabus,
};

/** Build a full syllabus from the coarse course.syllabus fallback. */
export function buildSyllabusFromCourse(course: Course): CourseSyllabusData {
  const hasLevels = Boolean(course.levels && course.levels.length > 0);

  if (hasLevels && course.syllabus.length === course.levels!.length) {
    // One syllabus module per level → map 1:1
    const levels: SyllabusLevelContent[] = course.levels!.map((lvl, idx) => {
      const mod = course.syllabus[idx];
      return {
        id: `nivel${idx + 1}`,
        label: lvl.name.startsWith("Nivel") ? lvl.name : `Nivel: ${lvl.name}`,
        shortLabel: lvl.durationHours ? `${lvl.durationHours}h` : undefined,
        theme: course.accentColor,
        modules: [
          {
            id: `m-${idx}`,
            title: mod?.module ?? lvl.name,
            hours: mod?.hours ?? lvl.durationHours,
            topics: mod?.topics ?? [],
          },
        ],
      };
    });
    return {
      slug: course.slug,
      accent: course.accentColor,
      programYear: "2026",
      levels,
    };
  }

  // Single-level or multi-module course: all modules under one level
  return {
    slug: course.slug,
    accent: course.accentColor,
    programYear: "2026",
    levels: [
      {
        id: "nivel1",
        label: course.level || "Plan de estudios",
        shortLabel: `${course.durationHours}h`,
        theme: course.accentColor,
        modules: course.syllabus.map((mod, idx) => ({
          id: `m-${idx}`,
          title: mod.module,
          hours: mod.hours,
          topics: mod.topics,
        })),
      },
    ],
  };
}

export function getCourseSyllabus(course: Course): CourseSyllabusData {
  return dedicatedSyllabuses[course.slug] ?? buildSyllabusFromCourse(course);
}

export function getSyllabusLevel(
  data: CourseSyllabusData,
  selectedLevel: number
): SyllabusLevelContent {
  const idx = Math.min(Math.max(selectedLevel, 0), data.levels.length - 1);
  return data.levels[idx] ?? data.levels[0];
}

export * from "./types";
