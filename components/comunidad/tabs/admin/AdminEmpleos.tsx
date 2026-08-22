"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Briefcase,
  Building2,
  Check,
  Clock,
  Eye,
  Loader2,
  Pause,
  Play,
  Search,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { APPLICATION_STATUS_LABELS, timeAgo } from "@/lib/jobs/types";

interface AdminCompany {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  industry: string | null;
  city: string | null;
  contact_email: string;
  contact_whatsapp: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  description: string | null;
  owner?: { full_name: string | null; email: string } | null;
  stats?: { jobs: number; published: number; applications: number };
}

const STATUS_FILTERS = [
  { id: "pending", label: "Pendientes" },
  { id: "approved", label: "Aprobadas" },
  { id: "rejected", label: "Rechazadas" },
  { id: "all", label: "Todas" },
];

const JOB_STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  pending_review: "En revisión",
  published: "Publicada",
  paused: "Pausada",
  closed: "Cerrada",
};

interface AdminJob {
  id: string;
  title: string;
  status: string;
  views_count?: number;
  applications_count?: number;
  published_at?: string | null;
  employer_companies?: { name?: string } | null;
}

interface AdminMetrics {
  totalCompanies?: number;
  pendingCompanies?: number;
  publishedJobs?: number;
  totalApplications?: number;
  revenueTotal?: number;
  revenueThisMonth?: number;
  paidFeatureOrders?: number;
  activeFeatured?: number;
  totalContactRequests?: number;
  topSkills?: Array<{ skill: string; label: string; count: number }>;
  funnel?: Record<string, number>;
}

interface FeatureOrder {
  id: string;
  job_title: string;
  company_name: string;
  days: number;
  amount_clp: number;
  status: string;
  created_at: string;
}

interface ContactRequest {
  id: string;
  candidate_name: string;
  company_name: string;
  job_context: string | null;
  message: string | null;
  created_at: string;
}

export default function AdminEmpleos() {
  const [view, setView] = useState<"empresas" | "vacantes" | "destacados">("empresas");

  // Empresas
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companiesError, setCompaniesError] = useState(false);
  const [companyFilter, setCompanyFilter] = useState("pending");
  const [actionBusy, setActionBusy] = useState<string | null>(null);

  // Vacantes
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [featureOrders, setFeatureOrders] = useState<FeatureOrder[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState(false);
  const [jobQuery, setJobQuery] = useState("");

  const loadCompanies = useCallback(async (status: string) => {
    setLoadingCompanies(true);
    setCompaniesError(false);
    try {
      const r = await fetch(`/api/admin/employers?status=${status}`);
      if (!r.ok) throw new Error("http");
      const data = await r.json();
      setCompanies(data.companies ?? []);
    } catch {
      setCompaniesError(true);
    } finally {
      setLoadingCompanies(false);
    }
  }, []);

  const loadJobs = useCallback(async (q?: string) => {
    setLoadingJobs(true);
    setJobsError(false);
    try {
      const r = await fetch(`/api/admin/jobs${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      if (!r.ok) throw new Error("http");
      const data = await r.json();
      setJobs(data.jobs ?? []);
      setMetrics(data.metrics ?? null);
      setFeatureOrders(data.featureOrders ?? []);
      setContactRequests(data.contactRequests ?? []);
    } catch {
      setJobsError(true);
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies(companyFilter);
  }, [companyFilter, loadCompanies]);

  useEffect(() => {
    if (view === "vacantes" || view === "destacados") loadJobs();
  }, [view, loadJobs]);

  const decide = async (companyId: string, action: "approve" | "reject") => {
    let reason: string | undefined;
    if (action === "reject") {
      reason = prompt("Motivo del rechazo (visible para la empresa):") ?? undefined;
      if (reason === undefined) return;
    }
    setActionBusy(companyId);
    try {
      const res = await fetch(`/api/admin/employers/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      if (!res.ok) throw new Error("http");
      await loadCompanies(companyFilter);
    } catch {
      alert("No pudimos aplicar la decisión. Inténtalo de nuevo.");
    } finally {
      setActionBusy(null);
    }
  };

  const jobAction = async (jobId: string, action: string) => {
    if (action === "delete" && !confirm("¿Eliminar la vacante definitivamente?")) return;
    const method = action === "delete" ? "DELETE" : "PATCH";
    try {
      const res = await fetch("/api/admin/jobs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, action }),
      });
      if (!res.ok) throw new Error("http");
      await loadJobs(jobQuery || undefined);
    } catch {
      alert("No pudimos aplicar la acción. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Bolsa de Trabajo</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Aprobación de empresas, moderación de vacantes y métricas.
          </p>
        </div>
        <div className="flex gap-1 rounded-full bg-neutral-100 dark:bg-neutral-900 p-1">
          {[
            { id: "empresas", label: "Empresas", icon: Building2 },
            { id: "vacantes", label: "Vacantes y métricas", icon: BarChart3 },
            { id: "destacados", label: "Destacados e ingresos", icon: Star },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id as "empresas" | "vacantes" | "destacados")}
              aria-pressed={view === v.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                view === v.id
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <v.icon size={13} />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === "empresas" && (
        <>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setCompanyFilter(f.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  companyFilter === f.id
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loadingCompanies ? (
            <div className="space-y-3" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl border border-neutral-200 dark:border-neutral-800" />
              ))}
            </div>
          ) : companiesError ? (
            <div className="rounded-xl border border-neutral-200 p-8 text-center dark:border-neutral-800">
              <p className="text-sm text-neutral-500">No pudimos cargar las empresas.</p>
              <button
                onClick={() => loadCompanies(companyFilter)}
                className="mt-3 inline-flex h-9 items-center rounded-full bg-neutral-900 px-5 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900"
              >
                Reintentar
              </button>
            </div>
          ) : companies.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">
              No hay empresas en esta categoría.
            </p>
          ) : (
            <div className="space-y-3">
              {companies.map((c) => (
                <div key={c.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-neutral-900 dark:text-white">{c.name}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            c.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              : c.status === "pending"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                          }`}
                        >
                          {c.status === "approved" ? "Aprobada" : c.status === "pending" ? "Pendiente" : "Rechazada"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {c.owner?.full_name ?? c.owner?.email ?? c.contact_email} · {c.contact_email}
                        {c.city ? ` · ${c.city}` : ""}
                        {c.industry ? ` · ${c.industry}` : ""}
                      </p>
                      {c.description && (
                        <p className="mt-2 line-clamp-2 max-w-xl text-xs text-neutral-600 dark:text-neutral-300">
                          {c.description}
                        </p>
                      )}
                      {c.rejection_reason && (
                        <p className="mt-1 text-xs text-red-500">Motivo rechazo: {c.rejection_reason}</p>
                      )}
                      <p className="mt-2 flex items-center gap-3 text-[11px] text-neutral-400">
                        <span className="inline-flex items-center gap-1"><Briefcase size={11} />{c.stats?.published ?? 0} publicadas</span>
                        <span className="inline-flex items-center gap-1"><Users size={11} />{c.stats?.applications ?? 0} postulaciones</span>
                        <span>Registrada {timeAgo(c.created_at)}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {c.website && (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 items-center rounded-full border border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
                        >
                          Sitio ↗
                        </a>
                      )}
                      {c.status !== "approved" && (
                        <button
                          onClick={() => decide(c.id, "approve")}
                          disabled={actionBusy === c.id}
                          className="inline-flex h-8 items-center gap-1 rounded-full bg-emerald-600 px-3.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {actionBusy === c.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={12} />}
                          Aprobar
                        </button>
                      )}
                      {c.status !== "rejected" && (
                        <button
                          onClick={() => decide(c.id, "reject")}
                          disabled={actionBusy === c.id}
                          className="inline-flex h-8 items-center gap-1 rounded-full border border-red-200 px-3.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950"
                        >
                          <X size={12} />
                          Rechazar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === "vacantes" && (
        <>
          {metrics && (
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Building2, label: "Empresas aprobadas", value: metrics.totalCompanies },
                { icon: Clock, label: "Empresas pendientes", value: metrics.pendingCompanies },
                { icon: Briefcase, label: "Vacantes publicadas", value: metrics.publishedJobs },
                { icon: Users, label: "Postulaciones totales", value: metrics.totalApplications },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                  <m.icon size={15} className="text-neutral-400" />
                  <p className="mt-1.5 text-xl font-bold text-neutral-900 dark:text-white">{m.value}</p>
                  <p className="text-[11px] text-neutral-500">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          {typeof metrics?.topSkills !== "undefined" && metrics.topSkills.length > 0 && (
            <div className="mb-5 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Skills más demandadas</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {metrics.topSkills.map((s) => (
                  <span key={s.skill} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                    {s.label} <span className="font-mono text-neutral-400">×{s.count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {metrics?.funnel && Object.keys(metrics.funnel).length > 0 && (
            <div className="mb-5 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Postulaciones por etapa</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(metrics.funnel as Record<string, number>).map(([status, count]) => (
                  <span key={status} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                    {APPLICATION_STATUS_LABELS[status as keyof typeof APPLICATION_STATUS_LABELS] ?? status}: <span className="font-mono font-bold">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="relative mb-4 max-w-sm">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              aria-label="Buscar vacante"
              placeholder="Buscar vacante…"
              value={jobQuery}
              onChange={(e) => setJobQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadJobs(jobQuery || undefined)}
              className="h-9 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus-visible:ring-white/30"
            />
          </div>

          {loadingJobs ? (
            <div className="space-y-2.5" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl border border-neutral-200 dark:border-neutral-800" />
              ))}
            </div>
          ) : jobsError ? (
            <div className="rounded-xl border border-neutral-200 p-8 text-center dark:border-neutral-800">
              <p className="text-sm text-neutral-500">No pudimos cargar las vacantes.</p>
              <button
                onClick={() => loadJobs(jobQuery || undefined)}
                className="mt-3 inline-flex h-9 items-center rounded-full bg-neutral-900 px-5 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900"
              >
                Reintentar
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">No hay vacantes.</p>
          ) : (
            <div className="space-y-2.5">
              {jobs.map((j) => (
                <div key={j.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3.5 dark:border-neutral-800">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">{j.title}</p>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                        {JOB_STATUS_LABELS[j.status] ?? j.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {j.employer_companies?.name} ·{" "}
                      <span className="inline-flex items-center gap-1"><Eye size={10} />{j.views_count}</span>{" · "}
                      <span className="inline-flex items-center gap-1"><Users size={10} />{j.applications_count}</span>
                      {j.published_at ? ` · ${timeAgo(j.published_at)}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {j.status === "published" && (
                      <button onClick={() => jobAction(j.id, "pause")} title="Pausar" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900">
                        <Pause size={13} />
                      </button>
                    )}
                    {j.status !== "published" && (
                      <button onClick={() => jobAction(j.id, "reopen")} title="Reactivar" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900">
                        <Play size={13} />
                      </button>
                    )}
                    <button onClick={() => jobAction(j.id, "close")} title="Cerrar" className="inline-flex h-8 items-center rounded-full border border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900">
                      Cerrar
                    </button>
                    <button onClick={() => jobAction(j.id, "delete")} title="Eliminar" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {view === "destacados" && (
        <>
          {loadingJobs ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            </div>
          ) : (
            <>
              {/* Ingresos */}
              <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  {
                    label: "Ingresos por destacados",
                    value: `$${(metrics?.revenueTotal ?? 0).toLocaleString("es-CL")}`,
                    sub: `${metrics?.paidFeatureOrders ?? 0} órdenes pagadas`,
                  },
                  {
                    label: "Ingresos este mes",
                    value: `$${(metrics?.revenueThisMonth ?? 0).toLocaleString("es-CL")}`,
                    sub: "Desde el 1º del mes",
                  },
                  {
                    label: "Destacados activos",
                    value: metrics?.activeFeatured ?? 0,
                    sub: "Vacantes destacadas hoy",
                  },
                  {
                    label: "Contactos a talento",
                    value: metrics?.totalContactRequests ?? 0,
                    sub: "Solicitudes (últimas 50)",
                  },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                    <Star size={15} className="text-neutral-400" />
                    <p className="mt-1.5 text-lg font-bold text-neutral-900 dark:text-white">{m.value}</p>
                    <p className="text-[11px] text-neutral-500">{m.label}</p>
                    <p className="mt-0.5 text-[10px] text-neutral-400">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Órdenes de destacado */}
              <div className="mb-6">
                <p className="mb-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Órdenes de vacante destacada (Flow)
                </p>
                {featureOrders.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800">
                    Aún no hay órdenes de destacado.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {featureOrders.map((o) => (
                      <div
                        key={o.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3.5 dark:border-neutral-800"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
                            {o.job_title}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            {o.company_name} · {o.days} días · {timeAgo(o.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                            ${(o.amount_clp ?? 0).toLocaleString("es-CL")}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              o.status === "paid"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                : o.status === "pending"
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                  : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900"
                            }`}
                          >
                            {o.status === "paid"
                              ? "Pagada"
                              : o.status === "pending"
                                ? "Pendiente"
                                : o.status === "rejected"
                                  ? "Rechazada"
                                  : "Cancelada"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contactos a talento */}
              <div>
                <p className="mb-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Solicitudes de contacto del directorio de talento
                </p>
                {contactRequests.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800">
                    Aún no hay solicitudes de contacto.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {contactRequests.map((r) => (
                      <div
                        key={r.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3.5 dark:border-neutral-800"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">
                            {r.candidate_name}
                            <span className="ml-2 font-normal text-neutral-500">
                              ← {r.company_name}
                            </span>
                          </p>
                          {r.job_context && (
                            <p className="mt-0.5 truncate text-xs text-neutral-500">
                              Contexto: {r.job_context}
                            </p>
                          )}
                          {r.message && (
                            <p className="mt-1 line-clamp-2 max-w-xl text-xs italic text-neutral-400">
                              “{r.message}”
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-[11px] text-neutral-400">
                          {timeAgo(r.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
