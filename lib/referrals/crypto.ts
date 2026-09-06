import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import type { BankDetails } from "./types";

const PREFIX = "v1";

function getKey(): Buffer | null {
  const raw = process.env.REFERRAL_BANK_KEY || process.env.SUPABASE_SECRET_KEY || "";
  if (!raw || raw.length < 16) return null;
  return scryptSync(raw, "programbi-referrals-bank", 32);
}

export function encryptBankDetails(details: BankDetails): string {
  const key = getKey();
  const payload = JSON.stringify(details);
  if (!key) {
    // Best-effort: still persist, but mark as plaintext-wrapped so we can re-encrypt later.
    return `plain:${Buffer.from(payload, "utf8").toString("base64")}`;
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}:${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}

export function decryptBankDetails(blob: string | null | undefined): BankDetails | null {
  if (!blob) return null;
  try {
    if (blob.startsWith("plain:")) {
      const json = Buffer.from(blob.slice("plain:".length), "base64").toString("utf8");
      return JSON.parse(json) as BankDetails;
    }
    const key = getKey();
    if (!key) return null;
    const [prefix, ivB64, tagB64, dataB64] = blob.split(":");
    if (prefix !== PREFIX || !ivB64 || !tagB64 || !dataB64) return null;
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64"));
    const json = Buffer.concat([
      decipher.update(Buffer.from(dataB64, "base64")),
      decipher.final(),
    ]).toString("utf8");
    return JSON.parse(json) as BankDetails;
  } catch {
    return null;
  }
}

export function publicBankSummary(details: BankDetails | null): {
  bank: string;
  accountType: string;
  accountLast4: string;
  rut: string;
  accountHolder: string;
} | null {
  if (!details) return null;
  const digits = details.accountNumber.replace(/\s/g, "");
  return {
    bank: details.bank,
    accountType: details.accountType,
    accountLast4: digits.slice(-4),
    rut: details.rut,
    accountHolder: details.accountHolder,
  };
}
