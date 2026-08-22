"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Briefcase,
  Building2,
  Loader2,
  UserRound,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import JobCard, { JobCardSkeleton } from "@/components/empleos/JobCard";
import { createClient } from "@/lib/supabase/client";
import { getSkillLabel, skillsFromCourseTitles } from "@/lib/data/job-skills";
import { matchScore, type JobPublic } from "@/lib/jobs/types";

const MODALITY_OPTIONS = [
  { id: "remoto", label: "Remoto" },
  { id: "hibrido", label: "Híbrido" },
  { id: "presencial", label: "Presencial" },
];

const SENIORITY_OPTIONS = [
  { id: "junior", label: "Junior" },
  { id: "semi", label: "Semi Senior" },
  { id: "senior", label: "Senior" },
];

const TYPE_OPTIONS = [
  { id: "full_time", label: "Jornada completa" },
  { id: "part_time", label: "Parcial" },
  { id: "practica", label: "Práctica" },
  { id: "freelance", label: "Freelance" },
];

const QUICK_SKILLS = ["python", "power-bi", "sql-server", "excel", "machine-learning"];

const SORT_OPTIONS = [
  { id: "recent", label: "Recientes" },
  { id: "salary", label: "Mayor salario" },
] as const;

interface EmpleosPageClientProps {
  initialJobs: JobPublic[];
  initialTotal: number;
}

export default function EmpleosPageClient({ initialJobs, initialTotal }: EmpleosPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const listParam = (key: string) =>
    (searchParams.get(key) ?? "").split(",").map((v) => v.trim()).filter(Boolean);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get("q") ?? "");
  const [modality, setModality] = useState<string[]>(listParam("modality"));
  const [seniority, setSeniority] = useState<string[]>(listParam("seniority"));
  const [employmentType, setEmploymentType] = useState<string[]>(listParam("employment_type"));
  const [skills, setSkills] = useState<string[]>(listParam("skills"));
  const [sort, setSort] = useState<"recent" | "salary">(
    searchParams.get("sort") === "salary" ? "salary" : "recent"
  );

  const [jobs, setJobs] = useState<JobPublic[]>(initialJobs);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Skills del usuario logueado (perfil + certificados) para el match %
  const [userSkills, setUserSkills] = useState<string[] | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Debounce del buscador
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  // Cargar skills del usuario una sola vez
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
        const certSkills = skillsFromCourseTitles(
          (certsRes.data ?? [])
            .map((c: { course_title?: string | null }) => c.course_title)
            .filter((t): t is string => !!t)
        );
        const profileSkills = (profileRes.data?.skills as string[] | null) ?? [];
        setUserSkills(Array.from(new Set([...profileSkills, ...certSkills])));
        setSavedIds(
          new Set((savedRes.data ?? []).map((s: { job_id: string }) => s.job_id))
        );
      } catch {
        /* usuario sin sesión: sin match */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeFilters =
    modality.length + seniority.length + employmentType.length + skills.length;
  const hasActiveState =
    !!debouncedQuery || activeFilters > 0 || sort !== "recent";

  // Si la URL trae filtros, el listado del server no aplica: forzar primer fetch
  const skipInitialFetch = useRef(!hasActiveState);

  const buildParams = useCallback(
    (targetPage: number) => {
      const sp = new URLSearchParams();
      if (debouncedQuery) sp.set("q", debouncedQuery);
      if (modality.length) sp.set("modality", modality.join(","));
      if (seniority.length) sp.set("seniority", seniority.join(","));
      if (employmentType.length) sp.set("employment_type", employmentType.join(","));
      if (skills.length) sp.set("skills", skills.join(","));
      if (sort === "salary") sp.set("sort", "salary");
      sp.set("page", String(targetPage));
      sp.set("perPage", "12");
      return sp;
    },
    [debouncedQuery, modality, seniority, employmentType, skills, sort]
  );

  const runSearch = useCallback(
    async (targetPage: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setLoadError(null);
      try {
        const r = await fetch(`/api/jobs?${buildParams(targetPage).toString()}`);
        if (!r.ok) throw new Error("http");
        const data = await r.json();
        const next = data.jobs ?? [];
        if (append) setJobs((prev) => [...prev, ...next]);
        else setJobs(next);
        setTotal(data.total ?? 0);
        setPage(targetPage);
      } catch {
        setLoadError(
          append
            ? "No pudimos cargar más vacantes. Inténtalo de nuevo."
            : "No pudimos cargar las vacantes. Revisa tu conexión e inténtalo de nuevo."
        );
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [buildParams]
  );

  // Refetch al cambiar filtros
  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }
    runSearch(1, false);
  }, [runSearch]);

  // Sincronizar estado con la URL (compartir/volver/refrescar conserva los filtros)
  useEffect(() => {
    const sp = new URLSearchParams();
    if (debouncedQuery) sp.set("q", debouncedQuery);
    if (modality.length) sp.set("modality", modality.join(","));
    if (seniority.length) sp.set("seniority", seniority.join(","));
    if (employmentType.length) sp.set("employment_type", employmentType.join(","));
    if (skills.length) sp.set("skills", skills.join(","));
    if (sort === "salary") sp.set("sort", "salary");
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [debouncedQuery, modality, seniority, employmentType, skills, sort, router, pathname]);

  const loadMore = () => runSearch(page + 1, true);

  const toggleFilter = (
    value: string,
    list: string[],
    setter: (v: string[]) => void
  ) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const clearFilters = () => {
    setQuery("");
    setDebouncedQuery("");
    setModality([]);
    setSeniority([]);
    setEmploymentType([]);
    setSkills([]);
    setSort("recent");
  };

  const toggleSave = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) window.dispatchEvent(new Event("open-auth-modal"));
        return;
      }
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (data.saved) next.add(jobId);
        else next.delete(jobId);
        return next;
      });
    } catch {
      /* sin conexión: el ícono refleja el estado previo */
    }
  };

  const chipClass = (active: boolean) =>
    `rounded-md border-2 px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas ${
      active
        ? "border-[rgb(23_23_22_/_0.28)] bg-paper text-ink"
        : "border-transparent bg-wash text-mute hover:text-ink"
    }`;

  const filterGroup = (
    label: string,
    options: { id: string; label: string }[],
    list: string[],
    setter: (v: string[]) => void
  ) => (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="text-xs font-medium text-faint">{label}</span>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => toggleFilter(o.id, list, setter)}
          aria-pressed={list.includes(o.id)}
          className={chipClass(list.includes(o.id))}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <section className="px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Bolsa de Trabajo
              </h1>
              <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">
                Vacantes de datos y programación publicadas por empresas verificadas.
                Los egresados de ProgramBI postulan con sus certificados a la vista.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/empleos/talento"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink transition-colors hover:bg-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
              >
                <UserRound size={16} strokeWidth={2} />
                Talento certificado
              </Link>
              <Link
                href="/empleos/para-empresas"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink transition-colors hover:bg-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
              >
                <Building2 size={16} strokeWidth={2} />
                Soy empresa
              </Link>
            </div>
          </div>

          <div className="relative mt-8 max-w-xl">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
            <label htmlFor="job-search" className="sr-only">
              Buscar vacante
            </label>
            <input
              id="job-search"
              type="search"
              placeholder="Buscar Analista de Datos, Python, Power BI..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 w-full rounded-xl border border-line-strong bg-paper pl-11 pr-4 text-base text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
              autoComplete="off"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {QUICK_SKILLS.map((skillId) => (
              <button
                key={skillId}
                onClick={() => toggleFilter(skillId, skills, setSkills)}
                aria-pressed={skills.includes(skillId)}
                className={chipClass(skills.includes(skillId))}
              >
                {getSkillLabel(skillId)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-[1400px]">
          {/* Filtros */}
          <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {filterGroup("Modalidad", MODALITY_OPTIONS, modality, setModality)}
              {filterGroup("Nivel", SENIORITY_OPTIONS, seniority, setSeniority)}
              {filterGroup("Tipo", TYPE_OPTIONS, employmentType, setEmploymentType)}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <div
                className="flex items-center gap-1 rounded-full border border-line bg-paper p-1"
                role="group"
                aria-label="Ordenar vacantes"
              >
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSort(o.id)}
                    aria-pressed={sort === o.id}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 ${
                      sort === o.id ? "bg-ink text-canvas" : "text-mute hover:text-ink"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {hasActiveState && (
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

          {/* Resultados */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-mute" aria-live="polite">
              {loading
                ? "Buscando vacantes…"
                : `${total} ${total === 1 ? "vacante disponible" : "vacantes disponibles"}`}
            </p>
          </div>

          {loadError && !loading && jobs.length === 0 && (
            <div className="mt-6 flex flex-col items-center gap-4 rounded-[22px] border border-line bg-paper px-6 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wash text-mute">
                <AlertCircle size={22} strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-ink">Algo falló</h2>
                <p className="mx-auto mt-1 max-w-md text-sm text-mute">{loadError}</p>
              </div>
              <button
                onClick={() => runSearch(1, false)}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
              >
                <RotateCcw size={15} />
                Reintentar
              </button>
            </div>
          )}

          {!(loadError && !loading && jobs.length === 0) &&
            (loading ? (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-wash text-faint">
                  <Briefcase size={24} strokeWidth={1.8} />
                </div>
                <h2 className="mt-5 text-xl font-bold tracking-tight text-ink">
                  No hay vacantes con esos criterios
                </h2>
                <p className="mt-2 max-w-md text-sm text-mute">
                  Prueba quitando filtros o vuelve pronto: publicamos nuevas vacantes cada semana.
                </p>
                {hasActiveState && (
                  <button
                    onClick={clearFilters}
                    className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink transition-colors hover:bg-wash"
                  >
                    <RotateCcw size={15} strokeWidth={2} />
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      match={userSkills ? matchScore(job.skills, userSkills) : null}
                      saved={savedIds.has(job.id)}
                      showSave={userSkills !== null}
                      onToggleSave={toggleSave}
                    />
                  ))}
                </div>

                {jobs.length < total && (
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-7 text-sm font-semibold text-ink transition-colors hover:bg-wash disabled:opacity-60"
                    >
                      {loadingMore && <Loader2 size={15} className="animate-spin" />}
                      {loadingMore ? "Cargando…" : "Cargar más vacantes"}
                    </button>
                    {loadError && !loadingMore && (
                      <p className="text-sm text-mute">
                        {loadError}{" "}
                        <button onClick={loadMore} className="font-semibold text-ink underline underline-offset-4">
                          Reintentar
                        </button>
                      </p>
                    )}
                  </div>
                )}
              </>
            ))}
        </div>
      </section>
    </>
  );
}
