/**
 * Datos y JSON-LD de las landings de curso por país.
 *
 * La página no inventa precios ni horarios: usa el catálogo (`courses.ts`),
 * los precios locales (`config/paises.ts`) y los horarios/cohortes que ya
 * existen en `lib/paises/horarios.ts` y `course_schedules`.
 */

import type { Metadata } from "next";
import { getPais, ISO_CHILE, normalizarPais } from "@/config/paises";
import type { Course } from "@/lib/data/courses";
import {
  levelsForView,
  offerHours,
  offerSyllabusSections,
} from "@/lib/data/course-views";
import type { CourseSchedule } from "@/lib/data/course-schedules";
import {
  OPEN_COHORT_LABEL,
  getNearestSchedule,
  nextCohortForCourse,
} from "@/lib/data/course-schedules";
import type { LandingCursoCopy } from "@/lib/data/landing-cursos";
import { horarioDeCohorte, horarioLocal, type HorarioLocal } from "@/lib/paises/horarios";
import { montoConCodigo } from "@/lib/paises/detalle-curso";
import { precioPublico } from "@/config/pricing";
import { localizarMercado } from "@/lib/paises/precios";
import { metadataLocal } from "@/lib/paises/metadata";
import { rutaLocal } from "@/lib/paises/rutas";
import { absoluteUrl } from "@/lib/seo";
import { getCourseJsonLd } from "@/lib/seo/course-jsonld";

export type LandingCursoContenido = {
  iso: string;
  paisNombre: string;
  path: string;
  horario: HorarioLocal;
  horas: number;
  niveles: string[];
  precio: number | null;
  precioTexto: string;
  precioEtiqueta: string;
  cohorteTexto: string;
  syllabus: { name: string; description: string }[];
  faqs: { q: string; a: string }[];
};

export function contenidoLandingCurso(opts: {
  copy: LandingCursoCopy;
  course: Course;
  pais?: string | null;
  schedules?: CourseSchedule[];
}): LandingCursoContenido {
  const iso = normalizarPais(opts.pais);
  const pais = getPais(iso);
  const schedules = opts.schedules ?? [];

  const cohorte = getNearestSchedule(
    schedules
      .filter((schedule) => schedule.course_slug === opts.course.slug)
      .map((schedule) => ({ ...schedule, is_active: schedule.is_active !== false }))
  );
  const { inicio, fin } = horarioDeCohorte(cohorte?.schedule_time);
  const horario = horarioLocal(iso, { inicio, fin });

  const horas = offerHours(opts.course, "publico");
  const niveles = levelsForView(opts.course, "publico").map((nivel) => nivel.name);
  const precio = precioPublico(iso, opts.course.slug);

  const precioTexto =
    precio == null ? "Consulta el valor de la próxima cohorte" : montoConCodigo(iso, precio);
  const precioEtiqueta = iso === ISO_CHILE ? "Precio de catálogo" : "Precio local";

  const proxima = nextCohortForCourse(opts.course.slug, schedules, pais.zonaHoraria);
  const cohorteTexto = proxima
    ? `Próxima cohorte: ${proxima.date} · ${proxima.days} · ${proxima.time}`
    : OPEN_COHORT_LABEL;

  const lugar = iso === ISO_CHILE ? "Chile" : pais.nombre;
  const horarioRespuesta =
    iso === ISO_CHILE
      ? `Las clases en vivo por Zoom son de ${horario.inicio} a ${horario.fin}, hora de Chile (${horario.offset}).`
      : `Las clases en vivo por Zoom son de ${horario.inicio} a ${horario.fin}, hora de ${pais.nombre} (${horario.offset}). En Chile son de ${horario.inicioChile} a ${horario.finChile}.`;

  const nivelesTexto =
    niveles.length > 1
      ? `Se dicta en ${niveles.length} niveles: ${niveles.join(" y ")}.`
      : "";
  const precioRespuesta =
    precio == null
      ? "El valor depende de la cohorte. Consulta la ficha del curso o por WhatsApp."
      : `${precioEtiqueta}: ${precioTexto}. En la ficha del curso ves fechas, cupos y el valor de la próxima cohorte.`;
  const pagoRespuesta = `Los medios de pago publicados para ${lugar} son: ${pais.mediosPago.join("; ")}. El checkout muestra las opciones disponibles para la cohorte.`;

  const faqs = [
    {
      q: "¿Cuánto dura el curso?",
      a: `El curso abierto es de ${horas} horas. ${nivelesTexto}`.trim(),
    },
    {
      q: `¿A qué hora son las clases en ${lugar}?`,
      a: horarioRespuesta,
    },
    {
      q: "¿Cuánto cuesta?",
      a: precioRespuesta,
    },
    {
      q: "¿Cómo se paga?",
      a: pagoRespuesta,
    },
    ...opts.copy.faqs,
  ];

  return {
    iso,
    paisNombre: pais.nombre,
    path: opts.copy.path,
    horario,
    horas,
    niveles,
    precio,
    precioTexto,
    precioEtiqueta,
    cohorteTexto,
    syllabus: offerSyllabusSections(opts.course, "publico"),
    faqs,
  };
}

export function metadataLandingCurso(
  copy: LandingCursoCopy,
  pais: string | null | undefined
): Metadata {
  return metadataLocal({
    pais,
    path: copy.path,
    title: copy.seoTitle,
    description: copy.seoDescription,
  });
}

export function jsonLdLandingCurso(opts: {
  copy: LandingCursoCopy;
  course: Course;
  pais?: string | null;
  contenido: LandingCursoContenido;
}) {
  const iso = normalizarPais(opts.pais);
  const landingUrl = absoluteUrl(rutaLocal(iso, opts.copy.path));
  const base = getCourseJsonLd(opts.course, "publico", iso) as Record<string, unknown>;
  const nombre = localizarMercado(opts.copy.h1, iso);

  const courseLd: Record<string, unknown> = {
    ...base,
    name: nombre,
    description: localizarMercado(opts.copy.seoDescription, iso),
    url: landingUrl,
    image: absoluteUrl(opts.course.imageUrl),
  };

  const offers = courseLd.offers;
  if (offers && typeof offers === "object") {
    courseLd.offers = { ...(offers as Record<string, unknown>), url: landingUrl };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      courseLd,
      {
        "@type": "FAQPage",
        mainEntity: opts.contenido.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: absoluteUrl(rutaLocal(iso, "/")),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cursos",
            item: absoluteUrl(rutaLocal(iso, "/cursos")),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: nombre,
            item: landingUrl,
          },
        ],
      },
    ],
  };
}
