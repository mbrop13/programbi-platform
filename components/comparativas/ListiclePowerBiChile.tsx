import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { PRECIOS_VALID_FROM } from "@/config/pricing";
import {
  ACTUALIZADO_TEXTO,
  PROXIMA_REVISION_TEXTO,
  REVISION_DIAS,
  RUTA_LISTICLE,
  faqsListiclePowerBiChile,
  opcionesListiclePowerBiChile,
} from "@/lib/data/academias";
import { absoluteUrl, jsonLdString, SITE_URL } from "@/lib/seo";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import PlantillaDescarga from "@/components/marketing/PlantillaDescarga";
import ComparativaCta from "./ComparativaCta";
import { sinMontosProgrambi } from "@/lib/comparativas/precios";

export default function ListiclePowerBiChile() {
  const opciones = opcionesListiclePowerBiChile();
  const faqs = faqsListiclePowerBiChile();
  const programbi = opciones.find((opcion) => opcion.destacada);

  const canonical = absoluteUrl(RUTA_LISTICLE);
  const fechaJsonLd = `${"2026-11-04"}T12:00:00-03:00`;
  const courseUrl = absoluteUrl("/cursos/power-bi");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: "Los mejores cursos de Power BI en Chile (2026), comparados con datos",
        description:
          "Revisamos precio, horas en vivo, formato y certificado de 6 cursos de Power BI en Chile. Incluye a la competencia y declara quién hace la guía.",
        inLanguage: "es-CL",
        datePublished: fechaJsonLd,
        dateModified: fechaJsonLd,
        articleSection: "Cursos de Power BI en Chile",
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        author: { "@type": "Organization", name: "ProgramBI", url: SITE_URL },
        publisher: { "@type": "Organization", name: "ProgramBI", url: SITE_URL },
        citation: opciones.map((opcion) => opcion.fuenteUrl),
      },
      {
        "@type": "ItemList",
        "@id": `${canonical}#itemlist`,
        name: "Cursos de Power BI en Chile 2026",
        numberOfItems: opciones.length,
        itemListElement: opciones.map((opcion, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: opcion.nombre,
          url: opcion.fuenteUrl,
        })),
      },
      {
        "@type": "Course",
        "@id": `${courseUrl}#course`,
        name: "Power BI en vivo",
        description:
          "Curso de Power BI en vivo por Zoom, con grabaciones, proyecto guiado y certificado de ProgramBI.",
        provider: { "@type": "Organization", name: "ProgramBI", url: SITE_URL },
        url: courseUrl,
        inLanguage: "es-CL",
        courseMode: "Online",
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Guías", item: absoluteUrl("/guias") },
          {
            "@type": "ListItem",
            position: 3,
            name: "Mejores cursos de Power BI en Chile 2026",
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <article className="bg-canvas px-4 pb-28 pt-10 sm:px-6 lg:px-8 lg:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />

      <div className="mx-auto max-w-[1120px]">
        <nav aria-label="Migas de pan" className="text-xs text-mute">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="no-underline hover:text-ink">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/guias" className="no-underline hover:text-ink">
                Guías
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink">Mejores cursos de Power BI en Chile 2026</li>
          </ol>
        </nav>

        <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-full bg-wash px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
              Guía comparativa · Chile 2026
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              Los mejores cursos de Power BI en Chile (2026), comparados con datos.
            </h1>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-mute sm:text-lg">
              Revisamos precio, horas en vivo, formato y certificado de {opciones.length} opciones que
              pudimos verificar. Sí, incluimos a la competencia.
            </p>
            <p className="mt-3 text-xs text-faint">
              Actualizado: <time dateTime="2026-11-04">{ACTUALIZADO_TEXTO}</time> · precios revisados
              en las URLs citadas · revisión cada {REVISION_DIAS} días
            </p>
            <div className="mt-4 rounded-2xl border border-line-strong bg-wash/70 px-4 py-3 text-sm leading-relaxed text-ink">
              <strong>Divulgación:</strong> esta guía la hace ProgramBI. Incluimos a competidores
              directos y decimos dónde pueden convenir más. Los precios son los publicados por cada
              institución; no inventamos cifras.
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                href="#tabla-listicle"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.99]"
              >
                Ver la tabla
                <ArrowRight size={15} aria-hidden />
              </Link>
              <WhatsAppCta
                page={RUTA_LISTICLE}
                intent="general"
                course="Power BI"
                courseSlug="power-bi"
                country="cl"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong bg-canvas px-5 text-sm font-semibold text-ink no-underline hover:bg-wash"
              >
                <MessageCircle size={15} aria-hidden />
                Hablar por WhatsApp
              </WhatsAppCta>
            </div>
          </div>

          <aside className="overflow-hidden rounded-[26px] border border-line-strong bg-paper">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line px-5 py-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
                Resumen en 10 segundos
              </h2>
              <p className="text-xs text-faint">{opciones.length} opciones</p>
            </div>
            <dl className="divide-y divide-line">
              <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                <dt className="text-xs font-semibold text-mute">Curso de ProgramBI</dt>
                <dd className="text-lg font-bold tracking-tight text-ink">
                  {sinMontosProgrambi(programbi?.precio ?? "Consultar")}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                <dt className="text-xs font-semibold text-mute">Horas en vivo</dt>
                <dd className="text-lg font-bold tracking-tight text-ink">20 h</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                <dt className="text-xs font-semibold text-mute">Precio por hora</dt>
                <dd className="text-lg font-bold tracking-tight text-ink">en el brochure PDF</dd>
              </div>
            </dl>
            <p className="border-t border-line px-5 py-3 text-[11px] leading-relaxed text-faint">
              La tabla completa incluye Coderhouse, Crenn, Qualitymas, Platzi e IPS DATAX, además de
              ProgramBI.
            </p>
          </aside>
        </section>

        <section aria-labelledby="metodologia" className="mt-10 rounded-2xl border border-line bg-paper p-5">
          <h2 id="metodologia" className="text-lg font-bold tracking-tight text-ink">
            Cómo comparamos
          </h2>
          <ul className="mt-3 grid gap-2 pl-0 text-sm leading-relaxed text-mute sm:grid-cols-2">
            <li className="flex gap-2">
              <Check size={15} className="mt-0.5 shrink-0 text-ink" aria-hidden />
              Precio publicado en la URL oficial de cada curso.
            </li>
            <li className="flex gap-2">
              <Check size={15} className="mt-0.5 shrink-0 text-ink" aria-hidden />
              Horas en vivo y modalidad declaradas por cada institución.
            </li>
            <li className="flex gap-2">
              <Check size={15} className="mt-0.5 shrink-0 text-ink" aria-hidden />
              Certificado y código SENCE cuando la página lo indica.
            </li>
            <li className="flex gap-2">
              <Check size={15} className="mt-0.5 shrink-0 text-ink" aria-hidden />
              Dejamos fuera las opciones sin precio o URL viva verificable.
            </li>
            <li className="flex gap-2">
              <Check size={15} className="mt-0.5 shrink-0 text-ink" aria-hidden />
              Sin logos ajenos ni rankings inventados. Los empates se dicen.
            </li>
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-faint">
            Revisión: {ACTUALIZADO_TEXTO}. No incluimos universidades ni programas cuyo precio no
            pudiéramos verificar. Los precios promocionales cambian; cada fila enlaza a su fuente.
          </p>
        </section>

        <section aria-labelledby="tabla-listicle" className="mt-12">
          <h2 id="tabla-listicle" className="text-2xl font-bold tracking-tight text-ink">
            Cursos de Power BI en Chile, lado a lado
          </h2>
          <p className="mt-2 text-sm text-mute">
            La fila de ProgramBI va destacada. No es un ranking: es una tabla para comparar.
          </p>

          <div className="mt-5 hidden rounded-2xl border border-line-strong sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">Cursos de Power BI en Chile 2026</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-[72px] z-10 border-b border-line bg-paper px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-mute"
                  >
                    Opción
                  </th>
                  <th
                    scope="col"
                    className="sticky top-[72px] z-10 border-b border-line bg-paper px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-mute"
                  >
                    Precio
                  </th>
                  <th
                    scope="col"
                    className="sticky top-[72px] z-10 border-b border-line bg-paper px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-mute"
                  >
                    Horas
                  </th>
                  <th
                    scope="col"
                    className="sticky top-[72px] z-10 border-b border-line bg-paper px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-mute"
                  >
                    Formato
                  </th>
                  <th
                    scope="col"
                    className="sticky top-[72px] z-10 border-b border-line bg-paper px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-mute"
                  >
                    Certificado
                  </th>
                  <th
                    scope="col"
                    className="sticky top-[72px] z-10 border-b border-line bg-paper px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-mute"
                  >
                    Fuente
                  </th>
                </tr>
              </thead>
              <tbody>
                {opciones.map((opcion) => (
                  <tr key={opcion.nombre} className="align-top">
                    <th
                      scope="row"
                      className={`border-b border-line px-4 py-3 text-sm font-bold text-ink ${
                        opcion.destacada ? "bg-wash/70" : ""
                      }`}
                    >
                      {opcion.nombre}
                      {opcion.destacada ? (
                        <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-canvas">
                          En vivo
                        </span>
                      ) : null}
                    </th>
                    <td
                      className={`border-b border-line px-4 py-3 text-ink ${
                        opcion.destacada ? "bg-wash/70 font-semibold" : ""
                      }`}
                    >
                      {opcion.precio}
                      {opcion.precioNota ? (
                        <span className="mt-0.5 block text-[11px] font-normal text-faint">
                          {opcion.precioNota}
                        </span>
                      ) : null}
                    </td>
                    <td className={`border-b border-line px-4 py-3 text-mute ${opcion.destacada ? "bg-wash/70" : ""}`}>
                      {opcion.horas}
                    </td>
                    <td className={`border-b border-line px-4 py-3 text-mute ${opcion.destacada ? "bg-wash/70" : ""}`}>
                      {opcion.formato}
                    </td>
                    <td className={`border-b border-line px-4 py-3 text-mute ${opcion.destacada ? "bg-wash/70" : ""}`}>
                      {opcion.certificado}
                    </td>
                    <td className="border-b border-line px-4 py-3 text-xs leading-relaxed text-faint">
                      <a
                        href={opcion.fuenteUrl}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="underline decoration-line-strong underline-offset-2 hover:text-ink"
                      >
                        {opcion.fuente}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-5 space-y-3 sm:hidden">
            {opciones.map((opcion) => (
              <li
                key={opcion.nombre}
                className={`rounded-2xl border p-4 ${
                  opcion.destacada ? "border-ink/25 bg-wash/70" : "border-line bg-paper"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-bold text-ink">{opcion.nombre}</h3>
                  <p className="text-sm font-bold text-ink">{opcion.precio}</p>
                </div>
                {opcion.precioNota ? (
                  <p className="mt-0.5 text-[11px] text-faint">{opcion.precioNota}</p>
                ) : null}
                <dl className="mt-3 space-y-1.5 text-xs">
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-semibold text-mute">Horas</dt>
                    <dd className="text-mute">{opcion.horas}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-semibold text-mute">Formato</dt>
                    <dd className="text-mute">{opcion.formato}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-semibold text-mute">Certificado</dt>
                    <dd className="text-mute">{opcion.certificado}</dd>
                  </div>
                </dl>
                <a
                  href={opcion.fuenteUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[11px] text-faint underline decoration-line-strong underline-offset-2 hover:text-ink"
                >
                  Fuente: {opcion.fuente}
                  <ExternalLink size={11} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-ink">Cómo elegir según tu caso</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-sm font-bold text-ink">Si tu prioridad es el precio</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Crenn ofrece 16 h en vivo por $60.000, con máximo 8 personas. Revisa que cumplas el
                requisito de nivel básico.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-sm font-bold text-ink">Si quieres amplitud y ritmo propio</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Platzi es una suscripción en dólares con cursos grabados de varias escuelas. Sirve si
                vas a explorar varios temas, no solo Power BI.
              </p>
            </div>
            <div className="rounded-2xl border border-line-strong bg-wash/60 p-5">
              <p className="text-sm font-bold text-ink">Si quieres un curso en vivo con proyecto</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                ProgramBI tiene 20 h en vivo, grabaciones, certificado y un tablero propio al
                terminar. Precio publicado: {programbi?.precio ?? "consultar"}.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-listicle" className="mt-12 border-t border-line pt-8">
          <h2 id="faq-listicle" className="text-2xl font-bold tracking-tight text-ink">
            Preguntas frecuentes
          </h2>
          <dl className="mt-6 space-y-5">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-line bg-paper px-4 py-3">
                <dt className="text-sm font-semibold text-ink">{faq.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-mute">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="fuentes-listicle" className="mt-10 rounded-2xl border border-line bg-paper p-5">
          <h2 id="fuentes-listicle" className="text-lg font-bold tracking-tight text-ink">
            Fuentes y fecha de revisión
          </h2>
          <p className="mt-2 text-xs text-mute">
            Actualizado: <time dateTime="2026-11-04">{ACTUALIZADO_TEXTO}</time>. Cada precio se revisó
            en la URL citada. Si una institución cambia su precio o su promoción, la fecha de revisión
            te dice cuándo verificamos.
          </p>
          <p className="mt-1 text-xs text-faint">
            Revisamos esta guía cada {REVISION_DIAS} días. Próxima revisión prevista:{" "}
            {PROXIMA_REVISION_TEXTO}.
          </p>
          <ul className="mt-4 grid gap-2 pl-0 text-sm sm:grid-cols-2">
            {opciones.map((opcion) => (
              <li key={opcion.fuenteUrl} className="flex items-start gap-2">
                <ExternalLink size={14} className="mt-0.5 shrink-0 text-faint" aria-hidden />
                <a
                  href={opcion.fuenteUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-ink underline decoration-line-strong underline-offset-2 hover:text-mute"
                >
                  {opcion.nombre}: {opcion.fuente}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav aria-labelledby="sigue-listicle" className="mt-10">
          <h2 id="sigue-listicle" className="text-lg font-bold tracking-tight text-ink">
            Sigue explorando
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <li>
              <Link
                href="/cursos/power-bi"
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-ink no-underline hover:border-ink/25"
              >
                Curso de Power BI en vivo
                <ArrowUpRight size={15} aria-hidden />
              </Link>
            </li>
            <li>
              <Link
                href="/precios"
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-ink no-underline hover:border-ink/25"
              >
                Precios de los cursos
                <ArrowUpRight size={15} aria-hidden />
              </Link>
            </li>
            <li>
              <Link
                href="/versus/programbi-vs-coderhouse-power-bi"
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-ink no-underline hover:border-ink/25"
              >
                ProgramBI vs Coderhouse
                <ArrowUpRight size={15} aria-hidden />
              </Link>
            </li>
            <li>
              <Link
                href="/guias/como-aprender-power-bi-en-chile"
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-ink no-underline hover:border-ink/25"
              >
                Guía para aprender Power BI en Chile
                <ArrowUpRight size={15} aria-hidden />
              </Link>
            </li>
          </ul>
        </nav>

        <section className="mt-12 rounded-[26px] bg-ink px-6 py-8 text-canvas sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-canvas/70">
            Curso en vivo
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Si te sirve la opción de ProgramBI, reserva tu cupo
          </h2>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-canvas/80">
            20 horas en vivo, dos clases por semana, grabaciones y certificado. Precio:{" "}
            {programbi?.precio ?? "consulta por WhatsApp"}.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <ComparativaCta
              href="/cursos/power-bi"
              label="listicle:cierre"
              rival="Cursos de Power BI Chile"
              country="cl"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-canvas px-5 text-sm font-semibold text-ink no-underline transition-transform active:scale-[0.99]"
            >
              Reservar mi cupo
              <ArrowRight size={15} aria-hidden />
            </ComparativaCta>
            <WhatsAppCta
              page={RUTA_LISTICLE}
              intent="general"
              course="Power BI"
              courseSlug="power-bi"
              country="cl"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-canvas/30 px-5 text-sm font-semibold text-canvas no-underline hover:bg-canvas/10"
            >
              <MessageCircle size={15} aria-hidden />
              Hablar por WhatsApp
            </WhatsAppCta>
          </div>

          <div className="mt-5 rounded-2xl bg-canvas p-4 text-ink">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Clock size={15} aria-hidden />
              Bajar plantilla Power BI gratis
            </p>
            <p className="mt-1 text-xs leading-relaxed text-mute">
              Una plantilla de práctica para probar lo que aprendes. Solo necesitas tu email.
            </p>
            <div className="mt-3">
              <PlantillaDescarga
                pais="cl"
                location="listicle:mejores-cursos-power-bi-chile-2026"
                label="Descargar la plantilla CSV"
              />
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
