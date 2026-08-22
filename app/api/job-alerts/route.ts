import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth-helpers";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { JOB_SKILL_IDS } from "@/lib/data/job-skills";

const MAX_ALERTS_PER_USER = 5;

const alertSchema = z.object({
  name: z.string().min(2).max(60),
  filters: z
    .object({
      q: z.string().max(120).optional(),
      skills: z.array(z.string().max(60)).max(8).optional(),
      modality: z.array(z.enum(["remoto", "presencial", "hibrido"])).max(3).optional(),
      seniority: z.array(z.enum(["junior", "semi", "senior"])).max(3).optional(),
    })
    .optional(),
});

/** Alertas del usuario. */
export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth.data;

    const { data, error } = await supabase
      .from("job_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Error al cargar tus alertas." }, { status: 500 });
    }
    return NextResponse.json({ alerts: data ?? [] });
  } catch (err: any) {
    console.error("API Error in job-alerts GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

/** Crear alerta (máximo 5 activas por usuario). */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const limitRes = isRateLimited(ip, "job-alerts", 10, 60 * 1000);
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiadas acciones seguidas." }, { status: 429 });
    }

    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth.data;

    const body = await req.json();
    const validation = alertSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos de la alerta inválidos." }, { status: 400 });
    }

    const { count } = await supabase
      .from("job_alerts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    if ((count ?? 0) >= MAX_ALERTS_PER_USER) {
      return NextResponse.json(
        { error: `Puedes tener un máximo de ${MAX_ALERTS_PER_USER} alertas. Elimina una para crear otra.` },
        { status: 400 }
      );
    }

    const filters = {
      q: validation.data.filters?.q?.trim() || "",
      skills: (validation.data.filters?.skills ?? []).filter((s) => JOB_SKILL_IDS.includes(s)),
      modality: validation.data.filters?.modality ?? [],
      seniority: validation.data.filters?.seniority ?? [],
    };

    const { data: alert, error } = await supabase
      .from("job_alerts")
      .insert({
        user_id: user.id,
        name: validation.data.name.trim(),
        filters,
      })
      .select("*")
      .single();

    if (error) {
      console.error("job-alerts POST error:", error);
      return NextResponse.json({ error: "No pudimos crear la alerta." }, { status: 500 });
    }
    return NextResponse.json({ success: true, alert });
  } catch (err: any) {
    console.error("API Error in job-alerts POST:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

/** Activar/desactivar o eliminar una alerta propia (?id=). */
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth.data;

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Falta el id de la alerta." }, { status: 400 });

    const { error } = await supabase
      .from("job_alerts")
      .update({ is_active: false })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      return NextResponse.json({ error: "No pudimos actualizar la alerta." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in job-alerts PATCH:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth.data;

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Falta el id de la alerta." }, { status: 400 });

    const { error } = await supabase
      .from("job_alerts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      return NextResponse.json({ error: "No pudimos eliminar la alerta." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in job-alerts DELETE:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
