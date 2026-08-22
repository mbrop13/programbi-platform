import { createServiceClient } from "@/lib/supabase";
import { notifyUsers } from "@/lib/jobs/queries";

/**
 * Aplica un destacado pagado a una vacante (idempotente):
 * extiende featured_until desde hoy o desde el fin del destacado activo.
 * Usado por el webhook y por el return de Flow, el que llegue primero.
 */
export async function applyPaidFeatureOrder(order: {
  id: string;
  job_id: string;
  company_id: string;
  user_id: string;
  days: number;
}) {
  const service = createServiceClient();

  const { data: job } = await service
    .from("jobs")
    .select("title, featured, featured_until")
    .eq("id", order.job_id)
    .single();
  if (!job) return;

  const currentUntil = job.featured_until ? new Date(job.featured_until) : null;
  const base = currentUntil && currentUntil > new Date() ? currentUntil : new Date();
  const featuredUntil = new Date(base.getTime() + order.days * 24 * 60 * 60 * 1000).toISOString();

  await service
    .from("jobs")
    .update({ featured: true, featured_until: featuredUntil })
    .eq("id", order.job_id);

  await notifyUsers([order.user_id], {
    type: "system",
    title: "¡Tu vacante está destacada!",
    message: `«${job.title}» aparecerá arriba del listado hasta el ${new Date(featuredUntil).toLocaleDateString("es-CL")}.`,
    link: "/comunidad/empleos",
  });

  // Email de confirmación al contacto de la empresa
  try {
    const { sendFeatureConfirmationEmail } = await import("@/lib/email/mailersend");
    const { data: company } = await service
      .from("employer_companies")
      .select("contact_email, name")
      .eq("id", order.company_id)
      .maybeSingle();
    if (company?.contact_email) {
      await sendFeatureConfirmationEmail({
        to: company.contact_email,
        companyName: company.name,
        jobTitle: job.title,
        days: order.days,
        featuredUntil,
        amountClp: null,
      });
    }
  } catch (err: any) {
    console.error("Feature confirmation email error:", err?.message);
  }
}
