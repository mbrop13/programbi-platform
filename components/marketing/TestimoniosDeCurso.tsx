import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Testimonios from "@/components/marketing/Testimonios";
import { getCourseBySlug } from "@/lib/data/courses";
import { testimoniosDeCurso } from "@/lib/data/testimonials";

type Props = {
  /** Slug de la ficha del curso (`power-bi`, `sql-server`, ...). */
  cursoSlug: string;
  /** Tope de tarjetas visibles. Por defecto, 3. */
  limite?: number;
  /** `compacta` para fichas y guías; `completa` deja tarjetas más aireadas. */
  variante?: "completa" | "compacta";
  /** Título propio; si no viene, se arma con el nombre real del curso. */
  titulo?: string;
  /** Párrafo de apoyo; si no viene, se usa una frase neutra. */
  descripcion?: string;
  /** Enlace al índice /casos. Encendido por defecto. */
  enlaceIndice?: boolean;
  /** Id del bloque. Cambia solo si se monta dos veces en la misma página. */
  id?: string;
};

/**
 * Bloque de testimonios reales de un curso.
 *
 * Filtra por `cursoSlug` y no renderiza nada si ese curso no tiene citas
 * atribuibles (o si el flag `NEXT_PUBLIC_TESTIMONIOS` está en "0"). Así se
 * puede montar en una ficha o en una guía con una sola línea sin dejar
 * secciones vacías.
 */
export default function TestimoniosDeCurso({
  cursoSlug,
  limite = 3,
  variante = "compacta",
  titulo,
  descripcion,
  enlaceIndice = true,
  id,
}: Props) {
  const testimonios = testimoniosDeCurso(cursoSlug).slice(0, limite);
  if (testimonios.length === 0) return null;

  const curso = getCourseBySlug(cursoSlug);
  const nombreCurso = curso?.title ?? "este curso";
  const idBloque = id ?? `testimonios-${cursoSlug}`;

  return (
    <section
      data-testid="testimonios-del-curso"
      aria-labelledby={idBloque}
      className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1120px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Testimonios de alumnos
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2
            id={idBloque}
            className="max-w-[34ch] text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            {titulo ?? `Lo que dicen los alumnos de ${nombreCurso}`}
          </h2>
          {enlaceIndice ? (
            <Link
              href="/casos"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline"
            >
              Ver todos los testimonios
              <ArrowRight size={14} aria-hidden />
            </Link>
          ) : null}
        </div>

        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-mute">
          {descripcion ??
            `Citas textuales de alumnos que ya cursaron ${nombreCurso}, publicadas por ellos en LinkedIn.`}
        </p>

        <div className="mt-8">
          <Testimonios
            variante={variante}
            testimonios={testimonios}
            testId={`testimonios-${cursoSlug}`}
          />
        </div>
      </div>
    </section>
  );
}
