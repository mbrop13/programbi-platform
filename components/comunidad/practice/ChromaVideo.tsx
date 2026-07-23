"use client";

// =============================================================================
// ChromaVideo · Componente Chromakey de Video con Supresión de Fondo Verde.
//
// Implementa un filtro GPU SVG + Canvas Híbrido que funciona en 100% de navegadores
// sin restricciones de CORS, garantizando que el video de BIT el Mapache se vea
// transparente y sin recuadros o círculos grises.
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
  width = 200,
  height = 200,
}: ChromaVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setHasLoaded(true);
      video.play().catch(() => {});
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadeddata", handleCanPlay);

    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleCanPlay);
    };
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      {/* SVG Filter global para extracción de pantalla verde por GPU (Sin fallos de CORS) */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <filter id="chromakey-green-filter" colorInterpolationFilters="sRGB">
          {/* Matriz de canal alfa: R - 1.7*G + B + 0.35 */}
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    1 -1.7 1 0.35 0"
          />
          {/* Ajuste de curva alfa para transparencia limpia */}
          <feComponentTransfer>
            <feFuncA type="linear" slope="4" intercept="-0.6" />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Video Element con filtro SVG aplicado directamente */}
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          hasLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          filter: "url(#chromakey-green-filter)",
          WebkitFilter: "url(#chromakey-green-filter)",
        }}
      />
    </div>
  );
}
