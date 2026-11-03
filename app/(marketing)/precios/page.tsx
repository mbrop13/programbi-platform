import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE_URL,
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdString,
  pageOg,
} from "@/lib/seo";
import { PAISES_INDEXABLES, normalizarPais, type Pais } from "@/config/paises";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";
import { preciosDePais, type PrecioCursoPagina } from "@/lib/paises/precios-pagina";

export const revalidate = 3600;

const PATH = "/precios";
const TITLE = "Precios de cursos en vivo en Chile | ProgramBI";
const DESCRIPTION =
  "Precios publicados por curso en Chile: duración, qué incluye, medios de pago y preguntas frecuentes.";
const share = pageOg({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  kicker: "Precios · Chile",
  tags: ["Precios", "Power BI", "Análisis de datos"],
});

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH), languages: hreflangDe(PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    type: "website",
    images: share.images,
  },
  twitter: share.twitter,
};

function faqsDe(pais: Pais, cursos: PrecioCursoPagina[], moneda: string) {
  const powerBi = cursos.find((curso) => curso.slug === "power-bi");
  const powerBiAnswer =
    powerBi && powerBi.priceValue != null
      ? `El curso de Power BI tiene un precio publicado de ${powerBi.priceLabel} para ${powerBi.hours} horas.${powerBi.listLabel ? ` El precio de lista es ${powerBi.listLabel}.` : ""} El monto final se confirma en el checkout.`
      : "El precio del curso de Power BI está en la tabla de esta página.";

  return [
    {
      q: `¿Cuánto cuestan los cursos en ${pais.nombre}?`,
      a: `Los precios de la tabla están en ${moneda} y corresponden a la modalidad abierta para particulares. El monto final y la moneda de cobro se confirman en el checkout.`,
    },
    {
      q: "¿Qué incluye el precio?",
      a: "Clases en vivo por Zoom, grabaciones en el campus, certificado digital al completar y proyectos con datos reales. La duración de cada curso está en la tabla.",
    },
    {
      q: "¿Las clases son en vivo o grabadas?",
      a: "Las clases se dictan en vivo por Zoom. Las grabaciones quedan en el campus para repasar.",
    },
    {
      q: "¿Hay certificado al terminar?",
      a: "Sí. Al completar el curso recibes un certificado digital de ProgramBI.",
    },
    {
      q: `¿Cuánto cuesta el curso de Power BI en ${pais.nombre}?`,
      a: powerBiAnswer,
    },
    {
      q: "¿Cuál es el mejor curso de Power BI en vivo en LatAm?",
      a: `No hay un ranking único. Para comparar, revisa si las clases son en vivo, la duración, las grabaciones y el certificado. En ProgramBI, Power BI se dicta en vivo por Zoom${powerBi ? `, con ${powerBi.hours} horas` : ""}, grabaciones y certificado; el precio en ${pais.nombre} está en esta página.`,
    },
    {
      q: `¿Cómo puedo pagar desde ${pais.nombre}?`,
      a: `Los medios de pago publicados para ${pais.nombre} son: ${pais.mediosPago.join("; ")}. El checkout confirma los medios disponibles y el monto final.`,
    },
  ];
}

export default async function PreciosPage({
  params,
}: {
  params: Promise<{ pais?: string }>;
}) {
  const iso = normalizarPais((await params).pais);
  const { pais, cursos, moneda, cobroLocal } = await preciosDePais(iso);
  const faqs = faqsDe(pais, cursos, moneda);
  const powerBi = cursos.find((curso) => curso.slug === "power-bi");
  const L = (texto: string) => localizarMercado(texto, iso);
  const href = (destino: string) => rutaLocal(iso, destino);
  const courseUrl = (slug: string) => absoluteUrl(href(`/cursos/${slug}`));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: L("Precios de cursos en vivo en Chile"),
        numberOfItems: cursos.length,
        itemListElement: cursos.map((curso, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: courseUrl(curso.slug),
          item: {
            "@type": "Course",
            name: curso.title,
            description: L(curso.description),
            url: courseUrl(curso.slug),
            provider: {
              "@type": "Organization",
              name: "ProgramBI",
              url: SITE_URL,
              "@id": `${SITE_URL}/#organization`,
            },
            inLanguage: pais.idioma,
            courseMode: "Online",
            timeRequired: `PT${curso.hours}H`,
            educationalCredentialAwarded: "Certificado de finalización de ProgramBI",
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "Online",
              courseWorkload: `PT${curso.hours}H`,
            },
            ...(curso.priceValue != null
              ? {
                  offers: {
                    "@type": "Offer",
                    price: curso.priceValue,
                    priceCurrency: curso.currency,
                    availability: "https://schema.org/InStock",
                    url: courseUrl(curso.slug),
                  },
                }
              : {}),
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      breadcrumbJsonLd([
        { name: "Inicio", path: href("/") },
        { name: "Precios", path: href(PATH) },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <article className="bg-canvas px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 text-sm text-mute" aria-label="Migas">
            <Link href={href("/")} className="no-underline hover:text-ink">
              Inicio
            </Link>
            <span className="mx-2 text-faint">/</span>
            <span className="text-ink">Precios</span>
          </nav>

          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
            {L("Precios · Chile")}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {L("Precios de cursos en vivo en Chile")}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-mute">
            Precios publicados en {moneda} para {pais.nombre}. Clases en vivo
            por Zoom, grabaciones en el campus y certificado digital al completar.
          </p>

          {powerBi ? (
            <dl className="mt-6 grid gap-4 rounded-2xl border border-line bg-paper p-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-mute">
                  Curso Power BI
                </dt>
                <dd className="mt-1 font-semibold text-ink">{powerBi.priceLabel}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-mute">
                  Duración
                </dt>
                <dd className="mt-1 font-semibold text-ink">{powerBi.hours} h</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-mute">
                  Modalidad
                </dt>
                <dd className="mt-1 font-semibold text-ink">En vivo por Zoom</dd>
              </div>
            </dl>
          ) : null}

          <section className="mt-12" aria-labelledby="precios-por-curso">
            <h2
              id="precios-por-curso"
              className="text-2xl font-bold tracking-tight text-ink"
            >
              Precios por curso
            </h2>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  Precios y duración de los cursos en {pais.nombre}
                </caption>
                <thead className="bg-wash text-xs uppercase tracking-wide text-mute">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Curso
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Duración
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-paper">
                  {cursos.map((curso) => (
                    <tr key={curso.slug}>
                      <th scope="row" className="px-4 py-4 font-semibold text-ink">
                        <Link
                          href={href(`/cursos/${curso.slug}`)}
                          className="no-underline hover:text-mute"
                        >
                          {curso.title}
                        </Link>
                        <span className="mt-1 block text-xs font-normal text-faint">
                          {curso.levelName}
                        </span>
                      </th>
                      <td className="whitespace-nowrap px-4 py-4 text-mute">
                        {curso.hours} h
                      </td>
                      <td className="px-4 py-4">
                        {curso.listLabel ? (
                          <span className="mr-2 text-xs text-faint line-through">
                            {curso.listLabel}
                          </span>
                        ) : null}
                        <span className="font-semibold text-ink">
                          {curso.priceLabel}
                        </span>
                        {curso.discount > 0 ? (
                          <span className="ml-2 text-xs font-semibold text-emerald-700">
                            {curso.discount}% off
                          </span>
                        ) : null}
                        {curso.chargeLabel ? (
                          <span className="mt-1 block text-[11px] leading-snug text-faint">
                            {curso.chargeLabel}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-mute">
              Precios publicados y sujetos a cambios. El monto final y la moneda
              de cobro se confirman en el checkout.
            </p>
            {cobroLocal ? null : (
              <p className="mt-1 text-sm text-mute">
                Cuando no hay cobro local disponible, el checkout procesa el pago
                en pesos chilenos (CLP).
              </p>
            )}
          </section>

          <section className="mt-14" aria-labelledby="que-incluye">
            <h2 id="que-incluye" className="text-2xl font-bold tracking-tight text-ink">
              Qué incluye
            </h2>
            <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-mute sm:grid-cols-2">
              <li>Clases en vivo por Zoom.</li>
              <li>Grabaciones de las clases en el campus.</li>
              <li>Certificado digital al completar.</li>
              <li>Proyectos con datos reales.</li>
              <li>Duración indicada por curso en la tabla.</li>
              <li>Modalidad online para particulares.</li>
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="medios-de-pago">
            <h2
              id="medios-de-pago"
              className="text-2xl font-bold tracking-tight text-ink"
            >
              Medios de pago en {pais.nombre}
            </h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-mute">
              {pais.mediosPago.map((medio) => (
                <li key={medio}>{medio}.</li>
              ))}
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="preguntas-frecuentes">
            <h2
              id="preguntas-frecuentes"
              className="text-2xl font-bold tracking-tight text-ink"
            >
              Preguntas frecuentes
            </h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="cursor-pointer list-none text-base font-semibold text-ink">
                    {faq.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-14 border-t border-line pt-8" aria-labelledby="otros-paises">
            <h2 id="otros-paises" className="text-xs font-bold uppercase tracking-[0.18em] text-mute">
              Precios en otros países
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {PAISES_INDEXABLES.filter((otro) => otro.iso !== pais.iso).map((otro) => (
                <li key={otro.iso}>
                  <Link
                    href={rutaLocal(otro.iso, PATH)}
                    className="text-sm font-semibold text-ink no-underline hover:text-mute"
                  >
                    {otro.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link
              href={href("/cursos")}
              className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
            >
              Ver cursos
            </Link>
            <Link
              href={href("/faq")}
              className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink no-underline hover:bg-wash"
            >
              Preguntas frecuentes
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
