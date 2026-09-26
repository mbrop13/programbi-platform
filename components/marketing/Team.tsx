import Link from "next/link";
import { Linkedin } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { mentors } from "@/lib/data/mentors";

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
              className="flex gap-4 rounded-[20px] border border-line bg-paper p-4"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-wash">
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
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold tracking-tight text-ink">
                      {mentor.name}
                      {mentor.isFounder ? (
                        <span className="ml-2 rounded-full bg-wash px-2 py-0.5 align-middle text-[10px] font-semibold text-mute">
                          Fundador
                        </span>
                      ) : null}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-mute">{mentor.role}</p>
                  </div>
                  {mentor.linkedinUrl ? (
                    <a
                      href={mentor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-mute transition-colors hover:text-ink"
                      aria-label={`LinkedIn de ${mentor.name}`}
                    >
                      <Linkedin size={16} />
                    </a>
                  ) : null}
                </div>
                <ul className="mt-2 space-y-0.5 text-xs leading-relaxed text-mute">
                  {mentor.credentials.map((line) => (
                    <li key={line} className="line-clamp-1">{line}</li>
                  ))}
                </ul>
                <p className="mt-1.5 text-[11px] text-faint">
                  {mentor.studentCount.toLocaleString("es-CL")}+ alumnos · {mentor.yearsExperience}+ años
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/nosotros" className="text-sm font-semibold text-ink no-underline hover:underline">
            Ver perfiles
          </Link>
        </div>
      </div>
    </section>
  );
}
