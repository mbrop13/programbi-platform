import "server-only";

import { createAdminClient } from "@/lib/supabase/server";
import {
  PLAN_QUOTAS,
  WINDOW_MS,
  resolveQuota,
  resolvePlanId,
  type PlanQuota,
  type QuotaWindow,
} from "./quotas";

/**
 * Servicio server-side de cuotas de tokens IA.
 *
 * ⚠️ Usa el admin client (service role) → bypass RLS.
 * Solo debe importarse desde API routes / server actions, NUNCA desde
 * componentes de cliente.
 */

interface QuotaStateRow {
  profile_id: string;
  monthly_used: number;
  weekly_used: number;
  five_hour_used: number;
  monthly_window_start: string;
  weekly_window_start: string;
  five_hour_window_start: string;
}

export interface QuotaCheckResult {
  allowed: boolean;
  /** Ventana que bloquea el acceso (si allowed=false). */
  reason?: QuotaWindow;
  plan: string;
  quota: PlanQuota;
  used: { five_hour: number; weekly: number; monthly: number };
  remaining: { five_hour: number; weekly: number; monthly: number };
  /** Cuándo se reinicia la ventana bloqueante (o la más próxima a expirar). */
  resetAt: Date;
}

async function getState(profileId: string): Promise<QuotaStateRow | null> {
  const db = createAdminClient();
  const { data } = await db
    .from("ai_quota_state")
    .select(
      "profile_id, monthly_used, weekly_used, five_hour_used, monthly_window_start, weekly_window_start, five_hour_window_start"
    )
    .eq("profile_id", profileId)
    .maybeSingle();
  return (data as QuotaStateRow | null) ?? null;
}

/** Garantiza que exista una fila de estado para el usuario. */
async function ensureStateRow(profileId: string): Promise<void> {
  const db = createAdminClient();
  // upsert con no-op si ya existe (onConflict target = primary key)
  await db
    .from("ai_quota_state")
    .upsert({ profile_id: profileId }, { onConflict: "profile_id" })
    .eq("profile_id", profileId);
}

/**
 * Aplica el refill top-up en DB: si una ventana expiró, su contador
 * vuelve a 0 y se actualiza el window_start a now().
 * Invoca la función SQL declarada en la migración.
 */
async function resetWindowsIfNeeded(profileId: string): Promise<void> {
  const db = createAdminClient();
  await db.rpc("reset_ai_quota_windows", {
    p_profile_id: profileId,
    p_five_hour_ms: WINDOW_MS.FIVE_HOUR,
    p_weekly_ms: WINDOW_MS.WEEKLY,
    p_monthly_ms: WINDOW_MS.MONTHLY,
  });
}

/**
 * Comprueba si el usuario puede hacer una nueva petición de chat.
 * No descuenta tokens aquí (eso ocurre en recordUsage tras el stream).
 *
 * @param profileId   id del usuario
 * @param plan        valor de profiles.subscription_plan
 */
export async function checkQuota(
  profileId: string,
  plan: string | null | undefined
): Promise<QuotaCheckResult> {
  const planId = resolvePlanId(plan);
  const quota = resolveQuota(plan);

  await ensureStateRow(profileId);
  await resetWindowsIfNeeded(profileId);

  const state = await getState(profileId);
  const used = {
    five_hour: state?.five_hour_used ?? 0,
    weekly: state?.weekly_used ?? 0,
    monthly: state?.monthly_used ?? 0,
  };

  const remaining = {
    five_hour: Math.max(0, quota.fiveHour - used.five_hour),
    weekly: Math.max(0, quota.weekly - used.weekly),
    monthly: Math.max(0, quota.monthly - used.monthly),
  };

  // Chequeo en orden creciente de ventana (la más restrictiva primero).
  // Si la pequeña está agotada, reportamos esa (más útil para el usuario).
  //
  // Caso FREE: las 3 ventanas tienen el mismo tope (= mensual), así que se
  // agotan a la vez. En ese escenario forzamos el bloqueo por "monthly"
  // (no "five_hour") para que el mensaje le diga al usuario que debe esperar
  // al reinicio mensual, no a un refresco inútil de 5h.
  const isFlatQuota =
    quota.fiveHour === quota.monthly && quota.weekly === quota.monthly;

  let blocked: QuotaWindow | undefined;
  if (isFlatQuota) {
    if (remaining.monthly <= 0) blocked = "monthly";
  } else {
    if (remaining.five_hour <= 0) blocked = "five_hour";
    else if (remaining.weekly <= 0) blocked = "weekly";
    else if (remaining.monthly <= 0) blocked = "monthly";
  }

  const windowStarts = {
    five_hour: state?.five_hour_window_start,
    weekly: state?.weekly_window_start,
    monthly: state?.monthly_window_start,
  };
  const windowDurations: Record<QuotaWindow, number> = {
    five_hour: WINDOW_MS.FIVE_HOUR,
    weekly: WINDOW_MS.WEEKLY,
    monthly: WINDOW_MS.MONTHLY,
  };

  // resetAt = fin de la ventana bloqueante (o la próxima en expirar si todo ok).
  const targetWindow = blocked ?? nextExpiringWindow(windowStarts);
  const startTs = windowStarts[targetWindow]
    ? new Date(windowStarts[targetWindow] as string).getTime()
    : Date.now();
  const resetAt = new Date(startTs + windowDurations[targetWindow]);

  return {
    allowed: !blocked,
    reason: blocked,
    plan: planId,
    quota,
    used,
    remaining,
    resetAt,
  };
}

/** Devuelve la ventana cuyo fin es más cercano en el tiempo. */
function nextExpiringWindow(starts: {
  five_hour?: string;
  weekly?: string;
  monthly?: string;
}): QuotaWindow {
  const now = Date.now();
  const candidates: { window: QuotaWindow; endsAt: number }[] = [];
  (["five_hour", "weekly", "monthly"] as QuotaWindow[]).forEach((w) => {
    const start = starts[w];
    if (!start) return;
    const endsAt =
      new Date(start).getTime() +
      (w === "five_hour"
        ? WINDOW_MS.FIVE_HOUR
        : w === "weekly"
        ? WINDOW_MS.WEEKLY
        : WINDOW_MS.MONTHLY);
    candidates.push({ window: w, endsAt });
  });
  if (candidates.length === 0) return "five_hour";
  candidates.sort((a, b) => a.endsAt - b.endsAt);
  return candidates[0].window;
}

export interface UsageRecord {
  chatId: string | null;
  model: string | null;
  input: number;
  output: number;
  total: number;
}

/**
 * Registra el consumo real de tokens tras una respuesta del modelo.
 *  1. Inserta en el ledger inmutable (ai_token_usage).
 *  2. Actualiza contadores de ai_quota_state.
 *
 * Idempotencia: si total <= 0 no hace nada (modelo sin usage reportado).
 */
export async function recordUsage(
  profileId: string,
  record: UsageRecord
): Promise<void> {
  if (record.total <= 0) return;

  const db = createAdminClient();
  await ensureStateRow(profileId);

  // 1. Ledger
  const { error: insertErr } = await db.from("ai_token_usage").insert({
    profile_id: profileId,
    chat_id: record.chatId,
    model: record.model,
    input_tokens: record.input,
    output_tokens: record.output,
    total_tokens: record.total,
  });
  if (insertErr) {
    console.error("recordUsage ledger insert:", insertErr);
    return; // no actualizamos contadores si el ledger falló
  }

  // 2. Cache de estado (incremento atómico vía SQL)
  const { error: rpcErr } = await db.rpc("increment_ai_quota_usage", {
    p_profile_id: profileId,
    p_total: record.total,
  });
  if (rpcErr) {
    // Fallback: incremento manual con read-then-write (aceptable por el bajo volumen).
    const state = await getState(profileId);
    await db
      .from("ai_quota_state")
      .update({
        five_hour_used: (state?.five_hour_used ?? 0) + record.total,
        weekly_used: (state?.weekly_used ?? 0) + record.total,
        monthly_used: (state?.monthly_used ?? 0) + record.total,
      })
      .eq("profile_id", profileId);
  }
}
