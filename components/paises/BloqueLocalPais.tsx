import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DatosBloqueLocal } from "@/lib/data/contenido-paises";
import { jsonLdString } from "@/lib/seo";
import { rutaLocal } from "@/lib/paises/rutas";

/** Página que monta el bloque. Cambia el H2 y algunos enlaces. */
export type ContextoBloqueLocal = "hub" | "cursos" | "ficha" | "empresas" | "precios";

type Props = {
  /** ISO del mercado de la ruta. */
  iso: string;
  /** Bloque resuelto por `getBloqueLocal(iso)`. */
  bloque: DatosBloqueLocal;
  contexto?: ContextoBloqueLocal;
  /** Índice de fichas y guías. Se apaga en el hub, que ya tiene `IndicePais`. */
  conEnlaces?: boolean;
  /**
   * FAQ local visible + FAQPage JSON-LD. Se enciende solo en las páginas que
   * no emiten su propia FAQ, para no duplicar el schema en la misma URL.
   */
  conFaq?: boolean;
};

/**
 * Bloque local de país: datos duros del mercado, FAQ y enlaces a todas las
 * fichas y guías publicadas.
 *
 * Es un componente de servidor y no calcula nada: recibe el bloque resuelto
 * por `getBloqueLocal`, que a su vez lee precios, horario, cuotas y medios de
 * pago de la fuente única del repo. Por eso WS8 puede sumar su país solo con
 * datos, sin tocar este archivo ni las páginas.
 */
export default function BloqueLocalPais({
  iso,
  bloque,
  contexto = "cursos",
  conEnlaces = true,
  conFaq = false,
}: Props) {
  const id = `datos-${iso}`;
  const titulo =
    contexto === "ficha" && bloque.curso
      ? `${bloque.curso.title} en ${bloque.nombre}: precio, horario y pagos`
      : bloque.titulo;
  const kicker = contexto === "ficha" ? `Ficha local · ${bloque.nombre}` : `Datos de ${bloque.nombre}`;

  const faqJsonLd = conFaq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: bloque.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }
    : null;

  return (
    <section
      id={id}
      data-testid="bloque-local-pais"
      aria-labelledby={`${id}-titulo`}
      className="cv-auto border-t border-line bg-wash/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd) }}
        />
      ) : null}

      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">{kicker}</p>
        <h2
          id={`${id}-titulo`}
          className="mt-3 max-w-[30ch] text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          {titulo}
        </h2>

        <div className="mt-4 max-w-[72ch] space-y-3 text-sm leading-relaxed text-mute sm:text-base">
          {bloque.parrafos.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
          {contexto === "empresas" ? <p>{bloque.empresas}</p> : null}
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bloque.hechos.map((hecho) => (
            <div
              key={hecho.clave}
              className="rounded-2xl border border-line bg-paper p-5"
              data-hecho={hecho.clave}
            >
              <dt className="text-[11px] font-bold uppercase tracking-widest text-mute">
                {hecho.etiqueta}
              </dt>
              <dd className="mt-2 text-lg font-bold tracking-tight text-ink tabular-nums">
                {hecho.valor}
              </dd>
              <dd className="mt-2 text-xs leading-relaxed text-mute">{hecho.detalle}</dd>
            </div>
          ))}
        </dl>

        {conFaq && bloque.faqs.length > 0 ? (
          <div className="mt-12" data-testid="bloque-local-faq">
            <h3 className="text-lg font-bold tracking-tight text-ink">
              Preguntas frecuentes en {bloque.nombre}
            </h3>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {bloque.faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                    <span className="text-sm font-semibold leading-snug text-ink sm:text-base">
                      {faq.q}
                    </span>
                    <span className="text-xl leading-none text-faint group-open:hidden">+</span>
                    <span className="hidden text-xl leading-none text-faint group-open:block">–</span>
                  </summary>
                  <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-mute">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        ) : null}

        {conEnlaces ? (
          <div className="mt-12 grid gap-10 border-t border-line pt-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-ink">
                {contexto === "ficha" ? `Otras fichas de ${bloque.nombre}` : `Fichas de curso en ${bloque.nombre}`}
              </h3>
              <ul className="mt-4 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {bloque.fichas.map((ficha) => (
                  <li key={ficha.href}>
                    <Link
                      href={ficha.href}
                      className="text-sm leading-snug text-ink no-underline underline-offset-4 hover:text-mute hover:underline"
                    >
                      {ficha.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={rutaLocal(iso, "/cursos")}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
              >
                Ver el catálogo de {bloque.nombre}
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-bold tracking-tight text-ink">
                Guías de {bloque.nombre}
              </h3>
              {bloque.guias.length > 0 ? (
                <ul className="mt-4 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  {bloque.guias.map((guia) => (
                    <li key={guia.href}>
                      <Link
                        href={guia.href}
                        className="text-sm leading-snug text-ink no-underline underline-offset-4 hover:text-mute hover:underline"
                      >
                        {guia.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-mute">
                  Todavía no hay guías publicadas para {bloque.nombre}.
                </p>
              )}
              <Link
                href={bloque.indiceGuias}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
              >
                Índice de guías de {bloque.nombre}
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
