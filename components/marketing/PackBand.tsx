import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PACK } from "@/lib/data/pack-adopcion";

export default function PackBand() {
  return (
    <section className="border-t border-line px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-mute">Para empresas</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {PACK.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">
          Construimos {PACK.dashboards} dashboards con los datos del área y capacitamos al equipo {PACK.trainingWeeks}{" "}
          semanas. Handoff + {PACK.postGoLiveWeeks} semanas post go-live. {PACK.priceLabel} ({PACK.priceFromLabel}).
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/empresas"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
          >
            Ver Pack Adopción
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/implementacion-power-bi"
            className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink no-underline hover:bg-wash"
          >
            Implementación Power BI
          </Link>
          <Link
            href="/migrar-excel-a-power-bi"
            className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink no-underline hover:bg-wash"
          >
            Migrar Excel → Power BI
          </Link>
        </div>
      </div>
    </section>
  );
}
