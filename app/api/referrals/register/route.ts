import { NextResponse } from "next/server";
import { rateLimit, AUTH_LIMIT } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/auth-helpers";
import { registerReferrerSchema } from "@/lib/referrals/schemas";
import { ensureReferrer, requireReferralUser } from "@/lib/referrals/auth";
import { writeAudit } from "@/lib/referrals/queries";
import { notifyWelcomeReferrer } from "@/lib/referrals/emails";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = await rateLimit(`referral-register:${ip}`, AUTH_LIMIT);
  if (!limited.allowed) {
    return NextResponse.json({ error: "Demasiados intentos." }, { status: 429 });
  }

  const auth = await requireReferralUser();
  if (!auth.ok) return auth.response;

  const json = await req.json().catch(() => null);
  const parsed = registerReferrerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const referrer = await ensureReferrer({
    userId: auth.data.user.id,
    email: auth.data.user.email,
    name: parsed.data.name,
    phone: parsed.data.phone || null,
    type: parsed.data.type,
  });

  await writeAudit({
    actorId: auth.data.user.id,
    actorEmail: auth.data.user.email,
    action: "referrer.register",
    entityType: "referrer",
    entityId: referrer.id,
    meta: { type: referrer.type, status: referrer.status },
  });

  void notifyWelcomeReferrer({
    name: referrer.name,
    email: referrer.email,
    code: referrer.referral_code,
  });

  return NextResponse.json({ referrer });
}
