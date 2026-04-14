import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getMPSubscription } from "@/lib/mercadopago/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🔔 MP Webhook received:", JSON.stringify(body));

    // Webhooks de Preapproval envían action="created" o "updated"
    // y type="subscription_preapproval"
    if (body.action === "created" || body.action === "updated") {
      const dataInfo = body.data; // { id: "string" }
      
      if (dataInfo && dataInfo.id) {
        const subscriptionId = dataInfo.id;
        
        // Consultar la suscripción completa
        const subscription = await getMPSubscription(subscriptionId);
        console.log("✅ MP Subscription Details:", subscription.id, "Status:", subscription.status);

        if (subscription.status === "authorized") {
          // Obtener el ID de usuario desde external_reference
          const userId = subscription.external_reference;
          
          if (!userId) {
             console.error("❌ MP Webhook: No external_reference found in subscription data");
             return NextResponse.json({ success: true });
          }

          // Identificar el plan basado en the preapproval_plan_id
          const { MP_PLAN_MAP } = await import("@/lib/mercadopago/client");
          let internalPlanId = "pro_mensual"; // Default fallback
          
          for (const [key, value] of Object.entries(MP_PLAN_MAP)) {
             if (value === subscription.preapproval_plan_id) {
               internalPlanId = key;
               break;
             }
          }
          
          const adminDb = createAdminClient();
          const basePlanId = internalPlanId.split('_')[0];

          // Determinar fecha de expiración
          const expiresAt = new Date(subscription.next_payment_date);

          await adminDb.from("profiles").update({
            subscription_plan: basePlanId,
            mp_subscription_id: subscription.id,
            subscription_start_at: subscription.date_created,
            subscription_expires_at: expiresAt.toISOString(),
          }).eq("id", userId);
          
          console.log(`✅ MP Webhook: Updated user ${userId} to plan ${basePlanId}`);
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ MP Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
