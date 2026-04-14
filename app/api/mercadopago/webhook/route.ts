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

          const isNew = body.action === "created";
          const updateData: any = {
            subscription_plan: basePlanId,
            mp_subscription_id: subscription.id,
            subscription_start_at: subscription.date_created,
            subscription_expires_at: expiresAt.toISOString(),
          };

          if (isNew && internalPlanId.endsWith("_mensual")) {
            const trialExp = new Date();
            trialExp.setDate(trialExp.getDate() + 7);
            updateData.is_on_trial = true;
            updateData.trial_expires_at = trialExp.toISOString();
          }

          await adminDb.from("profiles").update(updateData).eq("id", userId);
          console.log(`✅ MP Webhook: Updated user ${userId} to plan ${basePlanId} (Subscription, trial: ${updateData.is_on_trial})`);
        } else if (subscription.status === "cancelled" || subscription.status === "paused") {
          const userId = subscription.external_reference;
          if (userId) {
            const adminDb = createAdminClient();
            await adminDb.from("profiles").update({
              subscription_plan: null,
              mp_subscription_id: null,
              subscription_expires_at: null,
              is_on_trial: false,
              trial_expires_at: null,
            }).eq("id", userId);
            console.log(`❌ MP Webhook: Cancelled subscription for user ${userId}`);
          }
        }
      }
    }

    // 2. Manejo de Pagos Únicos (Preferences API o cobro de suscripción recurrente tras trial)
    if (body.type === "payment" || body.action?.includes("payment")) {
      const paymentId = body.data?.id;
      if (paymentId) {
         const payment = await getMPPayment(paymentId);
         
         if (payment.status === "approved") {
           const planId = payment.metadata?.plan_id; // Solo existe en Preferences (Pago Único)
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
               is_on_trial: false,
             }).eq("id", userId);

             console.log(`✅ MP Webhook: Updated user ${userId} to plan ${basePlanId} (One-Time Payment, ${months} months)`);
           } else if (userId) {
             // Es un pago de una suscripción recurrente (probablemente terminó el trial y se le cobró)
             const adminDb = createAdminClient();
             await adminDb.from("profiles").update({
               is_on_trial: false,
             }).eq("id", userId);
             console.log(`✅ MP Webhook: Cleared trial status for user ${userId} after recurring payment`);
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
