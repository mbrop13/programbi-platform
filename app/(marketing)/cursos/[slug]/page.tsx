import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import { getMarketingDescription } from "@/lib/supabase/comunidad-ai";
import CourseDetailClient from "@/app/(marketing)/cursos/[slug]/CourseDetailClient";
import { ogImageUrl } from "@/lib/og/url";
import { SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";
import { COURSE_SEO } from "@/lib/seo/money";

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Curso no encontrado" };

  const seo = COURSE_SEO[slug];
  const title = seo?.title || `${course.title} — Curso en vivo Chile`;
  const dbDescription = await getMarketingDescription(slug);
  const description = seo?.description || dbDescription || course.description;

  // Tarjeta OG de marca (tipográfica, papel-monócromo) — reemplaza las
  // portadas remotas de estilo antiguo.
  const shareImage = ogImageUrl({
    kicker: "Curso en vivo Chile",
    title: course.title,
    description,
    tags: course.techStack,
    accent: course.accentColor,
    path: `cursos/${slug}`,
  });

  return {
    title: seo ? { absolute: title } : title,
    description,
    alternates: {
      canonical: `/cursos/${slug}`,
    },
    openGraph: {
      title: seo ? title : `${title} | ProgramBI`,
      description,
      url: absoluteUrl(`/cursos/${slug}`),
      type: "website",
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo ? title : `${title} | ProgramBI`,
      description,
      images: [shareImage],
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
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: absoluteUrl(`/cursos/${course.slug}`),
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
    educationalLevel: course.level,
    inLanguage: "es",
    courseMode: course.modality === "online" ? "Online" : "Blended",
    numberOfCredits: course.durationHours,
    timeRequired: `PT${course.durationHours}H`,
    teaches: course.whatYouLearn.join(", "),
    coursePrerequisites: prereq,
    educationalCredentialAwarded: "Certificado de Aprobación Oficial ProgramBI SPA",
    occupationalCategory: jobRole,
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
        url: absoluteUrl(`/cursos/${course.slug}`),
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

  const seo = COURSE_SEO[slug];
  const dbDescription = await getMarketingDescription(slug);
  if (dbDescription && !seo) {
    course.description = dbDescription;
  } else if (seo) {
    course.description = seo.description;
  }

  const courseJsonLd = getCourseJsonLd(course);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      courseJsonLd,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Cursos", item: absoluteUrl("/cursos") },
          {
            "@type": "ListItem",
            position: 3,
            name: seo?.h1 || course.title,
            item: absoluteUrl(`/cursos/${slug}`),
          },
        ],
      },
      seo
        ? {
            "@type": "FAQPage",
            mainEntity: seo.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }
        : null,
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <section className="sr-only">
        <h2>{seo?.h1 || course.title}</h2>
        <p>{seo?.description || course.description}</p>
      </section>
      <CourseDetailClient course={course} />
    </>
  );
}
