import { requireReferralAdmin } from "@/lib/referrals/auth";
import { listAdminReferrals } from "@/lib/referrals/queries";
import { STATUS_LABELS } from "@/lib/referrals/status";

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const auth = await requireReferralAdmin();
  if (!auth.ok) return auth.response;
  const referrals = await listAdminReferrals();
  const header = [
    "id",
    "created_at",
    "status",
    "status_label",
    "referrer",
    "referrer_email",
    "code",
    "prospect_name",
    "prospect_company",
    "prospect_role",
    "prospect_email",
    "prospect_phone",
    "source",
    "deal_amount_clp",
    "commission_clp",
    "commission_status",
  ];
  const lines = [header.join(",")];
  for (const r of referrals) {
    lines.push(
      [
        r.id,
        r.created_at,
        r.status,
        STATUS_LABELS[r.status],
        r.referrer?.name,
        r.referrer?.email,
        r.referrer?.referral_code,
        r.prospect_name,
        r.prospect_company,
        r.prospect_role,
        r.prospect_email,
        r.prospect_phone,
        r.source,
        r.commission?.deal_amount_clp,
        r.commission?.commission_amount_clp,
        r.commission?.status,
      ]
        .map(csvEscape)
        .join(",")
    );
  }
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="referidos-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
