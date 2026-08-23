"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import RegisterCta from "./RegisterCta";

/**
 * Hero cinematográfico de la Bolsa de Trabajo.
 * Fondo full-bleed con dos imágenes (noche ejecutiva / data-tech):
 * - Desktop: el cursor controla el crossfade entre ambas, un spotlight
 *   las revela al pasar y un parallax sutil da profundidad. El texto
 *   vive a la izquierda sobre un degradado del blanco de marca.
 * - Móvil: sin scrim — los textos van directamente sobre la imagen
 *   (en claro, con sombra), arrancando arriba como el hero de la home
 *   (pt-8, items-start); la foto llena el resto de la pantalla.
 */
export default function LandingHero() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Posición del cursor normalizada (0–1), con springs para suavidad.
  // Sin useState: valores continuos -> MotionValues (sin re-renders).
  const nx = useMotionValue(0.3);
  const ny = useMotionValue(0.4);
  const sx = useSpring(nx, { stiffness: 60, damping: 20 });
  const sy = useSpring(ny, { stiffness: 60, damping: 20 });

  // Crossfade: hero 1 domina a la izquierda, hero 2 a la derecha.
  const img2Opacity = useTransform(sx, [0.1, 0.9], [0, 1]);
  // En reposo siempre presente un 25% de la segunda imagen (base más rica).
  const img2Base = useTransform(img2Opacity, (v) => 0.25 + v * 0.75);

  // Parallax sutil en direcciones opuestas (profundidad).
  const x1 = useTransform(sx, [0, 1], [14, -14]);
  const y1 = useTransform(sy, [0, 1], [8, -8]);
  const x2 = useTransform(sx, [0, 1], [-18, 18]);
  const y2 = useTransform(sy, [0, 1], [-10, 10]);

  // Spotlight que sigue al cursor (revela la imagen bajo el puntero).
  const mxPx = useTransform(sx, (v) => v * 100);
  const myPx = useTransform(sy, (v) => v * 100);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${mxPx}% ${myPx}%, rgba(247,247,244,0.12), rgba(247,247,244,0.04) 40%, transparent 68%)`;

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    nx.set(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
    ny.set(Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)));
  };

  const onPointerLeave = () => {
    nx.set(0.3);
    ny.set(0.4);
  };

  return (
    <section className="relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (hover: none) and (prefers-reduced-motion: no-preference) {
              .bolsa-ken-a { animation: bolsa-ken 18s ease-in-out infinite alternate; }
              .bolsa-ken-b { animation: bolsa-ken 18s ease-in-out infinite alternate-reverse; }
              .bolsa-fade { animation: bolsa-fade 16s ease-in-out infinite alternate; }
            }
            @keyframes bolsa-ken {
              from { transform: scale(1.04) translate(0%, 0%); }
              to { transform: scale(1.12) translate(-1.5%, -2%); }
            }
            @keyframes bolsa-fade {
              from { opacity: 0.25; }
              to { opacity: 0.85; }
            }
          `,
        }}
      />

      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative flex min-h-[100svh] items-start overflow-hidden sm:items-center"
      >
        {/* Capa 1: noche ejecutiva */}
        <motion.div style={{ x: x1, y: y1 }} className="absolute inset-[-3%]">
          <Image
            src="/images/bolsa-hero-1.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={75}
            className="bolsa-ken-a object-cover"
          />
        </motion.div>

        {/* Capa 2: data-tech (el cursor decide cuánto pesa) */}
        <motion.div style={{ x: x2, y: y2, opacity: img2Base }} className="absolute inset-[-3%]">
          <Image
            src="/images/bolsa-hero-2.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={75}
            className="bolsa-ken-b bolsa-fade object-cover"
          />
        </motion.div>

        {/* Spotlight que sigue al cursor (solo desktop) */}
        <motion.div
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 hidden md:block"
          aria-hidden="true"
        />

        {/* Viñeta cinematográfica en el borde de la imagen */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_72%_25%,transparent_55%,rgba(23,23,22,0.32)_100%)]"
          aria-hidden="true"
        />

        {/* Grano de película */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />

        {/* Scrim claro: solo desktop, protege el texto desde la izquierda.
            En móvil los textos van directo sobre la imagen (sin difuminado). */}
        <div
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#f3f3f0_0%,rgba(243,243,240,0.96)_30%,rgba(243,243,240,0.6)_50%,rgba(243,243,240,0)_72%)] sm:block"
          aria-hidden="true"
        />

        {/* Contenido: solo columna izquierda, la derecha queda para la imagen */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pt-8 pb-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-paper/25 bg-[#171716]/45 px-3 py-1 text-xs font-semibold text-paper/90 [backdrop-filter:blur(8px)] sm:border-line sm:bg-canvas/80 sm:text-mute sm:[backdrop-filter:none]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16a34a] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16a34a]" />
              </span>
              Pre-inscripción abierta · Lanzamiento pronto
            </p>

            <h1 className="mt-6 max-w-[15ch] text-4xl font-bold leading-[1.08] tracking-tight text-paper [text-shadow:0_2px_24px_rgba(23,23,22,0.55)] sm:text-5xl sm:text-ink sm:[text-shadow:none] lg:text-6xl">
              Tu próximo trabajo en datos empieza{" "}
              <em className="italic">certificado</em>
            </h1>

            <p className="mt-5 max-w-[30rem] text-base leading-relaxed text-paper/85 [text-shadow:0_1px_12px_rgba(23,23,22,0.5)] sm:text-mute sm:[text-shadow:none] lg:text-lg">
              Bolsa de Trabajo de ProgramBI: crea tu perfil en minutos, tus
              certificados se verifican solos y las empresas te descubren.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <RegisterCta className="inline-flex h-12 items-center gap-2 rounded-full bg-canvas px-7 text-base font-semibold text-ink shadow-[0_12px_32px_rgba(23,23,22,0.45)] transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas/40 sm:bg-ink sm:text-canvas sm:focus-visible:ring-ink/25">
                Crear mi perfil
                <ArrowRight size={17} strokeWidth={2.4} />
              </RegisterCta>
              <Link
                href="/empleos/para-empresas"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-paper/30 bg-[#171716]/40 px-7 text-base font-semibold text-paper [backdrop-filter:blur(8px)] transition-colors hover:bg-[#171716]/60 sm:border-ink/15 sm:bg-canvas/70 sm:text-ink sm:hover:bg-canvas sm:[backdrop-filter:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/40 sm:focus-visible:ring-ink/25"
              >
                Registrar mi empresa
              </Link>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 lg:block" aria-hidden="true">
          <div className="h-8 w-[1px] overflow-hidden bg-ink/15">
            <motion.div
              className="h-3 w-[1px] bg-ink/50"
              animate={reduce ? undefined : { y: [0, 20, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
