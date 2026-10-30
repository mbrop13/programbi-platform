import type { Course } from "@/lib/data/courses";
import {
  advancedHeading,
  coursePath,
  offerHours,
  offerLowPrice,
  offerSyllabusSections,
  levelIntro,
  offerTeaches,
  type CourseOfferView,
} from "@/lib/data/course-views";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { COURSE_SEO } from "@/lib/seo/money";
import { getPais, ISO_CHILE, normalizarPais } from "@/config/paises";
import { rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado, precioCurso } from "@/lib/paises/precios";

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
  const catalogPrice = offerLowPrice(course, view);
  const localPrice = precioCurso(pais, course.slug);
  // Chile publica el catálogo en CLP. El resto solo entra si tiene precio local:
  // no se reetiqueta un monto en CLP con otra moneda.
  const lowestPrice = pais === ISO_CHILE ? (catalogPrice ?? null) : (localPrice ?? catalogPrice ?? null);
  const moneda = pais === ISO_CHILE || localPrice == null ? "CLP" : getPais(pais).moneda;
  const path = rutaLocal(pais, coursePath(course.slug, view));

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
      instructor: {
        "@type": "Person",
        name: "Manuel Oliva",
        jobTitle: "CEO & Fundador ProgramBI",
        sameAs: "https://cl.linkedin.com/company/programbi",
      },
    },
    ...(lowestPrice && {
      offers: {
        "@type": "Offer",
        price: lowestPrice,
        priceCurrency: moneda,
        availability: "https://schema.org/InStock",
        url: absoluteUrl(path),
        validFrom: new Date().toISOString(),
      },
    }),
    syllabusSections: offerSyllabusSections(course, view).map((section) => ({
      "@type": "Syllabus",
      name: section.name,
      description: section.description,
    })),
  };
}
