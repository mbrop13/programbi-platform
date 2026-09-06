/**
 * Tracking de origen de registro de miembros.
 * Guarda la ruta desde la que se registró la persona (comunidad, curso, etc.)
 * para mostrarla y filtrarla en el panel admin.
 */

export const REGISTRATION_SOURCE_KEY = "pb_registration_source";

/** Categorías usadas para filtrar en el admin */
export type RegistrationSourceCategory =
  | "all"
  | "comunidad"
  | "cursos"
  | "inicio"
  | "registro"
  | "blog"
  | "empresas"
  | "asesorias"
  | "gran-partido"
  | "webinar"
  | "pago"
  | "otros"
  | "desconocido";

export const REGISTRATION_SOURCE_FILTERS: {
  value: RegistrationSourceCategory;
  label: string;
}[] = [
  { value: "all", label: "Todos los orígenes" },
  { value: "comunidad", label: "Comunidad" },
  { value: "cursos", label: "Cursos" },
  { value: "inicio", label: "Inicio / Home" },
  { value: "registro", label: "Página de registro" },
  { value: "blog", label: "Blog / Newsletter" },
  { value: "empresas", label: "Empresas" },
  { value: "asesorias", label: "Asesorías" },
  { value: "gran-partido", label: "Gran Partido" },
  { value: "webinar", label: "Webinar" },
  { value: "pago", label: "Pago" },
  { value: "otros", label: "Otros" },
  { value: "desconocido", label: "Sin origen" },
];

const COURSE_TITLES: Record<string, string> = {
  "analisis-de-datos": "Análisis de Datos",
  "analitica-financiera": "Analítica Financiera",
  "analitica-mineria": "Analítica Minería",
  excel: "Excel",
  "power-bi": "Power BI",
  python: "Python",
  "sql-server": "SQL Server",
};

/**
 * Captura la ruta actual del navegador (pathname + search limpio).
 * Solo funciona en el cliente.
 */
export function captureRegistrationSource(): string {
  if (typeof window === "undefined") return "/";

  const path = window.location.pathname || "/";
  // Conservar query útil (ej. utm) pero limitar longitud
  const search = window.location.search || "";
  const full = `${path}${search}`;
  return full.slice(0, 500);
}

/**
 * Guarda el origen en sessionStorage (útil para OAuth y redirecciones).
 */
export function persistRegistrationSource(source?: string): string {
  const value = source || captureRegistrationSource();
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(REGISTRATION_SOURCE_KEY, value);
    }
  } catch {
    /* ignore */
  }
  return value;
}

/**
 * Lee el origen persistido (sessionStorage) o el actual.
 */
export function readRegistrationSource(): string {
  try {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(REGISTRATION_SOURCE_KEY);
      if (stored) return stored;
    }
  } catch {
    /* ignore */
  }
  return captureRegistrationSource();
}

/**
 * Normaliza el path (sin query) para clasificar.
 */
export function normalizeSourcePath(source: string | null | undefined): string {
  if (!source || !source.trim()) return "";
  try {
    // Si viene como URL completa, extraer pathname
    if (source.startsWith("http://") || source.startsWith("https://")) {
      return new URL(source).pathname || "/";
    }
  } catch {
    /* fall through */
  }
  return source.split("?")[0] || "/";
}

/**
 * Etiqueta legible para mostrar en el admin.
 */
export function formatRegistrationSource(source: string | null | undefined): string {
  if (!source || !source.trim()) return "Sin origen";

  const path = normalizeSourcePath(source);

  if (path === "/" || path === "") return "Inicio";
  if (path === "/registro") return "Página de registro";
  if (path === "/login") return "Login";
  if (path.startsWith("/comunidad")) return "Comunidad";
  if (path === "/cursos") return "Listado de cursos";
  if (path.startsWith("/cursos/")) {
    const slug = path.replace("/cursos/", "").split("/")[0];
    const title = COURSE_TITLES[slug] || slug.replace(/-/g, " ");
    return `Curso: ${title}`;
  }
  if (path.startsWith("/blog") || path.startsWith("/newsletter")) return "Blog / Newsletter";
  if (path.startsWith("/empresas")) return "Empresas";
  if (path.startsWith("/asesorias")) return "Asesorías";
  if (path.startsWith("/gran-partido")) return "Gran Partido";
  if (path.startsWith("/webinar")) return "Webinar";
  if (path.startsWith("/pago")) return "Pago";
  if (path.startsWith("/referidos")) return "Referidos";
  if (path.startsWith("/versus")) return "Versus";
  if (path.startsWith("/casos")) return "Casos";
  if (path.startsWith("/faq")) return "FAQ";
  if (path.startsWith("/nosotros")) return "Nosotros";
  if (path.startsWith("/admin")) return "Admin";
  if (path === "admin/empresas" || path.startsWith("admin/")) return "Creado por Admin (Empresas)";
  if (path === "admin-import") return "Importación Admin";

  // Fallback: mostrar path limpio
  return path;
}

/**
 * Categoría para filtrar en el admin.
 */
export function getRegistrationSourceCategory(
  source: string | null | undefined
): RegistrationSourceCategory {
  if (!source || !source.trim()) return "desconocido";

  const path = normalizeSourcePath(source);

  if (path === "/" || path === "") return "inicio";
  if (path === "/registro" || path === "/login") return "registro";
  if (path.startsWith("/comunidad")) return "comunidad";
  if (path.startsWith("/cursos")) return "cursos";
  if (path.startsWith("/blog") || path.startsWith("/newsletter")) return "blog";
  if (path.startsWith("/empresas")) return "empresas";
  if (path.startsWith("/asesorias")) return "asesorias";
  if (path.startsWith("/gran-partido")) return "gran-partido";
  if (path.startsWith("/webinar")) return "webinar";
  if (path.startsWith("/pago")) return "pago";

  return "otros";
}

/**
 * ¿El source coincide con el filtro de categoría?
 */
export function matchesRegistrationSourceFilter(
  source: string | null | undefined,
  filter: RegistrationSourceCategory
): boolean {
  if (filter === "all") return true;
  return getRegistrationSourceCategory(source) === filter;
}
