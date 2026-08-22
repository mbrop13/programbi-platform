"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2, Plus, X } from "lucide-react";
import { skillsByCategory, getSkillLabel } from "@/lib/data/job-skills";
import {
  EMPLOYMENT_TYPE_LABELS,
  MODALITY_LABELS,
  SENIORITY_LABELS,
  formatSalaryCLP,
} from "@/lib/jobs/types";

export interface JobFormData {
  title: string;
  location_city: string;
  modality: string;
  employment_type: string;
  seniority: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  skills: string[];
  salary_min: string;
  salary_max: string;
  salary_visible: boolean;
  apply_via: string;
  apply_url: string;
}

export const emptyJobForm: JobFormData = {
  title: "",
  location_city: "",
  modality: "hibrido",
  employment_type: "full_time",
  seniority: "semi",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  skills: [],
  salary_min: "",
  salary_max: "",
  salary_visible: false,
  apply_via: "plataforma",
  apply_url: "",
};

const inputClass =
  "h-10 w-full rounded-lg border border-border-strong bg-bg px-3 text-sm text-text placeholder:text-text-muted";
const labelClass = "text-xs font-semibold text-text-secondary";
const selectClass = `${inputClass} mt-1.5`;

const WIZARD_STEPS = ["Datos básicos", "Descripción", "Skills y salario", "Revisión"];

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^[-•\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 15);
}

interface Props {
  initial?: (Partial<JobFormData> & { id?: string; status?: string }) | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function JobWizard({ initial, onClose, onSaved }: Props) {
  const editing = !!initial?.id;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<JobFormData>({
    ...emptyJobForm,
    ...(initial ?? {}),
  });
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof JobFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleSkill = (id: string) =>
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(id) ? f.skills.filter((s) => s !== id) : [...f.skills, id],
    }));

  const buildPayload = (publish: boolean) => ({
    title: form.title,
    location_city: form.location_city || null,
    location_country: "Chile",
    modality: form.modality,
    employment_type: form.employment_type,
    seniority: form.seniority,
    description: form.description,
    responsibilities: parseLines(form.responsibilities),
    requirements: parseLines(form.requirements),
    benefits: parseLines(form.benefits),
    skills: form.skills,
    salary_min_clp: form.salary_min ? Number(form.salary_min) : null,
    salary_max_clp: form.salary_max ? Number(form.salary_max) : null,
    salary_visible: form.salary_visible,
    apply_via: form.apply_via,
    apply_url: form.apply_via !== "plataforma" ? form.apply_url : null,
    publish,
  });

  const validate = (): string | null => {
    if (form.title.trim().length < 4) return "El cargo debe tener al menos 4 caracteres.";
    if (form.description.trim().length < 50) return "La descripción debe tener al menos 50 caracteres.";
    if (form.apply_via !== "plataforma" && !form.apply_url.trim())
      return "Indica el email o URL de postulación externa.";
    if (form.salary_min && form.salary_max && Number(form.salary_min) > Number(form.salary_max))
      return "El salario mínimo no puede superar el máximo.";
    return null;
  };

  const submit = async (publish: boolean) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setStep(validationError.includes("cargo") || validationError.includes("salario") || validationError.includes("email o URL") ? 0 : 1);
      return;
    }
    setError(null);
    if (publish) setPublishing(true);
    else setSaving(true);
    try {
      const res = await fetch(
        editing ? `/api/employer/jobs/${initial!.id}` : "/api/employer/jobs",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing ? buildPayload(publish) : buildPayload(publish)),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No pudimos guardar la vacante.");
        return;
      }
      setSaved(true);
      onSaved();
      setTimeout(onClose, 900);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  const stepValid = useMemo(() => {
    if (step === 0) return form.title.trim().length >= 4;
    if (step === 1) return form.description.trim().length >= 50;
    return true;
  }, [step, form.title, form.description]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-display text-base font-bold text-text">
              {editing ? "Editar vacante" : "Nueva vacante"}
            </h3>
            <p className="text-[11px] text-text-muted">
              Paso {step + 1} de {WIZARD_STEPS.length}: {WIZARD_STEPS[step]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Barra de progreso */}
        <div className="flex gap-1 px-5 pt-4" role="progressbar" aria-label={`Paso ${step + 1} de ${WIZARD_STEPS.length}`} aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={WIZARD_STEPS.length}>
          {WIZARD_STEPS.map((label, i) => (
            <div
              key={label}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-accent" : "bg-surface-hover"
              }`}
            />
          ))}
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="jw-title" className={labelClass}>Cargo *</label>
                <input id="jw-title" className={`${inputClass} mt-1.5`} placeholder="Ej. Analista de Datos Power BI" value={form.title} onChange={set("title")} />
              </div>
              <div>
                <label htmlFor="jw-city" className={labelClass}>Ciudad</label>
                <input id="jw-city" className={`${inputClass} mt-1.5`} placeholder="Santiago" value={form.location_city} onChange={set("location_city")} />
              </div>
              <div>
                <label htmlFor="jw-modality" className={labelClass}>Modalidad</label>
                <select id="jw-modality" className={selectClass} value={form.modality} onChange={set("modality")}>
                  {Object.entries(MODALITY_LABELS).map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="jw-type" className={labelClass}>Tipo de contrato</label>
                <select id="jw-type" className={selectClass} value={form.employment_type} onChange={set("employment_type")}>
                  {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="jw-seniority" className={labelClass}>Seniority</label>
                <select id="jw-seniority" className={selectClass} value={form.seniority} onChange={set("seniority")}>
                  {Object.entries(SENIORITY_LABELS).map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="jw-description" className={labelClass}>Descripción de la vacante * <span className="font-normal text-text-muted">(mín. 50 caracteres)</span></label>
                <textarea
                  id="jw-description"
                  rows={7}
                  className="mt-1.5 w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-muted"
                  placeholder="Contexto del rol, el equipo, qué harán día a día…"
                  value={form.description}
                  onChange={set("description")}
                />
              </div>
              <div>
                <label htmlFor="jw-resp" className={labelClass}>Responsabilidades <span className="font-normal text-text-muted">(una por línea)</span></label>
                <textarea id="jw-resp" rows={4} className="mt-1.5 w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-muted" placeholder={"Crear dashboards en Power BI\nAutomatizar reportes con Python"} value={form.responsibilities} onChange={set("responsibilities")} />
              </div>
              <div>
                <label htmlFor="jw-req" className={labelClass}>Requisitos <span className="font-normal text-text-muted">(una por línea)</span></label>
                <textarea id="jw-req" rows={4} className="mt-1.5 w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-muted" placeholder={"Experiencia con SQL\nManejo de Power BI"} value={form.requirements} onChange={set("requirements")} />
              </div>
              <div>
                <label htmlFor="jw-benefits" className={labelClass}>Beneficios <span className="font-normal text-text-muted">(uno por línea)</span></label>
                <textarea id="jw-benefits" rows={3} className="mt-1.5 w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-muted" placeholder={"100% remoto\nSeguro salud"} value={form.benefits} onChange={set("benefits")} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className={labelClass}>Skills requeridas <span className="font-normal text-text-muted">(los candidatos verán su % de match)</span></p>
                <div className="mt-2 space-y-3 rounded-lg border border-border bg-bg p-4">
                  {skillsByCategory().map((group) => (
                    <div key={group.category}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{group.label}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {group.skills.map((skill) => (
                          <button
                            key={skill.id}
                            onClick={() => toggleSkill(skill.id)}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                              form.skills.includes(skill.id)
                                ? "bg-accent text-accent-foreground"
                                : "bg-surface-hover text-text-secondary hover:text-text"
                            }`}
                          >
                            {skill.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="jw-smin" className={labelClass}>Salario mín. (CLP)</label>
                  <input id="jw-smin" type="number" min={0} step={50000} className={`${inputClass} mt-1.5`} placeholder="1000000" value={form.salary_min} onChange={set("salary_min")} />
                </div>
                <div>
                  <label htmlFor="jw-smax" className={labelClass}>Salario máx. (CLP)</label>
                  <input id="jw-smax" type="number" min={0} step={50000} className={`${inputClass} mt-1.5`} placeholder="1500000" value={form.salary_max} onChange={set("salary_max")} />
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-text-secondary">
                <input type="checkbox" className="h-4 w-4" checked={form.salary_visible} onChange={(e) => setForm((f) => ({ ...f, salary_visible: e.target.checked }))} />
                Mostrar el salario en la publicación
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Recibir postulaciones por</label>
                  <select className={selectClass} value={form.apply_via} onChange={set("apply_via")}>
                    <option value="plataforma">Plataforma ProgramBI (recomendado)</option>
                    <option value="email">Email externo</option>
                    <option value="url">URL externa</option>
                  </select>
                </div>
                {form.apply_via !== "plataforma" && (
                  <div>
                    <label className={labelClass}>{form.apply_via === "email" ? "Email" : "URL"}</label>
                    <input className={`${inputClass} mt-1.5`} placeholder={form.apply_via === "email" ? "rrhh@empresa.cl" : "https://…"} value={form.apply_url} onChange={set("apply_url")} />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 rounded-lg border border-border bg-bg p-4 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Cargo</span><span className="font-semibold text-text">{form.title}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Modalidad</span><span className="text-text">{MODALITY_LABELS[form.modality]} · {form.location_city || "—"}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Contrato</span><span className="text-text">{EMPLOYMENT_TYPE_LABELS[form.employment_type]} · {SENIORITY_LABELS[form.seniority]}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Skills</span><span className="max-w-[55%] text-right text-text">{form.skills.map(getSkillLabel).join(", ") || "—"}</span></div>
              {form.salary_visible && (form.salary_min || form.salary_max) && (
                <div className="flex justify-between"><span className="text-text-muted">Salario</span><span className="font-semibold text-text">{formatSalaryCLP(form.salary_min ? Number(form.salary_min) : null, form.salary_max ? Number(form.salary_max) : null)} CLP</span></div>
              )}
              <div className="flex justify-between"><span className="text-text-muted">Postulaciones vía</span><span className="text-text">{form.apply_via === "plataforma" ? "Plataforma" : form.apply_via === "email" ? "Email" : "URL"}</span></div>
              {error && <p className="pt-2 text-xs font-medium text-red-500">{error}</p>}
            </div>
          )}

          {step < 3 && error && <p className="mt-4 text-xs font-medium text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          <button
            onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-text-secondary hover:text-text"
          >
            <ChevronLeft size={15} />
            {step === 0 ? "Cancelar" : "Atrás"}
          </button>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={() => submit(false)}
                disabled={saving || publishing}
                className="inline-flex h-10 items-center rounded-full border border-border-strong px-5 text-sm font-medium text-text hover:bg-surface-hover disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : "Guardar borrador"}
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 0 && form.title.trim().length < 4) {
                    setError("El cargo debe tener al menos 4 caracteres.");
                    return;
                  }
                  if (step === 1 && form.description.trim().length < 50) {
                    setError("La descripción debe tener al menos 50 caracteres.");
                    return;
                  }
                  setError(null);
                  setStep(step + 1);
                }}
                disabled={!stepValid}
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground disabled:opacity-50"
              >
                Continuar
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => submit(true)}
                disabled={saving || publishing || saved}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground disabled:opacity-60"
              >
                {publishing ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Plus size={14} />}
                {saved ? "¡Publicada!" : publishing ? "Publicando…" : editing ? "Guardar y publicar" : "Publicar vacante"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
