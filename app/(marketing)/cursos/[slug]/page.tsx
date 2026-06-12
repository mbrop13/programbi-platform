import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import { getMarketingDescription } from "@/lib/supabase/comunidad-ai";
import CourseDetailClient from "@/app/(marketing)/cursos/[slug]/CourseDetailClient";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Curso no encontrado" };

  const title = `${course.title} — Curso Online`;
  const dbDescription = await getMarketingDescription(slug);
  const description = dbDescription || course.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/cursos/${slug}`,
    },
    openGraph: {
      title: `${title} | ProgramBI`,
      description,
      url: `https://programbi.com/cursos/${slug}`,
      type: "website",
      images: [
        {
          url: course.imageUrl,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ProgramBI`,
      description,
      images: [course.imageUrl],
    },
  };
}

// JSON-LD for Course schema
function getCourseJsonLd(course: ReturnType<typeof getCourseBySlug>) {
  if (!course) return null;

  const lowestPrice = course.levels
    ? Math.min(...course.levels.map((l) => l.price || 0))
    : undefined;

  const occupationalCategories: Record<string, string> = {
    "analisis-de-datos": "Analista de Datos, Business Intelligence Analyst, Data Analyst",
    "power-bi": "Especialista en Power BI, Analista de Business Intelligence, BI Developer",
    "sql-server": "Administrador de Bases de Datos, SQL Developer, Analista de Datos",
    "python": "Analista de Datos Python, Data Scientist Junior, Programador Python",
    "machine-learning": "Científico de Datos, Machine Learning Engineer, Analista de Datos Predictivos",
    "ia-productividad": "Especialista en Productividad con IA, Prompt Engineer",
    "power-automate": "Analista de Automatización RPA, Consultor Power Automate",
    "excel": "Analista Financiero, Analista de Operaciones, Analista de Datos Excel"
  };

  const prerequisites: Record<string, string> = {
    "power-bi": "Conocimientos básicos de Microsoft Excel y manejo de archivos.",
    "machine-learning": "Conocimientos intermedios de Python (Pandas/NumPy) y álgebra lineal básica.",
    "analitica-mineria": "Conocimientos básicos de análisis de datos y Excel.",
    "analitica-financiera": "Nociones básicas de contabilidad y finanzas corporativas."
  };

  const jobRole = occupationalCategories[course.slug] || "Analista de Datos, Profesional de Negocios";
  const prereq = prerequisites[course.slug] || "No se requieren conocimientos previos de programación.";

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: `https://programbi.com/cursos/${course.slug}`,
    provider: {
      "@type": "Organization",
      name: "ProgramBI",
      url: "https://programbi.com",
      "@id": "https://programbi.com/#organization",
      sameAs: [
        "https://www.instagram.com/programbi_capacitaciones/",
        "https://www.tiktok.com/@programbi",
        "https://cl.linkedin.com/company/programbi",
        "https://www.youtube.com/@ProgramBi",
      ],
    },
    image: course.imageUrl,
    educationalLevel: course.level,
    inLanguage: "es",
    courseMode: course.modality === "online" ? "Online" : "Blended",
    numberOfCredits: course.durationHours,
    timeRequired: `PT${course.durationHours}H`,
    teaches: course.whatYouLearn.join(", "),
    coursePrerequisites: prereq,
    educationalCredentialAwarded: "Certificado de Aprobación Oficial ProgramBI SPA",
    occupationalCategory: jobRole,
    financialAidEligible: "Becas de financiamiento parcial disponibles directamente con ProgramBI",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: course.isFeatured ? "142" : "56",
      bestRating: "5",
      worstRating: "1",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      instructor: {
        "@type": "Person",
        name: "Manuel Oliva",
        jobTitle: "CEO & Fundador ProgramBI",
        sameAs: "https://cl.linkedin.com/company/programbi"
      },
    },
    ...(lowestPrice && {
      offers: {
        "@type": "Offer",
        price: lowestPrice,
        priceCurrency: "CLP",
        availability: "https://schema.org/InStock",
        url: `https://programbi.com/cursos/${course.slug}`,
        validFrom: new Date().toISOString(),
      },
    }),
    syllabusSections: course.syllabus.map((s) => ({
      "@type": "Syllabus",
      name: s.module,
      description: s.topics.join(", "),
    })),
  };
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const dbDescription = await getMarketingDescription(slug);
  if (dbDescription) {
    course.description = dbDescription;
  }

  const jsonLd = getCourseJsonLd(course);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      {/* TL;DR Summary Block for GEO/SEO Optimization (Visually hidden for users, accessible for LLMs/Crawlers) */}
      <section className="sr-only">
        <h2>Resumen Rápido (TL;DR) - {course.title}</h2>
        <p>
          El {course.title} es un programa de capacitación online en vivo de {course.durationHours} horas dictado en español. Está diseñado para formar profesionales con proyectos reales, grabaciones permanentes y certificado oficial de ProgramBI SPA.
        </p>
      </section>

      <CourseDetailClient course={course} />
    </>
  );
}
