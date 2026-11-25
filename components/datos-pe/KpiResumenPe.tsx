import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface KpiItemPe {
  valor: string;
  etiqueta: string;
  delta?: string | null;
  subtitulo?: string;
  fuente?: string;
  icono?: ReactNode;
  variante?: "default" | "primary";
}

export interface KpiResumenPeProps {
  items: readonly KpiItemPe[];
  fechaCorte?: string;
  className?: string;
}

export function KpiResumenPe({ items, fechaCorte, className }: KpiResumenPeProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.etiqueta}
            className={cn(
              "gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0 transition-colors",
              item.variante === "primary" &&
                "border-blue-200/80 bg-gradient-to-b from-blue-50/40 to-card",
            )}
          >
            <CardContent className="flex h-full flex-col justify-between p-5">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    {item.icono ? (
                      <span className="text-muted-foreground/80">{item.icono}</span>
                    ) : null}
                    <span>{item.etiqueta}</span>
                  </p>
                  {item.delta ? (
                    <Badge
                      variant="secondary"
                      className="h-auto shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums"
                    >
                      {item.delta}
                    </Badge>
                  ) : null}
                </div>

                <p
                  className={cn(
                    "mt-2.5 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl",
                    item.variante === "primary" ? "text-blue-700" : "text-foreground",
                  )}
                >
                  {item.valor}
                </p>

                {item.subtitulo ? (
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {item.subtitulo}
                  </p>
                ) : null}
              </div>

              {item.fuente ? (
                <p className="mt-3.5 border-t border-border/70 pt-2.5 text-[11px] text-muted-foreground">
                  {item.fuente}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {fechaCorte ? (
        <p className="text-xs text-muted-foreground">
          Fecha de corte del dataset: <span className="font-medium text-foreground">{fechaCorte}</span>{" "}
          · Valores en soles de 2024 deflactados con IPC de Lima Metropolitana (BCRP).
        </p>
      ) : null}
    </div>
  );
}
