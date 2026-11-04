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
    <section aria-labelledby="fuentes-guia" data-testid="fuentes-guia" className="mt-12 border-t border-line pt-8">
      <h2 id="fuentes-guia" className="text-lg font-bold tracking-tight text-ink">
        Fuentes y metodología
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-mute">
        Los datos de esta guía salen de las fichas de los cursos y de fuentes públicas citadas abajo. Última revisión:{" "}
        {fechaActualizado(updated)}.
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {sources.map((url) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1.5 text-sm font-medium text-ink underline underline-offset-4"
            >
              <ExternalLink size={13} className="mt-1 shrink-0" aria-hidden />
              <span className="break-all">{dominio(url)}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
