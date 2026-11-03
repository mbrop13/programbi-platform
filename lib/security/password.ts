// Shared password rule for registro, AuthModal, referidos and password reset.
// Length only: at least 8 characters. No character classes.

export interface PasswordValidation {
  ok: boolean;
  error?: string;
}

const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

/**
 * Validate a password against the shared rule.
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
  return { ok: true };
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/**
 * Check a password against the HaveIBeenPwned k-anonymity API.
 *
 * Only the first 5 hex chars of the SHA-1 hash are sent to the server, so the
 * full password is never disclosed. Returns true when the password has been
 * found in a known breach (and therefore must be rejected).
 *
 * Uses the Web Crypto API (globalThis.crypto.subtle), available in browsers and
 * Node/Edge runtimes, so this module stays safe to import from client
 * components. Failures default to "not breached" so the auth flow is not
 * blocked by a transient network or crypto error — log it instead.
 */
export async function isBreachedPassword(pw: string): Promise<boolean> {
  try {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) return false;

    const digest = await subtle.digest("SHA-1", new TextEncoder().encode(pw));
    const sha1 = toHex(digest);
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { "Add-Padding": "true" },
    });
    if (!res.ok) return false;
    const text = await res.text();
    return text.split("\n").some((line) => {
      const [hashSuffix, count] = line.trim().split(":");
      // Add-Padding returns decoys with count 0; only a real hit counts.
      return hashSuffix === suffix && Number(count) > 0;
    });
  } catch {
    // Network/parse/crypto error — do not block signup, but this should be logged.
    return false;
  }
}
