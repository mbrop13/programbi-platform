import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus, FLOW_STATUS } from "@/lib/flow/client";
import { createAdminClient } from "@/lib/supabase/server";
import { sendPaymentConfirmation, sendNewPurchaseNotificationToAdmin } from "@/lib/email/mailersend";

/**
 * Flow redirects user here after payment.
 * Uses admin client (service role) — user cookies are NOT preserved
 * during Flow's redirect chain.
 * 
 * Strategy:
 * 1. Get payment status from Flow API
 * 2. Find payment in DB (by flow_order or flow_token)
 * 3. If not found, use Flow's optional data (userId, courseSlug)
 * 4. Create enrollment using course_slug (the actual column in the table)
 */
async function handleReturn(req: NextRequest, token: string | null) {
  if (!token) {
    return NextResponse.redirect(new URL("/comunidad/cursos?payment=error", req.url));
  }

  try {
    // 1. Get status from Flow
    const flowStatus = await getFlowPaymentStatus(token);
    console.log("📦 Flow return status:", flowStatus.status, "| order:", flowStatus.commerceOrder);

    if (flowStatus.status !== FLOW_STATUS.PAID) {
      const statusMap: Record<number, string> = {
        [FLOW_STATUS.REJECTED]: "rejected",
        [FLOW_STATUS.CANCELLED]: "cancelled",
      };
      const label = statusMap[flowStatus.status] || "pending";
      return NextResponse.redirect(new URL(`/comunidad/cursos?payment=${label}`, req.url));
    }

    // 2. Payment is PAID — create enrollment
    const supabase = createAdminClient();

    // Try to find payment record
    const { data: payment } = await supabase
      .from("payments")
      .select("id, user_id, course_id, status, amount, flow_order")
      .eq("flow_order", flowStatus.commerceOrder)
      .maybeSingle();

    let userId: string | null = payment?.user_id || null;
    let courseSlug: string | null = null;

    // Get courseSlug from course_id if payment exists
    if (payment?.course_id) {
      const { data: c } = await supabase.from("courses").select("slug").eq("id", payment.course_id).single();
      courseSlug = c?.slug || null;
    }

    let bumpSelections: any[] = [];
    let cartItems: any[] = [];

    // Extract from Flow optional data
    try {
      const opt = typeof flowStatus.optional === "string" ? JSON.parse(flowStatus.optional) : flowStatus.optional;
      if (!userId && opt?.userId) userId = opt.userId;
      if (!courseSlug && opt?.courseSlug) courseSlug = opt.courseSlug;
      if (opt?.bumpSelections) {
        bumpSelections = typeof opt.bumpSelections === "string" ? JSON.parse(opt.bumpSelections) : opt.bumpSelections;
      }
      if (opt?.items) {
        cartItems = typeof opt.items === "string" ? JSON.parse(opt.items) : opt.items;
      }
    } catch { /* ignore parse errors */ }

    console.log("🎯 Return Enrollment data:", { userId, courseSlug, bumpSelections, cartItemsCount: cartItems.length });

    // 3. Update payment record
    let wasUpdatedToPaid = false;
    if (payment && payment.status !== "paid") {
      await supabase.from("payments").update({
        status: "paid",
        flow_status: flowStatus.status,
        payment_method: flowStatus.paymentData?.media || null,
        paid_at: new Date().toISOString(),
      }).eq("id", payment.id);
      wasUpdatedToPaid = true;
    }

    // Send confirmation email if we just marked it as paid
    if (wasUpdatedToPaid && userId) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email, phone")
          .eq("id", userId)
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
        if (coursesToSend.length === 0 && courseSlug) {
          const { data: c } = await supabase.from("courses").select("slug, title").eq("slug", courseSlug).single();
          if (c) {
            fallbackCourses.push({
              slug: c.slug,
              title: c.title,
              levelName: "Básico",
              price: payment?.amount || 0,
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
            orderId: flowStatus.commerceOrder || payment?.flow_order,
            totalPaid: payment?.amount || flowStatus.amount,
            paymentMethod: flowStatus.paymentData?.media || "Flow",
          });
          console.log(`📧 Purchase confirmation email sent successfully to ${email} via return redirect`);

          // Send admin notification
          try {
            await sendNewPurchaseNotificationToAdmin({
              name,
              email,
              phone: profile?.phone || "",
              courses: finalCourses,
              orderId: flowStatus.commerceOrder || payment?.flow_order,
              totalPaid: payment?.amount || flowStatus.amount,
              paymentMethod: flowStatus.paymentData?.media || "Flow"
            });
            console.log("📧 Purchase notification email sent successfully to admin moliva@programbi.cl via return redirect");
          } catch (adminEmailErr) {
            console.error("❌ Error sending admin purchase notification:", adminEmailErr);
          }
        } else {
          console.warn(`⚠️ Could not send confirmation email in return redirect: Missing email for user ${userId}`);
        }
      } catch (emailErr) {
        console.error("❌ Error sending confirmation email in return redirect:", emailErr);
      }
    }

    // 4. Create enrollments
    if (userId) {
      const enrollmentsToCreate: any[] = [];
      const userIdsToEnroll = [userId]; // We would optionally expand this logic if gifting functionality evolves.

      // Prefer new multi-cart architecture extraction:
      if (cartItems.length > 0) {
          cartItems.forEach(item => {
             // We enroll them if they bought it. If quantity > 1, we only enroll them once, and they have extra licenses logic later.
             if (item.slug) {
                 enrollmentsToCreate.push({
                   user_id: userId,
                   course_slug: item.slug,
                   status: "active",
                   access_type: "full"
                 })
             }
          });
      } else if (courseSlug) {
          // Fallback legacy mode
          enrollmentsToCreate.push({ user_id: userId, course_slug: courseSlug, status: "active", access_type: "full" });
      }
      
      // Add bump selections
      if (Array.isArray(bumpSelections) && bumpSelections.length > 0) {
        bumpSelections.forEach((bump) => {
          if (bump.slug && !enrollmentsToCreate.find(e => e.course_slug === bump.slug)) {
            enrollmentsToCreate.push({
              user_id: userId,
              course_slug: bump.slug,
              status: "active",
              access_type: "full"
            });
          }
        });
      }

      const { data: enrollResult, error: enrollErr } = await supabase
        .from("enrollments")
        .upsert(enrollmentsToCreate, { onConflict: "user_id,course_slug" })
        .select();

      if (enrollErr) {
        console.error("❌ Enrollment error:", enrollErr);
      } else {
        console.log("✅ Enrollments created:", enrollResult.length);
      }
    } else {
      console.error("❌ Cannot enroll — missing userId");
    }

    return NextResponse.redirect(new URL("/comunidad/cursos?payment=success", req.url));

  } catch (error: any) {
    console.error("❌ Flow return error:", error.message);
    return NextResponse.redirect(new URL("/comunidad/cursos?payment=error", req.url));
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  return handleReturn(req, token);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get("token") as string;
    return handleReturn(req, token);
  } catch {
    const token = req.nextUrl.searchParams.get("token");
    return handleReturn(req, token);
  }
}
