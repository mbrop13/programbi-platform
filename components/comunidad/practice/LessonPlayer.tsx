"use client";

// =============================================================================
// LessonPlayer · Flujo de una lección (estilo Duolingo).
//
// - Barra de progreso arriba con corazones (vidas).
// - Una pregunta a la vez, con transición lateral entre ejercicios.
// - "Comprobar" → panel inferior con feedback (correcto/incorrecto) + glow y
//   confetti en aciertos → "Continuar".
// - Pantalla final con XP animado, racha de aciertos y reintentar.
// - Atajos de teclado: Enter = Comprobar/Continuar, 1–4 = seleccionar opción.
// =============================================================================

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  X,
  Check,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Star,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Exercise,
  Level,
  MultipleChoiceData,
  Unit,
} from "@/lib/practice/types";
import {
  MultipleChoiceRenderer,
  SelectAllRenderer,
  ArrangeRenderer,
  MatchPairsRenderer,
  FillBlankRenderer,
} from "./ExerciseRenderers";
import Confetti from "./Confetti";

interface Props {
  unit: Unit;
  level: Level;
  maxHearts: number;
  onClose: () => void;
  onComplete: (heartsLeft: number) => void;
}

// El payload depende del tipo de ejercicio:
//   multiple-choice: number | null
//   select-all / arrange: number[] | string[]
//   fill-blank: string
//   match-pairs: "done" (la validación es interna del renderer)
type AnswerPayload = number | number[] | string[] | string | null;

interface AnswerState {
  payload: AnswerPayload;
  isCorrect: boolean | null; // null mientras no responde
}

export default function LessonPlayer({
  unit,
  level,
  maxHearts,
  onClose,
  onComplete,
}: Props) {
  const exercises = level.exercises;
  const [step, setStep] = useState(0);
  const [hearts, setHearts] = useState(maxHearts);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState<"win" | "lose" | null>(null);
  const [burst, setBurst] = useState(0); // dispara confetti al acertar
  const [streak, setStreak] = useState(0);
  const [wrongShake, setWrongShake] = useState(false);
  const [lossLocked, setLossLocked] = useState(false); // esperando feedback antes de "perdiste"

  const current = exercises[step];
  const progressPct = (step / Math.max(1, exercises.length)) * 100;
  const calledOnCompleteRef = useRef(false);

  const hasAnswer = () => {
    const a = answers[current?.id];
    return !!(a && a.isCorrect !== null);
  };

  const currentCorrect = answers[current?.id]?.isCorrect ?? false;

  // ── Acciones principales ───────────────────────────────────────────────
  const handleCheck = () => {
    if (!hasAnswer() || checked) return;
    const a = answers[current.id];
    setChecked(true);
    if (a.isCorrect) {
      setStreak((s) => s + 1);
      setBurst((b) => b + 1);
    } else {
      setStreak(0);
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 500);
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);
      if (newHearts === 0) {
        // Dejamos ver el feedback y luego vamos a "perdiste".
        setLossLocked(true);
      }
    }
  };

  const handleContinue = () => {
    if (lossLocked) {
      setFinished("lose");
      return;
    }
    if (step + 1 >= exercises.length) {
      setFinished("win");
      if (!calledOnCompleteRef.current) {
        calledOnCompleteRef.current = true;
        onComplete(hearts);
      }
      return;
    }
    setStep((s) => s + 1);
    setChecked(false);
  };

  const restart = () => {
    calledOnCompleteRef.current = false;
    setStep(0);
    setHearts(maxHearts);
    setAnswers({});
    setChecked(false);
    setFinished(null);
    setStreak(0);
    setLossLocked(false);
  };

  // ── Atajos de teclado ──────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished) return;
      if (e.key === "Enter") {
        e.preventDefault();
        if (checked) handleContinue();
        else if (hasAnswer()) handleCheck();
        return;
      }
      // 1–4 para multiple-choice si no se ha comprobado todavía.
      if (!checked && current?.type === "multiple-choice" && /^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const data = current.data as MultipleChoiceData;
        if (idx < data.options.length) {
          setAnswers((prev) => ({
            ...prev,
            [current.id]: { payload: idx, isCorrect: idx === data.correctIndex },
          }));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, current, answers, finished, hearts, step, lossLocked]);

  // ── Pantalla de resultado final ────────────────────────────────────────
  if (finished === "win") {
    return (
      <FinalScreen
        title="¡Lección completada!"
        subtitle={`Ganaste ${level.xp} XP`}
        hearts={hearts}
        streak={streak}
        xp={level.xp}
        accent={unit.accentColor}
        ok
        onClose={onClose}
        onRestart={restart}
      />
    );
  }
  if (finished === "lose") {
    return (
      <FinalScreen
        title="Te quedaste sin corazones"
        subtitle="¡No te rindas, inténtalo de nuevo!"
        hearts={0}
        streak={streak}
        xp={0}
        accent={unit.accentColor}
        ok={false}
        onClose={onClose}
        onRestart={restart}
      />
    );
  }

  // ── Nivel sin ejercicios (placeholder) ─────────────────────────────────
  if (exercises.length === 0) {
    return (
      <Shell accent={unit.accentColor} onClose={onClose} hearts={hearts} progressPct={0}>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="w-20 h-20 rounded-xl flex items-center justify-center mb-5"
            style={{ background: `${unit.accentColor}20` }}
          >
            <BookOpen className="w-10 h-10" style={{ color: unit.accentColor }} />
          </motion.div>
          <h2 className="font-display font-bold text-2xl mb-2 text-gray-900 dark:text-white">
            Nivel en preparación
          </h2>
          <p className="text-gray-500 max-w-sm">
            Este nivel todavía no tiene ejercicios. Agrégalos en
            <code className="mx-1 px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-sm">
              lib/practice/levels.ts
            </code>
          </p>
        </div>
      </Shell>
    );
  }

  // ── Pantalla de ejercicio ──────────────────────────────────────────────
  return (
    <Shell accent={unit.accentColor} onClose={onClose} hearts={hearts} progressPct={progressPct}>
      {/* confetti on correct */}
      <AnimatePresence>
        {burst > 0 && <Confetti key={burst} count={28} duration={1.1} />}
      </AnimatePresence>

      {/* prompt */}
      <div className="mt-6 mb-5">
        <AnimatePresence mode="wait">
          <motion.h2
            key={current.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="font-display font-bold text-2xl text-gray-900 dark:text-white"
          >
            {current.prompt}
          </motion.h2>
        </AnimatePresence>
        {current.hint && !checked && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-orange-500 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" /> {current.hint}
          </motion.p>
        )}
      </div>

      {/* renderer */}
      <motion.div
        animate={wrongShake ? { x: [0, -10, 10, -6, 6, 0] } : {}}
        transition={{ duration: 0.45 }}
        className="flex-1"
      >
        <ExerciseBody
          key={current.id}
          exercise={current}
          state={answers[current.id]}
          setState={(payload, isCorrect) =>
            setAnswers((prev) => ({
              ...prev,
              [current.id]: { payload, isCorrect },
            }))
          }
        />
      </motion.div>

      {/* footer de control */}
      <FooterBar
        checked={checked}
        accent={unit.accentColor}
        canCheck={hasAnswer()}
        lastCorrect={currentCorrect}
        explanation={current.explanation}
        onCheck={handleCheck}
        onContinue={handleContinue}
      />
    </Shell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shell: contenedor a pantalla completa con header (progreso + vidas).
// ─────────────────────────────────────────────────────────────────────────────
function Shell({
  accent,
  onClose,
  hearts,
  progressPct,
  children,
}: {
  accent: string;
  onClose: () => void;
  hearts: number;
  progressPct: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-gray-50 dark:bg-zinc-950 flex flex-col"
    >
      <header className="w-full max-w-3xl mx-auto px-5 pt-5 flex items-center gap-4 w-full">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-200/50 dark:hover:bg-zinc-800 transition-colors shrink-0"
          aria-label="Salir"
        >
          <X className="w-6 h-6" />
        </button>

        {/* barra de progreso */}
        <div className="flex-1 h-4 rounded-full bg-gray-200/80 dark:bg-zinc-800 overflow-hidden relative">
          <motion.div
            className="h-full rounded-full relative"
            style={{ background: accent }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* brillo deslizante */}
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <motion.span
                className="absolute inset-y-0 -left-1/3 w-1/3"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                }}
                animate={{ x: ["0%", "450%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        </div>

        {/* vidas */}
        <div className="flex items-center gap-1.5 text-rose-500 shrink-0">
          <Heart className="w-6 h-6 fill-rose-500" />
          <span className="font-bold text-lg w-5 text-center">{hearts}</span>
        </div>
      </header>

      <div className="w-full max-w-2xl mx-auto px-5 pt-4 flex-1 flex flex-col pb-28">
        {children}
      </div>
    </motion.div>
  );
}

function ExerciseBody({
  exercise,
  state,
  setState,
}: {
  exercise: Exercise;
  state: AnswerState | undefined;
  setState: (payload: AnswerPayload, isCorrect: boolean | null) => void;
}) {
  switch (exercise.type) {
    case "multiple-choice": {
      const sel = (state?.payload as number | null) ?? null;
      return (
        <MultipleChoiceRenderer
          ex={exercise}
          selected={sel}
          onSelect={(i, isCorrect) => setState(i, isCorrect)}
        />
      );
    }
    case "select-all": {
      const sel = (state?.payload as number[]) ?? [];
      return (
        <SelectAllRenderer
          ex={exercise}
          selected={sel}
          onToggle={(indices, isCorrect) => setState(indices, isCorrect)}
        />
      );
    }
    case "arrange": {
      const order = (state?.payload as string[]) ?? [];
      return (
        <ArrangeRenderer
          ex={exercise}
          order={order}
          onChange={(order, isCorrect) => setState(order, isCorrect)}
        />
      );
    }
    case "match-pairs": {
      return (
        <MatchPairsRenderer
          ex={exercise}
          onAnswer={(isCorrect) => setState("done", isCorrect)}
        />
      );
    }
    case "fill-blank": {
      const val = (state?.payload as string) ?? "";
      return (
        <FillBlankRenderer
          ex={exercise}
          value={val}
          onChange={(v, isCorrect) => setState(v, isCorrect)}
        />
      );
    }
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FooterBar: botón Comprobar / panel de feedback.
// ─────────────────────────────────────────────────────────────────────────────
function FooterBar({
  checked,
  canCheck,
  lastCorrect,
  explanation,
  onCheck,
  onContinue,
  accent,
}: {
  checked: boolean;
  canCheck: boolean;
  lastCorrect: boolean;
  explanation: string;
  onCheck: () => void;
  onContinue: () => void;
  accent: string;
}) {
  return (
    <AnimatePresence mode="wait">
      {!checked ? (
        <motion.div
          key="check"
          className="fixed bottom-0 left-0 right-0 px-5 pb-5"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <div className="w-full max-w-2xl mx-auto flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline">
              Enter para comprobar
            </span>
            <button
              onClick={onCheck}
              disabled={!canCheck}
              className={cn(
                "flex-1 h-14 rounded-2xl font-bold text-white text-base uppercase tracking-wide transition-all",
                canCheck ? "shadow-lg active:scale-[0.98]" : "opacity-40 cursor-not-allowed"
              )}
              style={{ background: accent }}
            >
              Comprobar
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="feedback"
          className={cn(
            "fixed bottom-0 left-0 right-0 px-5 pb-5 border-t-2",
            lastCorrect
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-400"
          )}
          initial={{ y: 220 }}
          animate={{ y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          {/* glow superior */}
          <div
            className={cn(
              "absolute -top-px left-0 right-0 h-1",
              lastCorrect ? "bg-emerald-400" : "bg-rose-400"
            )}
            style={{
              boxShadow: lastCorrect
                ? "0 0 24px 4px rgba(16,185,129,0.6)"
                : "0 0 24px 4px rgba(244,63,94,0.6)",
            }}
          />
          <div className="w-full max-w-2xl mx-auto py-4 relative">
            <div className="flex items-center gap-3 mb-2">
              <motion.span
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0",
                  lastCorrect ? "bg-emerald-500" : "bg-rose-500"
                )}
              >
                {lastCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
              </motion.span>
              <h3
                className={cn(
                  "font-display font-bold text-xl",
                  lastCorrect
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-rose-700 dark:text-rose-300"
                )}
              >
                {lastCorrect ? "¡Excelente!" : "Casi… inténtalo de nuevo"}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-zinc-300 mb-3 pl-[52px] pr-2">
              {explanation}
            </p>
            <button
              onClick={onContinue}
              className="w-full h-14 rounded-2xl font-bold text-white text-base shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              style={{ background: lastCorrect ? "#10B981" : "#EF4444" }}
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FinalScreen: pantalla final con XP animado.
// ─────────────────────────────────────────────────────────────────────────────
function FinalScreen({
  title,
  subtitle,
  hearts,
  streak,
  xp,
  accent,
  ok,
  onClose,
  onRestart,
}: {
  title: string;
  subtitle: string;
  hearts: number;
  streak: number;
  xp: number;
  accent: string;
  ok: boolean;
  onClose: () => void;
  onRestart: () => void;
}) {
  const [displayXp, setDisplayXp] = useState(0);
  useEffect(() => {
    if (!ok || xp <= 0) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 800);
      setDisplayXp(Math.round(p * xp));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ok, xp]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center text-center p-6"
    >
      {ok && <Confetti count={70} duration={1.8} />}

      <motion.div
        initial={{ scale: 0, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl mb-6 shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
          boxShadow: `0 16px 40px -12px ${accent}cc`,
        }}
      >
        {ok ? "🎉" : "💪"}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-display font-black text-3xl sm:text-4xl text-gray-900 dark:text-white mb-2"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-gray-500 mb-8"
      >
        {subtitle}
      </motion.p>

      <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-8">
        <StatCard
          icon={<Heart className="w-5 h-5 fill-rose-500 text-rose-500" />}
          label="Corazones"
          value={`${hearts}`}
          color="#F43F5E"
        />
        <StatCard
          icon={<Star className="w-5 h-5 fill-amber-400 text-amber-500" />}
          label="XP"
          value={ok ? `${displayXp}` : "0"}
          color="#F59E0B"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-orange-500" />}
          label="Racha"
          value={`${streak}`}
          color="#F97316"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <button
          onClick={onRestart}
          className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-zinc-700 font-bold text-gray-700 dark:text-zinc-200 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <RotateCcw className="w-5 h-5" /> Reintentar
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl font-bold text-white shadow-lg"
          style={{ background: accent }}
        >
          Volver
        </button>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/40 p-4 text-left">
      <div className="flex items-center gap-1.5 mb-1" style={{ color }}>
        {icon}
        <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
          {label}
        </span>
      </div>
      <div className="text-2xl font-display font-black text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}
