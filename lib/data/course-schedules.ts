// Course schedule types and helpers

export interface CourseSchedule {
  id: string;
  course_slug: string;
  level_name: string;
  start_date: string; // ISO date
  schedule_days: string; // e.g. "Martes y Jueves"
  schedule_time: string; // e.g. "19:30 a 21:30"
  duration_hours: number;
  is_active: boolean;
  max_students?: number;
}

// Fallback static schedules (used if DB not available)
export const staticSchedules: Omit<CourseSchedule, 'id'>[] = [
  {
    course_slug: "power-bi",
    level_name: "Básico",
    start_date: "2026-05-05",
    schedule_days: "Martes y Jueves",
    schedule_time: "19:30 a 21:30",
    duration_hours: 16,
    is_active: true,
  },
  {
    course_slug: "sql-server",
    level_name: "Básico",
    start_date: "2026-04-20",
    schedule_days: "Lunes y Miércoles",
    schedule_time: "19:30 a 21:30",
    duration_hours: 16,
    is_active: true,
  },
  {
    course_slug: "python",
    level_name: "Básico",
    start_date: "2026-05-18",
    schedule_days: "Lunes y Miércoles",
    schedule_time: "19:30 a 21:30",
    duration_hours: 16,
    is_active: true,
  },
];

// Cursos que son parte del programa "Análisis de Datos"
export const analisisDeDatosSlugs = ["sql-server", "power-bi", "python"];

export function formatScheduleDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00"); // Avoid timezone issues
  return date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  });
}

// Get the nearest start date from a list of schedules
export function getNearestSchedule(schedules: CourseSchedule[]): CourseSchedule | null {
  const now = new Date();
  const future = schedules
    .filter(s => new Date(s.start_date + "T12:00:00") >= now && s.is_active)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  return future[0] || null;
}
