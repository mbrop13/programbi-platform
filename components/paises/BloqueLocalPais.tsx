import Link from "next/link";
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
 * por `getBloqueLocal`, que a vez lee precios, horario, cuotas y medios de
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
  const kicker =
    contexto === "ficha" ? `Ficha local · ${bloque.nombre}` : `Datos de ${bloque.nombre}`;

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
      className="home-scope cv-auto border-t border-[var(--h-border)] bg-[var(--h-wash)] py-16 lg:py-20"
    >
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd) }}
        />
      ) : null}

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--h-subtle)]">
          {kicker}
        </p>
        <h2
          id={`${id}-titulo`}
          className="mt-2.5 max-w-[30ch] text-balance text-2xl font-bold tracking-tight text-[var(--h-ink)] sm:text-3xl"
        >
          {titulo}
        </h2>

        <div className="mt-4 max-w-[72ch] space-y-3 text-sm leading-relaxed text-[var(--h-muted)] sm:text-base">
          {bloque.parrafos.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
          {contexto === "empresas" ? <p>{bloque.empresas}</p> : null}
        </div>

        <div className="mt-10 overflow-x-auto rounded-xl border border-[var(--h-border)] bg-[var(--h-surface)]">
          <dl className="grid grid-cols-1 divide-y divide-[var(--h-border)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
            {bloque.hechos.map((hecho) => (
              <div
                key={hecho.clave}
                className="border-[var(--h-border)] p-5 sm:border-b lg:[&:nth-last-child(-n+3)]:border-b-0 sm:odd:border-r lg:odd:border-r-0 lg:border-r lg:[&:nth-child(3n)]:border-r-0"
                data-hecho={hecho.clave}
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                  {hecho.etiqueta}
                </dt>
                <dd className="mt-2 text-lg font-bold tracking-tight text-[var(--h-ink)] tabular-nums">
                  {hecho.valor}
                </dd>
                <dd className="mt-2 text-xs leading-relaxed text-[var(--h-muted)]">
                  {hecho.detalle}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {conFaq && bloque.faqs.length > 0 ? (
          <div className="mt-12" data-testid="bloque-local-faq">
            <h3 className="text-lg font-bold tracking-tight text-[var(--h-ink)]">
              Preguntas frecuentes en {bloque.nombre}
            </h3>
            <div className="mt-4 divide-y divide-[var(--h-border)] border-y border-[var(--h-border)]">
              {bloque.faqs.map((faq) => (
                <details key={faq.q} className="faq group py-1">
                  <summary className="flex min-h-[44px] cursor-pointer items-center justify-between gap-6 py-3 text-left">
                    <span className="text-sm font-semibold leading-snug text-[var(--h-ink)] sm:text-base">
                      {faq.q}
                    </span>
                    <span
                      className="shrink-0 font-mono text-lg leading-none text-[var(--h-subtle)] group-open:hidden"
                      aria-hidden
                    >
                      +
                    </span>
                    <span
                      className="hidden shrink-0 font-mono text-lg leading-none text-[var(--h-subtle)] group-open:block"
                      aria-hidden
                    >
                      -
                    </span>
                  </summary>
                  <p className="max-w-[70ch] pb-4 text-sm leading-relaxed text-[var(--h-muted)]">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ) : null}

        {conEnlaces ? (
          <div className="mt-12 grid gap-10 border-t border-[var(--h-border)] pt-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--h-ink)]">
                {contexto === "ficha"
                  ? `Otras fichas de ${bloque.nombre}`
                  : `Fichas de curso en ${bloque.nombre}`}
              </h3>
              <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {bloque.fichas.map((ficha) => (
                  <li key={ficha.href}>
                    <Link
                      href={ficha.href}
                      className="text-sm leading-snug text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
                    >
                      {ficha.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={rutaLocal(iso, "/cursos")}
                className="mt-5 inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
              >
                Ver el catálogo de {bloque.nombre}
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--h-ink)]">
                Guías de {bloque.nombre}
              </h3>
              {bloque.guias.length > 0 ? (
                <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {bloque.guias.map((guia) => (
                    <li key={guia.href}>
                      <Link
                        href={guia.href}
                        className="text-sm leading-snug text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
                      >
                        {guia.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-[var(--h-muted)]">
                  Todavía no hay guías publicadas para {bloque.nombre}.
                </p>
              )}
              <Link
                href={bloque.indiceGuias}
                className="mt-5 inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
              >
                Índice de guías de {bloque.nombre}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
