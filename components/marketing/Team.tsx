import Link from "next/link";
import CourseImage from "@/components/shared/CourseImage";
import { mentors } from "@/lib/data/mentors";
import { LISTADO_PROFESORES_INDEXABLE } from "@/lib/seo/indexabilidad";

export default function Team() {
  return (
    <section className="cv-auto border-y border-[var(--h-border)] bg-[var(--h-surface)] py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--h-ink)] sm:text-4xl">
              Conoce a nuestro equipo
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base leading-relaxed text-[var(--h-muted)]">
              Clases en vivo guiadas por profesionales en ejercicio que trabajan hoy con datos en banca, finanzas, retail y minería.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {mentors.map((mentor) => (
            <article key={mentor.name} className="flex flex-col">
              <div className="overflow-hidden rounded-xl border border-[var(--h-border)] bg-[var(--h-wash)]">
                {mentor.imageUrl ? (
                  <CourseImage
                    src={mentor.imageUrl}
                    alt={`${mentor.name}, ${mentor.role} en ProgramBI`}
                    width={640}
                    height={480}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="aspect-[4/3] w-full object-cover object-top"
                  />
                ) : (
                  <div className="aspect-[4/3] w-full bg-[var(--h-wash)]" aria-hidden="true" />
                )}
              </div>

              <div className="mt-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold tracking-tight text-[var(--h-ink)]">
                    {mentor.name}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-[var(--h-muted)]">
                    {mentor.role}
                    {mentor.isFounder ? " · Fundador" : ""}
                  </p>
                </div>

                {mentor.linkedinUrl ? (
                  <a
                    href={mentor.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg border border-[var(--h-border)] text-xs font-semibold text-[var(--h-muted)] transition-colors hover:border-[var(--h-border-strong)] hover:text-[var(--h-ink)]"
                    aria-label={`LinkedIn de ${mentor.name}`}
                  >
                    in
                  </a>
                ) : null}
              </div>

              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[var(--h-muted)]">
                {mentor.credentials.slice(0, 3).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>

              <p className="mt-4 border-t border-[var(--h-border)] pt-3 text-xs font-medium text-[var(--h-subtle)]">
                {mentor.studentCount.toLocaleString("es-CL")}+ alumnos · {mentor.yearsExperience}+ años de experiencia
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 border-t border-[var(--h-border)] pt-6">
          <Link
            href={LISTADO_PROFESORES_INDEXABLE ? "/profesores" : "/nosotros"}
            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--h-ink)] underline decoration-[var(--h-border-strong)] underline-offset-4 transition-colors hover:decoration-[var(--h-ink)]"
          >
            Ver perfiles del equipo
          </Link>
        </div>
      </div>
    </section>
  );
}
