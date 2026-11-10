import Link from "next/link";
import {
  BadgeCheck,
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
import { getBloqueLocalPais, getPaginaBloqueLocal, type RutaBloqueLocal } from "@/lib/paises/contenido-local";
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
  /** Inicio y fin de la cohorte en hora de Chile; por defecto 19:30–21:30. */
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
      className="border-t border-line bg-wash/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd) }}
        />
      ) : null}

      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          {pagina.kicker}
        </p>
        <h2
          id={id}
          className="mt-3 max-w-[34ch] text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          {t(pagina.titulo)}
        </h2>
        <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-mute">{t(pagina.intro)}</p>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mute">
              <Landmark size={14} aria-hidden /> {datos.precioTitulo}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-mute">
              {t(datos.precioDetalle)}
            </dd>
            <dd className="mt-3">
              <Link
                href={hrefPrecio}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
              >
                Consulta el valor vigente
              </Link>
            </dd>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mute">
              <CalendarClock size={14} aria-hidden /> Horario en {pais.nombre}
            </dt>
            <dd className="mt-2 text-xl font-bold tracking-tight text-ink tabular-nums">
              {horario.inicio} a {horario.fin}
            </dd>
            <dd className="mt-1 text-xs leading-relaxed text-faint">
              {horaLocal}. En Chile, {horario.inicioChile} a {horario.finChile}.
            </dd>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mute">
              <CreditCard size={14} aria-hidden /> Medios de pago
            </dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-1.5">
                {pais.mediosPago.map((medio) => (
                  <li
                    key={medio}
                    className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[11px] leading-snug text-mute"
                  >
                    {medio}
                  </li>
                ))}
              </ul>
            </dd>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mute">
              <ListChecks size={14} aria-hidden /> Cuotas
            </dt>
            <dd className="mt-2 text-sm font-semibold text-ink">{textoCuotas(iso)}</dd>
            <dd className="mt-1 text-xs leading-relaxed text-faint">{t(datos.cuotasDetalle)}</dd>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mute">
              <Gift size={14} aria-hidden /> Clase gratis
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-mute">{t(datos.claseGratis)}</dd>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mute">
              <BadgeCheck size={14} aria-hidden /> Certificado
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-mute">{t(datos.certificado)}</dd>
          </div>
        </dl>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-14">
          <div className="space-y-4 text-base leading-relaxed text-mute">
            {pagina.parrafos.map((parrafo) => (
              <p key={parrafo}>{t(parrafo)}</p>
            ))}

            <div className="mt-8">
              <h3 className="text-lg font-bold tracking-tight text-ink">
                Preguntas frecuentes en {pais.nombre}
              </h3>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {faqs.map((faq) => (
                  <details key={faq.q} className="faq group py-4">
                    <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                      <span className="text-sm font-semibold leading-snug text-ink sm:text-base">
                        {faq.q}
                      </span>
                      <span className="text-xl leading-none text-faint group-open:hidden">+</span>
                      <span className="hidden text-xl leading-none text-faint group-open:block">
                        –
                      </span>
                    </summary>
                    <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-mute">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[26px] border border-line bg-paper p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
              Datos de {pais.nombre}
            </p>
            <dl className="mt-5 space-y-5 text-sm leading-relaxed text-mute">
              <div>
                <dt className="text-xs font-semibold text-ink">Moneda</dt>
                <dd className="mt-1">
                  {pais.moneda}. El valor vigente se consulta en el PDF de temario y precios de cada curso.
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-ink">Horario</dt>
                <dd className="mt-1">{datos.horarioDetalle}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-ink">Pago</dt>
                <dd className="mt-1">{datos.pagoDetalle}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-line pt-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                Fichas de {pais.nombre}
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {courses.map((curso) => (
                  <li key={curso.slug}>
                    <Link
                      href={rutaLocal(iso, `/cursos/${curso.slug}`)}
                      className="text-xs leading-snug text-ink no-underline underline-offset-4 hover:text-mute hover:underline"
                    >
                      {ETIQUETA_CURSO[curso.slug] ?? curso.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={rutaLocal(iso, "/cursos")}
                className="mt-4 inline-block text-xs font-semibold text-mute no-underline underline-offset-4 hover:text-ink hover:underline"
              >
                Ver el catálogo completo
              </Link>
            </div>

            {guias.length > 0 ? (
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                  Guías de {pais.nombre}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {guias.map((guia) => (
                    <li key={guia.path}>
                      <Link
                        href={guia.path}
                        className="text-xs leading-snug text-ink no-underline underline-offset-4 hover:text-mute hover:underline"
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
