import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Referrer } from "./types";
import { generateReferralCode } from "./format";

export type ReferralAuth = {
  user: { id: string; email?: string };
  supabase: Awaited<ReturnType<typeof createClient>>;
  admin: ReturnType<typeof createAdminClient>;
};

export async function requireReferralUser(): Promise<
  { ok: true; data: ReferralAuth } | { ok: false; response: NextResponse }
> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "No autorizado. Inicia sesión para continuar." },
        { status: 401 }
      ),
    };
  }

  return {
    ok: true,
    data: {
      user: { id: user.id, email: user.email ?? undefined },
      supabase,
      admin: createAdminClient(),
    },
  };
}

export async function isReferralAdmin(userId: string): Promise<boolean> {
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (profile?.role === "admin") return true;

  const { data: member } = await admin
    .from("community_members")
    .select("role")
    .eq("profile_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (member) return true;

  const { data: adminRow } = await admin
    .from("admin_users")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  return adminRow?.role === "admin";
}

export async function requireReferralAdmin(): Promise<
  { ok: true; data: ReferralAuth } | { ok: false; response: NextResponse }
> {
  const auth = await requireReferralUser();
  if (!auth.ok) return auth;
  const ok = await isReferralAdmin(auth.data.user.id);
  if (!ok) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Prohibido. Se requieren privilegios de administrador." },
        { status: 403 }
      ),
    };
  }
  return auth;
}

function autoActiveForEmail(email: string | undefined): boolean {
  const allow = (process.env.REFERRAL_AUTO_ACTIVE_DOMAINS || "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  // Default: auto-active. If allowlist is set, only those domains auto-activate.
  if (allow.length === 0) return true;
  const domain = (email || "").split("@")[1]?.toLowerCase();
  return Boolean(domain && allow.includes(domain));
}

export async function ensureReferrer(params: {
  userId: string;
  email?: string;
  name?: string;
  phone?: string | null;
  type?: Referrer["type"];
}): Promise<Referrer> {
  const admin = createAdminClient();
  const { data: existing, error } = await admin
    .from("referrers")
    .select(
      "id, user_id, name, email, phone, type, status, referral_code, bank_payload, created_at, updated_at"
    )
    .eq("user_id", params.userId)
    .maybeSingle();

  if (error) throw error;
  if (existing) return toPublicReferrer(existing);

  const email = params.email || "";
  const name = params.name?.trim() || email.split("@")[0] || "Referidor";
  const code = generateReferralCode(params.userId + email);
  const status = autoActiveForEmail(email) ? "active" : "pending";

  const insert = {
    user_id: params.userId,
    name,
    email,
    phone: params.phone || null,
    type: params.type || "other",
    status,
    referral_code: code,
  };

  const { data: created, error: insertError } = await admin
    .from("referrers")
    .insert(insert)
    .select(
      "id, user_id, name, email, phone, type, status, referral_code, bank_payload, created_at, updated_at"
    )
    .single();

  if (insertError) {
    // Unique race: another request created it.
    const { data: raced } = await admin
      .from("referrers")
      .select(
        "id, user_id, name, email, phone, type, status, referral_code, bank_payload, created_at, updated_at"
      )
      .eq("user_id", params.userId)
      .maybeSingle();
    if (raced) return toPublicReferrer(raced);
    throw insertError;
  }

  return toPublicReferrer(created);
}

type ReferrerRow = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  type: Referrer["type"];
  status: Referrer["status"];
  referral_code: string;
  bank_payload?: string | null;
  created_at: string;
  updated_at: string;
};

export function toPublicReferrer(row: ReferrerRow): Referrer {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    type: row.type,
    status: row.status,
    referral_code: row.referral_code,
    has_bank: Boolean(row.bank_payload),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
