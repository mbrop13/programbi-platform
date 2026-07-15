import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { courses } from "@/lib/data/courses";

const TEAMS = ["espana", "argentina"] as const;
const VALID_COURSE_SLUGS = new Set(courses.map((c) => c.slug));

const voteSchema = z.object({
  team: z.enum(TEAMS),
  courseSlug: z.string().min(1).max(100),
});

async function getStats() {
  const adminDb = createAdminClient();
  const { data, error } = await adminDb.rpc("get_match_prediction_stats");

  if (error) {
    // Fallback if RPC not yet deployed: aggregate manually
    const { data: rows, error: countError } = await adminDb
      .from("match_prediction_votes")
      .select("team");

    if (countError) {
      console.error("[match-prediction] stats error:", countError.message);
      return { espana: 0, argentina: 0, total: 0 };
    }

    const list = rows || [];
    const espana = list.filter((r) => r.team === "espana").length;
    const argentina = list.filter((r) => r.team === "argentina").length;
    return { espana, argentina, total: list.length };
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    espana: Number(row?.espana_count ?? 0),
    argentina: Number(row?.argentina_count ?? 0),
    total: Number(row?.total_count ?? 0),
  };
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const stats = await getStats();

    let userVote: {
      team: string;
      preferred_course_slug: string;
      preferred_course_title: string;
      created_at: string;
    } | null = null;

    if (user) {
      const { data } = await supabase
        .from("match_prediction_votes")
        .select("team, preferred_course_slug, preferred_course_title, created_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) userVote = data;
    }

    return NextResponse.json({
      authenticated: !!user,
      stats,
      userVote,
    });
  } catch (err) {
    console.error("[match-prediction] GET error:", err);
    return NextResponse.json(
      { error: "No se pudieron cargar las predicciones." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const limitRes = isRateLimited(ip, "match-prediction", 8, 60 * 1000);
    if (limitRes.limited) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera un momento e inténtalo de nuevo." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Debes iniciar sesión como miembro para participar.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = voteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos de predicción inválidos." },
        { status: 400 }
      );
    }

    const { team, courseSlug } = validation.data;

    if (!VALID_COURSE_SLUGS.has(courseSlug)) {
      return NextResponse.json(
        { error: "El curso seleccionado no es válido." },
        { status: 400 }
      );
    }

    const course = courses.find((c) => c.slug === courseSlug)!;

    // Un voto por miembro
    const { data: existing } = await supabase
      .from("match_prediction_votes")
      .select("id, team, preferred_course_slug, preferred_course_title, created_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error: "Ya registraste tu predicción. ¡Mucha suerte en el sorteo!",
          code: "ALREADY_VOTED",
          userVote: existing,
        },
        { status: 409 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("match_prediction_votes")
      .insert({
        user_id: user.id,
        team,
        preferred_course_slug: course.slug,
        preferred_course_title: course.title,
      })
      .select("team, preferred_course_slug, preferred_course_title, created_at")
      .single();

    if (insertError) {
      // Unique violation race
      if (insertError.code === "23505") {
        return NextResponse.json(
          {
            error: "Ya registraste tu predicción. ¡Mucha suerte en el sorteo!",
            code: "ALREADY_VOTED",
          },
          { status: 409 }
        );
      }
      console.error("[match-prediction] insert error:", insertError.message);
      return NextResponse.json(
        { error: "No se pudo guardar tu predicción. Inténtalo de nuevo." },
        { status: 500 }
      );
    }

    const stats = await getStats();

    return NextResponse.json({
      success: true,
      userVote: inserted,
      stats,
      message: "¡Predicción registrada! Si aciertas, entras al sorteo del curso.",
    });
  } catch (err) {
    console.error("[match-prediction] POST error:", err);
    return NextResponse.json(
      { error: "Error interno al registrar la predicción." },
      { status: 500 }
    );
  }
}
