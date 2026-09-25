import { notFound, permanentRedirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/data/courses";

type Params = Promise<{ slug: string }>;

export default async function EmpresaCoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  if (!getCourseBySlug(slug)) notFound();
  permanentRedirect(`/cursos/${slug}?para=empresas`);
}
