"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Botón liviano de 1 clic para copiar prompts o código desde cualquier guía. */
export default function CopyButton({
  text,
  label = "Copiar",
  variant = "paper",
}: {
  text: string;
  label?: string;
  variant?: "paper" | "dark";
}) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const timer = window.setTimeout(() => setCopiado(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copiado]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiado(true);
    } catch {
      /* Fallback silencioso si el navegador bloquea el portapapeles. */
    }
  };

  const estiloBase =
    variant === "dark"
      ? "border-[var(--g-code-border)] bg-[var(--g-code-bg)] text-[var(--g-code-ink)] hover:border-[var(--g-code-muted)]"
      : "border-[var(--g-border-strong)] bg-[var(--g-bg)] text-[var(--g-ink)] hover:bg-[var(--g-wash)]";

  return (
    <button
      type="button"
      onClick={copiar}
      aria-live="polite"
      aria-label={copiado ? "Copiado" : label}
      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors sm:min-h-[32px] ${
        copiado
          ? "border-[var(--g-accent)] bg-[var(--g-accent-soft)] text-[var(--g-accent)]"
          : estiloBase
      }`}
    >
      {copiado ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
      <span>{copiado ? "Copiado" : label}</span>
    </button>
  );
}
