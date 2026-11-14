import { getCourseBySlug, type Course } from "@/lib/data/courses";
import {
  analisisDeDatosSlugs,
  getNearestSchedule,
  staticSchedules,
  type CourseSchedule,
} from "@/lib/data/course-schedules";
import {
  advancedHeading,
  coursePath,
  offerHours,
  offerSyllabusSections,
  levelIntro,
  offerTeaches,
  type CourseOfferView,
} from "@/lib/data/course-views";
import { SITE_URL, WEBSITE_ID, ORG_ID, absoluteUrl } from "@/lib/seo";
import { COURSE_SEO } from "@/lib/seo/money";
import {
  EQUIPO_INDEXABLE,
  fundadorEquipo,
  miembroPorCurso,
  rutaPerfil,
  type MiembroEquipo,
} from "@/lib/data/equipo";
import { getPais, ISO_CHILE, normalizarPais } from "@/config/paises";
import { PRECIOS_VALID_FROM, monedaPublica, precioPublico } from "@/config/pricing";
import { rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";

const OFFER_PRICE_VALID_UNTIL = "2026-12-31";

const OCCUPATIONAL: Record<string, string> = {
  "analisis-de-datos": "Analista de Datos, Business Intelligence Analyst, Data Analyst",
  "power-bi": "Especialista en Power BI, Analista de Business Intelligence, BI Developer",
  "sql-server": "Administrador de Bases de Datos, SQL Developer, Analista de Datos",
  python: "Analista de Datos Python, Data Scientist Junior, Programador Python",
  "machine-learning": "Científico de Datos, Machine Learning Engineer, Analista de Datos Predictivos",
  "ia-productividad": "Especialista en Productividad con IA, Prompt Engineer",
  "power-automate": "Analista de Automatización RPA, Consultor Power Automate",
  excel: "Analista Financiero, Analista de Operaciones, Analista de Datos Excel",
  access: "Administrativo, Analista de gestión, Encargado de reportes",
  "mercado-financiero": "Analista financiero, Middle Office, Portfolio Manager, Analista de riesgos",
};

const PREREQUISITES: Record<string, string> = {
  "power-bi": "Conocimientos básicos de Microsoft Excel y manejo de archivos.",
  "machine-learning": "Conocimientos intermedios de Python (Pandas/NumPy) y álgebra lineal básica.",
  "analitica-mineria": "Conocimientos básicos de análisis de datos y Excel.",
  "mercado-financiero":
    "Excel intermedio (tablas dinámicas, fórmulas avanzadas, gráficos y manejo de datos). No se requiere Python, SQL, Power BI ni Inteligencia Artificial.",
};

export interface CourseJsonLdOptions {
  startDate?: string | null;
  schedules?: CourseSchedule[];
}

function formatEducationalLevel(level: string): string {
  const trimmed = level.trim();
  if (!trimmed) return "Principiante";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function toIsoDate(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return undefined;
  const dateOnly = trimmed.slice(0, 10);
  const parsed = new Date(`${dateOnly}T12:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? undefined : dateOnly;
}

type ScheduleCandidate = Omit<CourseSchedule, "id"> & { id?: string };

function resolveCourseStartDate(
  courseSlug: string,
  options?: CourseJsonLdOptions
): string | undefined {
  const explicit = toIsoDate(options?.startDate);
  if (explicit) return explicit;
  const pool: readonly ScheduleCandidate[] = options?.schedules ?? staticSchedules;
  const matching: CourseSchedule[] = pool
    .filter((s) =>
      courseSlug === "analisis-de-datos"
        ? s.course_slug === "analisis-de-datos" || analisisDeDatosSlugs.includes(s.course_slug)
        : s.course_slug === courseSlug
    )
    .map((s, idx) => ({ ...s, id: s.id ?? String(idx) }));
  const nearest = getNearestSchedule(matching);
  return toIsoDate(nearest?.start_date);
}

export function getCourseJsonLd(
  course: Course,
  view: CourseOfferView = "publico",
  iso: string = ISO_CHILE,
  options?: CourseJsonLdOptions
) {
  const pais = normalizarPais(iso);
  const seo = COURSE_SEO[course.slug];
  const baseName = localizarMercado(seo?.h1 || course.title, pais);
  const name = view === "avanzado" ? advancedHeading(baseName) : baseName;
  const hours = offerHours(course, view);
  const path = rutaLocal(pais, coursePath(course.slug, view));
  const courseUrl = absoluteUrl(path);
  // Chile publica en español neutro; los demás mercados, en su idioma.
  const idioma = pais === ISO_CHILE ? "es" : getPais(pais).idioma;
  // Cada curso declara a su profesor en `equipo.ts`; sin match, lo dicta el
  // fundador. El `sameAs` a la página de empresa era un dato incorrecto.
  const instructor = miembroPorCurso(course.slug);
  const precio = view === "empresas" ? null : precioPublico(pais, course.slug);
  const startDate = view === "empresas" ? undefined : resolveCourseStartDate(course.slug, options);

  return {
    "@type": "Course",
    "@id": `${courseUrl}#course`,
    name,
    description: localizarMercado(
      view === "avanzado"
        ? levelIntro(course, "Avanzado") || seo?.description || course.description
        : seo?.description || course.description,
      pais
    ),
    url: courseUrl,
    provider: { "@id": ORG_ID },
    image: absoluteUrl(course.imageUrl),
    educationalLevel: formatEducationalLevel(view === "avanzado" ? "Avanzado" : course.level),
    inLanguage: idioma,
    courseMode: course.modality === "online" ? "Online" : "Blended",
    timeRequired: `PT${hours}H`,
    teaches: offerTeaches(course, view).join(", "),
    coursePrerequisites:
      PREREQUISITES[course.slug] || "No se requieren conocimientos previos de programación.",
    educationalCredentialAwarded: "Certificado de Aprobación Oficial ProgramBI SPA",
    occupationalCategory: OCCUPATIONAL[course.slug] || "Analista de Datos, Profesional de Negocios",
    // El curso se ofrece en el mercado de esta versión de la página.
    areaServed: { "@type": "Country", name: getPais(pais).nombre },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      // Carga horaria de la instancia en formato ISO 8601 (`PT20H`). Google la
      // pide para Course info y así no la infiere del temario.
      courseWorkload: `PT${hours}H`,
      inLanguage: idioma,
      ...(startDate ? { startDate } : {}),
      // `Course` no define `instructor` en schema.org; el lugar válido es la
      // instancia del curso. El @id es el mismo que usa /profesores/<slug>.
      instructor: getPersonaJsonLd(instructor),
    },
    // Oferta comercial: incluye `price`, `priceCurrency`, `validFrom` y
    // `priceValidUntil` en las vistas públicas cuando el país tiene arancel
    // aprobado en `config/pricing.ts`. En vista empresas o mercados sin monto
    // publicado (p. ej. Paraguay) declara solo `category: "Paid"`, `url` y
    // `availability`.
    offers: {
      "@type": "Offer",
      category: "Paid",
      url: courseUrl,
      availability: "https://schema.org/InStock",
      ...(precio != null
        ? {
            price: precio,
            priceCurrency: monedaPublica(pais),
            validFrom: PRECIOS_VALID_FROM,
            priceValidUntil: OFFER_PRICE_VALID_UNTIL,
          }
        : {}),
    },
    syllabusSections: offerSyllabusSections(course, view).map((section) => ({
      "@type": "Syllabus",
      name: section.name,
      description: section.description,
    })),
  };
}

/**
 * Logo oficial que usan los nodos de organización del sitio. Es el mismo
 * archivo local que declara `RootShell`, para que el nodo fusionado por @id no
 * tenga dos logos distintos.
 */
export const LOGO_ORGANIZACION = `${SITE_URL}/images/logo.png`;

/**
 * @id estable del nodo Person de cada profesor. Vive en la raíz del sitio (no
 * en la URL del perfil) para que siga siendo el mismo aunque la ficha cambie de
 * ruta, y coincide con el `founder` que declara `RootShell`.
 */
export function idPersona(slug: string): string {
  return `${SITE_URL}/#person-${slug}`;
}

/**
 * Nodo Person de un profesor. `description`, `image` y `sameAs` solo aparecen
 * cuando el dato existe: no se rellenan con texto ni URLs genéricas.
 */
const ALUMNI_POR_PERSONA: Record<string, string[]> = {
  "manuel-oliva": ["Universidad Adolfo Ibáñez", "Universidad de Concepción"],
  "emanuel-berrocal": [
    "Universidad de Chile",
    "Pontificia Universidad Católica de Chile",
  ],
  "rodrigo-vega": ["Universidad de Chile"],
};

const KNOWS_ABOUT_POR_PERSONA: Record<string, string[]> = {
  "manuel-oliva": [
    "Data Science",
    "Data Analytics para la toma de decisiones",
    "Riesgo Financiero",
    "Econometría",
    "Power BI",
    "Python",
    "SQL Server",
  ],
  "emanuel-berrocal": ["Estadística", "Mercado Financiero", "Python"],
  "rodrigo-vega": ["Business Intelligence", "Visualización de Datos", "Power BI", "Excel"],
};

export function getPersonaJsonLd(miembro: MiembroEquipo) {
  const alumniNames = ALUMNI_POR_PERSONA[miembro.slug] ?? [];
  const knowsAbout = KNOWS_ABOUT_POR_PERSONA[miembro.slug] ?? [];

  return {
    "@type": "Person",
    "@id": idPersona(miembro.slug),
    name: miembro.nombre,
    jobTitle: miembro.cargo,
    url: absoluteUrl(rutaPerfil(miembro.slug)),
    worksFor: { "@id": ORG_ID },
    ...(miembro.bio ? { description: miembro.bio } : {}),
    ...(miembro.imageUrl ? { image: absoluteUrl(miembro.imageUrl) } : {}),
    ...(miembro.linkedinUrl ? { sameAs: [miembro.linkedinUrl] } : {}),
    ...(alumniNames.length > 0
      ? {
          alumniOf: alumniNames.map((name) => ({
            "@type": "EducationalOrganization",
            name,
          })),
        }
      : {}),
    ...(knowsAbout.length > 0 ? { knowsAbout } : {}),
  };
}

/**
 * EducationalOrganization con el equipo enlazado por `@id`. Los nodos Person se
 * incluyen aparte en el mismo `@graph` cuando corresponden a la página actual;
 * en fichas individuales se pasa `[miembro]` para no dejar `@id` colgantes.
 */
export function getOrganizacionEquipoJsonLd(
  descripcion: string,
  miembros: MiembroEquipo[] = EQUIPO_INDEXABLE
) {
  const fundador = fundadorEquipo();
  const incluyeFundador = miembros.some((m) => m.slug === fundador.slug);

  return {
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: "ProgramBI",
    legalName: "ProgramBI SPA",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: LOGO_ORGANIZACION, width: 600, height: 160 },
    description: descripcion,
    ...(incluyeFundador ? { founder: { "@id": idPersona(fundador.slug) } } : {}),
    ...(miembros.length > 0
      ? { employee: miembros.map((miembro) => ({ "@id": idPersona(miembro.slug) })) }
      : {}),
  };
}

/** ProfilePage de /profesores/<slug>, con la ficha Person como mainEntity. */
export function getProfilePageJsonLd(miembro: MiembroEquipo, lang: string = "es-CL") {
  const url = absoluteUrl(rutaPerfil(miembro.slug));
  const teachesCourses = miembro.cursos
    .map((slug) => getCourseBySlug(slug))
    .filter((course): course is Course => Boolean(course));

  return {
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    name: `${miembro.nombre} — Profesor ProgramBI`,
    inLanguage: lang,
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    mainEntity: { "@id": idPersona(miembro.slug) },
    ...(teachesCourses.length > 0
      ? {
          teaches: teachesCourses.map((course) => ({
            "@type": "DefinedTerm",
            name: course.title,
            url: absoluteUrl(coursePath(course.slug, "publico")),
          })),
          mentions: teachesCourses.map((course) => {
            const courseUrl = absoluteUrl(coursePath(course.slug, "publico"));
            return {
              "@type": "Course",
              "@id": `${courseUrl}#course`,
              name: course.title,
              url: courseUrl,
            };
          }),
          relatedLink: teachesCourses.map((course) =>
            absoluteUrl(coursePath(course.slug, "publico"))
          ),
        }
      : {}),
  };
}

/**
 * CollectionPage del listado /profesores y su ItemList de fichas. Solo entran
 * los miembros que cumplen `perfilIndexable`: los demás siguen existiendo con
 * `noindex, follow` y no se anuncian como parte de la colección.
 */
export function getEquipoCollectionJsonLd(
  miembros: MiembroEquipo[],
  url: string,
  nombre: string,
  descripcion: string,
  lang: string = "es-CL"
) {
  return [
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: nombre,
      description: descripcion,
      inLanguage: lang,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      mainEntity: { "@id": `${url}#equipo` },
    },
    {
      "@type": "ItemList",
      "@id": `${url}#equipo`,
      name: nombre,
      numberOfItems: miembros.length,
      itemListElement: miembros.map((miembro, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Person",
          "@id": idPersona(miembro.slug),
          name: miembro.nombre,
          url: absoluteUrl(rutaPerfil(miembro.slug)),
        },
      })),
    },
  ];
}
