"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import MisCursos from "@/components/comunidad/tabs/MisCursos";
import type { LiteCourse, LiteEnrollment } from "@/lib/comunidad/queries";

export function CursosCatalog({
  courses,
  enrollmentData,
}: {
  courses: LiteCourse[];
  enrollmentData: { enrollments: LiteEnrollment[]; programSiblings: LiteCourse[] };
}) {
  return (
    <Suspense fallback={<div className="h-40 rounded-xl border border-border bg-surface animate-pulse" />}>
      <CursosCatalogInner courses={courses} enrollmentData={enrollmentData} />
    </Suspense>
  );
}

function CursosCatalogInner({
  courses,
  enrollmentData,
}: {
  courses: LiteCourse[];
  enrollmentData: { enrollments: LiteEnrollment[]; programSiblings: LiteCourse[] };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtro = searchParams.get("filtro");

  const mappedCourses = useMemo(
    () =>
      courses.map((c) => ({
        ...c,
        short_description: c.short_description || "",
        category: c.category || "",
        image_url: c.image_url || "",
        icon: c.icon || "",
        accent_color: c.accent_color || "",
        tech_stack: c.tech_stack || [],
        duration_hours: c.duration_hours || 0,
        level: c.level || "",
        is_featured: !!c.is_featured,
        sort_order: c.sort_order || 0,
        price_clp: c.price_clp || 0,
      })),
    [courses]
  );

  return (
    <MisCursos
      onSelectCourse={(slug) => router.push(`/comunidad/cursos/${slug}`)}
      initialCourses={mappedCourses}
      initialEnrollments={enrollmentData as any}
      initialFilter={filtro === "todos" ? "all" : "active"}
      onFilterChange={(next) => {
        const params = new URLSearchParams(searchParams.toString());
        if (next === "all") params.set("filtro", "todos");
        else params.delete("filtro");
        const qs = params.toString();
        router.replace(qs ? `/comunidad/cursos?${qs}` : "/comunidad/cursos", { scroll: false });
      }}
    />
  );
}
