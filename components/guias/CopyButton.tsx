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
      ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
      : "border-line-strong bg-canvas text-ink hover:bg-wash";

  return (
    <button
      type="button"
      onClick={copiar}
      aria-live="polite"
      className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-semibold transition-colors ${
        copiado ? "border-emerald-600/40 bg-emerald-600/15 text-emerald-700 dark:text-emerald-300" : estiloBase
      }`}
    >
      {copiado ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
      <span>{copiado ? "Copiado" : label}</span>
    </button>
  );
}
