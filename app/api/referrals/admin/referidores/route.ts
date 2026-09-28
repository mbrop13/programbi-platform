import { NextResponse } from "next/server";
import { requireReferralAdmin } from "@/lib/referrals/auth";
import { listAdminReferrers, referralsSetupErrorMessage } from "@/lib/referrals/queries";

export async function GET() {
  const auth = await requireReferralAdmin();
  if (!auth.ok) return auth.response;
  try {
    const referrers = await listAdminReferrers();
    return NextResponse.json({ referrers });
  } catch (err) {
    console.error("admin referidores:", err);
    return NextResponse.json({ error: referralsSetupErrorMessage(err) }, { status: 500 });
  }
}
