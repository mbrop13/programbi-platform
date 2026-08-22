import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireEmployer } from "@/lib/jobs/employer-guard";
import { generateUniqueSlug } from "@/lib/jobs/queries";
import { isValidSkill } from "@/lib/data/job-skills";

const jobCreateSchema = z.object({
  title: z.string().min(4).max(120),
  location_city: z.string().max(80).optional().nullable(),
  location_country: z.string().max(80).optional().nullable(),
  modality: z.enum(["remoto", "presencial", "hibrido"]),
  employment_type: z.enum(["full_time", "part_time", "contrato", "freelance", "practica"]),
  seniority: z.enum(["junior", "semi", "senior"]),
  description: z.string().min(50).max(20000),
  responsibilities: z.array(z.string().max(300)).max(12).optional(),
  requirements: z.array(z.string().max(300)).max(15).optional(),
  benefits: z.array(z.string().max(300)).max(12).optional(),
  skills: z.array(z.string().max(60)).max(12).optional(),
  salary_min_clp: z.number().int().min(0).max(100000000).optional().nullable(),
  salary_max_clp: z.number().int().min(0).max(100000000).optional().nullable(),
  salary_visible: z.boolean().optional(),
  apply_via: z.enum(["plataforma", "email", "url"]).optional(),
  apply_url: z.string().max(500).optional().nullable(),
  publish: z.boolean().optional(),
});

const cleanList = (list?: string[]) =>
  (list ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 15);

/** Vacantes de la empresa (todos los estados). */
export async function GET() {
  try {
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { company, supabase } = auth.data;

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("employer/jobs GET error:", error);
      return NextResponse.json({ error: "Error al cargar tus vacantes." }, { status: 500 });
    }

    return NextResponse.json({ jobs: data ?? [] });
  } catch (err: any) {
    console.error("API Error in employer/jobs GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

/** Crear vacante (borrador o publicada). */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { company, supabase } = auth.data;

    const body = await req.json();
    const validation = jobCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Revisa los datos de la vacante: " + validation.error.issues[0]?.message },
        { status: 400 }
      );
    }
    const d = validation.data;

    if (d.salary_min_clp && d.salary_max_clp && d.salary_min_clp > d.salary_max_clp) {
      return NextResponse.json(
        { error: "El salario mínimo no puede ser mayor al máximo." },
        { status: 400 }
      );
    }
    if (d.apply_via && d.apply_via !== "plataforma" && !d.apply_url) {
      return NextResponse.json(
        { error: "Indica el email o URL por donde recibir postulaciones." },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug("jobs", d.title);
    const publish = d.publish !== false;

    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        company_id: company.id,
        title: d.title.trim(),
        slug,
        location_city: d.location_city?.trim() || null,
        location_country: d.location_country?.trim() || "Chile",
        modality: d.modality,
        employment_type: d.employment_type,
        seniority: d.seniority,
        description: d.description.trim(),
        responsibilities: cleanList(d.responsibilities),
        requirements: cleanList(d.requirements),
        benefits: cleanList(d.benefits),
        skills: (d.skills ?? []).filter(isValidSkill),
        salary_min_clp: d.salary_min_clp ?? null,
        salary_max_clp: d.salary_max_clp ?? null,
        salary_visible: d.salary_visible ?? false,
        apply_via: d.apply_via ?? "plataforma",
        apply_url: d.apply_url || null,
        status: publish ? "published" : "draft",
        published_at: publish ? new Date().toISOString() : null,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("id, slug, status")
      .single();

    if (error || !job) {
      console.error("employer/jobs POST error:", error);
      return NextResponse.json({ error: "No pudimos crear la vacante." }, { status: 500 });
    }

    return NextResponse.json({ success: true, job });
  } catch (err: any) {
    console.error("API Error in employer/jobs POST:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
