import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import CourseDetailClient from "@/app/(marketing)/cursos/[slug]/CourseDetailClient";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Curso no encontrado" };

  const title = `${course.title} — Curso Online`;
  const description = course.description;

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
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      instructor: {
        "@type": "Person",
        name: "Manuel Oliva",
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

  const jsonLd = getCourseJsonLd(course);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CourseDetailClient course={course} />
    </>
  );
}
