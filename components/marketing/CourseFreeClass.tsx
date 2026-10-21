"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { getFreeClass } from "@/lib/data/free-classes";

/**
 * Clase 1 embebida en la ficha.
 * La miniatura es propia. El iframe de YouTube entra solo cuando la persona pulsa play,
 * para no cargar el reproductor en la primera pintura.
 */
export default function CourseFreeClass({ slug }: { slug: string }) {
  const lesson = getFreeClass(slug);
  const [playing, setPlaying] = useState(false);
  if (!lesson) return null;

  const thumb = `https://img.youtube.com/vi/${lesson.videoId}/maxresdefault.jpg`;

  return (
    <section id="clase-gratis" aria-labelledby="clase-gratis-titulo" className="mt-8 scroll-mt-28">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mute">Clase 1 · Gratis</p>
          <h2 id="clase-gratis-titulo" className="mt-1 text-xl font-bold tracking-tight text-ink sm:text-2xl">
            {lesson.title}
          </h2>
        </div>
        <p className="shrink-0 text-sm text-mute">{lesson.length}</p>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-line bg-ink shadow-[0_20px_60px_rgba(23,23,22,0.08)]">
        {playing ? (
          <iframe
            className="aspect-video w-full"
            src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={lesson.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative block aspect-video w-full cursor-pointer"
            aria-label={`Reproducir la clase gratuita: ${lesson.title}`}
          >
            <Image
              src={thumb}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(23,23,22,0.62),rgba(23,23,22,0.08)_46%)]" />
            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-canvas px-3 py-1 text-xs font-semibold text-ink">
              Gratis
            </span>
            <span className="absolute left-1/2 top-[46%] flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-canvas text-ink shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <Play size={26} className="ml-0.5" fill="currentColor" aria-hidden />
            </span>
            <span className="absolute inset-x-5 bottom-4 flex items-center justify-between text-sm text-canvas">
              <span className="font-medium">Ver clase completa</span>
              <span className="text-canvas/80">{lesson.length}</span>
            </span>
          </button>
        )}
      </div>
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-mute">{lesson.note}</p>
    </section>
  );
}
