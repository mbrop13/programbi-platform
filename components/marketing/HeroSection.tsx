import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroPreview from "@/components/marketing/HeroPreview";
import { PACK } from "@/lib/data/pack-adopcion";

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
            Chile · Power BI · datos en producción
          </div>

          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
            De reportes eternos a{" "}
            <em className="italic font-semibold">decisiones en minutos</em>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            Empresas: tablero en producción + equipo autónomo (Pack Adopción BI). Particulares: cursos en vivo de
            Power BI, SQL y Python.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/empresas"
              className="group flex flex-col rounded-2xl border border-ink bg-ink px-5 py-4 text-canvas no-underline transition-transform active:scale-[0.99]"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-canvas/70">Empresas</span>
              <span className="mt-1 inline-flex items-center gap-2 text-base font-semibold">
                Pack Adopción BI
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 text-xs leading-snug text-canvas/70">
                {PACK.dashboards} dashboards + {PACK.trainingWeeks} semanas · diagnóstico {PACK.diagnosisMinutes} min
              </span>
            </Link>
            <Link
              href="/cursos"
              className="group flex flex-col rounded-2xl border border-line bg-paper px-5 py-4 text-ink no-underline transition-colors hover:bg-wash active:scale-[0.99]"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-mute">Particulares</span>
              <span className="mt-1 inline-flex items-center gap-2 text-base font-semibold">
                Ver cursos
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 text-xs leading-snug text-mute">
                Power BI, SQL, Python y más · en vivo por Zoom
              </span>
            </Link>
          </div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}
