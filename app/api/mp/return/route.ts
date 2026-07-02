import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getMPPayment } from "@/lib/mercadopago/client";
import { sendPaymentConfirmation, sendNewPurchaseNotificationToAdmin } from "@/lib/email/mailersend";

/**
 * GET /api/mp/return
 * MercadoPago redirects the user here after payment via Checkout Pro.
 * Query params from MP: collection_id, collection_status, external_reference, payment_type, merchant_order_id, preference_id, site_id, processing_mode, merchant_account_id
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const collectionStatus = url.searchParams.get("collection_status");
  const externalReference = url.searchParams.get("external_reference"); // Our commerceOrder
  const collectionId = url.searchParams.get("collection_id"); // MP payment ID

  if (!externalReference) {
    return NextResponse.redirect(new URL("/comunidad/inicio?payment=error", req.url));
  }

  // If status is not approved, redirect with appropriate label
  if (collectionStatus !== "approved") {
    const statusMap: Record<string, string> = {
      "rejected": "rejected",
      "cancelled": "cancelled",
      "pending": "pending",
      "in_process": "pending",
      "null": "cancelled",
    };
    const label = statusMap[collectionStatus || "null"] || "pending";
    return NextResponse.redirect(new URL(`/comunidad/inicio?payment=${label}`, req.url));
  }

  try {
    const supabase = createAdminClient();

    // Find payment record by commerce order
    const { data: payment } = await supabase
      .from("payments")
      .select("id, user_id, course_id, status, amount, flow_order, payment_method")
      .eq("flow_order", externalReference)
      .maybeSingle();

    if (!payment) {
      console.error("MP Return: Payment not found for order:", externalReference);
      return NextResponse.redirect(new URL("/comunidad/inicio?payment=error", req.url));
    }

    // Already processed by webhook?
    if (payment.status === "paid") {
      return NextResponse.redirect(new URL("/comunidad/inicio?payment=success", req.url));
    }

    // Get full payment details from MercadoPago
    let mpPayment: any = null;
    if (collectionId) {
      try {
        mpPayment = await getMPPayment(collectionId);
      } catch (err) {
        console.error("MP Return: Error fetching MP payment details:", err);
      }
    }

    // Mark as paid
    await supabase.from("payments").update({
      status: "paid",
      flow_status: 2, // Reuse column: 2 = paid
      payment_method: mpPayment?.payment_method_id || "mercadopago",
      paid_at: new Date().toISOString(),
    }).eq("id", payment.id);

    // Parse cart items from the stored metadata
    let cartItems: any[] = [];
    let schedulingSlots: any[] = [];
    let couponCodeToIncrement: string | null = null;
    
    try {
      // Read the original payment_method JSON (before we overwrote it above)
      // We need to query again since we just updated it. Use the original value.
      if (payment.payment_method && payment.payment_method.startsWith('{')) {
        const parsed = JSON.parse(payment.payment_method);
        if (parsed.items) cartItems = parsed.items;
        if (parsed.slots) schedulingSlots = parsed.slots;
        if (parsed.couponCode) couponCodeToIncrement = parsed.couponCode;
      }
    } catch (err) {
      console.error("MP Return: Error parsing payment_method cart data:", err);
    }

    // Increment coupon used count if a coupon was used
    if (couponCodeToIncrement) {
      try {
        const { adminIncrementCouponUsedCount } = await import("@/lib/supabase/comunidad-ai");
        await adminIncrementCouponUsedCount(couponCodeToIncrement);
        console.log(`✅ Coupon ${couponCodeToIncrement} used count incremented successfully.`);
      } catch (couponErr) {
        console.error("❌ Error incrementing coupon used count:", couponErr);
      }
    }

    const userId = payment.user_id;

    // Send confirmation email
    if (userId) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email, phone")
          .eq("id", userId)
          .single();

        const name = profile?.full_name || "Estudiante";
        const email = profile?.email || "";

        const coursesToSend = cartItems.map((item: any) => ({
          slug: item.slug,
          title: item.title,
          levelName: item.levelName,
          price: item.pricePerUnit * item.quantity,
          selectedStartDate: item.selectedStartDate || null
        }));

        let fallbackCourses: any[] = [];
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
            orderId: externalReference,
            totalPaid: payment.amount,
            paymentMethod: mpPayment?.payment_method_id || "MercadoPago",
          });
          console.log(`📧 Purchase confirmation email sent to ${email} via MP return redirect`);

          try {
            await sendNewPurchaseNotificationToAdmin({
              name,
              email,
              phone: profile?.phone || "",
              courses: finalCourses,
              orderId: externalReference,
              totalPaid: payment.amount,
              paymentMethod: mpPayment?.payment_method_id || "MercadoPago"
            });
            console.log("📧 Admin notification sent via MP return redirect");
          } catch (adminEmailErr) {
            console.error("❌ Error sending admin notification:", adminEmailErr);
          }
        }
      } catch (emailErr) {
        console.error("❌ Error sending confirmation email in MP return:", emailErr);
      }

      // Auto-enroll in all cart items
      if (cartItems.length > 0) {
        const enrollmentsToCreate = cartItems
          .filter((item: any) => item.slug)
          .map((item: any) => ({
            user_id: userId,
            course_slug: item.slug,
            status: "active",
            access_type: "full"
          }));

        if (enrollmentsToCreate.length > 0) {
          const { error: enrollErr } = await supabase
            .from("enrollments")
            .upsert(enrollmentsToCreate, { onConflict: "user_id,course_slug" });
          if (enrollErr) {
            console.error("❌ Enrollment error:", enrollErr);
          } else {
            console.log(`✅ Enrolled user ${userId} in ${enrollmentsToCreate.length} courses via MP return`);
          }
        }
      } else if (payment.course_id) {
        // Legacy fallback
        const { data: course } = await supabase.from("courses").select("slug").eq("id", payment.course_id).single();
        if (course?.slug) {
          await supabase.from("enrollments").upsert({
            user_id: userId,
            course_slug: course.slug,
            status: "active",
            access_type: "full",
          }, { onConflict: "user_id,course_slug" });
          console.log(`✅ User ${userId} enrolled in course ${course.slug} via MP return`);
        }
      }

      // Confirm scheduling slots
      if (schedulingSlots && schedulingSlots.length > 0) {
        await supabase.from("asesoria_slots")
          .update({ status: "booked" })
          .eq("flow_order", externalReference);
      }
    }

    return NextResponse.redirect(new URL("/comunidad/inicio?payment=success", req.url));

  } catch (error: any) {
    console.error("❌ MP return error:", error.message);
    return NextResponse.redirect(new URL("/comunidad/inicio?payment=error", req.url));
  }
}
