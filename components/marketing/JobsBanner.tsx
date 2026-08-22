import Link from "next/link";
import { ArrowRight, Briefcase, BadgeCheck } from "lucide-react";

/**
 * Banner de la Bolsa de Trabajo en la home (entre Programas y Equipo).
 */
export default function JobsBanner() {
  return (
    <section className="border-t border-line px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 items-center gap-8 rounded-[26px] border border-line bg-paper px-6 py-10 sm:px-10 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-12">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink/[0.03] px-3 py-1 text-xs font-semibold text-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
              Nuevo
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Bolsa de Trabajo: tu certificado vale más
            </h2>
            <p className="mt-3 max-w-[38rem] text-base leading-relaxed text-mute">
              Empresas verificadas publican vacantes de datos y programación para nuestra
              comunidad. Los egresados de ProgramBI postulan con sus certificados verificados
              de Python, Power BI y SQL a la vista.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/empleos"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-canvas transition-transform active:scale-[0.98]"
              >
                <Briefcase size={17} strokeWidth={2.2} />
                Buscar vacantes
                <ArrowRight size={17} strokeWidth={2.4} />
              </Link>
              <Link
                href="/empleos/para-empresas"
                className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-base font-medium text-ink transition-colors hover:bg-wash"
              >
                Soy empresa
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-5">
            {[
              "Postula con certificados verificados, no solo con tu CV",
              "Vacantes de empresas aprobadas por el equipo ProgramBI",
              "Sigue cada etapa: enviada, entrevista, oferta y contratación",
            ].map((line) => (
              <div
                key={line}
                className="flex items-start gap-3 rounded-[16px] border border-line bg-canvas px-4 py-3.5"
              >
                <BadgeCheck size={17} className="mt-0.5 shrink-0 text-ink" strokeWidth={2.2} />
                <p className="text-sm leading-snug text-mute">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
