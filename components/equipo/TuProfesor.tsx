import Link from "next/link";
import { ArrowRight, Check, Linkedin } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { miembroPorCurso, rutaPerfil } from "@/lib/data/equipo";
import { inicialesDe } from "./iniciales";

/**
 * Bloque «Tu profesor» de la ficha de curso (marketing y país).
 *
 * El profesor sale de `miembroPorCurso`, la misma fuente que usa el
 * `instructor` del JSON-LD, para que la página y el schema nunca se contradigan.
 * Solo pinta datos que existen en `lib/data/mentors.ts`.
 */
export default function TuProfesor({ cursoSlug }: { cursoSlug: string }) {
  const miembro = miembroPorCurso(cursoSlug);
  const perfil = rutaPerfil(miembro.slug);

  return (
    <section
      className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      aria-labelledby="tu-profesor"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-line bg-wash lg:col-span-4">
          {miembro.imageUrl ? (
            <CourseImage
              src={miembro.imageUrl}
              alt={`${miembro.nombre}, profesor de ProgramBI`}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-[center_18%]"
            />
          ) : (
            <span
              className="absolute inset-0 flex items-center justify-center font-display text-5xl font-black text-faint"
              aria-hidden="true"
            >
              {inicialesDe(miembro.nombre)}
            </span>
          )}
        </div>

        <div className="lg:col-span-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">Tu profesor</p>
          <h2 id="tu-profesor" className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            <Link href={perfil} className="text-ink no-underline hover:underline">
              {miembro.nombre}
            </Link>
          </h2>
          <p className="mt-1 text-sm font-semibold text-mute">
            {miembro.cargo}
            {miembro.rol ? <span className="font-normal text-faint"> · {miembro.rol}</span> : null}
          </p>

          {miembro.credenciales.length > 0 ? (
            <ul className="mt-5 space-y-2">
              {miembro.credenciales.slice(0, 2).map((credencial) => (
                <li key={credencial} className="flex items-start gap-2 text-sm leading-relaxed text-mute">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
                  <span>{credencial}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={perfil}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-canvas no-underline transition-opacity hover:opacity-90"
            >
              Ver perfil completo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {miembro.linkedinUrl ? (
              <a
                href={miembro.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink no-underline transition-colors hover:border-ink/30"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
