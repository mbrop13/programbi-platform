import { NextResponse } from "next/server";
import { getActiveSchedules } from "@/lib/supabase/comunidad-ai";

/**
 * GET /api/schedules
 * Returns all active course schedules. Public endpoint.
 */
export async function GET() {
  try {
    const schedules = await getActiveSchedules();
    return NextResponse.json(schedules);
  } catch (err: any) {
    console.error("Error fetching schedules:", err);
    return NextResponse.json({ error: "Error al obtener horarios" }, { status: 500 });
  }
}
