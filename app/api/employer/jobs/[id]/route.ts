import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireEmployer } from "@/lib/jobs/employer-guard";
import { isValidSkill } from "@/lib/data/job-skills";

const jobUpdateSchema = z.object({
  title: z.string().min(4).max(120).optional(),
  location_city: z.string().max(80).optional().nullable(),
  location_country: z.string().max(80).optional().nullable(),
  modality: z.enum(["remoto", "presencial", "hibrido"]).optional(),
  employment_type: z.enum(["full_time", "part_time", "contrato", "freelance", "practica"]).optional(),
  seniority: z.enum(["junior", "semi", "senior"]).optional(),
  description: z.string().min(50).max(20000).optional(),
  responsibilities: z.array(z.string().max(300)).max(12).optional(),
  requirements: z.array(z.string().max(300)).max(15).optional(),
  benefits: z.array(z.string().max(300)).max(12).optional(),
  skills: z.array(z.string().max(60)).max(12).optional(),
  salary_min_clp: z.number().int().min(0).max(100000000).optional().nullable(),
  salary_max_clp: z.number().int().min(0).max(100000000).optional().nullable(),
  salary_visible: z.boolean().optional(),
  apply_via: z.enum(["plataforma", "email", "url"]).optional(),
  apply_url: z.string().max(500).optional().nullable(),
  action: z.enum(["publish", "pause", "close", "reopen", "extend"]).optional(),
});

const cleanList = (list?: string[]) =>
  (list ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 15);

/** Obtener una vacante propia por id (para editar). */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { company, supabase } = auth.data;

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .eq("company_id", company.id)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Vacante no encontrada." }, { status: 404 });
    }
    return NextResponse.json({ job: data });
  } catch (err: any) {
    console.error("API Error in employer/jobs/[id] GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

/** Actualizar campos, publicar, pausar, cerrar o reabrir una vacante propia. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { company, supabase } = auth.data;

    const { data: job } = await supabase
      .from("jobs")
      .select("id, status, applications_count")
      .eq("id", id)
      .eq("company_id", company.id)
      .maybeSingle();
    if (!job) {
      return NextResponse.json({ error: "Vacante no encontrada." }, { status: 404 });
    }

    const body = await req.json();
    const validation = jobUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos: " + validation.error.issues[0]?.message },
        { status: 400 }
      );
    }
    const d = validation.data;

    const payload: Record<string, any> = {};
    if (d.title !== undefined) payload.title = d.title.trim();
    if (d.location_city !== undefined) payload.location_city = d.location_city?.trim() || null;
    if (d.location_country !== undefined) payload.location_country = d.location_country?.trim() || "Chile";
    if (d.modality !== undefined) payload.modality = d.modality;
    if (d.employment_type !== undefined) payload.employment_type = d.employment_type;
    if (d.seniority !== undefined) payload.seniority = d.seniority;
    if (d.description !== undefined) payload.description = d.description.trim();
    if (d.responsibilities !== undefined) payload.responsibilities = cleanList(d.responsibilities);
    if (d.requirements !== undefined) payload.requirements = cleanList(d.requirements);
    if (d.benefits !== undefined) payload.benefits = cleanList(d.benefits);
    if (d.skills !== undefined) payload.skills = d.skills.filter(isValidSkill);
    if (d.salary_min_clp !== undefined) payload.salary_min_clp = d.salary_min_clp ?? null;
    if (d.salary_max_clp !== undefined) payload.salary_max_clp = d.salary_max_clp ?? null;
    if (d.salary_visible !== undefined) payload.salary_visible = d.salary_visible;
    if (d.apply_via !== undefined) payload.apply_via = d.apply_via;
    if (d.apply_url !== undefined) payload.apply_url = d.apply_url || null;

    // Acciones de estado
    if (d.action === "publish") {
      payload.status = "published";
      if (!job.status || job.status === "draft" || job.status === "closed") {
        payload.published_at = new Date().toISOString();
        payload.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        payload.expiry_notified_at = null;
      }
    } else if (d.action === "pause") {
      payload.status = "paused";
    } else if (d.action === "close") {
      payload.status = "closed";
      payload.expires_at = new Date().toISOString();
    } else if (d.action === "reopen") {
      payload.status = "published";
      payload.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      payload.expiry_notified_at = null;
    } else if (d.action === "extend") {
      // Extender vigencia 30 días desde hoy (mantiene el estado actual)
      payload.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      payload.expiry_notified_at = null;
    }

    if (!Object.keys(payload).length) {
      return NextResponse.json({ error: "Nada que actualizar." }, { status: 400 });
    }

    const { error } = await supabase.from("jobs").update(payload).eq("id", id);
    if (error) {
      console.error("employer/jobs PATCH error:", error);
      return NextResponse.json({ error: "No pudimos actualizar la vacante." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in employer/jobs/[id] PATCH:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

/** Eliminar una vacante (solo si no tiene postulaciones). */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { company, supabase } = auth.data;

    const { data: job } = await supabase
      .from("jobs")
      .select("id, applications_count")
      .eq("id", id)
      .eq("company_id", company.id)
      .maybeSingle();
    if (!job) {
      return NextResponse.json({ error: "Vacante no encontrada." }, { status: 404 });
    }
    if ((job.applications_count ?? 0) > 0) {
      return NextResponse.json(
        { error: "No puedes eliminar una vacante con postulaciones. Ciérrala en su lugar." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: "No pudimos eliminar la vacante." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in employer/jobs/[id] DELETE:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
