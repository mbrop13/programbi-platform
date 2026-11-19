import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
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
    <Card
      className={cn(
        "gap-0 overflow-hidden rounded-xl border border-border bg-card py-0 shadow-xs ring-0",
        className
      )}
    >
      <div className="relative w-full overflow-x-auto">
        <table
          className={cn(
            "w-full border-collapse text-left text-sm tabular-nums",
            stickyHeader &&
              "[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10 [&_thead_th]:bg-muted/70 [&_thead_th]:backdrop-blur-xs",
            "[&_thead_tr]:border-b [&_thead_tr]:border-border",
            "[&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-medium [&_th]:text-muted-foreground",
            "[&_tbody_tr]:border-b [&_tbody_tr]:border-border/60 [&_tbody_tr:last-child]:border-b-0",
            "[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-muted/40",
            "[&_td]:px-4 [&_td]:py-3 [&_td]:align-middle [&_td]:text-foreground",
            tableClassName
          )}
        >
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          {children}
        </table>
      </div>
    </Card>
  );
}
