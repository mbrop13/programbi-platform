import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  CalendarClock,
  CreditCard,
  Gift,
  Landmark,
  ListChecks,
} from "lucide-react";
import { getPais } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import { courses } from "@/lib/data/courses";
import { guiasDePais } from "@/lib/guias";
import { esGuiaPublicada } from "@/lib/guias/relacionadas";
import { guiaLocalDeCurso } from "@/components/paises/enlaces";
import {
  getBloqueLocalPais,
  getPaginaBloqueLocal,
  type RutaBloqueLocal,
} from "@/lib/paises/contenido-local";
import { etiquetaHoraLocal, horarioLocal } from "@/lib/paises/horarios";
import { rutaLocal } from "@/lib/paises/rutas";
import { courseBrochurePath } from "@/lib/pricing-gate";
import { jsonLdString } from "@/lib/seo";

/**
 * Etiquetas cortas para el índice de fichas. El título completo del catálogo
 * se repite en las tarjetas de curso; acá alcanza con el nombre de la
 * herramienta para que el bloque de enlaces siga siendo legible.
 */
const ETIQUETA_CURSO: Record<string, string> = {
  "analisis-de-datos": "Análisis de datos",
  copilot: "Copilot",
  claude: "Claude",
  "power-automate": "Power Automate",
  "analitica-mineria": "Análisis para minería",
  "ia-productividad": "IA en productividad",
  "power-bi": "Power BI",
  python: "Python",
  "sql-server": "SQL Server",
  excel: "Excel",
  access: "Microsoft Access",
  "machine-learning": "Machine learning",
  "mercado-financiero": "Mercado financiero",
};

type Props = {
  iso: string;
  ruta: RutaBloqueLocal;
  /** Inicio y fin de la cohorte en hora de Chile; por defecto 19:30 a 21:30. */
  inicio?: string;
  fin?: string;
  /**
   * Emite el FAQPage JSON-LD del bloque. Se apaga en las rutas que ya declaran
   * su propia FAQPage (hub, ficha, empresas y precios) para no duplicar el
   * schema en la misma URL. La FAQ visible del bloque se mantiene siempre.
   */
  conFaqJsonLd?: boolean;
};

function slugRuta(ruta: string): string {
  return ruta.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
}

/**
 * Bloque local de Argentina y Colombia (WS8).
 *
 * Es un Server Component: no usa estado ni APIs de cliente. Se monta solo si
 * hay datos para el ISO y la ruta; Chile y los mercados sin contenido siguen
 * exactamente como estaban. El FAQPage JSON-LD sale del mismo arreglo de
 * preguntas que se renderiza, así que nunca hay divergencia entre lo visible
 * y lo declarado.
 *
 * Stand-in de `components/paises/BloqueLocalPais.tsx` (WS7): la interfaz de
 * datos es la documentada en `lib/paises/contenido-local/tipos.ts`.
 */
export default function BloqueLocalContenido({
  iso,
  ruta,
  inicio,
  fin,
  conFaqJsonLd = true,
}: Props) {
  const bloque = getBloqueLocalPais(iso);
  const pagina = getPaginaBloqueLocal(iso, ruta);
  if (!bloque || !pagina) return null;
  const datos = bloque.datos;

  const pais = getPais(iso);
  const horario = horarioLocal(iso, { inicio, fin });
  const horaLocal = etiquetaHoraLocal(iso);
  const guias = guiasDePais(iso).filter(esGuiaPublicada);
  const id = `bloque-local-${slugRuta(iso)}-${slugRuta(ruta)}`;
  const slugCurso = ruta.startsWith("curso:") ? ruta.slice("curso:".length) : null;
  const hrefPrecio = slugCurso
    ? courseBrochurePath(slugCurso, iso)
    : rutaLocal(iso, "/precios");
  const guiaCurso = slugCurso ? guiaLocalDeCurso(iso, slugCurso) : undefined;
  const guiasDestacadas = (["power-bi", "analisis-de-datos", "python"] as const)
    .map((slug) => guiaLocalDeCurso(iso, slug))
    .filter((item): item is NonNullable<typeof item> => item != null);

  // Los textos de `contenido-local` usan el marcador `{cuotas}` para no
  // duplicar el número que manda `config/cuotas.ts` (fuente única del dato).
  const cuotas = textoCuotas(iso);
  const t = (texto: string) => texto.replaceAll("{cuotas}", cuotas);
  const faqs = pagina.faqs.map((faq) => ({ q: t(faq.q), a: t(faq.a) }));

  const faqJsonLd = conFaqJsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }
    : null;

  return (
    <section
      data-testid="bloque-local-pais"
      aria-labelledby={id}
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
          {pagina.kicker}
        </p>
        <h2
          id={id}
          className="mt-2.5 max-w-[34ch] text-balance text-2xl font-bold tracking-tight text-[var(--h-ink)] sm:text-3xl"
        >
          {t(pagina.titulo)}
        </h2>
        <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-[var(--h-muted)]">
          {t(pagina.intro)}
        </p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--h-border)] bg-[var(--h-surface)]">
          <dl className="grid grid-cols-1 divide-y divide-[var(--h-border)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
            <div className="border-[var(--h-border)] p-5 sm:border-b sm:odd:border-r lg:border-r lg:odd:border-r">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                <Landmark size={14} aria-hidden /> {datos.precioTitulo}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">
                {t(datos.precioDetalle)}
              </dd>
              <dd className="mt-3">
                <Link
                  href={hrefPrecio}
                  className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
                >
                  Consultar valor vigente
                </Link>
              </dd>
            </div>

            <div className="border-[var(--h-border)] p-5 sm:border-b lg:border-r">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                <CalendarClock size={14} aria-hidden /> Horario en {pais.nombre}
              </dt>
              <dd className="mt-2 text-xl font-bold tracking-tight text-[var(--h-ink)] tabular-nums">
                {horario.inicio} a {horario.fin}
              </dd>
              <dd className="mt-1 text-xs leading-relaxed text-[var(--h-subtle)]">
                {horaLocal}. En Chile, {horario.inicioChile} a {horario.finChile}.
              </dd>
            </div>

            <div className="border-[var(--h-border)] p-5 sm:border-b sm:odd:border-r lg:border-r-0">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                <CreditCard size={14} aria-hidden /> Medios de pago
              </dt>
              <dd className="mt-2.5">
                <ul className="flex flex-wrap gap-1.5">
                  {pais.mediosPago.map((medio) => (
                    <li
                      key={medio}
                      className="rounded-md border border-[var(--h-border)] bg-[var(--h-wash)] px-2.5 py-1 text-xs leading-snug text-[var(--h-muted)]"
                    >
                      {medio}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="border-[var(--h-border)] p-5 sm:border-b lg:border-b-0 lg:border-r">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                <ListChecks size={14} aria-hidden /> Cuotas
              </dt>
              <dd className="mt-2 text-sm font-semibold text-[var(--h-ink)]">{textoCuotas(iso)}</dd>
              <dd className="mt-1 text-xs leading-relaxed text-[var(--h-subtle)]">
                {t(datos.cuotasDetalle)}
              </dd>
            </div>

            <div className="border-[var(--h-border)] p-5 sm:odd:border-r lg:border-r lg:odd:border-r">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                <Gift size={14} aria-hidden /> Clase gratis
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">
                {t(datos.claseGratis)}
              </dd>
            </div>

            <div className="p-5">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                <BadgeCheck size={14} aria-hidden /> Certificado
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--h-muted)]">
                {t(datos.certificado)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-14">
          <div className="space-y-4 text-base leading-relaxed text-[var(--h-muted)]">
            {pagina.parrafos.map((parrafo) => (
              <p key={parrafo}>{t(parrafo)}</p>
            ))}

            {guiaCurso ? (
              <div className="mt-5 rounded-xl border border-[var(--h-border)] bg-[var(--h-surface)] p-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                  <BookOpen size={13} aria-hidden /> Guía local recomendada · {pais.nombre}
                </p>
                <Link
                  href={guiaCurso.path}
                  className="mt-2 inline-flex min-h-[44px] items-center text-sm font-semibold leading-snug text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline sm:text-base"
                >
                  {guiaCurso.h1}
                </Link>
              </div>
            ) : guiasDestacadas.length > 0 ? (
              <div className="mt-5 rounded-xl border border-[var(--h-border)] bg-[var(--h-surface)] p-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                  <BookOpen size={13} aria-hidden /> Guías de referencia para {pais.nombre}
                </p>
                <ul className="mt-3 space-y-2">
                  {guiasDestacadas.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className="inline-flex min-h-[44px] items-center text-sm font-semibold leading-snug text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
                      >
                        {item.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-8">
              <h3 className="text-lg font-bold tracking-tight text-[var(--h-ink)]">
                Preguntas frecuentes en {pais.nombre}
              </h3>
              <div className="mt-4 divide-y divide-[var(--h-border)] border-y border-[var(--h-border)]">
                {faqs.map((faq) => (
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
                    <p className="max-w-[62ch] pb-4 text-sm leading-relaxed text-[var(--h-muted)]">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-[var(--h-border)] bg-[var(--h-surface)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
              Datos de {pais.nombre}
            </p>
            <dl className="mt-5 space-y-5 text-sm leading-relaxed text-[var(--h-muted)]">
              <div>
                <dt className="text-xs font-semibold text-[var(--h-ink)]">Moneda</dt>
                <dd className="mt-1">
                  {pais.moneda}. El valor vigente se consulta en el PDF de temario y precios de cada
                  curso.
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[var(--h-ink)]">Horario</dt>
                <dd className="mt-1">{datos.horarioDetalle}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[var(--h-ink)]">Pago</dt>
                <dd className="mt-1">{datos.pagoDetalle}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-[var(--h-border)] pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                Fichas de {pais.nombre}
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                {courses.map((curso) => (
                  <li key={curso.slug}>
                    <Link
                      href={rutaLocal(iso, `/cursos/${curso.slug}`)}
                      className="text-xs leading-snug text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
                    >
                      {ETIQUETA_CURSO[curso.slug] ?? curso.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={rutaLocal(iso, "/cursos")}
                className="mt-4 inline-flex min-h-[44px] items-center text-xs font-semibold text-[var(--h-muted)] no-underline underline-offset-4 hover:text-[var(--h-ink)] hover:underline"
              >
                Ver el catálogo completo
              </Link>
            </div>

            {guias.length > 0 ? (
              <div className="mt-6 border-t border-[var(--h-border)] pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                  Guías de {pais.nombre}
                </p>
                <ul className="mt-3 space-y-2">
                  {guias.map((guia) => (
                    <li key={guia.path}>
                      <Link
                        href={guia.path}
                        className="text-xs leading-snug text-[var(--h-ink)] no-underline underline-offset-4 hover:text-[var(--h-accent)] hover:underline"
                      >
                        {guia.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
