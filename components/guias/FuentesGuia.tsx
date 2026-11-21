import { ExternalLink } from "lucide-react";
import { fechaActualizado } from "@/lib/guias/precio";

/** Dominio legible de una URL, para no mostrar la URL completa en la lista. */
function dominio(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Bloque de transparencia: de dónde salen los datos de la guía y cuándo se
 * revisaron. Sin fuentes no se renderiza (nunca inventamos una fuente).
 */
export default function FuentesGuia({ sources, updated }: { sources?: string[]; updated: string }) {
  if (!sources || sources.length === 0) return null;

  return (
    <section
      aria-labelledby="fuentes-guia"
      data-testid="fuentes-guia"
      className="mt-12 border-t border-[var(--g-border)] pt-8"
    >
      <h2 id="fuentes-guia" className="text-lg font-bold tracking-tight text-[var(--g-ink)]">
        Fuentes y metodología
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--g-muted)]">
        Los datos de esta guía salen de las fichas de los cursos y de fuentes públicas citadas abajo. Última revisión:{" "}
        <span className="tabular-nums text-[var(--g-ink)]">{fechaActualizado(updated)}</span>.
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {sources.map((url) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--g-accent)] sm:min-h-0"
            >
              <ExternalLink size={13} className="shrink-0" aria-hidden />
              <span className="break-all">{dominio(url)}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
