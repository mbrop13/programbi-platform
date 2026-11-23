import Link from "next/link";
import { ArrowRight, CalendarClock, CreditCard } from "lucide-react";
import { getPais, ISO_CHILE, muestraPrecioDirecto, normalizarPais } from "@/config/paises";
import { textoCuotas } from "@/config/cuotas";
import { precioVenta, type PromocionAplicable } from "@/lib/paises/precios";
import { montoConCodigo } from "@/lib/paises/detalle-curso";
import type { Course } from "@/lib/data/courses";
import { getContenidoPais } from "@/lib/data/contenido-paises";
import { getFichaPais } from "@/lib/data/contenido-paises/fichas";
import { etiquetaHoraLocal, horarioLocal } from "@/lib/paises/horarios";
import { courseBrochurePath } from "@/lib/pricing-gate";
import { faqDePais } from "@/lib/faq/contenido";
import { guiasDePais, indiceGuias } from "@/lib/guias";
import { esGuiaPublicada } from "@/lib/guias/relacionadas";
import { guiaLocalDeCurso, hubGuiasDe } from "@/components/paises/enlaces";

type Props = {
  curso: Course;
  /** ISO del mercado de la ruta, ya normalizado por la página. */
  pais: string;
  /** Inicio y fin de la cohorte en hora de Chile. */
  inicio?: string;
  fin?: string;
  promotions?: readonly PromocionAplicable[];
};

/**
 * Nombre del curso para el texto corrido. El catálogo titula Mercado financiero
 * con la frase completa («Curso para el mercado financiero con Python Power BI
 * y SQL»), que no encaja en «Cómo se usa … en Chile». El resto usa su título
 * tal cual.
 */
function nombreEnProsa(curso: Course): string {
  if (curso.slug === "mercado-financiero") return "Mercado financiero";
  return curso.title;
}

/**
 * Preguntas de ficha propias del mercado.
 *
 * En Argentina, México, Perú, Colombia y Uruguay salen de
 * `lib/data/contenido-paises` (dos de pagos y una general). En Chile no hay
 * archivo de contenido: se toman de `faqDePais("cl")`, que arma las respuestas
 * con `config/pricing.ts` y `config/cuotas.ts`.
 *
 * Se excluyen las preguntas de horario y certificado porque la ficha ya las
 * muestra en su propio bloque (`CourseLocalSeo` / `CourseFaq`).
 */
function preguntasDeFicha(iso: string): { q: string; a: string }[] {
  const contenido = getContenidoPais(iso);
  if (contenido) {
    const pagos = contenido.faqs.filter((faq) => faq.categoria === "pagos").slice(0, 2);
    const generales = contenido.faqs.filter((faq) => faq.categoria === "general").slice(0, 1);
    return [...pagos, ...generales].map((faq) => ({ q: faq.q, a: faq.a }));
  }

  // Chile: cuotas, medios de pago y grabaciones. Ninguna repite el bloque
  // «Preguntas frecuentes» de la ficha.
  const ids = new Set(["cuotas-sin-interes", "formas-de-pago", "grabaciones-de-por-vida"]);
  return faqDePais(iso)
    .secciones.flatMap((seccion) => seccion.items)
    .filter((item) => ids.has(item.id))
    .map((item) => ({ q: item.pregunta, a: item.respuesta }))
    .slice(0, 3);
}

/**
 * Bloque de ficha por país: texto propio del mercado, precio local, medios de
 * pago y cuotas reales, horario convertido a la hora del país, preguntas del
 * mercado y enlaces a las guías de ese país.
 *
 * Es un componente de servidor: no usa estado ni APIs de cliente. Se monta
 * fuera de `CourseDetailClient`, así que aparece igual en la ficha chilena y en
 * `/<pais>/cursos/<slug>`, que reexporta la misma página.
 *
 * Solo se renderiza cuando el país tiene contenido propio (`fichas.ts` o
 * `contenido-paises`); el resto de los mercados sigue con la ficha común.
 */
export default function BloquePaisFicha({ curso, pais, inicio, fin, promotions }: Props) {
  const iso = normalizarPais(pais);
  const info = getPais(iso);
  const ficha = getFichaPais(iso, curso.slug);
  const contenido = getContenidoPais(iso);
  if (!ficha && !contenido) return null;

  const horario = horarioLocal(iso, { inicio, fin });
  const horaLocal = etiquetaHoraLocal(iso);
  const guia = guiaLocalDeCurso(iso, curso.slug);
  const hrefGuia = guia ? guia.path : hubGuiasDe(iso);
  const casos = contenido?.casos ?? [];
  const indiceCaso =
    curso.slug === "power-bi"
      ? 2
      : curso.slug === "analisis-de-datos"
        ? 1
        : curso.slug === "python"
          ? 0
          : 0;
  const caso = casos[indiceCaso] ?? casos[0];
  const preguntas = preguntasDeFicha(iso);
  const nombreCurso = nombreEnProsa(curso);

  // Otras guías publicadas del mercado, sin repetir la del curso actual: la
  // sección «Guías de <curso>» que va justo debajo ya cubre ese tema.
  const otrasGuias = guiasDePais(iso)
    .filter(
      (item) => esGuiaPublicada(item) && item.course !== curso.slug && item.path !== guia?.path
    )
    .slice(0, 3);

  // Estados Unidos y España publican el monto en la ficha, sin pasar por el PDF.
  const precioDirecto = muestraPrecioDirecto(iso)
    ? precioVenta(iso, curso.slug, iso === ISO_CHILE ? promotions : [])
    : null;

  return (
    <section
      data-testid="bloque-pais-ficha"
      aria-labelledby="bloque-pais-ficha"
      className="border-t border-line bg-canvas px-5 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Ficha local · {info.nombre}
        </p>
        <h2
          id="bloque-pais-ficha"
          className="mt-3 max-w-[34ch] text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Cómo se usa {nombreCurso} en {info.nombre}
        </h2>
        <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-mute">
          Cómo se dicta {nombreCurso} en {info.nombre}: medios de pago, horario local y el
          PDF de temario y precios de ese mercado, con las preguntas y las guías del país.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:gap-12">
          <div className="space-y-4 text-base leading-relaxed text-mute">
            {(ficha?.parrafos ?? []).map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}

            {caso ? (
              <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                  Caso de trabajo · {caso.sector}
                </p>
                <p className="mt-2 text-base font-semibold tracking-tight text-ink">
                  {caso.titulo}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-mute">{caso.descripcion}</p>
                <p className="mt-3 border-t border-line pt-3 text-xs leading-relaxed text-faint">
                  <span className="font-semibold text-mute">Datos de partida:</span> {caso.fuente}
                </p>
              </div>
            ) : null}

            {contenido ? (
              <p>
                {contenido.moneda.resumen} {contenido.mercado.facturacion}
              </p>
            ) : null}

            {guia ? (
              <p className="text-sm leading-relaxed text-mute">
                Guía práctica del mercado:{" "}
                <Link
                  href={guia.path}
                  className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
                >
                  {guia.h1}
                </Link>
                .
              </p>
            ) : null}

            {preguntas.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-lg font-bold tracking-tight text-ink">
                  Preguntas de {info.nombre}
                </h3>
                <div className="mt-4 divide-y divide-line border-y border-line">
                  {preguntas.map((item) => (
                    <details key={item.q} className="faq group py-4">
                      <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                        <span className="text-sm font-semibold leading-snug text-ink sm:text-base">
                          {item.q}
                        </span>
                        <span className="text-xl leading-none text-faint group-open:hidden">+</span>
                        <span className="hidden text-xl leading-none text-faint group-open:block">
                          –
                        </span>
                      </summary>
                      <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-mute">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="h-fit rounded-[26px] border border-line bg-paper p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
              Datos del mercado
            </p>

            <dl className="mt-5 space-y-5">
              <div>
                <dt className="flex items-center gap-2 text-xs font-semibold text-mute">
                  <CalendarClock size={14} aria-hidden /> Horario de clases
                </dt>
                <dd className="mt-2 text-xl font-bold tracking-tight text-ink tabular-nums">
                  {horario.inicio} a {horario.fin}
                </dd>
                <dd className="mt-1 text-xs leading-relaxed text-faint">
                  {horaLocal}.
                  {iso === ISO_CHILE
                    ? ""
                    : ` En Chile, ${horario.inicioChile} a ${horario.finChile}.`}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold text-mute">
                  Precio de {nombreCurso} en {info.moneda}
                </dt>
                {precioDirecto != null ? (
                  <dd className="mt-2 text-xl font-bold tracking-tight text-ink tabular-nums">
                    {montoConCodigo(iso, precioDirecto)}
                  </dd>
                ) : null}
                <dd className="mt-2">
                  <Link
                    href={courseBrochurePath(curso.slug, iso)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
                  >
                    {precioDirecto != null ? "Descargar temario (PDF)" : "Ver temario y precios (PDF)"}
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-xs font-semibold text-mute">
                  <CreditCard size={14} aria-hidden /> Medios de pago
                </dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-2">
                    {info.mediosPago.map((medio) => (
                      <li
                        key={medio}
                        className="rounded-full border border-line bg-canvas px-3 py-1.5 text-[11px] leading-snug text-mute"
                      >
                        {medio}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-relaxed text-faint">
                    {textoCuotas(iso)
                      ? `${textoCuotas(iso)} en todos los cursos.`
                      : "Un solo pago con tarjeta."}
                  </p>
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-line pt-5">
              <Link
                href={hrefGuia}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
              >
                {guia ? `Guía de ${nombreCurso} en ${info.nombre}` : `Guías de ${info.nombre}`}
                <ArrowRight size={14} aria-hidden />
              </Link>

              {otrasGuias.length > 0 ? (
                <>
                  <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-mute">
                    Otras guías de {info.nombre}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {otrasGuias.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className="text-sm leading-snug text-ink no-underline underline-offset-4 hover:underline"
                        >
                          {item.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <Link
                href={indiceGuias(iso)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-mute no-underline underline-offset-4 hover:text-ink hover:underline"
              >
                Ver todas las guías de {info.nombre}
                <ArrowRight size={12} aria-hidden />
              </Link>
            </div>
          </aside>
        </div>

        {contenido && contenido.referencias.length > 0 ? (
          <div className="mt-10 border-t border-line pt-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
              Referencias locales
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {contenido.referencias.map((referencia) => (
                <li
                  key={referencia.nombre}
                  className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink"
                  title={referencia.detalle}
                >
                  {referencia.nombre}
                </li>
              ))}
            </ul>
            <p className="mt-3 max-w-[70ch] text-xs leading-relaxed text-faint">
              Fuentes públicas y sistemas habituales de {info.nombre}. Son referencias para
              practicar con estructuras parecidas a las del trabajo, no casos de clientes.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
