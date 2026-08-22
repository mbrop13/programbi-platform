"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatSalaryCLP, timeAgo, type JobPublic } from "@/lib/jobs/types";
import { getSkillLabel } from "@/lib/data/job-skills";

interface SavedJob extends JobPublic {
  saved_at: string;
}

type SavedJobRow = {
  created_at: string;
  jobs: Omit<SavedJob, "company_name" | "company_slug" | "company_logo_url" | "saved_at"> & {
    employer_companies: { name: string | null; slug: string | null; logo_url: string | null } | null;
  };
};

export default function SavedJobs() {
  const [jobs, setJobs] = useState<SavedJob[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("saved_jobs")
          .select(`
            created_at,
            jobs!inner (
              id, title, slug, company_id, location_city, location_country, modality,
              employment_type, seniority, description, responsibilities, requirements,
              benefits, skills, salary_min_clp, salary_max_clp, salary_visible,
              apply_via, apply_url, published_at, expires_at, views_count, applications_count,
              employer_companies!inner (name, slug, logo_url)
            )
          `)
          .order("created_at", { ascending: false });
        if (cancelled) return;
        setJobs(
          ((data ?? []) as unknown as SavedJobRow[]).map((row) => ({
            ...row.jobs,
            company_name: row.jobs.employer_companies?.name ?? "",
            company_slug: row.jobs.employer_companies?.slug ?? "",
            company_logo_url: row.jobs.employer_companies?.logo_url ?? null,
            saved_at: row.created_at,
          }))
        );
      } catch {
        if (!cancelled) setJobs([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const unsave = async (jobId: string) => {
    const previous = jobs;
    setJobs((prev) => (prev ? prev.filter((j) => j.id !== jobId) : prev));
    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, { method: "POST" });
      if (!res.ok) throw new Error("http");
    } catch {
      // Si falla, restauramos la vacante (sigue guardada en el servidor)
      setJobs(previous);
    }
  };

  if (jobs === null) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-5">
            <div className="h-4 w-2/5 animate-pulse rounded-full bg-surface-hover" />
            <div className="mt-2 h-2.5 w-3/5 animate-pulse rounded-full bg-surface-hover" />
            <div className="mt-3 flex gap-1.5">
              <div className="h-5 w-16 animate-pulse rounded-full bg-surface-hover" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-surface-hover" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-hover text-text-muted">
          <Bookmark size={22} />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold text-text">Sin vacantes guardadas</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          Guarda vacantes con el ícono de marcador para revisarlas y postular más tarde.
        </p>
        <Link
          href="/empleos/vacantes"
          className="mt-5 inline-flex h-10 items-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground"
        >
          Explorar vacantes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {jobs.map((job) => {
        const salary = job.salary_visible
          ? formatSalaryCLP(job.salary_min_clp, job.salary_max_clp)
          : null;
        return (
          <div key={job.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/empleos/${job.slug}`}
                  className="font-display text-base font-bold text-text hover:underline"
                >
                  {job.title}
                </Link>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-text-secondary">
                  <span>{job.company_name}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} />
                    {job.modality === "remoto" ? "Remoto" : job.location_city}
                  </span>
                  {salary && (
                    <>
                      <span>·</span>
                      <span className="font-semibold text-text">{salary} CLP</span>
                    </>
                  )}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {job.skills.slice(0, 5).map((s) => (
                    <span key={s} className="rounded-full bg-surface-hover px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                      {getSkillLabel(s)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-[11px] text-text-muted">Guardada {timeAgo(job.saved_at)}</span>
                <button
                  onClick={() => unsave(job.id)}
                  aria-label="Quitar de guardadas"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground"
                >
                  <Bookmark size={14} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
