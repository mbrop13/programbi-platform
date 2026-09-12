import Link from "next/link";
import { Briefcase, Building2, UserRound } from "lucide-react";
import JobCard from "@/components/empleos/JobCard";
import type { JobPublic } from "@/lib/jobs/types";

/** Server-rendered bolsa HTML so curl/bots get 200 with content, not a client-SSR 500. */
export default function VacantesBoard({
  jobs,
  total,
}: {
  jobs: JobPublic[];
  total: number;
}) {
  return (
    <>
      <section className="px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Bolsa de Trabajo
              </h1>
              <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">
                Vacantes de datos y programación publicadas por empresas verificadas.
                Los egresados de ProgramBI postulan con sus certificados a la vista.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/empleos/talento"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
              >
                <UserRound size={16} strokeWidth={2} />
                Talento certificado
              </Link>
              <Link
                href="/empleos/para-empresas"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
              >
                <Building2 size={16} strokeWidth={2} />
                Soy empresa
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-sm text-mute">
            {total} {total === 1 ? "vacante disponible" : "vacantes disponibles"}
          </p>
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-wash text-faint">
                <Briefcase size={24} strokeWidth={1.8} />
              </div>
              <h2 className="mt-5 text-xl font-bold tracking-tight text-ink">
                Aún no hay vacantes publicadas
              </h2>
              <p className="mt-2 max-w-md text-sm text-mute">
                Mientras tanto, crea tu perfil, revisa los cursos o escríbenos. Publicamos vacantes de datos cada semana.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/?auth=register"
                  className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.98]"
                >
                  Crear perfil
                </Link>
                <Link
                  href="/cursos"
                  className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
                >
                  Ver cursos
                </Link>
                <a
                  href="https://wa.me/56935409699"
                  className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
                >
                  Contactar
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
