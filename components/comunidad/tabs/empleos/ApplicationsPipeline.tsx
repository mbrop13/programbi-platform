"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Download, Loader2, Star, X } from "lucide-react";
import { getSkillLabel } from "@/lib/data/job-skills";
import {
  APPLICATION_STATUS_LABELS,
  AVAILABILITY_LABELS,
  timeAgo,
  type JobApplication,
} from "@/lib/jobs/types";

const COLUMNS: Array<{ status: string; label: string }> = [
  { status: "sent", label: "Nuevos" },
  { status: "shortlisted", label: "Preseleccionados" },
  { status: "interview", label: "Entrevista" },
  { status: "offer", label: "Oferta" },
  { status: "hired", label: "Contratados" },
];

const MOVE_OPTIONS = ["viewed", "shortlisted", "interview", "offer", "hired", "rejected"];

export default function ApplicationsPipeline() {
  const [applications, setApplications] = useState<JobApplication[] | null>(null);
  const [selected, setSelected] = useState<JobApplication | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = async () => {
    setLoadError(false);
    try {
      const r = await fetch("/api/employer/applications");
      if (!r.ok) throw new Error("http");
      const data = await r.json();
      setApplications(data.applications ?? []);
    } catch {
      setApplications([]);
      setLoadError(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setNotes(selected?.recruiter_notes ?? "");
  }, [selected]);

  const update = async (id: string, payload: Record<string, unknown>) => {
    setBusy(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/employer/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("http");
      await load();
      if (selected?.id === id) {
        setSelected((s) => (s ? { ...s, ...payload } as JobApplication : s));
      }
    } catch {
      setActionError("No pudimos guardar el cambio. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const downloadCv = async (applicationId: string) => {
    setCvLoading(true);
    setActionError(null);
    try {
      const r = await fetch(`/api/employer/applications/${applicationId}/cv`);
      const data = await r.json();
      if (data.url) window.open(data.url, "_blank");
      else setActionError("El CV no está disponible.");
    } catch {
      setActionError("No pudimos descargar el CV. Inténtalo de nuevo.");
    } finally {
      setCvLoading(false);
    }
  };

  if (applications === null) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, c) => (
          <div key={c} className="w-[260px] shrink-0 space-y-2">
            <div className="h-5 w-28 animate-pulse rounded-full bg-surface-hover" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-surface" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-10 text-center">
        <h3 className="font-display text-lg font-bold text-text">No pudimos cargar las postulaciones</h3>
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

  if (applications.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-10 text-center">
        <h3 className="font-display text-lg font-bold text-text">Sin postulaciones aún</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          Cuando candidatos postulen a tus vacantes aparecerán aquí organizadas por etapa del proceso.
        </p>
      </div>
    );
  }

  const byStatus = (status: string) =>
    applications.filter(
      (a) =>
        a.status === status ||
        (status === "sent" && a.status === "viewed") // "vistas" cuentan como nuevas
    );

  const rejected = applications.filter((a) => a.status === "rejected");
  const withdrawn = applications.filter((a) => a.status === "withdrawn");

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {COLUMNS.map((col) => {
            const items = byStatus(col.status);
            return (
              <div key={col.status} className="w-[260px] shrink-0">
                <div className="flex items-center justify-between px-1 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                    {col.label}
                  </span>
                  <span className="rounded-full bg-surface-hover px-2 py-0.5 font-mono text-[11px] font-bold text-text-secondary">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelected(app)}
                      className="w-full rounded-xl border border-border bg-surface p-3.5 text-left transition-colors hover:border-border-strong"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-text">
                          {app.candidate_snapshot?.full_name ?? "Candidato"}
                        </p>
                        {app.rating && (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-text">
                            <Star size={11} className="fill-current text-amber-500" />
                            {app.rating}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-text-muted">
                        {app.job?.title}
                      </p>
                      {app.candidate_snapshot?.verified_skills?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {app.candidate_snapshot.verified_skills.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-text"
                            >
                              <BadgeCheck size={9} className="text-[#16a34a]" />
                              {getSkillLabel(s)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        app.candidate_snapshot?.headline && (
                          <p className="mt-1.5 line-clamp-1 text-[11px] text-text-secondary">
                            {app.candidate_snapshot.headline}
                          </p>
                        )
                      )}
                      <p className="mt-2 text-[10px] text-text-muted">{timeAgo(app.created_at)}</p>
                    </button>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border p-4 text-center text-[11px] text-text-muted">
                      Vacío
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(rejected.length > 0 || withdrawn.length > 0) && (
        <div>
          <button
            onClick={() => setShowRejected(!showRejected)}
            className="text-xs font-semibold text-text-secondary hover:text-text"
          >
            {showRejected ? "Ocultar" : "Ver"} descartados ({rejected.length}) y retirados ({withdrawn.length})
          </button>
          {showRejected && (
            <div className="mt-2 flex flex-wrap gap-2">
              {[...rejected, ...withdrawn].map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelected(app)}
                  className="rounded-full bg-surface-hover px-3 py-1.5 text-[11px] font-medium text-text-secondary hover:text-text"
                >
                  {app.candidate_snapshot?.full_name} · {APPLICATION_STATUS_LABELS[app.status]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Drawer de detalle */}
      {selected && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div
            className="h-full w-full max-w-lg overflow-y-auto border-l border-border bg-bg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-text">
                  {selected.candidate_snapshot?.full_name}
                </h3>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {selected.candidate_snapshot?.headline ?? "Sin titular"} · postuló {timeAgo(selected.created_at)}
                </p>
                <p className="mt-1 text-xs font-medium text-text">
                  {selected.job?.title}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            {actionError && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-950 dark:text-red-400" role="alert">
                {actionError}
              </p>
            )}

            {/* Certificados verificados */}
            {selected.candidate_snapshot?.certificate_titles?.length ? (
              <div className="mt-5 rounded-xl border border-border bg-surface p-4">
                <p className="inline-flex items-center gap-1.5 text-xs font-bold text-text">
                  <BadgeCheck size={13} className="text-[#16a34a]" />
                  Certificados verificados ProgramBI
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.candidate_snapshot.certificate_titles.map((t) => (
                    <span key={t} className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-text">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Datos del candidato */}
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-text-muted">Experiencia</p>
                <p className="mt-0.5 font-semibold text-text">
                  {selected.candidate_snapshot?.years_experience != null
                    ? `${selected.candidate_snapshot.years_experience} años`
                    : "—"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-text-muted">Ciudad</p>
                <p className="mt-0.5 font-semibold text-text">{selected.candidate_snapshot?.city ?? "—"}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-text-muted">Disponibilidad</p>
                <p className="mt-0.5 font-semibold text-text">
                  {selected.candidate_snapshot?.availability
                    ? AVAILABILITY_LABELS[selected.candidate_snapshot.availability] ?? "—"
                    : "—"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-text-muted">Cargo buscado</p>
                <p className="mt-0.5 font-semibold text-text">{selected.candidate_snapshot?.desired_role ?? "—"}</p>
              </div>
            </div>

            {/* Skills */}
            {selected.candidate_snapshot?.skills?.length ? (
              <div className="mt-4">
                <p className="text-xs font-bold text-text">Skills</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selected.candidate_snapshot.skills.map((s) => (
                    <span key={s} className="rounded-full bg-surface-hover px-2.5 py-1 text-[11px] font-medium text-text-secondary">
                      {getSkillLabel(s)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Carta */}
            {selected.cover_letter && (
              <div className="mt-4">
                <p className="text-xs font-bold text-text">Carta de presentación</p>
                <p className="mt-1.5 whitespace-pre-wrap rounded-xl border border-border bg-surface p-3.5 text-xs leading-relaxed text-text-secondary">
                  {selected.cover_letter}
                </p>
              </div>
            )}

            {/* Contacto + CV */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${selected.candidate_snapshot?.email}`}
                className="inline-flex h-9 items-center rounded-full bg-accent px-4 text-xs font-semibold text-accent-foreground"
              >
                Contactar por email
              </a>
              {selected.candidate_snapshot?.has_cv && (
                <button
                  onClick={() => downloadCv(selected.id)}
                  disabled={cvLoading}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border-strong px-4 text-xs font-semibold text-text hover:bg-surface disabled:opacity-60"
                >
                  {cvLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                  Descargar CV
                </button>
              )}
            </div>

            {/* Rating */}
            <div className="mt-6">
              <p className="text-xs font-bold text-text">Evaluación</p>
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => update(selected.id, { rating: n })}
                    className="p-0.5"
                    aria-label={`${n} estrellas`}
                  >
                    <Star
                      size={18}
                      className={
                        (selected.rating ?? 0) >= n
                          ? "fill-current text-amber-500"
                          : "text-text-muted"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Cambiar estado */}
            <div className="mt-5">
              <p className="text-xs font-bold text-text">Mover a etapa</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {MOVE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => update(selected.id, { status: s })}
                    disabled={busy}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                      selected.status === s
                        ? "bg-accent text-accent-foreground"
                        : "bg-surface-hover text-text-secondary hover:text-text"
                    }`}
                  >
                    {APPLICATION_STATUS_LABELS[s as keyof typeof APPLICATION_STATUS_LABELS]}
                  </button>
                ))}
              </div>
            </div>

            {/* Notas privadas */}
            <div className="mt-5">
              <p className="text-xs font-bold text-text">Notas privadas</p>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas del proceso, fortalezas, siguiente paso…"
                className="mt-1.5 w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-muted"
              />
              <button
                onClick={() => update(selected.id, { recruiter_notes: notes })}
                disabled={busy}
                className="mt-2 inline-flex h-9 items-center rounded-full border border-border-strong px-4 text-xs font-semibold text-text hover:bg-surface disabled:opacity-50"
              >
                {busy ? <Loader2 size={12} className="animate-spin" /> : "Guardar notas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
