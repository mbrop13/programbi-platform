"use client";

// =============================================================================
// Hook de progreso del módulo de Práctica.
//
// Persistencia simple en localStorage (no usa Supabase): suficiente para
// "estructura + diseño". Cuando quieras guardar en servidor, reemplaza las
// funciones load/save por llamadas a tu API de Supabase.
//
// Estado guardado por par unitId/levelId:
//   - completed: boolean
//   - bestHearts: corazones restantes en el mejor intento
//
// Estado global:
//   - xpTotal
//   - hearts: vidas actuales (regenerables; aquí estáticas en 5)
// =============================================================================

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "programbi:practice:progress:v1";
const MAX_HEARTS = 5;

export interface PracticeProgress {
  // "unitId:levelId" -> { completed, bestHearts }
  levels: Record<string, { completed: boolean; bestHearts: number }>;
  xpTotal: number;
}

const EMPTY: PracticeProgress = { levels: {}, xpTotal: 0 };

function load(): PracticeProgress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return {
      levels: parsed.levels ?? {},
      xpTotal: parsed.xpTotal ?? 0,
    };
  } catch {
    return EMPTY;
  }
}

function save(p: PracticeProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* quota / modo privado: lo ignoramos silenciosamente */
  }
}

export function usePracticeProgress() {
  const [progress, setProgress] = useState<PracticeProgress>(EMPTY);

  // Cargar al montar: necesario para leer localStorage sólo en el cliente y
  // evitar desincronía de hidratación SSR (el servidor no tiene localStorage).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(load());
  }, []);

  const markLevelComplete = useCallback(
    (unitId: string, levelId: string, xp: number, heartsLeft: number) => {
      setProgress((prev) => {
        const key = `${unitId}:${levelId}`;
        const existing = prev.levels[key];
        const bestHearts = existing ? Math.max(existing.bestHearts, heartsLeft) : heartsLeft;
        const alreadyDone = existing?.completed ?? false;
        const next: PracticeProgress = {
          levels: { ...prev.levels, [key]: { completed: true, bestHearts } },
          xpTotal: alreadyDone ? prev.xpTotal : prev.xpTotal + xp,
        };
        save(next);
        return next;
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    save(EMPTY);
    setProgress(EMPTY);
  }, []);

  const isLevelCompleted = useCallback(
    (unitId: string, levelId: string) => {
      return !!progress.levels[`${unitId}:${levelId}`]?.completed;
    },
    [progress]
  );

  return {
    progress,
    maxHearts: MAX_HEARTS,
    isLevelCompleted,
    markLevelComplete,
    resetProgress,
  };
}