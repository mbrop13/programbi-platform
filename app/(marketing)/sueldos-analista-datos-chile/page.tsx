import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CalculadoraSueldoChile } from "@/components/herramientas/CalculadoraSueldoChile";
import {
  DISCLAIMER_LEGAL,
  REFERENCIAS_SUELDO_CHILE,
  STACK_PROGRESSION,
  SUELDOS_CHILE_FAQS,
  formatClp,
} from "@/lib/data/sueldos-chile";
import { SITE_URL, absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOg } from "@/lib/seo";

export const revalidate = 86400;

const path = "/sueldos-analista-datos-chile";
const refDatos = REFERENCIAS_SUELDO_CHILE.find((r) => r.id === "chiletrabajos-datos");
const refBi = REFERENCIAS_SUELDO_CHILE.find((r) => r.id === "chiletrabajos-bi");
if (!refDatos?.montoClp || !refBi?.montoClp) {
  throw new Error("Faltan referencias de Chiletrabajos en REFERENCIAS_SUELDO_CHILE");
}

const title = "¿Cuánto gana un analista de datos en Chile? Sueldo 2026";
const description = `Un analista de datos en Chile pretende en promedio ${formatClp(refDatos.montoClp)} al mes y un analista BI ${formatClp(refBi.montoClp)} (Chiletrabajos, nov 2026). Calcula tu sueldo líquido.`;

const share = pageOg({
  title,
  description,
  path,
  kicker: "Benchmark Chile 2026 · Datos y BI",
  tags: ["Sueldos Chile", "Analista de Datos", "Power BI"],
  alt: "Benchmark y calculadora de sueldos Analista de Datos y BI en Chile — ProgramBI",
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
    type: "article",
    images: share.images,
  },
  twitter: share.twitter,
};

export default function SueldosAnalistaDatosChilePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Sueldo de Analista de Datos y BI en Chile 2026: referencias y calculadora",
        url: absoluteUrl(path),
        inLanguage: "es-CL",
        dateModified: "2026-11-18",
        author: {
          "@type": "Organization",
          name: "ProgramBI",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "ProgramBI",
          url: SITE_URL,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: SUELDOS_CHILE_FAQS.map((faq) => ({
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
        { name: "Sueldos Analista de Datos Chile", path },
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
                Sueldos Analista de Datos Chile
              </li>
            </ol>
          </nav>
        </div>

        <header className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
            Benchmark Chile 2026 · Calculadora CLP
          </p>
          <h1 className="mt-4 max-w-[26ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Sueldo de Analista de Datos y BI en Chile (2026)
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
            Compara las cifras públicas disponibles en portales de empleo chilenos y calcula tu
            sueldo líquido o bruto referencial en CLP considerando AFP, Salud, Seguro de Cesantía e
            Impuesto Único de Segunda Categoría.
          </p>

          {/* Bloque resumen citable para GEO */}
          <div className="mt-6 max-w-4xl rounded-2xl border border-line-strong bg-paper p-5 text-sm leading-relaxed text-mute">
            <p className="font-semibold text-ink">
              En resumen: sueldos de referencia de Analista de Datos y BI en Chile
            </p>
            <ul className="mt-2.5 list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-ink">Analista de Datos (Chiletrabajos):</strong>{" "}
                <strong>$979.205 CLP/mes</strong> promedio <em>pretendido</em> (rango $906.243 –
                $1.045.880 sobre 58.686 postulaciones, consultado el 4 nov 2026).
              </li>
              <li>
                <strong className="text-ink">Analista BI (Indeed Chile):</strong>{" "}
                <strong>$1.035.380 CLP/mes</strong> promedio referencial según avisos publicados
                (consultado el 4 nov 2026).
              </li>
              <li>
                <strong className="text-ink">Analista BI (Chiletrabajos):</strong>{" "}
                <strong>$1.147.226 CLP/mes</strong> promedio <em>pretendido</em> (rango $990.898 –
                $1.425.339 sobre 16.005 postulaciones, consultado en noviembre 2026).
              </li>
              <li>
                <strong className="text-ink">Aviso real con Power BI + SQL + SAP:</strong>{" "}
                <strong>$1.500.000 CLP/mes</strong> ofrecidos para cargo de Analista Power BI en San
                Bernardo (3 años de experiencia, feb 2026).
              </li>
            </ul>
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">
          <CalculadoraSueldoChile />
        </div>

        {/* Tabla SSR de referencias públicas */}
        <section className="border-y border-line bg-paper">
          <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
              Fuentes públicas citadas
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Referencias salariales verificables en Chile
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute">
              Distinguimos explícitamente entre <strong>sueldo pretendido</strong> (lo que piden los
              postulantes en Chiletrabajos) y <strong>promedios o montos de avisos</strong> (Indeed
              Chile, avisos específicos y GetOnBoard). Ninguna cifra constituye una promesa de renta.
            </p>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-canvas">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-wash text-xs uppercase tracking-wider text-faint">
                    <th className="px-4 py-3.5 font-semibold">Fuente</th>
                    <th className="px-4 py-3.5 font-semibold">Cargo</th>
                    <th className="px-4 py-3.5 font-semibold">Monto ref. (CLP)</th>
                    <th className="px-4 py-3.5 font-semibold">Rango / Muestra</th>
                    <th className="px-4 py-3.5 font-semibold">Qué mide</th>
                    <th className="px-4 py-3.5 font-semibold">Consulta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {REFERENCIAS_SUELDO_CHILE.map((ref) => (
                    <tr key={ref.id} className="align-top hover:bg-wash/60">
                      <td className="px-4 py-3.5 font-semibold text-ink">
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-ink underline-offset-4 hover:underline"
                        >
                          {ref.fuente}
                          <ExternalLink className="h-3 w-3 text-faint" aria-hidden />
                        </a>
                      </td>
                      <td className="px-4 py-3.5 text-ink">{ref.cargo}</td>
                      <td className="px-4 py-3.5 font-mono font-semibold text-ink">
                        {ref.montoClp ? formatClp(ref.montoClp) : "Según aviso"}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-mute">
                        <div className="font-medium text-ink">{ref.rangoLabel}</div>
                        <div className="mt-0.5 text-faint">{ref.muestraOMetodo}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-mute">
                        <span className="inline-block rounded-md border border-line bg-wash px-2 py-0.5 font-medium text-ink">
                          {ref.tipoDato}
                        </span>
                        <p className="mt-1.5 leading-relaxed">{ref.nota}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-faint">{ref.fechaConsulta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Progresión por stack */}
            <div className="mt-14">
              <h3 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Cómo sube el perfil según las herramientas que dominas
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">
                En Chile, el salto salarial rara vez viene de «saber hacer gráficos»: ocurre cuando
                pasas de planillas manuales a extraer datos con SQL, modelar en Power BI y
                automatizar con Python.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {STACK_PROGRESSION.map((stage) => (
                  <article
                    key={stage.id}
                    className="flex flex-col justify-between rounded-2xl border border-line bg-canvas p-5"
                  >
                    <div>
                      <h4 className="text-base font-bold tracking-tight text-ink">{stage.etapa}</h4>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {stage.herramientas.map((h) => (
                          <span
                            key={h}
                            className="rounded-full border border-line bg-wash px-2.5 py-0.5 text-[11px] font-medium text-ink"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-mute">
                        <strong className="text-ink">Qué piden los avisos:</strong>{" "}
                        {stage.quePidenLosAvisos}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-mute">
                        <strong className="text-ink">Referencia:</strong> {stage.referenciaAsociada}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-line">
                      <Link
                        href={stage.siguientePasoHref}
                        className="text-xs font-semibold text-ink no-underline underline-offset-4 hover:underline"
                      >
                        {stage.siguientePasoLabel} →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Nota metodológica */}
            <div className="mt-10 rounded-2xl border border-line bg-canvas p-5 text-xs leading-relaxed text-mute">
              <p className="font-semibold text-ink">Nota metodológica y alcance legal</p>
              <p className="mt-1.5">
                {DISCLAIMER_LEGAL} Los tramos del Impuesto Único de Segunda Categoría se calculan en
                UTM usando el valor referencial editable ingresado en la calculadora.
              </p>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Preguntas frecuentes sobre sueldos en datos en Chile
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {SUELDOS_CHILE_FAQS.map((faq) => (
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
              href="/cursos/sql-server"
              className="font-semibold text-ink no-underline underline-offset-4 hover:underline"
            >
              Curso SQL Server →
            </Link>
            <Link
              href="/cursos/analisis-de-datos"
              className="font-semibold text-ink no-underline underline-offset-4 hover:underline"
            >
              Programa Análisis de Datos (60 h) →
            </Link>
            <Link
              href="/simulador-pl-300"
              className="font-semibold text-mute no-underline underline-offset-4 hover:text-ink hover:underline"
            >
              Simulador PL-300 →
            </Link>
            <Link
              href="/herramientas/excel-a-dax"
              className="font-semibold text-mute no-underline underline-offset-4 hover:text-ink hover:underline"
            >
              Conversor Excel a DAX →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
