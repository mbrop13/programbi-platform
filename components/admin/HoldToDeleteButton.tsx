"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function HoldToDeleteButton({
  onConfirm,
  label = "Mantén presionado para eliminar",
  compact = false,
  disabled = false,
  loading = false,
}: {
  onConfirm: () => void;
  label?: string;
  compact?: boolean;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const HOLD_DURATION = 1400;

  const startHold = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (disabled || loading) return;
    setIsHolding(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setProgress(pct);

      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setIsHolding(false);
        setProgress(0);
        onConfirm();
      }
    }, 20);
  };

  const endHold = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (compact) {
    return (
      <button
        type="button"
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onTouchCancel={endHold}
        onClick={(e) => e.stopPropagation()}
        disabled={disabled || loading}
        title="Mantén presionado para eliminar"
        className={cn(
          "relative overflow-hidden size-8 inline-flex items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors select-none touch-none",
          isHolding
            ? "border-destructive/40 bg-destructive/10 text-destructive"
            : "hover:text-destructive hover:bg-destructive/10",
          (disabled || loading) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isHolding && (
          <span
            className="absolute inset-y-0 left-0 bg-destructive/15 pointer-events-none"
            style={{ width: `${progress}%` }}
          />
        )}
        {loading ? (
          <Loader2 className="size-3.5 animate-spin relative z-10" />
        ) : (
          <Trash2 className="size-3.5 relative z-10" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      onClick={(e) => e.stopPropagation()}
      disabled={disabled || loading}
      className={cn(
        "relative overflow-hidden w-full h-9 px-3 rounded-md border text-sm font-medium transition-colors select-none touch-none inline-flex items-center justify-center gap-2",
        isHolding
          ? "border-destructive bg-destructive text-white"
          : "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15",
        (disabled || loading) && "opacity-50 cursor-not-allowed"
      )}
    >
      {isHolding && (
        <span
          className="absolute inset-y-0 left-0 bg-black/10 pointer-events-none"
          style={{ width: `${progress}%` }}
        />
      )}
      {loading ? (
        <Loader2 className="size-3.5 animate-spin relative z-10" />
      ) : (
        <Trash2 className="size-3.5 relative z-10" />
      )}
      <span className="relative z-10">
        {isHolding ? `Mantén presionado (${Math.round(progress)}%)` : label}
      </span>
    </button>
  );
}
