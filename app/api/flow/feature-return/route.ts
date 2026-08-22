import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus, FLOW_STATUS } from "@/lib/flow/client";
import { createAdminClient } from "@/lib/supabase/server";
import { applyPaidFeatureOrder } from "@/lib/jobs/feature";

/**
 * Retorno del usuario tras pagar un destacado en Flow.
 * Si el pago ya está liquidado, aplica el destacado de inmediato
 * (idempotente con el webhook) y redirige al panel con el resultado.
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://programbi.com";

    if (!token) {
      return NextResponse.redirect(`${appUrl}/comunidad/empleos?feature=error`);
    }

    const flowStatus = await getFlowPaymentStatus(token);
    const supabase = createAdminClient();

    const { data: order } = await supabase
      .from("job_feature_orders")
      .select("id, job_id, company_id, user_id, days, status")
      .eq("flow_order", flowStatus.commerceOrder)
      .maybeSingle();

    let result = "pending";

    if (order) {
      if (flowStatus.status === FLOW_STATUS.PAID && order.status !== "paid") {
        await applyPaidFeatureOrder(order);
        result = "ok";
      } else if (order.status === "paid") {
        result = "ok";
      }

      if (order.status !== "paid") {
        await supabase
          .from("job_feature_orders")
          .update({
            status: flowStatus.status === FLOW_STATUS.PAID ? "paid" : "cancelled",
            paid_at: flowStatus.status === FLOW_STATUS.PAID ? new Date().toISOString() : null,
          })
          .eq("id", order.id);
      }
    }

    return NextResponse.redirect(`${appUrl}/comunidad/empleos?feature=${result}`);
  } catch (error: any) {
    console.error("Flow feature-return error:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://programbi.com";
    return NextResponse.redirect(`${appUrl}/comunidad/empleos?feature=error`);
  }
}
