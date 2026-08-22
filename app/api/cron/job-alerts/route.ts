import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { formatSalaryCLP, type JobPublic } from "@/lib/jobs/types";
import { mapJobRow } from "@/lib/jobs/queries";

/**
 * Cron de alertas de vacantes (digest semanal por email).
 * Corre a diario pero solo envía las alertas cuya última revisión fue
 * hace 7 días o más (o que nunca se han enviado).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
  }

  const service = createServiceClient();
  const now = Date.now();
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Alertas activas cuya última revisión fue hace ≥7 días (o nunca)
  const { data: alerts } = await service
    .from("job_alerts")
    .select("id, user_id, name, filters, last_sent_at")
    .eq("is_active", true)
    .limit(500);

  if (!alerts?.length) {
    return NextResponse.json({ ok: true, sent: 0, skipped: 0, errors });
  }

  // Vacantes publicadas en los últimos 7 días (una sola query para todas las alertas)
  const { data: jobRows } = await service
    .from("jobs")
    .select(`
      id, title, slug, company_id, location_city, location_country, modality,
      employment_type, seniority, description, responsibilities, requirements,
      benefits, skills, salary_min_clp, salary_max_clp, salary_visible,
      apply_via, apply_url, status, published_at, expires_at, views_count,
      applications_count, featured, featured_until,
      employer_companies!inner(name, slug, logo_url)
    `)
    .eq("status", "published")
    .gt("expires_at", new Date().toISOString())
    .gte("published_at", new Date(now - WEEK_MS).toISOString())
    .limit(300);

  const jobs: JobPublic[] = (jobRows ?? []).map(mapJobRow as any);

  for (const alert of alerts) {
    // Evitar doble envío si ya se revisó esta semana
    if (alert.last_sent_at && now - new Date(alert.last_sent_at).getTime() < WEEK_MS - 12 * 60 * 60 * 1000) {
      skipped++;
      continue;
    }

    const filters = (alert.filters ?? {}) as {
      q?: string;
      skills?: string[];
      modality?: string[];
      seniority?: string[];
    };

    const matches = jobs.filter((job) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const haystack = `${job.title} ${job.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.skills?.length && !filters.skills.some((s) => job.skills.includes(s))) return false;
      if (filters.modality?.length && !filters.modality.includes(job.modality)) return false;
      if (filters.seniority?.length && !filters.seniority.includes(job.seniority)) return false;
      return true;
    });

    // Actualizar last_sent_at aunque no haya coincidencias (la revisión se hizo)
    await service
      .from("job_alerts")
      .update({ last_sent_at: new Date().toISOString() })
      .eq("id", alert.id);

    if (!matches.length) continue;

    const { data: profile } = await service
      .from("profiles")
      .select("full_name, email")
      .eq("id", alert.user_id)
      .maybeSingle();
    if (!profile?.email) {
      errors.push(`sin email: alerta ${alert.id}`);
      continue;
    }

    try {
      const { sendJobAlertsDigestEmail } = await import("@/lib/email/mailersend");
      await sendJobAlertsDigestEmail({
        to: profile.email,
        candidateName: profile.full_name ?? "Candidato",
        alertName: alert.name,
        jobs: matches.slice(0, 8).map((job) => ({
          title: job.title,
          company: job.company_name,
          location: job.modality === "remoto" ? "Remoto" : job.location_city ?? "Chile",
          url: `https://programbi.com/empleos/${job.slug}`,
          salary: job.salary_visible
            ? `${formatSalaryCLP(job.salary_min_clp, job.salary_max_clp)} CLP`
            : null,
        })),
      });
      sent++;
    } catch (e: any) {
      errors.push(`email alerta ${alert.id}: ${e?.message}`);
    }
  }

  return NextResponse.json({ ok: true, sent, skipped, errors: errors.slice(0, 5) });
}
