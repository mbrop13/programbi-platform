import { NextResponse } from "next/server";
import { getActivePromotions } from "@/lib/supabase/comunidad-ai";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const promotions = await getActivePromotions();
    return NextResponse.json(promotions);
  } catch (error: any) {
    console.error("Promotions endpoint error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
