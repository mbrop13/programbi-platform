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
                ? "border-accent bg-accent-soft text-text shadow-sm"
                : "border-border bg-surface text-text hover:border-accent hover:bg-accent-soft"
            )}
          >
            <span
              className={cn(
                "inline-flex items-center justify-center w-7 h-7 rounded-lg border-2 text-[12px] font-bold shrink-0 transition-colors",
                isSel
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-current text-text-muted"
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
                  className="text-text"
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
      <p className="text-sm text-text-muted -mb-1 pl-1">
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
                ? "border-accent bg-accent-soft text-text"
                : "border-border bg-surface text-text hover:border-accent hover:bg-accent-soft"
            )}
          >
            <span
              className={cn(
                "w-7 h-7 rounded-lg border-2 border-current flex items-center justify-center transition-colors shrink-0",
                isSel && "bg-accent border-accent"
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
      <div className="min-h-[72px] rounded-xl border-2 border-dashed border-border p-3 flex flex-wrap gap-2 bg-surface-hover/50 items-center">
        {order.length === 0 && (
          <span className="text-sm text-text-muted px-2">
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
                className="px-3 py-2 rounded-lg bg-surface border-2 border-accent text-text font-mono text-sm font-semibold shadow-sm hover:bg-danger-bg hover:border-danger transition-colors"
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
              className="px-3 py-2 rounded-lg bg-surface-hover border-2 border-border text-text-secondary font-mono text-sm font-semibold hover:border-accent hover:text-text transition-colors"
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
                  "border-accent bg-accent-soft scale-[1.03] shadow-sm",
                matchedId &&
                  "border-accent bg-accent-soft text-text",
                !matchedId &&
                  activeLeft !== l.id &&
                  "border-border bg-surface hover:border-accent"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{l.text}</span>
                {matchedId && <Check className="w-4 h-4 text-text" />}
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
                  "border-accent bg-accent-soft text-text",
                !used &&
                  "border-border bg-surface hover:border-accent"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{r.text}</span>
                {used && <Check className="w-4 h-4 text-text" />}
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
        className="w-full px-4 py-4 rounded-lg border-2 border-border bg-surface text-text text-[15px] font-medium outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all"
      />
      <p className="text-xs text-text-muted mt-2 pl-1">
        Pulsa <kbd className="px-1.5 py-0.5 bg-surface-hover rounded text-[10px] font-mono text-text-secondary">Enter</kbd> para comprobar.
      </p>
    </div>
  );
}
