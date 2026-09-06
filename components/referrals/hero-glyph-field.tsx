"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  text?: string;
  className?: string;
};

type Dot = {
  x: number;
  y: number;
  r: number;
  phase: number;
  amp: number;
  speed: number;
  glyph: number;
};

export function HeroGlyphField({ text = "15%", className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let dots: Dot[] = [];
    let started = 0;
    let width = 0;
    let height = 0;
    const mouse = { x: -9999, y: -9999, on: false };

    const resample = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = width < 480 ? 11 : width < 800 ? 10 : 9;
      const cols = Math.max(8, Math.floor(width / cell));
      const rows = Math.max(6, Math.floor(height / cell));
      const sample = sampleGlyph(text, cols, rows);
      const next: Dot[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const t = sample[y * cols + x] ?? 0;
          const keepField = ((x * 13 + y * 7) % 5) !== 0;
          if (t < 0.18 && !keepField) continue;
          const glyph = t;
          next.push({
            x: x * cell + cell / 2,
            y: y * cell + cell / 2,
            r: glyph > 0.55 ? 2.6 : glyph > 0.22 ? 1.9 : 1.15,
            phase: (x * 0.37 + y * 0.51) % (Math.PI * 2),
            amp: glyph > 0.22 ? 3.2 : 5.5,
            speed: 0.7 + ((x + y) % 5) * 0.12,
            glyph,
          });
        }
      }
      dots = next;
    };

    const draw = (now: number) => {
      if (!started) started = now;
      const t = (now - started) / 1000;
      const boot = reduce ? 1 : Math.min(1, t / 0.9);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000000";

      for (const d of dots) {
        let px = d.x;
        let py = d.y;
        let r = d.r * boot;

        if (!reduce) {
          const wave = Math.sin(t * 1.15 + d.x * 0.018 + d.y * 0.014);
          const orbit = t * d.speed + d.phase;
          px += Math.cos(orbit) * d.amp * (0.45 + d.glyph * 0.2);
          py += Math.sin(orbit * 0.85) * d.amp * 0.7 + wave * 3.4;
          r *= 0.82 + (0.28 + d.glyph * 0.12) * (0.5 + 0.5 * Math.sin(t * 2.1 + d.phase));

          if (mouse.on) {
            const dx = px - mouse.x;
            const dy = py - mouse.y;
            const dist = Math.hypot(dx, dy) || 1;
            const push = Math.max(0, 1 - dist / 140) ** 2 * 28;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
          }
        }

        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.7, r), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.on = true;
    };
    const onLeave = () => {
      mouse.on = false;
    };

    resample();
    const ro = new ResizeObserver(() => {
      started = 0;
      resample();
    });
    ro.observe(canvas);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return (
    <div className={cn("relative", className)} aria-hidden>
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
