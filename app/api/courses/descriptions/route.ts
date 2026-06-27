import { NextResponse } from "next/server";
import { getCourseDescriptions } from "@/lib/supabase/comunidad-ai";

export const dynamic = "force-dynamic";

/**
 * GET /api/courses/descriptions
 * Returns descriptions of all courses (slug, description, short_description) from Supabase.
 * Public endpoint.
 */
export async function GET() {
  try {
    const descriptions = await getCourseDescriptions();
    return NextResponse.json(descriptions);
  } catch (err: any) {
    console.error("Error in /api/courses/descriptions endpoint:", err);
    return NextResponse.json({ error: "Error al obtener descripciones de cursos" }, { status: 500 });
  }
}
