"use client";

// =============================================================================
// Confetti · Motor de partículas en Canvas 2D a Pantalla Completa (60 FPS).
// Ráfaga física distribuida en todo el ancho superior de la pantalla.
// =============================================================================

import { useEffect, useRef } from "react";

const COLORS = [
  "#3B82F6", // azul brand
  "#10B981", // verde esmeralda
  "#F59E0B", // dorado
  "#EC4899", // rosa
  "#8B5CF6", // violeta
  "#06B6D4", // cian
  "#FF5722", // naranja
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

export default function Confetti({
  count = 120,
  duration = 3.0,
}: {
  count?: number;
  duration?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateDimensions = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const width = canvas.width;
    const height = canvas.height;

    // Generar partículas a lo largo de TODO el ancho superior de la pantalla
    const particles: Particle[] = Array.from({ length: count }).map(() => {
      const angle = (Math.random() - 0.5) * Math.PI * 0.5 + Math.PI / 2; // Dirección hacia abajo con apertura
      const speed = Math.random() * 6 + 3;
      return {
        x: Math.random() * width,
        y: -20 - Math.random() * 100,
        vx: Math.cos(angle) * (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed + 2,
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // Gravedad suave
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;

        // Desvanecimiento al final
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
      window.removeEventListener("resize", updateDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none w-screen h-screen"
    />
  );
}
