import { NextResponse } from "next/server";
import { ensureReferrer, requireReferralUser } from "@/lib/referrals/auth";
import { computeStats, listReferralsForReferrer } from "@/lib/referrals/queries";

export async function GET() {
  const auth = await requireReferralUser();
  if (!auth.ok) return auth.response;

  const supabase = auth.data.supabase;
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone")
    .eq("id", auth.data.user.id)
    .maybeSingle();

  const referrer = await ensureReferrer({
    userId: auth.data.user.id,
    email: auth.data.user.email || profile?.email,
    name: profile?.full_name || auth.data.user.email?.split("@")[0],
    phone: profile?.phone,
  });

  const referrals = await listReferralsForReferrer(referrer.id);
  const stats = computeStats(referrals);

  return NextResponse.json({ referrer, stats, referrals });
}
