import type { Metadata } from "next";
import Link from "next/link";
import { comparisons } from "@/lib/data/comparisons";
import { comparativasAcademiaHub } from "@/lib/data/comparativas";
import { ArrowRight, GitCompare, GraduationCap } from "lucide-react";
import { ogImageUrl } from "@/lib/og/url";
import {
  ORG_ID,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl,
  jsonLdString,
  twitterShare,
} from "@/lib/seo";
import { lastmodDe } from "@/lib/seo/lastmod";

const DESCRIPCION =
  "Comparamos Power BI vs Excel, SQL Server vs PostgreSQL, Python vs R y academias de datos en Chile y Latinoamérica con horas, precios y fuentes.";

export const metadata: Metadata = {
  title: "Comparativas técnicas de datos (Versus)",
  description: DESCRIPCION,
  alternates: {
    canonical: "/versus",
  },
  openGraph: {
    title: "Comparativas de Herramientas y Academias de Datos (Versus) | ProgramBI",
    description: DESCRIPCION,
    url: absoluteUrl("/versus"),
    type: "website",
    images: [
      {
        url: ogImageUrl({
          kicker: "Comparativas",
          title: "¿Qué herramienta de datos aprender?",
          description:
            "Análisis profundos con pros y contras de las herramientas líderes y academias de la industria.",
          tags: ["Power BI", "SQL", "Python", "Excel"],
          path: "versus",
        }),
        width: 1200,
        height: 630,
        alt: "Comparativas de herramientas — ProgramBI",
      },
    ],
  },
  twitter: twitterShare(
    "Comparativas de Herramientas y Academias de Datos (Versus) | ProgramBI",
    DESCRIPCION,
    ogImageUrl({
      kicker: "Comparativas",
      title: "¿Qué herramienta de datos aprender?",
      description:
        "Análisis profundos con pros y contras de las herramientas líderes y academias de la industria.",
      tags: ["Power BI", "SQL", "Python", "Excel"],
      path: "versus",
    })
  ),
};

export default function VersusPage() {
  const canonical = absoluteUrl("/versus");
  const academias = comparativasAcademiaHub();
  const itemList = [
    ...comparisons.map((comp) => ({
      name: comp.title,
      url: absoluteUrl(`/versus/${comp.slug}`),
    })),
    ...academias.map((comp) => ({
      name: comp.title,
      url: absoluteUrl(comp.href),
    })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: "Comparativas de herramientas y academias de datos | ProgramBI",
        description: DESCRIPCION,
        inLanguage: "es-CL",
        dateModified: lastmodDe("/versus"),
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
        mainEntity: { "@id": `${canonical}#itemlist` },
      },
      {
        "@type": "ItemList",
        "@id": `${canonical}#itemlist`,
        name: "Comparativas de herramientas y academias de datos",
        numberOfItems: itemList.length,
        itemListElement: itemList.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: entry.url,
          name: entry.name,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Comparativas", item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="bg-[#FAFBFC] min-h-screen pt-28 pb-20 lg:pt-32 lg:pb-32">
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
              <Link key={comp.slug} href={`/versus/${comp.slug}`} className="block no-underline group">
                <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1890FF] flex items-center justify-center">
                      <GitCompare className="w-5 h-5" />
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

          {/* Academias */}
          <section aria-labelledby="versus-academias" className="mt-16">
            <div className="mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-[#1890FF] bg-blue-50 px-3 py-1.5 rounded-full inline-block mb-3">
                Academias
              </span>
              <h2
                id="versus-academias"
                className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight"
              >
                ¿Curso en vivo, bootcamp o suscripción?
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mt-2">
                Comparamos academias con datos citados: horas en vivo, precio, precio por hora y
                dónde conviene cada opción. Sin logos ajenos y con la fecha de revisión a la vista.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparativasAcademiaHub().map((comp) => (
                <Link key={comp.href} href={comp.href} className="block no-underline group">
                  <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1890FF] flex items-center justify-center">
                        <GraduationCap className="w-5 h-5" />
                      </div>

                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 my-0">
                        {comp.etiqueta} · {comp.rival}
                      </p>

                      <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 group-hover:text-[#1890FF] transition-colors leading-snug my-0">
                        {comp.title}
                      </h3>

                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 my-0">
                        {comp.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1890FF] pt-6 group-hover:gap-2.5 transition-all mt-auto">
                      <span>Ver comparativa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* Advisory banner */}
          <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden mt-16 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF]/15 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-xl">
              <h2 className="font-display font-black text-2xl mb-3">¿Necesitas arquitectura o consultoría?</h2>
              <p className="text-slate-350 text-sm leading-relaxed mb-6">
                Te ayudamos a elegir e implementar la infraestructura de datos y reportería óptima para tu negocio corporativo en Chile y Latinoamérica.
              </p>
              <Link
                href="/empresas"
                className="inline-flex items-center gap-2 bg-[#1890FF] hover:bg-blue-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl no-underline transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
              >
                <span>Solicitar Asesoría Corporativa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
