import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Clock,
  ExternalLink,
  MessageCircle,
  Minus,
} from "lucide-react";
import { PRECIOS_VALID_FROM } from "@/config/pricing";
import { ISO_CHILE, getPais } from "@/config/paises";
import type { ComparativaAcademia as ContenidoComparativa, PaisComparativa } from "@/lib/data/comparativas";
import { ACTUALIZADO, ACTUALIZADO_TEXTO } from "@/lib/data/comparativas";
import { formatMoneda } from "@/lib/paises/precios";
import { absoluteUrl, jsonLdString, SITE_URL } from "@/lib/seo";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import PlantillaDescarga from "@/components/marketing/PlantillaDescarga";
import CalculadoraPrecioHora, { type OpcionCalculadora } from "./CalculadoraPrecioHora";
import ComparativaCta from "./ComparativaCta";
import ComparativaTracker from "./ComparativaTracker";

type Variante = { iso: PaisComparativa; nombre: string; ruta: string };

function valorCelda(valor: string) {
  if (valor === "✓") {
    return (
      <span className="inline-flex items-center text-emerald-700">
        <Check size={16} strokeWidth={3} aria-hidden />
        <span className="sr-only">Sí</span>
      </span>
    );
  }
  if (valor === "—") {
    return (
      <span className="inline-flex items-center text-faint">
        <Minus size={16} aria-hidden />
        <span className="sr-only">No</span>
      </span>
    );
  }
  return valor;
}

function precioHoraTexto(iso: string, precio: number | null, horas: number | null): string {
  if (precio == null || horas == null || horas <= 0) return "—";
  return formatMoneda(iso, Math.round(precio / horas));
}

export default function ComparativaAcademia({
  contenido,
  iso,
  variantes,
}: {
  contenido: ContenidoComparativa;
  iso: PaisComparativa;
  variantes?: Variante[];
}) {
  const pais = getPais(iso);
  const lugar = iso === ISO_CHILE ? "Chile" : pais.nombre;
  const canonical = absoluteUrl(contenido.ruta);
  const fechaJsonLd = `${ACTUALIZADO}T12:00:00-03:00`;
  const courseUrl = absoluteUrl(contenido.rutaCurso);

  const progPrecio = contenido.precioProgrambi;
  const progLista = contenido.precioListaProgrambi;
  const progPrecioTexto =
    progPrecio != null
      ? `${formatMoneda(iso, progPrecio)}${progLista != null ? ` (lista ${formatMoneda(iso, progLista)})` : ""}`
      : "Consultar por WhatsApp";
  const progHora = precioHoraTexto(iso, progPrecio, contenido.horasProgrambi);
  const rivalHora = precioHoraTexto(iso, contenido.precioRival, contenido.horasRival);

  const rivalPrecioResumen =
    contenido.precioRival != null
      ? formatMoneda(iso, contenido.precioRival)
      : contenido.rival === "Platzi"
        ? "Suscripción"
        : contenido.rival === "Desafío Latam"
          ? "Vía asesor"
          : "US$197";

  const opcionesCalculadora: OpcionCalculadora[] = [];
  if (progPrecio != null) {
    opcionesCalculadora.push({
      nombre: "ProgramBI",
      precio: progPrecio,
      horas: contenido.horasProgrambi,
      destacada: true,
    });
  }
  if (contenido.precioRival != null && contenido.horasRival != null) {
    opcionesCalculadora.push({
      nombre: contenido.rival,
      precio: contenido.precioRival,
      horas: contenido.horasRival,
    });
  }

  const inicioRuta = iso === ISO_CHILE ? "/" : `/${iso}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: contenido.h1,
        description: contenido.seoDescription,
        inLanguage: contenido.idioma,
        dateModified: fechaJsonLd,
        datePublished: fechaJsonLd,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: [
          { "@type": "Thing", name: "Power BI" },
          { "@type": "Thing", name: contenido.rival },
        ],
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
        mainEntity: { "@id": `${canonical}#itemlist` },
      },
      {
        "@type": "ItemList",
        "@id": `${canonical}#itemlist`,
        name: `Opciones comparadas: ${contenido.rival} y ProgramBI`,
        numberOfItems: 2,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ProgramBI · curso de Power BI en vivo",
            url: courseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: contenido.rival,
            url: contenido.rivalUrl,
          },
        ],
      },
      {
        "@type": "Course",
        "@id": `${courseUrl}#course`,
        name: "Power BI en vivo",
        description:
          "Curso de Power BI en vivo por Zoom, con grabaciones, proyecto guiado y certificado de ProgramBI.",
        provider: { "@type": "Organization", name: "ProgramBI", url: SITE_URL },
        url: courseUrl,
        ...(progPrecio != null
          ? {
              offers: {
                "@type": "Offer",
                price: progPrecio,
                priceCurrency: contenido.moneda,
                url: courseUrl,
                availability: "https://schema.org/InStock",
                validFrom: PRECIOS_VALID_FROM,
                category: "Paid",
              },
            }
          : {}),
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: contenido.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: absoluteUrl(inicioRuta),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Comparativas",
            item: absoluteUrl("/versus"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: contenido.h1,
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <article className="bg-canvas px-4 pb-28 pt-10 sm:px-6 lg:px-8 lg:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <ComparativaTracker rival={contenido.rival} country={iso} />

      <div className="mx-auto max-w-[1120px]">
        <nav aria-label="Migas de pan" className="text-xs text-mute">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href={inicioRuta} className="no-underline hover:text-ink">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/versus" className="no-underline hover:text-ink">
                Comparativas
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink">ProgramBI vs {contenido.rival}</li>
          </ol>
        </nav>

        <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-full bg-wash px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
              Comparativa · {contenido.rival}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              {contenido.h1}
            </h1>
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-mute sm:text-lg">
              {contenido.subtitulo}
            </p>
            <p className="mt-3 text-xs text-faint">
              Actualizado: {ACTUALIZADO_TEXTO} · precios revisados en las URLs citadas
            </p>
            <p className="mt-2 text-xs leading-relaxed text-faint">
              Esta comparativa la hace ProgramBI. Incluimos a la competencia y decimos dónde gana.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <ComparativaCta
                href={contenido.rutaCurso}
                label={`hero:${contenido.slug}`}
                rival={contenido.rival}
                country={iso}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline transition-transform active:scale-[0.99]"
              >
                {contenido.ctaPrimario}
                <ArrowRight size={15} aria-hidden />
              </ComparativaCta>
              <WhatsAppCta
                page={contenido.ruta}
                intent="general"
                course="Power BI"
                courseSlug="power-bi"
                country={iso}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong bg-canvas px-5 text-sm font-semibold text-ink no-underline hover:bg-wash"
              >
                <MessageCircle size={15} aria-hidden />
                Hablar por WhatsApp
              </WhatsAppCta>
            </div>

            {variantes && variantes.length > 1 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-mute">
                <span>También en:</span>
                {variantes
                  .filter((variante) => variante.iso !== iso)
                  .map((variante) => (
                    <Link
                      key={variante.iso}
                      href={variante.ruta}
                      className="rounded-full border border-line bg-paper px-3 py-1 font-medium text-ink no-underline hover:border-ink/30"
                    >
                      {variante.nombre}
                    </Link>
                  ))}
              </div>
            ) : null}
          </div>

          <aside className="overflow-hidden rounded-[26px] border border-line-strong bg-paper">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-line px-5 py-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
                Resumen en 10 segundos
              </h2>
              <p className="text-xs text-faint">{lugar}</p>
            </div>

            <div className="grid grid-cols-[1.05fr_1fr_1fr] text-sm">
              <div className="px-4 py-3" />
              <div className="border-l border-line bg-wash/70 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-ink">
                ProgramBI
              </div>
              <div className="border-l border-line px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-mute">
                {contenido.rival}
              </div>

              <div className="border-t border-line px-4 py-3 text-xs font-semibold text-mute">Horas en vivo</div>
              <div className="border-l border-t border-line bg-wash/70 px-4 py-3 font-bold text-ink">
                {contenido.horasProgrambi} h
              </div>
              <div className="border-l border-t border-line px-4 py-3 text-mute">
                {contenido.horasRival != null ? `≈${contenido.horasRival} h` : "Sin horas fijas"}
              </div>

              <div className="border-t border-line px-4 py-3 text-xs font-semibold text-mute">Precio</div>
              <div className="border-l border-t border-line bg-wash/70 px-4 py-3 font-bold text-ink">
                {progPrecio != null ? formatMoneda(iso, progPrecio) : "Consultar"}
              </div>
              <div className="border-l border-t border-line px-4 py-3 text-mute">{rivalPrecioResumen}</div>

              <div className="border-t border-line px-4 py-3 text-xs font-semibold text-mute">Precio/hora</div>
              <div className="border-l border-t border-line bg-wash/70 px-4 py-3 font-bold text-ink">{progHora}</div>
              <div className="border-l border-t border-line px-4 py-3 text-mute">{rivalHora}</div>
            </div>

            <p className="border-t border-line px-5 py-3 text-[11px] leading-relaxed text-faint">
              {progLista != null ? `ProgramBI: ${progPrecioTexto}. ` : null}
              {contenido.precioRivalNota ??
                "Los precios del rival son los publicados en su sitio y pueden cambiar."}
            </p>
          </aside>
        </section>

        <section className="mt-10 max-w-[76ch]">
          <p className="text-base leading-relaxed text-mute">{contenido.intro}</p>
        </section>

        <section aria-labelledby="tabla-comparativa" className="mt-12">
          <h2 id="tabla-comparativa" className="text-2xl font-bold tracking-tight text-ink">
            Comparación criterio por criterio
          </h2>
          <p className="mt-2 text-sm text-mute">
            La columna de ProgramBI va destacada. Cada fila indica de dónde salió el dato.
          </p>

          <div className="mt-5 hidden rounded-2xl border border-line-strong sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparación entre ProgramBI y {contenido.rival}
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-[72px] z-10 border-b border-line bg-paper px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-mute"
                  >
                    Criterio
                  </th>
                  <th
                    scope="col"
                    className="sticky top-[72px] z-10 border-b border-line bg-ink px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-canvas"
                  >
                    ProgramBI
                  </th>
                  <th
                    scope="col"
                    className="sticky top-[72px] z-10 border-b border-line bg-paper px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-mute"
                  >
                    {contenido.rival}
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
                {contenido.filas.map((fila) => (
                  <tr key={fila.criterio} className="align-top">
                    <th
                      scope="row"
                      className="border-b border-line px-4 py-3 text-sm font-semibold text-ink"
                    >
                      {fila.criterio}
                    </th>
                    <td className="border-b border-line bg-wash/60 px-4 py-3 font-medium text-ink">
                      {valorCelda(fila.programbi)}
                    </td>
                    <td className="border-b border-line px-4 py-3 text-mute">{valorCelda(fila.rival)}</td>
                    <td className="border-b border-line px-4 py-3 text-xs leading-relaxed text-faint">
                      {fila.fuenteUrl ? (
                        <a
                          href={fila.fuenteUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="underline decoration-line-strong underline-offset-2 hover:text-ink"
                        >
                          {fila.fuente}
                        </a>
                      ) : (
                        fila.fuente
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-5 space-y-3 sm:hidden">
            {contenido.filas.map((fila) => (
              <li key={fila.criterio} className="rounded-2xl border border-line bg-paper p-4">
                <p className="text-sm font-bold text-ink">{fila.criterio}</p>
                <dl className="mt-2 space-y-2 text-sm">
                  <div className="flex gap-3 rounded-xl bg-wash/70 px-3 py-2">
                    <dt className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-wide text-ink">
                      ProgramBI
                    </dt>
                    <dd className="font-medium text-ink">{valorCelda(fila.programbi)}</dd>
                  </div>
                  <div className="flex gap-3 px-3 py-1">
                    <dt className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-faint">
                      {contenido.rival}
                    </dt>
                    <dd className="text-mute">{valorCelda(fila.rival)}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-[11px] leading-relaxed text-faint">
                  Fuente:{" "}
                  {fila.fuenteUrl ? (
                    <a
                      href={fila.fuenteUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="underline decoration-line-strong underline-offset-2 hover:text-ink"
                    >
                      {fila.fuente}
                    </a>
                  ) : (
                    fila.fuente
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-mute">
              Elige {contenido.rival} si…
            </h2>
            <ul className="mt-4 space-y-3 pl-0 text-sm leading-relaxed text-mute">
              {contenido.ganaRival.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-mute" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line-strong bg-wash/60 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink">Elige ProgramBI si…</h2>
            <ul className="mt-4 space-y-3 pl-0 text-sm leading-relaxed text-ink">
              {contenido.ganaProgrambi.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <BadgeCheck size={16} className="mt-0.5 shrink-0 text-ink" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {opcionesCalculadora.length > 0 ? (
          <CalculadoraPrecioHora
            opciones={opcionesCalculadora}
            iso={iso}
            nota={contenido.notaCalculadora}
          />
        ) : null}

        <section aria-labelledby="faq-comparativa" className="mt-12 border-t border-line pt-8">
          <h2 id="faq-comparativa" className="text-2xl font-bold tracking-tight text-ink">
            Preguntas frecuentes
          </h2>
          <dl className="mt-6 space-y-5">
            {contenido.faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-line bg-paper px-4 py-3">
                <dt className="text-sm font-semibold text-ink">{faq.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-mute">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="fuentes-comparativa" className="mt-10 rounded-2xl border border-line bg-paper p-5">
          <h2 id="fuentes-comparativa" className="text-lg font-bold tracking-tight text-ink">
            Fuentes y fecha de revisión
          </h2>
          <p className="mt-2 text-xs text-mute">
            Actualizado: {ACTUALIZADO_TEXTO} · precios revisados en las URLs citadas. Los precios
            promocionales de terceros cambian; revisa la fuente antes de inscribirte.
          </p>
          <ul className="mt-4 space-y-2 pl-0 text-sm">
            {contenido.fuentes.map((fuente) => (
              <li key={fuente.url} className="flex items-start gap-2">
                <ExternalLink size={14} className="mt-0.5 shrink-0 text-faint" aria-hidden />
                <a
                  href={fuente.url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-ink underline decoration-line-strong underline-offset-2 hover:text-mute"
                >
                  {fuente.etiqueta}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav aria-labelledby="sigue-comparativa" className="mt-10">
          <h2 id="sigue-comparativa" className="text-lg font-bold tracking-tight text-ink">
            Sigue explorando
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <li>
              <Link
                href={contenido.rutaCurso}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-ink no-underline hover:border-ink/25"
              >
                Ficha del curso de Power BI
                <ArrowUpRight size={15} aria-hidden />
              </Link>
            </li>
            <li>
              <Link
                href={contenido.rutaPrecios}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-ink no-underline hover:border-ink/25"
              >
                Precios de los cursos
                <ArrowUpRight size={15} aria-hidden />
              </Link>
            </li>
            <li>
              <Link
                href={contenido.rutaGuiaPais}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-ink no-underline hover:border-ink/25"
              >
                Guía de Power BI en {lugar}
                <ArrowUpRight size={15} aria-hidden />
              </Link>
            </li>
            <li>
              <Link
                href="/versus"
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-ink no-underline hover:border-ink/25"
              >
                Todas las comparativas
                <ArrowUpRight size={15} aria-hidden />
              </Link>
            </li>
          </ul>
        </nav>

        <section className="mt-12 rounded-[26px] bg-ink px-6 py-8 text-canvas sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-canvas/70">
            Próxima cohorte
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Aprende Power BI en vivo, con profe y proyecto
          </h2>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-canvas/80">
            {contenido.horasProgrambi} horas en vivo, grabaciones, certificado y un tablero propio al
            terminar. {progPrecio != null ? `Precio: ${progPrecioTexto}.` : "Consulta el valor por WhatsApp."}
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <ComparativaCta
              href={contenido.rutaCurso}
              label={`cierre:${contenido.slug}`}
              rival={contenido.rival}
              country={iso}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-canvas px-5 text-sm font-semibold text-ink no-underline transition-transform active:scale-[0.99]"
            >
              Reservar mi cupo
              <ArrowRight size={15} aria-hidden />
            </ComparativaCta>
            <WhatsAppCta
              page={contenido.ruta}
              intent="general"
              course="Power BI"
              courseSlug="power-bi"
              country={iso}
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
              Una plantilla de práctica para seguir los ejemplos de esta comparativa. Solo necesitas
              tu email.
            </p>
            <div className="mt-3">
              <PlantillaDescarga
                pais={iso}
                location={`comparativa:${contenido.slug}`}
                label="Descargar la plantilla CSV"
              />
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
