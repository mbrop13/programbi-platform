import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMPSubscription, createMPPreference, MP_PLAN_MAP } from "@/lib/mercadopago/client";
import { communityPlans } from "@/lib/data/community_plans";

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

    const userEmail = user.email!;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const backUrl = `${APP_URL}/api/mercadopago/return?planId=${planId}`;

    const { getActivePromotions } = await import("@/lib/supabase/comunidad-ai");
    const activePromos = await getActivePromotions();
    const getPlanDiscount = (plId: string) => {
       const p = activePromos.find((pr: any) => pr.target_type === 'all' || pr.target_type === 'plans' || (pr.target_type === 'specific_plan' && pr.target_id === plId));
       return p ? p.discount_percentage : 0;
    };

    // Si es anual o semestral, cobrar la cantidad completa por Checkout Pro (Pago Único)
    if (!planId.endsWith("_mensual")) {
      const basePlanId = planId.split("_")[0];
      const planInfo = communityPlans.find(p => p.id === basePlanId);
      if (!planInfo) {
        return NextResponse.json({ error: "Plan base not found" }, { status: 400 });
      }

      let price = planInfo.price;
      if (planId.endsWith("_semestral")) {
        price = planInfo.priceSemiannual || (planInfo.price * 6 * 0.9);
      } else if (planId.endsWith("_anual")) {
        price = planInfo.priceAnnual || (planInfo.price * 12 * 0.7);
      }

      const adminDiscountPercent = getPlanDiscount(basePlanId);
      if (adminDiscountPercent > 0) {
        price = price * ((100 - adminDiscountPercent) / 100);
      }

      const preference = await createMPPreference({
        title: `ProgramBI Community - ${planId.replace("_", " ").toUpperCase()}`,
        price: Math.round(price),
        payerEmail: userEmail,
        externalReference: user.id,
        planId: planId,
        backUrl: backUrl,
      });

      return NextResponse.json({ url: preference.init_point });
    }

    // De otra forma es mensual, procesar como suscripción recurrente
    const basePlanId = planId.split("_")[0];
    const planInfo = communityPlans.find(p => p.id === basePlanId);
    if (!planInfo) {
      return NextResponse.json({ error: "Plan base not found" }, { status: 400 });
    }

    const adminDiscountPercent = getPlanDiscount(basePlanId);
    let finalMonthlyPrice = planInfo.price;
    if (adminDiscountPercent > 0) {
       finalMonthlyPrice = finalMonthlyPrice * ((100 - adminDiscountPercent) / 100);
    }

    const subscription = await createMPSubscription({
      reason: `ProgramBI Community - ${planId.replace("_", " ").toUpperCase()}`,
      transactionAmount: Math.round(finalMonthlyPrice),
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
