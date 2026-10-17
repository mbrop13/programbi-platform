import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getMPPayment } from "@/lib/mercadopago/client";
import { tokenPorCuenta } from "@/lib/paises/cobro";
import { sendPaymentConfirmation, sendNewPurchaseNotificationToAdmin } from "@/lib/email/mailersend";

/**
 * GET /api/mp/return
 * MercadoPago redirects the user here after payment via Checkout Pro.
 *
 * A-10 / V4.2.2 (OWASP ASVS L3): this URL must NOT mutate financial state based
 * on client-controlled query params. The previous implementation trusted
 * `collection_status` from the URL, allowing a user to fake `?collection_status=
 * approved&external_reference=...` and auto-approve a payment without paying.
 *
 * The fix: only the verified response from MercadoPago's API (`getMPPayment`)
 * can authorize a payment mutation. If we cannot reach the MP API or the status
 * is not `approved`, we redirect with a neutral label and let the verified
 * webhook (which checks HMAC) do the final mutation.
 */
function leerMetaPago(raw: unknown): { pais: string; mpAccount: string; currency: string } {
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (data && typeof data === "object") {
      const meta = data as { pais?: unknown; mpAccount?: unknown; currency?: unknown };
      return {
        pais: typeof meta.pais === "string" ? meta.pais : "cl",
        mpAccount: typeof meta.mpAccount === "string" ? meta.mpAccount : "cl",
        currency: typeof meta.currency === "string" ? meta.currency : "CLP",
      };
    }
  } catch {
    /* el registro viejo no trae país */
  }
  return { pais: "cl", mpAccount: "cl", currency: "CLP" };
}

function redirectConPais(
  req: NextRequest,
  estado: string,
  meta: { pais: string; currency: string },
  amount: number | null
) {
  const url = new URL("/comunidad/inicio", req.url);
  url.searchParams.set("payment", estado);
  url.searchParams.set("pais", meta.pais || "cl");
  url.searchParams.set("moneda", meta.currency || "CLP");
  if (amount != null) url.searchParams.set("valor", String(amount));
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const externalReference = url.searchParams.get("external_reference"); // Our commerceOrder
  const collectionId = url.searchParams.get("collection_id"); // MP payment ID
  // NOTE: collection_status is intentionally NOT trusted for state mutations.

  if (!externalReference) {
    return NextResponse.redirect(new URL("/comunidad/inicio?payment=error", req.url));
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

    // Already processed by the verified webhook? Just redirect to success.
    const metaPago = leerMetaPago(payment.payment_method);
    const destino = (estado: string) =>
      redirectConPais(req, estado, metaPago, payment.amount);

    if (payment.status === "paid") {
      return destino("success");
    }

    // Re-query MercadoPago to get the AUTHORITATIVE payment status. We do not
    // trust `collection_status` from the URL.
    let mpPayment: any = null;
    if (collectionId) {
      try {
        mpPayment = await getMPPayment(collectionId, tokenPorCuenta(metaPago.mpAccount));
      } catch (err) {
        console.error("MP Return: Error fetching MP payment details:", err);
        // Cannot verify — redirect to a neutral "processing" page. The verified
        // webhook will finalize the payment when MP calls it.
        return destino("pending");
      }
    } else {
      // Without the payment id we cannot verify — defer to the webhook.
      return destino("pending");
    }

    // Only mutate state if MP's API confirms approval.
    const isApproved = mpPayment && mpPayment.status === "approved";
    if (!isApproved) {
      const label =
        mpPayment?.status === "rejected" ? "rejected"
        : mpPayment?.status === "cancelled" ? "cancelled"
        : "pending";
      return destino(label);
    }

    // Mark as paid (idempotent — webhook may have already done this)
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
        }
      }

      // Confirm scheduling slots
      if (schedulingSlots && schedulingSlots.length > 0) {
        await supabase.from("asesoria_slots")
          .update({ status: "booked" })
          .eq("flow_order", externalReference);
      }
    }

    return destino("success");

  } catch (error: any) {
    console.error("❌ MP return error:", error.message);
    return NextResponse.redirect(new URL("/comunidad/inicio?payment=error", req.url));
  }
}
