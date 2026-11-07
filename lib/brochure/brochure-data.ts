/**
 * Datos del brochure de un curso para un país.
 *
 * Este módulo corre solo en el servidor: consulta Supabase y arma un objeto
 * 100 % serializable (strings, números, arrays y objetos planos) que se pasa
 * al componente cliente y al generador de PDF. No importa React.
 */

import {
  getPais,
  normalizarPais,
  type SlugCurso,
} from "@/config/paises";
import { CUOTAS_SIN_INTERES, NOTA_CUOTAS, textoCuotas } from "@/config/cuotas";
import { precioListaPublico, precioPublico } from "@/config/pricing";
import { getCourseBySlug, type Course } from "@/lib/data/courses";
import {
  analisisDeDatosSlugs,
  convertSchedule,
  getAllActiveSchedules,
  staticSchedules,
  type CourseSchedule,
} from "@/lib/data/course-schedules";
import { getCourseSyllabus } from "@/lib/data/syllabuses";
import { levelsForView, offerHours, offerTeaches } from "@/lib/data/course-views";
import { mentors } from "@/lib/data/mentors";
import {
  conHoraPais,
  horarioDeCohorte,
  horarioLocal,
  zonaDe,
} from "@/lib/paises/horarios";
import {
  formatMoneda,
  NOTA_PAGO,
  porcentajeDescuento,
} from "@/lib/paises/precios";
import { getActiveSchedules } from "@/lib/supabase/comunidad-ai";
import { createAdminClient } from "@/lib/supabase/server";

export type BrochureModulo = {
  title: string;
  hours: number | null;
  topics: string[];
};

export type BrochureNivel = {
  label: string;
  shortLabel: string | null;
  modules: BrochureModulo[];
};

export type BrochureNivelOferta = {
  name: string;
  hours: number | null;
  whatYouLearn: string[];
};

export type BrochureProfesor = {
  name: string;
  role: string;
  title: string;
  credentials: string[];
  imageUrl: string | null;
  founderBio: string | null;
  founderCareer: string[];
  founderAcademics: string[];
};

export type BrochureCohorte = {
  id: string;
  nivel: string;
  /** Fecha de inicio ya convertida a la zona del país, en texto largo. */
  fecha: string;
  fechaISO: string;
  dias: string;
  /** Horario en la hora local del país, con su etiqueta («· Hora de Perú»). */
  horario: string;
  /** Horario original de la cohorte, dictado desde Chile. */
  horaChile: string;
  hours: number | null;
};

export type BrochureEquivalencias = {
  inicio: string;
  fin: string;
  offset: string;
  cadena: string;
  cadenaMercados: string;
};

export type CourseBrochureData = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categoryLabel: string;
  badgeLabel: string | null;
  accentColor: string;
  imageUrl: string;
  techStack: string[];
  modality: string;
  hours: number;
  levelsCount: number;
  modulesCount: number;
  insignia: string;
  levels: BrochureNivelOferta[];
  whatYouLearn: string[];
  temario: BrochureNivel[];
  precio: number | null;
  precioFormateado: string;
  precioLista: number | null;
  precioListaFormateado: string | null;
  descuentoPct: number;
  cuotas: number;
  cuotaMonto: number | null;
  cuotaTexto: string;
  notaCuotas: string;
  notaPago: string;
  mediosPago: string[];
  moneda: string;
  simbolo: string;
  schedules: BrochureCohorte[];
  equivalencias: BrochureEquivalencias;
  profesores: BrochureProfesor[];
  empresas: string[];
  customPdfUrl: string | null;
  inscripcionUrl: string;
  whatsappUrl: string | null;
  pais: string;
  paisNombre: string;
  zonaHoraria: string;
  actualizado: string;
};

/** Empresas que ya capacitaron a sus equipos con ProgramBI. */
const EMPRESAS = [
  "AngloAmerican",
  "Deloitte",
  "Banco de Chile",
  "SQM",
  "Cencosud",
  "BCI",
  "Tottus",
  "Midea",
  "Pucobre",
];

/** Insignia fija de modalidad, compartida por la vista y el PDF. */
const INSIGNIA =
  "Clases 100% en vivo por Zoom · Grabaciones de por vida · Certificado digital verificable";

/** Etiqueta del país que convierte un horario ya localizado. */
function etiquetarHora(iso: string, horario: string, paisNombre: string): string {
  const conPais = conHoraPais(iso, horario).replace(
    /·\s*hora de\s*/i,
    "· Hora de "
  );
  if (/hora de/i.test(conPais)) return conPais;
  return `${conPais} · Hora de ${paisNombre}`;
}

/** Slugs que forman una cohorte de Análisis de Datos. */
function slugsDeCurso(slug: string): string[] {
  return slug === "analisis-de-datos" ? analisisDeDatosSlugs : [slug];
}

/** Primera letra en mayúscula, para «martes, 9 de junio de 2026». */
function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Primeros tópicos del temario, usados si el curso no declara resultados. */
function temasDeRespaldo(course: Course, limite = 8): string[] {
  const salida: string[] = [];
  for (const nivel of getCourseSyllabus(course).levels) {
    for (const modulo of nivel.modules) {
      for (const tema of modulo.topics) {
        const titulo = typeof tema === "string" ? tema : tema.title;
        if (titulo && !salida.includes(titulo)) salida.push(titulo);
        if (salida.length >= limite) return salida;
      }
    }
  }
  return salida;
}

function armarTemario(course: Course): BrochureNivel[] {
  return getCourseSyllabus(course).levels.map((nivel) => ({
    label: nivel.label,
    shortLabel: nivel.shortLabel ?? null,
    modules: nivel.modules.map((modulo) => ({
      title: modulo.title,
      hours: modulo.hours ?? null,
      topics: modulo.topics
        .map((tema) => (typeof tema === "string" ? tema : tema.title))
        .filter((tema) => Boolean(tema)),
    })),
  }));
}

function contarModulos(temario: BrochureNivel[]): number {
  return temario.reduce((total, nivel) => total + nivel.modules.length, 0);
}

function armarProfesores(): BrochureProfesor[] {
  return [...mentors]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 3)
    .map((mentor) => ({
      name: mentor.name,
      role: mentor.role,
      title: mentor.title,
      credentials: mentor.credentials,
      imageUrl: mentor.imageUrl ?? null,
      founderBio: mentor.founderBio ?? null,
      founderCareer: mentor.founderCareer ?? [],
      founderAcademics: mentor.founderAcademics ?? [],
    }));
}

/**
 * Lee `brochure_pdf_url` de la tabla `courses`.
 * Si la columna todavía no existe, el error se absorbe y el brochure sigue
 * funcionando con el PDF generado en el navegador.
 */
async function leerPdfPersonalizado(slug: string): Promise<string | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("courses")
      .select("brochure_pdf_url")
      .eq("slug", slug)
      .maybeSingle();

    if (!error) {
      const fila = data as { brochure_pdf_url?: string | null } | null;
      const url = fila?.brochure_pdf_url;
      return typeof url === "string" && /^https?:\/\//i.test(url) ? url : null;
    }

    // Reintento sin la columna: confirma que la tabla existe y deja el aviso
    // en el log del servidor, sin romper la página.
    if (/brochure_pdf_url|column/i.test(error.message)) {
      await admin.from("courses").select("slug").eq("slug", slug).maybeSingle();
    }
    return null;
  } catch {
    return null;
  }
}

/** Filas activas del curso. Si Supabase no responde, no hay filas. */
async function filasActivas(slug: string): Promise<CourseSchedule[]> {
  const slugs = slugsDeCurso(slug);
  try {
    const todas = (await getActiveSchedules()) as CourseSchedule[];
    return (todas ?? []).filter((fila) => slugs.includes(fila.course_slug));
  } catch {
    return [];
  }
}

function cohortesDeFilas(
  filas: CourseSchedule[],
  pais: string,
  paisNombre: string
): BrochureCohorte[] {
  const zona = zonaDe(pais);
  return filas.map((fila) => {
    const conv = convertSchedule(
      fila.start_date,
      fila.schedule_time,
      fila.schedule_days,
      zona
    );
    return {
      id:
        fila.id ||
        `${fila.course_slug}-${fila.start_date}-${fila.schedule_time}`.replace(
          /\s+/g,
          "-"
        ),
      nivel: fila.level_name,
      fecha: capitalizar(conv.dateFormatted),
      fechaISO: conv.date,
      dias: conv.days,
      horario: etiquetarHora(pais, conv.time, paisNombre),
      horaChile: `${fila.schedule_time} · Hora de Chile`,
      hours: fila.duration_hours || null,
    };
  });
}

async function armarHorarios(
  slug: string,
  pais: string,
  paisNombre: string
): Promise<BrochureCohorte[]> {
  const propias = await filasActivas(slug);
  const futuras = getAllActiveSchedules(propias);
  if (futuras.length > 0) return cohortesDeFilas(futuras, pais, paisNombre);

  // Fallback estático del repo: solo cohortes vigentes.
  const slugs = slugsDeCurso(slug);
  const estaticas: CourseSchedule[] = staticSchedules
    .map((fila, indice) => ({ ...fila, id: `estatica-${indice}` }))
    .filter((fila) => slugs.includes(fila.course_slug));
  const estaticasFuturas = getAllActiveSchedules(estaticas);
  return cohortesDeFilas(estaticasFuturas, pais, paisNombre);
}

function armarEquivalencias(
  pais: string,
  cohortes: BrochureCohorte[]
): BrochureEquivalencias {
  const primera = cohortes[0];
  const rango = horarioDeCohorte(primera?.horaChile.split(" · ")[0]);
  const referencia = primera
    ? new Date(`${primera.fechaISO}T12:00:00Z`)
    : undefined;
  const local = horarioLocal(pais, {
    inicio: rango.inicio,
    fin: rango.fin,
    ...(referencia ? { referencia } : {}),
  });
  return {
    inicio: local.inicio,
    fin: local.fin,
    offset: local.offset,
    cadena: local.cadena,
    cadenaMercados: local.cadenaMercados,
  };
}

function armarInscripcion(slug: string, pais: string): string {
  const base = `/pago?curso=${encodeURIComponent(slug)}`;
  return pais === "cl" ? base : `${base}&pais=${encodeURIComponent(pais)}`;
}

/**
 * Arma el brochure completo de un curso en un país.
 * Devuelve `null` si el slug no existe en el catálogo.
 */
export async function getCourseBrochureData(
  slug: string,
  pais: string
): Promise<CourseBrochureData | null> {
  const course = getCourseBySlug(slug);
  if (!course) return null;

  const iso = normalizarPais(pais);
  const infoPais = getPais(iso);
  const paisNombre = infoPais.nombre;
  const zonaHoraria = infoPais.zonaHoraria;

  const hours = offerHours(course, "publico") || course.durationHours;
  const levels = levelsForView(course, "publico").map((nivel) => ({
    name: nivel.name,
    hours: nivel.durationHours ?? null,
    whatYouLearn: nivel.whatYouLearn,
  }));

  const resultados = offerTeaches(course, "publico");
  const whatYouLearn =
    resultados.length > 0
      ? resultados.filter((item, indice) => resultados.indexOf(item) === indice)
      : temasDeRespaldo(course);

  const temario = armarTemario(course);

  const precio = precioPublico(iso, course.slug as SlugCurso);
  const precioLista = precioListaPublico(iso, course.slug as SlugCurso);
  const descuentoPct =
    precio != null && precioLista != null
      ? porcentajeDescuento(precioLista, precio)
      : 0;

  const cuotaMonto =
    precio != null ? Math.round(precio / CUOTAS_SIN_INTERES) : null;
  const cuotaTexto =
    cuotaMonto != null
      ? `${textoCuotas(iso)} de ${formatMoneda(iso, cuotaMonto)} cada una`
      : textoCuotas(iso);

  const schedules = await armarHorarios(course.slug, iso, paisNombre);
  const customPdfUrl = await leerPdfPersonalizado(course.slug);

  return {
    slug: course.slug,
    title: course.title,
    shortDescription: course.shortDescription,
    description: course.description,
    categoryLabel: course.categoryLabel,
    badgeLabel: course.badgeLabel ?? null,
    accentColor: course.accentColor,
    imageUrl: course.imageUrl,
    techStack: course.techStack,
    modality: "Clases 100% en vivo por Zoom",
    hours,
    levelsCount: levels.length,
    modulesCount: contarModulos(temario),
    insignia: INSIGNIA,
    levels,
    whatYouLearn,
    temario,
    precio,
    precioFormateado:
      precio != null ? formatMoneda(iso, precio) : "Consulta el valor por WhatsApp",
    precioLista,
    precioListaFormateado:
      precioLista != null ? formatMoneda(iso, precioLista) : null,
    descuentoPct,
    cuotas: CUOTAS_SIN_INTERES,
    cuotaMonto,
    cuotaTexto,
    notaCuotas: NOTA_CUOTAS,
    notaPago: NOTA_PAGO,
    mediosPago: infoPais.mediosPago,
    moneda: infoPais.moneda,
    simbolo: infoPais.simbolo,
    schedules,
    equivalencias: armarEquivalencias(iso, schedules),
    profesores: armarProfesores(),
    empresas: EMPRESAS,
    customPdfUrl,
    inscripcionUrl: armarInscripcion(course.slug, iso),
    whatsappUrl: infoPais.contacto.whatsapp,
    pais: iso,
    paisNombre,
    zonaHoraria,
    actualizado: "noviembre 2026",
  };
}
