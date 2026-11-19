"use client";

import * as React from "react";
import { ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

const ChartContext = React.createContext<{ config: ChartConfig }>({ config: {} });

export function ChartContainer({
  config,
  className,
  children,
}: {
  config: ChartConfig;
  className?: string;
  children: React.ReactElement;
}) {
  const style = React.useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [k, v] of Object.entries(config)) {
      if (v.color) vars[`--color-${k}`] = v.color;
    }
    return vars as React.CSSProperties;
  }, [config]);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        style={style}
        className={cn("w-full text-xs tabular-nums", className)}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    dataKey?: string | number;
  }>;
  label?: string | number;
  formatter?: (value: number, name: string) => string;
  labelFormatter?: (label: string | number) => string;
}) {
  const { config } = React.useContext(ChartContext);
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg shadow-slate-900/5">
      {label !== undefined && label !== "" ? (
        <div className="mb-1.5 font-semibold text-foreground">
          {labelFormatter ? labelFormatter(label) : String(label)}
        </div>
      ) : null}
      <div className="flex flex-col gap-1.5">
        {payload.map((entry, idx) => {
          const key = String(entry.dataKey ?? entry.name ?? idx);
          const itemCfg = config[key];
          const displayLabel = itemCfg?.label ?? entry.name ?? key;
          const numVal = typeof entry.value === "number" ? entry.value : Number(entry.value);
          const displayValue =
            formatter && Number.isFinite(numVal) ? formatter(numVal, displayLabel) : String(entry.value ?? "");
          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: entry.color ?? itemCfg?.color ?? "var(--chart-1)" }}
                />
                {displayLabel}
              </span>
              <span className="font-semibold text-foreground tabular-nums">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
