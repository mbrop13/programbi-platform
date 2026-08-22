import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";

/** Empresas de la bolsa de trabajo con métricas, filtrables por estado. */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const service = createServiceClient();
    const status = req.nextUrl.searchParams.get("status"); // pending | approved | rejected | all

    let query = service
      .from("employer_companies")
      .select(`
        id, name, slug, logo_url, website, industry, description, size, city, country,
        contact_email, contact_whatsapp, status, rejection_reason, owner_user_id, created_at,
        profiles!employer_companies_owner_user_id_fkey (full_name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(300);

    if (status && status !== "all") query = query.eq("status", status);

    const { data: companies, error } = await query;
    if (error) {
      console.error("admin/employers GET error:", error);
      return NextResponse.json({ error: "Error al cargar empresas." }, { status: 500 });
    }

    // Métricas por empresa: vacantes publicadas y postulaciones
    const { data: jobsStats } = await service
      .from("jobs")
      .select("company_id, status, applications_count");

    const statsByCompany = new Map<string, { jobs: number; published: number; applications: number }>();
    for (const job of (jobsStats ?? []) as any[]) {
      const entry =
        statsByCompany.get(job.company_id) ?? { jobs: 0, published: 0, applications: 0 };
      entry.jobs += 1;
      if (job.status === "published") entry.published += 1;
      entry.applications += job.applications_count ?? 0;
      statsByCompany.set(job.company_id, entry);
    }

    const result = (companies ?? []).map((c: any) => ({
      ...c,
      owner: c.profiles ?? null,
      stats: statsByCompany.get(c.id) ?? { jobs: 0, published: 0, applications: 0 },
    }));

    return NextResponse.json({ companies: result });
  } catch (err: any) {
    console.error("API Error in admin/employers GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
