import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { skillsFromCourseTitles } from "@/lib/data/job-skills";

/**
 * Directorio público de talento certificado.
 * SANITIZADO: nunca expone email, teléfono, CV ni pretensiones de renta.
 * Solo perfiles con is_searchable = TRUE.
 */
export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const limitRes = isRateLimited(ip, "talent-list", 30, 60 * 1000);
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiadas consultas." }, { status: 429 });
    }

    const sp = req.nextUrl.searchParams;
    const q = sp.get("q")?.slice(0, 80).trim();
    const skills = (sp.get("skills") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6);
    const remoteOnly = sp.get("remote") === "1";
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const perPage = Math.min(24, Number(sp.get("perPage")) || 12);

    const service = createServiceClient();
    let query = service
      .from("candidate_profiles")
      .select(
        `
        user_id, headline, city, country, remote_ok, availability, desired_role,
        skills, years_experience, updated_at,
        profiles!candidate_profiles_user_id_fkey (full_name)
      `,
        { count: "exact" }
      )
      .eq("is_searchable", true)
      .order("updated_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (remoteOnly) query = query.eq("remote_ok", true);
    for (const skill of skills) {
      query = query.contains("skills", [skill]);
    }

    const { data: candidates, error, count } = await query;
    if (error) {
      console.error("talent list error:", error);
      return NextResponse.json({ error: "Error al cargar el talento." }, { status: 500 });
    }

    // Filtro textual en JS (nombre + titular) tras el fetch por página
    let rows = (candidates ?? []).map((row: any) => ({
      user_id: row.user_id,
      full_name: row.profiles?.full_name ?? "Candidato ProgramBI",
      headline: row.headline,
      city: row.city,
      country: row.country,
      remote_ok: row.remote_ok,
      availability: row.availability,
      desired_role: row.desired_role,
      skills: row.skills ?? [],
      years_experience: row.years_experience,
    }));

    if (q) {
      const needle = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.full_name.toLowerCase().includes(needle) ||
          (r.headline ?? "").toLowerCase().includes(needle) ||
          (r.desired_role ?? "").toLowerCase().includes(needle)
      );
    }

    // Certificados verificados (para insignias) de los candidatos listados
    const ids = rows.map((r) => r.user_id);
    const certsByUser = new Map<string, string[]>();
    if (ids.length) {
      const { data: certs } = await service
        .from("certificates")
        .select("user_id, course_title")
        .in("user_id", ids);
      for (const c of certs ?? []) {
        if (!c.user_id || !c.course_title) continue;
        const list = certsByUser.get(c.user_id) ?? [];
        list.push(c.course_title);
        certsByUser.set(c.user_id, list);
      }
    }

    const talent = rows.map((r) => {
      const certificateTitles = certsByUser.get(r.user_id) ?? [];
      return {
        ...r,
        certificate_titles: certificateTitles,
        verified_skills: skillsFromCourseTitles(certificateTitles),
      };
    });

    return NextResponse.json({
      talent,
      total: count ?? talent.length,
      page,
      perPage,
    });
  } catch (err: any) {
    console.error("API Error in talent GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
