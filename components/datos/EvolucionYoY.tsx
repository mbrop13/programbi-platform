"use client";

import { useState } from "react";
import { LineChart, Table2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TradingViewCarreraChart } from "@/components/datos/charts/TradingViewCarreraChart";
import type { CarreraTipoData } from "@/lib/datos/carreras";
import { pesos, porcentaje, variacionPorcentual } from "@/lib/datos/formato";
import { cn } from "@/lib/utils";

interface EvolucionYoYProps {
  evolIng4: Record<string, number | null>;
  evolEmp1: Record<string, number | null>;
  evolEmp2: Record<string, number | null>;
  variacion: CarreraTipoData["variacion"];
  factorIpc?: number;
  etiquetaPesos?: string;
}

const ANOS_SERIE = ["2020", "2021", "2022", "2023", "2024"] as const;

function DeltaPill({ label, value }: { label: string; value: number }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "h-auto rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums",
        value >= 0
          ? "border-emerald-200/80 bg-emerald-50 text-emerald-800"
          : "border-rose-200/80 bg-rose-50 text-rose-800"
      )}
    >
      {label}: {variacionPorcentual(value)}
    </Badge>
  );
}

export function EvolucionYoY({
  evolIng4,
  evolEmp1,
  evolEmp2,
  variacion,
  factorIpc = 1,
  etiquetaPesos = "pesos de sep-2025",
}: EvolucionYoYProps) {
  const [vista, setVista] = useState<"grafico" | "tabla">("grafico");

  const tieneIng = ANOS_SERIE.some((a) => typeof evolIng4[a] === "number");
  const tieneEmp = ANOS_SERIE.some(
    (a) => typeof evolEmp1[a] === "number" || typeof evolEmp2[a] === "number"
  );

  return (
    <Card className="gap-4 rounded-xl border border-border bg-card py-6 shadow-xs ring-0">
      <CardHeader className="flex flex-col gap-3 px-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Evolución histórica 2020–2024
          </CardTitle>
          <CardDescription className="mt-0.5 text-xs">
            Tendencia real de ingresos y empleabilidad en {etiquetaPesos}.
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {variacion.yoy_23_24 !== null ? (
            <DeltaPill label="2023→2024" value={variacion.yoy_23_24} />
          ) : null}
          {variacion.crec_20_24 !== null ? (
            <DeltaPill label="2020→2024" value={variacion.crec_20_24} />
          ) : null}
          {variacion.edicion_anterior_yoy_real !== null ? (
            <DeltaPill label="vs ed. anterior" value={variacion.edicion_anterior_yoy_real} />
          ) : null}

          {tieneIng || tieneEmp ? (
            <ToggleGroup
              type="single"
              value={vista}
              onValueChange={(v) => {
                if (v === "grafico" || v === "tabla") setVista(v);
              }}
              aria-label="Modo de visualización histórica"
            >
              <ToggleGroupItem value="grafico" className="px-2.5 py-1 text-xs">
                <LineChart className="size-3.5" aria-hidden="true" />
                Gráfico
              </ToggleGroupItem>
              <ToggleGroupItem value="tabla" className="px-2.5 py-1 text-xs">
                <Table2 className="size-3.5" aria-hidden="true" />
                Tabla
              </ToggleGroupItem>
            </ToggleGroup>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="px-6">
        {!tieneIng && !tieneEmp ? (
          <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
            Sin serie histórica de ingresos o empleabilidad disponible para este tipo de institución.
          </div>
        ) : vista === "grafico" ? (
          <TradingViewCarreraChart
            evolIng4={evolIng4}
            evolEmp1={evolEmp1}
            factorIpc={factorIpc}
            etiquetaPesos={etiquetaPesos}
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table className="tabular-nums">
              <TableHeader className="bg-muted/60">
                <TableRow className="hover:bg-muted/60">
                  <TableHead className="normal-case">Año</TableHead>
                  <TableHead className="text-right normal-case">
                    Sueldo real 4.º año ({etiquetaPesos})
                  </TableHead>
                  <TableHead className="text-right normal-case">Empleabilidad 1.er año</TableHead>
                  <TableHead className="text-right normal-case">Empleabilidad 2.º año</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ANOS_SERIE.map((ano) => {
                  const ingRaw = evolIng4[ano] ?? null;
                  const ingVal = ingRaw !== null ? Math.round(ingRaw * factorIpc) : null;
                  return (
                    <TableRow key={ano}>
                      <TableCell className="font-medium text-foreground">{ano}</TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {pesos(ingVal)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {porcentaje(evolEmp1[ano] ?? null)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {porcentaje(evolEmp2[ano] ?? null)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <p className="mt-4 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          Cada año compara cohortes distintas de titulados; los vacíos indican períodos sin el
          mínimo estadístico de casos publicado por el SIES.
        </p>
      </CardContent>
    </Card>
  );
}
