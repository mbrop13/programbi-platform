import { NextResponse } from "next/server";
import { requireReferralAdmin } from "@/lib/referrals/auth";
import { listAdminReferrals, listLeadHints } from "@/lib/referrals/queries";

export async function GET(req: Request) {
  const auth = await requireReferralAdmin();
  if (!auth.ok) return auth.response;
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  const referrals = await listAdminReferrals(status);
  const hints = await listLeadHints();
  return NextResponse.json({ referrals, hints });
}
