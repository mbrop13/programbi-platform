"use client";

import { useEffect, useRef, useState } from "react";
import { GuiaCodeShell, type GuiaCodeTab } from "@/components/guias/GuiaEditorialPrimitives";
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
  prompt: "Prompt listo para copiar",
  sheets: "Google Sheets",
  bash: "Terminal",
};

function PromptBlock({ bloque }: { bloque: BloqueCodigo }) {
  const [copiado, setCopiado] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(bloque.codigo);
      setCopiado(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopiado(false), 1800);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-[var(--g-code-border)] bg-[var(--g-code-bg)] shadow-[var(--g-card-shadow)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--g-code-border)] bg-[var(--g-code-surface)] px-4 py-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="inline-flex items-center rounded-md bg-[var(--g-accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--g-accent)]">
            {ETIQUETA_LENGUAJE.prompt}
          </span>
          {bloque.titulo ? (
            <span className="truncate text-xs font-medium text-[var(--g-code-ink)]">
              {bloque.titulo}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span className="sr-only" aria-live="polite">
            {copiado ? "Copiado" : ""}
          </span>
          <button
            type="button"
            onClick={copiar}
            aria-label={copiado ? "Prompt copiado" : `Copiar ${bloque.titulo || "prompt"}`}
            className={[
              "inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors sm:min-h-[32px]",
              copiado
                ? "border-[var(--g-ok)]/30 bg-[var(--g-ok-soft)] text-[var(--g-ok)]"
                : "border-[var(--g-code-border)] bg-[var(--g-code-bg)] text-[var(--g-code-ink)] hover:border-[var(--g-border-strong)]",
            ].join(" ")}
          >
            {copiado ? (
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <path
                  d="M3.5 8.5l3 3 6-6.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1.25" stroke="currentColor" strokeWidth="1.4" />
                <path
                  d="M10.5 5.5V4.25A1.25 1.25 0 009.25 3H4.25A1.25 1.25 0 003 4.25v5A1.25 1.25 0 004.25 10.5H5.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            )}
            <span>{copiado ? "Copiado" : "Copiar"}</span>
          </button>
        </div>
      </div>

      <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-relaxed text-[var(--g-code-ink)]">
        <code>{bloque.codigo}</code>
      </pre>

      {bloque.nota ? (
        <p className="border-t border-[var(--g-code-border)] bg-[var(--g-code-surface)] px-4 py-2.5 text-xs leading-relaxed text-[var(--g-code-muted)]">
          {bloque.nota}
        </p>
      ) : null}
    </div>
  );
}

export default function GuiaPasoAPasoCodeBlock({ bloque }: { bloque: BloqueCodigo }) {
  if (bloque.lenguaje === "prompt") {
    return <PromptBlock bloque={bloque} />;
  }

  const tieneEn = Boolean(bloque.codigoEn && bloque.codigoEn.trim().length > 0);
  const etiqueta = ETIQUETA_LENGUAJE[bloque.lenguaje];
  const titulo = bloque.titulo ? `${etiqueta}: ${bloque.titulo}` : etiqueta;

  const tabs: GuiaCodeTab[] | undefined = tieneEn
    ? [
        {
          id: "es",
          label: "ES (;)",
          code: bloque.codigo,
          language: bloque.lenguaje,
        },
        {
          id: "en",
          label: "EN (,)",
          code: bloque.codigoEn ?? bloque.codigo,
          language: bloque.lenguaje,
        },
      ]
    : undefined;

  return (
    <div className="my-6">
      <GuiaCodeShell
        code={bloque.codigo}
        language={bloque.lenguaje}
        title={titulo}
        tabs={tabs}
        defaultTabId="es"
        showLineNumbers={bloque.mostrarLineas ?? true}
        className="my-0"
      />
      {bloque.nota ? (
        <p className="mt-2 px-1 text-xs leading-relaxed text-[var(--g-muted)]">
          {bloque.nota}
        </p>
      ) : null}
    </div>
  );
}
