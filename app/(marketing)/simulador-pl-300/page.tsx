import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SimuladorPl300Client } from "@/components/marketing/SimuladorPl300Client";
import {
  PL300_DOMINIO_MAP,
  PL300_DOMINIOS,
  PL300_FAQS,
  PL300_MUESTRA_SSR,
} from "@/lib/data/pl300-preguntas";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdString,
  ORG_ID,
  pageOg,
} from "@/lib/seo";

export const revalidate = 86400;

const PATH = "/simulador-pl-300";
const TITULO = "Simulador PL-300 Power BI gratis (español) | ProgramBI";
const DESCRIPCION =
  "Simulador gratuito del examen Microsoft PL-300 en español: 40 preguntas reales por dominio, puntaje sobre 1000 y explicaciones técnicas.";

const compartir = pageOg({
  title: TITULO,
  description: DESCRIPCION,
  path: PATH,
  kicker: "Simulador gratis · PL-300",
  tags: ["Power BI", "PL-300", "DAX", "Power Query"],
  alt: "Simulador gratuito del examen Microsoft PL-300 en español — ProgramBI",
});

export const metadata: Metadata = {
  title: { absolute: TITULO },
  description: DESCRIPCION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: absoluteUrl(PATH),
    type: "website",
    siteName: "ProgramBI",
    locale: "es_CL",
    images: compartir.images,
  },
  twitter: compartir.twitter,
};

const LETRAS = ["A", "B", "C", "D"] as const;

const PLAN_4_SEMANAS = [
  {
    semana: "Semana 1",
    titulo: "Preparar los datos (25–30%)",
    foco: "Conectores, modos Import vs DirectQuery, Data Profiling (límite de 1.000 filas), Unpivot Other Columns, Merge vs Append, parámetros y preservación de Query Folding.",
  },
  {
    semana: "Semana 2",
    titulo: "Modelar los datos (25–30%)",
    foco: "Star Schema, relaciones 1:N, role-playing dimensions con USERELATIONSHIP, transición de contexto en CALCULATE, ALL/REMOVEFILTERS, Time Intelligence, SUMX y Performance Analyzer.",
  },
  {
    semana: "Semana 3",
    titulo: "Visualizar y analizar (25–30%)",
    foco: "Elección de visuales, Marcadores (Data vs Display), Drill-through, Sync Slicers, Report Page Tooltips, Q&A, Decomposition Tree, formato condicional y accesibilidad.",
  },
  {
    semana: "Semana 4",
    titulo: "Implementar, mantener y simulacros (15–20%)",
    foco: "Workspaces y roles, RLS dinámico con USERPRINCIPALNAME(), On-premises Data Gateway Standard, Incremental Refresh (RangeStart/RangeEnd), licencias Pro/PPU/Fabric y simulacros completos.",
  },
] as const;

export default function SimuladorPl300Page() {
  const url = absoluteUrl(PATH);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LearningResource", "Quiz"],
        "@id": `${url}#simulador`,
        name: "Simulador Gratuito del Examen Microsoft PL-300 en Español",
        description: DESCRIPCION,
        url,
        inLanguage: "es",
        isAccessibleForFree: true,
        educationalLevel: "Intermediate",
        learningResourceType: "Practice test",
        provider: { "@id": ORG_ID },
        about: {
          "@type": "Thing",
          name: "Microsoft Certified: Power BI Data Analyst Associate (PL-300)",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: PL300_FAQS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
      breadcrumbJsonLd([
        { name: "Inicio", path: "/" },
        { name: "Guías", path: "/guias" },
        { name: "Simulador PL-300", path: PATH },
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
        {/* Cabecera */}
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
                href="/guias"
                className="text-mute no-underline transition-colors hover:text-ink"
              >
                Guías
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink">Simulador PL-300</span>
            </nav>

            <div className="mt-8 max-w-3xl">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                Herramienta gratis · 40 preguntas · Sin registro
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Simulador gratuito del examen Microsoft PL-300 en español
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
                Practica con 40 preguntas técnicas alineadas a los cuatro
                dominios oficiales de Power BI Data Analyst Associate. Obtén tu
                puntaje simulado sobre 1000, detecta brechas por dominio y
                revisa cada explicación.
              </p>
            </div>
          </div>
        </section>

        {/* Simulador interactivo */}
        <section className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:py-14">
          <SimuladorPl300Client />
        </section>

        {/* Sección SSR SEO / GEO: Dominios oficiales */}
        <section
          aria-labelledby="pl300-dominios"
          className="border-t border-line bg-paper/40"
        >
          <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:py-16">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
              Estructura oficial Microsoft
            </p>
            <h2
              id="pl300-dominios"
              className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              Dominios y pesos del examen PL-300
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
              Microsoft evalúa cuatro áreas funcionales. La nota mínima de
              aprobación oficial es{" "}
              <strong className="text-ink">700 sobre 1000 puntos</strong>.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-paper">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-wash text-[11px] font-semibold tracking-[0.12em] text-faint uppercase">
                    <th className="px-4 py-3.5 sm:px-5">Dominio oficial</th>
                    <th className="px-4 py-3.5 sm:px-5">Peso</th>
                    <th className="hidden px-4 py-3.5 sm:table-cell sm:px-5">
                      Temas clave evaluados
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {PL300_DOMINIOS.map((dom) => (
                    <tr key={dom.id}>
                      <td className="px-4 py-4 font-semibold text-ink sm:px-5">
                        {dom.nombre}
                      </td>
                      <td className="px-4 py-4 font-semibold whitespace-nowrap text-ink sm:px-5">
                        {dom.peso}
                      </td>
                      <td className="hidden px-4 py-4 text-mute sm:table-cell sm:px-5">
                        {dom.resumen}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4 preguntas de ejemplo con respuesta comentada visibles en HTML SSR */}
        <section
          aria-labelledby="pl300-ejemplos"
          className="border-t border-line"
        >
          <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:py-16">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
              Muestra comentada
            </p>
            <h2
              id="pl300-ejemplos"
              className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              4 preguntas tipo examen PL-300 con respuesta explicada
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
              Un ejemplo real por cada dominio para entender el nivel de
              escenario y detalle técnico que exige la certificación.
            </p>

            <div className="mt-7 grid gap-5">
              {PL300_MUESTRA_SSR.map((item, idx) => {
                const dom = PL300_DOMINIO_MAP[item.dominio];
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-line bg-paper p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-wash px-3 py-1 text-[11px] font-semibold text-ink">
                        Ejemplo {idx + 1} · {dom.nombre}
                      </span>
                      <span className="text-xs font-semibold text-faint">
                        {item.temaClave}
                      </span>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-mute sm:text-sm">
                      <strong className="text-ink">Escenario:</strong>{" "}
                      {item.escenario}
                    </p>
                    <h3 className="mt-2 text-base font-bold leading-snug text-ink sm:text-lg">
                      {item.pregunta}
                    </h3>

                    <ul className="mt-3 space-y-1.5 text-sm">
                      {item.opciones.map((op, opIdx) => {
                        const esCorrecta = opIdx === item.correcta;
                        return (
                          <li
                            key={`${item.id}-ssr-${opIdx}`}
                            className={`flex items-start gap-2 rounded-xl px-3 py-2 ${
                              esCorrecta
                                ? "bg-wash font-semibold text-ink"
                                : "text-mute"
                            }`}
                          >
                            <span className="shrink-0 font-bold">
                              {LETRAS[opIdx]}.
                            </span>
                            <span className="flex-1">{op}</span>
                            {esCorrecta ? (
                              <CheckCircle2
                                size={16}
                                className="mt-0.5 shrink-0 text-ink"
                                aria-label="Correcta"
                              />
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>

                    <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-mute sm:text-sm">
                      <strong className="text-ink">Por qué funciona:</strong>{" "}
                      {item.explicacion}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Guía rápida de preparación en 4 semanas */}
        <section
          aria-labelledby="pl300-plan"
          className="border-t border-line bg-paper/40"
        >
          <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:py-16">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
              Ruta sugerida
            </p>
            <h2
              id="pl300-plan"
              className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              Guía rápida de preparación en 4 semanas
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {PLAN_4_SEMANAS.map((bloque) => (
                <div
                  key={bloque.semana}
                  className="rounded-2xl border border-line bg-paper p-5"
                >
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                    {bloque.semana}
                  </p>
                  <h3 className="mt-1.5 text-base font-bold text-ink">
                    {bloque.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">
                    {bloque.foco}
                  </p>
                </div>
              ))}
            </div>

            {/* Enlaces internos estratégicos */}
            <div className="mt-8 rounded-[26px] bg-ink p-6 text-canvas sm:p-8">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-canvas/60 uppercase">
                Sigue preparándote
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-canvas sm:text-2xl">
                Domina Power BI con proyectos reales antes de rendir el PL-300
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-canvas/75">
                Combina este simulador con nuestra formación aplicada en Power
                Query, modelado en estrella, DAX y Power BI Service, más
                recursos descargables listos para estudiar.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/cursos/power-bi"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-canvas px-6 text-sm font-semibold text-ink no-underline transition-transform active:scale-[0.98]"
                >
                  Ver curso de Power BI <ArrowRight size={15} aria-hidden />
                </Link>
                <Link
                  href="/guias/certificacion-pl-300-power-bi"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-canvas/30 px-5 text-sm font-semibold text-canvas no-underline transition-colors hover:bg-canvas/10"
                >
                  Guía completa PL-300
                </Link>
                <Link
                  href="/plantillas"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-canvas/30 px-5 text-sm font-semibold text-canvas no-underline transition-colors hover:bg-canvas/10"
                >
                  Plantillas gratis de Power BI
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs visibles (sincronizadas con FAQPage JSON-LD) */}
        <section
          id="faq"
          aria-labelledby="pl300-faq-titulo"
          className="border-t border-line"
        >
          <div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:py-16">
            <h2
              id="pl300-faq-titulo"
              className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              Preguntas frecuentes sobre el examen PL-300
            </h2>

            <div className="mt-7 divide-y divide-line border-y border-line">
              {PL300_FAQS.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                    <span className="text-base font-semibold tracking-tight text-ink sm:text-lg">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-xl leading-none text-ink transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-mute sm:text-base">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
