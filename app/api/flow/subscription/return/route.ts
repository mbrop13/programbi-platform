import { NextRequest, NextResponse } from "next/server";
import { getFlowRegisterStatus, createFlowSubscription, FLOW_STATUS } from "@/lib/flow/client";
import { createAdminClient } from "@/lib/supabase/server";

async function handleReturn(req: NextRequest, token: string | null, planId: string | null) {
  if (!token || !planId) {
    return NextResponse.redirect(new URL("/comunidad/cursos?subscription=error", req.url));
  }

  try {
    // 1. Get status from Flow
    const flowStatus = await getFlowRegisterStatus(token);
    console.log("💳 Flow Card Registration status:", flowStatus.status, "| customer:", flowStatus.customerId);

    if (flowStatus.status !== 1) { // 1 = registered
      return NextResponse.redirect(new URL(`/comunidad/cursos?subscription=rejected`, req.url));
    }

    const customerId = flowStatus.customerId;
    const adminDb = createAdminClient();

    // 2. Identify user by flow_customer_id
    const { data: profile } = await adminDb
      .from("profiles")
      .select("id")
      .eq("flow_customer_id", customerId)
      .single();

    if (!profile) {
      console.error("❌ User not found for customerId:", customerId);
      return NextResponse.redirect(new URL("/comunidad/cursos?subscription=error", req.url));
    }

    // 3. Create Flow Subscription
    const subscription = await createFlowSubscription({
      planId,
      customerId,
    });

    console.log("✅ Flow Subscription created:", subscription.subscriptionId);

    // 4. Update Profile in Supabase
    const expiresAt = new Date();
    
    // Determine expiration period based on plan suffix
    if (planId.includes('_anual')) {
      expiresAt.setDate(expiresAt.getDate() + 365);
    } else if (planId.includes('_semestral')) {
      expiresAt.setDate(expiresAt.getDate() + 180);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 30);
    }

    // Extract base plan Id to preserve permission checks (e.g. "pro_mensual" -> "pro")
    const basePlanId = planId.split('_')[0];

    const now = new Date().toISOString();

    await adminDb.from("profiles").update({
      subscription_plan: basePlanId,
      flow_subscription_id: subscription.subscriptionId,
      subscription_start_at: now,
      subscription_expires_at: expiresAt.toISOString(),
    }).eq("id", profile.id);

    return NextResponse.redirect(new URL("/comunidad/inicio?subscription=success", req.url));

  } catch (error: any) {
    console.error("❌ Flow Subscription Return Error:", error.message);
    return NextResponse.redirect(new URL("/comunidad/cursos?subscription=error_processing", req.url));
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const planId = url.searchParams.get("planId");
  return handleReturn(req, token, planId);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get("token") as string | null;
  const url = new URL(req.url);
  const planId = url.searchParams.get("planId");
  return handleReturn(req, token, planId);
}
