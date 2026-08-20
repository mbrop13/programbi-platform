import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RegisterCta from "@/components/marketing/RegisterCta";
import HeroPreview from "@/components/marketing/HeroPreview";

export default function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden lg:min-h-[calc(100dvh-72px)]">
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-8 px-4 pt-6 pb-10 sm:px-6 sm:pt-10 sm:pb-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-12 lg:pt-16 lg:pb-16 xl:gap-14">
        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-ink/[0.03] px-3 py-1 text-xs font-semibold text-mute lg:mb-6">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Clases en vivo online y presencial
          </div>

          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
            Aprende Análisis de
            <br />
            Datos con <em className="italic font-semibold">Expertos</em>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            Capacitaciones diseñadas para profesionales que buscan potenciar su carrera con Power
            BI, Python, SQL, Excel y Big Data.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <RegisterCta className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-canvas shadow-md shadow-ink/10 transition-transform active:scale-[0.98]">
              Registrarse
              <ArrowRight size={17} strokeWidth={2.4} />
            </RegisterCta>
            <Link
              href="#programas"
              className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-base font-medium text-ink no-underline transition-colors hover:bg-wash active:scale-[0.98]"
            >
              Ver Cursos
            </Link>
          </div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}
