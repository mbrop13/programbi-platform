import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  valor: string;
  etiqueta: string;
  delta?: string | null;
  fuente?: string;
  subtitulo?: string;
  icono?: ReactNode;
  variante?: "default" | "primary" | "accent";
  className?: string;
}

export function KpiCard({
  valor,
  etiqueta,
  delta,
  fuente,
  subtitulo,
  icono,
  variante = "default",
  className,
}: KpiCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0 transition-colors",
        variante === "primary" && "border-blue-200/80 bg-gradient-to-b from-blue-50/40 to-card",
        className
      )}
    >
      <CardContent className="flex h-full flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              {icono ? <span className="text-muted-foreground/80">{icono}</span> : null}
              <span>{etiqueta}</span>
            </p>
            {delta ? (
              <Badge
                variant="secondary"
                className="h-auto shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums"
              >
                {delta}
              </Badge>
            ) : null}
          </div>

          <p
            className={cn(
              "mt-2.5 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl",
              variante === "primary" ? "text-blue-700" : "text-foreground"
            )}
          >
            {valor}
          </p>

          {subtitulo ? (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{subtitulo}</p>
          ) : null}
        </div>

        {fuente ? (
          <p className="mt-3.5 border-t border-border/70 pt-2.5 text-[11px] text-muted-foreground">
            {fuente}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
