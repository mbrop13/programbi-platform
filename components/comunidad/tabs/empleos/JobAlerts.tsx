"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2, Plus, Trash2, X } from "lucide-react";
import { getSkillLabel, JOB_SKILLS } from "@/lib/data/job-skills";
import { MODALITY_LABELS } from "@/lib/jobs/types";

interface JobAlert {
  id: string;
  name: string;
  filters: {
    q?: string;
    skills?: string[];
    modality?: string[];
    seniority?: string[];
  };
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
}

const inputClass =
  "h-10 w-full rounded-lg border border-border-strong bg-bg px-3 text-sm text-text placeholder:text-text-muted";

export default function JobAlerts() {
  const [alerts, setAlerts] = useState<JobAlert[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [q, setQ] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [modality, setModality] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const r = await fetch("/api/job-alerts");
      if (!r.ok) throw new Error("http");
      const data = await r.json();
      setAlerts(data.alerts ?? []);
    } catch {
      setAlerts([]);
      setError("No pudimos cargar tus alertas. Revisa tu conexión.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSkill = (id: string) =>
    setSkills((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const create = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/job-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Mi alerta",
          filters: {
            q: q || undefined,
            skills: skills.length ? skills : undefined,
            modality: modality.length ? modality : undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No pudimos crear la alerta.");
        return;
      }
      setCreating(false);
      setName("");
      setQ("");
      setSkills([]);
      setModality([]);
      await load();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("¿Eliminar esta alerta? Dejarás de recibir su resumen semanal.")) return;
    const previous = alerts;
    setAlerts((prev) => (prev ? prev.filter((a) => a.id !== id) : prev));
    try {
      const res = await fetch(`/api/job-alerts?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("http");
    } catch {
      setAlerts(previous);
      setError("No pudimos eliminar la alerta. Inténtalo de nuevo.");
    }
  };

  const toggleActive = async (alert: JobAlert) => {
    // El PATCH actual apaga la alerta; re-crearla activa es vía POST.
    if (alert.is_active) {
      setAlerts((prev) =>
        prev ? prev.map((a) => (a.id === alert.id ? { ...a, is_active: false } : a)) : prev
      );
      await fetch(`/api/job-alerts?id=${alert.id}`, { method: "PATCH" });
    } else {
      // Reactivar: duplicar como alerta nueva con los mismos filtros
      const res = await fetch("/api/job-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: alert.name, filters: alert.filters }),
      });
      if (res.ok) {
        await fetch(`/api/job-alerts?id=${alert.id}`, { method: "DELETE" });
        await load();
      }
    }
  };

  const describeFilters = (a: JobAlert) => {
    const parts: string[] = [];
    if (a.filters?.q) parts.push(`«${a.filters.q}»`);
    if (a.filters?.skills?.length) parts.push(a.filters.skills.map(getSkillLabel).join(", "));
    if (a.filters?.modality?.length)
      parts.push(a.filters.modality.map((m) => MODALITY_LABELS[m] ?? m).join("/"));
    return parts.length ? parts.join(" · ") : "Todas las vacantes";
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-text">Alertas de vacantes</h3>
          <p className="mt-0.5 text-xs text-text-secondary">
            Resumen semanal por email con las nuevas vacantes que coinciden contigo.
          </p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-accent-foreground"
        >
          {creating ? <X size={13} /> : <Plus size={13} />}
          {creating ? "Cancelar" : "Nueva alerta"}
        </button>
      </div>

      {creating && (
        <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="alert-name" className="text-xs font-semibold text-text-secondary">Nombre de la alerta</label>
              <input
                id="alert-name"
                className={`${inputClass} mt-1.5`}
                placeholder="Ej. Power BI remoto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
              />
            </div>
            <div>
              <label htmlFor="alert-q" className="text-xs font-semibold text-text-secondary">Palabra clave (opcional)</label>
              <input
                id="alert-q"
                className={`${inputClass} mt-1.5`}
                placeholder="Ej. analista"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                maxLength={120}
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">Skills (opcional)</p>
            <div className="mt-1.5 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-border bg-bg p-3">
              {JOB_SKILLS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleSkill(s.id)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    skills.includes(s.id)
                      ? "bg-accent text-accent-foreground"
                      : "bg-surface-hover text-text-secondary hover:text-text"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary">Modalidad (opcional)</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {Object.entries(MODALITY_LABELS).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() =>
                    setModality((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))
                  }
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    modality.includes(id)
                      ? "bg-accent text-accent-foreground"
                      : "bg-surface-hover text-text-secondary hover:text-text"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          <button
            onClick={create}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Crear alerta
          </button>
        </div>
      )}

      {alerts === null ? (
        <div className="space-y-2.5" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
      ) : alerts.length === 0 && !creating ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <Bell size={22} className="mx-auto text-text-muted" />
          <h4 className="mt-3 font-display text-base font-bold text-text">Sin alertas activas</h4>
          <p className="mx-auto mt-1 max-w-xs text-xs text-text-secondary">
            Crea una alerta con tus skills favoritas y recibe un resumen semanal por email.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 ${
                !a.is_active ? "opacity-60" : ""
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-text">{a.name}</p>
                  {a.is_active ? (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-text">
                      Activa
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-hover px-2 py-0.5 text-[10px] font-bold text-text-muted">
                      Pausada
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-text-secondary">{describeFilters(a)}</p>
                {a.last_sent_at && (
                  <p className="mt-0.5 text-[10px] text-text-muted">
                    Último envío: {new Date(a.last_sent_at).toLocaleDateString("es-CL")}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => toggleActive(a)}
                  title={a.is_active ? "Pausar" : "Reactivar"}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted hover:text-text"
                >
                  {a.is_active ? <BellOff size={13} /> : <Bell size={13} />}
                </button>
                <button
                  onClick={() => remove(a.id)}
                  title="Eliminar"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted hover:text-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
