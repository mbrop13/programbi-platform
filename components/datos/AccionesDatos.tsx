"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { trackEvent, trackEventOnce } from "@/lib/analytics/marketing";
import estilos from "./Observatorio.module.css";

export function VistaDatos({ territorio, periodo }: { territorio: string; periodo: string }) {
  useEffect(() => {
    trackEventOnce(`observatorio:${territorio}:${periodo}`, "datos_view", {
      seccion: "desempleo", territorio, periodo,
    });
  }, [territorio, periodo]);
  return null;
}

export function EnlaceDatos({ texto, href, formato, territorio }: {
  texto: string;
  href: string;
  formato: "csv" | "xlsx" | "pbix";
  territorio: string;
}) {
  return (
    <a className={estilos.botonClaro} href={href} download onClick={() => {
      trackEvent("datos_download", { formato, territorio });
    }}>
      <Download size={16} aria-hidden="true" /> {texto}
    </a>
  );
}

export function CopiarDatos({ texto, etiqueta, territorio, powerQuery = false }: {
  texto: string; etiqueta: string; territorio: string; powerQuery?: boolean;
}) {
  const [estado, setEstado] = useState<"listo" | "copiado" | "error">("listo");
  return (
    <div className={estilos.copiarAccion}>
      <button type="button" className={estilos.botonClaro} onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setEstado("copiado");
          if (powerQuery) trackEvent("datos_download", { formato: "pq_snippet", territorio });
        } catch {
          setEstado("error");
        }
      }}>
        {estado === "copiado" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {etiqueta}
      </button>
      <span aria-live="polite">
        {estado === "copiado" && "Copiado."}
        {estado === "error" && "Selecciona el texto y cópialo manualmente."}
      </span>
    </div>
  );
}
