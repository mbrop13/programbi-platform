import { Linkedin } from "lucide-react";
import { TESTIMONIOS_PUBLICADOS, type Testimonial } from "@/lib/data/testimonials";

type Variante = "completa" | "compacta";

type Props = {
  testimonios: Testimonial[];
  /** `completa` para el índice /casos; `compacta` para fichas y guías. */
  variante?: Variante;
  /** Tope de tarjetas. En la variante compacta son 3 por defecto. */
  limite?: number;
  /**
   * Identificador para pruebas. Por defecto se arma con la variante; las
   * páginas que montan varios bloques pasan uno propio para no repetirlo.
   */
  testId?: string;
};

function iniciales(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => !["de", "del", "la", "las", "los", "y"].includes(part.toLowerCase()))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Tarjeta({ testimonio, compacta }: { testimonio: Testimonial; compacta: boolean }) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-line bg-paper ${
        compacta ? "px-4 py-4" : "p-5 sm:p-6"
      }`}
    >
      <blockquote className="flex-1">
        <p className={`leading-relaxed text-mute ${compacta ? "text-sm" : "text-sm sm:text-[15px]"}`}>
          “{testimonio.message}”
        </p>
      </blockquote>

      <footer className="mt-4 flex items-center gap-3 border-t border-line pt-4">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-wash text-[11px] font-semibold text-ink"
        >
          {iniciales(testimonio.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{testimonio.name}</p>
          <p className="truncate text-[11px] text-faint">{testimonio.role}</p>
        </div>
        {testimonio.linkedinUrl ? (
          <a
            href={testimonio.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Perfil de LinkedIn de ${testimonio.name}`}
            className="shrink-0 rounded-full border border-line p-1.5 text-mute no-underline transition-colors hover:border-ink/25 hover:text-ink"
          >
            <Linkedin size={15} aria-hidden />
          </a>
        ) : null}
      </footer>
    </article>
  );
}

/**
 * Citas reales de alumnos. Componente de servidor: no necesita estado ni
 * carrusel, así que no hay JavaScript de cliente. Sin estrellas ni
 * puntuaciones, porque no existe una calificación verificable.
 */
export default function Testimonios({ testimonios, variante = "completa", limite, testId }: Props) {
  if (!TESTIMONIOS_PUBLICADOS) return null;

  const tope = limite ?? (variante === "compacta" ? 3 : undefined);
  const lista = tope ? testimonios.slice(0, tope) : testimonios;
  if (lista.length === 0) return null;

  const compacta = variante === "compacta";

  return (
    <ul
      data-testid={testId ?? `testimonios-${variante}`}
      className={`grid list-none grid-cols-1 gap-3 ${
        compacta ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 lg:gap-4"
      }`}
    >
      {lista.map((testimonio, indice) => (
        <li key={`${testimonio.name}-${indice}`} className="h-full">
          <Tarjeta testimonio={testimonio} compacta={compacta} />
        </li>
      ))}
    </ul>
  );
}
