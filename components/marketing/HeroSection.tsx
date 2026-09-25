import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroPreviewLazy from "@/components/marketing/HeroPreviewLazy";
import { PAGE_SEO } from "@/lib/seo/money";

const HERO_COURSES = [
  {
    href: "/cursos/analisis-de-datos",
    slug: "analisis-de-datos",
    kicker: "20 horas",
    title: "Análisis de datos",
    text: "SQL, Power BI y Python. Curso en vivo en Chile.",
  },
  {
    href: "/cursos/power-bi",
    slug: "power-bi",
    kicker: "20 horas",
    title: "Power BI",
    text: "Query, DAX y dashboards. En vivo en Chile.",
  },
  {
    href: "/cursos/power-automate",
    slug: "power-automate",
    kicker: "16 horas",
    title: "Power Automate",
    text: "Flujos y RPA. Curso en vivo en Chile.",
  },
] as const;

function HomeH1() {
  const h1 = PAGE_SEO.home.h1;
  const line = h1.indexOf("datos en vivo");
  const chile = h1.lastIndexOf("Chile");
  if (line <= 0 || chile < line) return h1;
  return (
    <>
      {h1.slice(0, line)}
      <br />
      {h1.slice(line, chile)}
      <em className="italic font-semibold">Chile</em>
      {h1.slice(chile + "Chile".length)}
    </>
  );
}

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
            Cursos en vivo · Chile
          </div>

          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
            <HomeH1 />
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            Academia de datos en vivo por Zoom: análisis de datos, Power BI y Power Automate.
          </p>

          <div className="mt-8 flex flex-col gap-2.5">
            {HERO_COURSES.map((course) => (
              <Link
                key={course.href}
                href={course.href}
                data-analytics-event="click_registro"
                data-curso-slug={course.slug}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3.5 no-underline transition-colors hover:border-ink/25 hover:bg-wash"
              >
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-widest text-mute">
                    {course.kicker}
                  </span>
                  <span className="mt-0.5 block text-base font-semibold tracking-tight text-ink">
                    {course.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-mute">{course.text}</span>
                </span>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-ink transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>

          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute">
            <Link href="/cursos" className="font-semibold text-ink no-underline hover:text-mute">
              Todos los cursos
            </Link>
            <Link href="/empresas" className="font-semibold text-ink no-underline hover:text-mute">
              Empresas → Capacitación
            </Link>
          </p>
        </div>

        <HeroPreviewLazy />
      </div>
    </section>
  );
}
