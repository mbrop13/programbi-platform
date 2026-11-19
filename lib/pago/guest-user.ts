import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export interface GuestContactInput {
  name?: unknown;
  email?: unknown;
  whatsapp?: unknown;
}

export type GuestUserResolution =
  | {
      ok: true;
      userId: string;
      email: string;
    }
  | {
      ok: false;
      error: string;
      status: number;
    };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

function escapeIlikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

/**
 * Validates guest checkout contact fields, applies IP rate limiting, and
 * resolves or provisions a Supabase auth user + profile without granting a
 * browser session or returning existing profile PII to the client.
 */
export async function resolveOrCreateGuestUser(
  headers: Headers,
  input: GuestContactInput
): Promise<GuestUserResolution> {
  const ip = getClientIp(headers);
  const rl = await rateLimit(`guest-checkout:${ip}`, {
    maxRequests: 10,
    windowSeconds: 300,
  });
  if (!rl.allowed) {
    return {
      ok: false,
      error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
      status: 429,
    };
  }

  const fullName = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const phone = typeof input.whatsapp === "string" ? input.whatsapp.trim() : "";

  if (fullName.length < 2 || fullName.length > 120) {
    return {
      ok: false,
      error: "Ingresa tu nombre completo (mínimo 2 caracteres).",
      status: 400,
    };
  }

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return {
      ok: false,
      error: "Ingresa un correo electrónico válido.",
      status: 400,
    };
  }

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || phone.length > 30) {
    return {
      ok: false,
      error: "Ingresa un número de WhatsApp válido (mínimo 7 dígitos).",
      status: 400,
    };
  }

  const adminDb = createAdminClient();
  const escapedEmail = escapeIlikePattern(email);

  // Look up existing profile by email without exposing any PII to the caller.
  const { data: existingProfile } = await adminDb
    .from("profiles")
    .select("id")
    .ilike("email", escapedEmail)
    .maybeSingle();

  if (existingProfile?.id) {
    return {
      ok: true,
      userId: existingProfile.id,
      email,
    };
  }

  // Provision a confirmed auth user; the handle_new_user() trigger creates the profile row.
  const { data: created, error: createError } = await adminDb.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      whatsapp: phone,
      phone,
      created_via: "guest_checkout",
      registration_source: "/pago",
    },
  });

  if (created?.user?.id) {
    return {
      ok: true,
      userId: created.user.id,
      email,
    };
  }

  // Handle race condition where another request created the user concurrently.
  if (createError) {
    const msg = createError.message?.toLowerCase() || "";
    if (msg.includes("already") || msg.includes("exists") || createError.status === 422) {
      const { data: retryProfile } = await adminDb
        .from("profiles")
        .select("id")
        .ilike("email", escapedEmail)
        .maybeSingle();

      if (retryProfile?.id) {
        return {
          ok: true,
          userId: retryProfile.id,
          email,
        };
      }
    }
    console.error("Guest user provisioning failed:", createError);
    return {
      ok: false,
      error: "No pudimos registrar tus datos para el comprobante. Inténtalo nuevamente.",
      status: 500,
    };
  }

  return {
    ok: false,
    error: "No pudimos procesar tus datos de contacto.",
    status: 500,
  };
}
