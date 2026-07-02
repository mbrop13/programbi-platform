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
           const isCourse = payment.metadata?.type === "course_purchase";
           const planId = payment.metadata?.plan_id; // Solo existe en Preferences (Pago Único de suscripción)
           const userId = payment.external_reference; // For subscriptions this is the userId

           // ── Course Purchase handling ──
           if (isCourse) {
             const commerceOrder = payment.metadata?.commerce_order || payment.external_reference;
             const courseUserId = payment.metadata?.user_id;

             if (commerceOrder) {
               const adminDb = createAdminClient();

               // Find the payment record by commerce order
               const { data: paymentRecord } = await adminDb
                 .from("payments")
                 .select("id, user_id, course_id, status, amount, flow_order, payment_method")
                 .eq("flow_order", commerceOrder)
                 .maybeSingle();

               if (paymentRecord && paymentRecord.status !== "paid") {
                 // Parse cart items from temporary payment_method JSON
                 let cartItems: any[] = [];
                 let schedulingSlots: any[] = [];
                 let couponCodeToIncrement: string | null = null;

                 try {
                   if (paymentRecord.payment_method && paymentRecord.payment_method.startsWith('{')) {
                     const parsed = JSON.parse(paymentRecord.payment_method);
                     if (parsed.items) cartItems = parsed.items;
                     if (parsed.slots) schedulingSlots = parsed.slots;
                     if (parsed.couponCode) couponCodeToIncrement = parsed.couponCode;
                   }
                 } catch (parseErr) {
                   console.error("MP Webhook: Error parsing cart data:", parseErr);
                 }

                 // Update payment status
                 await adminDb.from("payments").update({
                   status: "paid",
                   flow_status: 2,
                   payment_method: payment.payment_method_id || "mercadopago",
                   paid_at: new Date().toISOString(),
                 }).eq("id", paymentRecord.id);

                 // Increment coupon used count
                 if (couponCodeToIncrement) {
                   try {
                     const { adminIncrementCouponUsedCount } = await import("@/lib/supabase/comunidad-ai");
                     await adminIncrementCouponUsedCount(couponCodeToIncrement);
                     console.log(`✅ Coupon ${couponCodeToIncrement} used count incremented via webhook.`);
                   } catch (couponErr) {
                     console.error("❌ Error incrementing coupon:", couponErr);
                   }
                 }

                 const uid = courseUserId || paymentRecord.user_id;
                 if (uid) {
                   // Send confirmation email
                   try {
                     const { sendPaymentConfirmation, sendNewPurchaseNotificationToAdmin } = await import("@/lib/email/mailersend");
                     const { data: profile } = await adminDb
                       .from("profiles")
                       .select("full_name, email, phone")
                       .eq("id", uid)
                       .single();

                     const name = profile?.full_name || "Estudiante";
                     const email = profile?.email || "";

                     const coursesToSend = cartItems.map((item: any) => ({
                       slug: item.slug,
                       title: item.title,
                       levelName: item.levelName,
                       price: item.pricePerUnit * item.quantity,
                       selectedStartDate: item.selectedStartDate || null
                     }));

                     if (email && coursesToSend.length > 0) {
                       await sendPaymentConfirmation({
                         name,
                         email,
                         courses: coursesToSend,
                         orderId: commerceOrder,
                         totalPaid: paymentRecord.amount,
                         paymentMethod: payment.payment_method_id || "MercadoPago",
                       });
                       console.log(`📧 Course purchase confirmation sent to ${email} via webhook`);

                       await sendNewPurchaseNotificationToAdmin({
                         name,
                         email,
                         phone: profile?.phone || "",
                         courses: coursesToSend,
                         orderId: commerceOrder,
                         totalPaid: paymentRecord.amount,
                         paymentMethod: payment.payment_method_id || "MercadoPago"
                       });
                       console.log("📧 Admin purchase notification sent via webhook");
                     }
                   } catch (emailErr) {
                     console.error("❌ Error sending course purchase email via webhook:", emailErr);
                   }

                   // Auto-enroll user in all courses
                   if (cartItems.length > 0) {
                     const enrollmentsToCreate = cartItems
                       .filter((item: any) => item.slug)
                       .map((item: any) => ({
                         user_id: uid,
                         course_slug: item.slug,
                         status: "active",
                         access_type: "full"
                       }));

                     if (enrollmentsToCreate.length > 0) {
                       const { error: enrollErr } = await adminDb
                         .from("enrollments")
                         .upsert(enrollmentsToCreate, { onConflict: "user_id,course_slug" });
                       if (enrollErr) {
                         console.error("❌ Course enrollment error via webhook:", enrollErr);
                       } else {
                         console.log(`✅ Enrolled user ${uid} in ${enrollmentsToCreate.length} courses via webhook`);
                       }
                     }
                   }

                   // Confirm scheduling slots
                   if (schedulingSlots && schedulingSlots.length > 0) {
                     await adminDb.from("asesoria_slots")
                       .update({ status: "booked" })
                       .eq("flow_order", commerceOrder);
                   }
                 }

                 console.log(`✅ MP Webhook: Course purchase processed for order ${commerceOrder}`);
               } else if (paymentRecord?.status === "paid") {
                 console.log(`ℹ️ MP Webhook: Order ${commerceOrder} already processed, skipping.`);
               }
             }
           }
           // ── Subscription One-Time Payment handling (existing logic) ──
           else if (planId && userId) {
             const basePlanId = planId.split("_")[0];
             let months = 1;
             if (planId.endsWith("_semestral")) months = 6;
             if (planId.endsWith("_anual")) months = 12;

             const expiresAt = new Date();
             expiresAt.setMonth(expiresAt.getMonth() + months);

             const adminDb = createAdminClient();
             await adminDb.from("profiles").update({
               subscription_plan: basePlanId,
               mp_subscription_id: payment.id.toString(),
               subscription_start_at: payment.date_created,
               subscription_expires_at: expiresAt.toISOString(),
               is_on_trial: false,
             }).eq("id", userId);

             console.log(`✅ MP Webhook: Updated user ${userId} to plan ${basePlanId} (One-Time Payment, ${months} months)`);
           } else if (userId && !isCourse) {
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
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json({ error: isProd ? "Ocurrió un error interno." : error.message }, { status: 500 });
  }
}
