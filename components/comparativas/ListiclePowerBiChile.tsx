import Link from "next/link";
import { ArrowUpRight, Check, Clock, ExternalLink, MessageCircle } from "lucide-react";
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
import {
  GuiaBreadcrumbs,
  GuiaFaqList,
  GuiaScope,
} from "@/components/guias/GuiaEditorialPrimitives";
import ComparativaCta from "./ComparativaCta";
import { TEXTO_PRECIO_PROGRAMBI, sinMontosProgrambi } from "@/lib/comparativas/precios";
import { sinMontosDeCurso } from "@/lib/guias/precio";

export default function ListiclePowerBiChile() {
  const opciones = opcionesListiclePowerBiChile();
  const faqs = faqsListiclePowerBiChile();
  const programbi = opciones.find((opcion) => opcion.destacada);

  /** ProgramBI no publica arancel: se muestra la referencia al brochure. */
  const precioOpcion = (opcion: { precio: string; destacada?: boolean }) =>
    opcion.destacada ? sinMontosProgrambi(opcion.precio) : opcion.precio;

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
          acceptedAnswer: { "@type": "Answer", text: sinMontosDeCurso(faq.a) },
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
    <GuiaScope>
      <article className="px-4 pb-28 pt-10 sm:px-6 lg:px-8 lg:pb-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />

        <div className="mx-auto max-w-[1120px]">
          <GuiaBreadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Guías", href: "/guias" },
              { label: "Mejores cursos de Power BI en Chile 2026" },
            ]}
          />

          <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start">
            <div className="min-w-0">
              <h1 className="text-[clamp(1.85rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--g-ink)]">
                Los mejores cursos de Power BI en Chile (2026), comparados con datos.
              </h1>
              <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-[var(--g-muted)] sm:text-lg">
                Revisamos precio, horas en vivo, formato y certificado de {opciones.length} opciones que
                pudimos verificar. Sí, incluimos a la competencia.
              </p>
              <p className="mt-3 text-xs tabular-nums text-[var(--g-subtle)]">
                Guía comparativa · Chile 2026 · Actualizado:{" "}
                <time dateTime="2026-11-04">{ACTUALIZADO_TEXTO}</time> · revisión cada {REVISION_DIAS} días
              </p>
              <div className="mt-4 rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--g-ink)]">
                <strong>Divulgación:</strong> esta guía la hace ProgramBI. Incluimos a competidores
                directos y decimos dónde pueden convenir más. Los precios son los publicados por cada
                institución; no inventamos cifras.
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Link
                  href="#tabla-listicle"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--g-accent)] px-5 text-sm font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95"
                >
                  Ver tabla comparativa
                </Link>
                <WhatsAppCta
                  page={RUTA_LISTICLE}
                  intent="general"
                  course="Power BI"
                  courseSlug="power-bi"
                  country="cl"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-surface)] px-5 text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
                >
                  <MessageCircle size={15} aria-hidden />
                  Hablar por WhatsApp
                </WhatsAppCta>
              </div>
            </div>

            <aside className="overflow-hidden rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-surface)]">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-[var(--g-border)] px-5 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
                  Resumen en 10 segundos
                </h2>
                <p className="text-xs tabular-nums text-[var(--g-subtle)]">{opciones.length} opciones</p>
              </div>
              <dl className="divide-y divide-[var(--g-border)] tabular-nums">
                <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                  <dt className="text-xs font-semibold text-[var(--g-muted)]">Curso de ProgramBI</dt>
                  <dd className="text-base font-bold tracking-tight text-[var(--g-ink)]">
                    {sinMontosProgrambi(programbi?.precio ?? "Consultar")}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                  <dt className="text-xs font-semibold text-[var(--g-muted)]">Horas en vivo</dt>
                  <dd className="text-base font-bold tracking-tight text-[var(--g-ink)]">20 h</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                  <dt className="text-xs font-semibold text-[var(--g-muted)]">Precio por hora</dt>
                  <dd className="text-base font-bold tracking-tight text-[var(--g-ink)]">
                    {TEXTO_PRECIO_PROGRAMBI}
                  </dd>
                </div>
              </dl>
              <p className="border-t border-[var(--g-border)] px-5 py-3 text-xs leading-relaxed text-[var(--g-subtle)]">
                La tabla completa incluye Coderhouse, Crenn, Qualitymas, Platzi e IPS DATAX, además de
                ProgramBI.
              </p>
            </aside>
          </section>

          <section
            aria-labelledby="metodologia"
            className="mt-10 rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5"
          >
            <h2 id="metodologia" className="text-lg font-bold tracking-tight text-[var(--g-ink)]">
              Cómo comparamos
            </h2>
            <ul className="mt-3 grid gap-2 pl-0 text-sm leading-relaxed text-[var(--g-muted)] sm:grid-cols-2">
              <li className="flex gap-2">
                <Check size={15} className="mt-0.5 shrink-0 text-[var(--g-accent)]" aria-hidden />
                Precio publicado en la URL oficial de cada curso.
              </li>
              <li className="flex gap-2">
                <Check size={15} className="mt-0.5 shrink-0 text-[var(--g-accent)]" aria-hidden />
                Horas en vivo y modalidad declaradas por cada institución.
              </li>
              <li className="flex gap-2">
                <Check size={15} className="mt-0.5 shrink-0 text-[var(--g-accent)]" aria-hidden />
                Certificado y código SENCE cuando la página lo indica.
              </li>
              <li className="flex gap-2">
                <Check size={15} className="mt-0.5 shrink-0 text-[var(--g-accent)]" aria-hidden />
                Dejamos fuera las opciones sin precio o URL viva verificable.
              </li>
              <li className="flex gap-2">
                <Check size={15} className="mt-0.5 shrink-0 text-[var(--g-accent)]" aria-hidden />
                Sin logos ajenos ni rankings inventados. Los empates se dicen.
              </li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed tabular-nums text-[var(--g-subtle)]">
              Revisión: {ACTUALIZADO_TEXTO}. No incluimos universidades ni programas cuyo precio no
              pudiéramos verificar. Los precios promocionales cambian; cada fila enlaza a su fuente.
            </p>
          </section>

          <section aria-labelledby="tabla-listicle" className="mt-12">
            <h2 id="tabla-listicle" className="text-2xl font-bold tracking-tight text-[var(--g-ink)]">
              Cursos de Power BI en Chile, lado a lado
            </h2>
            <p className="mt-2 text-sm text-[var(--g-muted)]">
              La fila de ProgramBI va destacada. No es un ranking: es una tabla para comparar.
            </p>

            <div className="mt-5 hidden overflow-x-auto rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] sm:block">
              <table className="w-full border-collapse text-left text-sm tabular-nums">
                <caption className="sr-only">Cursos de Power BI en Chile 2026</caption>
                <thead>
                  <tr className="bg-[var(--g-wash)]">
                    <th
                      scope="col"
                      className="border-b border-[var(--g-border-strong)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]"
                    >
                      Opción
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--g-border-strong)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]"
                    >
                      Precio
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--g-border-strong)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]"
                    >
                      Horas
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--g-border-strong)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]"
                    >
                      Formato
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--g-border-strong)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]"
                    >
                      Certificado
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--g-border-strong)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--g-subtle)]"
                    >
                      Fuente
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {opciones.map((opcion) => (
                    <tr
                      key={opcion.nombre}
                      className={`align-top ${opcion.destacada ? "bg-[var(--g-accent-soft)]" : ""}`}
                    >
                      <th
                        scope="row"
                        className="border-b border-[var(--g-border)] px-4 py-3 text-sm font-bold text-[var(--g-ink)]"
                      >
                        {opcion.nombre}
                        {opcion.destacada ? (
                          <span className="ml-2 inline-block rounded-md border border-[var(--g-border-strong)] bg-[var(--g-surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--g-accent)]">
                            En vivo
                          </span>
                        ) : null}
                      </th>
                      <td
                        className={`border-b border-[var(--g-border)] px-4 py-3 text-[var(--g-ink)] ${
                          opcion.destacada ? "font-semibold" : ""
                        }`}
                      >
                        {precioOpcion(opcion)}
                        {opcion.precioNota ? (
                          <span className="mt-0.5 block text-xs font-normal text-[var(--g-subtle)]">
                            {opcion.precioNota}
                          </span>
                        ) : null}
                      </td>
                      <td className="border-b border-[var(--g-border)] px-4 py-3 text-[var(--g-muted)]">
                        {opcion.horas}
                      </td>
                      <td className="border-b border-[var(--g-border)] px-4 py-3 text-[var(--g-muted)]">
                        {opcion.formato}
                      </td>
                      <td className="border-b border-[var(--g-border)] px-4 py-3 text-[var(--g-muted)]">
                        {opcion.certificado}
                      </td>
                      <td className="border-b border-[var(--g-border)] px-4 py-3 text-xs leading-relaxed text-[var(--g-subtle)]">
                        <a
                          href={opcion.fuenteUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-2 hover:decoration-[var(--g-accent)]"
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
                  className={`rounded-xl border p-4 ${
                    opcion.destacada
                      ? "border-[var(--g-border-strong)] bg-[var(--g-accent-soft)]"
                      : "border-[var(--g-border)] bg-[var(--g-surface)]"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-sm font-bold text-[var(--g-ink)]">{opcion.nombre}</h3>
                    <p className="text-sm font-bold tabular-nums text-[var(--g-ink)]">
                      {precioOpcion(opcion)}
                    </p>
                  </div>
                  {opcion.precioNota ? (
                    <p className="mt-0.5 text-xs text-[var(--g-subtle)]">{opcion.precioNota}</p>
                  ) : null}
                  <dl className="mt-3 space-y-1.5 text-xs tabular-nums">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 font-semibold text-[var(--g-subtle)]">Horas</dt>
                      <dd className="text-[var(--g-muted)]">{opcion.horas}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 font-semibold text-[var(--g-subtle)]">Formato</dt>
                      <dd className="text-[var(--g-muted)]">{opcion.formato}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 font-semibold text-[var(--g-subtle)]">Certificado</dt>
                      <dd className="text-[var(--g-muted)]">{opcion.certificado}</dd>
                    </div>
                  </dl>
                  <a
                    href={opcion.fuenteUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-xs font-medium text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-2"
                  >
                    Fuente: {opcion.fuente}
                    <ExternalLink size={12} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--g-ink)]">
              Cómo elegir según tu caso
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5">
                <p className="text-sm font-bold text-[var(--g-ink)]">Si tu prioridad es el precio</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--g-muted)]">
                  Crenn ofrece 16 h en vivo por $60.000, con máximo 8 personas. Revisa que cumplas el
                  requisito de nivel básico.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5">
                <p className="text-sm font-bold text-[var(--g-ink)]">Si quieres amplitud y ritmo propio</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--g-muted)]">
                  Platzi es una suscripción en dólares con cursos grabados de varias escuelas. Sirve si
                  vas a explorar varios temas, no solo Power BI.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-accent-soft)] p-5">
                <p className="text-sm font-bold text-[var(--g-ink)]">Si quieres un curso en vivo con proyecto</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--g-ink)]">
                  ProgramBI tiene 20 h en vivo, grabaciones, certificado y un tablero propio al
                  terminar. Precio publicado: {sinMontosProgrambi(programbi?.precio ?? "consultar")}.
                </p>
              </div>
            </div>
          </section>

          <div id="faq-listicle" className="mt-12 border-t border-[var(--g-border)] pt-8">
            <GuiaFaqList
              heading="Preguntas frecuentes"
              items={faqs.map((faq, idx) => ({
                id: `faq-listicle-${idx}`,
                question: faq.q,
                answer: sinMontosDeCurso(faq.a),
              }))}
            />
          </div>

          <section
            aria-labelledby="fuentes-listicle"
            className="mt-10 rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5"
          >
            <h2 id="fuentes-listicle" className="text-lg font-bold tracking-tight text-[var(--g-ink)]">
              Fuentes y fecha de revisión
            </h2>
            <p className="mt-2 text-xs tabular-nums text-[var(--g-muted)]">
              Actualizado: <time dateTime="2026-11-04">{ACTUALIZADO_TEXTO}</time>. Cada precio se revisó
              en la URL citada. Si una institución cambia su precio o su promoción, la fecha de revisión
              te dice cuándo verificamos.
            </p>
            <p className="mt-1 text-xs tabular-nums text-[var(--g-subtle)]">
              Revisamos esta guía cada {REVISION_DIAS} días. Próxima revisión prevista:{" "}
              {PROXIMA_REVISION_TEXTO}.
            </p>
            <ul className="mt-4 grid gap-2 pl-0 text-sm sm:grid-cols-2">
              {opciones.map((opcion) => (
                <li key={opcion.fuenteUrl} className="flex items-start gap-2">
                  <ExternalLink size={14} className="mt-1 shrink-0 text-[var(--g-subtle)]" aria-hidden />
                  <a
                    href={opcion.fuenteUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-2 hover:decoration-[var(--g-accent)]"
                  >
                    {opcion.nombre}: {opcion.fuente}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <nav aria-labelledby="sigue-listicle" className="mt-10">
            <h2 id="sigue-listicle" className="text-lg font-bold tracking-tight text-[var(--g-ink)]">
              Sigue explorando
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <li>
                <Link
                  href="/cursos/power-bi"
                  className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] px-4 py-3 text-sm font-medium text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-border-strong)]"
                >
                  Curso de Power BI en vivo
                  <ArrowUpRight size={15} aria-hidden />
                </Link>
              </li>
              <li>
                <Link
                  href="/precios"
                  className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] px-4 py-3 text-sm font-medium text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-border-strong)]"
                >
                  Precios de los cursos
                  <ArrowUpRight size={15} aria-hidden />
                </Link>
              </li>
              <li>
                <Link
                  href="/versus/programbi-vs-coderhouse-power-bi"
                  className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] px-4 py-3 text-sm font-medium text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-border-strong)]"
                >
                  ProgramBI vs Coderhouse
                  <ArrowUpRight size={15} aria-hidden />
                </Link>
              </li>
              <li>
                <Link
                  href="/guias/como-aprender-power-bi-en-chile"
                  className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] px-4 py-3 text-sm font-medium text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-border-strong)]"
                >
                  Guía para aprender Power BI en Chile
                  <ArrowUpRight size={15} aria-hidden />
                </Link>
              </li>
            </ul>
          </nav>

          <section className="mt-12 rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-surface)] px-6 py-8 text-[var(--g-ink)] sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-subtle)]">
              Curso en vivo
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--g-ink)]">
              Si te sirve la opción de ProgramBI, reserva tu cupo
            </h2>
            <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-[var(--g-muted)]">
              20 horas en vivo, dos clases por semana, grabaciones y certificado. Precio:{" "}
              {sinMontosProgrambi(programbi?.precio ?? "consulta por WhatsApp")}.
            </p>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <ComparativaCta
                href="/cursos/power-bi"
                label="listicle:cierre"
                rival="Cursos de Power BI Chile"
                country="cl"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--g-accent)] px-5 text-sm font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95"
              >
                Reservar mi cupo en Power BI
              </ComparativaCta>
              <WhatsAppCta
                page={RUTA_LISTICLE}
                intent="general"
                course="Power BI"
                courseSlug="power-bi"
                country="cl"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-5 text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
              >
                <MessageCircle size={15} aria-hidden />
                Hablar por WhatsApp
              </WhatsAppCta>
            </div>

            <div className="mt-6 rounded-lg border border-[var(--g-border)] bg-[var(--g-bg)] p-4 text-[var(--g-ink)]">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Clock size={15} aria-hidden />
                Bajar plantilla Power BI gratis
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--g-muted)]">
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
    </GuiaScope>
  );
}
