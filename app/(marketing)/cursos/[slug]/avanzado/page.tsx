import { notFound, permanentRedirect } from "next/navigation";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import { hasLevelNamed } from "@/lib/data/course-views";

export const dynamicParams = false;

export function generateStaticParams() {
  return courses
    .filter((course) => hasLevelNamed(course, "Avanzado"))
    .map((course) => ({ slug: course.slug }));
}

type Params = Promise<{ slug: string }>;

export default async function AdvancedCoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || !hasLevelNamed(course, "Avanzado")) notFound();
  permanentRedirect(`/cursos/${slug}?nivel=Avanzado`);
}
