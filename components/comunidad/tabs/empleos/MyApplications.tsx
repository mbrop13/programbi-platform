"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, MapPin, XCircle } from "lucide-react";
import {
  APPLICATION_STATUS_FLOW,
  APPLICATION_STATUS_LABELS,
  formatSalaryCLP,
  timeAgo,
  type ApplicationStatus,
  type JobApplication,
} from "@/lib/jobs/types";

function StatusTimeline({ status }: { status: string }) {
  const currentIndex = APPLICATION_STATUS_FLOW.indexOf(status as ApplicationStatus);
  const isTerminal = status === "rejected" || status === "withdrawn";
  if (currentIndex === -1 && !isTerminal) return null;

  if (isTerminal) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-hover px-3 py-1 text-xs font-semibold text-text-secondary">
        <XCircle size={12} />
        {APPLICATION_STATUS_LABELS[status as keyof typeof APPLICATION_STATUS_LABELS]}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {APPLICATION_STATUS_FLOW.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div
            title={APPLICATION_STATUS_LABELS[s]}
            className={`h-1.5 w-6 rounded-full ${
              i <= currentIndex ? "bg-accent" : "bg-surface-hover"
            }`}
          />
        </div>
      ))}
      <span className="ml-1.5 text-xs font-semibold text-text">
        {APPLICATION_STATUS_LABELS[status as keyof typeof APPLICATION_STATUS_LABELS]}
      </span>
    </div>
  );
}

export default function MyApplications() {
  const [applications, setApplications] = useState<JobApplication[] | null>(null);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  const load = async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/applications/mine");
      if (!res.ok) throw new Error("http");
      const data = await res.json();
      setApplications(data.applications ?? []);
    } catch {
      setLoadError(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const withdraw = async (id: string) => {
    setWithdrawing(id);
    try {
      await fetch(`/api/applications/mine?id=${id}`, { method: "DELETE" });
      await load();
    } catch {
      /* el listado se recarga en el siguiente intento */
    } finally {
      setWithdrawing(null);
    }
  };

  if (applications === null) {
    if (loadError) {
      return (
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-hover text-text-muted">
            <Clock size={22} />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-text">No pudimos cargar tus postulaciones</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
            Revisa tu conexión e inténtalo de nuevo.
          </p>
          <button
            onClick={load}
            className="mt-5 inline-flex h-10 items-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-5">
            <div className="h-4 w-2/5 animate-pulse rounded-full bg-surface-hover" />
            <div className="mt-2 h-2.5 w-3/5 animate-pulse rounded-full bg-surface-hover" />
            <div className="mt-4 h-3 w-1/3 animate-pulse rounded-full bg-surface-hover" />
          </div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-hover text-text-muted">
          <Clock size={22} />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold text-text">Aún no tienes postulaciones</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          Explora las vacantes de la bolsa de trabajo y postula con tu perfil laboral y certificados.
        </p>
        <Link
          href="/empleos/vacantes"
          className="mt-5 inline-flex h-10 items-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground"
        >
          Ver vacantes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {applications.map((app) => {
        const salary = app.job?.salary_visible
          ? formatSalaryCLP(app.job.salary_min_clp, app.job.salary_max_clp)
          : null;
        return (
          <div key={app.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/empleos/${app.job?.slug ?? ""}`}
                  className="font-display text-base font-bold text-text hover:underline"
                >
                  {app.job?.title}
                </Link>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-text-secondary">
                  <span>{app.job?.company_name}</span>
                  {app.job?.location_city && (
                    <>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} />
                        {app.job.location_city}
                      </span>
                    </>
                  )}
                  {salary && (
                    <>
                      <span>·</span>
                      <span className="font-semibold text-text">{salary} CLP</span>
                    </>
                  )}
                </p>
              </div>
              <span className="text-[11px] text-text-muted">Postulaste {timeAgo(app.created_at)}</span>
            </div>

            <div className="mt-4">
              <StatusTimeline status={app.status} />
            </div>

            {!["withdrawn", "rejected", "hired"].includes(app.status) && (
              <div className="mt-4 flex justify-end border-t border-border pt-3">
                <button
                  onClick={() => withdraw(app.id)}
                  disabled={withdrawing === app.id}
                  className="text-xs font-medium text-text-muted hover:text-text disabled:opacity-50"
                >
                  {withdrawing === app.id ? "Retirando…" : "Retirar postulación"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
