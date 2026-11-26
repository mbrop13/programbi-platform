import Link from "next/link";
import { Linkedin } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { mentors } from "@/lib/data/mentors";
import { LISTADO_PROFESORES_INDEXABLE } from "@/lib/seo/indexabilidad";

export default function Team() {
  return (
    <section className="cv-auto border-t border-line py-14 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Conoce a nuestro equipo
        </h2>
        <p className="mt-3 max-w-[40rem] text-sm leading-relaxed text-mute">
          Aprende de profesionales que trabajan con datos en banca, retail y minería.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <article
              key={mentor.name}
              className="flex flex-col rounded-[22px] border border-line bg-paper p-5"
            >
              {/* Foto junto al nombre; el perfil va debajo a todo el ancho para que no se corte en móvil. */}
              <div className="flex items-start gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-wash sm:size-20">
                  {mentor.imageUrl ? (
                    <CourseImage
                      src={mentor.imageUrl}
                      alt={mentor.name}
                      fill
                      sizes="80px"
                      className="object-cover object-[center_18%]"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="text-[17px] leading-tight font-bold tracking-tight text-ink">
                    {mentor.name}
                  </h3>
                  <p className="mt-1 text-[13px] text-mute">{mentor.role}</p>
                  {mentor.isFounder ? (
                    <span className="mt-1.5 inline-block rounded-full bg-wash px-2 py-0.5 text-[11px] font-semibold text-mute">
                      Fundador
                    </span>
                  ) : null}
                </div>
                {mentor.linkedinUrl ? (
                  <a
                    href={mentor.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-mt-2.5 -mr-2.5 grid size-11 shrink-0 place-items-center rounded-xl text-mute transition-colors hover:bg-wash hover:text-ink"
                    aria-label={`LinkedIn de ${mentor.name}`}
                  >
                    <Linkedin size={18} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
              <ul className="mt-4 space-y-1.5 text-[13px] leading-snug text-mute">
                {mentor.credentials.slice(0, 3).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="mt-auto pt-3 text-xs font-medium text-ink">
                {mentor.studentCount.toLocaleString("es-CL")}+ alumnos · {mentor.yearsExperience}+ años
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href={LISTADO_PROFESORES_INDEXABLE ? "/profesores" : "/nosotros"}
            className="text-sm font-semibold text-ink no-underline hover:underline"
          >
            Ver perfiles
          </Link>
        </div>
      </div>
    </section>
  );
}
