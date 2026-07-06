// Centralized password policy.
//
// Background (OWASP ASVS L3 audit, A-01 / V2.5.1, A-02 / V2.5.7):
// Three different code paths enforced three different minimum lengths
// (10, 10 and 6 chars). ASVS Level 3 requires >= 12 chars, complexity rules
// AND a breached-password check (HIBP k-anonymity API). This helper unifies
// the policy so all auth flows (registro, AuthModal, actualizar-password)
// validate identically.

export interface PasswordValidation {
  ok: boolean;
  error?: string;
}

const MIN_LENGTH = 12;
const MAX_LENGTH = 128;

/**
 * Validate a password against the centralized policy.
 * Returns { ok: true } when valid, or { ok: false, error } with a user-facing
 * Spanish message. Pure client/server safe (no I/O).
 */
export function validatePassword(pw: string): PasswordValidation {
  if (!pw || typeof pw !== "string") {
    return { ok: false, error: "La contraseña es obligatoria." };
  }
  if (pw.length < MIN_LENGTH) {
    return { ok: false, error: `La contraseña debe tener al menos ${MIN_LENGTH} caracteres.` };
  }
  if (pw.length > MAX_LENGTH) {
    return { ok: false, error: "La contraseña es demasiado larga." };
  }
  if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) {
    return { ok: false, error: "La contraseña debe incluir mayúsculas y minúsculas." };
  }
  if (!/[0-9]/.test(pw)) {
    return { ok: false, error: "La contraseña debe incluir al menos un número." };
  }
  if (!/[^A-Za-z0-9]/.test(pw)) {
    return { ok: false, error: "La contraseña debe incluir al menos un carácter especial." };
  }
  return { ok: true };
}

/**
 * Check a password against the HaveIBeenPwned k-anonymity API.
 *
 * Only the first 5 hex chars of the SHA-1 hash are sent to the server, so the
 * full password is never disclosed. Returns true when the password has been
 * found in a known breach (and therefore must be rejected).
 *
 * Safe to call from server-side code. Failures default to "not breached" so
 * the auth flow is not blocked by a transient network error — log it instead.
 */
export async function isBreachedPassword(pw: string): Promise<boolean> {
  try {
    const { createHash } = await import("crypto");
    const sha1 = createHash("sha1").update(pw).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
    });
    if (!res.ok) return false;
    const text = await res.text();
    return text.split("\n").some((line) => {
      const [hashSuffix] = line.trim().split(":");
      return hashSuffix === suffix;
    });
  } catch {
    // Network/parse error — do not block signup, but this should be logged.
    return false;
  }
}
