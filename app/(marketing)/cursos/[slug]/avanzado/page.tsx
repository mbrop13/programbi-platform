import { notFound, permanentRedirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/data/courses";
import { isTieredCourse } from "@/lib/data/course-views";

type Params = Promise<{ slug: string }>;

export default async function AdvancedCoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || !isTieredCourse(course)) notFound();
  permanentRedirect(`/cursos/${slug}?nivel=Avanzado`);
}
