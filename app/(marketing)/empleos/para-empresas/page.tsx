import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ShieldCheck, LayoutList, Bell } from "lucide-react";
import RegisterCompanyForm from "@/components/empleos/RegisterCompanyForm";
import { ogImageUrl } from "@/lib/og/url";

// Copy con vencimiento: ajustar cuando termine el período de lanzamiento
const LAUNCH_BADGE = "Gratis durante el lanzamiento";
const LAUNCH_APPROVAL_SLA = "menos de 24 horas hábiles";

export const metadata: Metadata = {
  title: "Publica vacantes en la Bolsa de Trabajo",
  description:
    "Publica vacantes de datos y programación y recibe postulantes con certificados verificados en Python, Power BI y SQL Server. Gratis durante el lanzamiento.",
  alternates: { canonical: "/empleos/para-empresas" },
  openGraph: {
    title: "Publica vacantes en la Bolsa de Trabajo | ProgramBI",
    description:
      "Recibe postulantes con certificados verificados en Python, Power BI y SQL Server. Gratis durante el lanzamiento.",
    url: "/empleos/para-empresas",
    images: [
      {
        url: ogImageUrl({
          kicker: LAUNCH_BADGE,
          title: "Deja de adivinar. Contrata certificado.",
          description:
            "Publica vacantes y recibe postulantes con certificados que respaldan sus habilidades.",
          tags: ["Python", "Power BI", "SQL Server"],
          path: "empleos/para-empresas",
        }),
        width: 1200,
        height: 630,
        alt: "Bolsa de Trabajo para empresas — ProgramBI",
      },
    ],
  },
};

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Talento con certificados verificados",
    text: "Cada postulante egresado de ProgramBI llega con sus certificados reales de Python, Power BI, SQL Server y más. Sin sorpresas en la entrevista técnica.",
  },
  {
    icon: ShieldCheck,
    title: `Publicación gratis durante el lanzamiento`,
    text: `Registra tu empresa, la aprobamos en ${LAUNCH_APPROVAL_SLA} y publicas vacantes sin costo mientras dure el período de lanzamiento.`,
  },
  {
    icon: LayoutList,
    title: "Panel de postulaciones estilo ATS",
    text: "Organiza tus candidatos en un pipeline claro: nuevos, preseleccionados, entrevista, oferta y contratados. Con notas privadas y CV descargable.",
  },
  {
    icon: Bell,
    title: "Aviso a la comunidad correcta",
    text: "Tus vacantes llegan a estudiantes y egresados activos de los programas de datos e IA de ProgramBI, con notificaciones inmediatas.",
  },
];

export default function ParaEmpresasPage() {
  return (
    <>
      <section className="px-4 pt-16 pb-12 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-[1400px]">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink/[0.03] px-3 py-1 text-xs font-semibold text-mute">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
            {LAUNCH_BADGE}
          </p>
          <h1 className="mt-5 max-w-[46rem] text-3xl font-bold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[3.5rem]">
            Contrata talento de datos con{" "}
            <em className="font-serif italic">certificados reales</em>
          </h1>
          <p className="mt-5 max-w-[40rem] text-base leading-relaxed text-mute lg:text-lg">
            Publica tus vacantes ante la comunidad de análisis de datos, programación e IA
            de ProgramBI. Revisa cada postulación con las habilidades certificadas a la vista.
          </p>
        </div>
      </section>

      <section className="border-t border-line px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-ink">
                  <b.icon size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-ink">{b.title}</h2>
                  <p className="mt-1.5 max-w-[34rem] text-sm leading-relaxed text-mute">
                    {b.text}
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-[22px] border border-line bg-paper p-6">
              <p className="text-sm leading-relaxed text-mute">
                ¿Prefieres buscar tú? Explora el{" "}
                <Link
                  href="/empleos/talento"
                  className="font-semibold text-ink underline-offset-4 hover:underline"
                >
                  directorio de talento certificado
                </Link>{" "}
                y contacta directamente a quienes te interesen.
              </p>
            </div>

            <div className="rounded-[22px] border border-line bg-paper p-6">
              <p className="text-sm leading-relaxed text-mute">
                ¿Necesitas capacitar a tu equipo antes de contratar?{" "}
                <Link
                  href="/empresas"
                  className="font-semibold text-ink underline-offset-4 hover:underline"
                >
                  Conoce la capacitación corporativa de ProgramBI
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-24">
              <RegisterCompanyForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
