import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase";
import { skillsFromCourseTitles } from "@/lib/data/job-skills";
import type { CandidateSnapshot, JobPublic } from "@/lib/jobs/types";

/** Selección estándar de vacantes públicas con datos de la empresa. */
export const JOB_PUBLIC_SELECT = `
  id, title, slug, company_id, location_city, location_country, modality,
  employment_type, seniority, description, responsibilities, requirements,
  benefits, skills, salary_min_clp, salary_max_clp, salary_visible,
  apply_via, apply_url, status, published_at, expires_at,
  featured, featured_until, views_count, applications_count,
  employer_companies!inner(name, slug, logo_url)
`;

type RawJobRow = Record<string, any>;

/** Normaliza una fila cruda (con join de empresa) al tipo JobPublic. */
export function mapJobRow(row: RawJobRow): JobPublic {
  const company = row.employer_companies ?? {};
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    company_id: row.company_id,
    company_name: company.name ?? "",
    company_slug: company.slug ?? "",
    company_logo_url: company.logo_url ?? null,
    location_city: row.location_city,
    location_country: row.location_country,
    modality: row.modality,
    employment_type: row.employment_type,
    seniority: row.seniority,
    description: row.description,
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    benefits: row.benefits ?? [],
    skills: row.skills ?? [],
    salary_min_clp: row.salary_min_clp,
    salary_max_clp: row.salary_max_clp,
    salary_visible: row.salary_visible,
    apply_via: row.apply_via,
    apply_url: row.apply_url,
    published_at: row.published_at,
    expires_at: row.expires_at,
    featured: !!row.featured && (!row.featured_until || new Date(row.featured_until) > new Date()),
    featured_until: row.featured_until,
    views_count: row.views_count ?? 0,
    applications_count: row.applications_count ?? 0,
    status: row.status,
  };
}

export interface JobFilters {
  q?: string;
  skills?: string[];
  modality?: string[];
  seniority?: string[];
  employment_type?: string[];
  company_id?: string;
  sort?: "recent" | "salary";
  page?: number;
  perPage?: number;
}

/** Lista de vacantes publicadas con filtros (cliente con RLS, lectura pública). */
export async function getPublishedJobs(filters: JobFilters = {}) {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.min(50, filters.perPage ?? 12);

  let query = supabase
    .from("jobs")
    .select(JOB_PUBLIC_SELECT, { count: "exact" })
    .eq("status", "published")
    .gt("expires_at", new Date().toISOString());

  if (filters.q) {
    query = query.or(`title.ilike.%${escapeIlike(filters.q)}%,description.ilike.%${escapeIlike(filters.q)}%`);
  }
  for (const skill of filters.skills ?? []) {
    query = query.contains("skills", [skill]);
  }
  if (filters.modality?.length) query = query.in("modality", filters.modality);
  if (filters.seniority?.length) query = query.in("seniority", filters.seniority);
  if (filters.employment_type?.length) query = query.in("employment_type", filters.employment_type);
  if (filters.company_id) query = query.eq("company_id", filters.company_id);

  if (filters.sort === "salary") {
    query = query
      .order("featured", { ascending: false })
      .order("salary_max_clp", { ascending: false, nullsFirst: false });
  } else {
    query = query
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false, nullsFirst: false });
  }

  const { data, error, count } = await query.range((page - 1) * perPage, page * perPage - 1);
  if (error) throw new Error(error.message);

  return {
    jobs: (data ?? []).map(mapJobRow),
    total: count ?? 0,
    page,
    perPage,
  };
}

/** Detalle de una vacante publicada por slug. */
export async function getPublishedJobBySlug(slug: string): Promise<JobPublic | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_PUBLIC_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error || !data) return null;
  return mapJobRow(data);
}

/** Incrementa el contador de vistas (service role, sin RLS). */
export async function incrementJobViews(jobId: string) {
  try {
    const service = createServiceClient();
    await service.rpc("increment_job_views", { p_job_id: jobId });
  } catch {
    // RPC puede no existir aún: fallback silencioso (el contador no es crítico)
  }
}

/** Vacantes similares: misma skill principal o misma empresa. */
export async function getSimilarJobs(job: JobPublic, limit = 3): Promise<JobPublic[]> {
  const supabase = await createClient();
  const primarySkill = job.skills[0];
  let query = supabase
    .from("jobs")
    .select(JOB_PUBLIC_SELECT)
    .eq("status", "published")
    .gt("expires_at", new Date().toISOString())
    .neq("id", job.id)
    .limit(limit);
  if (primarySkill) query = query.contains("skills", [primarySkill]);
  const { data } = await query;
  if (data && data.length >= limit) return data.map(mapJobRow);
  // Rellenar con vacantes de la misma empresa
  const { data: byCompany } = await supabase
    .from("jobs")
    .select(JOB_PUBLIC_SELECT)
    .eq("status", "published")
    .gt("expires_at", new Date().toISOString())
    .neq("id", job.id)
    .eq("company_id", job.company_id)
    .limit(limit);
  const seen = new Set((data ?? []).map((r: RawJobRow) => r.id));
  const merged = [...(data ?? []), ...(byCompany ?? []).filter((r: RawJobRow) => !seen.has(r.id))];
  return merged.slice(0, limit).map(mapJobRow);
}

/**
 * Construye el snapshot del candidato al momento de postular:
 * perfil + perfil laboral + certificados verificados.
 */
export async function buildCandidateSnapshot(userId: string): Promise<CandidateSnapshot> {
  const service = createServiceClient();

  const [profileRes, candidateRes, certsRes] = await Promise.all([
    service.from("profiles").select("full_name, email").eq("id", userId).maybeSingle(),
    service.from("candidate_profiles").select("*").eq("user_id", userId).maybeSingle(),
    service.from("certificates").select("course_title").eq("user_id", userId),
  ]);

  const profile = profileRes.data ?? { full_name: "", email: "" };
  const candidate = candidateRes.data ?? null;
  const certificateTitles = (certsRes.data ?? [])
    .map((c: RawJobRow) => c.course_title as string)
    .filter(Boolean);
  const verifiedSkills = skillsFromCourseTitles(certificateTitles);

  const profileSkills = (candidate?.skills as string[] | undefined) ?? [];

  return {
    full_name: profile.full_name ?? "",
    email: profile.email ?? "",
    headline: candidate?.headline ?? null,
    city: candidate?.city ?? null,
    years_experience: candidate?.years_experience ?? null,
    availability: candidate?.availability ?? null,
    desired_role: candidate?.desired_role ?? null,
    skills: Array.from(new Set([...profileSkills, ...verifiedSkills])),
    certificate_titles: certificateTitles,
    verified_skills: verifiedSkills,
    cv_filename: candidate?.cv_filename ?? null,
    has_cv: !!candidate?.cv_url,
  };
}

/** Inserta notificaciones in-app (service role). */
export async function notifyUsers(
  userIds: string[],
  payload: { type: string; title: string; message: string; link?: string }
) {
  if (!userIds.length) return;
  try {
    const service = createServiceClient();
    await service.from("notifications").insert(
      userIds.map((user_id) => ({
        user_id,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        link: payload.link ?? null,
      }))
    );
  } catch (err) {
    console.error("notifyUsers error:", err);
  }
}

/** Usuarios con membresía en una empresa (para notificar postulaciones). */
export async function getCompanyMemberIds(companyId: string): Promise<string[]> {
  try {
    const service = createServiceClient();
    const { data } = await service
      .from("employer_members")
      .select("user_id")
      .eq("company_id", companyId);
    return (data ?? []).map((r: RawJobRow) => r.user_id as string);
  } catch {
    return [];
  }
}

/** Rutas estáticas de /empleos que no pueden usarse como slug de vacante. */
const RESERVED_JOB_SLUGS = new Set(["para-empresas", "empresas", "talento"]);

/** Genera un slug único para una vacante o empresa. */
export async function generateUniqueSlug(
  table: "jobs" | "employer_companies",
  base: string
): Promise<string> {
  const service = createServiceClient();
  const slugify = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
      .slice(0, 60);

  const baseSlug = slugify(base) || `vacante-${Date.now()}`;
  for (let i = 0; i < 5; i++) {
    const candidate = i === 0 ? baseSlug : `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
    const available =
      table !== "jobs" || !RESERVED_JOB_SLUGS.has(candidate);
    if (available) {
      const { data } = await service.from(table).select("id").eq("slug", candidate).maybeSingle();
      if (!data) return candidate;
    }
  }
  return `${baseSlug}-${Date.now()}`;
}

function escapeIlike(text: string): string {
  return text.replace(/[%_,()]/g, " ").trim();
}
