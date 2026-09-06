import { NextResponse } from "next/server";
import { ensureReferrer, requireReferralUser, toPublicReferrer } from "@/lib/referrals/auth";
import { decryptBankDetails, encryptBankDetails, publicBankSummary } from "@/lib/referrals/crypto";
import { profilePatchSchema } from "@/lib/referrals/schemas";
import { writeAudit } from "@/lib/referrals/queries";

export async function GET() {
  const auth = await requireReferralUser();
  if (!auth.ok) return auth.response;
  const referrer = await ensureReferrer({
    userId: auth.data.user.id,
    email: auth.data.user.email,
  });

  const { data } = await auth.data.admin
    .from("referrers")
    .select("bank_payload")
    .eq("id", referrer.id)
    .maybeSingle();

  const bank = publicBankSummary(decryptBankDetails(data?.bank_payload));
  return NextResponse.json({ referrer, bank });
}

export async function PATCH(req: Request) {
  const auth = await requireReferralUser();
  if (!auth.ok) return auth.response;
  const referrer = await ensureReferrer({
    userId: auth.data.user.id,
    email: auth.data.user.email,
  });

  const json = await req.json().catch(() => null);
  const parsed = profilePatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (parsed.data.name) patch.name = parsed.data.name;
  if (parsed.data.phone !== undefined) patch.phone = parsed.data.phone || null;
  if (parsed.data.type) patch.type = parsed.data.type;
  if (parsed.data.bank) {
    patch.bank_payload = encryptBankDetails(parsed.data.bank);
  }

  const { data, error } = await auth.data.admin
    .from("referrers")
    .update(patch)
    .eq("id", referrer.id)
    .select(
      "id, user_id, name, email, phone, type, status, referral_code, bank_payload, created_at, updated_at"
    )
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "No se pudo guardar." }, { status: 500 });
  }

  await writeAudit({
    actorId: auth.data.user.id,
    actorEmail: auth.data.user.email,
    action: parsed.data.bank ? "referrer.bank_update" : "referrer.profile_update",
    entityType: "referrer",
    entityId: referrer.id,
    meta: { fields: Object.keys(parsed.data).filter((k) => k !== "bank") },
  });

  const updated = toPublicReferrer(data);
  const bank = publicBankSummary(decryptBankDetails(data.bank_payload));
  return NextResponse.json({ referrer: updated, bank });
}
