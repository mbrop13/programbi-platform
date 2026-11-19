"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleGroupContextValue {
  type: "single" | "multiple";
  value: string[];
  onToggle: (itemVal: string) => void;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

interface ToggleGroupProps {
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

function ToggleGroup({
  type = "single",
  value,
  onValueChange,
  className,
  children,
  "aria-label": ariaLabel,
}: ToggleGroupProps) {
  const arrValue = Array.isArray(value) ? value : value ? [value] : [];
  const onToggle = React.useCallback(
    (itemVal: string) => {
      if (!onValueChange) return;
      if (type === "single") {
        onValueChange(arrValue[0] === itemVal ? "" : itemVal);
      } else {
        const next = arrValue.includes(itemVal)
          ? arrValue.filter((v) => v !== itemVal)
          : [...arrValue, itemVal];
        onValueChange(next);
      }
    },
    [arrValue, onValueChange, type]
  );

  return (
    <ToggleGroupContext.Provider value={{ type, value: arrValue, onToggle }}>
      <div
        role="group"
        aria-label={ariaLabel}
        data-slot="toggle-group"
        className={cn("inline-flex flex-wrap items-center gap-1.5", className)}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function ToggleGroupItem({ value, className, children, ...props }: ToggleGroupItemProps) {
  const ctx = React.useContext(ToggleGroupContext);
  const pressed = ctx ? ctx.value.includes(value) : false;

  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      onClick={(e) => {
        ctx?.onToggle(value);
        props.onClick?.(e);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
        pressed
          ? "border-primary bg-primary text-primary-foreground shadow-xs"
          : "border-border bg-card text-foreground hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { ToggleGroup, ToggleGroupItem };
