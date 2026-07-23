"use client";

// =============================================================================
// ChromaVideo · Renderizado de Video con Remoción de Fondo Verde (Chromakey)
// en Tiempo Real usando HTML5 Canvas 2D.
//
// Elimina cada fotograma de pantalla verde en vivo (alpha = 0) con supresión
// de halos y suavizado de bordes para figuras transparentes impecables.
// =============================================================================

import { useEffect, useRef, useState } from "react";

interface ChromaVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: number;
  height?: number;
}

export default function ChromaVideo({
  src,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  width = 300,
  height = 300,
}: ChromaVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animFrameId: number;

    const processFrame = () => {
      if (!video || video.paused || video.ended) {
        animFrameId = requestAnimationFrame(processFrame);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Dibujar fotograma actual
      ctx.drawImage(video, 0, 0, w, h);

      // Obtener píxeles
      const frame = ctx.getImageData(0, 0, w, h);
      const data = frame.data;
      const len = data.length;

      // Algoritmo Chromakey de alta precisión
      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Detección de fondo verde (G dominate sobre R y B)
        if (g > 70 && g > r * 1.12 && g > b * 1.12) {
          const greenDominance = g - Math.max(r, b);

          if (greenDominance > 35) {
            // Fondo verde completo -> Transparencia total
            data[i + 3] = 0;
          } else {
            // Borde suave (Anti-aliasing)
            const alphaFactor = Math.max(0, 1 - (greenDominance - 15) / 20);
            data[i + 3] = Math.floor(alphaFactor * 255);
            // Reducción de reflejos verdes en el borde
            data[i + 1] = Math.floor((r + b) / 2);
          }
        }
      }

      ctx.putImageData(frame, 0, 0);
      animFrameId = requestAnimationFrame(processFrame);
    };

    const handlePlay = () => {
      setIsReady(true);
      processFrame();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("loadedmetadata", () => {
      video.play().catch(() => {});
    });

    if (video.readyState >= 3) {
      handlePlay();
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      cancelAnimationFrame(animFrameId);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
      {/* Video Oculto en Segundo Plano */}
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />

      {/* Canvas Visible con Chromakey Transparente */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
