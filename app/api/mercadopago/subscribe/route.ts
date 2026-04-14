import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMPSubscription, MP_PLAN_MAP } from "@/lib/mercadopago/client";

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "No planId provided" }, { status: 400 });
    }

    const mpPlanId = MP_PLAN_MAP[planId];
    if (!mpPlanId) {
      return NextResponse.json({ error: "Invalid planId or not found in mapping" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userEmail = user.email!;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const backUrl = `${APP_URL}/api/mercadopago/return?planId=${planId}`;

    // Create a subscription in Mercado Pago
    // Mercado Pago will return an `init_point` which is the checkout URL
    const subscription = await createMPSubscription({
      preapprovalPlanId: mpPlanId,
      payerEmail: userEmail,
      externalReference: user.id, // We store our Supabase user ID here
      backUrl: backUrl,
    });

    if (!subscription.init_point) {
      throw new Error("Mercado Pago did not return an init_point");
    }

    return NextResponse.json({ url: subscription.init_point });

  } catch (error: any) {
    console.error("❌ Mercado Pago Subscribe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
