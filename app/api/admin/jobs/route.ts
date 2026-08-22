import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";
import { getSkillLabel } from "@/lib/data/job-skills";

const actionSchema = z.object({
  job_id: z.string().uuid(),
  action: z.enum(["pause", "close", "reopen", "delete"]),
});

/** Todas las vacantes con datos de empresa + métricas generales. */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const service = createServiceClient();
    const q = req.nextUrl.searchParams.get("q")?.trim();

    let query = service
      .from("jobs")
      .select(`
        id, title, slug, status, modality, employment_type, seniority, skills,
        salary_min_clp, salary_max_clp, salary_visible, views_count, applications_count,
        published_at, expires_at, created_at,
        employer_companies!inner (id, name, slug, status)
      `)
      .order("created_at", { ascending: false })
      .limit(300);

    if (q) query = query.or(`title.ilike.%${q.replace(/[%_,()]/g, " ").trim()}%`);

    const { data: jobs, error } = await query;
    if (error) {
      console.error("admin/jobs GET error:", error);
      return NextResponse.json({ error: "Error al cargar las vacantes." }, { status: 500 });
    }

    // Métricas globales
    const { count: totalCompanies } = await service
      .from("employer_companies")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved");
    const { count: pendingCompanies } = await service
      .from("employer_companies")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    const { count: totalApplications } = await service
      .from("job_applications")
      .select("id", { count: "exact", head: true });

    // Skills más demandadas
    const skillCount = new Map<string, number>();
    for (const job of (jobs ?? []) as any[]) {
      for (const skill of job.skills ?? []) {
        skillCount.set(skill, (skillCount.get(skill) ?? 0) + 1);
      }
    }
    const topSkills = Array.from(skillCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, label: getSkillLabel(skill), count }));

    // Funnel de estados de postulaciones
    const { data: funnelData } = await service
      .from("job_applications")
      .select("status");
    const funnel: Record<string, number> = {};
    for (const row of (funnelData ?? []) as any[]) {
      funnel[row.status] = (funnel[row.status] ?? 0) + 1;
    }

    // ── Destacados pagados (ingresos) ──
    const { data: featureOrders } = await service
      .from("job_feature_orders")
      .select(`
        id, days, amount_clp, status, paid_at, created_at,
        jobs!job_feature_orders_job_id_fkey (title),
        employer_companies!job_feature_orders_company_id_fkey (name)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    const orders = (featureOrders ?? []) as any[];
    const paidOrders = orders.filter((o) => o.status === "paid");
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const revenueTotal = paidOrders.reduce((sum, o) => sum + (o.amount_clp ?? 0), 0);
    const revenueThisMonth = paidOrders
      .filter((o) => o.paid_at && new Date(o.paid_at) >= monthStart)
      .reduce((sum, o) => sum + (o.amount_clp ?? 0), 0);
    const { count: activeFeatured } = await service
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("featured", true)
      .gt("featured_until", new Date().toISOString());

    // ── Solicitudes de contacto del directorio de talento ──
    const { data: contactRequests } = await service
      .from("talent_contact_requests")
      .select(`
        id, job_context, message, created_at,
        profiles!talent_contact_requests_candidate_user_id_fkey (full_name),
        employer_companies!talent_contact_requests_company_id_fkey (name)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({
      jobs: jobs ?? [],
      metrics: {
        totalCompanies: totalCompanies ?? 0,
        pendingCompanies: pendingCompanies ?? 0,
        totalApplications: totalApplications ?? 0,
        publishedJobs: (jobs ?? []).filter((j: any) => j.status === "published").length,
        topSkills,
        funnel,
        revenueTotal,
        revenueThisMonth,
        activeFeatured: activeFeatured ?? 0,
        totalFeatureOrders: orders.length,
        paidFeatureOrders: paidOrders.length,
        totalContactRequests: (contactRequests ?? []).length,
      },
      featureOrders: orders.map((o) => ({
        id: o.id,
        days: o.days,
        amount_clp: o.amount_clp,
        status: o.status,
        paid_at: o.paid_at,
        created_at: o.created_at,
        job_title: o.jobs?.title ?? "—",
        company_name: o.employer_companies?.name ?? "—",
      })),
      contactRequests: ((contactRequests ?? []) as any[]).map((r) => ({
        id: r.id,
        job_context: r.job_context,
        message: r.message,
        created_at: r.created_at,
        candidate_name: r.profiles?.full_name ?? "Candidato",
        company_name: r.employer_companies?.name ?? "—",
      })),
    });
  } catch (err: any) {
    console.error("API Error in admin/jobs GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

/** Acciones de moderación sobre cualquier vacante. */
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const validation = actionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }
    const { job_id, action } = validation.data;

    const service = createServiceClient();

    if (action === "delete") {
      const { error } = await service.from("jobs").delete().eq("id", job_id);
      if (error) {
        return NextResponse.json({ error: "No pudimos eliminar la vacante." }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    const statusMap = { pause: "paused", close: "closed", reopen: "published" } as const;
    const expiresMap =
      action === "reopen"
        ? { expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
        : action === "close"
          ? { expires_at: new Date().toISOString() }
          : {};

    const { error } = await service
      .from("jobs")
      .update({ status: statusMap[action], ...expiresMap })
      .eq("id", job_id);
    if (error) {
      return NextResponse.json({ error: "No pudimos actualizar la vacante." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in admin/jobs PATCH:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
