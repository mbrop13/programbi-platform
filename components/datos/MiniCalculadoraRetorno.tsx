"use client";

import Link from "@/components/datos/EnlaceNavegacionDatos";
import { useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { TipoIesKey } from "@/lib/datos/carreras";
import { pesos } from "@/lib/datos/formato";

interface MiniCalculadoraRetornoProps {
  slug: string;
  tipo: TipoIesKey;
  arancelMediano: number | null;
  durRealSemestres: number | null;
  ing1: number | null;
  ing4: number | null;
  factorIpc?: number;
}

export function MiniCalculadoraRetorno({
  slug,
  tipo,
  arancelMediano,
  durRealSemestres,
  ing1,
  ing4,
  factorIpc = 1,
}: MiniCalculadoraRetornoProps) {
  const [conGratuidad, setConGratuidad] = useState(false);

  if (!arancelMediano || !durRealSemestres) return null;

  const anosReales = durRealSemestres / 2;
  const costoTotal = conGratuidad ? 0 : Math.round(arancelMediano * anosReales);
  const ing1Ajustado = ing1 !== null ? Math.round(ing1 * factorIpc) : null;
  const ing4Ajustado = ing4 !== null ? Math.round(ing4 * factorIpc) : null;

  const mesesIng1 =
    !conGratuidad && ing1Ajustado && ing1Ajustado > 0
      ? Math.round((costoTotal / ing1Ajustado) * 10) / 10
      : 0;
  const mesesIng4 =
    !conGratuidad && ing4Ajustado && ing4Ajustado > 0
      ? Math.round((costoTotal / ing4Ajustado) * 10) / 10
      : 0;

  return (
    <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Calculator className="size-3.5 text-blue-600" aria-hidden="true" />
              Estimador rápido de inversión vs. sueldo
            </span>
            <h3 className="mt-1 text-base font-semibold text-foreground">
              ¿A cuántos meses de sueldo equivale el arancel total?
            </h3>
          </div>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground">
            <Switch
              checked={conGratuidad}
              onCheckedChange={setConGratuidad}
              aria-label="Estudio con gratuidad o beca"
            />
            Estudio con gratuidad o beca
          </label>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3 tabular-nums">
          <div className="rounded-lg border border-border bg-muted/35 p-4">
            <span className="block text-xs text-muted-foreground">
              Arancel total ({anosReales.toFixed(1).replace(".", ",")} años reales)
            </span>
            <span className="mt-1 block text-xl font-bold text-foreground">
              {pesos(costoTotal)}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-muted/35 p-4">
            <span className="block text-xs text-muted-foreground">
              En sueldos del 1.er año
            </span>
            <span className="mt-1 block text-xl font-bold text-blue-700">
              {conGratuidad
                ? "0 meses"
                : ing1Ajustado
                  ? `${mesesIng1.toFixed(1).replace(".", ",")} meses`
                  : "Sin dato"}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-muted/35 p-4">
            <span className="block text-xs text-muted-foreground">
              En sueldos del 4.º año
            </span>
            <span className="mt-1 block text-xl font-bold text-foreground">
              {conGratuidad
                ? "0 meses"
                : ing4Ajustado
                  ? `${mesesIng4.toFixed(1).replace(".", ",")} meses`
                  : "Sin dato"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3.5">
          <p className="text-xs text-muted-foreground">
            Estimación referencial con arancel mediano 2026; no incluye impuestos ni costo de vida.
          </p>
          <Link
            href={`/datos/carreras/retorno?c=${encodeURIComponent(slug)}&t=${tipo}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:underline"
          >
            Personalizar en la calculadora completa
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
