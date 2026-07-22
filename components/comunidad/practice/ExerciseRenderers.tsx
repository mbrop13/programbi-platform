"use client";

// =============================================================================
// Renderers por tipo de ejercicio.
// Cada uno expone su UI y, mediante callbacks, reporta al LessonPlayer si la
// respuesta actual es correcta (isCorrect) para habilitar "Comprobar".
// =============================================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Exercise,
  MultipleChoiceData,
  SelectAllData,
  ArrangeData,
  MatchPairsData,
  FillBlankData,
} from "@/lib/practice/types";

// ─── multiple-choice ─────────────────────────────────────────────────────────
export function MultipleChoiceRenderer({
  ex,
  selected,
  onSelect,
}: {
  ex: Exercise;
  selected: number | null;
  onSelect: (i: number, isCorrect: boolean) => void;
}) {
  const data = ex.data as MultipleChoiceData;
  return (
    <div className="grid gap-3">
      {data.options.map((opt, i) => {
        const isSel = selected === i;
        return (
          <motion.button
            key={i}
            layout
            onClick={() => onSelect(i, i === data.correctIndex)}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "w-full text-left px-4 py-4 rounded-2xl border-2 font-medium text-[15px] transition-all flex items-center gap-3",
              isSel
                ? "border-brand-blue bg-brand-blue/10 text-brand-blue-dark dark:text-white shadow-sm"
                : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 hover:border-brand-blue/50 hover:bg-brand-blue/5"
            )}
          >
            <span
              className={cn(
                "inline-flex items-center justify-center w-7 h-7 rounded-lg border-2 text-[12px] font-bold shrink-0 transition-colors",
                isSel
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-current text-gray-400"
              )}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1">{opt}</span>
            <AnimatePresence>
              {isSel && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-brand-blue"
                >
                  <Check className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── select-all ──────────────────────────────────────────────────────────────
export function SelectAllRenderer({
  ex,
  selected,
  onToggle,
}: {
  ex: Exercise;
  selected: number[];
  onToggle: (indices: number[], isCorrect: boolean) => void;
}) {
  const data = ex.data as SelectAllData;
  const toggle = (i: number) => {
    const next = selected.includes(i)
      ? selected.filter((x) => x !== i)
      : [...selected, i].sort((a, b) => a - b);
    const correct =
      next.length === data.correctIndices.length &&
      next.every((x) => data.correctIndices.includes(x));
    onToggle(next, correct);
  };
  return (
    <div className="grid gap-3">
      <p className="text-sm text-gray-400 -mb-1 pl-1">
        Selecciona <strong>todas</strong> las que correspondan.
      </p>
      {data.options.map((opt, i) => {
        const isSel = selected.includes(i);
        return (
          <motion.button
            key={i}
            layout
            onClick={() => toggle(i)}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "w-full text-left px-4 py-4 rounded-2xl border-2 font-medium text-[15px] transition-all flex items-center gap-3",
              isSel
                ? "border-brand-blue bg-brand-blue/10 text-brand-blue-dark dark:text-white"
                : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 hover:border-brand-blue/50"
            )}
          >
            <span
              className={cn(
                "w-7 h-7 rounded-lg border-2 border-current flex items-center justify-center transition-colors shrink-0",
                isSel && "bg-brand-blue border-brand-blue"
              )}
            >
              <AnimatePresence>
                {isSel && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── arrange (ordenar tokens) ────────────────────────────────────────────────
export function ArrangeRenderer({
  ex,
  order,
  onChange,
}: {
  ex: Exercise;
  order: string[];
  onChange: (order: string[], isCorrect: boolean) => void;
}) {
  const data = ex.data as ArrangeData;
  const placedIds = order;
  const remaining = data.tokens.filter((t) => !placedIds.includes(t.id));

  const add = (id: string) => {
    const next = [...order, id];
    const correct =
      next.length === data.correctOrder.length &&
      next.every((id, i) => id === data.correctOrder[i]);
    onChange(next, correct);
  };
  const removeAt = (i: number) => {
    const next = order.filter((_, idx) => idx !== i);
    const correct =
      next.length === data.correctOrder.length &&
      next.every((id, idx) => id === data.correctOrder[idx]);
    onChange(next, correct);
  };

  return (
    <div className="space-y-4">
      {/* zona colocada */}
      <div className="min-h-[72px] rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700 p-3 flex flex-wrap gap-2 bg-gray-50/50 dark:bg-zinc-800/40 items-center">
        {order.length === 0 && (
          <span className="text-sm text-gray-400 dark:text-zinc-500 px-2">
            Toca los tokens de abajo en el orden correcto…
          </span>
        )}
        <AnimatePresence mode="popLayout">
          {order.map((id, i) => {
            const tok = data.tokens.find((t) => t.id === id)!;
            return (
              <motion.button
                key={`${id}-${i}`}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeAt(i)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border-2 border-brand-blue text-gray-900 dark:text-white font-mono text-sm font-semibold shadow-sm hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-400 transition-colors"
              >
                {tok.text}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* tokens disponibles */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {remaining.map((tok) => (
            <motion.button
              key={tok.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => add(tok.id)}
              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 font-mono text-sm font-semibold hover:border-brand-blue hover:text-brand-blue transition-colors"
            >
              {tok.text}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── match-pairs ─────────────────────────────────────────────────────────────
export function MatchPairsRenderer({
  ex,
  onAnswer,
}: {
  ex: Exercise;
  onAnswer: (isCorrect: boolean) => void;
}) {
  const data = ex.data as MatchPairsData;
  const [pairs, setPairs] = useState<Record<string, string>>({}); // leftId -> rightId
  const [activeLeft, setActiveLeft] = useState<string | null>(null);

  const selectLeft = (id: string) => setActiveLeft(id);
  const selectRight = (id: string) => {
    if (!activeLeft) return;
    const cleaned: Record<string, string> = {};
    for (const [l, r] of Object.entries(pairs)) {
      if (r !== id && l !== activeLeft) cleaned[l] = r;
    }
    cleaned[activeLeft] = id;
    setPairs(cleaned);
    setActiveLeft(null);

    if (Object.keys(cleaned).length === data.correctPairs.length) {
      const ok = data.correctPairs.every((p) => cleaned[p.left] === p.right);
      onAnswer(ok);
    }
  };

  const rightUsed = (id: string) => Object.values(pairs).includes(id);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6">
      <div className="space-y-3">
        {data.left.map((l) => {
          const matchedId = pairs[l.id];
          return (
            <motion.button
              key={l.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => selectLeft(l.id)}
              disabled={!!matchedId}
              className={cn(
                "w-full px-4 py-4 rounded-2xl border-2 font-medium text-sm transition-all text-left",
                activeLeft === l.id &&
                  "border-brand-blue bg-brand-blue/10 scale-[1.03] shadow-sm",
                matchedId &&
                  "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
                !matchedId &&
                  activeLeft !== l.id &&
                  "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-brand-blue/50"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{l.text}</span>
                {matchedId && <Check className="w-4 h-4 text-emerald-500" />}
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="space-y-3">
        {data.right.map((r) => {
          const used = rightUsed(r.id);
          return (
            <motion.button
              key={r.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => selectRight(r.id)}
              disabled={used}
              className={cn(
                "w-full px-4 py-4 rounded-2xl border-2 font-medium text-sm transition-all text-left",
                used &&
                  "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
                !used &&
                  "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-brand-blue/50"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{r.text}</span>
                {used && <Check className="w-4 h-4 text-emerald-500" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── fill-blank ──────────────────────────────────────────────────────────────
export function FillBlankRenderer({
  ex,
  value,
  onChange,
}: {
  ex: Exercise;
  value: string;
  onChange: (val: string, isCorrect: boolean) => void;
}) {
  const data = ex.data as FillBlankData;
  const check = (v: string) => {
    const norm = v.trim().toLowerCase();
    const ok = data.acceptedAnswers.some((a) => a.trim().toLowerCase() === norm);
    onChange(v, ok);
  };
  return (
    <div>
      <input
        type="text"
        value={value}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        placeholder={data.placeholder ?? "Escribe tu respuesta…"}
        onChange={(e) => check(e.target.value)}
        onKeyDown={(e) => {
          // Enter se maneja en el LessonPlayer; lo bloqueamos aquí para evitar
          // dobles eventos.
          if (e.key === "Enter") e.stopPropagation();
        }}
        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-[15px] font-medium outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15 transition-all"
      />
      <p className="text-xs text-gray-400 mt-2 pl-1">
        Pulsa <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[10px] font-mono">Enter</kbd> para comprobar.
      </p>
    </div>
  );
}
