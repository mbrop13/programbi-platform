"use client";

// =============================================================================
// Hook de progreso del módulo de Práctica.
//
// Persistencia en localStorage con soporte para:
//   - Avance de lecciones (niveles completados)
//   - XP Total & Vidas
//   - Meta Diaria de XP & Avance Diario (todayXPEarned)
//   - Racha (streakDays)
//   - Unidad activa elegida por el usuario
//   - Estado del tutorial Onboarding (hasCompletedOnboarding)
// =============================================================================

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "programbi:practice:progress:v2";
const MAX_HEARTS = 5;

export interface PracticeProgress {
  // "unitId:levelId" -> { completed, bestHearts }
  levels: Record<string, { completed: boolean; bestHearts: number }>;
  xpTotal: number;
  hasCompletedOnboarding: boolean;
  activeUnitId: string;
  dailyGoalXP: number; // 10, 20, 30, 50
  todayXPEarned: number;
  streakDays: number;
  lastActiveDate: string; // ISO format (YYYY-MM-DD)
}

const EMPTY: PracticeProgress = {
  levels: {},
  xpTotal: 0,
  hasCompletedOnboarding: false,
  activeUnitId: "power-bi",
  dailyGoalXP: 20,
  todayXPEarned: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split("T")[0],
};

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function load(): PracticeProgress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);

    const today = getTodayString();
    let todayXP = parsed.todayXPEarned ?? 0;
    let streak = parsed.streakDays ?? 1;
    const lastDate = parsed.lastActiveDate ?? today;

    // Reset daily XP if day changed
    if (lastDate !== today) {
      todayXP = 0;
      // Streak logic: if missed more than 1 day, reset streak to 1
      const last = new Date(lastDate).getTime();
      const current = new Date(today).getTime();
      const diffDays = Math.floor((current - last) / (1000 * 3600 * 24));
      if (diffDays > 1) {
        streak = 1;
      }
    }

    return {
      levels: parsed.levels ?? {},
      xpTotal: parsed.xpTotal ?? 0,
      hasCompletedOnboarding: parsed.hasCompletedOnboarding ?? false,
      activeUnitId: parsed.activeUnitId ?? "power-bi",
      dailyGoalXP: parsed.dailyGoalXP ?? 20,
      todayXPEarned: todayXP,
      streakDays: streak,
      lastActiveDate: today,
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

        const today = getTodayString();
        const addedXP = alreadyDone ? 0 : xp;

        const next: PracticeProgress = {
          ...prev,
          levels: { ...prev.levels, [key]: { completed: true, bestHearts } },
          xpTotal: prev.xpTotal + addedXP,
          todayXPEarned: prev.todayXPEarned + addedXP,
          lastActiveDate: today,
        };
        save(next);
        return next;
      });
    },
    []
  );

  const completeOnboarding = useCallback((unitId: string, dailyGoalXP: number) => {
    setProgress((prev) => {
      const next: PracticeProgress = {
        ...prev,
        hasCompletedOnboarding: true,
        activeUnitId: unitId,
        dailyGoalXP: dailyGoalXP,
      };
      save(next);
      return next;
    });
  }, []);

  const setActiveUnit = useCallback((unitId: string) => {
    setProgress((prev) => {
      const next: PracticeProgress = {
        ...prev,
        activeUnitId: unitId,
      };
      save(next);
      return next;
    });
  }, []);

  const setDailyGoal = useCallback((dailyGoalXP: number) => {
    setProgress((prev) => {
      const next: PracticeProgress = {
        ...prev,
        dailyGoalXP: dailyGoalXP,
      };
      save(next);
      return next;
    });
  }, []);

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
    completeOnboarding,
    setActiveUnit,
    setDailyGoal,
    resetProgress,
  };
}