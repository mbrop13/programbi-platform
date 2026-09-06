import type { Metadata } from "next";
import Link from "next/link";
import { comparisons } from "@/lib/data/comparisons";
import { ChevronRight, ArrowRight, Activity, GitCompare } from "lucide-react";
import { ogImageUrl } from "@/lib/og/url";

export const metadata: Metadata = {
  title: "Comparativas Técnicas de Datos (Versus) | ProgramBI",
  description:
    "Comparamos las herramientas de datos más demandadas de la industria: Power BI vs Excel, SQL Server vs PostgreSQL y Python vs R. Toma decisiones informadas sobre qué aprender.",
  alternates: {
    canonical: "/versus",
  },
  openGraph: {
    title: "Comparativas de Herramientas de Datos (Versus) | ProgramBI",
    description:
      "Análisis profundos, pros y contras de las herramientas líderes en análisis de datos, bases de datos y programación.",
    url: "https://www.programbi.com/versus",
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Comparativas",
          title: "¿Qué herramienta de datos aprender?",
          description:
            "Análisis profundos con pros y contras de las herramientas líderes de la industria.",
          tags: ["Power BI", "SQL", "Python", "Excel"],
          path: "versus",
        }),
        width: 1200,
        height: 630,
        alt: "Comparativas de herramientas — ProgramBI",
      },
    ],
  },
};

export default function VersusPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: comparisons.length,
    itemListElement: comparisons.map((comp, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.programbi.com/versus/${comp.slug}`,
      name: comp.title,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.programbi.com" },
      { "@type": "ListItem", position: 2, name: "Comparativas", item: "https://www.programbi.com/versus" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="bg-[#FAFBFC] min-h-screen pt-28 pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-[1000px] mx-auto px-5 lg:px-10">
          {/* Breadcrumbs Row */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors no-underline text-slate-500">Inicio</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">Comparativas</span>
          </div>

          <div className="mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#1890FF] bg-blue-50 px-3 py-1.5 rounded-full inline-block mb-3">
              Análisis Comparativo
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.1] mb-4">
              Comparativas Versus
            </h1>
            <p className="text-slate-500 text-base lg:text-lg leading-relaxed max-w-3xl">
              ¿No sabes qué herramienta elegir para tu proyecto o carrera profesional? Comparamos los pros, contras, costos y aplicaciones prácticas de las tecnologías de datos líderes en el mercado.
            </p>
          </div>

          {/* Comparisons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisons.map((comp) => (
              <Link key={comp.slug} href={`/versus/${comp.slug}`} className="group block no-underline">
                <article className="flex h-full flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md sm:p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#1890FF]">
                        <GitCompare className="h-5 w-5" />
                      </div>
                      {comp.slug === "power-bi-vs-excel" ? (
                        <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-canvas">
                          Pack / migración
                        </span>
                      ) : null}
                    </div>
                    
                    <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 group-hover:text-[#1890FF] transition-colors leading-snug my-0">
                      {comp.title}
                    </h2>
                    
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 my-0">
                      {comp.seoDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1890FF] pt-6 group-hover:gap-2.5 transition-all mt-auto">
                    <span>Ver comparativa completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Advisory banner */}
          <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden mt-16 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF]/15 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-xl">
              <h3 className="font-display mb-3 text-2xl font-black">¿Excel eterno en el área?</h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                El Pack Adopción BI migra reportes a Power BI en producción y deja al equipo autónomo. Diagnóstico 30
                min. Factura directa.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/migrar-excel-a-power-bi"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1890FF] px-6 py-3.5 text-sm font-bold text-white no-underline shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-600"
                >
                  <span>Migrar Excel a Power BI</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/empresas"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white no-underline"
                >
                  Pack Adopción
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
