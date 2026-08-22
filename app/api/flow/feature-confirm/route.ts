import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus, flowStatusToString, FLOW_STATUS } from "@/lib/flow/client";
import { createAdminClient } from "@/lib/supabase/server";
import { isFlowTrustedSource } from "@/lib/security/webhook-signature";
import { applyPaidFeatureOrder } from "@/lib/jobs/feature";

/**
 * Webhook de Flow para el pago de VACANTES DESTACADAS.
 * Circuito independiente del webhook de cursos (/api/flow/confirm):
 * al confirmarse el pago marca la vacante como destacada por N días.
 */
export async function POST(req: NextRequest) {
  try {
    if (!isFlowTrustedSource(req)) {
      console.warn("⚠️ Flow feature-confirm rejected: untrusted source");
      return NextResponse.json({ error: "Untrusted source" }, { status: 401 });
    }

    const formData = await req.formData();
    const token = formData.get("token") as string;
    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    const flowStatus = await getFlowPaymentStatus(token);
    const supabase = createAdminClient();

    const { data: order } = await supabase
      .from("job_feature_orders")
      .select("id, job_id, company_id, user_id, days, status")
      .eq("flow_order", flowStatus.commerceOrder)
      .maybeSingle();

    if (!order) {
      console.error("Feature order not found:", flowStatus.commerceOrder);
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ message: "Already processed" });
    }

    const newStatus = flowStatusToString(flowStatus.status);

    if (flowStatus.status === FLOW_STATUS.PAID) {
      await applyPaidFeatureOrder(order);
    }

    await supabase
      .from("job_feature_orders")
      .update({
        status: newStatus,
        paid_at: flowStatus.status === FLOW_STATUS.PAID ? new Date().toISOString() : null,
      })
      .eq("id", order.id);

    return NextResponse.json({ message: "OK", status: newStatus });
  } catch (error: any) {
    console.error("Flow feature-confirm webhook error:", error);
    return NextResponse.json({ error: "Error procesando confirmación" }, { status: 500 });
  }
}
