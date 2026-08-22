import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getCompanyMemberIds, notifyUsers } from "@/lib/jobs/queries";

/**
 * Cron diario de la Bolsa de Trabajo:
 * 1. Cierra automáticamente vacantes publicadas cuya vigencia terminó.
 * 2. Envía email de aviso a empresas con vacantes que expiran en ≤3 días.
 *
 * Vercel Cron llama esta ruta con `Authorization: Bearer ${CRON_SECRET}`
 * cuando la variable CRON_SECRET está definida en el proyecto.
 */
export async function GET(req: Request) {
  // ─── Autenticación del cron ───
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
  }

  const service = createServiceClient();
  const now = new Date().toISOString();
  const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  let closed = 0;
  let reminded = 0;
  const errors: string[] = [];

  // ─── 1. Auto-cierre de vacantes expiradas ───
  try {
    const { data: expired } = await service
      .from("jobs")
      .select("id, title")
      .eq("status", "published")
      .lte("expires_at", now);

    if (expired?.length) {
      const { error } = await service
        .from("jobs")
        .update({ status: "closed" })
        .eq("status", "published")
        .lte("expires_at", now);
      if (!error) closed = expired.length;
    }
  } catch (e: any) {
    errors.push(`auto-close: ${e?.message}`);
  }

  // ─── 2. Aviso de expiración próxima (una sola vez por ciclo de vida) ───
  try {
    const { data: expiring } = await service
      .from("jobs")
      .select(`
        id, title, expires_at,
        employer_companies (id, name, contact_email)
      `)
      .eq("status", "published")
      .gt("expires_at", now)
      .lte("expires_at", inThreeDays)
      .is("expiry_notified_at", null)
      .limit(200);

    for (const job of expiring ?? []) {
      const company = (job as any).employer_companies ?? {};
      const daysLeft = Math.max(
        0,
        Math.ceil((new Date(job.expires_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      );

      // Email al contacto de la empresa
      if (company.contact_email) {
        try {
          const { sendJobExpiringEmail } = await import("@/lib/email/mailersend");
          await sendJobExpiringEmail({
            to: company.contact_email,
            companyName: company.name ?? "tu empresa",
            jobTitle: job.title,
            daysLeft,
          });
        } catch (e: any) {
          errors.push(`email ${job.id}: ${e?.message}`);
        }
      }

      // Notificación in-app a los miembros
      const plazo =
        daysLeft === 0
          ? "menos de un día"
          : `${daysLeft} ${daysLeft === 1 ? "día" : "días"}`;
      const memberIds = await getCompanyMemberIds(company.id);
      await notifyUsers(memberIds, {
        type: "system",
        title: "Vacante por expirar",
        message: `«${job.title}» expira en ${plazo}. Extiéndela desde tu panel.`,
        link: "/comunidad/empleos",
      });

      // Marcar aviso enviado (independiente del resultado del email)
      await service
        .from("jobs")
        .update({ expiry_notified_at: new Date().toISOString() })
        .eq("id", job.id);
      reminded++;
    }
  } catch (e: any) {
    errors.push(`reminders: ${e?.message}`);
  }

  return NextResponse.json({ ok: true, closed, reminded, errors: errors.slice(0, 5) });
}
