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

const OCCUPATIONAL: Record<string, string> = {
  "analisis-de-datos": "Analista de Datos, Business Intelligence Analyst, Data Analyst",
  "power-bi": "Especialista en Power BI, Analista de Business Intelligence, BI Developer",
  "sql-server": "Administrador de Bases de Datos, SQL Developer, Analista de Datos",
  python: "Analista de Datos Python, Data Scientist Junior, Programador Python",
  "machine-learning": "Científico de Datos, Machine Learning Engineer, Analista de Datos Predictivos",
  "ia-productividad": "Especialista en Productividad con IA, Prompt Engineer",
  "power-automate": "Analista de Automatización RPA, Consultor Power Automate",
  excel: "Analista Financiero, Analista de Operaciones, Analista de Datos Excel",
};

const PREREQUISITES: Record<string, string> = {
  "power-bi": "Conocimientos básicos de Microsoft Excel y manejo de archivos.",
  "machine-learning": "Conocimientos intermedios de Python (Pandas/NumPy) y álgebra lineal básica.",
  "analitica-mineria": "Conocimientos básicos de análisis de datos y Excel.",
  "analitica-financiera": "Nociones básicas de contabilidad y finanzas corporativas.",
};

export function getCourseJsonLd(course: Course, view: CourseOfferView = "publico") {
  const seo = COURSE_SEO[course.slug];
  const baseName = seo?.h1 || course.title;
  const name = view === "avanzado" ? advancedHeading(baseName) : baseName;
  const hours = offerHours(course, view);
  const lowestPrice = offerLowPrice(course, view);
  const path = coursePath(course.slug, view);

  return {
    "@type": "Course",
    name,
    description:
      view === "avanzado"
        ? levelIntro(course, "Avanzado") || seo?.description || course.description
        : seo?.description || course.description,
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
    inLanguage: "es",
    courseMode: course.modality === "online" ? "Online" : "Blended",
    numberOfCredits: hours,
    timeRequired: `PT${hours}H`,
    teaches: offerTeaches(course, view).join(", "),
    coursePrerequisites:
      PREREQUISITES[course.slug] || "No se requieren conocimientos previos de programación.",
    educationalCredentialAwarded: "Certificado de Aprobación Oficial ProgramBI SPA",
    occupationalCategory: OCCUPATIONAL[course.slug] || "Analista de Datos, Profesional de Negocios",
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
        priceCurrency: "CLP",
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
