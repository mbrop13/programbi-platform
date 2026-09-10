import { notFound } from "next/navigation";
import { CourseHome } from "@/components/comunidad/aula/CourseHome";
import { getCourseIdBySlug, getCourseSyllabus } from "@/lib/comunidad/queries";

export default async function CourseHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const courseId = await getCourseIdBySlug(slug);
  if (!courseId) notFound();
  const syllabus = await getCourseSyllabus(courseId);
  if (!syllabus) notFound();
  return <CourseHome syllabus={syllabus} />;
}
