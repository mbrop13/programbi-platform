import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PLANTILLAS, getPlantillaBySlug } from "@/lib/data/plantillas";
import {
  ORG_ID,
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdString,
  pageOg,
} from "@/lib/seo";
import PlantillaDetailClient, { CopyCodeButton } from "./PlantillaDetailClient";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  return PLANTILLAS.map((p) => ({ slug: p.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getPlantillaBySlug(slug);
  if (!item) return {};

  const path = `/plantillas/${item.slug}`;
  const compartir = pageOg({
    title: item.seoTitle,
    description: item.seoDescription,
    path,
    kicker: `Plantilla ${item.category}`,
    tags: [item.category, item.tool, "Gratis"],
    alt: item.title,
  });

  return {
    title: { absolute: item.seoTitle },
    description: item.seoDescription,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: item.seoTitle,
      description: item.seoDescription,
      url: absoluteUrl(path),
      type: "article",
      siteName: "ProgramBI",
      locale: "es_CL",
      images: compartir.images,
    },
    twitter: compartir.twitter,
  };
}

export default async function PlantillaDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getPlantillaBySlug(slug);
  if (!item) notFound();

  const path = `/plantillas/${item.slug}`;

  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: item.title,
    description: item.seoDescription,
    url: absoluteUrl(path),
    learningResourceType: "Dataset / Template",
    educationalLevel: item.level,
    inLanguage: "es",
    isAccessibleForFree: true,
    provider: { "@id": ORG_ID },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: item.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const related = PLANTILLAS.filter((p) => p.slug !== item.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(learningResourceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Inicio", path: "/" },
              { name: "Plantillas", path: "/plantillas" },
              { name: item.title, path },
            ])
          ),
        }}
      />

      <div className="bg-canvas text-ink">
        {/* Header / Breadcrumb */}
        <section className="border-b border-line">
          <div className="mx-auto max-w-[1400px] px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pt-8">
            <nav
              aria-label="Ruta de navegación"
              className="flex flex-wrap items-center gap-2 text-xs font-semibold text-faint"
            >
              <Link
                href="/"
                className="text-mute no-underline transition-colors hover:text-ink"
              >
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/plantillas"
                className="text-mute no-underline transition-colors hover:text-ink"
              >
                Plantillas
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink">{item.title}</span>
            </nav>

            <div className="mt-7 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                <span>{item.category}</span>
                <span aria-hidden="true">·</span>
                <span>{item.tool}</span>
                <span aria-hidden="true">·</span>
                <span>Nivel {item.level}</span>
                <span aria-hidden="true">·</span>
                <span>{item.estimatedTime} de armado</span>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                {item.h1}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-relaxed text-mute sm:text-lg">
                {item.summary}
              </p>
            </div>
          </div>
        </section>

        {/* Main 2-column content */}
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            {/* Left column: Rich SSR technical content */}
            <div className="space-y-12">
              {/* 1. KPIs incluidos */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Qué incluye esta plantilla
                </h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {item.kpisIncluded.map((kpi) => (
                    <li
                      key={kpi}
                      className="flex items-start gap-2.5 rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink"
                    >
                      <span className="mt-0.5 font-bold text-ink" aria-hidden="true">
                        ✓
                      </span>
                      <span>{kpi}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Columnas del dataset / bloques */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Estructura del archivo y columnas principales
                </h2>
                <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-paper">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-line bg-wash text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                        <th className="px-4 py-3">Campo / Bloque</th>
                        <th className="px-4 py-3">Tipo</th>
                        <th className="px-4 py-3">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {item.datasetColumns.map((col) => (
                        <tr key={col.name}>
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-ink">
                            {col.name}
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-faint">
                            {col.type}
                          </td>
                          <td className="px-4 py-3 text-sm text-mute">
                            {col.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Código listo para copiar (SSR) */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Código listo para copiar ({item.tool})
                </h2>
                <p className="mt-2 text-sm text-mute">
                  Puedes revisar o copiar directamente los fragmentos clave antes de descargar el
                  paquete completo.
                </p>

                <div className="mt-5 space-y-5">
                  {item.codeSnippets.map((snippet) => (
                    <div
                      key={snippet.title}
                      className="overflow-hidden rounded-xl border border-line bg-paper"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-wash px-4 py-2.5">
                        <span className="text-xs font-bold text-ink">
                          {snippet.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] uppercase text-faint">
                            {snippet.language}
                          </span>
                          <CopyCodeButton code={snippet.code} />
                        </div>
                      </div>
                      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-ink">
                        <code>{snippet.code}</code>
                      </pre>
                      <div className="border-t border-line bg-canvas px-4 py-2.5 text-xs leading-relaxed text-mute">
                        {snippet.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Guía paso a paso */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Cómo implementarla paso a paso
                </h2>
                <ol className="mt-4 space-y-3">
                  {item.stepByStep.map((step, index) => (
                    <li
                      key={step}
                      className="flex items-start gap-3.5 rounded-xl border border-line bg-paper p-4 text-sm leading-relaxed text-ink"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong bg-wash font-mono text-xs font-bold text-ink">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 5. FAQs */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Preguntas frecuentes
                </h2>
                <div className="mt-4 divide-y divide-line rounded-xl border border-line bg-paper">
                  {item.faqs.map((faq) => (
                    <div key={faq.question} className="p-5">
                      <h3 className="text-base font-bold text-ink">{faq.question}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-mute">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Sticky download unlock + Course CTA */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              <PlantillaDetailClient
                slug={item.slug}
                title={item.title}
                files={item.files}
                relatedCourseSlug={item.relatedCourseSlug}
              />

              <div className="rounded-xl border border-line bg-wash p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                  Aprende en vivo
                </p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-ink">
                  {item.relatedCourseName}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Domina estas herramientas con clases en vivo por Zoom, casos reales de industria y
                  feedback directo de instructores.
                </p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <Link
                    href={`/cursos/${item.relatedCourseSlug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-ink bg-ink px-4 py-2.5 text-xs font-bold text-canvas no-underline transition-opacity hover:opacity-90"
                  >
                    Ver programa y fechas →
                  </Link>
                  <Link
                    href={item.relatedGuidePath}
                    className="inline-flex items-center justify-center rounded-lg border border-line-strong bg-paper px-4 py-2 text-xs font-semibold text-ink no-underline transition-colors hover:border-ink"
                  >
                    {item.relatedGuideLabel}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Related templates */}
        <section className="border-t border-line bg-wash">
          <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Otras plantillas recomendadas
              </h2>
              <Link
                href="/plantillas"
                className="text-xs font-bold text-ink no-underline hover:underline underline-offset-4"
              >
                Ver las {PLANTILLAS.length} plantillas →
              </Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/plantillas/${rel.slug}`}
                  className="rounded-xl border border-line bg-paper p-5 no-underline transition-colors hover:border-line-strong"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                    {rel.category} · {rel.tool}
                  </p>
                  <h3 className="mt-2 text-base font-bold text-ink">{rel.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-mute line-clamp-2">
                    {rel.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
