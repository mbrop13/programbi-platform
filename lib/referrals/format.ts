import { SITE_URL } from "@/lib/seo";

export function referralSignupUrl(code: string): string {
  return `${SITE_URL}/registro?ref=${encodeURIComponent(code)}`;
}

export function formatClp(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.trunc(amount));
}

export function formatClpCompact(amount: number): string {
  const n = Math.trunc(amount);
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1).replace(".", ",")}M`;
  }
  return formatClp(n);
}

export function formatDateCl(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTimeCl(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** RUT chileno: módulo 11. Acepta con o sin puntos/guión. */
export function isValidRut(raw: string): boolean {
  const clean = raw.replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(clean)) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const rest = 11 - (sum % 11);
  const expected = rest === 11 ? "0" : rest === 10 ? "K" : String(rest);
  return dv === expected;
}

export function formatRut(raw: string): string {
  const clean = raw.replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();
  if (clean.length < 2) return raw;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withDots}-${dv}`;
}

export function generateReferralCode(seed?: string): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  if (seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    for (let i = 0; i < 6; i++) {
      out += alphabet[h % alphabet.length];
      h = Math.imul(h, 1664525) + 1013904223;
    }
  } else {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    for (const b of bytes) out += alphabet[b % alphabet.length];
  }
  return `PB${out}`;
}

export function maskAccountNumber(num: string): string {
  const digits = num.replace(/\s/g, "");
  if (digits.length <= 4) return "••••";
  return `•••• ${digits.slice(-4)}`;
}
