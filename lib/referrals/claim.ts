import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { REFERRAL_COOKIE_NAME } from "./constants";
import { normalizeReferralCode } from "./cookie";
import { getReferrerByCode, writeAudit } from "./queries";

const COOKIE_ONLY_MAX_AGE_MS = 15 * 60 * 1000;
const METADATA_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function isMissingColumn(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  return msg.includes("prospect_user_id") || msg.includes("schema cache");
}

/**
 * Si la persona llegó con ?ref=CODIGO (cookie o metadata de signup) y es una
 * cuenta nueva, la atribuye al referidor. Idempotente.
 */
export async function claimReferralForUser(params: {
  userId: string;
  email?: string | null;
  name?: string | null;
  createdAt?: string | null;
  metadataCode?: string | null;
}): Promise<{ claimed: boolean }> {
  try {
    const cookieStore = await cookies();
    const fromCookie = normalizeReferralCode(
      cookieStore.get(REFERRAL_COOKIE_NAME)?.value
    );
    const fromMeta = normalizeReferralCode(params.metadataCode);
    const code = fromMeta || fromCookie;
    if (!code) return { claimed: false };

    const created = params.createdAt ? new Date(params.createdAt).getTime() : Date.now();
    const age = Number.isFinite(created) ? Date.now() - created : 0;
    const maxAge = fromMeta ? METADATA_MAX_AGE_MS : COOKIE_ONLY_MAX_AGE_MS;
    if (age > maxAge) return { claimed: false };

    const referrer = await getReferrerByCode(code);
    if (!referrer || referrer.status === "suspended") return { claimed: false };
    if (referrer.user_id === params.userId) return { claimed: false };

    const admin = createAdminClient();

    const { data: byUser } = await admin
      .from("referrals")
      .select("id")
      .eq("prospect_user_id", params.userId)
      .maybeSingle();
    if (byUser) return { claimed: false };

    if (params.email) {
      const { data: byEmail } = await admin
        .from("referrals")
        .select("id")
        .eq("prospect_email", params.email)
        .maybeSingle();
      if (byEmail) return { claimed: false };
    }

    const name = (params.name || params.email?.split("@")[0] || "Usuario").trim();
    const row: Record<string, unknown> = {
      referrer_id: referrer.id,
      prospect_name: name,
      prospect_company: "Cuenta ProgramBI",
      prospect_role: "Registrado por link",
      prospect_email: params.email || null,
      prospect_user_id: params.userId,
      source: "signup",
      status: "submitted",
      suggested_from_cookie: true,
      notes: "Registro con link de referido.",
    };

    let { error } = await admin.from("referrals").insert(row);
    if (error && isMissingColumn(error)) {
      delete row.prospect_user_id;
      ({ error } = await admin.from("referrals").insert(row));
    }
    if (error) {
      if (error.code === "23505") return { claimed: false };
      console.error("[referrals] claim insert:", error.message);
      return { claimed: false };
    }

    await writeAudit({
      actorId: params.userId,
      actorEmail: params.email,
      action: "referral.signup",
      entityType: "referral",
      meta: { referrer_id: referrer.id, code },
    });

    return { claimed: true };
  } catch (err) {
    console.error("[referrals] claim:", err);
    return { claimed: false };
  }
}
