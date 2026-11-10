import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { isCurrentUserAdmin } from "@/lib/supabase/comunidad";

export const dynamic = "force-dynamic";

/**
 * GET  /api/courses/brochure?slug=power-bi  → público.
 * Devuelve el brochure PDF personalizado del curso, o null si el curso usa el
 * brochure automático generado con jsPDF.
 *
 * POST /api/courses/brochure  → solo admin.
 * Body: { slug: string, brochurePdfUrl: string | null }
 */

const brochurePdfUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => /^https?:\/\/\S+$/i.test(value), {
    message: "Debe ser una URL http(s) válida",
  });

const updateSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  brochurePdfUrl: z.union([brochurePdfUrlSchema, z.null()]),
});

/** true si el error de PostgREST es por la columna `brochure_pdf_url` inexistente. */
function isMissingColumnError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const message = (error.message || "").toLowerCase();
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    message.includes("brochure_pdf_url") ||
    message.includes("schema cache")
  );
}

export async function GET(req: NextRequest) {
  try {
    const slug = (req.nextUrl.searchParams.get("slug") || "").trim();
    if (!slug) {
      return NextResponse.json({ error: "Falta el parámetro slug" }, { status: 400 });
    }

    const adminDb = createAdminClient();

    let { data, error } = await adminDb
      .from("courses")
      .select("slug, brochure_pdf_url")
      .eq("slug", slug)
      .maybeSingle();

    // Entornos sin la migración aplicada: se responde con null y se sigue.
    if (error && isMissingColumnError(error)) {
      const retry = await adminDb
        .from("courses")
        .select("slug")
        .eq("slug", slug)
        .maybeSingle();

      if (retry.error) throw retry.error;

      return NextResponse.json({
        slug: retry.data?.slug ?? slug,
        brochurePdfUrl: null,
      });
    }

    if (error) throw error;

    return NextResponse.json({
      slug: data?.slug ?? slug,
      brochurePdfUrl: data?.brochure_pdf_url ?? null,
    });
  } catch (err: any) {
    console.error("GET /api/courses/brochure error:", err);
    return NextResponse.json(
      { error: "No se pudo obtener el brochure del curso." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos: revisa el slug y la URL del brochure." },
        { status: 400 }
      );
    }

    const { slug, brochurePdfUrl } = validation.data;
    const adminDb = createAdminClient();

    const { error } = await adminDb
      .from("courses")
      .update({ brochure_pdf_url: brochurePdfUrl })
      .eq("slug", slug);

    if (error) {
      if (isMissingColumnError(error)) {
        return NextResponse.json(
          {
            error:
              "La columna brochure_pdf_url no existe. Aplica la migración 20261107000000_course_brochure_pdf.sql.",
          },
          { status: 500 }
        );
      }
      throw error;
    }

    revalidatePath("/cursos/[slug]", "page");
    revalidatePath("/[pais]/cursos/[slug]", "page");
    revalidatePath("/cursos/[slug]/brochure", "page");
    revalidatePath("/[pais]/cursos/[slug]/brochure", "page");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST /api/courses/brochure error:", err);
    return NextResponse.json(
      { error: "No se pudo guardar el brochure del curso." },
      { status: 500 }
    );
  }
}
