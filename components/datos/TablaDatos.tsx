import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TablaDatosProps {
  children: ReactNode;
  caption?: string;
  stickyHeader?: boolean;
  className?: string;
  tableClassName?: string;
}

export function TablaDatos({
  children,
  caption,
  stickyHeader = true,
  className,
  tableClassName,
}: TablaDatosProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[#e2e2dc] bg-white shadow-2xs",
        className
      )}
    >
      <div className="relative w-full overflow-x-auto">
        <table
          className={cn(
            "w-full border-collapse text-left text-sm tabular-nums",
            stickyHeader &&
              "[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-[#f7f7f4]",
            "[&_thead_tr]:border-b [&_thead_tr]:border-[#e2e2dc]",
            "[&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wide [&_th]:text-[#5c5c58] [&_th]:uppercase",
            "[&_tbody_tr]:border-b [&_tbody_tr]:border-[#f0f0ec] [&_tbody_tr:last-child]:border-b-0",
            "[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-[#f7f7f4]/70",
            "[&_td]:px-4 [&_td]:py-3 [&_td]:align-middle [&_td]:text-[#171716]",
            tableClassName
          )}
        >
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          {children}
        </table>
      </div>
    </div>
  );
}
