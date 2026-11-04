/**
 * Contexto de analítica deducido de la ruta.
 *
 * Todo evento de GA4 (click_whatsapp, click_registro, generate_lead, view_item,
 * cta_click…) lleva `country`, `page_type` y, cuando aplica, `course` y
 * `guide_slug`. Así una misma acción se puede cortar por mercado y por tipo de
 * página sin depender de convenciones distintas en cada componente.
 *
 * Se calcula desde `window.location.pathname`, que ya incluye el prefijo de país
 * (/ar/cursos/power-bi → country=ar), y cae a Chile cuando la ruta va en la raíz.
 */
import { esCursoConPrecio } from "@/config/pricing";
import { paisDesdeRuta } from "@/lib/paises/rutas";

export type AnalyticsContext = {
  country: string;
  page_type: string;
  course?: string;
  guide_slug?: string;
};

/** Landings comerciales por país que no cuelgan de /cursos. */
const LANDING_POR_CURSO: Record<string, string> = {
  "/curso-power-bi": "power-bi",
  "/curso-python": "python",
  "/curso-sql-online": "sql-server",
  "/curso-power-bi-vs-pack-adopcion": "power-bi",
};

function segmentos(pathname: string): string[] {
  return pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
}

/** Slug de curso a partir de /cursos/<slug> o de una landing /curso-*. */
function cursoDesdeSegmentos(parts: string[]): string | undefined {
  const cursosAt = parts.indexOf("cursos");
  if (cursosAt >= 0 && parts[cursosAt + 1]) {
    const slug = parts[cursosAt + 1];
    if (esCursoConPrecio(slug)) return slug;
  }
  const resto = `/${parts.join("/")}`;
  for (const [prefijo, slug] of Object.entries(LANDING_POR_CURSO)) {
    if (resto === prefijo || resto.startsWith(`${prefijo}/`)) return slug;
  }
  return undefined;
}

/** Tipo de página: home, curso, cursos, guia, guia_indice, blog, precios, landing, faq, auth, otro. */
export function tipoDePagina(parts: string[]): string {
  if (parts.length === 0) return "home";
  const primero = parts[0];
  const segundo = parts[1];

  if (primero === "guias") return parts.length === 1 ? "guia_indice" : "guia";
  if (segundo === "guias") return parts.length === 2 ? "guia_indice" : "guia";

  if (primero === "cursos") return parts.length === 1 ? "cursos" : "curso";
  if (segundo === "cursos") return parts.length === 2 ? "cursos" : "curso";

  if (primero === "blog") return "blog";
  if (primero === "precios" || segundo === "precios") return "precios";
  if (primero === "preguntas-frecuentes" || primero === "faq") return "faq";
  if (primero === "registro" || primero === "login") return "auth";

  const resto = `/${parts.join("/")}`;
  for (const prefijo of Object.keys(LANDING_POR_CURSO)) {
    if (resto === prefijo || resto.startsWith(`${prefijo}/`)) return "landing";
  }
  if (
    primero === "empresas" ||
    primero === "implementacion-power-bi" ||
    primero === "migrar-excel-a-power-bi" ||
    primero === "por-que-fallan-proyectos-power-bi"
  ) {
    return "landing";
  }
  return "otro";
}

/** Slug de la guía cuando la página es una guía. */
function guiaDesdeSegmentos(parts: string[]): string | undefined {
  const guiasAt = parts.indexOf("guias");
  if (guiasAt < 0 || guiasAt !== parts.length - 2) return undefined;
  return parts[guiasAt + 1] || undefined;
}

/** Contexto completo a partir de una ruta (por defecto, la actual). */
export function analyticsContext(pathname?: string | null): AnalyticsContext {
  const path =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const parts = segmentos(path);
  const country = paisDesdeRuta(`/${parts.join("/")}`) || "cl";
  const page_type = tipoDePagina(parts);
  const course = cursoDesdeSegmentos(parts);
  const guide_slug = page_type === "guia" ? guiaDesdeSegmentos(parts) : undefined;
  return { country, page_type, ...(course ? { course } : {}), ...(guide_slug ? { guide_slug } : {}) };
}
