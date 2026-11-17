import {
  analisisDeDatosSlugs,
  getNearestSchedule,
  type CourseSchedule,
} from "@/lib/data/course-schedules";
import { getActiveSchedules } from "@/lib/supabase/comunidad-ai";

/**
 * Próxima cohorte real de un curso, para los llamados de las guías.
 *
 * Las guías son 100 % estáticas (`revalidate = false`): esta consulta corre al
 * construir el sitio, no en cada visita, así que no suma regeneraciones ni CPU
 * en Vercel. La fecha queda fija hasta el siguiente deploy; por eso el cliente
 * la revisa con `InicioVigente` y, si ya pasó, vuelve al texto «Cupos
 * abiertos — consulta fecha» en vez de anunciar una clase que ya empezó.
 */
export type InicioGuia = {
  /** Fecha de inicio en formato `YYYY-MM-DD`. */
  fecha: string;
  /** «lunes 7 de diciembre», ya formateada en el servidor. */
  texto: string;
};

/** Una sola consulta por proceso de build, compartida por todas las guías. */
const VIGENCIA_MS = 10 * 60 * 1000;
let memo: { at: number; horarios: Promise<CourseSchedule[]> } | null = null;

function horariosActivos(): Promise<CourseSchedule[]> {
  if (!memo || Date.now() - memo.at > VIGENCIA_MS) {
    memo = {
      at: Date.now(),
      // Sin horarios (o sin base de datos en el build) la guía conserva el
      // texto de cupos abiertos: nunca se rompe por esto.
      horarios: (getActiveSchedules() as Promise<CourseSchedule[]>).catch(() => []),
    };
  }
  return memo.horarios;
}

function textoDeFecha(fecha: string): string {
  return new Date(`${fecha}T12:00:00`)
    .toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })
    .replace(",", "");
}

/**
 * Cohorte más cercana del nivel de entrada (la misma fecha que abre la ficha
 * del curso). Si el curso no tiene básico publicado, la más cercana de
 * cualquier nivel. `null` cuando no hay fecha futura.
 */
export async function proximoInicioDeCurso(slug: string): Promise<InicioGuia | null> {
  if (slug === "general") return null;
  const esPack = slug === "analisis-de-datos";
  const slugs: readonly string[] = esPack ? analisisDeDatosSlugs : [slug];
  const propias = (await horariosActivos())
    .filter((s) => slugs.includes(s.course_slug))
    .map((s) => ({ ...s, is_active: s.is_active !== false }));
  const cercana =
    getNearestSchedule(propias.filter((s) => s.level_name === "Básico")) ??
    (esPack ? null : getNearestSchedule(propias));
  if (!cercana) return null;
  return { fecha: cercana.start_date, texto: textoDeFecha(cercana.start_date) };
}
