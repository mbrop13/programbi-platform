import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import TalentosPageClient from "@/components/empleos/TalentosPageClient";

export const metadata: Metadata = {
  title: "Talento certificado en datos",
  description:
    "Directorio de profesionales formados en ProgramBI con certificados verificados en Python, Power BI, SQL Server y Machine Learning. Disponibles para empresas.",
  alternates: { canonical: "/empleos/talento" },
  openGraph: {
    title: "Talento certificado en datos | ProgramBI",
    description:
      "Contrata profesionales con certificados verificados en Python, Power BI y SQL Server.",
    url: "/empleos/talento",
  },
};

export default function TalentoPage() {
  return (
    <>
      <section className="px-4 pt-16 pb-10 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-[1400px]">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink/[0.03] px-3 py-1 text-xs font-semibold text-mute">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
            Para empresas
          </p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="max-w-[46rem] text-3xl font-bold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Talento certificado en{" "}
                <em className="font-serif italic">datos e IA</em>
              </h1>
              <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-mute">
                Profesionales formados en ProgramBI, con certificados verificables en Python,
                Power BI, SQL Server y Machine Learning. El verde significa certificado real:
                sin sorpresas en la entrevista técnica.
              </p>
            </div>
            <Link
              href="/empleos/para-empresas"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
            >
              Registrar mi empresa
              <ArrowRight size={16} strokeWidth={2.4} />
            </Link>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 text-xs text-faint">
            <BadgeCheck size={13} className="text-[#16a34a]" />
            Los candidatos controlan su visibilidad y reciben las solicitudes directamente por email.
          </p>
        </div>
      </section>

      <TalentosPageClient />
    </>
  );
}
