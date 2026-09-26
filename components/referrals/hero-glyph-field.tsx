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
  ox: number;
  oy: number;
  os: number;
  tx: number;
  ty: number;
  ts: number;
  s: number;
  r: number;
  phase: number;
  amp: number;
  speed: number;
  delay: number;
};

const MORPH_DUR = 950;
const STAGGER = 350;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);

export function HeroGlyphField({ text = "15%", className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef(text);
  textRef.current = text;
  const morphToRef = useRef<(next: string) => void>(() => {});

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
    let cols = 0;
    let rows = 0;
    let morphStart = -1e9;
    const mouse = { x: -9999, y: -9999, on: false };

    const progress = (d: Dot, now: number) =>
      reduce ? 1 : easeInOut(clamp01((now - morphStart - d.delay) / MORPH_DUR));

    const current = (d: Dot, now: number) => {
      const e = progress(d, now);
      return {
        x: d.ox + (d.tx - d.ox) * e,
        y: d.oy + (d.ty - d.oy) * e,
        s: d.os + (d.ts - d.os) * e,
      };
    };

    const buildDots = (word: string) => {
      const sample = sampleGlyph(word, cols, rows);
      const cell = width < 480 ? 10 : width < 800 ? 9 : 8;
      const next: Dot[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const t = sample[y * cols + x] ?? 0;
          if (t < 0.22) continue;
          const px = x * cell + cell / 2;
          const py = y * cell + cell / 2;
          next.push({
            x: px,
            y: py,
            ox: px,
            oy: py,
            os: 1,
            tx: px,
            ty: py,
            ts: 1,
            s: 1,
            r: t > 0.55 ? 2.8 : 2.1,
            phase: (x * 0.37 + y * 0.51) % (Math.PI * 2),
            amp: 1.6,
            speed: 0.28 + ((x + y) % 5) * 0.04,
            delay: 0,
          });
        }
      }
      dots = next;
    };

    /** Reacomoda las partículas existentes hacia la nueva palabra. */
    const morphTo = (word: string) => {
      if (!cols || !rows) return;
      const now = performance.now();
      const sample = sampleGlyph(word, cols, rows);
      const cell = width < 480 ? 10 : width < 800 ? 9 : 8;
      const targets: { x: number; y: number; t: number }[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const t = sample[y * cols + x] ?? 0;
          if (t < 0.22) continue;
          targets.push({ x: x * cell + cell / 2, y: y * cell + cell / 2, t });
        }
      }

      // Empareja por orden espacial para un morph coherente.
      const byPos = (a: { x: number; y: number }, b: { x: number; y: number }) =>
        a.y === b.y ? a.x - b.x : a.y - b.y;
      const placed = dots.map((d) => ({ d, ...current(d, now) }));
      placed.sort(byPos);
      targets.sort(byPos);

      if (reduce) {
        dots = targets.map((tg) => ({
          x: tg.x,
          y: tg.y,
          ox: tg.x,
          oy: tg.y,
          os: 1,
          tx: tg.x,
          ty: tg.y,
          ts: 1,
          s: 1,
          r: tg.t > 0.55 ? 2.8 : 2.1,
          phase: 0,
          amp: 0,
          speed: 0.3,
          delay: 0,
        }));
        return;
      }

      const total = Math.max(placed.length, targets.length, 1);
      const paired = Math.min(placed.length, targets.length);
      const next: Dot[] = [];
      for (let i = 0; i < paired; i++) {
        const p = placed[i];
        const tg = targets[i];
        next.push({
          ...p.d,
          ox: p.x,
          oy: p.y,
          os: p.s,
          tx: tg.x,
          ty: tg.y,
          ts: 1,
          r: tg.t > 0.55 ? 2.8 : 2.1,
          delay: (i / total) * STAGGER,
        });
      }
      // Destinos nuevos: nacen en su lugar.
      for (let i = paired; i < targets.length; i++) {
        const tg = targets[i];
        next.push({
          x: tg.x,
          y: tg.y,
          ox: tg.x,
          oy: tg.y,
          os: 0,
          tx: tg.x,
          ty: tg.y,
          ts: 1,
          s: 0,
          r: tg.t > 0.55 ? 2.8 : 2.1,
          phase: (i * 0.37) % (Math.PI * 2),
          amp: 1.6,
          speed: 0.3,
          delay: (i / total) * STAGGER,
        });
      }
      // Partículas sobrantes: se encogen en su lugar.
      for (let i = paired; i < placed.length; i++) {
        const p = placed[i];
        next.push({
          ...p.d,
          ox: p.x,
          oy: p.y,
          os: p.s,
          tx: p.x,
          ty: p.y,
          ts: 0,
          delay: (i / total) * STAGGER,
        });
      }
      dots = next;
      morphStart = now;
    };
    morphToRef.current = morphTo;

    const resample = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = width < 480 ? 10 : width < 800 ? 9 : 8;
      cols = Math.max(8, Math.floor(width / cell));
      rows = Math.max(6, Math.floor(height / cell));
      buildDots(textRef.current);
    };

    const draw = (now: number) => {
      if (!started) started = now;
      const t = (now - started) / 1000;
      const boot = reduce ? 1 : Math.min(1, t / 1.4);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000000";

      for (const d of dots) {
        const c = current(d, now);
        if (c.s < 0.02) continue;
        let px = c.x;
        let py = c.y;
        let r = d.r * c.s * boot;

        if (!reduce) {
          const wave = Math.sin(t * 0.45 + c.x * 0.012 + c.y * 0.01);
          const orbit = t * d.speed + d.phase;
          px += Math.cos(orbit) * d.amp * 0.55;
          py += Math.sin(orbit * 0.9) * d.amp * 0.45 + wave * 1.1;
          r *= 0.94 + 0.08 * Math.sin(t * 0.7 + d.phase);

          if (mouse.on) {
            const dx = px - mouse.x;
            const dy = py - mouse.y;
            const dist = Math.hypot(dx, dy) || 1;
            const push = Math.max(0, 1 - dist / 160) ** 2 * 10;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
          }
        }

        ctx.beginPath();
        ctx.arc(px, py, Math.max(1.1, r), 0, Math.PI * 2);
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
  }, []);

  useEffect(() => {
    morphToRef.current(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
