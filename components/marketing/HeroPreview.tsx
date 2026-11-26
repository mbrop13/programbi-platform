"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
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
const ARCHIVOS: Record<HeroTabId, string> = {
  bi: "ventas_ejecutivo.pbix",
  sql: "consulta_ventas.sql",
  python: "analisis_ventas.py",
};

/**
 * Showcase interactivo del hero: alterna entre Power BI, SQL Server y Python
 * con una barra inferior integrada que muestra el próximo inicio del curso.
 */
export default function HeroPreview({
  cursos,
  children,
}: {
  cursos: HeroCursos;
  children?: ReactNode;
}) {
  const pais = usePaisRuta();
  const demo = useMemo(() => getDemoPais(pais), [pais]);
  const [active, setActive] = useState<HeroTabId>("bi");
  const [editores, setEditores] = useState<Editores | null>(null);
  const tabRefs = useRef<Record<HeroTabId, HTMLButtonElement | null>>({
    bi: null,
    sql: null,
    python: null,
  });

  useEffect(() => {
    let alive = true;
    const load = () => {
      import("@/components/marketing/HeroEditors").then((mod) => {
        if (alive) setEditores(mod);
      });
    };
    const ric = window.requestIdleCallback?.bind(window);
    if (ric) {
      const id = ric(load, { timeout: 1500 });
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

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const delta = e.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + delta + HERO_TABS.length) % HERO_TABS.length;
    const nextTab = HERO_TABS[nextIndex];
    setActive(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  };

  const current = HERO_TABS.find((t) => t.id === active)!;
  const activeFile = ARCHIVOS[active];

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[0_24px_60px_-24px_rgba(17,24,39,0.16)] dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)]">
      {/* Cabecera limpia con selector de herramientas */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-3 sm:px-4">
        <div
          role="tablist"
          aria-label="Herramientas del programa"
          className="flex shrink-0 items-center gap-1 whitespace-nowrap"
        >
          {HERO_TABS.map((tab, idx) => {
            const Icon = ICONOS[tab.id];
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                id={`hero-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`hero-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`inline-flex min-h-[44px] items-center gap-1.5 border-b-2 px-2.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0b63c5] sm:px-3.5 sm:text-sm ${
                  isActive
                    ? "border-[#0b63c5] font-semibold text-text-primary dark:border-[#60a5fa]"
                    : "border-transparent font-medium text-text-muted hover:text-text-primary"
                }`}
              >
                <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" aria-hidden="true" />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        <span className="hidden min-w-0 truncate font-mono text-[11px] font-medium text-text-muted sm:inline">
          Datos de ejemplo · {activeFile}
        </span>
      </div>

      {/* En móvil las pestañas ocupan todo el ancho: el aviso va en su propia línea. */}
      <p className="border-b border-border bg-surface px-4 py-1.5 font-mono text-[11px] font-medium text-text-muted sm:hidden">
        Datos de ejemplo · {activeFile}
      </p>

      {/* Viewport con respiración real */}
      <div
        id={`hero-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`hero-tab-${active}`}
        className="flex min-h-[420px] flex-col sm:min-h-[465px]"
      >
        {active === "bi" ? (
          <PowerBiCanvas demo={demo} />
        ) : !editores ? (
          <Cargando file={activeFile} />
        ) : active === "python" ? (
          <editores.PythonEditor demo={demo} onOpenSql={() => setActive("sql")} />
        ) : (
          <editores.SqlEditor demo={demo} />
        )}
      </div>

      {/* Barra inferior integrada */}
      <BarraCurso tab={current} curso={cursos[active]}>
        {children}
      </BarraCurso>
    </div>
  );
}

/** Barra inferior del showcase: profesor en vivo, próxima fecha, descuento y CTA. */
function BarraCurso({
  tab,
  curso,
  children,
}: {
  tab: Tab;
  curso: HeroCurso;
  children?: ReactNode;
}) {
  const detalle = curso.inicio
    ? [`Inicia ${curso.inicio}`, curso.dias, curso.hora].filter(Boolean).join(" · ")
    : `${curso.horas} h en vivo · Cupos abiertos`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#111214] px-4 py-3 text-[#f4f4f6] dark:bg-[#17181d] sm:flex-nowrap sm:px-5 sm:py-3.5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {children}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold tracking-tight text-white sm:text-[15px]">
              Curso {tab.title}
            </span>
            {curso.descuento > 0 ? (
              <span className="inline-flex shrink-0 items-center rounded-md bg-white/12 px-2 py-0.5 text-[11px] font-semibold text-white tabular-nums">
                {curso.descuento}% dto.
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs text-[#b4b7c0] tabular-nums sm:truncate">{detalle}</p>
        </div>
      </div>

      <Link
        href={curso.href}
        onClick={() => trackCourseCardClick(tab.slug, "home_hero_panel")}
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-[#111214] no-underline transition-colors hover:bg-[#eff0f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]"
      >
        Ver curso
      </Link>
    </div>
  );
}

function Cargando({ file }: { file: string }) {
  return (
    <div className="flex flex-1 flex-col justify-between bg-[#101116] p-4 font-mono text-xs text-[#9ca3af]">
      <span>Cargando {file}...</span>
      <span className="text-[11px] text-[#636b7f]">Preparando entorno interactivo</span>
    </div>
  );
}
