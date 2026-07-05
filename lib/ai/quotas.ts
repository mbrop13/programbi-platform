/**
 * Cuotas de tokens IA por plan.
 *
 * Reglas (acordadas con producto):
 *  - monthly = tope absoluto del plan por mes.
 *  - weekly  = monthly / 4.33   (reparto entre ~4 semanas y media).
 *  - fiveHour = weekly * 0.20   (20% del cupo semanal por ventana rodante).
 *
 * Refill "top-up": cuando una ventana expira, su contador vuelve a 0
 * (recarga al 100% de esa ventana). No se descuenta el acumulado de
 * ventanas superiores. Entre resets, el consumo descuenta del cupo
 * restante de la ventana correspondiente.
 *
 * ⚠️ Cliente-safe: no importa secrets ni el proveedor. Lo usa la UI.
 */

export interface PlanQuota {
  monthly: number;
  weekly: number;
  fiveHour: number;
}

/**
 * Cuotas por plan (en tokens).
 *
 * Reglas de reparto:
 *  - Planes de pago (pro/max/ultra):
 *      weekly   = monthly / 4.33
 *      fiveHour = weekly * 0.20
 *  - FREE: las 3 ventanas valen lo mismo (= mensual). Como las 3 ventanas
 *    se incrementan juntas y todas deben tener saldo, esto colapsa el
 *    límite efectivo a uno solo: el mensual. Si un free agota sus tokens,
 *    el refresco de 5h y el semanal NO le dan nada útil → debe esperar al
 *    reinicio mensual. (Es decir: "sin tokens → espera al próximo mes".)
 */
export const PLAN_QUOTAS: Record<string, PlanQuota> = {
  free: {
    monthly: 50_000,
    weekly: 50_000, // = mensual: la ventana semanal nunca limita antes que el mes
    fiveHour: 50_000, // = mensual: la ventana 5h nunca limita antes que el mes
  },
  pro: {
    monthly: 2_000_000,
    weekly: Math.round(2_000_000 / 4.33), // ≈ 461 893
    fiveHour: Math.round((2_000_000 / 4.33) * 0.2), // ≈ 92 379
  },
  max: {
    monthly: 5_000_000,
    weekly: Math.round(5_000_000 / 4.33), // ≈ 1 154 707
    fiveHour: Math.round((5_000_000 / 4.33) * 0.2), // ≈ 230 941
  },
  ultra: {
    monthly: 10_000_000,
    weekly: Math.round(10_000_000 / 4.33), // ≈ 2 309 469
    fiveHour: Math.round((10_000_000 / 4.33) * 0.2), // ≈ 461 894
  },
};

/** Duración de cada ventana en milisegundos. */
export const WINDOW_MS = {
  FIVE_HOUR: 5 * 60 * 60 * 1000, // 5h
  WEEKLY: 7 * 24 * 60 * 60 * 1000, // 7 días
  MONTHLY: 30 * 24 * 60 * 60 * 1000, // 30 días
} as const;

/** Etiquetas legibles para cada ventana (UI). */
export const WINDOW_LABELS: Record<QuotaWindow, string> = {
  five_hour: "5 horas",
  weekly: "semana",
  monthly: "mes",
};

export type QuotaWindow = "five_hour" | "weekly" | "monthly";

/**
 * Resuelve la cuota que aplica a un plan.
 * - null/undefined → free.
 * - "ultraplus" → ultra (legacy: el plan se eliminó, se mapea al tope superior).
 * - cualquier valor desconocido → free (defensivo).
 */
export function resolveQuota(plan: string | null | undefined): PlanQuota {
  if (!plan) return PLAN_QUOTAS.free;
  const normalized = plan.toLowerCase().replace("plan_", "");
  if (normalized === "ultraplus") return PLAN_QUOTAS.ultra;
  return PLAN_QUOTAS[normalized] ?? PLAN_QUOTAS.free;
}

/** Devuelve el id de plan normalizado para reporting/UI. */
export function resolvePlanId(plan: string | null | undefined): string {
  if (!plan) return "free";
  const normalized = plan.toLowerCase().replace("plan_", "");
  if (normalized === "ultraplus") return "ultra";
  if (PLAN_QUOTAS[normalized]) return normalized;
  return "free";
}
