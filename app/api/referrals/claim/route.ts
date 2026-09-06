import { NextResponse } from "next/server";
import { requireReferralUser } from "@/lib/referrals/auth";
import { claimReferralForUser } from "@/lib/referrals/claim";

export async function POST() {
  const auth = await requireReferralUser();
  if (!auth.ok) return auth.response;

  const { data: userData } = await auth.data.supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const result = await claimReferralForUser({
    userId: user.id,
    email: user.email,
    name:
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      user.email?.split("@")[0] ||
      null,
    createdAt: user.created_at,
    metadataCode:
      typeof user.user_metadata?.referral_code === "string"
        ? user.user_metadata.referral_code
        : null,
  });

  return NextResponse.json({ ok: true, claimed: result.claimed });
}
