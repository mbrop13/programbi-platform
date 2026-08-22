"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Briefcase, Bell, Check, Loader2, MapPin, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { skillsFromCourseTitles } from "@/lib/data/job-skills";
import {
  EMPLOYMENT_TYPE_LABELS,
  formatSalaryCLP,
  matchScore,
  timeAgo,
  type JobPublic,
} from "@/lib/jobs/types";

const MODALITY_OPTIONS = [
  { id: "remoto", label: "Remoto" },
  { id: "hibrido", label: "Híbrido" },
  { id: "presencial", label: "Presencial" },
];

export default function JobSearchPanel() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [modality, setModality] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobPublic[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [userSkills, setUserSkills] = useState<string[] | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [alertBusy, setAlertBusy] = useState(false);
  const [alertDone, setAlertDone] = useState(false);
  const [alertFailed, setAlertFailed] = useState(false);

  const createAlertFromSearch = async () => {
    setAlertBusy(true);
    setAlertDone(false);
    setAlertFailed(false);
    try {
      const name = debounced
        ? `«${debounced}»`
        : modality.length
          ? modality.map((m) => MODALITY_OPTIONS.find((o) => o.id === m)?.label ?? m).join("/")
          : "Todas las vacantes";
      const res = await fetch("/api/job-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.slice(0, 60),
          filters: {
            q: debounced || undefined,
            modality: modality.length ? modality : undefined,
          },
        }),
      });
      if (res.ok) {
        setAlertDone(true);
        setTimeout(() => setAlertDone(false), 3000);
      } else {
        setAlertFailed(true);
        setTimeout(() => setAlertFailed(false), 4000);
      }
    } catch {
      setAlertFailed(true);
      setTimeout(() => setAlertFailed(false), 4000);
    } finally {
      setAlertBusy(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user || cancelled) return;
        const [profileRes, certsRes, savedRes] = await Promise.all([
          supabase.from("candidate_profiles").select("skills").eq("user_id", session.user.id).maybeSingle(),
          supabase.from("certificates").select("course_title").eq("user_id", session.user.id),
          supabase.from("saved_jobs").select("job_id").eq("user_id", session.user.id),
        ]);
        if (cancelled) return;
        setUserSkills(
          Array.from(
            new Set([
              ...(profileRes.data?.skills ?? []),
              ...skillsFromCourseTitles(
                (certsRes.data ?? [])
                  .map((c: { course_title?: string | null }) => c.course_title)
                  .filter((t): t is string => !!t)
              ),
            ])
          )
        );
        setSavedIds(
          new Set((savedRes.data ?? []).map((s: { job_id: string }) => s.job_id))
        );
      } catch {
        /* sin sesión */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const sp = new URLSearchParams();
      if (debounced) sp.set("q", debounced);
      if (modality.length) sp.set("modality", modality.join(","));
      sp.set("perPage", "24");
      const r = await fetch(`/api/jobs?${sp.toString()}`);
      if (!r.ok) throw new Error("http");
      const data = await r.json();
      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setJobs([]);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [debounced, modality]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const toggleSave = async (jobId: string) => {
    const res = await fetch(`/api/jobs/${jobId}/save`, { method: "POST" });
    if (!res.ok) return;
    const data = await res.json();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (data.saved) next.add(jobId);
      else next.delete(jobId);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          placeholder="Buscar vacantes: Python, Power BI, analista…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 w-full rounded-xl border border-border-strong bg-bg pl-10 pr-4 text-sm text-text placeholder:text-text-muted"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {MODALITY_OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() =>
              setModality((m) => (m.includes(o.id) ? m.filter((v) => v !== o.id) : [...m, o.id]))
            }
            aria-pressed={modality.includes(o.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
              modality.includes(o.id)
                ? "bg-accent text-accent-foreground"
                : "bg-surface-hover text-text-secondary hover:text-text"
            }`}
          >
            {o.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-text-muted">
          {loading ? "Buscando…" : `${total} ${total === 1 ? "vacante" : "vacantes"}`}
        </span>
        <button
          onClick={createAlertFromSearch}
          disabled={alertBusy}
          title="Recibir un resumen semanal por email con vacantes así"
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-text-secondary transition-colors hover:text-text disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          {alertBusy ? (
            <Loader2 size={12} className="animate-spin" />
          ) : alertDone ? (
            <Check size={12} className="text-[#16a34a]" />
          ) : (
            <Bell size={12} />
          )}
          {alertDone ? "Alerta creada" : alertFailed ? "No se pudo crear" : "Crear alerta"}
        </button>
      </div>

      {jobs === null || loading ? (
        <div className="space-y-3" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4">
              <div className="h-4 w-2/5 animate-pulse rounded-full bg-surface-hover" />
              <div className="mt-2 h-2.5 w-3/5 animate-pulse rounded-full bg-surface-hover" />
              <div className="mt-1.5 h-2 w-1/4 animate-pulse rounded-full bg-surface-hover" />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center">
          <h3 className="font-display text-base font-bold text-text">No pudimos cargar las vacantes</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Revisa tu conexión e inténtalo de nuevo.
          </p>
          <button
            onClick={fetchJobs}
            className="mt-4 inline-flex h-9 items-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground"
          >
            Reintentar
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center">
          <Briefcase size={22} className="mx-auto text-text-muted" />
          <h3 className="mt-3 font-display text-base font-bold text-text">Sin resultados</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Prueba con otros términos o quita los filtros de modalidad.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const salary = job.salary_visible
              ? formatSalaryCLP(job.salary_min_clp, job.salary_max_clp)
              : null;
            const match = userSkills ? matchScore(job.skills, userSkills) : 0;
            const saved = savedIds.has(job.id);
            return (
              <div key={job.id} className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/empleos/${job.slug}`} className="font-display text-[15px] font-bold text-text hover:underline">
                      {job.title}
                    </Link>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-secondary">
                      <span className="font-medium">{job.company_name}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} />
                        {job.modality === "remoto" ? "Remoto" : job.location_city}
                      </span>
                      <span>·</span>
                      <span>{EMPLOYMENT_TYPE_LABELS[job.employment_type]}</span>
                      {salary && (
                        <>
                          <span>·</span>
                          <span className="font-semibold text-text">{salary} CLP</span>
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-[11px] text-text-muted">
                      {job.published_at ? timeAgo(job.published_at) : "Nueva"}
                      {match >= 50 && (
                        <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] font-bold text-text">
                          {match}% match
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => toggleSave(job.id)}
                      aria-label={saved ? "Quitar de guardadas" : "Guardar vacante"}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                        saved
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border text-text-muted hover:text-text"
                      }`}
                    >
                      <Bookmark size={13} fill={saved ? "currentColor" : "none"} />
                    </button>
                    <Link
                      href={`/empleos/${job.slug}`}
                      className="inline-flex h-8 items-center rounded-full bg-accent px-4 text-xs font-semibold text-accent-foreground"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
