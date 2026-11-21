"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BarChart3, Code2, Database } from "lucide-react";
import PowerBiCanvas from "@/components/marketing/HeroPowerBi";
import {
  getDemoPais,
  HERO_TABS,
  type HeroCurso,
  type HeroCursos,
  type HeroTabId,
} from "@/components/marketing/hero-demo";
import { trackCourseCardClick } from "@/lib/analytics/marketing";
import { usePaisRuta } from "@/lib/paises/cliente";

type Editores = typeof import("@/components/marketing/HeroEditors");
type Tab = (typeof HERO_TABS)[number];

const ICONOS = { bi: BarChart3, sql: Database, python: Code2 } as const;

/**
 * Vitrina interactiva de tres cursos en el hero.
 * Power BI va en el primer render (HTML del servidor); SQL Server y Python se
 * cargan en reposo para no bloquear el render inicial.
 */
export default function HeroPreview({ cursos }: { cursos: HeroCursos }) {
  const pais = usePaisRuta();
  const demo = useMemo(() => getDemoPais(pais), [pais]);
  const [active, setActive] = useState<HeroTabId>("bi");
  const [editores, setEditores] = useState<Editores | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    let alive = true;
    const load = () => {
      import("@/components/marketing/HeroEditors").then((mod) => {
        if (alive) setEditores(mod);
      });
    };
    const ric = window.requestIdleCallback?.bind(window);
    if (ric) {
      const id = ric(load, { timeout: 1800 });
      return () => {
        alive = false;
        window.cancelIdleCallback?.(id);
      };
    }
    const t = window.setTimeout(load, 1);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, []);

  const current = HERO_TABS.find((t) => t.id === active)!;
  const file = active === "python" ? "ventas.py" : active === "sql" ? "consulta.sql" : demo.pbix;

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % HERO_TABS.length;
    else if (e.key === "ArrowLeft") nextIndex = (index - 1 + HERO_TABS.length) % HERO_TABS.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = HERO_TABS.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = HERO_TABS[nextIndex];
      setActive(nextTab.id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[var(--h-border-strong)] bg-[var(--h-surface)] shadow-[0_20px_50px_-24px_rgba(17,24,39,0.16)] dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b border-[var(--h-border)] bg-[var(--h-surface)] px-2 sm:px-4">
          <div
            role="tablist"
            aria-label="Herramientas de los cursos"
            className="flex items-center gap-1"
          >
            {HERO_TABS.map((tab, index) => {
              const Icon = ICONOS[tab.id];
              const isActive = tab.id === active;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  id={`hero-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`hero-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  className={`relative flex min-h-[44px] items-center gap-2 px-3 text-[13px] font-semibold transition-colors sm:px-3.5 sm:text-sm ${
                    isActive
                      ? "text-[var(--h-ink)]"
                      : "text-[var(--h-muted)] hover:text-[var(--h-ink)]"
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={isActive ? 2.1 : 1.7}
                    className={isActive ? "shrink-0 text-[var(--h-accent)]" : "shrink-0"}
                    aria-hidden
                  />
                  <span>{tab.title}</span>
                  {isActive ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-2 bottom-0 h-[2px] bg-[var(--h-accent)]"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <span className="hidden truncate font-mono text-xs text-[var(--h-subtle)] md:inline">
            {file}
          </span>
        </div>

        <div
          id={`hero-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`hero-tab-${active}`}
          className="relative h-[min(360px,48vh)] bg-[var(--h-wash)] sm:h-[min(430px,50vh)]"
        >
          <div key={active} className="absolute inset-0">
            {active === "bi" ? (
              <PowerBiCanvas demo={demo} />
            ) : !editores ? (
              <Cargando />
            ) : active === "python" ? (
              <editores.PythonEditor demo={demo} onOpenSql={() => setActive("sql")} />
            ) : (
              <editores.SqlEditor demo={demo} />
            )}
          </div>
        </div>

        <BarraCurso tab={current} curso={cursos[active]} />
      </div>
    </div>
  );
}

/** Franja inferior del panel: próxima cohorte real y acceso directo a la ficha. */
function BarraCurso({ tab, curso }: { tab: Tab; curso: HeroCurso }) {
  const Icon = ICONOS[tab.id];
  const detalle = curso.inicio
    ? [`Inicia ${curso.inicio}`, curso.dias, curso.hora].filter(Boolean).join(" · ")
    : `${curso.horas} h en vivo · Cupos abiertos`;
  const corto = curso.inicio
    ? [`Inicia ${curso.inicio}`, curso.hora?.split(" ")[0]].filter(Boolean).join(" · ")
    : `${curso.horas} h en vivo`;

  return (
    <Link
      href={curso.href}
      onClick={() => trackCourseCardClick(tab.slug, "home_hero_panel")}
      className="group/bar flex min-h-[72px] shrink-0 items-center gap-3 border-t border-[var(--h-border)] bg-[var(--h-wash)] px-3.5 py-3 text-[var(--h-ink)] no-underline transition-colors hover:bg-[var(--h-surface)] sm:gap-4 sm:px-5"
    >
      <span className="flex min-w-0 flex-1 items-center gap-3 sm:gap-3.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--h-border-strong)] bg-[var(--h-surface)] text-[var(--h-accent)]">
          <Icon size={18} strokeWidth={2} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[15px] font-semibold tracking-tight text-[var(--h-ink)] sm:text-base">
              Curso {tab.title}
            </span>
            {curso.descuento > 0 ? (
              <span className="hidden shrink-0 rounded-md bg-[var(--h-accent-soft)] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[var(--h-accent)] sm:inline">
                {curso.descuento}% dto.
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block truncate text-xs tabular-nums text-[var(--h-muted)] sm:hidden">
            {corto}
          </span>
          <span className="mt-0.5 hidden truncate text-[13px] tabular-nums text-[var(--h-muted)] sm:block">
            {detalle}
          </span>
        </span>
      </span>

      <span className="inline-flex min-h-[44px] shrink-0 items-center rounded-lg bg-[var(--h-ink)] px-4 text-sm font-semibold text-[var(--h-surface)] transition-opacity group-hover/bar:opacity-90">
        Ver curso
      </span>
    </Link>
  );
}

/** Estado de carga mientras se descargan los editores secundarios. */
function Cargando() {
  return (
    <div
      className="flex h-full flex-col justify-center gap-3 bg-[var(--h-surface)] p-6"
      role="status"
      aria-label="Cargando editor interactivo"
    >
      <p className="text-xs font-medium text-[var(--h-muted)]">Cargando entorno interactivo…</p>
      <div className="space-y-2.5" aria-hidden>
        {[62, 78, 45, 70, 54].map((w, i) => (
          <span key={i} className="block h-3 rounded bg-[var(--h-wash)]" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
