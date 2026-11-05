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
import {
  faqsLandingCurso,
  seoLandingCurso,
  usosLandingCurso,
  type LandingCursoCopy,
  type UsoLanding,
} from "@/lib/data/landing-cursos";
import { horarioDeCohorte, horarioLocal, type HorarioLocal } from "@/lib/paises/horarios";
import { montoConCodigo } from "@/lib/paises/detalle-curso";
import { precioPublico } from "@/config/pricing";
import { metadataLocal } from "@/lib/paises/metadata";
import { rutaLocal } from "@/lib/paises/rutas";
import { absoluteUrl } from "@/lib/seo";
import { getCourseJsonLd } from "@/lib/seo/course-jsonld";

export type LandingCursoContenido = {
  iso: string;
  paisNombre: string;
  path: string;
  h1: string;
  kicker: string;
  seoDescription: string;
  horario: HorarioLocal;
  horas: number;
  niveles: string[];
  precio: number | null;
  precioTexto: string;
  precioEtiqueta: string;
  /** true cuando no hay precio público (hoy Paraguay): CTA por WhatsApp. */
  consultarPrecio: boolean;
  cohorteTexto: string;
  usos: UsoLanding[];
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
  const seo = seoLandingCurso(opts.copy, iso);
  const usos = usosLandingCurso(opts.copy, iso);
  const propias = faqsLandingCurso(opts.copy, iso);
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
    precio == null ? "Consulta el valor por WhatsApp" : montoConCodigo(iso, precio);
  const precioEtiqueta =
    precio == null ? "Precio" : iso === ISO_CHILE ? "Precio de catálogo" : "Precio local";

  const proxima = nextCohortForCourse(opts.course.slug, schedules, pais.zonaHoraria);
  const cohorteTexto = proxima
    ? `Próxima cohorte: ${proxima.date} · ${proxima.days} · ${proxima.time}`
    : OPEN_COHORT_LABEL;

  const lugar = iso === ISO_CHILE ? "Chile" : pais.nombre;
  const horarioRespuesta =
    iso === ISO_CHILE
      ? `Las clases en vivo por Zoom son de ${horario.inicio} a ${horario.fin}, hora de Chile (${horario.offset}).`
      : `Las clases en vivo por Zoom son de ${horario.inicio} a ${horario.fin}, hora de ${pais.nombre} (${horario.offset}). En Chile son de ${horario.inicioChile} a ${horario.finChile}.`;

  const precioRespuesta =
    precio == null
      ? `El valor de la cohorte se consulta por WhatsApp; la página no publica un precio para ${lugar}.`
      : `${precioEtiqueta}: ${precioTexto}. En la ficha del curso ves fechas, cupos y el valor de la próxima cohorte.`;
  const pagoRespuesta = `Los medios de pago publicados para ${lugar} son: ${pais.mediosPago.join("; ")}. El checkout muestra las opciones disponibles para la cohorte.`;

  const faqs = [
    {
      q: `¿A qué hora son las clases en ${lugar}?`,
      a: horarioRespuesta,
    },
    {
      q: `¿Cuánto cuesta y cómo se paga en ${lugar}?`,
      a: `${precioRespuesta} ${pagoRespuesta}`,
    },
    ...propias,
    ...opts.copy.faqs.slice(0, propias.length ? 2 : 4),
  ];

  return {
    iso,
    paisNombre: pais.nombre,
    path: opts.copy.path,
    h1: seo.h1,
    kicker: seo.kicker,
    seoDescription: seo.seoDescription,
    horario,
    horas,
    niveles,
    precio,
    precioTexto,
    precioEtiqueta,
    consultarPrecio: precio == null,
    cohorteTexto,
    usos,
    syllabus: offerSyllabusSections(opts.course, "publico"),
    faqs,
  };
}

export function metadataLandingCurso(
  copy: LandingCursoCopy,
  pais: string | null | undefined
): Metadata {
  const iso = normalizarPais(pais);
  const seo = seoLandingCurso(copy, iso);
  return metadataLocal({
    pais: iso,
    path: copy.path,
    title: seo.seoTitle,
    description: seo.seoDescription,
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
  const nombre = opts.contenido.h1;

  const courseLd: Record<string, unknown> = {
    ...base,
    name: nombre,
    description: opts.contenido.seoDescription,
    url: landingUrl,
    image: absoluteUrl(opts.course.imageUrl),
  };

  // Paraguay no tiene precio público: la página nunca declara Offer.
  if (opts.contenido.precio == null) {
    delete courseLd.offers;
  } else {
    const offers = courseLd.offers;
    if (offers && typeof offers === "object") {
      courseLd.offers = { ...(offers as Record<string, unknown>), url: landingUrl };
    }
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
