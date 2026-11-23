import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarClock, Languages, Receipt, Video } from "lucide-react";
import { getPais } from "@/config/paises";
import { precioVenta, type PromocionAplicable } from "@/lib/paises/precios";
import { courses, getCourseBySlug } from "@/lib/data/courses";
import { catalogHours } from "@/lib/data/course-views";
import { getContenidoPais } from "@/lib/data/contenido-paises";
import { etiquetaHoraLocal, horarioLocal } from "@/lib/paises/horarios";
import { montoConCodigo, resumenPreciosCatalogo } from "@/lib/paises/detalle-curso";
import { metadataLocal } from "@/lib/paises/metadata";
import { absoluteUrl, jsonLdString } from "@/lib/seo";

/**
 * /us/miami — página para quien busca cursos de datos en español en Miami.
 *
 * Es una sola página con contenido propio (horario real, industrias del sur de
 * Florida, precio directo y reembolso del empleador), no una plantilla por
 * ciudad. Las clases son en vivo por Zoom: la página lo dice sin rodeos y no
 * insinúa oficina, aula ni dirección en Miami.
 *
 * Solo existe para `us`; cualquier otro país responde 404. Mientras `us` no sea
 * indexable, hereda `noindex` desde `metadataLocal`.
 */
export const revalidate = 86400;
export const dynamicParams = false;

const PAIS = "us";
const RUTA = "/miami";
const RUTA_COMPLETA = `/${PAIS}${RUTA}`;

/** Cursos que más se piden en Miami y que se muestran con precio. */
const CURSOS_DESTACADOS = [
  "power-bi",
  "excel",
  "sql-server",
  "python",
  "ia-productividad",
  "analisis-de-datos",
] as const;

export function generateStaticParams(): { pais: string }[] {
  return [{ pais: PAIS }];
}

const TITULO = "Cursos de datos en español en Miami, EE.UU.";
const DESCRIPCION =
  "Power BI, Excel, SQL, Python e IA en vivo y en español para profesionales en Miami. Clases por Zoom al salir del trabajo (hora del Este), precios en USD y certificado.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== PAIS) return {};
  const base = metadataLocal({ pais, path: RUTA, title: TITULO, description: DESCRIPCION });
  // `/miami` no es una ruta localizable (no existe en Chile ni en otros países),
  // así que `metadataLocal` no le pone el prefijo: se fija aquí el canonical real.
  const url = absoluteUrl(RUTA_COMPLETA);
  return {
    ...base,
    alternates: { ...base.alternates, canonical: url },
    openGraph: { ...base.openGraph, url },
  };
}

export default async function MiamiPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== PAIS) notFound();

  const info = getPais(PAIS);
  const contenido = getContenidoPais(PAIS);
  const horario = horarioLocal(PAIS);
  const horaLocal = etiquetaHoraLocal(PAIS);
  // /us/miami nunca aplica promociones de Chile.
  const promotions: PromocionAplicable[] = [];

  const destacados = CURSOS_DESTACADOS.flatMap((slug) => {
    const curso = getCourseBySlug(slug);
    const precio = precioVenta(PAIS, slug, promotions);
    if (!curso || precio == null) return [];
    return [{ slug, titulo: curso.title, horas: catalogHours(curso), precio }];
  });

  const faqs = [
    {
      q: "¿Hay clases presenciales en Miami?",
      a: "No. Todas las clases son en vivo por Zoom, con profesor real, y se dictan desde Santiago de Chile; no tenemos oficina ni aula en Miami ni en el resto de Estados Unidos. Lo que sí hay es un horario pensado para la tarde del Este.",
    },
    {
      q: "¿A qué hora son las clases en Miami?",
      a: `La sesión de 2 horas es de ${horario.inicio} a ${horario.fin}, ${horaLocal}. En Chile son de ${horario.inicioChile} a ${horario.finChile}. Estados Unidos y Chile cambian la hora en fechas distintas, así que la equivalencia se mueve entre las 17:30 y las 19:30 en Miami según la época del año; la ficha de cada cohorte muestra la hora exacta.`,
    },
    {
      q: "¿Cuánto cuesta un curso de Power BI o Excel en español en Miami?",
      a: `${resumenPreciosCatalogo(PAIS, promotions)} El precio es el que ves en cada ficha, sin formularios previos.`,
    },
    {
      q: "¿Mi empresa en Miami me puede reembolsar el curso?",
      a: "Muchas empresas tienen un programa de asistencia educativa. Según el IRS, un empleador puede dar hasta $5,250 al año por empleado libres de impuesto bajo un programa calificado (Sección 127). Cada empresa decide si aprueba el reembolso; te entregamos recibo en USD y la descripción del curso, con temario y duración, para tu solicitud.",
    },
    {
      q: "¿Necesito saber inglés para tomar el curso?",
      a: "La explicación es toda en español. El software se usa con la interfaz en inglés, que es la que verás en el trabajo, y los términos técnicos se mantienen en inglés y se explican la primera vez que aparecen. Con lectura básica de inglés técnico alcanza.",
    },
    {
      q: "¿El certificado sirve en Miami?",
      a: "Es un certificado digital propio de la academia, con código de verificación. No es una certificación de Microsoft ni una acreditación estadounidense. Para una credencial reconocida por Microsoft existe el examen PL-300, que se rinde por separado.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl(RUTA_COMPLETA)}#webpage`,
        url: absoluteUrl(RUTA_COMPLETA),
        name: TITULO,
        description: DESCRIPCION,
        inLanguage: info.idioma,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        about: { "@type": "Thing", name: "Cursos de Power BI, Excel y análisis de datos en español" },
        audience: {
          "@type": "Audience",
          audienceType: "Profesionales hispanohablantes en Miami y el sur de Florida",
          geographicArea: { "@type": "City", name: "Miami" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl(`/${PAIS}`) },
          { "@type": "ListItem", position: 2, name: "Miami", item: absoluteUrl(RUTA_COMPLETA) },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <article className="bg-canvas px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl">
        <nav className="mb-8 text-sm text-mute" aria-label="Migas">
          <Link href={`/${PAIS}`} className="no-underline hover:text-ink">
            Inicio
          </Link>
          <span className="mx-2 text-faint">/</span>
          <span className="text-ink">Miami</span>
        </nav>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Miami y el sur de Florida
        </p>
        <h1 className="mt-3 max-w-[22ch] text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
          Cursos de Power BI, Excel y datos en español, en vivo, para Miami
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-mute">
          Aprende con profesor real, por Zoom, en tu idioma. La clase empieza a las{" "}
          {horario.inicio} hora de Miami, al salir de la oficina, y el software se trabaja en
          inglés como en tu trabajo. Los precios están en dólares y se ven sin formularios.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${PAIS}/cursos`}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-canvas no-underline"
          >
            Ver los cursos y precios <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            href={`/${PAIS}/empresas`}
            className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-sm font-medium text-ink no-underline hover:bg-wash"
          >
            Capacitación para tu empresa
          </Link>
        </div>

        <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <CalendarClock size={14} aria-hidden /> Horario
            </dt>
            <dd className="mt-2 text-lg font-bold tracking-tight text-ink tabular-nums">
              {horario.inicio} a {horario.fin}
            </dd>
            <dd className="mt-1 text-xs leading-relaxed text-mute">{horaLocal}</dd>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <Video size={14} aria-hidden /> Modalidad
            </dt>
            <dd className="mt-2 text-lg font-bold tracking-tight text-ink">En vivo por Zoom</dd>
            <dd className="mt-1 text-xs leading-relaxed text-mute">
              Sin aula en Miami. Clases grabadas en el campus durante el curso.
            </dd>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <Languages size={14} aria-hidden /> Idioma
            </dt>
            <dd className="mt-2 text-lg font-bold tracking-tight text-ink">Español</dd>
            <dd className="mt-1 text-xs leading-relaxed text-mute">
              Explicación en español, software y términos técnicos en inglés.
            </dd>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <Receipt size={14} aria-hidden /> Pago
            </dt>
            <dd className="mt-2 text-lg font-bold tracking-tight text-ink">USD, con tarjeta</dd>
            <dd className="mt-1 text-xs leading-relaxed text-mute">
              Recibo en USD para pedir el reembolso a tu empleador.
            </dd>
          </div>
        </dl>

        <section aria-labelledby="miami-cursos" className="mt-16">
          <h2 id="miami-cursos" className="text-2xl font-bold tracking-tight text-ink">
            Cursos con precio, para empezar esta temporada
          </h2>
          <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-mute">
            Cada curso de 20 horas tiene su ficha con temario, fechas y el precio final en dólares.
            El programa de Análisis de datos reúne SQL Server, Power BI y Python.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((curso) => (
              <li key={curso.slug}>
                <Link
                  href={`/${PAIS}/cursos/${curso.slug}`}
                  className="group block h-full rounded-2xl border border-line bg-paper p-5 no-underline transition-colors hover:border-ink/20"
                >
                  <p className="text-base font-semibold tracking-tight text-ink">{curso.titulo}</p>
                  <p className="mt-1 text-xs text-mute">{curso.horas} horas en vivo</p>
                  <p className="mt-4 text-2xl font-bold tracking-tight text-ink tabular-nums">
                    {montoConCodigo(PAIS, curso.precio)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                    Ver la ficha <ArrowRight size={14} aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-faint">
            Hay {courses.length} cursos en el catálogo.{" "}
            <Link href={`/${PAIS}/cursos`} className="font-semibold text-ink underline underline-offset-4">
              Ver el catálogo completo
            </Link>
            .
          </p>
        </section>

        {contenido ? (
          <section aria-labelledby="miami-industrias" className="mt-16">
            <h2 id="miami-industrias" className="text-2xl font-bold tracking-tight text-ink">
              Los datos de las industrias del sur de Florida
            </h2>
            <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-mute">
              Los ejercicios parten de lo que se encuentra en una empresa de Miami: logística y
              comercio exterior, hotelería, bienes raíces, salud, construcción y oficinas
              regionales de banca. Son escenarios de trabajo, no casos de clientes.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {contenido.casos.map((caso) => (
                <div key={caso.sector} className="rounded-2xl border border-line bg-paper p-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                    {caso.sector}
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-tight text-ink">
                    {caso.titulo}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{caso.descripcion}</p>
                  <p className="mt-3 border-t border-line pt-3 text-xs leading-relaxed text-faint">
                    <span className="font-semibold text-mute">Datos de partida:</span> {caso.fuente}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="miami-empresas" className="mt-16 rounded-[26px] border border-line bg-paper p-6 sm:p-8">
          <h2 id="miami-empresas" className="text-2xl font-bold tracking-tight text-ink">
            ¿Tu empresa en Miami tiene un equipo hispanohablante?
          </h2>
          <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-mute">
            Armamos un programa cerrado, en vivo y en español, con los datos de tu empresa y en el
            horario que acuerden (ET, CT o PT). La propuesta llega por escrito, con valor en USD y
            factura o recibo en dólares.
          </p>
          <Link
            href={`/${PAIS}/empresas`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
          >
            Pedir una propuesta para el equipo <ArrowRight size={14} aria-hidden />
          </Link>
        </section>

        <section aria-labelledby="miami-faq" className="mt-16">
          <h2 id="miami-faq" className="text-2xl font-bold tracking-tight text-ink">
            Preguntas frecuentes desde Miami
          </h2>
          <div className="mt-5 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
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
        </section>
      </div>
    </article>
  );
}
