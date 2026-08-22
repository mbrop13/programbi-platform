import Link from "next/link";
import { ArrowRight, BadgeCheck, LayoutList, Search } from "lucide-react";
import Reveal from "./Reveal";

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Certificados verificados por skill",
    text: "Cada postulante egresado de ProgramBI llega con sus certificados reales a la vista.",
  },
  {
    icon: LayoutList,
    title: "Pipeline estilo ATS",
    text: "Nuevos, preseleccionados, entrevista, oferta. Con notas privadas y CV descargable.",
  },
  {
    icon: Search,
    title: "Directorio de talento certificado",
    text: "Busca perfiles por skill, ciudad y disponibilidad, y contacta directo.",
  },
];

const PIPELINE = [
  {
    label: "Nuevos",
    items: [
      { name: "Valentina M.", skill: "Power BI" },
      { name: "Diego R.", skill: "SQL Server" },
    ],
  },
  {
    label: "Preseleccionados",
    items: [{ name: "Camila T.", skill: "Python" }],
  },
  {
    label: "Entrevista",
    items: [{ name: "Matías S.", skill: "Power BI" }],
  },
];

/** Sección empresas: tipografía a gran escala sobre papel, pipeline en panel wash. */
export default function CompaniesSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          {/* Copy */}
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="max-w-[13ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Deja de adivinar. Contrata{" "}
                <em className="italic">certificado</em>.
              </h2>
              <p className="mt-6 max-w-[32rem] text-base leading-relaxed text-mute lg:text-lg">
                Publica ante la comunidad de datos e IA de ProgramBI y recibe
                postulaciones con habilidades verificadas, no solo autodeclaradas.
                Gratis durante el lanzamiento.
              </p>
            </Reveal>

            <div className="mt-10 divide-y divide-line border-y border-line">
              {BENEFITS.map((b, i) => (
                <Reveal key={b.title} delay={0.08 * i}>
                  <div className="flex gap-4 py-5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-ink">
                      <b.icon size={17} strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-bold tracking-tight text-ink">{b.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-mute">{b.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/empleos/para-empresas"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-canvas transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
                >
                  Registrar mi empresa
                  <ArrowRight size={17} strokeWidth={2.4} />
                </Link>
                <p className="text-xs text-faint">
                  Aprobamos cada empresa en menos de 24 horas hábiles.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Pipeline en panel */}
          <div className="lg:col-span-6">
            <Reveal delay={0.12} y={36}>
              <div className="mx-auto max-w-[560px]">
                <div className="rounded-[26px] border border-line bg-wash/60 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold tracking-tight text-ink">
                      Postulaciones · Analista Power BI
                    </h3>
                    <span className="rounded-full bg-paper px-2.5 py-1 font-mono text-[11px] font-bold text-mute">
                      4 activos
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {PIPELINE.map((col) => (
                      <div key={col.label}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-faint">
                          {col.label}
                        </p>
                        <div className="mt-2 space-y-2">
                          {col.items.map((item) => (
                            <div
                              key={item.name}
                              className="rounded-xl border border-line bg-paper p-3"
                            >
                              <p className="truncate text-[13px] font-semibold text-ink">
                                {item.name}
                              </p>
                              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-mute">
                                <BadgeCheck size={10} className="text-[#16a34a]" />
                                {item.skill}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-wider text-faint">
                  Vista previa · panel de empresa
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
