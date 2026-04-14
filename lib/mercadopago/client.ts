/**
 * Mercado Pago Client — Suscripciones recurrentes
 * Docs: https://www.mercadopago.cl/developers/es/reference/subscriptions
 */

const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
const MP_API_URL = "https://api.mercadopago.com";

// ─── Helper ───

async function mpFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  if (!MP_ACCESS_TOKEN) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN not configured");
  }

  const res = await fetch(`${MP_API_URL}${path}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    console.error("❌ Mercado Pago API Error:", JSON.stringify(body, null, 2));
    throw new Error(`MercadoPago API error ${res.status}: ${body.message || JSON.stringify(body)}`);
  }

  return body as T;
}

// ─── Plan / Preapproval Plan ───

export interface MPPlan {
  id: string;
  reason: string;
  auto_recurring: {
    frequency: number;
    frequency_type: "months" | "days";
    transaction_amount: number;
    currency_id: string;
  };
  back_url: string;
  status: string;
}

/**
 * Creates a reusable subscription plan (preapproval_plan) in Mercado Pago.
 * You only need to do this once per plan/billing combination.
 */
export async function createMPPlan(data: {
  reason: string;
  autoRecurring: {
    frequency: number;
    frequencyType: "months" | "days";
    transactionAmount: number;
    currencyId?: string;
  };
  backUrl: string;
}): Promise<MPPlan> {
  return mpFetch<MPPlan>("/preapproval_plan", {
    method: "POST",
    body: JSON.stringify({
      reason: data.reason,
      auto_recurring: {
        frequency: data.autoRecurring.frequency,
        frequency_type: data.autoRecurring.frequencyType,
        transaction_amount: data.autoRecurring.transactionAmount,
        currency_id: data.autoRecurring.currencyId || "CLP",
      },
      back_url: data.backUrl,
    }),
  });
}

// ─── Subscriptions (Preapproval) ───

export interface MPSubscription {
  id: string;
  payer_id: number;
  payer_email: string;
  external_reference: string;
  status: string; // "authorized", "pending", "paused", "cancelled"
  reason: string;
  init_point: string; // URL to redirect user to pay
  preapproval_plan_id: string;
  auto_recurring: {
    frequency: number;
    frequency_type: string;
    transaction_amount: number;
    currency_id: string;
  };
  date_created: string;
  next_payment_date: string;
}

/**
 * Creates a subscription for a user using a preapproval_plan.
 * Returns the init_point URL that the user must visit to authorize payment.
 */
export async function createMPSubscription(data: {
  preapprovalPlanId: string;
  payerEmail: string;
  externalReference: string; // our userId
  backUrl: string;
}): Promise<MPSubscription> {
  return mpFetch<MPSubscription>("/preapproval", {
    method: "POST",
    body: JSON.stringify({
      preapproval_plan_id: data.preapprovalPlanId,
      payer_email: data.payerEmail,
      external_reference: data.externalReference,
      back_url: data.backUrl,
      status: "pending",
    }),
  });
}

/**
 * Get subscription details by ID.
 */
export async function getMPSubscription(subscriptionId: string): Promise<MPSubscription> {
  return mpFetch<MPSubscription>(`/preapproval/${subscriptionId}`);
}

/**
 * Update subscription status (pause, cancel, etc.)
 */
export async function updateMPSubscription(
  subscriptionId: string,
  data: { status?: "authorized" | "paused" | "cancelled"; [key: string]: any }
): Promise<MPSubscription> {
  return mpFetch<MPSubscription>(`/preapproval/${subscriptionId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Cancel a subscription.
 */
export async function cancelMPSubscription(subscriptionId: string): Promise<MPSubscription> {
  return updateMPSubscription(subscriptionId, { status: "cancelled" });
}

/**
 * Pause a subscription.
 */
export async function pauseMPSubscription(subscriptionId: string): Promise<MPSubscription> {
  return updateMPSubscription(subscriptionId, { status: "paused" });
}

// ─── Plan ID Mapping ───

/**
 * Maps our internal plan IDs (e.g. "max_mensual") to Mercado Pago preapproval_plan IDs.
 * Loaded from .env.local
 */
export const MP_PLAN_MAP: Record<string, string> = process.env.MP_PLAN_IDS
  ? JSON.parse(process.env.MP_PLAN_IDS)
  : {};

export function setMPPlanMap(map: Record<string, string>) {
  Object.assign(MP_PLAN_MAP, map);
}
