import * as React from "react";
import Link from "next/link";

import { getAreaVisual } from "@/lib/datos/areas-visual";
import { cn } from "@/lib/utils";

export interface AreaVisualCardProps {
  area: string;
  count: number;
  medianSalary?: number | null;
  medianSalaryLabel?: string | null;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

function formatMedianSalaryChip(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const formatted = millions.toFixed(1).replace(".", ",");
    return `$${formatted}M`;
  }
  return `$${Math.round(value / 1_000)}k`;
}

/**
 * Filtro por área: mosaico tipográfico (sin ilustraciones genéricas). La cifra protagonista es el
 * sueldo mediano del área; activo = fondo tinta, para que el estado no dependa sólo del color.
 */
export function AreaVisualCard({
  area,
  count,
  medianSalary,
  medianSalaryLabel,
  active = false,
  onClick,
  href,
  className,
}: AreaVisualCardProps) {
  const visual = getAreaVisual(area);
  const salaryChip =
    medianSalaryLabel ??
    (typeof medianSalary === "number" && Number.isFinite(medianSalary) && medianSalary > 0
      ? formatMedianSalaryChip(medianSalary)
      : null);

  const countLabel = `${count} ${count === 1 ? "carrera" : "carreras"}`;

  const cardInner = (
    <div
      className={cn(
        "flex h-full min-h-[132px] flex-col justify-between gap-3 rounded-2xl border p-4 transition-colors",
        active
          ? "border-foreground bg-foreground text-white"
          : "border-line bg-white text-foreground group-hover/area:border-foreground",
        className
      )}
    >
      <div className="min-w-0">
        <h3 className="font-display text-base leading-tight font-bold">{visual.nombre}</h3>
        <p className={cn("mt-0.5 line-clamp-1 text-xs", active ? "text-white" : "text-muted-foreground")}>
          {visual.tagline}
        </p>
      </div>
      <div className="flex items-end justify-between gap-2">
        {salaryChip ? (
          <span className="font-display text-2xl leading-none font-extrabold tabular-nums">
            {salaryChip}
            <span className={cn("ml-0.5 text-xs font-semibold", active ? "text-white" : "text-muted-foreground")}>
              /mes
            </span>
          </span>
        ) : (
          <span />
        )}
        <span className={cn("text-xs font-medium", active ? "text-white" : "text-muted-foreground")}>
          {countLabel}
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="group/area block h-full rounded-2xl"
      >
        {cardInner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={`${visual.nombre}: ${countLabel}${salaryChip ? `, sueldo mediano ${salaryChip} al mes` : ""}`}
        className="group/area block h-full w-full cursor-pointer rounded-2xl text-left"
      >
        {cardInner}
      </button>
    );
  }

  return cardInner;
}
