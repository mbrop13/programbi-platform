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

// ─── One-Time Payments (Preferences Checkout Pro) ───

export interface MPPreference {
  id: string;
  init_point: string;
}

export async function createMPPreference(data: {
  title: string;
  price: number;
  payerEmail: string;
  externalReference: string;
  planId: string;
  backUrl: string;
}): Promise<MPPreference> {
  return mpFetch<MPPreference>("/checkout/preferences", {
    method: "POST",
    body: JSON.stringify({
      items: [
        {
          title: data.title,
          quantity: 1,
          unit_price: data.price,
          currency_id: "CLP",
        }
      ],
      payer: {
        email: data.payerEmail,
      },
      external_reference: data.externalReference,
      metadata: {
        plan_id: data.planId,
      },
      back_urls: {
        success: data.backUrl,
        failure: data.backUrl,
        pending: data.backUrl,
      },
      auto_return: "approved",
    }),
  });
}

/**
 * Get Payment Details (for webhook)
 */
export async function getMPPayment(paymentId: string | number): Promise<any> {
  return mpFetch<any>(`/v1/payments/${paymentId}`);
}

// ─── Plan ID Mapping ───

/**
 * Maps our internal plan IDs to Mercado Pago preapproval_plan IDs.
 * Hardcoded to prevent Next.js .env restart issues.
 */
export const MP_PLAN_MAP: Record<string, string> = {
  "pro_mensual": "b5065c784a6a48dca35209606af765f9",
  "pro_semestral": "950a4ede583a48ac9905214533db3319",
  "pro_anual": "016de16c81dc4299be7e7d1ee5428000",
  "max_mensual": "682dae66e5734571864f906d7c04d495",
  "max_semestral": "9410305196d549ed95353acbd087e879",
  "max_anual": "a51caecceceb4af29278f6c665d592a4",
  "ultra_mensual": "5c2ef0a0b35f45f4b78c4f4366433c81",
  "ultra_semestral": "a3caff5fefc04f6a9679a46de48bf2b5",
  "ultra_anual": "13d9850258a5468f9b7cd4b5101fc9a5",
  "ultraplus_mensual": "d2c1d575e2f54335a2ff6fc61bc2a267",
  "ultraplus_semestral": "ab5806b2279b4ab4abe4aae640c19f30",
  "ultraplus_anual": "23de33023ebe4cbb9d474922fe4a5351"
};

export function setMPPlanMap(map: Record<string, string>) {
  Object.assign(MP_PLAN_MAP, map);
}
