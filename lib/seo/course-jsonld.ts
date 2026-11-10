import type { Course } from "@/lib/data/courses";
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
  EQUIPO,
  fundadorEquipo,
  miembroPorCurso,
  rutaPerfil,
  type MiembroEquipo,
} from "@/lib/data/equipo";
import { getPais, ISO_CHILE, normalizarPais } from "@/config/paises";
import { rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";

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

export function getCourseJsonLd(
  course: Course,
  view: CourseOfferView = "publico",
  iso: string = ISO_CHILE
) {
  const pais = normalizarPais(iso);
  const seo = COURSE_SEO[course.slug];
  const baseName = localizarMercado(seo?.h1 || course.title, pais);
  const name = view === "avanzado" ? advancedHeading(baseName) : baseName;
  const hours = offerHours(course, view);
  const path = rutaLocal(pais, coursePath(course.slug, view));
  // Cada curso declara a su profesor en `equipo.ts`; sin match, lo dicta el
  // fundador. El `sameAs` a la página de empresa era un dato incorrecto.
  const instructor = miembroPorCurso(course.slug);

  return {
    "@type": "Course",
    name,
    description: localizarMercado(
      view === "avanzado"
        ? levelIntro(course, "Avanzado") || seo?.description || course.description
        : seo?.description || course.description,
      pais
    ),
    url: absoluteUrl(path),
    provider: {
      "@type": "Organization",
      name: "ProgramBI",
      url: SITE_URL,
      "@id": `${SITE_URL}/#organization`,
      sameAs: [
        "https://www.instagram.com/programbi_capacitaciones/",
        "https://www.tiktok.com/@programbi",
        "https://cl.linkedin.com/company/programbi",
        "https://www.youtube.com/@ProgramBi",
      ],
    },
    image: course.imageUrl,
    educationalLevel: view === "avanzado" ? "avanzado" : course.level,
    inLanguage: pais === ISO_CHILE ? "es" : getPais(pais).idioma,
    courseMode: course.modality === "online" ? "Online" : "Blended",
    numberOfCredits: hours,
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
      // `Course` no define `instructor` en schema.org; el lugar válido es la
      // instancia del curso. El @id es el mismo que usa /profesores/<slug>.
      instructor: {
        "@type": "Person",
        "@id": idPersona(instructor.slug),
        name: instructor.nombre,
        jobTitle: instructor.cargo,
        url: absoluteUrl(rutaPerfil(instructor.slug)),
        worksFor: { "@id": ORG_ID },
        ...(instructor.imageUrl ? { image: absoluteUrl(instructor.imageUrl) } : {}),
        ...(instructor.linkedinUrl ? { sameAs: [instructor.linkedinUrl] } : {}),
      },
    },
    // Sin bloque de precio: el arancel no viaja en el HTML público. Se
    // descarga en el brochure PDF de la ficha, única superficie con precios.
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
export function getPersonaJsonLd(miembro: MiembroEquipo) {
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
  };
}

/**
 * EducationalOrganization con el equipo enlazado por `@id`: el fundador en
 * `founder` y todas las personas en `employee`. Los nodos Person se incluyen
 * aparte, en el mismo @graph de la página.
 */
export function getOrganizacionEquipoJsonLd(descripcion: string) {
  return {
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: "ProgramBI",
    legalName: "ProgramBI SPA",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: LOGO_ORGANIZACION, width: 600, height: 160 },
    description: descripcion,
    founder: { "@id": idPersona(fundadorEquipo().slug) },
    employee: EQUIPO.map((miembro) => ({ "@id": idPersona(miembro.slug) })),
  };
}

/** ProfilePage de /profesores/<slug>, con la ficha Person como mainEntity. */
export function getProfilePageJsonLd(miembro: MiembroEquipo) {
  const url = absoluteUrl(rutaPerfil(miembro.slug));
  return {
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    name: `${miembro.nombre} — Profesor ProgramBI`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": idPersona(miembro.slug) },
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
  descripcion: string
) {
  return [
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: nombre,
      description: descripcion,
      inLanguage: "es-CL",
      isPartOf: { "@id": WEBSITE_ID },
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
        item: { "@id": idPersona(miembro.slug) },
        name: miembro.nombre,
        url: absoluteUrl(rutaPerfil(miembro.slug)),
      })),
    },
  ];
}
