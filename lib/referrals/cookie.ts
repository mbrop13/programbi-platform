import { REFERRAL_COOKIE_MAX_AGE_SECONDS, REFERRAL_COOKIE_NAME } from "./constants";

const CODE_RE = /^[A-Za-z0-9_-]{4,16}$/;

export function normalizeReferralCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  if (!CODE_RE.test(code)) return null;
  return code;
}

export function referralCookieOptions() {
  return {
    name: REFERRAL_COOKIE_NAME,
    maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  };
}

export function readBrowserReferralCode(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${REFERRAL_COOKIE_NAME}=([^;]*)`)
  );
  return normalizeReferralCode(match ? decodeURIComponent(match[1]) : null);
}

export function writeBrowserReferralCode(raw: string): void {
  const code = normalizeReferralCode(raw);
  if (!code || typeof document === "undefined") return;
  const opts = referralCookieOptions();
  const secure = opts.secure ? "; Secure" : "";
  document.cookie = `${opts.name}=${encodeURIComponent(code)}; Max-Age=${opts.maxAge}; Path=${opts.path}; SameSite=${opts.sameSite}${secure}`;
}
