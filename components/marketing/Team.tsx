import Link from "next/link";
import { Linkedin } from "lucide-react";
import CourseImage from "@/components/shared/CourseImage";
import { mentors } from "@/lib/data/mentors";

export default function Team() {
  return (
    <section className="border-t border-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Conoce a nuestro equipo
        </h2>
        <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">
          Aprende de profesionales que trabajan con datos en banca, retail y minería.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <article
              key={mentor.name}
              className="overflow-hidden rounded-[26px] border border-line bg-paper"
            >
              <div className="relative aspect-[4/5] bg-wash">
                {mentor.imageUrl ? (
                  <CourseImage
                    src={mentor.imageUrl}
                    alt={mentor.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-[center_18%]"
                  />
                ) : null}
                {mentor.isFounder ? (
                  <span className="absolute top-4 left-4 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-semibold text-ink">
                    Fundador
                  </span>
                ) : null}
              </div>
              <div className="px-6 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-ink">{mentor.name}</h3>
                    <p className="mt-1 text-sm text-mute">{mentor.role}</p>
                  </div>
                  {mentor.linkedinUrl ? (
                    <a
                      href={mentor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-mute transition-colors hover:text-ink"
                      aria-label={`LinkedIn de ${mentor.name}`}
                    >
                      <Linkedin size={18} />
                    </a>
                  ) : null}
                </div>
                <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-mute">
                  {mentor.credentials.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-faint">
                  {mentor.studentCount.toLocaleString("es-CL")}+ alumnos · {mentor.yearsExperience}+ años
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/nosotros" className="text-sm font-semibold text-ink no-underline hover:underline">
            Ver perfiles
          </Link>
        </div>
      </div>
    </section>
  );
}
