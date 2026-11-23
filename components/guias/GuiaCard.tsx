import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import {
  GuiaToolVisual,
  GuiaVisualBadge,
  type GuiaVisualBadgeTone,
} from "@/components/guias/GuiaEditorialPrimitives";
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

function tonoNivel(nivel?: string): GuiaVisualBadgeTone {
  const normalizado = (nivel ?? "").toLowerCase();
  if (normalizado.includes("básico") || normalizado.includes("basico")) return "ok";
  if (normalizado.includes("avanzado")) return "warn";
  if (normalizado.includes("intermedio")) return "accent";
  return "neutral";
}

function construirMetadatos(guia: TarjetaGuia): string[] {
  const items: string[] = [];
  if (guia.herramienta) items.push(guia.herramienta);
  if (guia.nivel) items.push(guia.nivel);
  if (guia.readingMinutes) items.push(`${guia.readingMinutes} min`);
  if (guia.updatedLabel) items.push(`Act. ${guia.updatedLabel}`);
  return items;
}

export interface GuiaCardProps {
  guia: TarjetaGuia;
  preferEditorialImage?: boolean;
  variant?: "visual" | "featured" | "row" | "compact";
  indexLabel?: string;
  isHero?: boolean;
}

function PortadaImagen({
  guia,
  preferEditorialImage,
  aspectClass,
  sizes,
  width,
  height,
  isHero = false,
}: {
  guia: TarjetaGuia;
  preferEditorialImage: boolean;
  aspectClass: string;
  sizes: string;
  width: number;
  height: number;
  isHero?: boolean;
}) {
  const imgSrc = preferEditorialImage
    ? guia.guideImage || guia.imageUrl
    : guia.imageUrl || guia.guideImage;

  if (preferEditorialImage && guia.guideImage) {
    return (
      <Image
        src={guia.guideImage}
        alt={`Ilustración de la guía: ${guia.h1}`}
        width={width}
        height={height}
        priority={isHero}
        fetchPriority={isHero ? "high" : undefined}
        loading={isHero ? undefined : "lazy"}
        sizes={sizes}
        className={`${aspectClass} h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]`}
      />
    );
  }

  if (imgSrc) {
    return (
      <CourseImage
        src={imgSrc}
        alt={`Portada de la guía: ${guia.h1}`}
        width={width}
        height={height}
        priority={isHero}
        fetchPriority={isHero ? "high" : undefined}
        loading={isHero ? undefined : "lazy"}
        sizes={sizes}
        className={`${aspectClass} h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex ${aspectClass} h-full w-full items-center justify-center bg-[var(--g-wash)]`}
    >
      <span className="text-2xl font-bold tracking-tight text-[var(--g-muted)]">
        {iniciales(guia.courseName)}
      </span>
    </div>
  );
}

/**
 * Tarjeta visual y táctil del hub de guías con variantes `visual`, `featured`,
 * `compact` y `row`. Usa tokens reactivos `--g-*` para modo claro y oscuro.
 */
export default function GuiaCard({
  guia,
  preferEditorialImage = false,
  variant = "visual",
  indexLabel,
  isHero = false,
}: GuiaCardProps) {
  const metadatos = construirMetadatos(guia);

  if (variant === "featured") {
    return (
      <Link
        href={guia.path}
        className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] no-underline shadow-[var(--g-card-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--g-border-strong)] hover:shadow-[var(--g-card-shadow-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--g-border)] bg-[var(--g-wash)]">
          <PortadaImagen
            guia={guia}
            preferEditorialImage={preferEditorialImage}
            aspectClass="aspect-[16/9]"
            sizes="(max-width: 1024px) calc(100vw - 32px), 760px"
            width={800}
            height={450}
            isHero={isHero}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <GuiaToolVisual tool={guia.herramienta} course={guia.course} size="sm" />
            <span className="text-xs font-medium text-[var(--g-subtle)]">
              {guia.courseName} · {guia.countryName}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {guia.herramienta ? (
              <GuiaVisualBadge tone="accent">{guia.herramienta}</GuiaVisualBadge>
            ) : null}
            {guia.nivel ? (
              <GuiaVisualBadge tone={tonoNivel(guia.nivel)}>{guia.nivel}</GuiaVisualBadge>
            ) : null}
            {guia.readingMinutes ? (
              <GuiaVisualBadge tone="neutral">
                <Clock size={12} aria-hidden="true" />
                <span className="tabular-nums">{guia.readingMinutes} min</span>
              </GuiaVisualBadge>
            ) : null}
          </div>

          <h3 className="mt-3 text-pretty break-words text-xl font-bold leading-snug tracking-tight text-[var(--g-ink)] transition-colors group-hover:text-[var(--g-accent)] sm:text-2xl">
            {guia.h1}
          </h3>
          <p className="mb-5 mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--g-muted)] sm:text-[15px]">
            {guia.description}
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[var(--g-border)] pt-4 text-xs">
            <span className="tabular-nums text-[var(--g-subtle)]">
              {guia.updatedLabel ? `Act. ${guia.updatedLabel}` : metadatos[0] ?? ""}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--g-accent)]">
              Abrir guía
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={guia.path}
        className="group flex min-w-0 items-start gap-3.5 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-3.5 no-underline shadow-[var(--g-card-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--g-border-strong)] hover:shadow-[var(--g-card-shadow-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)] sm:p-4"
      >
        <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)] sm:w-32">
          <PortadaImagen
            guia={guia}
            preferEditorialImage={preferEditorialImage}
            aspectClass="aspect-[16/10]"
            sizes="(max-width: 640px) 112px, 128px"
            width={256}
            height={160}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {indexLabel ? (
              <span
                aria-hidden="true"
                className="font-mono text-[11px] font-semibold tabular-nums text-[var(--g-subtle)]"
              >
                {indexLabel}
              </span>
            ) : null}
            <span className="truncate text-xs font-medium text-[var(--g-subtle)]">
              {guia.courseName}
            </span>
          </div>

          <h3 className="mt-1 line-clamp-2 text-pretty break-words text-[15px] font-semibold leading-snug tracking-tight text-[var(--g-ink)] transition-colors group-hover:text-[var(--g-accent)]">
            {guia.h1}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {guia.nivel ? (
              <GuiaVisualBadge tone={tonoNivel(guia.nivel)}>{guia.nivel}</GuiaVisualBadge>
            ) : null}
            {guia.readingMinutes ? (
              <GuiaVisualBadge tone="neutral">
                <Clock size={11} aria-hidden="true" />
                <span className="tabular-nums">{guia.readingMinutes} min</span>
              </GuiaVisualBadge>
            ) : null}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={guia.path}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] no-underline shadow-[var(--g-card-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--g-border-strong)] hover:shadow-[var(--g-card-shadow-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-bg)]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--g-border)] bg-[var(--g-wash)]">
        <PortadaImagen
          guia={guia}
          preferEditorialImage={preferEditorialImage}
          aspectClass="aspect-[16/9]"
          sizes="(max-width: 768px) calc(100vw - 32px), (max-width: 1280px) calc(50vw - 48px), 420px"
          width={640}
          height={360}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <GuiaToolVisual tool={guia.herramienta} course={guia.course} size="sm" />
          <p className="min-w-0 truncate text-xs font-medium text-[var(--g-subtle)]">
            {guia.courseName} · {guia.countryName}
          </p>
        </div>

        {(guia.herramienta || guia.nivel || guia.readingMinutes) ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {guia.herramienta ? (
              <GuiaVisualBadge tone="accent">{guia.herramienta}</GuiaVisualBadge>
            ) : null}
            {guia.nivel ? (
              <GuiaVisualBadge tone={tonoNivel(guia.nivel)}>{guia.nivel}</GuiaVisualBadge>
            ) : null}
            {guia.readingMinutes ? (
              <GuiaVisualBadge tone="neutral">
                <Clock size={11} aria-hidden="true" />
                <span className="tabular-nums">{guia.readingMinutes} min</span>
              </GuiaVisualBadge>
            ) : null}
          </div>
        ) : null}

        <h3 className="mt-3 text-pretty break-words text-[17px] font-semibold leading-snug tracking-tight text-[var(--g-ink)] transition-colors group-hover:text-[var(--g-accent)]">
          {guia.h1}
        </h3>
        <p className="mb-5 mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--g-muted)]">
          {guia.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--g-border)] pt-4 text-xs">
          <span className="tabular-nums text-[var(--g-subtle)]">
            {guia.updatedLabel ? `Act. ${guia.updatedLabel}` : ""}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-[var(--g-accent)]">
            Leer guía
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
