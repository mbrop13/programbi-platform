import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { jsonLdString } from "@/lib/seo";
import { faqJsonLd } from "@/lib/faq/jsonld";
import { CUOTAS_SIN_INTERES } from "@/config/cuotas";
import type { FaqContenido as Contenido, FaqSeccion } from "@/lib/faq/contenido";

/**
 * Render de la página de preguntas frecuentes para Chile y para cada país.
 *
 * - Un solo H1, secciones en H2 y cada pregunta en H3 dentro de un <details>
 *   nativo: el acordeón funciona sin JavaScript y el ancla de cada pregunta
 *   apunta al propio <details>, que queda abierto por defecto para que el
 *   enlace directo muestre la respuesta.
 * - El FAQPage se arma con el texto exacto que se muestra en pantalla.
 */
export default function FaqContenido({ contenido }: { contenido: Contenido }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd(contenido)) }}
      />
      <div className="bg-canvas px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[880px]">
          <nav aria-label="Migas de pan" className="text-xs text-mute">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href={contenido.inicioHref} className="no-underline hover:text-ink">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">Preguntas frecuentes</li>
            </ol>
          </nav>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {contenido.h1}
          </h1>

          <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-mute">
            <strong className="font-semibold text-ink">Respuesta corta:</strong>{" "}
            {contenido.intro[0]}
          </p>
          <p className="mt-3 max-w-[62ch] leading-relaxed text-mute">{contenido.intro[1]}</p>
          <p className="mt-3 text-xs text-faint">
            Contenido revisado el {contenido.actualizado}. Los precios se leen de la
            configuración de precios del sitio y los horarios, de la zona horaria de cada país.
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
              {contenido.ficha.map((fila) => (
                <div key={fila.dato}>
                  <dt className="font-semibold text-ink">{fila.dato}</dt>
                  <dd className="mt-1 leading-relaxed text-mute">{fila.detalle}</dd>
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
              {contenido.secciones.map((seccion) => (
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

          {contenido.secciones.map((seccion) => (
            <SeccionFaq key={seccion.id} seccion={seccion} contenido={contenido} />
          ))}

          <section aria-labelledby="guias-relacionadas" className="mt-14 border-t border-line pt-8">
            <h2 id="guias-relacionadas" className="text-lg font-bold tracking-tight text-ink">
              Guías relacionadas
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {contenido.guias.map((guia) => (
                <li key={guia.href}>
                  <Link
                    href={guia.href}
                    className="font-medium text-ink underline underline-offset-4"
                  >
                    {guia.texto}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link
                href={`${contenido.inicioHref === "/" ? "" : contenido.inicioHref}/cursos`}
                className="font-medium text-ink underline underline-offset-4"
              >
                Catálogo de cursos
              </Link>
              <Link
                href={`${contenido.inicioHref === "/" ? "" : contenido.inicioHref}/precios`}
                className="font-medium text-ink underline underline-offset-4"
              >
                Precios por país
              </Link>
            </div>
          </section>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`${contenido.inicioHref === "/" ? "" : contenido.inicioHref}/cursos`}
              className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline"
            >
              Ver todos los cursos
            </Link>
            <a
              href={contenido.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink no-underline hover:bg-wash"
            >
              Escribir por WhatsApp
            </a>
          </div>

          <p className="mt-8 rounded-[26px] border border-line bg-paper p-5 text-sm leading-relaxed text-mute">
            Formas de pago: los cursos de ProgramBI se pueden pagar en{" "}
            {CUOTAS_SIN_INTERES} cuotas sin interés, en todos los países.
          </p>
        </div>
      </div>
    </>
  );
}

function SeccionFaq({
  seccion,
  contenido,
}: {
  seccion: FaqSeccion;
  contenido: Contenido;
}) {
  return (
    <section
      id={seccion.id}
      aria-labelledby={`${seccion.id}-titulo`}
      className="mt-14 scroll-mt-24"
    >
      <h2 id={`${seccion.id}-titulo`} className="text-2xl font-bold tracking-tight text-ink">
        {seccion.titulo}
      </h2>
      <p className="mt-3 max-w-[62ch] leading-relaxed text-mute">{seccion.resumen}</p>

      {seccion.pasos ? (
        <ol className="mt-5 max-w-[62ch] list-decimal space-y-2 pl-5 leading-relaxed text-mute">
          {seccion.pasos.map((paso) => (
            <li key={paso}>{paso}</li>
          ))}
        </ol>
      ) : null}

      {seccion.tabla === "precios" ? <TablaPrecios contenido={contenido} /> : null}
      {seccion.tabla === "horarios" ? <TablaHorarios contenido={contenido} /> : null}
      {seccion.tabla === "pagos" ? <TablaPagos contenido={contenido} /> : null}

      <div className="mt-6 border-t border-line">
        {seccion.items.map((item) => (
          <details
            key={item.id}
            id={item.id}
            open
            className="group scroll-mt-24 border-b border-line"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <h3 className="text-base font-semibold text-ink sm:text-lg">{item.pregunta}</h3>
              <ChevronDown
                aria-hidden
                className="mt-1 h-4 w-4 shrink-0 text-mute transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="max-w-[62ch] pb-5">
              <p className="leading-relaxed text-mute">{item.respuesta}</p>
              {item.enlace ? (
                <Link
                  href={item.enlace.href}
                  className="mt-2 inline-block text-sm font-medium text-ink underline underline-offset-4"
                >
                  {item.enlace.texto}
                </Link>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function TablaPrecios({ contenido }: { contenido: Contenido }) {
  const { columnas, filas, nota } = contenido.precios;
  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-[26px] border border-line">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Precios de Power BI y Análisis de datos por país, en moneda local
          </caption>
          <thead className="bg-wash text-xs uppercase tracking-wide text-mute">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                País
              </th>
              {columnas.map((columna) => (
                <th key={columna} scope="col" className="px-4 py-3 font-semibold">
                  {columna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-paper">
            {filas.map((fila) => (
              <tr key={fila.iso} className={fila.actual ? "bg-wash" : undefined}>
                <th scope="row" className="px-4 py-3 font-semibold text-ink">
                  {fila.pais}
                  {fila.actual ? (
                    <span className="ml-2 text-[11px] font-medium uppercase tracking-wide text-mute">
                      tu país
                    </span>
                  ) : null}
                </th>
                {fila.celdas.map((celda, indice) => (
                  <td key={columnas[indice] ?? indice} className="whitespace-nowrap px-4 py-3 text-mute">
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-mute">{nota}</p>
    </>
  );
}

function TablaHorarios({ contenido }: { contenido: Contenido }) {
  const { filas, nota } = contenido.horarios;
  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-[26px] border border-line">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <caption className="sr-only">Horario de las clases por país, en hora local</caption>
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
            {filas.map((fila) => (
              <tr key={fila.iso} className={fila.iso === contenido.iso ? "bg-wash" : undefined}>
                <th scope="row" className="px-4 py-3 font-semibold text-ink">
                  {fila.pais}
                </th>
                <td className="px-4 py-3 text-mute">{fila.dias}</td>
                <td className="whitespace-nowrap px-4 py-3 text-mute">{fila.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-mute">{nota}</p>
    </>
  );
}

function TablaPagos({ contenido }: { contenido: Contenido }) {
  const { filas, nota } = contenido.pagos;
  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-[26px] border border-line">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <caption className="sr-only">Medios de pago publicados por país</caption>
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
            {filas.map((fila) => (
              <tr key={fila.iso} className={fila.iso === contenido.iso ? "bg-wash" : undefined}>
                <th scope="row" className="px-4 py-3 align-top font-semibold text-ink">
                  {fila.pais}
                </th>
                <td className="px-4 py-3 text-mute">{fila.medios}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-mute">{nota}</p>
    </>
  );
}
