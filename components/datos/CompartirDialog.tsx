"use client";

import { useState } from "react";
import { Copy, Download, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics/marketing";
import { cn } from "@/lib/utils";

export type FormatoCompartir = "1080x1350" | "1080x1920" | "1200x630";

const FORMATOS: readonly { id: FormatoCompartir; label: string; desc: string }[] = [
  { id: "1080x1350", label: "Post 4:5", desc: "1080 × 1350 px" },
  { id: "1080x1920", label: "Stories 9:16", desc: "1080 × 1920 px" },
  { id: "1200x630", label: "Horizontal", desc: "1200 × 630 px" },
];

export interface CompartirDialogProps {
  slugA: string;
  slugB?: string;
  titulo?: string;
  edicion?: string;
  recurso?: string;
  urlCompartir?: string;
  triggerLabel?: string;
  className?: string;
}

export function CompartirDialog({
  slugA,
  slugB,
  titulo = "Compartir comparativa",
  edicion = "2025-2026",
  recurso,
  urlCompartir,
  triggerLabel = "Compartir tarjeta",
  className,
}: CompartirDialogProps) {
  const [formato, setFormato] = useState<FormatoCompartir>("1080x1350");
  const [descargando, setDescargando] = useState(false);

  const destinoB = slugB ?? slugA;
  const slugs = slugB ? `${slugA},${slugB}` : slugA;
  const recursoFinal = recurso ?? `tarjeta-${slugA}${slugB ? `-vs-${slugB}` : ""}`;
  const imgPath = `/datos/carreras/compartir/${slugA}/${destinoB}?formato=${formato}&v=${encodeURIComponent(
    edicion
  )}`;

  const getShareUrl = () => {
    if (urlCompartir) return urlCompartir;
    if (typeof window !== "undefined") return window.location.href;
    return `https://www.programbi.com/datos/carreras/${slugA}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
      trackEvent("datos_share", { formato, slugs });
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const handleWhatsApp = () => {
    const url = getShareUrl();
    const texto = `${titulo} — Revisa los datos oficiales en ProgramBI: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
    trackEvent("datos_share", { formato, slugs });
  };

  const handleWebShare = async () => {
    const url = getShareUrl();
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: titulo, url });
        trackEvent("datos_share", { formato, slugs });
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
      }
    }
    await handleCopyLink();
  };

  const handleDownloadPng = async () => {
    setDescargando(true);
    try {
      const res = await fetch(imgPath);
      if (!res.ok) throw new Error("No se pudo generar la imagen");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${recursoFinal}-${formato}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      trackEvent("datos_download", { formato: "png", recurso: recursoFinal });
      toast.success("Imagen PNG descargada");
    } catch {
      toast.error("No se pudo descargar la imagen");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "border-[#e2e2dc] bg-white text-[#171716] hover:bg-[#f3f3f0]",
              className
            )}
          />
        }
      >
        <Share2 className="size-4" aria-hidden="true" />
        {triggerLabel}
      </DialogTrigger>

      <DialogContent className="border border-[#e2e2dc] bg-white text-[#171716] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#171716]">{titulo}</DialogTitle>
          <DialogDescription className="text-xs text-[#5c5c58]">
            Elige el formato de la tarjeta oficial con datos de mifuturo.cl (edición {edicion}).
          </DialogDescription>
        </DialogHeader>

        <div
          role="group"
          aria-label="Formato de tarjeta"
          className="grid grid-cols-3 gap-2 rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-1"
        >
          {FORMATOS.map((f) => {
            const activo = formato === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormato(f.id)}
                aria-pressed={activo}
                className={cn(
                  "flex flex-col items-center rounded-md px-2 py-1.5 text-center transition-colors",
                  activo
                    ? "bg-white text-[#171716] shadow-2xs"
                    : "text-[#5c5c58] hover:text-[#171716]"
                )}
              >
                <span className="text-xs font-semibold">{f.label}</span>
                <span className="text-[10px] tabular-nums">{f.desc}</span>
              </button>
            );
          })}
        </div>

        <div className="flex max-h-72 items-center justify-center overflow-hidden rounded-lg border border-[#e2e2dc] bg-[#f7f7f4] p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgPath}
            alt={`Vista previa ${titulo} (${formato})`}
            className="max-h-64 w-auto rounded-md border border-[#e2e2dc] object-contain shadow-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
          <Button
            type="button"
            onClick={handleDownloadPng}
            disabled={descargando}
            className="bg-[#1890ff] text-white hover:bg-[#1074d4]"
          >
            <Download className="size-4" aria-hidden="true" />
            {descargando ? "Bajando…" : "PNG"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            className="border-[#e2e2dc] bg-white text-[#171716] hover:bg-[#f3f3f0]"
          >
            <Copy className="size-4" aria-hidden="true" />
            Copiar link
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleWhatsApp}
            className="border-[#e2e2dc] bg-white text-[#171716] hover:bg-[#f3f3f0]"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleWebShare}
            className="border-[#e2e2dc] bg-white text-[#171716] hover:bg-[#f3f3f0]"
          >
            <Share2 className="size-4" aria-hidden="true" />
            Compartir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
