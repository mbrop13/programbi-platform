import { NextResponse } from "next/server";
import { requireReferralAdmin } from "@/lib/referrals/auth";
import { listAdminCommissions } from "@/lib/referrals/queries";

export async function GET() {
  const auth = await requireReferralAdmin();
  if (!auth.ok) return auth.response;
  const commissions = await listAdminCommissions();
  return NextResponse.json({ commissions });
}
