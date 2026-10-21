"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getCourseGallery } from "@/lib/data/course-gallery";
import { cn } from "@/lib/utils";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Portada del curso + carrusel de clases reales.
 *
 * La portada se mantiene a la izquierda (es la identidad del curso) y a la
 * derecha corre un riel horizontal con las capturas de las clases en vivo.
 * El usuario desplaza con el dedo, con las flechas o abriendo cualquier
 * captura en pantalla completa.
 */
export default function CourseGallery({
  slug,
  title,
  coverSrc,
  coverAlt,
}: {
  slug: string;
  title: string;
  coverSrc: string;
  coverAlt: string;
}) {
  const shots = getCourseGallery(slug);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragRef = useRef({ x: 0, moved: false });

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const total = shots.length;

  const syncFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setProgress(maxScroll > 0 ? (track.scrollLeft / maxScroll) * 100 : 0);
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < maxScroll - 4);

    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const rect = slide.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    setActive(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // El primer sync se difiere un frame: un setState síncrono dentro del
    // body del effect provoca un render en cascada.
    const frame = requestAnimationFrame(syncFromScroll);
    track.addEventListener("scroll", syncFromScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
    };
  }, [syncFromScroll, total]);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return;
    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    track.scrollTo({
      left: track.scrollLeft + (slideRect.left - trackRect.left),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const go = useCallback(
    (index: number) => {
      const next = Math.min(Math.max(index, 0), total - 1);
      scrollToIndex(next);
      setActive(next);
    },
    [scrollToIndex, total]
  );

  const stepLightbox = useCallback(
    (delta: number) => {
      setLightbox((current) => {
        if (current === null) return current;
        return (current + delta + total) % total;
      });
    },
    [total]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepLightbox(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepLightbox(-1);
      }
    };
    // Fase capture: el diálogo modal detiene la propagación de las teclas
    // antes de que lleguen a la fase bubble de window.
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [lightbox, stepLightbox]);

  if (total === 0) return null;

  const openLightbox = (index: number) => {
    if (dragRef.current.moved) return;
    setLightbox(index);
  };

  const closeLightbox = () => setLightbox(null);

  const shot = lightbox !== null ? shots[lightbox] : null;

  return (
    <section className="mt-8" aria-label={`Clases reales de ${title}`}>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-center">
        {/* ── Portada del curso ─────────────────────────────────────── */}
        <div className="relative aspect-[8/5] w-full overflow-hidden rounded-[22px] border border-line bg-wash shadow-[0_18px_50px_rgba(23,23,22,0.10)]">
          <CourseImage
            src={coverSrc}
            alt={coverAlt}
            fill
            preload
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 34vw"
            className="object-cover object-center"
          />
        </div>

        {/* ── Carrusel de clases reales ──────────────────────────────── */}
        <div className="flex flex-col rounded-[22px] border border-line bg-paper p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3 px-1">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold tracking-tight text-ink">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
                </span>
                Clases reales en vivo
              </p>
              <p
                className="mt-1 truncate text-xs leading-relaxed text-mute"
                title={shots[active]?.caption}
              >
                {shots[active]?.caption}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <span className="font-mono text-xs tabular-nums text-mute">
                {pad(active + 1)}
                <span className="mx-1 text-faint">/</span>
                {pad(total)}
              </span>
              <button
                type="button"
                onClick={() => go(active - 1)}
                disabled={!canPrev}
                aria-label="Captura anterior"
                className="grid h-8 w-8 place-items-center rounded-full border border-line bg-canvas text-ink transition-colors hover:bg-wash disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                disabled={!canNext}
                aria-label="Captura siguiente"
                className="grid h-8 w-8 place-items-center rounded-full border border-line bg-canvas text-ink transition-colors hover:bg-wash disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="relative mt-3">
            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onPointerDown={(event) => {
                dragRef.current = { x: event.clientX, moved: false };
              }}
              onPointerMove={(event) => {
                if (Math.abs(event.clientX - dragRef.current.x) > 8) dragRef.current.moved = true;
              }}
            >
              {shots.map((item, index) => (
                <button
                  key={item.src}
                  ref={(node) => {
                    slideRefs.current[index] = node;
                  }}
                  type="button"
                  onClick={() => openLightbox(index)}
                  onFocus={() => go(index)}
                  aria-label={`Ampliar: ${item.caption}`}
                  className={cn(
                    "group relative aspect-[16/9] w-[clamp(200px,72%,320px)] shrink-0 snap-start overflow-hidden rounded-2xl border bg-wash text-left transition-[border-color,box-shadow,opacity]",
                    index === active
                      ? "border-ink/35 shadow-[0_10px_30px_rgba(23,23,22,0.12)]"
                      : "border-line opacity-90 hover:opacity-100"
                  )}
                >
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 1024px) 72vw, 320px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-3 pb-2.5 pt-8">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-ink">
                      {item.tool}
                    </span>
                  </span>
                  <span className="pointer-events-none absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Expand size={13} />
                  </span>
                </button>
              ))}
            </div>
            {/* Pista visual de que el riel sigue hacia la derecha. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-paper to-transparent"
            />
          </div>

          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-wash" aria-hidden>
            <div
              className="h-full rounded-full bg-ink/60 transition-[width] duration-200 ease-out"
              style={{ width: `${Math.max(progress, 6)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Vista ampliada ──────────────────────────────────────────── */}
      <Dialog
        open={lightbox !== null}
        onOpenChange={(open) => {
          if (!open) closeLightbox();
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="z-[9999] bg-black/92"
          className="z-[10000] flex h-[92vh] max-w-[min(1280px,94vw)] flex-col gap-3 border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-[min(1280px,94vw)]"
        >
          <DialogTitle className="sr-only">
            {shot ? shot.caption : "Clase del curso"}
          </DialogTitle>

          <div className="flex shrink-0 items-center justify-between gap-4 px-1">
            <p className="min-w-0 truncate text-sm font-semibold text-white">
              {shot?.caption}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => stepLightbox(-1)}
                aria-label="Captura anterior"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => stepLightbox(1)}
                aria-label="Captura siguiente"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
              >
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Cerrar"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black/40">
            {shot ? (
              <Image
                src={shot.src}
                alt={shot.caption}
                fill
                sizes="(max-width: 1024px) 94vw, 1280px"
                className="object-contain"
              />
            ) : null}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 px-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
              {shot?.tool}
            </span>
            <p className="font-mono text-xs tabular-nums text-white/60">
              {lightbox !== null ? pad(lightbox + 1) : "01"}
              <span className="mx-1">/</span>
              {pad(total)}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
