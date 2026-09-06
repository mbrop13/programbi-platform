"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  className?: string;
  format?: (n: number) => string;
  durationMs?: number;
};

export function NumberTicker({
  value,
  className,
  format = (n) => Math.round(n).toLocaleString("es-CL"),
  durationMs = 900,
}: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs, reduce]);

  return (
    <span className={cn("tabular-nums tracking-tight", className)}>
      {format(display)}
    </span>
  );
}
