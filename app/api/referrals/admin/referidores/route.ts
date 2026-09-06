import { NextResponse } from "next/server";
import { requireReferralAdmin } from "@/lib/referrals/auth";
import { listAdminReferrers } from "@/lib/referrals/queries";

export async function GET() {
  const auth = await requireReferralAdmin();
  if (!auth.ok) return auth.response;
  const referrers = await listAdminReferrers();
  return NextResponse.json({ referrers });
}
