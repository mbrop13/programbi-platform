"use client";

import { useEffect, useState } from "react";
import { GuiaTocNav, type GuiaTocItem } from "@/components/guias/GuiaEditorialPrimitives";

export interface ItemTocPasoAPaso {
  id: string;
  texto: string;
  nivel: 2 | 3;
}

const PROGRESS_EVENT = "programbi-guia-progreso";

function storageKey(slug: string): string {
  return `programbi-guia-progreso:${slug}`;
}

function readCompletedSteps(slug: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeCompletedSteps(slug: string, completedIds: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(completedIds));
  } catch {
    // Ignorar errores de almacenamiento privado
  }
  window.dispatchEvent(
    new CustomEvent(PROGRESS_EVENT, {
      detail: { slug, completedIds },
    }),
  );
}

function useGuiaStepProgress(slug: string) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    setCompletedIds(readCompletedSteps(slug));

    function onCustomEvent(event: Event) {
      const custom = event as CustomEvent<{ slug?: string; completedIds?: string[] }>;
      if (custom.detail?.slug === slug && Array.isArray(custom.detail.completedIds)) {
        setCompletedIds(custom.detail.completedIds);
      }
    }

    function onStorage(event: StorageEvent) {
      if (event.key === storageKey(slug)) {
        setCompletedIds(readCompletedSteps(slug));
      }
    }

    window.addEventListener(PROGRESS_EVENT, onCustomEvent);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, onCustomEvent);
      window.removeEventListener("storage", onStorage);
    };
  }, [slug]);

  function toggleStep(stepId: string) {
    const current = readCompletedSteps(slug);
    const exists = current.includes(stepId);
    const next = exists ? current.filter((id) => id !== stepId) : [...current, stepId];
    setCompletedIds(next);
    writeCompletedSteps(slug, next);
  }

  function resetProgress() {
    setCompletedIds([]);
    writeCompletedSteps(slug, []);
  }

  return { completedIds, toggleStep, resetProgress };
}

export function GuiaPasoStepHeader({
  slug,
  stepId,
  numeroPaso,
  titulo,
}: {
  slug: string;
  stepId: string;
  numeroPaso: string;
  titulo: string;
}) {
  const { completedIds, toggleStep } = useGuiaStepProgress(slug);
  const isDone = completedIds.includes(stepId);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3.5">
        <span
          aria-hidden="true"
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-semibold tabular-nums transition-colors duration-200",
            isDone
              ? "border-[var(--g-ok)]/30 bg-[var(--g-ok-soft)] text-[var(--g-ok)]"
              : "border-[var(--g-accent)]/20 bg-[var(--g-accent-soft)] text-[var(--g-accent)]",
          ].join(" ")}
        >
          {isDone ? (
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
              <path
                d="M3.5 8.5l3 3 6-6.5"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            numeroPaso
          )}
        </span>

        <h2
          id={`${stepId}-titulo`}
          className="min-w-0 pt-0.5 text-xl font-bold tracking-[-0.02em] text-[var(--g-ink)] sm:text-2xl"
        >
          {titulo}
        </h2>
      </div>

      <button
        type="button"
        aria-pressed={isDone}
        onClick={() => toggleStep(stepId)}
        className={[
          "inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 self-start rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors sm:min-h-[34px]",
          isDone
            ? "border-[var(--g-ok)]/30 bg-[var(--g-ok-soft)] text-[var(--g-ok)] hover:border-[var(--g-ok)]/50"
            : "border-[var(--g-border-strong)] bg-[var(--g-bg)] text-[var(--g-ink)] hover:border-[var(--g-accent)] hover:text-[var(--g-accent)]",
        ].join(" ")}
      >
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M5.5 8.25l1.75 1.75 3.25-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{isDone ? "Completado" : "Marcar paso listo"}</span>
      </button>
    </div>
  );
}

export function GuiaPasoProgressWidget({
  slug,
  stepIds,
  className,
}: {
  slug: string;
  stepIds: string[];
  className?: string;
}) {
  const { completedIds, resetProgress } = useGuiaStepProgress(slug);

  if (stepIds.length === 0) return null;

  const doneCount = stepIds.filter((id) => completedIds.includes(id)).length;
  const totalCount = stepIds.length;
  const pct = Math.round((doneCount / totalCount) * 100);
  const allDone = doneCount === totalCount;

  return (
    <div
      className={[
        "rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 shadow-[var(--g-card-shadow)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-[var(--g-ink)]">
          Progreso: {doneCount} / {totalCount} pasos
        </p>
        <span
          className={[
            "font-mono text-xs font-semibold tabular-nums",
            allDone ? "text-[var(--g-ok)]" : "text-[var(--g-accent)]",
          ].join(" ")}
        >
          {pct}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={doneCount}
        aria-valuemin={0}
        aria-valuemax={totalCount}
        aria-label={`Progreso de la guía: ${doneCount} de ${totalCount} pasos completados`}
        className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[var(--g-wash)]"
      >
        <div
          className={[
            "h-full rounded-full transition-all duration-300 ease-out",
            allDone ? "bg-[var(--g-ok)]" : "bg-[var(--g-accent)]",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[11px] text-[var(--g-subtle)]">
          {allDone
            ? "Taller completado"
            : "Marca cada paso al terminarlo"}
        </span>
        {doneCount > 0 ? (
          <button
            type="button"
            onClick={resetProgress}
            className="inline-flex min-h-[44px] items-center text-[11px] font-medium text-[var(--g-subtle)] underline decoration-[var(--g-border-strong)] underline-offset-2 transition-colors hover:text-[var(--g-ink)] sm:min-h-[28px]"
          >
            Reiniciar
          </button>
        ) : null}
      </div>
    </div>
  );
}

function mapTocItems(items: ItemTocPasoAPaso[]): GuiaTocItem[] {
  return items.map((item) => ({
    id: item.id,
    label: item.texto,
    level: item.nivel,
  }));
}

export function GuiaPasoAPasoTocDesktop({
  items,
  sticky = true,
}: {
  items: ItemTocPasoAPaso[];
  sticky?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <GuiaTocNav
      items={mapTocItems(items)}
      title="En esta guía"
      sticky={sticky}
      className="hidden lg:block"
    />
  );
}

export function GuiaPasoAPasoTocMobile({ items }: { items: ItemTocPasoAPaso[] }) {
  if (items.length === 0) return null;

  return (
    <GuiaTocNav
      items={mapTocItems(items)}
      title="En esta guía"
      mobileLabel="En esta guía"
      className="mt-6 lg:hidden"
    />
  );
}
