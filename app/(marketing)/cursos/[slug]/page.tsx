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

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: `${course.title} | ProgramBI`,
      description: course.description,
    },
  };
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  return <CourseDetailClient course={course} />;
}
