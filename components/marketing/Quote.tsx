import { testimonials } from "@/lib/data/testimonials";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => !["de", "del", "la", "las", "los", "y"].includes(part.toLowerCase()))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Quote() {
  const featured = testimonials.find((t) => t.name === "Jorge Kaisarieh") ?? testimonials[0];
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="border-t border-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Lo que dicen nuestros alumnos
        </h2>
        <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">
          Historias reales de profesionales que transformaron su carrera con ProgramBI.
        </p>

        <blockquote className="mt-12 max-w-[1100px]">
          <p className="text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            “{featured.message}”
          </p>
          <footer className="mt-6 text-sm text-mute">{featured.name}</footer>
        </blockquote>
      </div>

      <div className="mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="logo-track gap-4 px-4" style={{ animationDuration: "90s" }}>
          {loop.map((t, i) => (
            <article
              key={`${t.name}-${i}`}
              className="w-[300px] shrink-0 rounded-[22px] border border-line bg-paper p-5 sm:w-[340px]"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-wash text-[11px] font-semibold text-ink">
                  {initials(t.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{t.name}</p>
                  <p className="truncate text-[11px] text-faint">{t.role}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-mute">“{t.message}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
