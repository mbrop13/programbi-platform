import Link from "next/link";
import CourseImage from "@/components/shared/CourseImage";
import { courses } from "@/lib/data/courses";

const HOME_SLUGS = ["analisis-de-datos", "power-bi", "sql-server", "python"] as const;

export default function Programs() {
  const featured = HOME_SLUGS.map((slug) => courses.find((c) => c.slug === slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );
  const hero = featured[0];
  const rest = featured.slice(1);

  if (!hero) return null;

  return (
    <section id="programas" className="border-t border-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">Cursos</h2>
        <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">
          Cursos de 16 horas por nivel, en vivo por Zoom. Elige una herramienta o toma el programa completo.
        </p>

        <div className="mt-12 space-y-5">
          <Link
            href={`/cursos/${hero.slug}`}
            className="group grid overflow-hidden rounded-[26px] border border-line bg-paper shadow-xs no-underline transition-colors hover:border-ink/20 lg:grid-cols-12"
          >
            <div className="relative aspect-[16/10] bg-wash lg:col-span-7 lg:min-h-[320px]">
              <CourseImage
                src={hero.imageUrl}
                alt={hero.title}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-end px-6 py-6 lg:col-span-5 lg:px-8 lg:py-8">
              <p className="text-xs font-semibold text-mute">Programa de 144 horas</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{hero.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-mute">{hero.shortDescription}</p>
              <p className="mt-4 text-sm font-semibold text-ink">{hero.techStack.join(" · ")}</p>
              <span className="mt-6 inline-flex text-sm font-semibold text-ink">Ver temario</span>
            </div>
          </Link>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((course) => (
              <Link
                key={course.slug}
                href={`/cursos/${course.slug}`}
                className="group overflow-hidden rounded-[26px] border border-line bg-paper shadow-xs no-underline transition-colors hover:border-ink/20"
              >
                <div className="relative aspect-[16/10] bg-wash">
                  <CourseImage
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-end justify-between gap-4 px-6 py-5">
                  <div>
                    <p className="text-xl font-bold tracking-tight text-ink">{course.title}</p>
                    <p className="mt-1 text-sm text-mute">{course.shortDescription}</p>
                    <p className="mt-2 text-xs text-faint">{course.durationHours} h · En vivo</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ink">Temario</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Link href="/cursos" className="text-sm font-semibold text-ink no-underline hover:underline">
            Ver todos los cursos
          </Link>
        </div>
      </div>
    </section>
  );
}
