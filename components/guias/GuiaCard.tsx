import Image from "next/image";
import Link from "next/link";
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
  variant?: "featured" | "row" | "compact";
  indexLabel?: string;
  isHero?: boolean;
}

/**
 * Entrada editorial del hub de guías con variantes `featured`, `compact` y `row`.
 * Usa tokens reactivos `--g-*` para soportar modo claro y oscuro.
 */
export default function GuiaCard({
  guia,
  preferEditorialImage = false,
  variant = "row",
  indexLabel,
  isHero = false,
}: GuiaCardProps) {
  const imgSrc = preferEditorialImage
    ? guia.guideImage || guia.imageUrl
    : guia.imageUrl || guia.guideImage;
  const metadatos = construirMetadatos(guia);

  if (variant === "featured") {
    return (
      <Link
        href={guia.path}
        className="group flex h-full min-w-0 flex-col rounded-xl no-underline transition-colors"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)]">
          {preferEditorialImage && guia.guideImage ? (
            <Image
              src={guia.guideImage}
              alt={`Ilustración de la guía: ${guia.h1}`}
              width={800}
              height={500}
              priority={isHero}
              fetchPriority={isHero ? "high" : undefined}
              loading={isHero ? undefined : "lazy"}
              sizes="(max-width: 1024px) calc(100vw - 32px), 620px"
              className="aspect-[16/10] h-full w-full object-cover"
            />
          ) : imgSrc ? (
            <CourseImage
              src={imgSrc}
              alt={`Portada de la guía ${guia.courseName}`}
              width={800}
              height={500}
              priority={isHero}
              fetchPriority={isHero ? "high" : undefined}
              loading={isHero ? undefined : "lazy"}
              sizes="(max-width: 1024px) calc(100vw - 32px), 620px"
              className="aspect-[16/10] h-full w-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex aspect-[16/10] h-full w-full items-center justify-center bg-[var(--g-wash)]"
            >
              <span className="text-3xl font-bold tracking-tight text-[var(--g-muted)]">
                {iniciales(guia.courseName)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex min-w-0 flex-1 flex-col">
          <p className="text-xs font-medium text-[var(--g-subtle)]">
            {guia.courseName} · {guia.countryName}
          </p>
          <h3 className="mt-1.5 text-pretty break-words text-xl font-bold leading-snug tracking-tight text-[var(--g-ink)] group-hover:underline group-hover:underline-offset-4 sm:text-2xl">
            {guia.h1}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--g-muted)] sm:text-[15px]">
            {guia.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--g-border)] pt-3 text-xs text-[var(--g-subtle)]">
            <span className="tabular-nums">{metadatos.join(" · ")}</span>
            <span className="font-semibold text-[var(--g-accent)]">Leer guía</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={guia.path}
        className="group flex min-w-0 items-start gap-4 py-4 no-underline transition-colors first:pt-0 last:pb-0"
      >
        {indexLabel ? (
          <span
            aria-hidden="true"
            className="mt-0.5 shrink-0 font-mono text-xs font-semibold tabular-nums text-[var(--g-subtle)]"
          >
            {indexLabel}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--g-subtle)]">
            {guia.courseName} · {guia.countryName}
          </p>
          <h3 className="mt-1 text-pretty break-words text-base font-bold leading-snug tracking-tight text-[var(--g-ink)] group-hover:underline group-hover:underline-offset-4">
            {guia.h1}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--g-muted)]">
            {guia.description}
          </p>
          {metadatos.length > 0 ? (
            <p className="mt-2 text-xs tabular-nums text-[var(--g-subtle)]">
              {metadatos.join(" · ")}
            </p>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={guia.path}
      className="group flex h-full min-w-0 flex-col justify-between border-b border-[var(--g-border)] py-4 no-underline transition-colors hover:bg-[var(--g-surface)] sm:px-3"
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--g-subtle)]">
          {guia.courseName} · {guia.countryName}
        </p>
        <h3 className="mt-1 text-pretty break-words text-base font-bold leading-snug tracking-tight text-[var(--g-ink)] group-hover:underline group-hover:underline-offset-4">
          {guia.h1}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--g-muted)]">
          {guia.description}
        </p>
      </div>
      {metadatos.length > 0 ? (
        <p className="mt-3 text-xs tabular-nums text-[var(--g-subtle)]">
          {metadatos.join(" · ")}
        </p>
      ) : null}
    </Link>
  );
}
