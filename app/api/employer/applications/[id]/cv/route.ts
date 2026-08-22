import { NextRequest, NextResponse } from "next/server";
import { requireEmployer } from "@/lib/jobs/employer-guard";
import { createServiceClient } from "@/lib/supabase";

/**
 * Genera una URL firmada (10 min) para descargar el CV de un postulante.
 * Solo para postulaciones a vacantes de la propia empresa.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { supabase, company } = auth.data;

    // Verificar pertenencia vía RLS
    const { data: application } = await supabase
      .from("job_applications")
      .select("id, user_id, jobs!inner (company_id)")
      .eq("id", id)
      .maybeSingle();
    if (!application) {
      return NextResponse.json({ error: "Postulación no encontrada." }, { status: 404 });
    }

    const service = createServiceClient();
    const { data: candidate } = await service
      .from("candidate_profiles")
      .select("cv_url")
      .eq("user_id", application.user_id)
      .maybeSingle();

    if (!candidate?.cv_url) {
      return NextResponse.json({ error: "El candidato no adjuntó CV." }, { status: 404 });
    }

    // cv_url se guarda como ruta dentro del bucket: "<user_id>/<archivo>"
    const bucket = "cvs";
    const path = candidate.cv_url.startsWith("http")
      ? candidate.cv_url.split(`/${bucket}/`)[1]
      : candidate.cv_url;

    const { data, error } = await service.storage
      .from(bucket)
      .createSignedUrl(decodeURIComponent(path ?? ""), 600);

    if (error || !data) {
      console.error("signed url error:", error);
      return NextResponse.json({ error: "No pudimos generar el enlace del CV." }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (err: any) {
    console.error("API Error in employer/applications/[id]/cv:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
