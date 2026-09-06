import { createAdminClient } from "@/lib/supabase/server";
import { PIPELINE_STATUSES, WON_STATUSES } from "./constants";
import type {
  Commission,
  LeadHint,
  Referral,
  ReferralWithCommission,
  Referrer,
  ReferrerStats,
} from "./types";
import { toPublicReferrer } from "./auth";

export async function getReferrerByUserId(userId: string): Promise<Referrer | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("referrers")
    .select(
      "id, user_id, name, email, phone, type, status, referral_code, bank_payload, created_at, updated_at"
    )
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? toPublicReferrer(data) : null;
}

export async function getReferrerByCode(code: string): Promise<Referrer | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("referrers")
    .select(
      "id, user_id, name, email, phone, type, status, referral_code, bank_payload, created_at, updated_at"
    )
    .eq("referral_code", code.toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return data ? toPublicReferrer(data) : null;
}

export async function listReferralsForReferrer(
  referrerId: string
): Promise<ReferralWithCommission[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("referrals")
    .select("*, referral_commissions(*)")
    .eq("referrer_id", referrerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapReferralJoin);
}

export async function getReferralForReferrer(
  referralId: string,
  referrerId: string
): Promise<ReferralWithCommission | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("referrals")
    .select("*, referral_commissions(*)")
    .eq("id", referralId)
    .eq("referrer_id", referrerId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapReferralJoin(data) : null;
}

export async function countIntrosToday(referrerId: string): Promise<number> {
  const admin = createAdminClient();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const { count, error } = await admin
    .from("referrals")
    .select("id", { count: "exact", head: true })
    .eq("referrer_id", referrerId)
    .gte("created_at", start.toISOString());
  if (error) throw error;
  return count ?? 0;
}

export function computeStats(
  referrals: ReferralWithCommission[]
): ReferrerStats {
  const introsSent = referrals.length;
  const inPipeline = referrals.filter((r) =>
    (PIPELINE_STATUSES as readonly string[]).includes(r.status)
  ).length;
  const won = referrals.filter((r) =>
    (WON_STATUSES as readonly string[]).includes(r.status)
  ).length;
  const lost = referrals.filter((r) => r.status === "lost").length;
  const closed = won + lost;
  const commissions = referrals.map((r) => r.commission).filter(Boolean) as Commission[];
  const commissionEarnedClp = commissions
    .filter((c) => c.status !== "clawed_back")
    .reduce((s, c) => s + Number(c.commission_amount_clp), 0);
  const commissionPaidClp = commissions
    .filter((c) => c.status === "paid")
    .reduce((s, c) => s + Number(c.commission_amount_clp), 0);
  const commissionPayableClp = commissions
    .filter((c) => c.status === "payable" || c.status === "accrued")
    .reduce((s, c) => s + Number(c.commission_amount_clp), 0);

  return {
    introsSent,
    inPipeline,
    won,
    lost,
    conversionRate: closed === 0 ? 0 : Math.round((won / closed) * 100),
    commissionEarnedClp,
    commissionPaidClp,
    commissionPayableClp,
  };
}

export async function writeAudit(params: {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> {
  const admin = createAdminClient();
  const meta = { ...(params.meta || {}) };
  // Never persist bank secrets in audit.
  delete meta.bank;
  delete meta.accountNumber;
  delete meta.bank_payload;
  await admin.from("referral_audit_log").insert({
    actor_id: params.actorId ?? null,
    actor_email: params.actorEmail ?? null,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    meta,
  });
}

export async function listAdminReferrals(status?: string): Promise<ReferralWithCommission[]> {
  const admin = createAdminClient();
  let q = admin
    .from("referrals")
    .select(
      "*, referral_commissions(*), referrers(id, name, email, referral_code, type, status)"
    )
    .order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(mapReferralJoin);
}

export async function listAdminReferrers(): Promise<(Referrer & { intros: number })[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("referrers")
    .select(
      "id, user_id, name, email, phone, type, status, referral_code, bank_payload, created_at, updated_at"
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data || []).map(toPublicReferrer);
  const { data: counts } = await admin.from("referrals").select("referrer_id");
  const map = new Map<string, number>();
  for (const r of counts || []) {
    map.set(r.referrer_id, (map.get(r.referrer_id) || 0) + 1);
  }
  return rows.map((r) => ({ ...r, intros: map.get(r.id) || 0 }));
}

export async function listAdminCommissions(): Promise<
  (Commission & { referral: Referral; referrer: Referrer | null })[]
> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("referral_commissions")
    .select(
      "*, referrals(*, referrers(id, user_id, name, email, phone, type, status, referral_code, created_at, updated_at))"
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((row: Record<string, unknown>) => {
    const referralRaw = row.referrals as Record<string, unknown> | null;
    const referrerRaw = referralRaw?.referrers as Record<string, unknown> | null;
    const commission = mapCommission(row);
    const referral = referralRaw ? mapReferral(referralRaw) : ({} as Referral);
    const referrer = referrerRaw
      ? toPublicReferrer({
          id: String(referrerRaw.id),
          user_id: String(referrerRaw.user_id ?? ""),
          name: String(referrerRaw.name),
          email: String(referrerRaw.email),
          phone: (referrerRaw.phone as string) ?? null,
          type: referrerRaw.type as Referrer["type"],
          status: referrerRaw.status as Referrer["status"],
          referral_code: String(referrerRaw.referral_code),
          bank_payload: null,
          created_at: String(referrerRaw.created_at),
          updated_at: String(referrerRaw.updated_at ?? referrerRaw.created_at),
        })
      : null;
    return { ...commission, referral, referrer };
  });
}

export async function listLeadHints(): Promise<LeadHint[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("referral_lead_hints")
    .select("*")
    .eq("status", "suggested")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data || []) as LeadHint[];
}

function mapReferral(row: Record<string, unknown>): Referral {
  return {
    id: String(row.id),
    referrer_id: String(row.referrer_id),
    prospect_name: String(row.prospect_name),
    prospect_company: String(row.prospect_company),
    prospect_role: String(row.prospect_role),
    prospect_email: (row.prospect_email as string) ?? null,
    prospect_phone: (row.prospect_phone as string) ?? null,
    prospect_linkedin: (row.prospect_linkedin as string) ?? null,
    notes: (row.notes as string) ?? null,
    source: String(row.source || "other"),
    status: row.status as Referral["status"],
    lost_reason: (row.lost_reason as string) ?? null,
    suggested_from_cookie: Boolean(row.suggested_from_cookie),
    prospect_user_id: (row.prospect_user_id as string) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapCommission(row: Record<string, unknown>): Commission {
  return {
    id: String(row.id),
    referral_id: String(row.referral_id),
    deal_amount_clp: Number(row.deal_amount_clp),
    percent: Number(row.percent),
    commission_amount_clp: Number(row.commission_amount_clp),
    status: row.status as Commission["status"],
    paid_at: (row.paid_at as string) ?? null,
    payment_ref: (row.payment_ref as string) ?? null,
    clawback_at: (row.clawback_at as string) ?? null,
    clawback_reason: (row.clawback_reason as string) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapReferralJoin(row: Record<string, unknown>): ReferralWithCommission {
  const commRaw = row.referral_commissions;
  const comm = Array.isArray(commRaw) ? commRaw[0] : commRaw;
  const referrerRaw = row.referrers as Record<string, unknown> | undefined;
  return {
    ...mapReferral(row),
    commission: comm ? mapCommission(comm as Record<string, unknown>) : null,
    referrer: referrerRaw
      ? {
          id: String(referrerRaw.id),
          name: String(referrerRaw.name),
          email: String(referrerRaw.email),
          referral_code: String(referrerRaw.referral_code),
          type: referrerRaw.type as Referrer["type"],
          status: referrerRaw.status as Referrer["status"],
        }
      : undefined,
  };
}
