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
};

const OUT_STAGGER = 350;
const OUT_ITEM = 450;
const IN_STAGGER = 350;
const IN_ITEM = 550;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (k: number) => -(Math.cos(Math.PI * k) - 1) / 2;

export function HeroGlyphField({ text = "15%", className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef(text);
  textRef.current = text;
  const swapToRef = useRef<(next: string) => void>(() => {});

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
    let phase: "show" | "out" | "in" = "show";
    let phaseStart = 0;
    let shownText = textRef.current;
    let pendingText = textRef.current;
    const mouse = { x: -9999, y: -9999, on: false };

    const buildDots = (word: string) => {
      const sample = sampleGlyph(word, cols, rows);
      const cell = width < 480 ? 10 : width < 800 ? 9 : 8;
      const next: Dot[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const t = sample[y * cols + x] ?? 0;
          if (t < 0.22) continue;
          next.push({
            x: x * cell + cell / 2,
            y: y * cell + cell / 2,
            r: t > 0.55 ? 2.8 : 2.1,
            phase: (x * 0.37 + y * 0.51) % (Math.PI * 2),
            amp: 1.3,
            speed: 0.22 + ((x + y) % 5) * 0.03,
          });
        }
      }
      dots = next;
    };

    /** Desvanece los puntos y los rearma con la palabra siguiente. */
    const swapTo = (word: string) => {
      pendingText = word;
      if (phase !== "show" || word === shownText) return;
      if (reduce) {
        if (!cols || !rows) return;
        buildDots(word);
        shownText = word;
        return;
      }
      phase = "out";
      phaseStart = performance.now();
    };
    swapToRef.current = swapTo;

    const fadeOf = (i: number, n: number, now: number) => {
      const total = Math.max(n, 1);
      if (phase === "show") return 1;
      const elapsed = now - phaseStart;
      if (phase === "out") {
        const local = clamp01((elapsed - (i / total) * OUT_STAGGER) / OUT_ITEM);
        return 1 - easeInOut(local);
      }
      const local = clamp01((elapsed - (i / total) * IN_STAGGER) / IN_ITEM);
      return easeInOut(local);
    };

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
      shownText = textRef.current;
      pendingText = textRef.current;
      phase = "show";
    };

    const draw = (now: number) => {
      if (!started) started = now;
      const t = (now - started) / 1000;
      const boot = reduce ? 1 : Math.min(1, t / 1.4);

      if (phase === "out" && now - phaseStart >= OUT_STAGGER + OUT_ITEM) {
        buildDots(pendingText);
        shownText = pendingText;
        phase = "in";
        phaseStart = now;
      } else if (phase === "in" && now - phaseStart >= IN_STAGGER + IN_ITEM) {
        phase = "show";
        if (pendingText !== shownText) swapTo(pendingText);
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000000";

      const n = dots.length;
      for (let i = 0; i < n; i++) {
        const d = dots[i];
        const f = fadeOf(i, n, now);
        if (f < 0.02) continue;
        let px = d.x;
        let py = d.y;
        let r = d.r * f * boot;

        if (!reduce) {
          const wave = Math.sin(t * 0.38 + d.x * 0.012 + d.y * 0.01);
          const orbit = t * d.speed + d.phase;
          px += Math.cos(orbit) * d.amp * 0.45;
          py += Math.sin(orbit * 0.9) * d.amp * 0.38 + wave * 0.9;
          r *= 0.955 + 0.045 * Math.sin(t * 0.6 + d.phase);

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
    swapToRef.current(text);
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
