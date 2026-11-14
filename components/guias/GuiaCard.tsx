import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import type { TarjetaGuia } from "@/lib/guias/hub";

/** Dos iniciales para fallback visual si un curso no tiene imagen. */
function iniciales(texto: string): string {
  return texto
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase() || "")
    .join("");
}

/**
 * Tarjeta editorial del hub de guías: barra superior con acento de color del
 * curso, imagen en relación fija (`aspect-[16/10]`, cero CLS), etiqueta de
 * tiempo de lectura y micro-CTA hacia la guía.
 */
export default function GuiaCard({
  guia,
  preferEditorialImage = false,
}: {
  guia: TarjetaGuia;
  preferEditorialImage?: boolean;
}) {
  const accent = guia.accentColor || "#171716";
  const imgSrc = preferEditorialImage ? guia.guideImage || guia.imageUrl : guia.imageUrl || guia.guideImage;

  return (
    <Link
      href={guia.path}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[26px] border border-line bg-paper no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-wash">
        {preferEditorialImage && guia.guideImage ? (
          <Image
            src={guia.guideImage}
            alt={`Ilustración de la guía: ${guia.h1}`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) calc(50vw - 44px), 360px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : imgSrc ? (
          <CourseImage
            src={imgSrc}
            alt={`Portada de la guía ${guia.courseName}`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) calc(50vw - 44px), 360px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-ink">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.16),transparent_55%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold tracking-tight text-canvas/80">
                {iniciales(guia.courseName)}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex min-w-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-faint">
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            />
            <span className="truncate">{guia.courseName} · {guia.countryName}</span>
          </p>
          {guia.readingMinutes ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-faint">
              <Clock size={11} aria-hidden />
              {guia.readingMinutes} min
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 text-pretty break-words text-base font-bold leading-snug tracking-tight text-ink">
          {guia.h1}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-mute">{guia.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs">
          <span className="text-faint">Act. {guia.updatedLabel}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-ink transition-transform group-hover:translate-x-0.5">
            Leer guía <ArrowRight size={13} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
