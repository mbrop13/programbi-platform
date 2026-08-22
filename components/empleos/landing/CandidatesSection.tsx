import { ArrowRight, BadgeCheck, FileText, Target, BellOff } from "lucide-react";
import Reveal from "./Reveal";
import CineImage from "./CineImage";
import RegisterCta from "./RegisterCta";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Certificados auto-adjuntados",
    text: "Aprobaste un curso de ProgramBI: la skill aparece verificada, sin subir nada.",
  },
  {
    icon: Target,
    title: "Match % con cada vacante",
    text: "Sabes qué tan cerca estás del perfil que buscan antes de postular.",
  },
  {
    icon: BellOff,
    title: "Tú controlas tu visibilidad",
    text: "Elige si aparecer en el directorio y recibe contacto solo de empresas aprobadas.",
  },
];

/**
 * Sección candidatos: banda cinematográfica oscura con la imagen de fondo
 * (usa bolsa-perfil.jpg si existe; si no, reutiliza el hero 2) y el perfil
 * de ejemplo en card clara superpuesta a gran escala.
 */
export default function CandidatesSection() {
  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Imagen de fondo: /images/bolsa-perfil.jpg (pendiente) con fallback al hero 2 */}
      <CineImage
        src="/images/bolsa-perfil.jpg"
        fallbackSrc="/images/bolsa-hero-2.jpg"
        alt=""
        dimClass="opacity-45"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.94)_0%,rgba(10,10,10,0.82)_38%,rgba(10,10,10,0.55)_62%,rgba(10,10,10,0.75)_100%)]"
        aria-hidden="true"
      />
      {/* Grano de película */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-36">
        {/* Copy + features */}
        <div className="lg:col-span-6">
          <Reveal>
            <h2 className="max-w-[14ch] text-4xl font-bold leading-[1.08] tracking-tight text-canvas sm:text-5xl lg:text-6xl">
              Tu perfil, estilo LinkedIn. Tus certificados,{" "}
              <em className="italic">verificados</em>.
            </h2>
            <p className="mt-6 max-w-[32rem] text-base leading-relaxed text-canvas/60 lg:text-lg">
              Las empresas no leen CVs: escanean skills. Aquí cada habilidad
              certificada lleva sello verde, y eso cambia la conversación desde
              la primera entrevista.
            </p>
          </Reveal>

          <div className="mt-10 divide-y divide-canvas/10 border-y border-canvas/10">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={0.08 * i}>
                <div className="flex gap-4 py-5">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-canvas/15 bg-canvas/[0.04] text-canvas">
                    <f.icon size={17} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold tracking-tight text-canvas">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-canvas/55">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <RegisterCta className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-canvas px-7 text-base font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas/40">
              Crear mi perfil
              <ArrowRight size={17} strokeWidth={2.4} />
            </RegisterCta>
          </Reveal>
        </div>

        {/* Perfil de ejemplo a gran escala */}
        <div className="flex items-center lg:col-span-6">
          <Reveal delay={0.12} y={36} className="w-full">
            <div className="relative mx-auto max-w-[520px]">
              <div className="rounded-[26px] border border-canvas/10 bg-paper p-6 shadow-[0_32px_90px_rgba(0,0,0,0.45)] sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-lg font-bold text-canvas">
                      VM
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold tracking-tight text-ink">
                        Valentina Muñoz
                      </h3>
                      <p className="mt-0.5 text-sm text-mute">
                        Analista de Datos · Power BI y SQL
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-[#16a34a]/[0.07] px-2.5 py-1 text-[11px] font-bold text-[#16a34a]">
                    <BadgeCheck size={12} />
                    Certificada
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-mute">
                  <span>Santiago, Chile</span>
                  <span className="text-faint">·</span>
                  <span>Remoto OK</span>
                  <span className="text-faint">·</span>
                  <span>Disponible de inmediato</span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-mute">
                  “Paso de reportes manuales en Excel a dashboards que se actualizan
                  solos. Me gusta el dato limpio antes del gráfico bonito.”
                </p>

                <div className="mt-5">
                  <p className="text-xs font-semibold text-faint">Skills verificadas</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {["Power BI", "SQL Server", "Python", "Excel avanzado", "DAX"].map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded-full border border-line bg-ink/[0.03] px-2.5 py-1 text-xs font-semibold text-ink"
                      >
                        <BadgeCheck size={11} className="text-[#16a34a]" />
                        {s}
                      </span>
                    ))}
                    <span className="rounded-full bg-wash px-2.5 py-1 text-xs font-medium text-mute">
                      Machine Learning
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
                  <div>
                    <p className="font-mono text-lg font-bold text-ink">2</p>
                    <p className="text-[11px] text-faint">Certificados</p>
                  </div>
                  <div className="border-x border-line">
                    <p className="font-mono text-lg font-bold text-ink">87%</p>
                    <p className="text-[11px] text-faint">Mejor match</p>
                  </div>
                  <div>
                    <p className="inline-flex items-center justify-center gap-1.5 font-mono text-lg font-bold text-ink">
                      <FileText size={14} className="text-faint" />
                      CV
                    </p>
                    <p className="text-[11px] text-faint">Adjunto</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-wider text-canvas/30">
                Vista previa · perfil de ejemplo
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
