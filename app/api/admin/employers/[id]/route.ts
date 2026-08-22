import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";
import { notifyUsers } from "@/lib/jobs/queries";

const decisionSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().max(500).optional(),
});

/** Aprobar o rechazar una empresa postulante a la bolsa de trabajo. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const validation = decisionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }
    const { action, reason } = validation.data;

    const service = createServiceClient();
    const { data: company } = await service
      .from("employer_companies")
      .select("id, name, status, owner_user_id, contact_email")
      .eq("id", id)
      .maybeSingle();
    if (!company) {
      return NextResponse.json({ error: "Empresa no encontrada." }, { status: 404 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";
    const { error } = await service
      .from("employer_companies")
      .update({
        status: newStatus,
        rejection_reason: action === "reject" ? reason?.trim() || null : null,
      })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: "No pudimos actualizar la empresa." }, { status: 500 });
    }

    await notifyUsers([company.owner_user_id], {
      type: "system",
      title: action === "approve" ? "¡Tu empresa fue aprobada!" : "Registro de empresa rechazado",
      message:
        action === "approve"
          ? `«${company.name}» ya puede publicar vacantes en la bolsa de trabajo de ProgramBI.`
          : `Tu solicitud para «${company.name}» fue rechazada${reason ? `: ${reason}` : ""}.`,
      link: "/comunidad/empleos",
    });

    // Email al dueño
    try {
      const { sendCompanyApprovalEmail } = await import("@/lib/email/mailersend");
      await sendCompanyApprovalEmail({
        to: company.contact_email,
        companyName: company.name,
        approved: action === "approve",
        reason,
      });
    } catch (emailErr: any) {
      console.error("Approval email error:", emailErr?.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in admin/employers PATCH:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
