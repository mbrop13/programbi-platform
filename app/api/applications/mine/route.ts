import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";

/** Postulaciones del candidato con datos de la vacante (aunque la vacante ya esté cerrada). */
export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user } = auth.data;

    // Se usa service client tras verificar auth: las RLS de `jobs` filtrarían
    // vacantes cerradas y el candidato perdería el historial de sus postulaciones.
    const service = createServiceClient();
    const { data, error } = await service
      .from("job_applications")
      .select(`
        id, job_id, user_id, status, cover_letter, candidate_snapshot,
        recruiter_notes, rating, created_at, updated_at,
        jobs (
          id, title, slug, modality, location_city, employment_type,
          salary_min_clp, salary_max_clp, salary_visible, status, expires_at,
          employer_companies!inner (name, slug, logo_url)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("applications/mine error:", error);
      return NextResponse.json({ error: "Error al cargar tus postulaciones." }, { status: 500 });
    }

    const applications = (data ?? []).map((row: any) => {
      const job = row.jobs ?? {};
      const company = job.employer_companies ?? {};
      return {
        id: row.id,
        job_id: row.job_id,
        user_id: row.user_id,
        status: row.status,
        cover_letter: row.cover_letter,
        candidate_snapshot: row.candidate_snapshot,
        recruiter_notes: row.recruiter_notes,
        rating: row.rating,
        created_at: row.created_at,
        updated_at: row.updated_at,
        job: {
          id: job.id,
          title: job.title,
          slug: job.slug,
          company_name: company.name,
          company_slug: company.slug,
          company_logo_url: company.logo_url,
          modality: job.modality,
          location_city: job.location_city,
          employment_type: job.employment_type,
          salary_min_clp: job.salary_min_clp,
          salary_max_clp: job.salary_max_clp,
          salary_visible: job.salary_visible,
        },
      };
    });

    return NextResponse.json({ applications });
  } catch (err: any) {
    console.error("API Error in applications/mine:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

/** Retirar una postulación propia. */
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const applicationId = url.searchParams.get("id");
    if (!applicationId) {
      return NextResponse.json({ error: "Falta el id de la postulación." }, { status: 400 });
    }

    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth.data;

    const { data: app } = await supabase
      .from("job_applications")
      .select("id, job_id, status")
      .eq("id", applicationId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!app) {
      return NextResponse.json({ error: "Postulación no encontrada." }, { status: 404 });
    }
    if (["offer", "hired"].includes(app.status)) {
      return NextResponse.json(
        { error: "No puedes retirar una postulación con oferta activa. Contacta a la empresa." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("job_applications")
      .update({ status: "withdrawn" })
      .eq("id", applicationId)
      .eq("user_id", user.id);
    if (error) {
      return NextResponse.json({ error: "No pudimos retirar tu postulación." }, { status: 500 });
    }

    const service = createServiceClient();
    try {
      await service.rpc("increment_job_applications", { p_job_id: app.job_id, p_delta: -1 });
    } catch {
      /* el contador no es crítico */
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in applications/mine DELETE:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
