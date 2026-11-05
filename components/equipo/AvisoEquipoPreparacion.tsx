import { Info } from "lucide-react";
import { EQUIPO_PUBLICADO } from "@/lib/data/equipo";

/**
 * Aviso discreto mientras el equipo no está publicado. Explica el noindex sin
 * prometer fechas ni cifras: el flag se enciende cuando existan las biografías.
 */
export default function AvisoEquipoPreparacion({ className = "" }: { className?: string }) {
  if (EQUIPO_PUBLICADO) return null;

  return (
    <p
      className={`inline-flex items-start gap-2.5 rounded-2xl border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-mute ${className}`}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
      <span>
        <strong className="font-semibold text-ink">Equipo en preparación.</strong> Estamos
        completando las biografías y los perfiles; esta página todavía no se indexa en buscadores.
      </span>
    </p>
  );
}
