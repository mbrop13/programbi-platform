import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Award, CheckCircle, ArrowUpRight, BarChart } from "lucide-react";
import { casesOfUse } from "@/lib/data/cases";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all 8 case study paths
export async function generateStaticParams() {
  return casesOfUse.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const currentCase = casesOfUse.find((c) => c.slug === slug);
  if (!currentCase) return { title: "Caso no encontrado" };

  return {
    title: currentCase.fullTitle,
    description: currentCase.description,
    alternates: { canonical: `/casos/${slug}` },
    openGraph: {
      title: `${currentCase.fullTitle} | ProgramBI`,
      description: currentCase.description,
      url: `https://programbi.com/casos/${slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const currentCase = casesOfUse.find((c) => c.slug === slug);

  if (!currentCase) {
    notFound();
  }

  const caseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: currentCase.fullTitle,
    description: currentCase.description,
    author: { "@type": "Organization", name: "ProgramBI", url: "https://programbi.com" },
    publisher: { "@id": "https://programbi.com/#organization" },
    mainEntityOfPage: `https://programbi.com/casos/${slug}`,
    about: currentCase.productsUsed.map((p: string) => ({ "@type": "Thing", name: p })),
  };

  return (
    <main className="bg-white min-h-screen pt-28 pb-20 lg:pt-32 lg:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd) }}
      />
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        
        {/* Breadcrumbs Row */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold border-b border-slate-100 pb-5 mb-12">
          <div className="flex items-center gap-2 text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors no-underline">Inicio</Link>
            <span className="text-slate-350">/</span>
            <span className="text-slate-800 font-bold">Caso de Éxito</span>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5 no-underline font-bold">
            <ArrowLeft size={16} />
            <span>Volver a la Home</span>
          </Link>
        </div>

        {/* Hero Section: Title, Intro vs Sidebar Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Main Header */}
          <div className="lg:col-span-8 text-left">
            <span className="inline-block text-[#1890FF] font-extrabold text-[11px] uppercase tracking-widest bg-blue-50 border border-blue-100/50 px-3.5 py-1.5 rounded-full mb-6">
              {currentCase.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight mb-8">
              {currentCase.fullTitle}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-light font-sans">
              {currentCase.intro}
            </p>

            {/* Video del caso de uso */}
            {currentCase.videoUrl && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-950 aspect-video relative">
                <video
                  src={currentCase.videoUrl}
                  poster={currentCase.posterUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Right: Sidebar Card */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-150 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative">
            <div>
              {/* Case Study Header */}
              <div className="mb-6 pb-5 border-b border-slate-200/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow shadow-blue-500/20">
                  P
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-sm text-slate-900 tracking-tight leading-none">ProgramBI</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Caso de Uso Práctico</span>
                </div>
              </div>

              {/* Skills/Products list */}
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Módulos Utilizados</h4>
              <ul className="space-y-3 mb-6">
                {currentCase.productsUsed.map((prod, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-semibold font-sans">
                    <CheckCircle size={15} className="text-blue-500 shrink-0" />
                    <span>{prod}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Meta badges */}
            <div className="border-t border-slate-200/60 pt-5 space-y-3.5 text-xs text-slate-650 font-sans font-semibold">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-slate-400 shrink-0" />
                <span>Aplicado en Chile & LatAm</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={15} className="text-slate-400 shrink-0" />
                <span>Formación Práctica Directa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.3fr] gap-12 lg:gap-20 pt-16 border-t border-slate-100 mt-16">
          
          {/* Left Column: Metrics */}
          <div className="space-y-8 lg:border-r lg:border-slate-100 lg:pr-10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mb-2">Impacto Medido</h4>
            {currentCase.metrics.map((metric, i) => (
              <div key={i} className="flex flex-col border-b border-slate-50 pb-5 last:border-b-0">
                <span className="text-3xl lg:text-4xl font-black text-slate-900 font-mono tracking-tight">
                  {metric.value}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 leading-normal font-semibold font-sans mt-1.5">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          {/* Right Column: Case study text & quote */}
          <div className="space-y-10 text-left font-sans">
            
            {/* Problem */}
            <div className="space-y-4">
              <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                El Desafío del Negocio
              </h3>
              <p className="text-slate-650 text-base leading-relaxed">
                {currentCase.problem}
              </p>
            </div>

            {/* Highlights Quote Box */}
            <div className="bg-blue-600 rounded-[2rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-lg shadow-blue-500/10">
              {/* Overlay graphics */}
              <div className="absolute right-0 bottom-0 w-44 h-44 bg-blue-500 rounded-full blur-2xl opacity-40 pointer-events-none" />
              <div className="absolute left-6 top-6 opacity-10 pointer-events-none">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-4.995 2.638-4.995 5.893h5.983v9.956h-10.966zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-4.996 2.638-4.996 5.893h5.983v9.956h-10.983z" />
                </svg>
              </div>

              <blockquote className="text-lg sm:text-xl font-bold leading-relaxed mb-6 relative z-10">
                &ldquo;{currentCase.quote}&rdquo;
              </blockquote>
              <cite className="text-xs sm:text-sm text-blue-100 font-semibold relative z-10 not-italic block">
                {currentCase.quoteAuthor}
              </cite>
            </div>

            {/* Solution */}
            <div className="space-y-4">
              <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                La Solución Implementada
              </h3>
              <p className="text-slate-650 text-base leading-relaxed">
                {currentCase.solution}
              </p>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                Retorno y Resultados de la Optimización
              </h3>
              <p className="text-slate-650 text-base leading-relaxed">
                {currentCase.results}
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-left font-sans text-xs sm:text-sm text-slate-500">
                ¿Quieres aprender a diseñar automatizaciones y dashboards como este?
              </div>
              <Link
                href="/cursos"
                className="group px-6 py-3 rounded-xl bg-[#1890FF] hover:bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 no-underline transition-all shadow hover:-translate-y-0.5"
              >
                <span>Explorar Cursos en Vivo</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
