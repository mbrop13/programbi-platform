import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { ensureReferrer, requireReferralUser } from "@/lib/referrals/auth";
import { introSchema } from "@/lib/referrals/schemas";
import { REFERRAL_INTRO_DAILY_LIMIT } from "@/lib/referrals/constants";
import {
  countIntrosToday,
  listReferralsForReferrer,
  writeAudit,
} from "@/lib/referrals/queries";
import { notifyIntroReceived } from "@/lib/referrals/emails";

export async function GET() {
  const auth = await requireReferralUser();
  if (!auth.ok) return auth.response;
  const referrer = await ensureReferrer({
    userId: auth.data.user.id,
    email: auth.data.user.email,
  });
  const referrals = await listReferralsForReferrer(referrer.id);
  return NextResponse.json({ referrals });
}

export async function POST(req: Request) {
  const auth = await requireReferralUser();
  if (!auth.ok) return auth.response;

  const referrer = await ensureReferrer({
    userId: auth.data.user.id,
    email: auth.data.user.email,
  });

  if (referrer.status === "suspended") {
    return NextResponse.json(
      { error: "Tu cuenta está suspendida. Escríbenos si es un error." },
      { status: 403 }
    );
  }
  if (referrer.status === "pending") {
    return NextResponse.json(
      { error: "Tu cuenta aún no está activa. Te avisamos cuando el equipo la habilite." },
      { status: 403 }
    );
  }

  const limited = await rateLimit(`referral-intro:${referrer.id}`, {
    maxRequests: REFERRAL_INTRO_DAILY_LIMIT,
    windowSeconds: 24 * 60 * 60,
  });
  if (!limited.allowed) {
    return NextResponse.json(
      {
        error: `Límite de ${REFERRAL_INTRO_DAILY_LIMIT} intros por día. Mañana puedes enviar más.`,
        retryAfter: limited.retryAfterSeconds,
      },
      { status: 429 }
    );
  }

  const today = await countIntrosToday(referrer.id);
  if (today >= REFERRAL_INTRO_DAILY_LIMIT) {
    return NextResponse.json(
      { error: `Límite de ${REFERRAL_INTRO_DAILY_LIMIT} intros por día.` },
      { status: 429 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = introSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los campos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const { data, error } = await auth.data.admin
    .from("referrals")
    .insert({
      referrer_id: referrer.id,
      prospect_name: d.prospectName,
      prospect_company: d.prospectCompany,
      prospect_role: d.prospectRole,
      prospect_email: d.prospectEmail || null,
      prospect_phone: d.prospectPhone || null,
      prospect_linkedin: d.prospectLinkedIn || null,
      notes: d.notes || null,
      source: d.source,
      status: "submitted",
    })
    .select("*")
    .single();

  if (error) {
    console.error("[referrals] intro insert", error.message);
    return NextResponse.json({ error: "No se pudo guardar la intro." }, { status: 500 });
  }

  await writeAudit({
    actorId: auth.data.user.id,
    actorEmail: auth.data.user.email,
    action: "referral.submit",
    entityType: "referral",
    entityId: data.id,
    meta: { company: d.prospectCompany, source: d.source },
  });

  void notifyIntroReceived({
    referrerName: referrer.name,
    referrerEmail: referrer.email,
    prospectName: d.prospectName,
    prospectCompany: d.prospectCompany,
  });

  return NextResponse.json({ referral: data });
}
