import { NextResponse } from "next/server";
import { getPriceOverrides } from "@/lib/supabase/comunidad-ai";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const overrides = await getPriceOverrides();
    return NextResponse.json(overrides);
  } catch (error: any) {
    console.error("Price overrides endpoint error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
