/**
 * Primera clase pública de cada curso, publicada en el canal de YouTube.
 * Solo entran las clases que Manu confirmó. El resto de cursos no inventa un video.
 */
export interface FreeClass {
  videoId: string;
  /** Nombre corto que se lee en la ficha. */
  title: string;
  /** Título real del video, para el reproductor y lectores de pantalla. */
  videoTitle: string;
  /** Dato corto al lado del título. No inventar una duración que el video no declara. */
  length: string;
  /** Una línea bajo el reproductor. */
  note: string;
}

export const FREE_CLASSES: Record<string, FreeClass> = {
  "power-bi": {
    videoId: "LBjYkdFpKxc",
    title: "Power BI para principiantes",
    videoTitle: "Curso de Power BI para principiantes 2026 (parte 1)",
    length: "Parte 1",
    note: "La primera clase, completa y sin cuenta. El resto del curso está en el campus.",
  },
  "analisis-de-datos": {
    videoId: "LBjYkdFpKxc",
    title: "Power BI para principiantes",
    videoTitle: "Curso de Power BI para principiantes 2026 (parte 1)",
    length: "Parte 1",
    note: "Así empieza el programa: la primera clase de Power BI, completa y sin cuenta.",
  },
  python: {
    videoId: "eFzPRidlzxk",
    title: "Python para principiantes",
    videoTitle: "Clase Python Para Principiantes 2 horas (2026)",
    length: "2 horas",
    note: "La primera clase, completa y sin cuenta. El resto del curso está en el campus.",
  },
  "sql-server": {
    videoId: "9WBTHDYEHlQ",
    title: "SQL desde cero",
    videoTitle: "Curso de SQL Clase 1 de 2 horas desde 0",
    length: "2 horas",
    note: "La primera clase, completa y sin cuenta. El resto del curso está en el campus.",
  },
};

export function getFreeClass(slug: string): FreeClass | null {
  return FREE_CLASSES[slug] ?? null;
}
