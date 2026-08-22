"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  Check,
  Clock,
  Eye,
  Loader2,
  Pencil,
  Pause,
  Play,
  Plus,
  Star,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { EmployerCompany } from "@/lib/jobs/types";
import { COMPANY_SIZE_LABELS } from "@/lib/jobs/types";
import { FEATURED_PLANS, formatFeaturedPrice } from "@/lib/jobs/pricing";
import JobWizard, { type JobFormData } from "./JobWizard";
import ApplicationsPipeline from "./ApplicationsPipeline";

const inputClass =
  "h-10 w-full rounded-lg border border-border-strong bg-bg px-3 text-sm text-text placeholder:text-text-muted";

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  draft: { label: "Borrador", class: "bg-surface-hover text-text-secondary" },
  published: { label: "Publicada", class: "bg-accent-soft text-text" },
  paused: { label: "Pausada", class: "bg-surface-hover text-text-secondary" },
  closed: { label: "Cerrada", class: "bg-surface-hover text-text-muted" },
};

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  full_name: string | null;
  email: string | null;
}

interface EmployerJob {
  id: string;
  title: string;
  status: string;
  featured?: boolean;
  featured_until?: string | null;
  expires_at?: string | null;
  views_count?: number;
  applications_count?: number;
}

function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

export default function EmployerDashboard() {
  const [checking, setChecking] = useState(true);
  const [company, setCompany] = useState<EmployerCompany | null>(null);
  const [section, setSection] = useState<"vacantes" | "postulantes" | "empresa">("vacantes");

  // Vacantes
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<JobFormData> & { id?: string } | null>(null);

  // Perfil empresa
  const [profileForm, setProfileForm] = useState({
    name: "",
    website: "",
    industry: "",
    size: "",
    city: "",
    description: "",
    contact_email: "",
    contact_whatsapp: "",
    logo_url: null as string | null,
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  // Equipo
  const [myRole, setMyRole] = useState<string>("recruiter");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteOk, setInviteOk] = useState(false);

  const loadTeam = useCallback(async () => {
    try {
      const data = await fetch("/api/employer/members").then((r) => r.json());
      setTeam(data.members ?? []);
    } catch {
      /* noop */
    }
  }, []);

  const inviteMember = async () => {
    setInviteBusy(true);
    setInviteError(null);
    setInviteOk(false);
    try {
      const res = await fetch("/api/employer/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteError(data.error ?? "No pudimos invitar al reclutador.");
        return;
      }
      setInviteEmail("");
      setInviteOk(true);
      await loadTeam();
    } catch {
      setInviteError("Error de conexión. Intenta de nuevo.");
    } finally {
      setInviteBusy(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm("¿Quitar a este reclutador de la empresa?")) return;
    await fetch(`/api/employer/members?id=${memberId}`, { method: "DELETE" });
    await loadTeam();
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/employer/verify");
        const data = await res.json();
        if (data.membership?.company) {
          const c = data.membership.company as EmployerCompany;
          setCompany(c);
          setMyRole(data.membership.role ?? "recruiter");
          setProfileForm({
            name: c.name ?? "",
            website: c.website ?? "",
            industry: c.industry ?? "",
            size: c.size ?? "",
            city: c.city ?? "",
            description: c.description ?? "",
            contact_email: c.contact_email ?? "",
            contact_whatsapp: c.contact_whatsapp ?? "",
            logo_url: c.logo_url,
          });
        }
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const loadJobs = async () => {
    setJobsLoading(true);
    setJobsError(false);
    try {
      const r = await fetch("/api/employer/jobs");
      if (!r.ok) throw new Error("http");
      const data = await r.json();
      setJobs(data.jobs ?? []);
    } catch {
      setJobsError(true);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    if (company?.status === "approved") {
      loadJobs();
      loadTeam();
    }
  }, [company?.status, loadTeam]);

  const jobAction = async (jobId: string, action: string) => {
    if (action === "delete" && !confirm("¿Eliminar esta vacante? Esta acción no se puede deshacer.")) return;
    try {
      const res = await fetch("/api/employer/jobs/" + jobId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("http");
      await loadJobs();
    } catch {
      alert("No pudimos aplicar la acción. Inténtalo de nuevo.");
    }
  };

  // ── Destacar vacante (pago por Flow) ──
  const [featureJob, setFeatureJob] = useState<{ id: string; title: string } | null>(null);
  const [featureLoadingDays, setFeatureLoadingDays] = useState<number | null>(null);
  const [featureError, setFeatureError] = useState<string | null>(null);

  const startFeature = async (days: number) => {
    if (!featureJob) return;
    setFeatureLoadingDays(days);
    setFeatureError(null);
    try {
      const res = await fetch("/api/employer/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: featureJob.id, days }),
      });
      const data = await res.json();
      if (!res.ok || !data.paymentUrl) {
        setFeatureError(data.error ?? "No pudimos iniciar el pago.");
        return;
      }
      window.location.href = data.paymentUrl;
    } catch {
      setFeatureError("Error de conexión con Flow.");
    } finally {
      setFeatureLoadingDays(null);
    }
  };

  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileError(null);
    try {
      const res = await fetch("/api/employer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name || undefined,
          website: profileForm.website || null,
          industry: profileForm.industry || null,
          size: profileForm.size || null,
          city: profileForm.city || null,
          description: profileForm.description || null,
          contact_email: profileForm.contact_email || undefined,
          contact_whatsapp: profileForm.contact_whatsapp || null,
          logo_url: profileForm.logo_url,
        }),
      });
      if (res.ok) {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      } else {
        setProfileError("No pudimos guardar los cambios. Inténtalo de nuevo.");
      }
    } catch {
      setProfileError("Error de conexión. Intenta de nuevo.");
    } finally {
      setProfileSaving(false);
    }
  };

  const uploadLogo = async (file: File) => {
    if (!company || !["image/png", "image/jpeg", "image/svg+xml", "image/webp"].includes(file.type)) return;
    try {
      const supabase = createClient();
      const path = `${company.id}/${Date.now()}-${file.name.replace(/[^\w\s.-]/g, "").trim()}`;
      const { error } = await supabase.storage.from("company-logos").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("company-logos").getPublicUrl(path);
      setProfileForm((f) => ({ ...f, logo_url: data.publicUrl }));
    } catch (e) {
      alert("No pudimos subir el logo: " + (e instanceof Error ? e.message : ""));
    }
  };

  const openEditJob = async (jobId: string) => {
    const data = await fetch(`/api/employer/jobs/${jobId}`).then((r) => r.json());
    if (data.job) {
      const j = data.job;
      setEditingJob({
        id: j.id,
        title: j.title,
        location_city: j.location_city ?? "",
        modality: j.modality,
        employment_type: j.employment_type,
        seniority: j.seniority,
        description: j.description,
        responsibilities: (j.responsibilities ?? []).join("\n"),
        requirements: (j.requirements ?? []).join("\n"),
        benefits: (j.benefits ?? []).join("\n"),
        skills: j.skills ?? [],
        salary_min: j.salary_min_clp?.toString() ?? "",
        salary_max: j.salary_max_clp?.toString() ?? "",
        salary_visible: j.salary_visible,
        apply_via: j.apply_via,
        apply_url: j.apply_url ?? "",
      });
      setWizardOpen(true);
    }
  };

  if (checking) {
    return (
      <div className="mx-auto max-w-5xl space-y-6" aria-hidden="true">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
        <div className="h-11 animate-pulse rounded-full bg-surface-hover" />
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-10 text-center">
        <Building2 size={24} className="mx-auto text-text-muted" />
        <h3 className="mt-4 font-display text-lg font-bold text-text">
          ¿Representas a una empresa?
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          Regístrala para publicar vacantes ante la comunidad de datos de ProgramBI.
          Aprobamos cada empresa en menos de 24 horas hábiles.
        </p>
        <Link
          href="/empleos/para-empresas"
          className="mt-5 inline-flex h-10 items-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground"
        >
          Registrar mi empresa
        </Link>
      </div>
    );
  }

  if (company.status === "pending") {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-10 text-center">
        <Clock size={24} className="mx-auto text-text-muted" />
        <h3 className="mt-4 font-display text-lg font-bold text-text">
          «{company.name}» está en revisión
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          Nuestro equipo está verificando tu empresa. Te notificaremos por correo
          cuando esté aprobada para publicar vacantes.
        </p>
      </div>
    );
  }

  if (company.status === "rejected") {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-10 text-center">
        <h3 className="font-display text-lg font-bold text-text">Registro rechazado</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          {company.rejection_reason
            ? `Motivo: ${company.rejection_reason}`
            : "Tu solicitud no fue aprobada."}{" "}
          Escríbenos a contacto@programbi.cl si crees que es un error.
        </p>
      </div>
    );
  }

  const totalApplications = jobs.reduce((sum, j) => sum + (j.applications_count ?? 0), 0);
  const totalViews = jobs.reduce((sum, j) => sum + (j.views_count ?? 0), 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Briefcase, label: "Vacantes publicadas", value: jobs.filter((j) => j.status === "published").length },
          { icon: Users, label: "Postulaciones", value: totalApplications },
          { icon: Eye, label: "Vistas totales", value: totalViews },
          { icon: Building2, label: "Empresa", value: "Verificada" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-4">
            <stat.icon size={16} className="text-text-muted" />
            <p className="mt-2 font-display text-xl font-bold text-text">{stat.value}</p>
            <p className="text-[11px] text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sub-nav */}
      <div className="flex gap-1.5 rounded-full bg-surface-hover p-1" role="tablist" aria-label="Secciones del panel de empresa">
        {[
          { id: "vacantes", label: "Vacantes" },
          { id: "postulantes", label: "Postulaciones" },
          { id: "empresa", label: "Mi empresa" },
        ].map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={section === tab.id}
            onClick={() => setSection(tab.id as "vacantes" | "postulantes" | "empresa")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
              section === tab.id ? "bg-surface text-text shadow-sm" : "text-text-secondary hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {section === "vacantes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-text">Mis vacantes</h3>
            <button
              onClick={() => {
                setEditingJob(null);
                setWizardOpen(true);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground"
            >
              <Plus size={15} />
              Nueva vacante
            </button>
          </div>

          {jobsLoading ? (
            <div className="space-y-2.5" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-surface" />
              ))}
            </div>
          ) : jobsError ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <p className="text-sm text-text-secondary">No pudimos cargar tus vacantes.</p>
              <button
                onClick={loadJobs}
                className="mt-3 inline-flex h-9 items-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground"
              >
                Reintentar
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-sm text-text-secondary">
                Publica tu primera vacante y llega a cientos de analistas certificados.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold text-text">{job.title}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_BADGE[job.status]?.class ?? ""}`}>
                          {STATUS_BADGE[job.status]?.label ?? job.status}
                        </span>
                        {job.featured && job.featured_until && new Date(job.featured_until) > new Date() && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                            <Star size={10} className="fill-current" />
                            Destacada hasta {new Date(job.featured_until).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 flex items-center gap-3 text-[11px] text-text-muted">
                        <span className="inline-flex items-center gap-1"><Eye size={11} />{job.views_count ?? 0} vistas</span>
                        <span className="inline-flex items-center gap-1"><Users size={11} />{job.applications_count ?? 0} postulaciones</span>
                        {job.status === "published" && (() => {
                          const days = daysUntil(job.expires_at);
                          if (days === null) return null;
                          if (days <= 0) return (
                            <span className="inline-flex items-center gap-1 font-semibold text-red-500">
                              <AlertTriangle size={11} /> Expirada (extiéndela)
                            </span>
                          );
                          if (days <= 7) return (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                              <Clock size={11} /> Expira en {days} {days === 1 ? "día" : "días"}
                            </span>
                          );
                          return <span>Expira en {days} días</span>;
                        })()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button onClick={() => openEditJob(job.id)} className="inline-flex h-8 items-center gap-1 rounded-full border border-border-strong px-3 text-xs font-medium text-text hover:bg-surface-hover">
                        <Pencil size={11} /> Editar
                      </button>
                      {job.status === "published" && (
                        <button onClick={() => jobAction(job.id, "pause")} className="inline-flex h-8 items-center gap-1 rounded-full border border-border-strong px-3 text-xs font-medium text-text hover:bg-surface-hover">
                          <Pause size={11} /> Pausar
                        </button>
                      )}
                      {(job.status === "published" || job.status === "paused") && (
                        <button onClick={() => jobAction(job.id, "extend")} title="Extender vigencia 30 días" className="inline-flex h-8 items-center gap-1 rounded-full border border-border-strong px-3 text-xs font-medium text-text hover:bg-surface-hover">
                          <Clock size={11} /> Extender 30d
                        </button>
                      )}
                      {job.status === "published" && (
                        <button
                          onClick={() => setFeatureJob({ id: job.id, title: job.title })}
                          className="inline-flex h-8 items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400 dark:hover:bg-amber-900"
                        >
                          <Star size={11} /> {job.featured ? "Extender destacado" : "Destacar"}
                        </button>
                      )}
                      {(job.status === "paused" || job.status === "draft" || job.status === "closed") && (
                        <button onClick={() => jobAction(job.id, "publish")} className="inline-flex h-8 items-center gap-1 rounded-full border border-border-strong px-3 text-xs font-medium text-text hover:bg-surface-hover">
                          <Play size={11} /> {job.status === "paused" ? "Reactivar" : "Publicar"}
                        </button>
                      )}
                      {job.status !== "closed" && (
                        <button onClick={() => jobAction(job.id, "close")} className="inline-flex h-8 items-center rounded-full border border-border-strong px-3 text-xs font-medium text-text-secondary hover:text-text">
                          Cerrar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section === "postulantes" && <ApplicationsPipeline />}

      {section === "empresa" && (
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <h3 className="font-display text-lg font-bold text-text">Perfil de empresa</h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4">
                {profileForm.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profileForm.logo_url} alt="Logo" className="h-14 w-14 rounded-xl border border-border object-contain" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface-hover text-text-muted">
                    <Building2 size={20} />
                  </div>
                )}
                <button
                  onClick={() => logoRef.current?.click()}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-border-strong px-4 text-xs font-semibold text-text hover:bg-surface-hover"
                >
                  <Upload size={12} />
                  {profileForm.logo_url ? "Cambiar logo" : "Subir logo"}
                </button>
                <input
                  ref={logoRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="ed-name" className="text-xs font-semibold text-text-secondary">Nombre</label>
                  <input id="ed-name" className={`${inputClass} mt-1.5`} value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="ed-website" className="text-xs font-semibold text-text-secondary">Sitio web</label>
                  <input id="ed-website" type="url" inputMode="url" className={`${inputClass} mt-1.5`} placeholder="https://…" value={profileForm.website} onChange={(e) => setProfileForm((f) => ({ ...f, website: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="ed-industry" className="text-xs font-semibold text-text-secondary">Industria</label>
                  <input id="ed-industry" className={`${inputClass} mt-1.5`} value={profileForm.industry} onChange={(e) => setProfileForm((f) => ({ ...f, industry: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="ed-size" className="text-xs font-semibold text-text-secondary">Tamaño</label>
                  <select id="ed-size" className={`${inputClass} mt-1.5`} value={profileForm.size} onChange={(e) => setProfileForm((f) => ({ ...f, size: e.target.value }))}>
                    <option value="">Seleccionar</option>
                    {Object.entries(COMPANY_SIZE_LABELS).map(([id, label]) => (
                      <option key={id} value={id}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="ed-city" className="text-xs font-semibold text-text-secondary">Ciudad</label>
                  <input id="ed-city" className={`${inputClass} mt-1.5`} value={profileForm.city} onChange={(e) => setProfileForm((f) => ({ ...f, city: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="ed-email" className="text-xs font-semibold text-text-secondary">Email de contacto</label>
                  <input id="ed-email" type="email" inputMode="email" className={`${inputClass} mt-1.5`} value={profileForm.contact_email} onChange={(e) => setProfileForm((f) => ({ ...f, contact_email: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="ed-whatsapp" className="text-xs font-semibold text-text-secondary">WhatsApp</label>
                  <input id="ed-whatsapp" type="tel" inputMode="tel" className={`${inputClass} mt-1.5`} value={profileForm.contact_whatsapp} onChange={(e) => setProfileForm((f) => ({ ...f, contact_whatsapp: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ed-description" className="text-xs font-semibold text-text-secondary">Descripción</label>
                  <textarea id="ed-description" rows={4} className="mt-1.5 w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-muted" value={profileForm.description} onChange={(e) => setProfileForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={saveProfile}
                  disabled={profileSaving}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground disabled:opacity-60"
                >
                  {profileSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {profileSaving ? "Guardando…" : "Guardar cambios"}
                </button>
                {profileSaved && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16a34a]" role="status">
                    <Check size={13} />
                    Guardado
                  </span>
                )}
                {profileError && <p className="text-xs font-medium text-red-500">{profileError}</p>}
              </div>
            </div>
          </div>

          {/* Equipo */}
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
            <h3 className="font-display text-lg font-bold text-text">Equipo reclutador</h3>
            <p className="mt-1 text-xs text-text-secondary">
              Las personas de tu equipo pueden crear vacantes y gestionar postulaciones.
            </p>

            <div className="mt-4 space-y-2">
              {team.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">
                      {m.full_name ?? m.email}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {m.email} · {m.role === "owner" ? "Dueño" : "Reclutador"}
                    </p>
                  </div>
                  {myRole === "owner" && m.role !== "owner" && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-text-muted hover:text-text"
                      aria-label="Quitar del equipo"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {myRole === "owner" && (
              <div className="mt-4 border-t border-border pt-4">
                <label htmlFor="ed-invite" className="text-xs font-semibold text-text-secondary">
                  Invitar reclutador por email
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    id="ed-invite"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="reclutador@tuempresa.cl"
                    className={inputClass}
                  />
                  <button
                    onClick={inviteMember}
                    disabled={inviteBusy || !inviteEmail.includes("@")}
                    className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                  >
                    {inviteBusy ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    Invitar
                  </button>
                </div>
                {inviteError && <p className="mt-2 text-xs text-red-500">{inviteError}</p>}
                {inviteOk && (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#16a34a]" role="status">
                    <Check size={12} />
                    Reclutador agregado
                  </p>
                )}
              </div>
            )}
          </div>
          <p className="text-center text-[11px] text-text-muted">
            ¿Datos de la empresa que no puedes editar? Escríbenos a contacto@programbi.cl
          </p>
        </div>
      )}

      {wizardOpen && (
        <JobWizard
          initial={editingJob}
          onClose={() => {
            setWizardOpen(false);
            setEditingJob(null);
          }}
          onSaved={loadJobs}
        />
      )}

      {/* Modal: planes de vacante destacada (pago Flow) */}
      {featureJob && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="font-display text-base font-bold text-text">Destacar vacante</h3>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-text-muted">{featureJob.title}</p>
              </div>
              <button
                onClick={() => {
                  setFeatureJob(null);
                  setFeatureError(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2.5 p-5">
              <p className="text-xs text-text-secondary">
                Las vacantes destacadas aparecen arriba del listado con etiqueta «Destacada»
                y reciben mayor visibilidad. Pago único por Flow.
              </p>
              {FEATURED_PLANS.map((plan) => (
                <button
                  key={plan.days}
                  onClick={() => startFeature(plan.days)}
                  disabled={featureLoadingDays !== null}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-bg px-4 py-3.5 text-left transition-colors hover:border-border-strong disabled:opacity-60"
                >
                  <div>
                    <p className="text-sm font-bold text-text">{plan.label} de destacado</p>
                    <p className="text-[11px] text-text-muted">Aparece primera en /empleos</p>
                  </div>
                  <span className="inline-flex items-center gap-2">
                    <span className="font-display text-base font-bold text-text">
                      ${formatFeaturedPrice(plan.amount_clp)}
                    </span>
                    {featureLoadingDays === plan.days ? (
                      <Loader2 size={15} className="animate-spin text-text-muted" />
                    ) : (
                      <Star size={15} className="text-amber-500" />
                    )}
                  </span>
                </button>
              ))}
              {featureError && <p className="text-xs font-medium text-red-500">{featureError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
