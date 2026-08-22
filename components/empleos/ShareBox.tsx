"use client";

import { useState } from "react";
import { Check, Copy, Link2, Linkedin, MessageCircle } from "lucide-react";

/** Compartir vacante por WhatsApp, LinkedIn o copiando el enlace. */
export default function ShareBox({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  // La URL se lee al momento de la acción: sin estado, sin divergencia de hidratación
  const share = (kind: "whatsapp" | "linkedin") => {
    const url = window.location.href;
    const text = `${title} — Bolsa de Trabajo ProgramBI`;
    const target =
      kind === "whatsapp"
        ? `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard no disponible */
    }
  };

  const btn =
    "inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 text-xs font-medium text-mute transition-colors hover:text-ink hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-faint">
        <Link2 size={13} />
        Compartir
      </span>
      <button onClick={() => share("whatsapp")} className={btn}>
        <MessageCircle size={13} />
        WhatsApp
      </button>
      <button onClick={() => share("linkedin")} className={btn}>
        <Linkedin size={13} />
        LinkedIn
      </button>
      <button onClick={copy} className={btn}>
        {copied ? <Check size={13} className="text-[#16a34a]" /> : <Copy size={13} />}
        {copied ? "Copiado" : "Copiar link"}
      </button>
    </div>
  );
}
