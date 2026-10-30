"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function FeaturedCourseStrip({
  title,
  images,
  href,
  onNavigate,
}: {
  title: string;
  images: { src: string; alt: string }[];
  href: string;
  onNavigate: () => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const dragRef = useRef({ x: 0, moved: false });

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const total = images.length;

  const syncFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setProgress(maxScroll > 0 ? (track.scrollLeft / maxScroll) * 100 : 0);
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < maxScroll - 4);

    const trackRect = track.getBoundingClientRect();
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const distance = Math.abs(slide.getBoundingClientRect().left - trackRect.left);
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

  if (total === 0) return null;

  const slideClass =
    "relative aspect-[16/10] w-[calc(100%-4.75rem)] shrink-0 snap-start overflow-hidden rounded-[18px] border border-line bg-wash";

  return (
    <div aria-label={`Imágenes de ${title}`}>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={(event) => {
          dragRef.current = { x: event.clientX, moved: false };
        }}
        onPointerMove={(event) => {
          if (Math.abs(event.clientX - dragRef.current.x) > 8) dragRef.current.moved = true;
        }}
      >
        {images.map((image, index) => (
          <Link
            key={image.src}
            href={href}
            draggable={false}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            onClick={(event) => {
              // Un arrastre para ver la siguiente foto no abre el curso.
              if (dragRef.current.moved) {
                event.preventDefault();
                dragRef.current.moved = false;
                return;
              }
              onNavigate();
            }}
            className={slideClass}
          >
            <CourseImage
              src={image.src}
              alt={image.alt}
              fill
              draggable={false}
              preload={index === 0}
              fetchPriority={index === 0 ? "high" : "low"}
              sizes="(max-width: 1024px) 86vw, 42vw"
              className={index === 0 ? "object-cover object-center" : "object-cover object-top"}
            />
          </Link>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-wash" aria-hidden>
          <div
            className="h-full rounded-full bg-ink/60 transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${Math.max(progress, 8)}%` }}
          />
        </div>
        <span className="font-mono text-xs tabular-nums text-mute">
          {pad(active + 1)}
          <span className="mx-1 text-faint">/</span>
          {pad(total)}
        </span>
        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={!canPrev}
          aria-label="Imagen anterior"
          className="grid h-8 w-8 place-items-center rounded-full border border-line bg-canvas text-ink transition-colors hover:bg-wash disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          disabled={!canNext}
          aria-label="Imagen siguiente"
          className="grid h-8 w-8 place-items-center rounded-full border border-line bg-canvas text-ink transition-colors hover:bg-wash disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
