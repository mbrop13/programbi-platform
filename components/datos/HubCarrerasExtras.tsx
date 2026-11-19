"use client";

import * as React from "react";
import { Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trackEvent, trackEventOnce } from "@/lib/analytics/marketing";

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
    <div className="flex flex-wrap gap-3">
      <a
        href="/datos/carreras/csv/ranking-carreras.csv"
        download
        onClick={() => handleDownload("ranking-carreras")}
        className="inline-flex items-center gap-2 rounded-lg border border-[#d4d4ce] bg-white px-4 py-2 text-xs font-semibold text-[#171716] transition-colors hover:border-[#1890ff] hover:bg-[#e9f4ff]"
      >
        <Download className="size-3.5 text-[#1890ff]" />
        Descargar ranking-carreras.csv
      </a>
      <a
        href="/datos/carreras/csv/carreras-instituciones.csv"
        download
        onClick={() => handleDownload("carreras-instituciones")}
        className="inline-flex items-center gap-2 rounded-lg border border-[#d4d4ce] bg-white px-4 py-2 text-xs font-semibold text-[#171716] transition-colors hover:border-[#1890ff] hover:bg-[#e9f4ff]"
      >
        <Download className="size-3.5 text-[#1890ff]" />
        Descargar carreras-instituciones.csv
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
    <div className="rounded-xl border border-[#e2e2dc] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[#171716]">Cómo citar este observatorio</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={copiar}
          className="h-7 gap-1.5 border-[#d4d4ce] text-xs"
        >
          {copiado ? (
            <>
              <Check className="size-3 text-emerald-600" />
              Copiada
            </>
          ) : (
            <>
              <Copy className="size-3 text-[#1890ff]" />
              Copiar cita
            </>
          )}
        </Button>
      </div>
      <p className="mt-2 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3 font-mono text-xs leading-relaxed text-[#3c3c39]">
        {cita}
      </p>
    </div>
  );
}
