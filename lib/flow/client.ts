import crypto from "crypto";

// ─── CONFIGURATION ───
const FLOW_API_URL = process.env.FLOW_API_URL || "https://sandbox.flow.cl/api";
const FLOW_API_KEY = process.env.FLOW_API_KEY || "";
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

/**
 * Generates HMAC-SHA256 signature for Flow API.
 * Flow requires all params sorted alphabetically, concatenated as key+value pairs.
 */
export function generateSignature(params: Record<string, string | number>): string {
  const sortedKeys = Object.keys(params).sort();
  const stringToSign = sortedKeys.map(key => `${key}${params[key]}`).join("");
  return crypto.createHmac("sha256", FLOW_SECRET_KEY).update(stringToSign).digest("hex");
}

/**
 * Creates a payment order in Flow.
 * Returns the token and redirect URL for the user to pay.
 */
export async function createFlowPayment(data: {
  commerceOrder: string;
  subject: string;
  amount: number;
  email: string;
  currency?: string;
  optional?: Record<string, string>;
}): Promise<{ token: string; url: string; flowOrder: number }> {
  if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
    throw new Error("Flow API credentials not configured. Set FLOW_API_KEY and FLOW_SECRET_KEY in .env.local");
  }

  const params: Record<string, string | number> = {
    apiKey: FLOW_API_KEY,
    commerceOrder: data.commerceOrder,
    subject: data.subject,
    currency: data.currency || "CLP",
    amount: data.amount,
    email: data.email,
    urlConfirmation: `${APP_URL}/api/flow/confirm`,
    urlReturn: `${APP_URL}/api/flow/return`,
  };

  // Add optional params (courseId, userId, etc.)
  if (data.optional) {
    params.optional = JSON.stringify(data.optional);
  }

  // Sign the request
  const signature = generateSignature(params);
  params.s = signature;

  // Send request to Flow
  const formData = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  const response = await fetch(`${FLOW_API_URL}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Flow API error:", errorText);
    throw new Error(`Flow API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  return {
    token: result.token,
    url: result.url + "?token=" + result.token,
    flowOrder: result.flowOrder,
  };
}

/**
 * Gets the status of a payment from Flow.
 */
export async function getFlowPaymentStatus(token: string): Promise<{
  flowOrder: number;
  commerceOrder: string;
  status: number; // 1=pending, 2=paid, 3=rejected, 4=cancelled
  amount: number;
  paymentData?: {
    date: string;
    media: string;
    balance: number;
  };
  payer: string;
  optional?: string;
}> {
  if (!FLOW_API_KEY || !FLOW_SECRET_KEY) {
    throw new Error("Flow API credentials not configured");
  }

  const params: Record<string, string | number> = {
    apiKey: FLOW_API_KEY,
    token: token,
  };

  const signature = generateSignature(params);
  params.s = signature;

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  const response = await fetch(`${FLOW_API_URL}/payment/getStatus?${queryString}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flow getStatus error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Flow payment status codes
 */
export const FLOW_STATUS = {
  PENDING: 1,
  PAID: 2,
  REJECTED: 3,
  CANCELLED: 4,
} as const;

/**
 * Maps Flow status number to our internal status string
 */
export function flowStatusToString(status: number): string {
  switch (status) {
    case 1: return "pending";
    case 2: return "paid";
    case 3: return "rejected";
    case 4: return "cancelled";
    default: return "pending";
  }
}

// ─── SUBSCRIPTION API ───

export async function createFlowCustomer(data: {
  externalId: string; // Our internal User ID — Flow requires this exact field name
  name: string;
  email: string;
}): Promise<{ customerId: string }> {
  const params: Record<string, string | number> = {
    apiKey: FLOW_API_KEY,
    externalId: data.externalId,
    name: data.name,
    email: data.email,
  };
  params.s = generateSignature(params);

  const formData = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => formData.append(k, String(v)));

  const response = await fetch(`${FLOW_API_URL}/customer/create`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    // In Flow, if customer already exists, it throws a 400 with a specific code. We can try to fetch it if we want, or just assume it fails.
    throw new Error(`Flow API error (createCustomer): ${errorText}`);
  }

  return response.json();
}

export async function registerFlowCard(
  customerId: string, 
  urlReturnOverride?: string
): Promise<{ token: string; url: string }> {
  const params: Record<string, string | number> = {
    apiKey: FLOW_API_KEY,
    customerId,
    url_return: urlReturnOverride || `${APP_URL}/api/flow/subscription/return`,
  };
  params.s = generateSignature(params);

  const formData = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => formData.append(k, String(v)));

  const response = await fetch(`${FLOW_API_URL}/customer/register`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flow API error (registerCard): ${errorText}`);
  }

  const result = await response.json();
  return {
    token: result.token,
    url: result.url + "?token=" + result.token,
  };
}

export async function getFlowRegisterStatus(token: string): Promise<{
  status: number; // 1 = registered, 0 = rejected
  customerId: string;
  creditCardType: string;
  last4CardDigits: string;
}> {
  const params: Record<string, string | number> = {
    apiKey: FLOW_API_KEY,
    token,
  };
  params.s = generateSignature(params);

  const queryString = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
  const response = await fetch(`${FLOW_API_URL}/customer/getRegisterStatus?${queryString}`, { method: "GET" });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flow API error (getRegisterStatus): ${errorText}`);
  }
  return response.json();
}

export async function createFlowSubscription(data: {
  planId: string;
  customerId: string;
}): Promise<{ subscriptionId: string }> {
  const params: Record<string, string | number> = {
    apiKey: FLOW_API_KEY,
    planId: data.planId,
    customerId: data.customerId,
  };
  params.s = generateSignature(params);

  const formData = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => formData.append(k, String(v)));

  const response = await fetch(`${FLOW_API_URL}/subscription/create`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flow API error (createSubscription): ${errorText}`);
  }

  return response.json();
}

export async function cancelFlowSubscription(subscriptionId: string): Promise<{ status: number }> {
  const params: Record<string, string | number> = {
    apiKey: FLOW_API_KEY,
    subscriptionId,
    at_period_end: 0, // 0 = cancel immediately, 1 = wait until end of period
  };
  params.s = generateSignature(params);

  const formData = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => formData.append(k, String(v)));

  const response = await fetch(`${FLOW_API_URL}/subscription/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Flow API error (cancelSubscription): ${errorText}`);
  }

  return response.json();
}
