import { createClient } from "@/lib/supabase/server";
import { resolveQuota, resolvePlanId, WINDOW_MS } from "@/lib/ai/quotas";
import { checkQuota } from "@/lib/ai/quota-service";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * GET /api/ai/quota
 * Devuelve el estado de cuota de tokens del usuario autenticado.
 * Lo consume el widget de UI (QuotaIndicator) en el chat IA.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return json({ error: "No autorizado" }, 401);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan, role")
    .eq("id", user.id)
    .maybeSingle();

  const plan = resolvePlanId(profile?.subscription_plan);
  // Admins bypass cuotas en el check, pero reportamos su plan real.
  const isAdmin = profile?.role === "admin";

  const check = await checkQuota(user.id, profile?.subscription_plan);

  const pct = (used: number, cap: number) =>
    cap > 0 ? Math.min(100, Math.round((used / cap) * 100)) : 0;

  return json({
    plan,
    isAdmin,
    quota: check.quota,
    used: check.used,
    remaining: check.remaining,
    percentages: {
      five_hour: pct(check.used.five_hour, check.quota.fiveHour),
      weekly: pct(check.used.weekly, check.quota.weekly),
      monthly: pct(check.used.monthly, check.quota.monthly),
    },
    resetAt: check.resetAt.toISOString(),
    windowMs: {
      five_hour: WINDOW_MS.FIVE_HOUR,
      weekly: WINDOW_MS.WEEKLY,
      monthly: WINDOW_MS.MONTHLY,
    },
    unlimited: isAdmin, // los admins no tienen límite
  });
}
