"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Code2, Database } from "lucide-react";
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
const ROTACION_MS = 9000;

/**
 * Panel del hero: una vitrina de tres cursos. La pestaña activa muestra la
 * herramienta en uso y, pegada debajo, la franja con su próxima cohorte.
 *
 * Power BI va en el primer render (HTML del servidor, sin esperar JS). Los
 * editores de SQL y Python se cargan en reposo, fuera del camino crítico.
 * `children` es la miniatura del profesor, que flota sobre la esquina.
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
  const [cambios, setCambios] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [conMovimiento, setConMovimiento] = useState(false);
  const [editores, setEditores] = useState<Editores | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      import("@/components/marketing/HeroEditors").then((mod) => {
        if (alive) setEditores(mod);
      });
    };
    setConMovimiento(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
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

  // Solo rota cuando el siguiente panel ya está descargado y nadie lo mira de cerca.
  const rotando = conMovimiento && !paused && !hover && editores !== null;

  useEffect(() => {
    if (!rotando) return;
    const t = window.setTimeout(() => {
      setActive((cur) => HERO_TABS[(HERO_TABS.findIndex((x) => x.id === cur) + 1) % HERO_TABS.length].id);
      setCambios((n) => n + 1);
    }, ROTACION_MS);
    return () => window.clearTimeout(t);
  }, [rotando, active]);

  const select = (id: HeroTabId) => {
    setActive(id);
    setCambios((n) => n + 1);
    setPaused(true);
  };

  const current = HERO_TABS.find((t) => t.id === active)!;
  const file = active === "python" ? "ventas.py" : active === "sql" ? "consulta.sql" : demo.pbix;
  // El primer render no se anima: es el contenido que define el LCP del hero.
  const entrada = cambios > 0 ? "animate-fade-in" : "";

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="pointer-events-none absolute -inset-8 rounded-[50px] bg-gradient-to-tr from-ink/10 via-ink/0 to-ink/8 blur-3xl" />

      <div className="relative">
        <div
          className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_30px_90px_-20px_rgba(23,23,22,0.28)] ring-1 ring-ink/5 sm:rounded-[26px]"
          onPointerDown={() => setPaused(true)}
        >
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-line bg-canvas px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex shrink-0 gap-1.5">
                <i className="size-3 rounded-full bg-[#ff5f57]" />
                <i className="size-3 rounded-full bg-[#febc2e]" />
                <i className="size-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-3 hidden min-w-0 items-center gap-2 text-xs font-medium text-mute sm:flex">
                <span className="truncate font-semibold text-ink">{file}</span>
                <span className="text-faint">—</span>
                <span className="text-[11px] text-faint">{current.title}</span>
              </div>
            </div>
            <span className="shrink-0 text-[11px] text-faint">Clase en vivo</span>
          </div>

          <div className="relative h-[min(350px,46vh)] bg-canvas sm:h-[min(430px,48vh)]">
            <div key={active} className={`absolute inset-0 ${entrada}`}>
              {active === "bi" ? (
                <PowerBiCanvas demo={demo} />
              ) : !editores ? (
                <Cargando />
              ) : active === "python" ? (
                <editores.PythonEditor demo={demo} onOpenSql={() => select("sql")} />
              ) : (
                <editores.SqlEditor demo={demo} />
              )}
            </div>
          </div>

          <BarraCurso tab={current} curso={cursos[active]} entrada={entrada} />
        </div>

        {children ? (
          <div className="pointer-events-none absolute -right-1.5 bottom-[80px] sm:-right-3 sm:bottom-[90px]">
            {children}
          </div>
        ) : null}
      </div>

      <div
        role="tablist"
        aria-label="Cursos del panel"
        className="relative mt-3 grid grid-cols-3 gap-1 rounded-2xl border border-line bg-paper/80 p-1"
      >
        {HERO_TABS.map((tab) => {
          const Icon = ICONOS[tab.id];
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => select(tab.id)}
              className={`relative flex min-h-12 items-center justify-center gap-1.5 overflow-hidden rounded-xl px-1.5 text-[13px] font-semibold transition-colors sm:gap-2 sm:px-2 sm:text-sm ${
                isActive
                  ? "bg-ink text-paper shadow-[0_8px_20px_-10px_rgba(23,23,22,0.7)]"
                  : "text-mute hover:bg-wash hover:text-ink"
              }`}
            >
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
              <span className="truncate">{tab.title}</span>
              {isActive && rotando ? (
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
                  <span key={`${tab.id}-${cambios}`} className="hero-tab-progress block h-full bg-white/75" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Franja de venta: el curso de la pestaña activa, su próxima cohorte y el botón. */
function BarraCurso({ tab, curso, entrada }: { tab: Tab; curso: HeroCurso; entrada: string }) {
  const Icon = ICONOS[tab.id];
  const detalle = curso.inicio
    ? [`Inicia ${curso.inicio}`, curso.dias, curso.hora].filter(Boolean).join(" · ")
    : `${curso.horas} h en vivo · Cupos abiertos, consulta fecha`;
  // En el teléfono no cabe la línea completa: fecha y hora de inicio.
  const corto = curso.inicio
    ? [`Inicia ${curso.inicio}`, curso.hora?.split(" ")[0]].filter(Boolean).join(" · ")
    : `${curso.horas} h · Consulta fecha`;

  return (
    <Link
      href={curso.href}
      onClick={() => trackCourseCardClick(tab.slug, "home_hero_panel")}
      className="group/bar flex h-[68px] shrink-0 items-center gap-3 bg-ink px-3.5 text-paper no-underline sm:h-[78px] sm:gap-4 sm:px-5"
    >
      <span key={tab.id} className={`flex min-w-0 flex-1 items-center gap-3 sm:gap-4 ${entrada}`}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 sm:size-11">
          <Icon size={19} strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2.5">
            <span className="truncate text-[15px] font-semibold tracking-tight sm:text-[17px]">
              Curso {tab.title}
            </span>
            {curso.descuento > 0 ? (
              <span className="hidden shrink-0 rounded-full bg-white/12 px-2 py-0.5 text-[11px] font-semibold ring-1 ring-white/15 sm:inline">
                {curso.descuento}% de descuento
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block truncate text-xs text-paper/65 sm:hidden">{corto}</span>
          <span className="mt-0.5 hidden truncate text-[13px] text-paper/65 sm:block">{detalle}</span>
        </span>
      </span>
      <span className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-paper px-4 text-sm font-semibold text-ink transition-colors group-hover/bar:bg-white">
        Ver curso
        <ArrowRight
          size={15}
          className="shrink-0 transition-transform group-hover/bar:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

/** Solo se ve si alguien cambia de pestaña antes de que carguen los editores. */
function Cargando() {
  return (
    <div className="flex h-full flex-col gap-2.5 bg-paper p-5" aria-hidden>
      {[62, 78, 40, 70, 54, 84, 46].map((w, i) => (
        <span key={i} className="h-3 animate-pulse rounded-full bg-wash" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}
