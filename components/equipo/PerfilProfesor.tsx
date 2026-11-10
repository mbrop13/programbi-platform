import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Linkedin } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { getCourseBySlug } from "@/lib/data/courses";
import type { MiembroEquipo } from "@/lib/data/equipo";
import { inicialesDe } from "./iniciales";

/** Ficha completa de un profesor en /profesores/[slug]. */
export default function PerfilProfesor({ miembro }: { miembro: MiembroEquipo }) {
  const cursos = miembro.cursos.flatMap((slug) => {
    const curso = getCourseBySlug(slug);
    return curso ? [curso] : [];
  });

  return (
    <article className="mx-auto max-w-6xl px-5">
      <Link
        href="/profesores"
        className="inline-flex items-center gap-1.5 text-sm text-mute no-underline hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver al equipo
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-line bg-wash">
          {miembro.imageUrl ? (
            <CourseImage
              src={miembro.imageUrl}
              alt={miembro.nombre}
              fill
              priority
              sizes="(min-width: 1024px) 320px, 90vw"
              className="object-cover object-[center_18%]"
            />
          ) : (
            <span
              className="absolute inset-0 flex items-center justify-center font-display text-6xl font-black text-faint"
              aria-hidden="true"
            >
              {inicialesDe(miembro.nombre)}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
            {miembro.rol}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {miembro.nombre}
          </h1>
          <p className="mt-2 text-lg text-mute">{miembro.cargo}</p>
          {miembro.esFundador ? (
            <p className="mt-3 inline-flex rounded-full border border-line bg-paper px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
              Fundador
            </p>
          ) : null}

          {miembro.credenciales.length > 0 ? (
            <section className="mt-8" aria-labelledby="formacion-credenciales">
              <h2
                id="formacion-credenciales"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-faint"
              >
                Formación y credenciales
              </h2>
              <ul className="mt-3 space-y-2">
                {miembro.credenciales.map((linea) => (
                  <li key={linea} className="flex items-start gap-2 text-sm leading-relaxed text-mute">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
                    <span>{linea}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {miembro.bio ? (
            <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-mute">{miembro.bio}</p>
          ) : null}

          {miembro.trayectoria.length > 0 ? (
            <section className="mt-8" aria-labelledby="trayectoria-profesional">
              <h2
                id="trayectoria-profesional"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-faint"
              >
                Trayectoria
              </h2>
              <ul className="mt-3 space-y-2">
                {miembro.trayectoria.map((linea) => (
                  <li
                    key={linea}
                    className="flex items-start gap-2 text-sm leading-relaxed text-mute"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-faint"
                      aria-hidden="true"
                    />
                    <span>{linea}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {miembro.linkedinUrl ? (
            <a
              href={miembro.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-canvas no-underline transition-opacity hover:opacity-90"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              Ver LinkedIn
            </a>
          ) : null}

          {cursos.length > 0 ? (
            <section className="mt-10 border-t border-line pt-6" aria-labelledby="cursos-dictados">
              <h2
                id="cursos-dictados"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-faint"
              >
                Cursos que dicta
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {cursos.map((curso) => (
                  <li key={curso.slug}>
                    <Link
                      href={`/cursos/${curso.slug}`}
                      className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-3 py-1.5 text-sm font-medium text-ink no-underline transition-colors hover:border-ink/30"
                    >
                      {curso.title}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
