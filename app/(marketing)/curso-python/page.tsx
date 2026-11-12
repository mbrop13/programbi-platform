import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CursoLanding from "@/components/marketing/CursoLanding";
import { normalizarPais } from "@/config/paises";
import { getCourseBySlug } from "@/lib/data/courses";
import type { CourseSchedule } from "@/lib/data/course-schedules";
import { LANDING_CURSOS } from "@/lib/data/landing-cursos";
import {
  contenidoLandingCurso,
  jsonLdLandingCurso,
  metadataLandingCurso,
} from "@/lib/paises/landing-curso";
import { jsonLdString } from "@/lib/seo";
import { getActiveSchedules } from "@/lib/supabase/comunidad-ai";

export const revalidate = 86400;

const copy = LANDING_CURSOS["curso-python"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais?: string }>;
}): Promise<Metadata> {
  const pais = normalizarPais((await params).pais);
  return metadataLandingCurso(copy, pais);
}

export default async function Page({
  params,
}: {
  params: Promise<{ pais?: string }>;
}) {
  const pais = normalizarPais((await params).pais);
  const course = getCourseBySlug(copy.slug);
  if (!course) notFound();

  const schedules = (await getActiveSchedules()) as CourseSchedule[];
  const contenido = contenidoLandingCurso({ copy, course, pais, schedules });
  const jsonLd = jsonLdLandingCurso({ copy, course, pais, contenido });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <CursoLanding copy={copy} course={course} contenido={contenido} />
    </>
  );
}
