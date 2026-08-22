"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BadgeCheck,
  Briefcase,
  Check,
  MapPin,
  RotateCcw,
  Search,
  Send,
  UserRound,
} from "lucide-react";
import { JOB_SKILLS, getSkillLabel } from "@/lib/data/job-skills";
import { AVAILABILITY_LABELS } from "@/lib/jobs/types";

interface TalentCard {
  user_id: string;
  full_name: string;
  headline: string | null;
  city: string | null;
  remote_ok: boolean;
  availability: string | null;
  desired_role: string | null;
  skills: string[];
  years_experience: number | null;
  certificate_titles: string[];
  verified_skills: string[];
}

const QUICK_SKILLS = ["python", "power-bi", "sql-server", "excel", "machine-learning"];

function TalentCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-[22px] border border-line bg-paper p-6" aria-hidden="true">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-wash" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-32 animate-pulse rounded-full bg-wash" />
          <div className="h-2.5 w-44 animate-pulse rounded-full bg-wash" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-2.5 w-40 animate-pulse rounded-full bg-wash" />
        <div className="h-2.5 w-24 animate-pulse rounded-full bg-wash" />
      </div>
      <div className="mt-4 flex gap-1.5">
        <div className="h-6 w-20 animate-pulse rounded-full bg-wash" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-wash" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-wash" />
      </div>
      <div className="mt-auto pt-5">
        <div className="h-10 w-28 animate-pulse rounded-full bg-wash" />
      </div>
    </div>
  );
}

export default function TalentosPageClient() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);

  const [talent, setTalent] = useState<TalentCard[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ¿El visitante es empresa aprobada? (para habilitar contacto)
  const [isEmployer, setIsEmployer] = useState<boolean | null>(null);
  const [contactBusy, setContactBusy] = useState<string | null>(null);
  const [contactDone, setContactDone] = useState<Set<string>>(new Set());
  const [contactError, setContactError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    fetch("/api/employer/verify")
      .then((r) => r.json())
      .then((d) => setIsEmployer(!!(d.membership?.company?.status === "approved")))
      .catch(() => setIsEmployer(false));
  }, []);

  const fetchTalent = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const sp = new URLSearchParams();
      if (debounced) sp.set("q", debounced);
      if (skills.length) sp.set("skills", skills.join(","));
      if (remoteOnly) sp.set("remote", "1");
      sp.set("perPage", "24");
      const r = await fetch(`/api/talent?${sp.toString()}`);
      if (!r.ok) throw new Error("http");
      const data = await r.json();
      setTalent(data.talent ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setTalent([]);
      setLoadError("No pudimos cargar los perfiles. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [debounced, skills, remoteOnly]);

  useEffect(() => {
    fetchTalent();
  }, [fetchTalent]);

  const contact = async (candidateId: string) => {
    setContactBusy(candidateId);
    setContactError(null);
    try {
      const res = await fetch("/api/talent/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_user_id: candidateId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setContactError(data.error ?? "No pudimos enviar la solicitud.");
        return;
      }
      setContactDone((prev) => new Set(prev).add(candidateId));
    } catch {
      setContactError("Error de conexión. Intenta de nuevo.");
    } finally {
      setContactBusy(null);
    }
  };

  const toggleSkill = (id: string) =>
    setSkills((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const hasActiveFilters = remoteOnly || skills.length > 0 || !!debounced;
  const clearFilters = () => {
    setRemoteOnly(false);
    setSkills([]);
    setQuery("");
    setDebounced("");
  };

  const chipClass = (active: boolean) =>
    `rounded-md border-2 px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas ${
      active
        ? "border-[rgb(23_23_22_/_0.28)] bg-paper text-ink"
        : "border-transparent bg-wash text-mute hover:text-ink"
    }`;

  return (
    <section className="border-t border-line px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1400px]">
        {/* Buscador */}
        <div className="relative mb-5 max-w-xl">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
          <label htmlFor="talent-search" className="sr-only">
            Buscar profesional
          </label>
          <input
            id="talent-search"
            type="search"
            placeholder="Buscar por nombre, rol o skill…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-line-strong bg-paper pl-11 pr-4 text-base text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
            autoComplete="off"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtros de talento">
            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              aria-pressed={remoteOnly}
              className={chipClass(remoteOnly)}
            >
              Disponible para remoto
            </button>
            {QUICK_SKILLS.map((skillId) => (
              <button
                key={skillId}
                onClick={() => toggleSkill(skillId)}
                aria-pressed={skills.includes(skillId)}
                className={chipClass(skills.includes(skillId))}
              >
                {JOB_SKILLS.find((s) => s.id === skillId)?.label ?? skillId}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-mute" aria-live="polite">
              {loading ? "Buscando…" : `${total} ${total === 1 ? "profesional" : "profesionales"} visibles`}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-mute transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
              >
                <RotateCcw size={13} strokeWidth={2} />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {contactError && (
          <p className="mt-4 text-sm font-medium text-[#dc2626]">{contactError}</p>
        )}

        {loadError && !loading ? (
          <div className="mt-6 flex flex-col items-center gap-4 rounded-[22px] border border-line bg-paper px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wash text-mute">
              <AlertCircle size={22} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-ink">Algo falló</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-mute">{loadError}</p>
            </div>
            <button
              onClick={fetchTalent}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
            >
              <RotateCcw size={15} />
              Reintentar
            </button>
          </div>
        ) : loading ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <TalentCardSkeleton key={i} />
            ))}
          </div>
        ) : talent === null || talent.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-wash text-faint">
              <UserRound size={24} strokeWidth={1.8} />
            </div>
            <h2 className="mt-5 text-xl font-bold tracking-tight text-ink">
              Aún no hay perfiles con esos criterios
            </h2>
            <p className="mt-2 max-w-md text-sm text-mute">
              Prueba quitando filtros, o publica una vacante y deja que los candidatos certificados
              lleguen a ti.
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink transition-colors hover:bg-wash"
              >
                <RotateCcw size={15} strokeWidth={2} />
                Limpiar filtros
              </button>
            ) : (
              <Link
                href="/empleos/para-empresas"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
              >
                <Briefcase size={15} />
                Publicar una vacante
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {talent.map((person) => {
              const contacted = contactDone.has(person.user_id);
              const allSkills = Array.from(new Set([...person.skills, ...person.verified_skills]));
              return (
                <div
                  key={person.user_id}
                  className="flex h-full flex-col rounded-[22px] border border-line bg-paper p-6 transition-all hover:border-ink/20 hover:shadow-[0_8px_30px_rgba(23,23,22,0.07)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-canvas">
                      {person.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold tracking-tight text-ink">
                        {person.full_name}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-sm text-mute">
                        {person.headline ?? person.desired_role ?? "Profesional de datos"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mute">
                    {person.city && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} strokeWidth={1.8} />
                        {person.city}
                        {person.remote_ok && <span className="text-faint">· remoto OK</span>}
                      </span>
                    )}
                    {person.availability && (
                      <span>{AVAILABILITY_LABELS[person.availability]}</span>
                    )}
                    {person.years_experience != null && (
                      <span className="text-faint">
                        {person.years_experience} {person.years_experience === 1 ? "año" : "años"}
                      </span>
                    )}
                  </div>

                  {allSkills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {allSkills.slice(0, 5).map((skill) =>
                        person.verified_skills.includes(skill) ? (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 rounded-full border border-line bg-ink/[0.03] px-2.5 py-1 text-xs font-semibold text-ink"
                          >
                            <BadgeCheck size={11} className="text-[#16a34a]" />
                            {getSkillLabel(skill)}
                          </span>
                        ) : (
                          <span
                            key={skill}
                            className="rounded-full bg-wash px-2.5 py-1 text-xs font-medium text-mute"
                          >
                            {getSkillLabel(skill)}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-5">
                    {isEmployer === null ? null : contacted ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16a34a]">
                        <Check size={15} strokeWidth={2.4} />
                        Solicitud enviada
                      </span>
                    ) : isEmployer ? (
                      <button
                        onClick={() => contact(person.user_id)}
                        disabled={contactBusy === person.user_id}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas transition-transform active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
                      >
                        {contactBusy === person.user_id ? (
                          <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-canvas/60" />
                        ) : (
                          <Send size={14} />
                        )}
                        Contactar
                      </button>
                    ) : (
                      <Link
                        href="/empleos/para-empresas"
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-paper px-5 text-sm font-semibold text-ink transition-colors hover:bg-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
                      >
                        <Briefcase size={14} />
                        Registrar empresa para contactar
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
