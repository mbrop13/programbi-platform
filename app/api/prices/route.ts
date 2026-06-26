import { NextResponse } from "next/server";
import { getPriceOverrides } from "@/lib/supabase/comunidad-ai";

export const revalidate = 3600;

export async function GET() {
  try {
    const overrides = await getPriceOverrides();
    return NextResponse.json(overrides);
  } catch (error: any) {
    console.error("Price overrides endpoint error:", error);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json({ error: isProd ? "Ocurrió un error inesperado." : error.message }, { status: 500 });
  }
}
