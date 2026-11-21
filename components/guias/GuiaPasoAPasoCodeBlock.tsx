"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { BloqueCodigo } from "@/lib/guias/paso-a-paso-tipos";

const ETIQUETA_LENGUAJE: Record<BloqueCodigo["lenguaje"], string> = {
  m: "M (Power Query)",
  dax: "DAX",
  excel: "Fórmula Excel",
  vba: "VBA",
  python: "Python",
  sql: "SQL Server",
  json: "JSON",
  "power-automate": "Power Automate",
};

export default function GuiaPasoAPasoCodeBlock({ bloque }: { bloque: BloqueCodigo }) {
  const [idioma, setIdioma] = useState<"es" | "en">("es");
  const [copiado, setCopiado] = useState(false);

  const tieneEn = Boolean(bloque.codigoEn && bloque.codigoEn.trim().length > 0);
  const codigoActivo = idioma === "en" && bloque.codigoEn ? bloque.codigoEn : bloque.codigo;
  const lineas = codigoActivo.split("\n");

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigoActivo);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* clipboard API puede fallar en contextos sin permisos */
    }
  };

  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-line-strong bg-paper shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-wash/70 px-4 py-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-ink px-2 py-0.5 text-[11px] font-bold tracking-wide text-canvas">
            {ETIQUETA_LENGUAJE[bloque.lenguaje]}
          </span>
          <span className="truncate text-xs font-semibold text-ink">{bloque.titulo}</span>
        </div>

        <div className="flex items-center gap-2">
          {tieneEn ? (
            <div
              role="group"
              aria-label="Idioma de la fórmula"
              className="inline-flex rounded-full border border-line-strong bg-canvas p-0.5 text-[11px]"
            >
              <button
                type="button"
                aria-pressed={idioma === "es"}
                onClick={() => setIdioma("es")}
                className={`rounded-full px-2.5 py-0.5 font-semibold transition-colors ${
                  idioma === "es" ? "bg-ink text-canvas" : "text-mute hover:text-ink"
                }`}
              >
                Español (;)
              </button>
              <button
                type="button"
                aria-pressed={idioma === "en"}
                onClick={() => setIdioma("en")}
                className={`rounded-full px-2.5 py-0.5 font-semibold transition-colors ${
                  idioma === "en" ? "bg-ink text-canvas" : "text-mute hover:text-ink"
                }`}
              >
                Inglés (,)
              </button>
            </div>
          ) : null}

          <button
            type="button"
            onClick={copiar}
            aria-label={`Copiar ${bloque.titulo}`}
            className="inline-flex h-7 items-center gap-1.5 rounded-full border border-line-strong bg-canvas px-3 text-xs font-semibold text-ink transition-colors hover:bg-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            {copiado ? (
              <>
                <Check size={13} aria-hidden />
                Copiado
              </>
            ) : (
              <>
                <Copy size={13} aria-hidden />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-[#171716] px-4 py-3.5 text-[13px] leading-relaxed text-[#f5f5f2]">
        <pre className="m-0 font-mono">
          <code>
            {bloque.mostrarLineas
              ? lineas.map((linea, idx) => (
                  <span key={idx} className="block">
                    <span className="mr-4 inline-block w-6 select-none text-right text-[#8d8d86]">
                      {idx + 1}
                    </span>
                    {linea}
                  </span>
                ))
              : codigoActivo}
          </code>
        </pre>
      </div>

      {bloque.nota ? (
        <p className="border-t border-line bg-wash/40 px-4 py-2 text-xs leading-relaxed text-mute">
          {bloque.nota}
        </p>
      ) : null}
    </div>
  );
}
