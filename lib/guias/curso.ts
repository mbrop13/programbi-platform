import { courses } from "@/lib/data/courses";
import { rutaLocal } from "@/lib/paises/rutas";

/**
 * Datos de la ficha del curso que usan las guías (duración, nombre, imagen,
 * próximo inicio).
 *
 * Ojo con la duración: `lib/data/courses.ts` guarda 16 h por nivel para
 * Power BI, Python, SQL Server y Excel, pero el texto publicado en las
 * landings y en las guías dice 20 h. Acá se usa el dato publicado para que la
 * guía no se contradiga a sí misma; unificar ficha y textos queda pendiente de
 * Manu.
 */
export type FichaCursoGuia = {
  slug: string;
  nombre: string;
  /** Horas publicadas; `null` si el curso no está en el catálogo. */
  horas: number | null;
  /** «20 horas por nivel», «60 horas por nivel», «30 horas en vivo». */
  horasTexto: string;
  /** ¿El curso se vende por niveles? Cambia la etiqueta del precio. */
  porNivel: boolean;
  /** Fecha de inicio publicada, o `null` si la ficha dice «Cupos abiertos — consulta fecha». */
  inicio: string | null;
  imagen: string;
  accentColor: string;
};

const HORAS_PUBLICADAS: Record<string, { horas: number; inicio: string | null }> = {
  "power-bi": { horas: 20, inicio: "lunes 23 de noviembre de 2026" },
  python: { horas: 20, inicio: "lunes 23 de noviembre de 2026" },
  "sql-server": { horas: 20, inicio: "martes 24 de noviembre de 2026" },
  excel: { horas: 20, inicio: null },
  claude: { horas: 20, inicio: "lunes 23 de noviembre de 2026" },
  copilot: { horas: 20, inicio: null },
  "ia-productividad": { horas: 20, inicio: null },
  "power-automate": { horas: 20, inicio: null },
  access: { horas: 20, inicio: null },
  "machine-learning": { horas: 20, inicio: null },
  "analitica-mineria": { horas: 20, inicio: null },
  "analisis-de-datos": { horas: 60, inicio: "lunes 23 de noviembre de 2026" },
  "mercado-financiero": { horas: 30, inicio: null },
};

export function fichaCurso(slug: string): FichaCursoGuia {
  const curso = courses.find((item) => item.slug === slug);
  const publicado = HORAS_PUBLICADAS[slug];
  const horas = publicado?.horas ?? curso?.durationHours ?? null;
  const porNivel = (curso?.levels?.length ?? 0) > 1;
  return {
    slug,
    nombre: curso?.title ?? slug,
    horas,
    horasTexto:
      horas == null ? "20 a 60 horas en vivo" : porNivel ? `${horas} horas por nivel` : `${horas} horas en vivo`,
    porNivel,
    inicio: publicado?.inicio ?? null,
    imagen: curso?.imageUrl ?? "/images/courses/power-bi-card.webp",
    accentColor: curso?.accentColor ?? "#171716",
  };
}

/** Ruta de la ficha del curso en el mercado de la guía. */
export function rutaFichaCurso(iso: string, slug: string): string {
  return rutaLocal(iso, `/cursos/${slug}`);
}

/**
 * Cursos de la ruta de aprendizaje de datos, en orden. Se usa en el componente
 * `RutaAprendizaje` de las guías.
 */
export const RUTA_DATOS = [
  { curso: "excel", nombre: "Excel", detalle: "Planillas y tablas dinámicas" },
  { curso: "sql-server", nombre: "SQL Server", detalle: "Extraer datos de la base" },
  { curso: "power-bi", nombre: "Power BI", detalle: "Modelar y armar tableros" },
  { curso: "python", nombre: "Python", detalle: "Automatizar y analizar" },
  { curso: "analisis-de-datos", nombre: "Análisis de datos", detalle: "El programa completo" },
] as const;

export function pasoDeRuta(curso: string): number {
  return RUTA_DATOS.findIndex((paso) => paso.curso === curso);
}
