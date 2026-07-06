// Webhook signature verification helpers.
//
// Background (OWASP ASVS L3 audit, CR-3 / CR-4):
// Both payment webhooks (MercadoPago and Flow) were processing requests
// without verifying their authenticity, allowing forged notifications to
// activate subscriptions or enroll users for free. These helpers implement
// the official HMAC verification of each provider.

import crypto from "crypto";
import type { NextRequest } from "next/server";

/**
 * Verify a MercadoPago webhook signature.
 *
 * MercadoPago sends two headers:
 *   x-signature: ts=<unix-ts>,v1=<hex-hmac-sha256>
 *   x-request-id: <request-id>
 * and the data id can be retrieved from the query string (?data.id=...)
 * or from the body's `data.id`.
 *
 * The manifest to sign is: `id:<dataId>;request-id:<requestId>;ts:<ts>;`
 * signed with HMAC-SHA256 using the webhook secret configured in the MP dashboard.
 *
 * @returns true if the signature is valid (or if no secret is configured AND
 *          the request is local/development, to keep dev usable); false otherwise.
 */
export function verifyMercadoPagoSignature(req: NextRequest, body: any): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  // If the secret is not configured we fail CLOSED in production and allow
  // the request in development so local testing is not blocked. This MUST
  // be configured before deploying to production.
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const signatureHeader = req.headers.get("x-signature") || "";
  const requestId = req.headers.get("x-request-id") || "";
  if (!signatureHeader || !requestId) return false;

  // Parse "ts=...,v1=..."
  const parts: Record<string, string> = {};
  for (const token of signatureHeader.split(",")) {
    const [k, ...rest] = token.split("=");
    if (k && rest.length) parts[k.trim()] = rest.join("=").trim();
  }
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  // data.id can come from the query (?data.id=...) or from the body.
  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id") || body?.data?.id || "";

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  // Constant-time comparison to avoid timing attacks.
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Validate that a request originates from Flow's infrastructure.
 *
 * Flow does not sign its confirm callback with HMAC by default; instead it
 * relies on the secrecy of the per-payment token plus the caller being Flow.
 * As defense in depth we therefore:
 *   1. Verify a shared webhook secret (`FLOW_WEBHOOK_SECRET`) when configured.
 *      Flow can include it as a query param `?secret=...` or header `x-flow-secret`.
 *   2. Restrict the source IP to Flow's published ranges when behind Vercel.
 *
 * @returns true if the request is trusted.
 */
export function isFlowTrustedSource(req: NextRequest): boolean {
  // Strategy 1: shared secret (recommended; configure Flow to send it).
  const sharedSecret = process.env.FLOW_WEBHOOK_SECRET;
  if (sharedSecret) {
    const url = new URL(req.url);
    const provided =
      url.searchParams.get("secret") ||
      req.headers.get("x-flow-secret") ||
      "";
    if (provided && timingSafeEqualString(provided, sharedSecret)) {
      return true;
    }
    // If a secret is configured but not provided/correct, fall through to IP
    // check; if that also fails we reject.
  }

  // Strategy 2: IP allowlist (Flow.cl production ranges).
  // Vercel exposes the client IP via x-forwarded-for / x-vercel-forwarded-for.
  const ip =
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "";
  if (!ip) return false;

  // Flow.cl documented ranges (Chile). Update if Flow publishes new ranges.
  const ALLOWED_CIDRS = ["200.71.53.0/24", "200.0.120.0/24"];
  for (const cidr of ALLOWED_CIDRS) {
    if (ipInCidr(ip, cidr)) return true;
  }
  return false;
}

function timingSafeEqualString(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function ipInCidr(ip: string, cidr: string): boolean {
  const [range, bitsStr] = cidr.split("/");
  const bits = parseInt(bitsStr, 10);
  const ipNum = ipv4ToInt(ip);
  const rangeNum = ipv4ToInt(range);
  if (ipNum === null || rangeNum === null) return false;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (ipNum & mask) === (rangeNum & mask);
}

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".").map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) {
    return null;
  }
  return (((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
}
