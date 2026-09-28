import { createAdminClient } from "@/lib/supabase/server";
import { normalizeReferralCode } from "./cookie";
import { notifyAdminReferral } from "./emails";
import { getReferrerByCode } from "./queries";

/** Deja en el panel a quien llegó con el link y todavía no crea cuenta. */
export async function recordOpenReferral(params: {
  code: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  role?: string | null;
}): Promise<void> {
  const code = normalizeReferralCode(params.code);
  if (!code) return;

  const referrer = await getReferrerByCode(code);
  if (!referrer || referrer.status === "suspended") return;

  const email = params.email?.trim().toLowerCase() || null;
  const admin = createAdminClient();
  if (email) {
    const { data: existing } = await admin
      .from("referrals")
      .select("id")
      .eq("prospect_email", email)
      .limit(1);
    if (existing && existing.length > 0) return;
  }

  const company = params.company?.trim() || "Persona";
  const name = params.name.trim() || email?.split("@")[0] || "Contacto";
  const { error } = await admin.from("referrals").insert({
    referrer_id: referrer.id,
    prospect_name: name,
    prospect_company: company,
    prospect_role: params.role?.trim() || "Dejó sus datos",
    prospect_email: email,
    prospect_phone: params.phone || null,
    source: "form",
    status: "submitted",
    suggested_from_cookie: true,
    notes: "Dejó sus datos con el link. Todavía no crea cuenta.",
  });
  if (error) {
    console.warn("[referrals] open lead:", error.message);
    return;
  }

  void notifyAdminReferral({
    referrerName: referrer.name,
    referrerCode: referrer.referral_code,
    prospectName: name,
    prospectEmail: email,
    signedUp: false,
  });
}
