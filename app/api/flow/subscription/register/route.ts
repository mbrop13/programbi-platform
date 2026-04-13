import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { createFlowCustomer, registerFlowCard } from "@/lib/flow/client";

async function ensureFlowCustomer(
  adminDb: any,
  userId: string,
  name: string,
  email: string,
  existingCustomerId?: string | null,
): Promise<string> {
  // If we have an existing ID, return it — caller will handle if it's stale
  if (existingCustomerId) return existingCustomerId;

  // Create a brand-new Flow customer
  const flowCustomer = await createFlowCustomer({
    externalId: userId,
    name,
    email,
  });

  const newId = flowCustomer.customerId;

  // Persist in Supabase
  await adminDb
    .from("profiles")
    .update({ flow_customer_id: newId })
    .eq("id", userId);

  return newId;
}

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "No planId provided" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const adminDb = createAdminClient();
    const { data: profile } = await adminDb
      .from("profiles")
      .select("flow_customer_id")
      .eq("id", user.id)
      .single();

    const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";
    const userEmail = user.email!;

    let customerId = await ensureFlowCustomer(
      adminDb, user.id, userName, userEmail, profile?.flow_customer_id
    );

    // Build return URL with planId
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const returnUrl = `${APP_URL}/api/flow/subscription/return?planId=${planId}`;

    try {
      // Try to register card with current customerId
      const flowResult = await registerFlowCard(customerId, returnUrl);
      return NextResponse.json({ url: flowResult.url });

    } catch (cardErr: any) {
      // If "Customer not found" (stale sandbox ID), re-create in current environment
      if (cardErr.message?.includes("7002") || cardErr.message?.includes("Customer not found")) {
        console.log("⚠️ Stale Flow customerId detected, re-creating customer in current environment...");

        // Force re-create: clear old ID and create fresh
        await adminDb
          .from("profiles")
          .update({ flow_customer_id: null })
          .eq("id", user.id);

        customerId = await ensureFlowCustomer(adminDb, user.id, userName, userEmail, null);

        // Retry card registration
        const flowResult = await registerFlowCard(customerId, returnUrl);
        return NextResponse.json({ url: flowResult.url });
      }

      // Unknown card registration error — bubble up
      throw cardErr;
    }

  } catch (error: any) {
    console.error("❌ Flow Subscription Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
