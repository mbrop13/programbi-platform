import { NextRequest, NextResponse } from "next/server";
import { requireEmployer } from "@/lib/jobs/employer-guard";

/** Postulaciones a las vacantes de la empresa, con filtros opcionales. */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { company, supabase } = auth.data;

    const sp = req.nextUrl.searchParams;
    const jobId = sp.get("job_id");
    const status = sp.get("status");

    // RLS: la empresa solo puede leer postulaciones de sus propias vacantes.
    let query = supabase
      .from("job_applications")
      .select(`
        id, job_id, user_id, status, cover_letter, candidate_snapshot,
        recruiter_notes, rating, created_at, updated_at,
        jobs!inner (id, title, slug, company_id)
      `)
      .eq("jobs.company_id", company.id)
      .order("created_at", { ascending: false })
      .limit(200);

    if (jobId) query = query.eq("job_id", jobId);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
      console.error("employer/applications GET error:", error);
      return NextResponse.json({ error: "Error al cargar las postulaciones." }, { status: 500 });
    }

    const applications = (data ?? []).map((row: any) => ({
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
      job: { id: row.jobs?.id, title: row.jobs?.title, slug: row.jobs?.slug },
    }));

    return NextResponse.json({ applications });
  } catch (err: any) {
    console.error("API Error in employer/applications GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
