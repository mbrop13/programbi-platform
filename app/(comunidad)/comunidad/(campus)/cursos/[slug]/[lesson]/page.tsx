import { notFound } from "next/navigation";
import { LessonWorkspace } from "@/components/comunidad/aula/LessonWorkspace";
import { getCourseIdBySlug, getCourseSyllabus, getLessonDetail } from "@/lib/comunidad/queries";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
  const { slug, lesson } = await params;
  const courseId = await getCourseIdBySlug(slug);
  if (!courseId) notFound();
  const syllabus = await getCourseSyllabus(courseId);
  if (!syllabus) notFound();
  const meta = syllabus.modules.flatMap((m) => m.lessons).find((l) => l.slug === lesson);
  if (!meta) notFound();
  const detail = await getLessonDetail(courseId, meta.id);
  return <LessonWorkspace syllabus={syllabus} lessonSlug={lesson} initialDetail={detail} />;
}
