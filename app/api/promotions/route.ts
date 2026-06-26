import { NextResponse } from "next/server";
import { getActivePromotions } from "@/lib/supabase/comunidad-ai";

export const revalidate = 3600;

export async function GET() {
  try {
    const promotions = await getActivePromotions();
    return NextResponse.json(promotions);
  } catch (error: any) {
    console.error("Promotions endpoint error:", error);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json({ error: isProd ? "Ocurrió un error inesperado." : error.message }, { status: 500 });
  }
}
