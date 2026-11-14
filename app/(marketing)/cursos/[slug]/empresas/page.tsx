import { notFound, permanentRedirect } from "next/navigation";
import { courses, getCourseBySlug } from "@/lib/data/courses";

export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

type Params = Promise<{ slug: string }>;

export default async function EmpresaCoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  if (!getCourseBySlug(slug)) notFound();
  permanentRedirect(`/cursos/${slug}?para=empresas`);
}
