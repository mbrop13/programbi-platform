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
 * TODO_MANU: faltan las biografías de Emanuel Berrocal y Rodrigo Vega. Ya no
 * bloquean la publicación: su ficha se arma con los datos reales que existen
 * (rol, cargo, credenciales, cursos, foto y LinkedIn). Cuando Manu entregue los
 * textos, se agregan en `lib/data/mentors.ts` y aparecen solos en la ficha y en
 * `Person.description` del JSON-LD. No se inventa texto.
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
 * Publicación por miembro, en código: no depende de variables de entorno de
 * Vercel. Un perfil es indexable cuando tiene lo mínimo verificable para ser
 * una ficha de entidad: nombre, rol, al menos una credencial real y foto.
 *
 * La bio larga es opcional a propósito: las fichas se arman con los hechos ya
 * publicados en `mentors.ts` y nunca con texto de relleno.
 */
export function perfilIndexable(miembro: MiembroEquipo): boolean {
  return (
    miembro.nombre.trim().length > 0 &&
    miembro.rol.trim().length > 0 &&
    miembro.credenciales.some((credencial) => credencial.trim().length > 0) &&
    Boolean(miembro.imageUrl)
  );
}

/** Miembros con ficha indexable: alimentan el listado, el JSON-LD y el sitemap. */
export const EQUIPO_INDEXABLE: MiembroEquipo[] = EQUIPO.filter(perfilIndexable);

/** Miembros con ficha 200 pero `noindex, follow` (les falta algún dato base). */
export const EQUIPO_NO_INDEXABLE: MiembroEquipo[] = EQUIPO.filter(
  (miembro) => !perfilIndexable(miembro)
);

/**
 * ¿Están completos todos los perfiles? Solo cuenta lo que se publica: bio,
 * LinkedIn y foto. No condiciona la indexación (eso lo decide
 * `perfilIndexable`); sirve como termómetro editorial.
 */
export function equipoCompleto(): boolean {
  return (
    EQUIPO.length > 0 &&
    EQUIPO.every((miembro) => Boolean(miembro.bio && miembro.linkedinUrl && miembro.imageUrl))
  );
}

/**
 * @deprecated Usar `EQUIPO_INDEXABLE` / `perfilIndexable`. Se mantiene solo
 * porque `app/sitemap.ts` (propiedad de WS10) todavía lo importa; ya no lee
 * `NEXT_PUBLIC_EQUIPO_PUBLICADO` ni apaga el equipo completo.
 */
export const EQUIPO_PUBLICADO = EQUIPO_INDEXABLE.length > 0;

/** Ruta pública de la ficha de una persona. */
export function rutaPerfil(slug: string): string {
  return `/profesores/${slug}`;
}

/**
 * Rutas de profesores que deben entrar al sitemap: el listado (siempre
 * indexable) y una ficha por miembro que cumpla `perfilIndexable`.
 *
 * WS10: importar `RUTAS_PROFESORES_INDEXABLES` desde `@/lib/data/equipo`.
 */
export const RUTAS_PROFESORES_INDEXABLES: string[] = [
  "/profesores",
  ...EQUIPO_INDEXABLE.map((miembro) => rutaPerfil(miembro.slug)),
];

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
