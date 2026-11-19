"use client";

import * as React from "react";
import { Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trackEvent, trackEventOnce } from "@/lib/analytics/marketing";
import { cn } from "@/lib/utils";

export function DatosViewTracker({
  evento = "datos_view",
  params,
}: {
  evento?: string;
  params: Record<string, string | number | boolean>;
}) {
  const key = `${evento}:${JSON.stringify(params)}`;
  React.useEffect(() => {
    trackEventOnce(key, evento, params);
  }, [key, evento, params]);

  return null;
}

export function CsvDownloadButtons() {
  const handleDownload = (recurso: string) => {
    trackEvent("datos_download", { formato: "csv", recurso });
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      <a
        href="/datos/carreras/csv/ranking-carreras.csv"
        download
        onClick={() => handleDownload("ranking-carreras")}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-9 gap-2 rounded-lg bg-card px-3.5 text-xs font-medium"
        )}
      >
        <Download className="size-3.5 text-blue-600" aria-hidden="true" />
        ranking-carreras.csv
      </a>
      <a
        href="/datos/carreras/csv/carreras-instituciones.csv"
        download
        onClick={() => handleDownload("carreras-instituciones")}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-9 gap-2 rounded-lg bg-card px-3.5 text-xs font-medium"
        )}
      >
        <Download className="size-3.5 text-blue-600" aria-hidden="true" />
        carreras-instituciones.csv
      </a>
    </div>
  );
}

export function ComoCitarBox({ cita }: { cita: string }) {
  const [copiado, setCopiado] = React.useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(cita);
      setCopiado(true);
      toast.success("Cita bibliográfica copiada");
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error("No se pudo copiar la cita");
    }
  };

  return (
    <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">Cómo citar este observatorio</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copiar}
            className="h-8 gap-1.5 bg-card text-xs"
          >
            {copiado ? (
              <>
                <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
                Copiada
              </>
            ) : (
              <>
                <Copy className="size-3.5 text-muted-foreground" aria-hidden="true" />
                Copiar cita
              </>
            )}
          </Button>
        </div>
        <p className="mt-3 rounded-lg border border-border bg-muted/50 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
          {cita}
        </p>
      </CardContent>
    </Card>
  );
}
