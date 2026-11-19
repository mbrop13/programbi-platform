import type { Metadata } from "next";
import Link from "next/link";
import { ExcelToDaxClient } from "@/components/herramientas/ExcelToDaxClient";
import {
  EXCEL_TO_DAX_CATEGORIES,
  EXCEL_TO_DAX_FAQS,
  EXCEL_TO_DAX_ITEMS,
} from "@/lib/data/excel-a-dax";
import { SITE_URL, absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOg } from "@/lib/seo";

export const revalidate = 86400;

const path = "/herramientas/excel-a-dax";
const title = "Conversor Excel a DAX: equivalencias Power BI | ProgramBI";
const description =
  "Convierte fórmulas de Excel (español e inglés) a medidas DAX en Power BI: BUSCARV, SUMAR.SI.CONJUNTO, YTD, YoY, errores comunes y ejemplos listos.";

const share = pageOg({
  title,
  description,
  path,
  kicker: "Herramienta gratis · Excel → DAX",
  tags: ["Excel", "DAX", "Power BI"],
  alt: "Conversor y guía interactiva de fórmulas Excel a DAX — ProgramBI",
});

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: absoluteUrl(path),
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl(path),
    type: "website",
    images: share.images,
  },
  twitter: share.twitter,
};

export default function ExcelADaxPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Conversor y Guía Interactiva de Fórmulas Excel a DAX",
        url: absoluteUrl(path),
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "es",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: "ProgramBI",
          url: SITE_URL,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: EXCEL_TO_DAX_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
      breadcrumbJsonLd([
        { name: "Inicio", path: "/" },
        { name: "Herramientas", path },
        { name: "Conversor Excel a DAX", path },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="bg-canvas text-ink">
        <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">
          <nav aria-label="Ruta de navegación" className="text-[13px] text-mute">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="no-underline hover:text-ink">
                  Inicio
                </Link>
              </li>
              <li aria-hidden className="text-faint">
                ›
              </li>
              <li aria-current="page" className="font-medium text-ink">
                Conversor Excel a DAX
              </li>
            </ol>
          </nav>
        </div>

        <header className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
            Herramienta gratis · Power BI
          </p>
          <h1 className="mt-4 max-w-[26ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Conversor y guía de fórmulas Excel a DAX
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
            Pega una fórmula de Excel en español o inglés (como{" "}
            <code className="font-mono text-sm text-ink">BUSCARV</code>,{" "}
            <code className="font-mono text-sm text-ink">SUMAR.SI.CONJUNTO</code> o{" "}
            <code className="font-mono text-sm text-ink">SI.ERROR</code>) o busca lo que necesitas
            calcular para obtener la medida DAX equivalente lista para copiar en Power BI.
          </p>

          <div className="mt-6 max-w-3xl rounded-2xl border border-line bg-paper p-4 text-sm leading-relaxed text-mute">
            <strong className="font-semibold text-ink">En resumen:</strong> en Excel las fórmulas
            apuntan a celdas y rangos (<code className="font-mono text-xs">A2:C100</code>); en
            Power BI las medidas DAX operan sobre columnas y contexto de filtro (
            <code className="font-mono text-xs">CALCULATE</code>,{" "}
            <code className="font-mono text-xs">DIVIDE</code>,{" "}
            <code className="font-mono text-xs">SUMX</code>). Aquí tienes{" "}
            {EXCEL_TO_DAX_ITEMS.length} equivalencias directas con casos de negocio reales y los
            errores más comunes al migrar.
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">
          <ExcelToDaxClient items={EXCEL_TO_DAX_ITEMS} categories={EXCEL_TO_DAX_CATEGORIES} />
        </div>

        {/* Tabla SSR completa para SEO/GEO */}
        <section className="border-y border-line bg-paper">
          <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
              Referencia rápida completa
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Tabla de equivalencias Excel (ES / EN) → DAX
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute">
              Consulta las {EXCEL_TO_DAX_ITEMS.length} conversiones en una sola vista. Haz clic en
              cualquier función para saltar a su medida completa y ejemplo de negocio.
            </p>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-canvas">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-wash text-xs uppercase tracking-wider text-faint">
                    <th className="px-4 py-3.5 font-semibold">Categoría</th>
                    <th className="px-4 py-3.5 font-semibold">Excel (Español)</th>
                    <th className="px-4 py-3.5 font-semibold">Excel (Inglés)</th>
                    <th className="px-4 py-3.5 font-semibold">Equivalente DAX</th>
                    <th className="px-4 py-3.5 font-semibold">Qué resuelve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {EXCEL_TO_DAX_ITEMS.map((item) => (
                    <tr key={item.id} className="hover:bg-wash/60">
                      <td className="px-4 py-3 text-xs text-faint">{item.category}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-ink">
                        <a href={`#${item.id}`} className="no-underline hover:underline">
                          {item.excelEs}
                        </a>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-mute">{item.excelEn}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-ink">
                        {item.daxFunction}
                      </td>
                      <td className="px-4 py-3 text-xs leading-relaxed text-mute">
                        {item.businessCase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Preguntas frecuentes al pasar de Excel a DAX
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {EXCEL_TO_DAX_FAQS.map((faq) => (
              <article key={faq.q} className="rounded-2xl border border-line bg-paper p-6">
                <h3 className="text-base font-semibold tracking-tight text-ink">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{faq.a}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link
              href="/cursos/power-bi"
              className="font-semibold text-ink no-underline underline-offset-4 hover:underline"
            >
              Curso Power BI en vivo →
            </Link>
            <Link
              href="/plantillas/guia-practica-dax-ejercicios"
              className="font-semibold text-ink no-underline underline-offset-4 hover:underline"
            >
              Guía práctica DAX con ejercicios →
            </Link>
            <Link
              href="/migrar-excel-a-power-bi"
              className="font-semibold text-mute no-underline underline-offset-4 hover:text-ink hover:underline"
            >
              Migrar Excel a Power BI en empresas →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
