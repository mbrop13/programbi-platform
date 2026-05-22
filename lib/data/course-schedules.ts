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
    start_date: "2026-06-09",
    schedule_days: "Martes y Jueves",
    schedule_time: "19:30 a 21:30",
    duration_hours: 16,
    is_active: true,
  },
  {
    course_slug: "sql-server",
    level_name: "Básico",
    start_date: "2026-06-22",
    schedule_days: "Lunes y Miércoles",
    schedule_time: "19:30 a 21:30",
    duration_hours: 16,
    is_active: true,
  },
  {
    course_slug: "python",
    level_name: "Básico",
    start_date: "2026-05-25",
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

export interface CountryConfig {
  code: string; // ISO 2-letter code in lowercase
  name: string;
  timeZone: string;
  currencyCode?: string;
}

export const SCHEDULE_COUNTRIES: CountryConfig[] = [
  { code: "cl", name: "Chile", timeZone: "America/Santiago", currencyCode: "CLP" },
  { code: "co", name: "Colombia", timeZone: "America/Bogota", currencyCode: "COP" },
  { code: "pe", name: "Perú", timeZone: "America/Lima", currencyCode: "PEN" },
  { code: "mx", name: "México", timeZone: "America/Mexico_City", currencyCode: "MXN" },
  { code: "ar", name: "Argentina", timeZone: "America/Argentina/Buenos_Aires", currencyCode: "ARS" },
  { code: "es", name: "España", timeZone: "Europe/Madrid", currencyCode: "EUR" },
  { code: "us", name: "EE.UU. (EST)", timeZone: "America/New_York", currencyCode: "USD" },
  { code: "ec", name: "Ecuador", timeZone: "America/Guayaquil", currencyCode: "USD" },
  { code: "pa", name: "Panamá", timeZone: "America/Panama", currencyCode: "USD" },
  { code: "ve", name: "Venezuela", timeZone: "America/Caracas", currencyCode: "USD" },
  { code: "uy", name: "Uruguay", timeZone: "America/Montevideo", currencyCode: "USD" },
  { code: "py", name: "Paraguay", timeZone: "America/Asuncion", currencyCode: "USD" },
  { code: "bo", name: "Bolivia", timeZone: "America/La_Paz", currencyCode: "USD" },
  { code: "gt", name: "Guatemala", timeZone: "America/Guatemala", currencyCode: "USD" },
  { code: "cr", name: "Costa Rica", timeZone: "America/Costa_Rica", currencyCode: "USD" },
  { code: "sv", name: "El Salvador", timeZone: "America/El_Salvador", currencyCode: "USD" },
  { code: "hn", name: "Honduras", timeZone: "America/Tegucigalpa", currencyCode: "USD" },
  { code: "ni", name: "Nicaragua", timeZone: "America/Managua", currencyCode: "USD" },
  { code: "do", name: "Rep. Dominicana", timeZone: "America/Santo_Domingo", currencyCode: "USD" },
];

export interface ConvertedScheduleResult {
  time: string;
  date: string;
  days: string;
  dateFormatted: string;
  isShifted: boolean;
}

export function convertSchedule(
  startDateStr: string, // "2026-06-09"
  scheduleTimeStr: string, // "19:30 a 21:30"
  scheduleDaysStr: string, // "Martes y Jueves"
  targetTimeZone: string // "America/Bogota"
): ConvertedScheduleResult {
  const sourceTimeZone = "America/Santiago";

  // Parse time
  const timeMatch = scheduleTimeStr.match(/(\d{1,2}):(\d{2})\s*(?:a|y|-)\s*(\d{1,2}):(\d{2})/i);
  if (!timeMatch) {
    // If layout is different, return original values as fallback
    const dateParts = startDateStr.split("-").map(n => parseInt(n, 10));
    let fallbackFormatted = startDateStr;
    if (dateParts.length === 3) {
      const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], 12, 0));
      fallbackFormatted = date.toLocaleDateString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: targetTimeZone
      });
    }
    return {
      time: scheduleTimeStr,
      date: startDateStr,
      days: scheduleDaysStr,
      dateFormatted: fallbackFormatted,
      isShifted: false
    };
  }

  const [_, shStr, smStr, ehStr, emStr] = timeMatch;
  const startHour = parseInt(shStr, 10);
  const startMinute = parseInt(smStr, 10);
  const endHour = parseInt(ehStr, 10);
  const endMinute = parseInt(emStr, 10);

  // Helper to create a UTC date from local date components in a source timezone
  const createDateInTz = (dateStr: string, hour: number, minute: number, timeZone: string): Date => {
    const [year, month, day] = dateStr.split("-").map(num => parseInt(num, 10));
    
    // Construct UTC date
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
    
    // Find parts in source timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false
    });
    
    const parts = formatter.formatToParts(utcDate);
    const dateParts: Record<string, number> = {};
    parts.forEach(p => {
      if (p.type !== 'literal') {
        dateParts[p.type] = parseInt(p.value, 10);
      }
    });
    
    const localTzAsUtc = Date.UTC(
      dateParts.year,
      dateParts.month - 1,
      dateParts.day,
      dateParts.hour,
      dateParts.minute
    );
    
    const offsetMs = localTzAsUtc - utcDate.getTime();
    return new Date(utcDate.getTime() - offsetMs);
  };

  const classStartUtc = createDateInTz(startDateStr, startHour, startMinute, sourceTimeZone);
  const classEndUtc = createDateInTz(startDateStr, endHour, endMinute, sourceTimeZone);

  const formatTzTime = (d: Date, tz: string) => {
    return d.toLocaleTimeString("es-CL", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  const formatTzDate = (d: Date, tz: string) => {
    return d.toLocaleDateString("es-CL", {
      timeZone: tz,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const targetStartTimeStr = formatTzTime(classStartUtc, targetTimeZone);
  const targetEndTimeStr = formatTzTime(classEndUtc, targetTimeZone);
  const targetTimeRange = `${targetStartTimeStr} a ${targetEndTimeStr}`;

  const getWeekdayIndex = (d: Date, tz: string) => {
    const daySource = d.toLocaleDateString("en-US", { timeZone: tz, weekday: "short" });
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekdays.indexOf(daySource);
  };

  const sourceDayIndex = getWeekdayIndex(classStartUtc, sourceTimeZone);
  const targetDayIndex = getWeekdayIndex(classStartUtc, targetTimeZone);

  let diffDays = targetDayIndex - sourceDayIndex;
  if (diffDays < -3) diffDays += 7;
  if (diffDays > 3) diffDays -= 7;

  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  
  const shiftDayName = (dayName: string, shift: number): string => {
    const cleanName = dayName.trim().toLowerCase();
    const findIndex = (name: string) => {
      if (name.includes("dom")) return 0;
      if (name.includes("lun")) return 1;
      if (name.includes("mar")) return 2;
      if (name.includes("mi")) return 3;
      if (name.includes("jue")) return 4;
      if (name.includes("vie")) return 5;
      if (name.includes("sab") || name.includes("sáb")) return 6;
      return -1;
    };

    const idx = findIndex(cleanName);
    if (idx === -1) return dayName;

    const newIdx = (idx + shift + 7) % 7;
    const isCapitalized = dayName.charAt(0) === dayName.charAt(0).toUpperCase();
    const result = dayNames[newIdx];
    return isCapitalized ? result : result.toLowerCase();
  };

  let targetDaysStr = scheduleDaysStr;
  if (diffDays !== 0) {
    const parts = scheduleDaysStr.split(/(\b(?:Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Sábados|Domingo|lunes|martes|miércoles|jueves|viernes|sábado|sábados|domingo)\b)/);
    targetDaysStr = parts.map(part => {
      const trimmed = part.trim().toLowerCase();
      if (trimmed.includes("lun") || trimmed.includes("mar") || trimmed.includes("mi") || trimmed.includes("jue") || trimmed.includes("vie") || trimmed.includes("sab") || trimmed.includes("sáb") || trimmed.includes("dom")) {
        return shiftDayName(part, diffDays);
      }
      return part;
    }).join("");
  }

  const targetDateFormatted = formatTzDate(classStartUtc, targetTimeZone);
  const targetDateISO = classStartUtc.toLocaleDateString("sv-SE", { timeZone: targetTimeZone });

  return {
    time: targetTimeRange,
    date: targetDateISO,
    days: targetDaysStr,
    dateFormatted: targetDateFormatted,
    isShifted: diffDays !== 0
  };
}

