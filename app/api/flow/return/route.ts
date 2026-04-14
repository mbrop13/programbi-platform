import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus, FLOW_STATUS } from "@/lib/flow/client";
import { createAdminClient } from "@/lib/supabase/server";

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
    console.log("📦 Flow status:", flowStatus.status, "| order:", flowStatus.commerceOrder);

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
      .select("id, user_id, course_id, status, metadata")
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

    // Fallback: extract from Flow optional data
    if (!userId || !courseSlug || !bumpSelections.length) {
      try {
        const opt = typeof flowStatus.optional === "string" ? JSON.parse(flowStatus.optional) : flowStatus.optional;
        if (!userId && opt?.userId) userId = opt.userId;
        if (!courseSlug && opt?.courseSlug) courseSlug = opt.courseSlug;
        if (opt?.bumpSelections) {
          bumpSelections = typeof opt.bumpSelections === "string" ? JSON.parse(opt.bumpSelections) : opt.bumpSelections;
        }
      } catch { /* ignore parse errors */ }
    }

    // Extract cart items from native payment DB metadata since Flow optional has strict length limits
    if (payment?.metadata?.items && Array.isArray(payment.metadata.items)) {
         cartItems = payment.metadata.items;
    }

    console.log("🎯 Enrollment data:", { userId, courseSlug, bumpSelections });

    // 3. Update payment record
    if (payment && payment.status !== "paid") {
      await supabase.from("payments").update({
        status: "paid",
        flow_status: flowStatus.status,
        payment_method: flowStatus.paymentData?.media || null,
        payer_email: flowStatus.payer || null,
        paid_at: new Date().toISOString(),
      }).eq("id", payment.id);
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
