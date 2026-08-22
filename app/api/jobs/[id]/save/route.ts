import { NextRequest, NextResponse } from "next/server";
import { requireUser, getClientIp } from "@/lib/auth-helpers";
import { isRateLimited } from "@/lib/security/rate-limiter";

/** Alterna una vacante en los guardados del usuario. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: jobId } = await params;
    const ip = getClientIp(req);
    const limitRes = isRateLimited(ip, "jobs-save", 30, 60 * 1000);
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiadas acciones seguidas." }, { status: 429 });
    }

    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth.data;

    const { data: existing } = await supabase
      .from("saved_jobs")
      .select("job_id")
      .eq("user_id", user.id)
      .eq("job_id", jobId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("user_id", user.id)
        .eq("job_id", jobId);
      if (error) return NextResponse.json({ error: "No pudimos actualizar tus guardados." }, { status: 500 });
      return NextResponse.json({ success: true, saved: false });
    }

    const { error } = await supabase
      .from("saved_jobs")
      .insert({ user_id: user.id, job_id: jobId });
    if (error) {
      // La vacante debe existir y estar publicada (FK + lectura)
      return NextResponse.json({ error: "No pudimos guardar esta vacante." }, { status: 500 });
    }
    return NextResponse.json({ success: true, saved: true });
  } catch (err: any) {
    console.error("API Error in jobs/save:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
