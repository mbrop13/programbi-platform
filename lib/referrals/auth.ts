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

const REFERRER_COLS =
  "id, user_id, name, email, phone, type, status, referral_code, bank_payload, created_at, updated_at";

export async function ensureReferrer(params: {
  userId: string;
  email?: string;
  name?: string;
  phone?: string | null;
  type?: Referrer["type"];
}): Promise<Referrer> {
  const supabase = await createClient();
  const { data: own, error: ownError } = await supabase
    .from("referrers")
    .select(REFERRER_COLS)
    .eq("user_id", params.userId)
    .maybeSingle();

  if (!ownError && own) return toPublicReferrer(own);

  const admin = createAdminClient();
  const { data: existing, error } = own
    ? { data: own, error: null }
    : await admin.from("referrers").select(REFERRER_COLS).eq("user_id", params.userId).maybeSingle();

  if (existing) return toPublicReferrer(existing);
  if (isMissingRelation(error) || isMissingRelation(ownError)) {
    throw new Error("Falta aplicar la migración de referidos en Supabase.");
  }
  if (error && !isMissingRelation(error)) {
    if (ownError && !isMissingRelation(ownError)) throw ownError;
    throw error;
  }

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

  const { data: createdOwn, error: insertOwn } = await supabase
    .from("referrers")
    .insert(insert)
    .select(REFERRER_COLS)
    .maybeSingle();
  if (createdOwn) return toPublicReferrer(createdOwn);

  const { data: created, error: insertError } = await admin
    .from("referrers")
    .insert(insert)
    .select(REFERRER_COLS)
    .single();

  if (insertError || !created) {
    const { data: raced } = await supabase
      .from("referrers")
      .select(REFERRER_COLS)
      .eq("user_id", params.userId)
      .maybeSingle();
    if (raced) return toPublicReferrer(raced);
    throw insertOwn || insertError || new Error("No se pudo crear el perfil de referidor.");
  }

  return toPublicReferrer(created);
}

function isMissingRelation(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  return error.code === "42P01" || msg.includes("does not exist") || msg.includes("schema cache");
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
