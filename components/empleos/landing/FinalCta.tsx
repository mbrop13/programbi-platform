import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import CineImage from "./CineImage";
import WaitlistForm from "./WaitlistForm";
import RegisterCta from "./RegisterCta";

/**
 * Cierre cinematográfico: imagen full-bleed (usa bolsa-cta.jpg si existe;
 * si no, el hero 1), scrim oscuro, titular centrado y pre-inscripción.
 */
export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <CineImage
        src="/images/bolsa-cta.jpg"
        fallbackSrc="/images/bolsa-hero-1.jpg"
        alt=""
        dimClass="opacity-50"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_40%,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.88)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[900px] px-4 py-28 text-center sm:px-6 lg:py-40">
        <Reveal>
          <h2 className="mx-auto max-w-[16ch] text-4xl font-bold leading-[1.06] tracking-tight text-canvas sm:text-6xl lg:text-7xl">
            El lanzamiento se <em className="italic">acerca</em>.
          </h2>
          <p className="mx-auto mt-6 max-w-[34rem] text-base leading-relaxed text-canvas/60 lg:text-lg">
            Sé de los primeros: candidatos con perfil completo y empresas con su
            primera vacante lista tienen la mejor posición el día uno.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <RegisterCta className="inline-flex h-12 items-center gap-2 rounded-full bg-canvas px-7 text-base font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas/40">
              Crear mi perfil
              <ArrowRight size={17} strokeWidth={2.4} />
            </RegisterCta>
            <Link
              href="/empleos/para-empresas"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-canvas/25 bg-canvas/[0.06] px-7 text-base font-semibold text-canvas backdrop-blur-sm transition-colors hover:bg-canvas/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canvas/40"
            >
              Registrar mi empresa
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-14 border-t border-canvas/10 pt-10">
            <p className="text-sm font-medium text-canvas/50">
              ¿Prefieres esperar? Déjanos tu correo y te avisamos.
            </p>
            <div className="mt-5">
              <WaitlistForm dark />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
