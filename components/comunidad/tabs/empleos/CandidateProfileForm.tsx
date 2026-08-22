"use client";

import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Check,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSkillLabel, skillsFromCourseTitles, skillsByCategory } from "@/lib/data/job-skills";
import { AVAILABILITY_LABELS } from "@/lib/jobs/types";
import type { CandidateProfile } from "@/lib/jobs/types";

const inputClass =
  "h-10 w-full rounded-lg border border-border-strong bg-bg px-3 text-sm text-text placeholder:text-text-muted";

interface Props {
  onSaved?: () => void;
}

export default function CandidateProfileForm({ onSaved }: Props) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [verifiedSkills, setVerifiedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    headline: "",
    bio: "",
    city: "",
    remote_ok: true,
    years_experience: "" as string,
    availability: "",
    desired_role: "",
    skills: [] as string[],
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    is_searchable: true,
    expected_salary_clp: "" as string,
    cv_url: null as string | null,
    cv_filename: null as string | null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user || cancelled) return;
      setUserId(session.user.id);

      const [profileRes, certsRes] = await Promise.all([
        fetch("/api/candidate-profile").then((r) => r.json()),
        supabase.from("certificates").select("course_title, issued_at").eq("user_id", session.user.id),
      ]);
      if (cancelled) return;

      const certTitles = (certsRes.data ?? [])
        .map((c: { course_title?: string | null }) => c.course_title)
        .filter((t): t is string => !!t);
      setCertificates(certTitles);
      setVerifiedSkills(skillsFromCourseTitles(certTitles));

      if (profileRes.profile) {
        const p = profileRes.profile as CandidateProfile;
        setProfile(p);
        setForm({
          headline: p.headline ?? "",
          bio: p.bio ?? "",
          city: p.city ?? "",
          remote_ok: p.remote_ok ?? true,
          years_experience: p.years_experience?.toString() ?? "",
          availability: p.availability ?? "",
          desired_role: p.desired_role ?? "",
          skills: p.skills ?? [],
          linkedin_url: p.linkedin_url ?? "",
          github_url: p.github_url ?? "",
          portfolio_url: p.portfolio_url ?? "",
          is_searchable: p.is_searchable ?? true,
          expected_salary_clp: p.expected_salary_clp?.toString() ?? "",
          cv_url: p.cv_url,
          cv_filename: p.cv_filename,
        });
      }
    })().finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSkill = (id: string) =>
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(id) ? f.skills.filter((s) => s !== id) : [...f.skills, id],
    }));

  const uploadCv = async (file: File) => {
    if (!userId) return;
    if (file.type !== "application/pdf") {
      setError("El CV debe ser un archivo PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("El CV no puede superar los 5 MB.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const path = `${userId}/${Date.now()}-${file.name.replace(/[^\w\s.-]/g, "").trim()}`;
      const { error: upErr } = await supabase.storage.from("cvs").upload(path, file);
      if (upErr) throw upErr;
      setForm((f) => ({ ...f, cv_url: path, cv_filename: file.name }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos subir el CV.");
    } finally {
      setUploading(false);
    }
  };

  const removeCv = () => {
    setForm((f) => ({ ...f, cv_url: null, cv_filename: null }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSavedMsg(false);
    try {
      const res = await fetch("/api/candidate-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: form.headline || null,
          bio: form.bio || null,
          city: form.city || null,
          remote_ok: form.remote_ok,
          years_experience: form.years_experience ? Number(form.years_experience) : null,
          availability: form.availability || null,
          desired_role: form.desired_role || null,
          skills: form.skills,
          linkedin_url: form.linkedin_url || null,
          github_url: form.github_url || null,
          portfolio_url: form.portfolio_url || null,
          is_searchable: form.is_searchable,
          expected_salary_clp: form.expected_salary_clp ? Number(form.expected_salary_clp) : null,
          cv_url: form.cv_url,
          cv_filename: form.cv_filename,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No pudimos guardar el perfil.");
        return;
      }
      setSavedMsg(true);
      onSaved?.();
      setTimeout(() => setSavedMsg(false), 3000);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6" aria-hidden="true">
        <div className="h-24 animate-pulse rounded-xl border border-border bg-surface" />
        <div className="space-y-5 rounded-xl border border-border bg-surface p-6">
          <div className="h-5 w-40 animate-pulse rounded-full bg-surface-hover" />
          <div className="h-10 animate-pulse rounded-lg bg-surface-hover" />
          <div className="h-24 animate-pulse rounded-lg bg-surface-hover" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-surface-hover" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const allSkills = Array.from(new Set([...form.skills, ...verifiedSkills]));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Certificados verificados */}
      {certificates.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="inline-flex items-center gap-2 font-display text-base font-bold text-text">
            <BadgeCheck size={17} className="text-[#16a34a]" />
            Certificados de ProgramBI
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            Se adjuntan automáticamente a cada postulación como verificación de tus skills.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {certificates.map((title) => (
              <span
                key={title}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-text"
              >
                <BadgeCheck size={12} className="text-[#16a34a]" />
                {title}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div>
          <h3 className="font-display text-lg font-bold text-text">Perfil laboral</h3>
          <p className="mt-1 text-xs text-text-secondary">
            {profile ? "Actualiza tu información profesional." : "Completa tu perfil para poder postular (2 minutos)."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="cp-headline" className="text-xs font-semibold text-text-secondary">Titular profesional</label>
            <input
              id="cp-headline"
              className={`${inputClass} mt-1.5`}
              placeholder="Ej. Analista de Datos · Power BI y SQL"
              value={form.headline}
              onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
              maxLength={120}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cp-bio" className="text-xs font-semibold text-text-secondary">Sobre ti</label>
            <textarea
              id="cp-bio"
              rows={4}
              className="mt-1.5 w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-muted"
              placeholder="Tu experiencia, proyectos destacados y qué tipo de rol buscas…"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              maxLength={4000}
            />
          </div>
          <div>
            <label htmlFor="cp-city" className="text-xs font-semibold text-text-secondary">Ciudad</label>
            <input
              id="cp-city"
              className={`${inputClass} mt-1.5`}
              placeholder="Santiago"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="cp-role" className="text-xs font-semibold text-text-secondary">Cargo deseado</label>
            <input
              id="cp-role"
              className={`${inputClass} mt-1.5`}
              placeholder="Analista de Datos JR"
              value={form.desired_role}
              onChange={(e) => setForm((f) => ({ ...f, desired_role: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="cp-years" className="text-xs font-semibold text-text-secondary">Años de experiencia</label>
            <input
              id="cp-years"
              type="number"
              min={0}
              max={50}
              className={`${inputClass} mt-1.5`}
              value={form.years_experience}
              onChange={(e) => setForm((f) => ({ ...f, years_experience: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="cp-availability" className="text-xs font-semibold text-text-secondary">Disponibilidad</label>
            <select
              id="cp-availability"
              className={`${inputClass} mt-1.5`}
              value={form.availability}
              onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))}
            >
              <option value="">Seleccionar</option>
              {Object.entries(AVAILABILITY_LABELS).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cp-salary" className="text-xs font-semibold text-text-secondary">Pretensión de renta (CLP)</label>
            <input
              id="cp-salary"
              type="number"
              min={0}
              step={50000}
              className={`${inputClass} mt-1.5`}
              placeholder="1200000"
              value={form.expected_salary_clp}
              onChange={(e) => setForm((f) => ({ ...f, expected_salary_clp: e.target.value }))}
            />
          </div>
          <div className="flex items-end gap-4 pb-1">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-text-secondary">
              <input
                type="checkbox"
                checked={form.remote_ok}
                onChange={(e) => setForm((f) => ({ ...f, remote_ok: e.target.checked }))}
                className="h-4 w-4 accent-current"
              />
              Abierto a remoto
            </label>
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text-secondary">Skills</label>
            <button
              onClick={() => setSkillsOpen(!skillsOpen)}
              className="text-xs font-semibold text-text hover:underline"
            >
              {skillsOpen ? "Cerrar" : "Elegir skills"}
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {allSkills.length === 0 && (
              <span className="text-xs text-text-muted">Aún no eliges skills</span>
            )}
            {allSkills.map((id) =>
              verifiedSkills.includes(id) ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-text"
                >
                  <BadgeCheck size={11} className="text-[#16a34a]" />
                  {getSkillLabel(id)}
                </span>
              ) : (
                <button
                  key={id}
                  onClick={() => toggleSkill(id)}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-hover px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text"
                >
                  {getSkillLabel(id)}
                  <X size={11} />
                </button>
              )
            )}
          </div>
          {skillsOpen && (
            <div className="mt-3 space-y-3 rounded-lg border border-border bg-bg p-4">
              {skillsByCategory().map((group) => (
                <div key={group.category}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    {group.label}
                  </p>
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
          )}
        </div>

        {/* Links + CV */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="cp-linkedin" className="text-xs font-semibold text-text-secondary">LinkedIn</label>
            <input id="cp-linkedin" type="url" inputMode="url" className={`${inputClass} mt-1.5`} placeholder="https://linkedin.com/in/…" value={form.linkedin_url} onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="cp-github" className="text-xs font-semibold text-text-secondary">GitHub</label>
            <input id="cp-github" type="url" inputMode="url" className={`${inputClass} mt-1.5`} placeholder="https://github.com/…" value={form.github_url} onChange={(e) => setForm((f) => ({ ...f, github_url: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="cp-portfolio" className="text-xs font-semibold text-text-secondary">Portafolio</label>
            <input id="cp-portfolio" type="url" inputMode="url" className={`${inputClass} mt-1.5`} placeholder="https://…" value={form.portfolio_url} onChange={(e) => setForm((f) => ({ ...f, portfolio_url: e.target.value }))} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg p-4">
          <FileText size={16} className="text-text-muted" />
          {form.cv_filename ? (
            <>
              <span className="max-w-[220px] truncate text-xs font-medium text-text">
                {form.cv_filename}
              </span>
              <button onClick={removeCv} className="text-xs font-medium text-text-secondary hover:text-text">
                Quitar
              </button>
            </>
          ) : (
            <span className="text-xs text-text-muted">CV en PDF (máx 5 MB) — las empresas lo descargarán al postular</span>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg border border-border-strong px-3.5 text-xs font-semibold text-text hover:bg-surface-hover disabled:opacity-60"
          >
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            {uploading ? "Subiendo…" : form.cv_filename ? "Reemplazar" : "Subir CV"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadCv(e.target.files[0])}
          />
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-text-secondary">
          <input
            type="checkbox"
            checked={form.is_searchable}
            onChange={(e) => setForm((f) => ({ ...f, is_searchable: e.target.checked }))}
            className="h-4 w-4"
          />
          Visible para empresas de la bolsa de trabajo
        </label>
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} strokeWidth={2.4} />}
          {saving ? "Guardando…" : profile ? "Guardar cambios" : "Crear mi perfil laboral"}
        </button>
        {savedMsg && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16a34a]" role="status">
            <Check size={13} strokeWidth={2.4} />
            Perfil guardado
          </span>
        )}
      </div>
    </div>
  );
}
