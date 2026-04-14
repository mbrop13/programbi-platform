import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cancelMPSubscription, createMPSubscription } from "@/lib/mercadopago/client";
import { communityPlans } from "@/lib/data/community_plans";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name, subscription_plan, mp_subscription_id, is_on_trial")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.is_on_trial) {
      return NextResponse.redirect(new URL("/comunidad/mis-cursos", req.url));
    }

    const basePlanId = profile.subscription_plan;
    if (!basePlanId) {
      return NextResponse.redirect(new URL("/comunidad/mis-cursos", req.url));
    }

    const planInfo = communityPlans.find(p => p.id === basePlanId);
    if (!planInfo) {
      return NextResponse.redirect(new URL("/comunidad/mis-cursos", req.url));
    }

    // Cancel old trial subscription directly in MP to prevent double charging
    if (profile.mp_subscription_id) {
      try {
        await cancelMPSubscription(profile.mp_subscription_id);
      } catch (err) {
        console.warn("Could not cancel old trial subscription, maybe already cancelled:", err);
      }
    }

    // Create a NEW subscription WITHOUT a free trial
    // We accomplish this by using the standard endpoint but without appending the free_trial object 
    // in our custom mpFetch if we add a flag, OR rather we can just copy the code here briefly
    // Wait, the `createMPSubscription` hardcodes `free_trial: { frequency: 7, frequency_type: "days" }`.
    // We need to modify `createMPSubscription` to accept `skipTrial: boolean`!
    
    // For now, let's just do the fetch here directly so we don't mess up the client types
    const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const body = JSON.stringify({
      reason: `ProgramBI Community - ${basePlanId.toUpperCase()} MENSUAL`,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: Math.round(planInfo.price),
        currency_id: "CLP",
        // No free_trial here!
      },
      payer_email: profile.email || user.email,
      external_reference: user.id,
      back_url: `${req.nextUrl.origin}/api/mercadopago/return?planId=${basePlanId}_mensual`,
      status: "pending",
    });

    const res = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body
    });

    const subscription = await res.json();
    if (!res.ok) {
      console.error("MP Upgrade Error:", subscription);
      throw new Error("Failed to create new subscription");
    }

    // Remove trial flag locally so they don't get blocked while paying
    await supabase.from("profiles").update({ is_on_trial: false }).eq("id", user.id);

    return NextResponse.redirect(subscription.init_point);

  } catch (error: any) {
    console.error("❌ Upgrade Trial Error:", error);
    return NextResponse.redirect(new URL("/comunidad/mis-cursos", req.url));
  }
}
