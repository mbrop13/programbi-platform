import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getMPSubscription, getMPPayment } from "@/lib/mercadopago/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🔔 MP Webhook received:", JSON.stringify(body));

    // Webhooks de Preapproval envían action="created" o "updated"
    // Webhooks de Pagos Únicos (Preferences) envían type="payment" y action="payment.created" o similar.
    
    // 1. Manejo de Suscripciones (Preapproval)
    if (body.action === "created" || body.action === "updated") {
      const dataInfo = body.data; // { id: "string" }
      
      if (dataInfo && dataInfo.id) {
        const subscriptionId = dataInfo.id;
        
        // Consultar la suscripción completa
        const subscription = await getMPSubscription(subscriptionId);

        if (subscription.status === "authorized") {
          // Si MP_PLAN_MAP no está definido, esto no lanzará un error y asumirá 'pro_mensual'.
          // Este block fallaría si fuera un preference, pero preferences caen en payment.
          const userId = subscription.external_reference;
          if (!userId) return NextResponse.json({ success: true });

          // Identificar el plan basado en the reason
          // Reason format: "ProgramBI Community - PRO MENSUAL"
          let internalPlanId = "pro_mensual"; 
          if (subscription.reason) {
             const parts = subscription.reason.split(" - ");
             if (parts.length > 1) {
                internalPlanId = parts[1].toLowerCase().replace(" ", "_");
             }
          }
          
          const adminDb = createAdminClient();
          const basePlanId = internalPlanId.split('_')[0];
          const expiresAt = new Date(subscription.next_payment_date);

          await adminDb.from("profiles").update({
            subscription_plan: basePlanId,
            mp_subscription_id: subscription.id,
            subscription_start_at: subscription.date_created,
            subscription_expires_at: expiresAt.toISOString(),
          }).eq("id", userId);
          console.log(`✅ MP Webhook: Updated user ${userId} to plan ${basePlanId} (Subscription)`);
        } else if (subscription.status === "cancelled" || subscription.status === "paused") {
          const userId = subscription.external_reference;
          if (userId) {
            const adminDb = createAdminClient();
            await adminDb.from("profiles").update({
              subscription_plan: null,
              mp_subscription_id: null,
              subscription_expires_at: null,
            }).eq("id", userId);
            console.log(`❌ MP Webhook: Cancelled subscription for user ${userId}`);
          }
        }
      }
    }

    // 2. Manejo de Pagos Únicos (Preferences API)
    if (body.type === "payment" || body.action?.includes("payment")) {
      const paymentId = body.data?.id;
      if (paymentId) {
         const payment = await getMPPayment(paymentId);
         
         if (payment.status === "approved") {
           const planId = payment.metadata?.plan_id; // Added this in Preference
           const userId = payment.external_reference;

           if (planId && userId) {
             const basePlanId = planId.split("_")[0];
             let months = 1;
             if (planId.endsWith("_semestral")) months = 6;
             if (planId.endsWith("_anual")) months = 12;

             const expiresAt = new Date();
             expiresAt.setMonth(expiresAt.getMonth() + months);

             const adminDb = createAdminClient();
             await adminDb.from("profiles").update({
               subscription_plan: basePlanId,
               mp_subscription_id: payment.id.toString(), // Using payment ID as fallback token
               subscription_start_at: payment.date_created,
               subscription_expires_at: expiresAt.toISOString(),
             }).eq("id", userId);

             console.log(`✅ MP Webhook: Updated user ${userId} to plan ${basePlanId} (One-Time Payment, ${months} months)`);
           }
         }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ MP Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
