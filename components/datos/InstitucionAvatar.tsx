import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInstitucionVisual } from "@/lib/datos/instituciones-visual";
import { cn } from "@/lib/utils";

export type InstitucionAvatarSize = "xs" | "sm" | "md" | "lg";

export interface InstitucionAvatarProps {
  nombre: string;
  tipo?: string;
  size?: InstitucionAvatarSize;
  showLabel?: boolean;
  labelVariant?: "corto" | "oficial";
  className?: string;
}

const SIZE_CLASSES: Record<
  InstitucionAvatarSize,
  { box: string; text: string; compactText: string; label: string; stripe: string }
> = {
  xs: {
    box: "size-6 rounded-md after:rounded-md",
    text: "text-[9px] tracking-tight",
    compactText: "text-[7px] tracking-tighter",
    label: "text-xs font-medium",
    stripe: "h-[2px]",
  },
  sm: {
    box: "size-8 rounded-lg after:rounded-lg",
    text: "text-[10px] tracking-tight",
    compactText: "text-[8px] tracking-tighter",
    label: "text-sm font-medium",
    stripe: "h-[2.5px]",
  },
  md: {
    box: "size-10 rounded-lg after:rounded-lg",
    text: "text-xs tracking-tight",
    compactText: "text-[9px] tracking-tighter",
    label: "text-sm font-semibold",
    stripe: "h-[3px]",
  },
  lg: {
    box: "size-12 rounded-xl after:rounded-xl",
    text: "text-sm tracking-tight",
    compactText: "text-[10px] tracking-tighter",
    label: "text-base font-semibold",
    stripe: "h-[3.5px]",
  },
};

export function InstitucionAvatar({
  nombre,
  tipo,
  size = "md",
  showLabel = false,
  labelVariant = "corto",
  className,
}: InstitucionAvatarProps) {
  const visual = getInstitucionVisual(nombre, tipo);
  const sizeCfg = SIZE_CLASSES[size];
  const isLongSigla = visual.sigla.length > 4;

  const avatar = (
    <Avatar
      title={visual.nombreOficial}
      className={cn(
        "shrink-0 overflow-hidden bg-white shadow-2xs ring-1 ring-slate-900/12 after:border-transparent",
        sizeCfg.box,
        !showLabel && className,
      )}
    >
      <AvatarFallback
        style={{
          background: `linear-gradient(155deg, ${visual.color} 0%, ${visual.color}E6 100%)`,
        }}
        className={cn(
          "relative flex size-full items-center justify-center overflow-hidden rounded-[inherit] px-0.5 text-center font-bold leading-none text-white select-none",
          isLongSigla ? sizeCfg.compactText : sizeCfg.text,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 bg-white/30",
            sizeCfg.stripe,
          )}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15"
        />
        <span className="relative z-10">{visual.sigla}</span>
      </AvatarFallback>
    </Avatar>
  );

  if (!showLabel) {
    return avatar;
  }

  return (
    <div className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
      {avatar}
      <span className={cn("truncate text-slate-900", sizeCfg.label)}>
        {labelVariant === "oficial" ? visual.nombreOficial : visual.nombreCorto}
      </span>
    </div>
  );
}
