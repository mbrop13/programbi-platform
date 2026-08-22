import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth-helpers";
import { JOB_SKILL_IDS } from "@/lib/data/job-skills";

const profileSchema = z.object({
  headline: z.string().max(120).optional().nullable(),
  bio: z.string().max(4000).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  remote_ok: z.boolean().optional(),
  years_experience: z.number().int().min(0).max(50).optional().nullable(),
  availability: z.enum(["full_time", "part_time", "freelance"]).optional().nullable(),
  desired_role: z.string().max(120).optional().nullable(),
  skills: z.array(z.string().max(60)).max(20).optional(),
  linkedin_url: z.string().url().max(300).optional().nullable().or(z.literal("")),
  github_url: z.string().url().max(300).optional().nullable().or(z.literal("")),
  portfolio_url: z.string().url().max(300).optional().nullable().or(z.literal("")),
  cv_url: z.string().max(500).optional().nullable(),
  cv_filename: z.string().max(200).optional().nullable(),
  is_searchable: z.boolean().optional(),
  expected_salary_clp: z.number().int().min(0).max(100000000).optional().nullable(),
});

export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth.data;

    const { data } = await supabase
      .from("candidate_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({ profile: data ?? null });
  } catch (err: any) {
    console.error("API Error in candidate-profile GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth.data;

    const body = await req.json();
    const validation = profileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos del perfil inválidos." }, { status: 400 });
    }

    const d = validation.data;
    // Solo skills de la taxonomía oficial
    const skills = (d.skills ?? []).filter((s) => JOB_SKILL_IDS.includes(s));

    const payload: Record<string, any> = {
      headline: d.headline?.trim() || null,
      bio: d.bio?.trim() || null,
      city: d.city?.trim() || null,
      country: d.country?.trim() || "Chile",
      remote_ok: d.remote_ok ?? true,
      years_experience: d.years_experience ?? null,
      availability: d.availability ?? null,
      desired_role: d.desired_role?.trim() || null,
      skills,
      linkedin_url: d.linkedin_url || null,
      github_url: d.github_url || null,
      portfolio_url: d.portfolio_url || null,
      is_searchable: d.is_searchable ?? true,
      expected_salary_clp: d.expected_salary_clp ?? null,
    };
    // cv_url/cv_filename solo se actualizan si vienen en el payload
    if (d.cv_url !== undefined) payload.cv_url = d.cv_url || null;
    if (d.cv_filename !== undefined) payload.cv_filename = d.cv_filename || null;

    const { data: existing } = await supabase
      .from("candidate_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const { error } = existing
      ? await supabase.from("candidate_profiles").update(payload).eq("user_id", user.id)
      : await supabase.from("candidate_profiles").insert({ ...payload, user_id: user.id });

    if (error) {
      console.error("candidate-profile PUT error:", error);
      return NextResponse.json({ error: "No pudimos guardar tu perfil." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in candidate-profile PUT:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
