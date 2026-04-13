import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus, flowStatusToString, FLOW_STATUS } from "@/lib/flow/client";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Flow calls this webhook POST with { token } after payment is processed.
 * We verify the status, update payment record, and auto-enroll if paid.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get("token") as string;

    if (!token) {
      console.error("Flow confirm: no token received");
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    // Get payment status from Flow
    const flowStatus = await getFlowPaymentStatus(token);
    
    console.log("Flow payment status:", JSON.stringify(flowStatus, null, 2));

    const supabase = createAdminClient();

    // Find our payment record
    const { data: payment } = await supabase
      .from("payments")
      .select("id, user_id, course_id, status")
      .eq("flow_order", flowStatus.commerceOrder)
      .single();

    if (!payment) {
      console.error("Payment not found for order:", flowStatus.commerceOrder);
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    // Already processed?
    if (payment.status === "paid") {
      return NextResponse.json({ message: "Already processed" });
    }

    const newStatus = flowStatusToString(flowStatus.status);

    // Update payment record
    await supabase.from("payments").update({
      status: newStatus,
      flow_status: flowStatus.status,
      payment_method: flowStatus.paymentData?.media || null,
      payer_email: flowStatus.payer,
      paid_at: flowStatus.status === FLOW_STATUS.PAID ? new Date().toISOString() : null,
    }).eq("id", payment.id);

    // If paid → auto-enroll user
    if (flowStatus.status === FLOW_STATUS.PAID && payment.user_id && payment.course_id) {
      const { data: course } = await supabase.from("courses").select("slug").eq("id", payment.course_id).single();
      if (course?.slug) {
        const { error: enrollError } = await supabase.from("enrollments").upsert({
          user_id: payment.user_id,
          course_slug: course.slug,
          status: "active",
          access_type: "full",
        }, { onConflict: "user_id,course_slug" });

        if (enrollError) {
          console.error("Error creating enrollment:", enrollError);
        } else {
          console.log(`✅ User ${payment.user_id} enrolled in course ${course.slug}`);
        }
      }
    }

    return NextResponse.json({ message: "OK", status: newStatus });

  } catch (error: any) {
    console.error("Flow confirm webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Error procesando confirmación" },
      { status: 500 }
    );
  }
}
