import { getMyEnrollmentsLite, getPublishedCoursesLite } from "@/lib/comunidad/queries";
import { CursosCatalog } from "@/components/comunidad/shell/CursosCatalog";

export default async function CursosPage() {
  const [courses, enrollmentData] = await Promise.all([
    getPublishedCoursesLite(),
    getMyEnrollmentsLite(),
  ]);

  return <CursosCatalog courses={courses} enrollmentData={enrollmentData} />;
}
