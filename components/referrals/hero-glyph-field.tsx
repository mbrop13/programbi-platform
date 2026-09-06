"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  text?: string;
  className?: string;
};

/**
 * Renders `text` as a field of · • ● sampled from a real typeface.
 * One boot pass (row printer), then a slow idle twinkle.
 */
export function HeroGlyphField({ text = "15%", className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let cols = 0;
    let rows = 0;
    let cell = 12;
    let sample: number[] = [];
    let started = 0;
    const twinkle = new Map<number, number>();

    const resample = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cell = w < 480 ? 13 : w < 800 ? 12 : 11;
      cols = Math.max(8, Math.floor(w / cell));
      rows = Math.max(6, Math.floor(h / cell));
      sample = sampleGlyph(text, cols, rows);
    };

    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (!started) started = now;
      const elapsed = now - started;
      const revealRows = reduce ? rows : Math.min(rows, Math.floor(elapsed / 28) + 1);

      ctx.clearRect(0, 0, w, h);
      ctx.font = `${Math.floor(cell * 0.92)}px var(--font-mono), ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#171716";

      for (let y = 0; y < rows; y++) {
        if (y >= revealRows) break;
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const t = sample[i] ?? 0;
          const flicker = twinkle.get(i) ?? 0;
          let alpha: number;
          let ch: string;
          if (t > 0.58) {
            ch = "●";
            alpha = 0.78 + flicker * 0.12;
          } else if (t > 0.28) {
            ch = "•";
            alpha = 0.42 + t * 0.35 + flicker * 0.1;
          } else {
            ch = "·";
            alpha = 0.055 + t * 0.12 + flicker * 0.08;
          }
          ctx.globalAlpha = Math.min(0.92, alpha);
          ctx.fillText(ch, x * cell + cell / 2, y * cell + cell / 2);
        }
      }
      ctx.globalAlpha = 1;

      if (!reduce) {
        if (Math.random() < 0.35) {
          const i = Math.floor(Math.random() * cols * rows);
          if ((sample[i] ?? 0) < 0.28) twinkle.set(i, 1);
        }
        for (const [k, v] of twinkle) {
          const next = v - 0.04;
          if (next <= 0) twinkle.delete(k);
          else twinkle.set(k, next);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resample();
    const ro = new ResizeObserver(() => {
      started = 0;
      twinkle.clear();
      resample();
    });
    ro.observe(canvas);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [text]);

  return (
    <div className={cn("relative", className)} aria-hidden>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[clamp(4.5rem,18vw,9rem)] font-semibold leading-none text-ink/[0.04] select-none">
        {text}
      </span>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}

function sampleGlyph(text: string, cols: number, rows: number): number[] {
  const off = document.createElement("canvas");
  off.width = cols;
  off.height = rows;
  const c = off.getContext("2d");
  const out = new Array<number>(cols * rows).fill(0);
  if (!c) return out;

  c.clearRect(0, 0, cols, rows);
  c.fillStyle = "#000";
  c.textAlign = "center";
  c.textBaseline = "middle";
  let size = rows * 0.84;
  c.font = `700 ${size}px Geist, ui-sans-serif, system-ui, sans-serif`;
  while (c.measureText(text).width > cols * 0.96 && size > 10) {
    size -= 1;
    c.font = `700 ${size}px Geist, ui-sans-serif, system-ui, sans-serif`;
  }
  c.fillText(text, cols / 2, rows / 2 + rows * 0.03);
  const { data } = c.getImageData(0, 0, cols, rows);
  for (let i = 0; i < out.length; i++) out[i] = data[i * 4 + 3] / 255;
  return out;
}
