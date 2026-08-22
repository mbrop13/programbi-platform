/**
 * Tipos compartidos de la Bolsa de Trabajo (API ↔ UI).
 */

export type CompanyStatus = "pending" | "approved" | "rejected";
export type JobStatus = "draft" | "published" | "paused" | "closed";
export type ApplicationStatus =
  | "sent"
  | "viewed"
  | "shortlisted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

export const APPLICATION_STATUS_FLOW: ApplicationStatus[] = [
  "sent",
  "viewed",
  "shortlisted",
  "interview",
  "offer",
  "hired",
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  sent: "Enviada",
  viewed: "Vista",
  shortlisted: "Preseleccionado",
  interview: "Entrevista",
  offer: "Oferta",
  hired: "Contratado",
  rejected: "Descartado",
  withdrawn: "Retirada",
};

export const MODALITY_LABELS: Record<string, string> = {
  remoto: "Remoto",
  presencial: "Presencial",
  hibrido: "Híbrido",
};

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "Jornada completa",
  part_time: "Jornada parcial",
  contrato: "Por proyecto",
  freelance: "Freelance",
  practica: "Práctica",
};

export const SENIORITY_LABELS: Record<string, string> = {
  junior: "Junior",
  semi: "Semi Senior",
  senior: "Senior",
};

export const COMPANY_SIZE_LABELS: Record<string, string> = {
  "1-10": "1-10 personas",
  "11-50": "11-50 personas",
  "51-200": "51-200 personas",
  "201-500": "201-500 personas",
  "500+": "500+ personas",
};

export const AVAILABILITY_LABELS: Record<string, string> = {
  full_time: "Jornada completa",
  part_time: "Jornada parcial",
  freelance: "Freelance",
};

export interface EmployerCompany {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  description: string | null;
  size: string | null;
  city: string | null;
  country: string | null;
  contact_email: string;
  contact_whatsapp: string | null;
  status: CompanyStatus;
  rejection_reason?: string | null;
  owner_user_id: string;
  created_at: string;
}

export interface JobPublic {
  id: string;
  title: string;
  slug: string;
  company_id: string;
  company_name: string;
  company_slug: string;
  company_logo_url: string | null;
  location_city: string | null;
  location_country: string | null;
  modality: string;
  employment_type: string;
  seniority: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  salary_min_clp: number | null;
  salary_max_clp: number | null;
  salary_visible: boolean;
  apply_via: string;
  apply_url: string | null;
  published_at: string | null;
  expires_at: string | null;
  featured?: boolean;
  featured_until?: string | null;
  views_count: number;
  applications_count: number;
  /** Solo presente al editar desde el panel de empresa */
  status?: JobStatus;
}

export interface CandidateProfile {
  user_id: string;
  headline: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  remote_ok: boolean;
  years_experience: number | null;
  availability: string | null;
  desired_role: string | null;
  skills: string[];
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  cv_url: string | null;
  cv_filename: string | null;
  is_searchable: boolean;
  expected_salary_clp: number | null;
}

export interface CandidateSnapshot {
  full_name: string;
  email: string;
  headline: string | null;
  city: string | null;
  years_experience: number | null;
  availability: string | null;
  desired_role: string | null;
  skills: string[];
  certificate_titles: string[];
  verified_skills: string[];
  cv_filename: string | null;
  has_cv: boolean;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  candidate_snapshot: CandidateSnapshot;
  recruiter_notes: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
  /** Joins opcionales según el contexto */
  job?: Pick<
    JobPublic,
    "id" | "title" | "slug" | "company_name" | "company_slug" | "company_logo_url" | "modality" | "location_city" | "salary_min_clp" | "salary_max_clp" | "salary_visible" | "employment_type"
  >;
}

/** Calcula el match (0-100) entre skills de una vacante y del candidato. */
export function matchScore(jobSkills: string[], userSkills: string[]): number {
  if (!jobSkills.length || !userSkills.length) return 0;
  const user = new Set(userSkills);
  const hits = jobSkills.filter((s) => user.has(s)).length;
  return Math.round((hits / jobSkills.length) * 100);
}

export function formatSalaryCLP(min?: number | null, max?: number | null): string | null {
  const fmt = (n: number) => new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(n);
  if (min && max) return `$${fmt(min)} – $${fmt(max)}`;
  if (min) return `Desde $${fmt(min)}`;
  if (max) return `Hasta $${fmt(max)}`;
  return null;
}

export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "hace un momento";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ayer";
  if (days < 30) return `hace ${days} días`;
  const months = Math.floor(days / 30);
  return `hace ${months} ${months === 1 ? "mes" : "meses"}`;
}

export function jobLocation(job: Pick<JobPublic, "location_city" | "location_country" | "modality">): string {
  if (job.modality === "remoto") return "Remoto";
  const city = job.location_city || "Chile";
  return job.modality === "hibrido" ? `${city} · Híbrido` : city;
}
