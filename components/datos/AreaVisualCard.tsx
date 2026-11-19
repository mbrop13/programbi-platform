import * as React from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
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
    return `$${formatted}M/mes`;
  }
  return `$${Math.round(value / 1_000)}k/mes`;
}

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
    <Card
      className={cn(
        "group/area relative gap-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white p-0 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
        active && "border-blue-600 ring-2 ring-blue-600 shadow-sm",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={visual.image}
          alt={visual.nombre}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover/area:scale-105"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold leading-tight text-white">
              {visual.nombre}
            </h3>
            <p className="mt-0.5 truncate text-[11px] text-slate-200">
              {visual.tagline}
            </p>
          </div>
          {active && (
            <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
              Activa
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 bg-white px-3 py-2.5">
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {countLabel}
        </span>
        {salaryChip && (
          <span
            style={{
              color: visual.accent,
              backgroundColor: visual.softBg,
              borderColor: visual.border,
            }}
            className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums"
          >
            {salaryChip}
          </span>
        )}
      </div>
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
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
        className="block w-full cursor-pointer rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        {cardInner}
      </button>
    );
  }

  return cardInner;
}
