import { Linkedin } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { mentors } from "@/lib/data/mentors";
import { inicialesDe } from "./iniciales";

/**
 * Bloque «Nuestro equipo» de la ficha de curso (marketing y país).
 *
 * Muestra a los profesores reales de `lib/data/mentors.ts` en una grilla
 * ordenada de tres columnas.
 */
export default function TuProfesor() {
  const equipo = [...mentors].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      aria-labelledby="nuestro-equipo"
    >
      <div className="mx-auto max-w-[1400px]">
        <h2
          id="nuestro-equipo"
          className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Nuestro equipo
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {equipo.map((mentor) => (
            <article
              key={mentor.name}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="overflow-hidden bg-wash">
                {mentor.imageUrl ? (
                  <CourseImage
                    src={mentor.imageUrl}
                    alt={`${mentor.name}, ${mentor.role}`}
                    width={640}
                    height={480}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="aspect-[4/3] w-full object-cover object-top"
                  />
                ) : (
                  <div
                    className="flex aspect-[4/3] w-full items-center justify-center font-display text-4xl font-black text-faint"
                    aria-hidden="true"
                  >
                    {inicialesDe(mentor.name)}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold tracking-tight text-ink">
                      {mentor.name}
                    </h3>
                    <p className="mt-0.5 text-sm font-semibold text-mute">
                      {mentor.role}
                    </p>
                  </div>

                  {mentor.linkedinUrl ? (
                    <a
                      href={mentor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-mute transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                      aria-label={`LinkedIn de ${mentor.name}`}
                    >
                      <Linkedin className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-mute">
                  {mentor.founderBio ?? mentor.credentials.join(" ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
