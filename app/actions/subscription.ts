"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export async function cancelSubscription() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No hay sesión activa");
    }

    const adminDb = createAdminClient();
    
    // Get both subscription records in case of legacy flow accounts
    const { data: profile } = await adminDb
      .from("profiles")
      .select("flow_subscription_id, mp_subscription_id")
      .eq("id", session.user.id)
      .single();

    // Cancel in Flow if exists (Legacy)
    if (profile?.flow_subscription_id) {
      try {
        const { cancelFlowSubscription } = await import("@/lib/flow/client");
        await cancelFlowSubscription(profile.flow_subscription_id);
      } catch (err: any) {
        console.error("Warning: Failed to cancel in Flow, but continuing Supabase removal.", err.message);
      }
    }

    // Cancel in Mercado Pago if exists (New)
    if (profile?.mp_subscription_id) {
       try {
          const { cancelMPSubscription } = await import("@/lib/mercadopago/client");
          await cancelMPSubscription(profile.mp_subscription_id);
       } catch (err: any) {
          console.error("Warning: Failed to cancel in Mercado Pago.", err.message);
       }
    }
    
    const { error } = await adminDb
      .from("profiles")
      .update({ 
         subscription_plan: null, 
         subscription_expires_at: null, 
         flow_subscription_id: null,
         mp_subscription_id: null 
      })
      .eq("id", session.user.id);
      
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
