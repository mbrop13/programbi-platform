import { PAISES } from "@/config/paises";
import { getCourseBySlug } from "@/lib/data/courses";
import { cursosConGuia } from "@/lib/guias";
import type { ConteoPais, Opcion } from "@/lib/guias/hub";
import type { Guia } from "@/lib/guias/tipos";

/** El archivo mal clasificado de preguntas frecuentes usa este curso ficticio. */
const CURSO_GENERAL = "general";

const ORDEN_PAIS = new Map(PAISES.map((pais, posicion) => [pais.iso, posicion]));

/**
 * Cursos con al menos una guía, en orden editorial. La membresía sale de
 * `cursosConGuia()` (la fuente real de guías) y el nombre y la prioridad de
 * `lib/data/courses.ts`: los cursos de portada van primero y el resto sigue el
 * `sortOrder` del catálogo. Así no hay una lista de cursos paralela que se
 * desactualice cuando se publica un curso nuevo.
 */
let ordenCursosCache: string[] | null = null;

export function cursosDelHub(): string[] {
  if (ordenCursosCache) return ordenCursosCache;
  const conGuia = cursosConGuia();
  const aparicion = new Map(conGuia.map((slug, posicion) => [slug, posicion]));
  ordenCursosCache = [...conGuia].sort((a, b) => {
    const cursoA = getCourseBySlug(a);
    const cursoB = getCourseBySlug(b);
    const destacadoA = cursoA?.isFeatured ? 0 : 1;
    const destacadoB = cursoB?.isFeatured ? 0 : 1;
    return (
      destacadoA - destacadoB ||
      (cursoA?.sortOrder ?? 99) - (cursoB?.sortOrder ?? 99) ||
      (aparicion.get(a) ?? 99) - (aparicion.get(b) ?? 99)
    );
  });
  return ordenCursosCache;
}

/** Nombre visible de un curso. `general` es el cajón de las guías sin curso. */
export function nombreCurso(curso: string): string {
  if (curso === CURSO_GENERAL) return "Guías generales";
  const ficha = getCourseBySlug(curso);
  if (ficha) return ficha.title;
  const texto = curso.replace(/-/g, " ");
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function esCursoDestacado(curso: string): boolean {
  return getCourseBySlug(curso)?.isFeatured === true;
}

function indiceCurso(curso: string): number {
  const orden = cursosDelHub();
  const posicion = orden.indexOf(curso);
  return posicion === -1 ? orden.length : posicion;
}

/** Posición del país en config/paises.ts. Latinoamérica va al final. */
export function ordenPais(iso: string): number {
  if (iso === "transversal") return PAISES.length + 1;
  return ORDEN_PAIS.get(iso) ?? PAISES.length;
}

/** Opciones del filtro de país, solo con mercados que tienen guías. */
export function opcionesPais(guias: Guia[]): Opcion[] {
  const conteo = new Map<string, number>();
  for (const guia of guias) {
    conteo.set(guia.country, (conteo.get(guia.country) ?? 0) + 1);
  }
  const opciones: Opcion[] = PAISES.filter((pais) => conteo.has(pais.iso)).map((pais) => ({
    valor: pais.iso,
    etiqueta: pais.nombre,
    cantidad: conteo.get(pais.iso) ?? 0,
  }));
  if (conteo.has("transversal")) {
    opciones.push({
      valor: "transversal",
      etiqueta: "Latinoamérica",
      cantidad: conteo.get("transversal") ?? 0,
    });
  }
  return opciones;
}

/**
 * Opciones del filtro de curso. Los cursos del catálogo salen de
 * `cursosDelHub()`; cualquier curso desconocido que aparezca en los datos
 * (por ejemplo, `general`) se agrega al final para no perder guías.
 */
export function opcionesCurso(guias: Guia[]): Opcion[] {
  const conteo = new Map<string, number>();
  for (const guia of guias) {
    conteo.set(guia.course, (conteo.get(guia.course) ?? 0) + 1);
  }
  const conocidos = cursosDelHub().filter((curso) => conteo.has(curso));
  const desconocidos = [...conteo.keys()]
    .filter((curso) => !conocidos.includes(curso))
    .sort((a, b) => {
      if (a === CURSO_GENERAL) return 1;
      if (b === CURSO_GENERAL) return -1;
      return indiceCurso(a) - indiceCurso(b) || nombreCurso(a).localeCompare(nombreCurso(b), "es");
    });
  return [...conocidos, ...desconocidos].map((curso) => ({
    valor: curso,
    etiqueta: nombreCurso(curso),
    cantidad: conteo.get(curso) ?? 0,
    destacado: esCursoDestacado(curso),
  }));
}

/**
 * Curso principal del país: el que tiene más guías. Los empates se resuelven
 * con el orden editorial del catálogo (estable). Es el enlace que se lleva el
 * CTA de la ficha del curso.
 */
export function cursoPrincipal(guias: Guia[]): Opcion | undefined {
  const cursos = opcionesCurso(guias).filter((curso) => curso.valor !== CURSO_GENERAL);
  return [...cursos].sort((a, b) => (b.cantidad ?? 0) - (a.cantidad ?? 0))[0];
}

/** Lista corta de cursos para una meta description, ordenada por cantidad. */
function listaCursos(guias: Guia[], max: number): { nombres: string; resto: number } {
  const cursos = [...opcionesCurso(guias)]
    .filter((curso) => curso.valor !== CURSO_GENERAL)
    .sort((a, b) => (b.cantidad ?? 0) - (a.cantidad ?? 0));
  const top = cursos.slice(0, max).map((curso) => curso.etiqueta);
  if (top.length === 0) return { nombres: "datos", resto: 0 };
  if (top.length === 1) return { nombres: top[0], resto: Math.max(0, cursos.length - 1) };
  return {
    nombres: `${top.slice(0, -1).join(", ")} y ${top[top.length - 1]}`,
    resto: Math.max(0, cursos.length - top.length),
  };
}

/**
 * Meta description del índice de país. Cubre todos los cursos publicados (no
 * solo Power BI) y se mantiene cerca de los 155 caracteres.
 */
export function descripcionIndicePais(guias: Guia[], nombrePais: string): string {
  const { nombres, resto } = listaCursos(guias, 3);
  const cantidad = `${guias.length} ${guias.length === 1 ? "guía" : "guías"}`;
  const restoTexto = resto > 0 ? ` y ${resto} ${resto === 1 ? "curso más" : "cursos más"}` : "";
  return `${cantidad} de datos en ${nombrePais}: ${nombres}${restoTexto}. Rutas de estudio, sueldos, precios locales y curso en vivo.`;
}

/** Fecha ISO más reciente del listado, para el «Actualizado» visible. */
export function fechaMasReciente(guias: Guia[]): string {
  return guias.reduce((ultima, guia) => (guia.updated > ultima ? guia.updated : ultima), "");
}

/** Cantidad de guías por país, en el orden de config/paises.ts. */
export function paisesConConteo(guias: Guia[]): ConteoPais[] {
  const conteo = new Map<string, number>();
  for (const guia of guias) {
    if (guia.country === "transversal") continue;
    conteo.set(guia.country, (conteo.get(guia.country) ?? 0) + 1);
  }
  return PAISES.filter((pais) => conteo.has(pais.iso)).map((pais) => ({
    iso: pais.iso,
    nombre: pais.nombre,
    cantidad: conteo.get(pais.iso) ?? 0,
  }));
}
