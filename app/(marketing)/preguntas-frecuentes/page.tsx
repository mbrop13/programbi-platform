import type { Metadata } from "next";
import Link from "next/link";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdString,
  tituloSeo,
  twitterShare,
} from "@/lib/seo";
import { whatsappNumber } from "@/lib/whatsapp";
import {
  CURSOS_TABLA,
  FICHA,
  GUIAS_RELACIONADAS,
  HORARIOS,
  PAISES_TABLA,
  PRECIOS_DESDE,
  SECCIONES,
  precioTexto,
} from "@/lib/faq/contenido";

const PATH = "/preguntas-frecuentes";
const TITLE = tituloSeo("Preguntas frecuentes: cursos, clases y pagos");
const DESCRIPTION =
  "Respuestas claras sobre los cursos de ProgramBI: clases en vivo por Zoom, grabaciones, horarios por país, precios, requisitos y certificación PL-300.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    type: "website",
  },
  twitter: twitterShare(TITLE, DESCRIPTION),
};

const WHATSAPP = `https://wa.me/${whatsappNumber("cl")}?text=${encodeURIComponent(
  "Hola, revisé las preguntas frecuentes de ProgramBI y tengo una consulta sobre los cursos."
)}`;

const FAQ_ITEMS = SECCIONES.flatMap((seccion) => seccion.items);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${absoluteUrl(PATH)}#faq`,
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.pregunta,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.respuesta,
    },
  })),
};

const breadcrumb = breadcrumbJsonLd([
  { name: "Inicio", path: "/" },
  { name: "Preguntas frecuentes", path: PATH },
]);

function TablaHorarios() {
  return (
    <div className="mt-6 overflow-x-auto rounded-[26px] border border-line">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">
          Horario de las clases por país, en hora local
        </caption>
        <thead className="bg-wash text-xs uppercase tracking-wide text-mute">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              País
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Días
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Hora local
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-paper">
          {HORARIOS.map((horario) => (
            <tr key={horario.iso}>
              <th scope="row" className="px-4 py-3 font-semibold text-ink">
                {horario.pais}
              </th>
              <td className="px-4 py-3 text-mute">{horario.dias}</td>
              <td className="whitespace-nowrap px-4 py-3 text-mute">
                {horario.hora}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TablaPrecios() {
  return (
    <div className="mt-6 overflow-x-auto rounded-[26px] border border-line">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">
          Precios de Power BI y Análisis de datos por país, en moneda local
        </caption>
        <thead className="bg-wash text-xs uppercase tracking-wide text-mute">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              País
            </th>
            {CURSOS_TABLA.map((curso) => (
              <th
                key={curso.slug}
                scope="col"
                className="px-4 py-3 font-semibold"
              >
                {curso.nombre}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-paper">
          {PAISES_TABLA.map((pais) => (
            <tr key={pais.iso}>
              <th scope="row" className="px-4 py-3 font-semibold text-ink">
                {pais.nombre}
              </th>
              {CURSOS_TABLA.map((curso) => (
                <td
                  key={curso.slug}
                  className="whitespace-nowrap px-4 py-3 text-mute"
                >
                  {precioTexto(pais.iso, curso.slug)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TablaPagos() {
  return (
    <div className="mt-6 overflow-x-auto rounded-[26px] border border-line">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">
          Medios de pago publicados por país
        </caption>
        <thead className="bg-wash text-xs uppercase tracking-wide text-mute">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              País
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Medios de pago
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-paper">
          {PAISES_TABLA.map((pais) => (
            <tr key={pais.iso}>
              <th scope="row" className="px-4 py-3 align-top font-semibold text-ink">
                {pais.nombre}
              </th>
              <td className="px-4 py-3 text-mute">
                {pais.mediosPago.join(" · ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />

      <main className="bg-canvas px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[880px]">
          <nav aria-label="Migas de pan" className="text-xs text-mute">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="no-underline hover:text-ink">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">Preguntas frecuentes</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Preguntas frecuentes sobre ProgramBI
          </h1>

          <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-mute">
            <strong className="font-semibold text-ink">Respuesta corta:</strong>{" "}
            ProgramBI es una escuela online de inteligencia de negocios y
            análisis de datos que dicta cursos de Power BI y de Análisis de datos
            (SQL, Power BI y Python) con clases en vivo por Zoom y grabaciones
            para repasar.
          </p>
          <p className="mt-3 max-w-[62ch] leading-relaxed text-mute">
            El próximo inicio es el lunes 23 de noviembre de 2026, con clases los
            lunes y miércoles en un horario adaptado a cada país. Los valores se
            informan en moneda local y se pueden pagar en 3 cuotas sin interés en
            todos los países. Al terminar, recibes un certificado.
          </p>

          <section
            aria-labelledby="ficha-rapida"
            className="mt-8 rounded-[26px] border border-line bg-paper p-5 sm:p-6"
          >
            <h2
              id="ficha-rapida"
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute"
            >
              Ficha rápida
            </h2>
            <dl className="mt-4 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              {FICHA.map((fila) => (
                <div key={fila.dato}>
                  <dt className="font-semibold text-ink">{fila.dato}</dt>
                  <dd className="mt-1 leading-relaxed text-mute">
                    {fila.detalle}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <nav
            aria-label="Secciones de preguntas frecuentes"
            className="mt-8 rounded-[26px] border border-line bg-paper p-5"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
              En esta página
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {SECCIONES.map((seccion) => (
                <li key={seccion.id}>
                  <a
                    href={`#${seccion.id}`}
                    className="font-medium text-ink underline underline-offset-4"
                  >
                    {seccion.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {SECCIONES.map((seccion) => (
            <section
              key={seccion.id}
              id={seccion.id}
              aria-labelledby={`${seccion.id}-titulo`}
              className="mt-14 scroll-mt-24"
            >
              <h2
                id={`${seccion.id}-titulo`}
                className="text-2xl font-bold tracking-tight text-ink"
              >
                {seccion.titulo}
              </h2>
              <p className="mt-3 max-w-[62ch] leading-relaxed text-mute">
                {seccion.resumen}
              </p>

              {seccion.pasos ? (
                <ol className="mt-5 max-w-[62ch] list-decimal space-y-2 pl-5 leading-relaxed text-mute">
                  {seccion.pasos.map((paso) => (
                    <li key={paso}>{paso}</li>
                  ))}
                </ol>
              ) : null}

              {seccion.id === "horarios" ? <TablaHorarios /> : null}
              {seccion.id === "precios" ? (
                <>
                  <TablaPrecios />
                  <p className="mt-3 text-sm leading-relaxed text-mute">
                    Precios publicados desde el {PRECIOS_DESDE}, en moneda local
                    y calculados desde la configuración de precios del sitio.
                    Para confirmar el valor vigente y la forma de pago, escribe
                    por WhatsApp.
                  </p>
                </>
              ) : null}
              {seccion.id === "pagos" ? (
                <>
                  <TablaPagos />
                  <p className="mt-3 text-sm leading-relaxed text-mute">
                    En todos los países, los cursos se pueden pagar en 3 cuotas
                    sin interés.
                  </p>
                </>
              ) : null}

              <div className="mt-6 divide-y divide-line border-y border-line">
                {seccion.items.map((item) => (
                  <article
                    key={item.id}
                    id={item.id}
                    className="scroll-mt-24 py-5"
                  >
                    <h3 className="text-lg font-semibold text-ink">
                      {item.pregunta}
                    </h3>
                    <p className="mt-2 max-w-[62ch] leading-relaxed text-mute">
                      {item.respuesta}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section
            aria-labelledby="guias-relacionadas"
            className="mt-14 border-t border-line pt-8"
          >
            <h2
              id="guias-relacionadas"
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute"
            >
              Guías relacionadas
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {GUIAS_RELACIONADAS.map((guia) => (
                <li key={guia.href}>
                  <Link
                    href={guia.href}
                    className="font-medium text-ink underline underline-offset-4"
                  >
                    {guia.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href="/cursos"
                className="font-medium text-ink underline underline-offset-4"
              >
                Catálogo de cursos
              </Link>
              <Link
                href="/precios"
                className="font-medium text-ink underline underline-offset-4"
              >
                Precios por país
              </Link>
              <Link
                href="/guias"
                className="font-medium text-ink underline underline-offset-4"
              >
                Todas las guías
              </Link>
            </div>
          </section>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cursos"
              className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
            >
              Ver todos los cursos
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink no-underline hover:bg-wash"
            >
              Escribir por WhatsApp
            </a>
          </div>

          <p className="mt-8 rounded-[26px] border border-line bg-paper p-5 text-sm leading-relaxed text-mute">
            Formas de pago: los cursos de ProgramBI se pueden pagar en 3 cuotas
            sin interés, en todos los países.
          </p>
        </div>
      </main>
    </>
  );
}
