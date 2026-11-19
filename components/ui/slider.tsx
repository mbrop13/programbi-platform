"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

type SliderProps = {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  id?: string;
};

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  onValueChange,
  onValueCommit,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  id,
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      id={id}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onValueChange={(val) => {
        if (!onValueChange) return;
        onValueChange(Array.isArray(val) ? val : [val]);
      }}
      onValueCommitted={(val) => {
        if (!onValueCommit) return;
        onValueCommit(Array.isArray(val) ? val : [val]);
      }}
      className={cn("relative flex w-full touch-none select-none items-center py-2", className)}
    >
      <SliderPrimitive.Control className="relative flex w-full items-center">
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#e2e2dc]">
          <SliderPrimitive.Indicator className="h-full bg-[#1890ff]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className="block size-5 rounded-full border-2 border-[#1890ff] bg-white shadow-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1890ff] disabled:pointer-events-none disabled:opacity-50"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
