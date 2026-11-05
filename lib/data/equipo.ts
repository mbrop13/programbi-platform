import { mentors, type Mentor } from "@/lib/data/mentors";

/**
 * Fuente única del equipo docente de ProgramBI.
 *
 * Los datos personales salen de `lib/data/mentors.ts`, que ya alimenta la home
 * y /nosotros. Aquí se normalizan a los campos que consumen /profesores, el
 * JSON-LD y el instructor de cada curso. No se agrega ningún dato que no exista
 * en el repo: lo que falta queda en `null` y con su TODO_MANU.
 */

export interface MiembroEquipo {
  /** Slug público de la ficha: /profesores/<slug>. */
  slug: string;
  nombre: string;
  /** Rol corto, como se muestra en las tarjetas («CEO ProgramBI»). */
  rol: string;
  /** Cargo o título profesional («Fundador y Director»). */
  cargo: string;
  credenciales: string[];
  /** Trayectoria profesional ya publicada en `mentors.ts` (hoy solo el fundador). */
  trayectoria: string[];
  /** Biografía larga. `null` mientras no exista un texto real. */
  bio: string | null;
  linkedinUrl: string | null;
  imageUrl: string | null;
  esFundador: boolean;
  /** Slugs de los cursos que dicta, tomados de `specialtyCourses`. */
  cursos: string[];
  orden: number;
}

/**
 * El slug forma parte de la URL pública, así que se declara explícito y no se
 * deriva del nombre. Si mañana se suma una persona sin entrada aquí, se genera
 * un slug razonable para no romper el build.
 */
const SLUG_POR_PERSONA: Record<string, string> = {
  "Manuel Oliva": "manuel-oliva",
  "Emanuel Berrocal": "emanuel-berrocal",
  "Rodrigo Vega": "rodrigo-vega",
};

function aSlug(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function aMiembro(mentor: Mentor): MiembroEquipo {
  return {
    slug: SLUG_POR_PERSONA[mentor.name] ?? aSlug(mentor.name),
    nombre: mentor.name,
    rol: mentor.role,
    cargo: mentor.title,
    credenciales: mentor.credentials,
    trayectoria: mentor.founderCareer ?? [],
    bio: mentor.founderBio ?? null,
    linkedinUrl: mentor.linkedinUrl ?? null,
    imageUrl: mentor.imageUrl ?? null,
    esFundador: mentor.isFounder,
    cursos: mentor.specialtyCourses ?? [],
    orden: mentor.sortOrder,
  };
}

/**
 * TODO_MANU: faltan las biografías de Emanuel Berrocal y Rodrigo Vega, y no hay
 * bio corta para las tarjetas. Hasta que existan, `bio` queda en `null` y las
 * páginas muestran «Perfil en preparación». No se inventa texto.
 *
 * TODO_MANU: Joaquín Villagra solo aparece en un testimonio
 * (`lib/data/testimonials.ts`): no hay cargo, bio, LinkedIn ni foto, así que no
 * tiene ficha. Si Manu confirma esos datos, agregarlo a `mentors.ts` y aquí
 * aparece solo.
 */
export const EQUIPO: MiembroEquipo[] = [...mentors]
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map(aMiembro);

/**
 * ¿Están completos todos los perfiles? Solo cuenta lo que se publica: bio,
 * LinkedIn y foto. Hoy da `false` porque faltan dos biografías.
 */
export function equipoCompleto(): boolean {
  return (
    EQUIPO.length > 0 &&
    EQUIPO.every((miembro) => Boolean(miembro.bio && miembro.linkedinUrl && miembro.imageUrl))
  );
}

/**
 * Flag de publicación de /profesores. Se lee de entorno para no tocar código el
 * día que Manu complete los perfiles (no se edita `config/flags.ts`).
 *
 * TODO_MANU: encender con NEXT_PUBLIC_EQUIPO_PUBLICADO=1 cuando estén las tres
 * biografías. Mientras siga apagado, las páginas responden 200 pero con
 * `robots: noindex, follow` y un aviso de que el equipo está en preparación.
 */
export const EQUIPO_PUBLICADO = process.env.NEXT_PUBLIC_EQUIPO_PUBLICADO === "1";

/** Ruta pública de la ficha de una persona. */
export function rutaPerfil(slug: string): string {
  return `/profesores/${slug}`;
}

export function getMiembroPorSlug(slug: string): MiembroEquipo | undefined {
  return EQUIPO.find((miembro) => miembro.slug === slug);
}

/** Fundador del equipo; hoy Manuel Oliva. */
export function fundadorEquipo(): MiembroEquipo {
  return EQUIPO.find((miembro) => miembro.esFundador) ?? EQUIPO[0];
}

/**
 * Profesor que dicta un curso. Si ninguno lo declara en `cursos`, cae en el
 * fundador (es quien dicta el resto). Si varios coinciden, gana el de menor
 * `orden`, que es el orden en que se listan las fichas.
 */
export function miembroPorCurso(cursoSlug: string): MiembroEquipo {
  return EQUIPO.find((miembro) => miembro.cursos.includes(cursoSlug)) ?? fundadorEquipo();
}
