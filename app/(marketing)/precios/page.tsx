import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE_URL,
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdString,
  pageOg,
  tituloSeo,
} from "@/lib/seo";
import { PAISES_INDEXABLES, getPais, normalizarPais, type Pais } from "@/config/paises";
import { cuotasSinInteres } from "@/config/cuotas";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { localizarMercado } from "@/lib/paises/precios";
import { preciosDePais, type PrecioCursoPagina } from "@/lib/paises/precios-pagina";
import { courseBrochurePath } from "@/lib/pricing-gate";
import PreciosGateClient, { type CursoPrecioGate } from "@/components/marketing/PreciosGateClient";

export const revalidate = 3600;

const PATH = "/precios";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais?: string }>;
}): Promise<Metadata> {
  const iso = normalizarPais((await params).pais);
  const pais = getPais(iso);
  const title = tituloSeo(`Precios de cursos en vivo en ${pais.nombre}`);
  const description = `Precios publicados en ${pais.moneda} para ${pais.nombre}: duración, qué incluye, medios de pago y cuotas sin interés.`;
  const share = pageOg({
    title,
    description,
    path: rutaLocal(iso, PATH),
    kicker: `Precios · ${pais.nombre}`,
    tags: ["Precios", "Power BI", "Análisis de datos"],
  });

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: absoluteUrl(rutaLocal(iso, PATH)),
      languages: hreflangDe(PATH),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(rutaLocal(iso, PATH)),
      type: "website",
      images: share.images,
    },
    twitter: share.twitter,
  };
}

function faqsDe(pais: Pais, cursos: PrecioCursoPagina[], moneda: string) {
  const powerBi = cursos.find((curso) => curso.slug === "power-bi");
  const horasPowerBi = powerBi ? `${powerBi.hours} horas` : "20 horas";

  return [
    {
      q: `¿Cuánto cuestan los cursos en ${pais.nombre}?`,
      a: `El arancel vigente de cada curso se publica en su brochure PDF, que se descarga gratis desde la tabla de esta página. Los montos están en ${moneda} y el valor final se confirma en el checkout.`,
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
      a: `El arancel vigente de Power BI, por ${horasPowerBi}, se descarga en el brochure PDF del curso junto con el temario, las fechas en hora de ${pais.nombre} y el detalle de las ${cuotasSinInteres(pais.iso)} cuotas sin interés. Está publicado en ${moneda}.`,
    },
    {
      q: "¿Cuál es el mejor curso de Power BI en vivo en LatAm?",
      a: `No hay un ranking único. Para comparar, revisa si las clases son en vivo, la duración, las grabaciones y el certificado. En ProgramBI, Power BI se dicta en vivo por Zoom${powerBi ? `, con ${powerBi.hours} horas` : ""}, grabaciones y certificado; el arancel de ${pais.nombre} está en el brochure PDF de cada curso.`,
    },
    {
      q: `¿Cómo puedo pagar desde ${pais.nombre}?`,
      a: `Los medios de pago publicados para ${pais.nombre} son: ${pais.mediosPago.join("; ")}. El checkout confirma los medios disponibles y el monto final.`,
    },
    {
      q: "¿Hay cuotas sin interés?",
      a: `Sí: todos los cursos se pueden pagar en ${cuotasSinInteres(pais.iso)} cuotas sin interés, sin recargo por financiamiento. El detalle está en el brochure PDF de cada curso.`,
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

  // La tabla de precios es cliente: recibe solo títulos, nivel y horas. Los
  // montos se calculan con `precioVenta` recién al desbloquear, así el HTML
  // inicial nunca contiene un precio (ni como texto ni en el flight data).
  const cursosGate: CursoPrecioGate[] = cursos.map((curso) => ({
    slug: curso.slug,
    title: curso.title,
    levelName: curso.levelName,
    hours: curso.hours,
  }));

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
            Aranceles publicados en {moneda} para {pais.nombre}. El detalle de cada
            curso se descarga en su brochure PDF, con el temario, las fechas y las
            cuotas sin interés.
          </p>

          {powerBi ? (
            <dl className="mt-6 grid gap-4 rounded-2xl border border-line bg-paper p-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-mute">
                  Curso Power BI
                </dt>
                <dd className="mt-1 font-semibold text-ink">
                  <Link
                    href={courseBrochurePath(powerBi.slug, pais.iso)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline hover:text-mute"
                  >
                    Precio y temario en el brochure PDF
                  </Link>
                </dd>
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

          <PreciosGateClient
            cursos={cursosGate}
            pais={pais.iso}
            moneda={moneda}
            cobroLocal={cobroLocal}
          />

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
