import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EnResumenProps {
  frases: readonly string[];
  titulo?: string;
  fuente?: string;
  id?: string;
  className?: string;
}

export function EnResumen({
  frases,
  titulo = "En resumen",
  fuente,
  id = "en-resumen-titulo",
  className,
}: EnResumenProps) {
  if (frases.length === 0) return null;

  return (
    <section
      aria-labelledby={id}
      className={cn(
        "prose-datos rounded-xl border border-[#e2e2dc] border-t-4 border-t-[#1890ff] bg-white p-6",
        className
      )}
    >
      <h2 id={id} className="flex items-center gap-2 text-lg font-bold text-[#171716]">
        <Sparkles className="size-4 text-[#1890ff]" aria-hidden="true" />
        {titulo}
      </h2>
      <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#3c3c39]">
        {frases.map((frase) => (
          <p key={frase}>{frase}</p>
        ))}
      </div>
      {fuente ? <p className="mt-4 text-xs text-[#5c5c58]">{fuente}</p> : null}
    </section>
  );
}
