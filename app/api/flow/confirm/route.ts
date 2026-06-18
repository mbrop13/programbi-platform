import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus, flowStatusToString, FLOW_STATUS } from "@/lib/flow/client";
import { createAdminClient } from "@/lib/supabase/server";
import { sendPaymentConfirmation, sendNewPurchaseNotificationToAdmin } from "@/lib/email/mailersend";

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

    // Find our payment record (include payment_method)
    const { data: payment } = await supabase
      .from("payments")
      .select("id, user_id, course_id, status, amount, flow_order, payment_method")
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

    // Update payment record (this overwrites the temporary JSON in payment_method)
    await supabase.from("payments").update({
      status: newStatus,
      flow_status: flowStatus.status,
      payment_method: flowStatus.paymentData?.media || null,
      paid_at: flowStatus.status === FLOW_STATUS.PAID ? new Date().toISOString() : null,
    }).eq("id", payment.id);

    // If paid → auto-enroll user and send confirmation email
    if (flowStatus.status === FLOW_STATUS.PAID && payment.user_id) {
      let cartItems: any[] = [];
      let schedulingSlots: any[] = [];
      
      // Attempt to read cart items from the temporary payment_method JSON
      try {
        if (payment.payment_method && payment.payment_method.startsWith('{')) {
          const parsed = JSON.parse(payment.payment_method);
          if (parsed.items) cartItems = parsed.items;
          if (parsed.slots) schedulingSlots = parsed.slots;
        }
      } catch (err) {
        console.error("Error parsing payment_method cart data:", err);
      }
      
      // Fallback: Check optional param for backwards compatibility
      if (cartItems.length === 0) {
        try {
          const opt = typeof flowStatus.optional === "string" ? JSON.parse(flowStatus.optional) : flowStatus.optional;
          if (opt?.items) {
            cartItems = typeof opt.items === "string" ? JSON.parse(opt.items) : opt.items;
          }
          if (opt?.scheduling_slots) {
            schedulingSlots = typeof opt.scheduling_slots === "string" ? JSON.parse(opt.scheduling_slots) : opt.scheduling_slots;
          }
        } catch (err) {
          console.error("Error parsing optional data:", err);
        }
      }

      // 1. Send confirmation email
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email, phone")
          .eq("id", payment.user_id)
          .single();

        const name = profile?.full_name || "Estudiante";
        const email = profile?.email || flowStatus.payer || "";

        const coursesToSend = cartItems.map((item: any) => ({
          slug: item.slug,
          title: item.title,
          levelName: item.levelName,
          price: item.pricePerUnit * item.quantity,
          selectedStartDate: item.selectedStartDate || null
        }));

        let fallbackCourses = [];
        if (coursesToSend.length === 0 && payment.course_id) {
          const { data: c } = await supabase.from("courses").select("slug, title").eq("id", payment.course_id).single();
          if (c) {
            fallbackCourses.push({
              slug: c.slug,
              title: c.title,
              levelName: "Básico",
              price: payment.amount || 0,
              selectedStartDate: null
            });
          }
        }
        const finalCourses = coursesToSend.length > 0 ? coursesToSend : fallbackCourses;

        if (email) {
          await sendPaymentConfirmation({
            name,
            email,
            courses: finalCourses,
            orderId: flowStatus.commerceOrder || payment.flow_order,
            totalPaid: payment.amount || flowStatus.amount,
            paymentMethod: flowStatus.paymentData?.media || "Flow",
          });
          console.log(`📧 Purchase confirmation email sent successfully to ${email}`);

          // Send admin notification
          try {
            await sendNewPurchaseNotificationToAdmin({
              name,
              email,
              phone: profile?.phone || "",
              courses: finalCourses,
              orderId: flowStatus.commerceOrder || payment.flow_order,
              totalPaid: payment.amount || flowStatus.amount,
              paymentMethod: flowStatus.paymentData?.media || "Flow"
            });
            console.log("📧 Purchase notification email sent successfully to admin moliva@programbi.cl");
          } catch (adminEmailErr) {
            console.error("❌ Error sending admin purchase notification:", adminEmailErr);
          }
        } else {
          console.warn(`⚠️ Could not send confirmation email: Missing email address for user ${payment.user_id}`);
        }
      } catch (emailErr) {
        console.error("❌ Error sending confirmation email in confirm webhook:", emailErr);
      }

      // 2. Auto-enroll user in first/main course for backwards compatibility
      if (payment.course_id) {
        const { data: course } = await supabase.from("courses").select("slug").eq("id", payment.course_id).single();
        if (course?.slug) {
          const { error: enrollError } = await supabase.from("enrollments").upsert({
            user_id: payment.user_id,
            course_slug: course.slug,
            status: "active",
            access_type: "full",
          }, { onConflict: "user_id,course_slug" });

          if (enrollError) {
            console.error("Error creating legacy enrollment:", enrollError);
          } else {
            console.log(`✅ User ${payment.user_id} enrolled in course ${course.slug}`);
          }
        }
      }

      // 3. Auto-enroll user in all items from multi-cart
      if (cartItems.length > 0) {
        const enrollmentsToCreate = cartItems.map((item: any) => ({
          user_id: payment.user_id,
          course_slug: item.slug,
          status: "active",
          access_type: "full"
        })).filter((e: any) => e.course_slug);

        if (enrollmentsToCreate.length > 0) {
          const { error: multiEnrollErr } = await supabase
            .from("enrollments")
            .upsert(enrollmentsToCreate, { onConflict: "user_id,course_slug" });
          if (multiEnrollErr) {
            console.error("Error creating multi-cart enrollments:", multiEnrollErr);
          } else {
            console.log(`✅ Enrolled user ${payment.user_id} in ${enrollmentsToCreate.length} courses from cart.`);
          }
        }
      }
      // 4. Confirm scheduling slots if any
      if (schedulingSlots && schedulingSlots.length > 0) {
        await supabase.from("asesoria_slots")
          .update({ status: "booked" })
          .eq("flow_order", flowStatus.commerceOrder);
      }
    }

    return NextResponse.json({ message: "OK", status: newStatus });

  } catch (error: any) {
    console.error("Flow confirm webhook error:", error);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      { error: isProd ? "Error procesando confirmación" : (error.message || "Error procesando confirmación") },
      { status: 500 }
    );
  }
}
