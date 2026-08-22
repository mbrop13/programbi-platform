import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, getClientIp } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { buildCandidateSnapshot, getCompanyMemberIds, notifyUsers } from "@/lib/jobs/queries";

const applySchema = z.object({
  coverLetter: z.string().max(4000).optional().nullable(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;
    const ip = getClientIp(req);
    const limitRes = isRateLimited(ip, "jobs-apply", 10, 60 * 1000);
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiadas postulaciones. Espera un momento." }, { status: 429 });
    }

    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth.data;

    const body = await req.json().catch(() => ({}));
    const validation = applySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    // La vacante debe existir, estar publicada y vigente
    const { data: job } = await supabase
      .from("jobs")
      .select("id, title, slug, company_id, status, expires_at, apply_via")
      .eq("id", jobId)
      .maybeSingle();

    if (!job || job.status !== "published" || new Date(job.expires_at) <= new Date()) {
      return NextResponse.json({ error: "Esta vacante ya no está disponible." }, { status: 404 });
    }
    if (job.apply_via !== "plataforma") {
      return NextResponse.json(
        { error: "Esta vacante requiere postular por el canal indicado en la publicación." },
        { status: 400 }
      );
    }

    // El candidato debe tener su perfil laboral creado
    const { data: candidate } = await supabase
      .from("candidate_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!candidate) {
      return NextResponse.json(
        { error: "Primero completa tu perfil laboral para postular.", needsProfile: true },
        { status: 400 }
      );
    }

    // Evitar duplicados
    const { data: existing } = await supabase
      .from("job_applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: "Ya habías postulado a esta vacante." }, { status: 409 });
    }

    const snapshot = await buildCandidateSnapshot(user.id);

    const { error: insertError } = await supabase.from("job_applications").insert({
      job_id: jobId,
      user_id: user.id,
      cover_letter: validation.data.coverLetter?.trim() || null,
      candidate_snapshot: snapshot,
    });
    if (insertError) {
      console.error("Apply insert error:", insertError);
      return NextResponse.json({ error: "No pudimos registrar tu postulación." }, { status: 500 });
    }

    // Contador + notificación a la empresa (service role)
    const service = createServiceClient();
    try {
      await service.rpc("increment_job_applications", { p_job_id: jobId });
    } catch {
      /* el contador no es crítico */
    }

    const memberIds = await getCompanyMemberIds(job.company_id);
    await notifyUsers(memberIds, {
      type: "system",
      title: "Nueva postulación recibida",
      message: `${snapshot.full_name} postuló a «${job.title}».`,
      link: "/comunidad/empleos",
    });

    // Email al contacto de la empresa
    try {
      const { getSkillLabel } = await import("@/lib/data/job-skills");
      const { sendNewApplicationEmail } = await import("@/lib/email/mailersend");
      const { data: company } = await service
        .from("employer_companies")
        .select("contact_email, name")
        .eq("id", job.company_id)
        .maybeSingle();
      if (company?.contact_email) {
        await sendNewApplicationEmail({
          to: company.contact_email,
          companyName: company.name,
          jobTitle: job.title,
          candidateName: snapshot.full_name || "Un candidato",
          verifiedSkills: snapshot.verified_skills.map(getSkillLabel),
          hasCv: snapshot.has_cv,
        });
      }
    } catch (emailErr: any) {
      console.error("Application email error:", emailErr?.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in jobs/apply:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
