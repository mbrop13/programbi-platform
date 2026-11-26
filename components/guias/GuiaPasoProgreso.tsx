"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useGuiaStepProgress } from "@/components/guias/GuiaPasoAPasoToc";

/* -------------------------------------------------------------------------- */
/* Marcador numerado del paso: el motivo de la guía. Se vuelve verde al hacerlo. */
/* -------------------------------------------------------------------------- */

function Check({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3.5 8.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PasoMarcador({
  slug,
  stepId,
  numero,
  size = "lg",
}: {
  slug: string;
  stepId: string;
  numero: number;
  size?: "lg" | "sm";
}) {
  const { completedIds } = useGuiaStepProgress(slug);
  const hecho = completedIds.includes(stepId);
  return (
    <span
      aria-hidden="true"
      className={[
        "relative z-10 flex shrink-0 items-center justify-center rounded-full font-semibold tabular-nums transition-colors duration-200",
        size === "lg" ? "h-10 w-10 text-[15px]" : "h-8 w-8 text-sm",
        hecho
          ? "bg-[var(--g-ok)] text-white"
          : "border border-[var(--g-border-strong)] bg-[var(--g-surface)] text-[var(--g-ink)]",
      ].join(" ")}
    >
      {hecho ? <Check /> : numero}
    </span>
  );
}

/** Tramo de la línea vertical bajo el marcador: verde si el paso ya se hizo. */
export function PasoLinea({ slug, stepId }: { slug: string; stepId: string }) {
  const { completedIds } = useGuiaStepProgress(slug);
  const hecho = completedIds.includes(stepId);
  return (
    <span
      aria-hidden="true"
      className={[
        "absolute top-12 bottom-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full transition-colors duration-200",
        hecho ? "bg-[var(--g-ok)]/60" : "bg-[var(--g-border-strong)]",
      ].join(" ")}
    />
  );
}

export function PasoBotonHecho({
  slug,
  stepId,
  numero,
  siguienteId,
}: {
  slug: string;
  stepId: string;
  numero: number;
  siguienteId?: string;
}) {
  const { completedIds, toggleStep } = useGuiaStepProgress(slug);
  const hecho = completedIds.includes(stepId);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        type="button"
        aria-pressed={hecho}
        onClick={() => toggleStep(stepId)}
        className={[
          "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
          hecho
            ? "border-[var(--g-ok)]/35 bg-[var(--g-ok-soft)] text-[var(--g-ok)] hover:border-[var(--g-ok)]/60"
            : "border-[var(--g-border-strong)] bg-[var(--g-surface)] text-[var(--g-ink)] hover:border-[var(--g-ink)] active:bg-[var(--g-wash)]",
        ].join(" ")}
      >
        <Check className="h-4 w-4" />
        {hecho ? `Paso ${numero} hecho` : `Marcar el paso ${numero} como hecho`}
      </button>
      {hecho && siguienteId ? (
        <a
          href={`#${siguienteId}`}
          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--g-accent)] underline-offset-4 hover:underline"
        >
          Ir al paso {numero + 1}
        </a>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Índice con progreso                                                        */
/* -------------------------------------------------------------------------- */

export interface ItemIndice {
  id: string;
  texto: string;
  /** Número del paso; los apartados de apoyo (FAQ, errores) no llevan número. */
  numero?: number;
}

function useSeccionActiva(ids: string[]) {
  const [activa, setActiva] = useState(ids[0] ?? "");
  // Clave estable: el arreglo se recrea en cada render del padre.
  const clave = ids.join("|");
  useEffect(() => {
    // Los pasos son largos: la sección activa es la última cuyo inicio ya pasó bajo el header.
    // Un IntersectionObserver no avisa mientras una sección alta cubre toda la pantalla.
    const lista = clave.split("|");
    let raf = 0;
    const calcular = () => {
      raf = 0;
      let actual = lista[0] ?? "";
      for (const id of lista) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) actual = id;
      }
      setActiva(actual);
    };
    const alMover = () => {
      if (!raf) raf = window.requestAnimationFrame(calcular);
    };
    calcular();
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    return () => {
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [clave]);
  return activa;
}

function ListaIndice({
  slug,
  items,
  activa,
  onNavegar,
}: {
  slug: string;
  items: ItemIndice[];
  activa: string;
  onNavegar?: () => void;
}) {
  const { completedIds } = useGuiaStepProgress(slug);
  return (
    <ol className="space-y-0.5">
      {items.map((item) => {
        const esActiva = item.id === activa;
        const hecho = item.numero !== undefined && completedIds.includes(item.id);
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={onNavegar}
              aria-current={esActiva ? "location" : undefined}
              className={[
                "flex min-h-[40px] items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm leading-snug no-underline transition-colors",
                esActiva
                  ? "bg-[var(--g-accent-soft)] font-semibold text-[var(--g-ink)]"
                  : "text-[var(--g-muted)] hover:bg-[var(--g-wash)] hover:text-[var(--g-ink)]",
              ].join(" ")}
            >
              {item.numero !== undefined ? (
                <span
                  aria-hidden="true"
                  className={[
                    "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums",
                    hecho
                      ? "bg-[var(--g-ok)] text-white"
                      : esActiva
                        ? "bg-[var(--g-accent)] text-white"
                        : "border border-[var(--g-border-strong)] text-[var(--g-subtle)]",
                  ].join(" ")}
                >
                  {hecho ? <Check className="h-3 w-3" /> : item.numero}
                </span>
              ) : (
                <span aria-hidden="true" className="w-5 shrink-0" />
              )}
              <span className="min-w-0">
                {item.texto}
                {hecho ? <span className="sr-only"> (hecho)</span> : null}
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function Progreso({ slug, pasos }: { slug: string; pasos: string[] }) {
  const { completedIds, resetProgress } = useGuiaStepProgress(slug);
  const hechos = pasos.filter((id) => completedIds.includes(id)).length;
  const pct = pasos.length ? Math.round((hechos / pasos.length) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs text-[var(--g-muted)]">
        <span>
          <strong className="font-semibold text-[var(--g-ink)] tabular-nums">
            {hechos} de {pasos.length}
          </strong>{" "}
          pasos hechos
        </span>
        {hechos > 0 ? (
          <button
            type="button"
            onClick={resetProgress}
            className="inline-flex min-h-[32px] items-center text-xs font-medium text-[var(--g-subtle)] underline-offset-2 hover:text-[var(--g-ink)] hover:underline"
          >
            Reiniciar
          </button>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-valuenow={hechos}
        aria-valuemin={0}
        aria-valuemax={pasos.length}
        aria-label={`${hechos} de ${pasos.length} pasos hechos`}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--g-wash)]"
      >
        <div
          className="h-full rounded-full bg-[var(--g-ok)] transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Índice fijo en escritorio: pasos numerados con su estado y la sección activa. */
export function IndiceEscritorio({ slug, items }: { slug: string; items: ItemIndice[] }) {
  const ids = items.map((i) => i.id);
  const activa = useSeccionActiva(ids);
  const pasos = items.filter((i) => i.numero !== undefined).map((i) => i.id);
  return (
    <nav aria-label="En esta guía" className="space-y-4">
      <p className="px-2.5 text-sm font-semibold text-[var(--g-ink)]">En esta guía</p>
      <div className="px-2.5">
        <Progreso slug={slug} pasos={pasos} />
      </div>
      <ListaIndice slug={slug} items={items} activa={activa} />
    </nav>
  );
}

/** Índice plegable en móvil, con el avance a la vista sin abrirlo. */
export function IndiceMovil({ slug, items }: { slug: string; items: ItemIndice[] }) {
  const [abierto, setAbierto] = useState(false);
  const panelId = useId();
  const botonRef = useRef<HTMLButtonElement>(null);
  const ids = items.map((i) => i.id);
  const activa = useSeccionActiva(ids);
  const pasos = items.filter((i) => i.numero !== undefined).map((i) => i.id);
  const { completedIds } = useGuiaStepProgress(slug);
  const hechos = pasos.filter((id) => completedIds.includes(id)).length;

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  return (
    <div className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)]">
      <button
        ref={botonRef}
        type="button"
        aria-expanded={abierto}
        aria-controls={panelId}
        onClick={() => setAbierto((v) => !v)}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 text-left"
      >
        <span className="text-sm font-semibold text-[var(--g-ink)]">En esta guía</span>
        <span className="flex items-center gap-2 text-xs text-[var(--g-muted)] tabular-nums">
          {hechos} de {pasos.length} pasos
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={`h-4 w-4 transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {abierto ? (
        <nav id={panelId} aria-label="En esta guía" className="space-y-3 border-t border-[var(--g-border)] p-2 pt-3">
          <div className="px-2.5">
            <Progreso slug={slug} pasos={pasos} />
          </div>
          <ListaIndice slug={slug} items={items} activa={activa} onNavegar={() => setAbierto(false)} />
        </nav>
      ) : null}
    </div>
  );
}
