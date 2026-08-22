import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireEmployer } from "@/lib/jobs/employer-guard";
import { createServiceClient } from "@/lib/supabase";
import { getFeaturedPlan } from "@/lib/jobs/pricing";
import { createFlowPayment } from "@/lib/flow/client";
import { getClientIp } from "@/lib/auth-helpers";
import { isRateLimited } from "@/lib/security/rate-limiter";

const featureSchema = z.object({
  job_id: z.string().uuid(),
  days: z.number().int(),
});

/** Iniciar el pago de una vacante destacada (Flow, circuito independiente). */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limitRes = isRateLimited(ip, "job-feature", 5, 60 * 1000);
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiados intentos." }, { status: 429 });
    }

    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { user, company, supabase } = auth.data;

    const body = await req.json();
    const validation = featureSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }
    const plan = getFeaturedPlan(validation.data.days);
    if (!plan) {
      return NextResponse.json({ error: "Plan de destacado no disponible." }, { status: 400 });
    }

    // La vacante debe ser de la empresa y estar publicada
    const { data: job } = await supabase
      .from("jobs")
      .select("id, title, status, featured, featured_until")
      .eq("id", validation.data.job_id)
      .eq("company_id", company.id)
      .maybeSingle();
    if (!job) {
      return NextResponse.json({ error: "Vacante no encontrada." }, { status: 404 });
    }
    if (job.status !== "published") {
      return NextResponse.json(
        { error: "Solo puedes destacar vacantes publicadas." },
        { status: 400 }
      );
    }

    const service = createServiceClient();
    const orderId = crypto.randomUUID();
    const commerceOrder = `FEATURE-${orderId.slice(0, 8).toUpperCase()}`;

    // Email para el pago: contacto de la empresa o el usuario actual
    let payerEmail = company.contact_email;
    if (!payerEmail) {
      const { data: profile } = await service
        .from("profiles")
        .select("email")
        .eq("id", user.id)
        .maybeSingle();
      payerEmail = profile?.email ?? user.email ?? "contacto@programbi.cl";
    }

    const payment = await createFlowPayment({
      commerceOrder,
      subject: `Destacar vacante ${plan.days} días: ${job.title}`.slice(0, 140),
      amount: plan.amount_clp,
      email: payerEmail,
      optional: { type: "job_feature", order_id: orderId },
      urlConfirmation: `${process.env.NEXT_PUBLIC_APP_URL || "https://programbi.com"}/api/flow/feature-confirm`,
      urlReturn: `${process.env.NEXT_PUBLIC_APP_URL || "https://programbi.com"}/api/flow/feature-return`,
    });

    const { error: orderError } = await service.from("job_feature_orders").insert({
      id: orderId,
      job_id: job.id,
      company_id: company.id,
      user_id: user.id,
      days: plan.days,
      amount_clp: plan.amount_clp,
      status: "pending",
      flow_order: commerceOrder,
      flow_token: payment.token,
    });
    if (orderError) {
      console.error("feature order insert error:", orderError);
      return NextResponse.json({ error: "No pudimos iniciar el pago." }, { status: 500 });
    }

    return NextResponse.json({ success: true, paymentUrl: payment.url });
  } catch (err: any) {
    console.error("API Error in employer/feature POST:", err);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      { error: isProd ? "No pudimos iniciar el pago." : err?.message },
      { status: 500 }
    );
  }
}

/** Órdenes de destacado de la empresa. */
export async function GET() {
  try {
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;

    const service = createServiceClient();
    const { data } = await service
      .from("job_feature_orders")
      .select("id, job_id, days, amount_clp, status, paid_at, created_at")
      .eq("company_id", auth.data.company.id)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ orders: data ?? [] });
  } catch (err: any) {
    console.error("API Error in employer/feature GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
