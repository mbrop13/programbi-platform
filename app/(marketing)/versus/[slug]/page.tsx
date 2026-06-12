import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getComparisonBySlug, comparisons } from "@/lib/data/comparisons";
import { courses } from "@/lib/data/courses";
import { 
  ArrowLeft, 
  ChevronRight, 
  ArrowUpRight, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Award,
  ShieldCheck,
  Zap
} from "lucide-react";

type Params = Promise<{ slug: string }>;

interface PageProps {
  params: Params;
}

export async function generateStaticParams() {
  return comparisons.map((comp) => ({
    slug: comp.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) return { title: "Comparativa no encontrada" };

  return {
    title: comp.seoTitle,
    description: comp.seoDescription,
    alternates: {
      canonical: `/versus/${slug}`,
    },
    openGraph: {
      title: `${comp.seoTitle} | ProgramBI`,
      description: comp.seoDescription,
      url: `https://programbi.com/versus/${slug}`,
      type: "website",
    },
  };
}

export default async function VersusDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) notFound();

  // Find related course for CTA
  const relatedCourse = courses.find((c) => c.slug === comp.ctaCourseSlug);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comp.title,
    description: comp.seoDescription,
    author: {
      "@type": "Organization",
      name: "ProgramBI",
      url: "https://programbi.com",
    },
    publisher: {
      "@id": "https://programbi.com/#organization",
    },
    mainEntityOfPage: `https://programbi.com/versus/${slug}`,
    about: [
      { "@type": "Thing", name: comp.toolA.name },
      { "@type": "Thing", name: comp.toolB.name }
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://programbi.com" },
      { "@type": "ListItem", position: 2, name: "Comparativas", item: "https://programbi.com/versus" },
      { "@type": "ListItem", position: 3, name: comp.toolA.name + " vs " + comp.toolB.name, item: `https://programbi.com/versus/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="bg-[#FAFBFC] min-h-screen pt-28 pb-20 lg:pt-32 lg:pb-32">
        <div className="max-w-[900px] mx-auto px-5 lg:px-10">
          
          {/* Back Button & Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-10 text-xs sm:text-sm">
            <Link 
              href="/versus" 
              className="flex items-center gap-2 font-semibold text-slate-500 hover:text-[#1890FF] no-underline transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a comparativas</span>
            </Link>
            
            <div className="flex items-center gap-2 text-slate-500">
              <Link href="/" className="hover:text-blue-600 transition-colors no-underline text-slate-500">Inicio</Link>
              <ChevronRight className="w-3 h-3 text-slate-350" />
              <Link href="/versus" className="hover:text-blue-600 transition-colors no-underline text-slate-500">Comparativas</Link>
              <ChevronRight className="w-3 h-3 text-slate-350" />
              <span className="text-slate-800 font-bold truncate max-w-[150px] sm:max-w-[200px]">
                {comp.toolA.name} vs {comp.toolB.name}
              </span>
            </div>
          </div>

          {/* Hero details */}
          <header className="mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#1890FF] bg-blue-50 px-3 py-1.5 rounded-full inline-block mb-4">
              Duelo Tecnológico
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.1] mb-6">
              {comp.title}
            </h1>
            <p className="text-slate-650 text-base sm:text-lg leading-relaxed mb-0">
              {comp.intro}
            </p>
          </header>

          {/* Tools Profiles */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="font-display font-extrabold text-xl text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                {comp.toolA.name}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed my-0">
                {comp.toolA.desc}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="font-display font-extrabold text-xl text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                {comp.toolB.name}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed my-0">
                {comp.toolB.desc}
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <section className="mb-16">
            <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight mb-6">
              Matriz de Comparación Directa
            </h3>
            
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-700">
                      <th className="px-6 py-4">Característica / Aspecto</th>
                      <th className="px-6 py-4">{comp.toolA.name}</th>
                      <th className="px-6 py-4">{comp.toolB.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-650 leading-relaxed">
                    {comp.features.map((f, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{f.feature}</td>
                        <td className={`px-6 py-4 ${f.winner === "A" ? "font-semibold text-blue-650" : ""}`}>
                          {f.toolAVal}
                          {f.winner === "A" && <span className="inline-block bg-blue-100 text-blue-800 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ml-2">Ganador</span>}
                        </td>
                        <td className={`px-6 py-4 ${f.winner === "B" ? "font-semibold text-indigo-650" : ""}`}>
                          {f.toolBVal}
                          {f.winner === "B" && <span className="inline-block bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ml-2">Ganador</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Pros & Cons side by side */}
          <section className="grid sm:grid-cols-2 gap-8 mb-16">
            {/* Tool A Pros/Cons */}
            <div className="space-y-6">
              <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
                Análisis de {comp.toolA.name}
              </h3>
              
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest my-0">Ventajas</h4>
                <ul className="space-y-3 pl-0 list-none my-0">
                  {comp.prosA.map((p, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-600 pl-0">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest pt-4 border-t border-slate-50 my-0">Desventajas</h4>
                <ul className="space-y-3 pl-0 list-none my-0">
                  {comp.consA.map((c, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-500 pl-0">
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tool B Pros/Cons */}
            <div className="space-y-6">
              <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
                Análisis de {comp.toolB.name}
              </h3>
              
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest my-0">Ventajas</h4>
                <ul className="space-y-3 pl-0 list-none my-0">
                  {comp.prosB.map((p, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-600 pl-0">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest pt-4 border-t border-slate-50 my-0">Desventajas</h4>
                <ul className="space-y-3 pl-0 list-none my-0">
                  {comp.consB.map((c, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-500 pl-0">
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm mb-16">
            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Veredicto y Conclusión
            </h3>
            <p className="text-slate-650 text-sm sm:text-base leading-relaxed my-0">
              {comp.conclusion}
            </p>
          </section>

          {/* CTA Related Course Card */}
          {relatedCourse && (
            <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1890FF]/15 rounded-full blur-3xl" />
              
              <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1890FF] bg-[#1890FF]/10 px-3 py-1 rounded-full inline-block">
                    Curso en Vivo Relacionado
                  </span>
                  <h4 className="font-display font-black text-2xl text-white leading-tight my-0">
                    Aprende a dominar {comp.ctaCourseSlug === "python" ? "Python" : comp.ctaCourseSlug === "sql-server" ? "SQL Server" : "Power BI"} de forma práctica
                  </h4>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed my-0">
                    {relatedCourse.shortDescription} Programa en vivo con soporte de instructores y proyectos finales para tu portafolio corporativo.
                  </p>
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <Link
                    href={`/cursos/${relatedCourse.slug}`}
                    className="w-full sm:w-auto px-6 py-4 bg-[#1890FF] hover:bg-blue-600 text-white font-bold text-sm text-center no-underline rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
                  >
                    <span>Ver Detalles del Curso</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}
