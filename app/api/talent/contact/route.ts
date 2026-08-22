import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireEmployer } from "@/lib/jobs/employer-guard";
import { createServiceClient } from "@/lib/supabase";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { notifyUsers } from "@/lib/jobs/queries";

const contactSchema = z.object({
  candidate_user_id: z.string().uuid(),
  job_context: z.string().max(140).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
});

/**
 * Una empresa aprobada solicita contactar a un candidato del directorio.
 * El candidato recibe notificación in-app + email con el email de contacto
 * de la empresa para responder directamente. Sin intermediarios.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const limitRes = isRateLimited(ip, "talent-contact", 10, 60 * 60 * 1000);
    if (limitRes.limited) {
      return NextResponse.json(
        { error: "Has enviado muchas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { user, company } = auth.data;

    const body = await req.json();
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const service = createServiceClient();

    // El candidato debe estar visible en el directorio
    const { data: candidate } = await service
      .from("candidate_profiles")
      .select("user_id, is_searchable")
      .eq("user_id", validation.data.candidate_user_id)
      .eq("is_searchable", true)
      .maybeSingle();
    if (!candidate) {
      return NextResponse.json({ error: "Candidato no disponible." }, { status: 404 });
    }

    // Evitar duplicados: misma empresa + candidato en los últimos 7 días
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await service
      .from("talent_contact_requests")
      .select("id")
      .eq("candidate_user_id", candidate.user_id)
      .eq("company_id", company.id)
      .gte("created_at", weekAgo)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "Ya contactaste a esta persona hace menos de 7 días." },
        { status: 409 }
      );
    }

    const { error } = await service.from("talent_contact_requests").insert({
      candidate_user_id: candidate.user_id,
      company_id: company.id,
      requester_user_id: user.id,
      job_context: validation.data.job_context?.trim() || null,
      message: validation.data.message?.trim() || null,
    });
    if (error) {
      console.error("talent contact insert error:", error);
      return NextResponse.json({ error: "No pudimos enviar tu solicitud." }, { status: 500 });
    }

    // Notificación in-app + email al candidato (con email directo de la empresa)
    const context = validation.data.job_context?.trim();
    const jobMsg = context ? ` por «${context}»` : "";
    await notifyUsers([candidate.user_id], {
      type: "system",
      title: "Una empresa quiere contactarte",
      message: `${company.name} vio tu perfil en el directorio de talento${jobMsg}. Responde a: ${company.contact_email}`,
      link: "/comunidad/empleos",
    });

    try {
      const { sendTalentContactEmail } = await import("@/lib/email/mailersend");
      const { data: profile } = await service
        .from("profiles")
        .select("full_name, email")
        .eq("id", candidate.user_id)
        .maybeSingle();
      if (profile?.email) {
        await sendTalentContactEmail({
          to: profile.email,
          candidateName: profile.full_name ?? "Candidato",
          companyName: company.name,
          jobContext: context || null,
          message: validation.data.message?.trim() || null,
        });
      }
    } catch (emailErr: any) {
      console.error("Talent contact email error:", emailErr?.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in talent/contact:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
