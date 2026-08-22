import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireEmployer } from "@/lib/jobs/employer-guard";
import { notifyUsers } from "@/lib/jobs/queries";
import { APPLICATION_STATUS_LABELS } from "@/lib/jobs/types";
import type { ApplicationStatus } from "@/lib/jobs/types";

const applicationUpdateSchema = z.object({
  status: z
    .enum(["sent", "viewed", "shortlisted", "interview", "offer", "hired", "rejected", "withdrawn"])
    .optional(),
  recruiter_notes: z.string().max(4000).optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
});

/** Actualizar estado/notas/rating de una postulación a una vacante propia. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { supabase } = auth.data;

    // RLS: solo postulaciones a vacantes de la empresa del usuario
    const { data: application } = await supabase
      .from("job_applications")
      .select(`id, user_id, status, jobs!inner (id, title, company_id)`)
      .eq("id", id)
      .maybeSingle();

    if (!application) {
      return NextResponse.json({ error: "Postulación no encontrada." }, { status: 404 });
    }

    const body = await req.json();
    const validation = applicationUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }
    const d = validation.data;

    const payload: Record<string, any> = {};
    if (d.recruiter_notes !== undefined) payload.recruiter_notes = d.recruiter_notes || null;
    if (d.rating !== undefined) payload.rating = d.rating ?? null;
    if (d.status !== undefined) payload.status = d.status;

    if (!Object.keys(payload).length) {
      return NextResponse.json({ error: "Nada que actualizar." }, { status: 400 });
    }

    // Marcado automático: la primera acción del reclututor registra "vista"
    if (!d.status && application.status === "sent") {
      payload.status = "viewed";
    }

    const { error } = await supabase.from("job_applications").update(payload).eq("id", id);
    if (error) {
      console.error("employer/applications PATCH error:", error);
      return NextResponse.json({ error: "No pudimos actualizar la postulación." }, { status: 500 });
    }

    // Notificar al candidato cuando cambia su estado
    if (d.status && d.status !== application.status) {
      const label = APPLICATION_STATUS_LABELS[d.status as ApplicationStatus];
      const jobTitle = (application as any).jobs?.title ?? "tu postulación";
      await notifyUsers([application.user_id], {
        type: "system",
        title: "Actualización de tu postulación",
        message: `Tu postulación a «${jobTitle}» ahora está en estado: ${label}.`,
        link: "/comunidad/empleos",
      });

      // Email al candidato
      try {
        // El snapshot completo no vino en el select: lo obtenemos para el email
        const { data: fullApp } = await supabase
          .from("job_applications")
          .select("candidate_snapshot")
          .eq("id", id)
          .maybeSingle();
        const snap = fullApp?.candidate_snapshot ?? {};
        if (snap?.email) {
          const { sendCandidateStatusEmail } = await import("@/lib/email/mailersend");
          const { createServiceClient } = await import("@/lib/supabase");
          const service = createServiceClient();
          const { data: company } = await service
            .from("employer_companies")
            .select("name")
            .eq("id", (application as any).jobs?.company_id)
            .maybeSingle();
          await sendCandidateStatusEmail({
            to: snap.email,
            candidateName: snap.full_name ?? "Candidato",
            jobTitle,
            companyName: company?.name ?? "la empresa",
            statusLabel: label,
          });
        }
      } catch (emailErr: any) {
        console.error("Status email error:", emailErr?.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in employer/applications/[id] PATCH:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
