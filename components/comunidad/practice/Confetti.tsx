"use client";

// =============================================================================
// Confetti · Motor de partículas en Canvas 2D ultra suave (60 FPS).
// Ráfaga física de papelillos multicolor que se auto-destruye al finalizar.
// =============================================================================

import { useEffect, useRef } from "react";

const COLORS = [
  "#3B82F6", // azul brand
  "#10B981", // verde esmeralda
  "#F59E0B", // ámbar / dorado
  "#EC4899", // rosa
  "#8B5CF6", // violeta
  "#06B6D4", // cian
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle";
}

export default function Confetti({ duration = 2.5 }: { duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generar 70 partículas con física inicial realista
    const particles: Particle[] = Array.from({ length: 70 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      return {
        x: width / 2 + (Math.random() - 0.5) * 200,
        y: height * 0.35 + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5, // Impulso inicial hacia arriba
        size: Math.random() * 8 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      };
    });

    let animationFrameId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = elapsed / duration;

      if (progress >= 1) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Actualizar física
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // Gravedad
        p.vx *= 0.98; // Fricción del aire
        p.vy *= 0.98;
        p.rotation += p.rotationSpeed;

        // Desvanecimiento suave en el 30% final de la animación
        if (progress > 0.7) {
          p.opacity = 1 - (progress - 0.7) / 0.3;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
    />
  );
}
