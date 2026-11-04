import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCourseBySlug } from "@/lib/data/courses";
import { guiasDelCurso } from "@/lib/guias";
import { GUIAS } from "@/lib/guias/generado";
import { esGuiaPublicada } from "@/lib/guias/relacionadas";
import type { Guia } from "@/lib/guias/tipos";

type Props = {
  /** Slug del curso, tal como aparece en lib/data/courses.ts. */
  curso: string;
  /** ISO del mercado de la ficha: la guía de ese país va primero. */
  pais: string;
};

function prioridad(guia: Guia, pais: string): number {
  if (guia.country === pais) return 0;
  if (guia.country === "transversal") return 1;
  return 2;
}

/**
 * Enlazado interno curso → guías: 4-6 enlaces del curso, con la guía del
 * mercado actual primero. Es un bloque de servidor, sin estado ni efectos.
 */
export default function EnlacesGuiaCurso({ curso, pais }: Props) {
  const propias = guiasDelCurso(curso).filter(esGuiaPublicada);
  const todas = GUIAS.filter((guia) => guia.course === curso && esGuiaPublicada(guia));
  if (todas.length === 0) return null;

  const vistos = new Set<string>();
  const candidatas = [...propias, ...todas]
    .filter((guia) => {
      if (vistos.has(guia.path)) return false;
      vistos.add(guia.path);
      return true;
    })
    .map((guia, index) => ({ guia, index }))
    .sort((a, b) => prioridad(a.guia, pais) - prioridad(b.guia, pais) || a.index - b.index)
    .map(({ guia }) => guia)
    .slice(0, 6);

  if (candidatas.length === 0) return null;

  const nombre = getCourseBySlug(curso)?.title ?? curso;

  return (
    <section
      aria-labelledby="guias-curso"
      className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Guías del curso
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2
            id="guias-curso"
            className="max-w-[28ch] text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            Guías de {nombre}
          </h2>
          <Link
            href="/guias"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline"
          >
            Todas las guías
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-mute">
          Rutas de aprendizaje, precios locales y ejemplos para aplicar {nombre} en tu trabajo.
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {candidatas.map((guia) => (
            <li key={guia.path}>
              <Link
                href={guia.path}
                className="group flex h-full flex-col rounded-2xl border border-line bg-paper px-5 py-4 no-underline transition-colors hover:border-ink/25"
              >
                <span className="text-sm font-semibold leading-snug text-ink">{guia.h1}</span>
                <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-mute">
                  {guia.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
