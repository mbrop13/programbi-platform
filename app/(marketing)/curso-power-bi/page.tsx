import type { Metadata } from "next";
import Link from "next/link";
import PlantillaDescarga from "@/components/marketing/PlantillaDescarga";
import { ISO_CHILE, getPais, normalizarPais } from "@/config/paises";
import { getContenidoPais } from "@/lib/data/contenido-paises";
import { getCourseBySlug } from "@/lib/data/courses";
import { offerLowPrice } from "@/lib/data/course-views";
import { horarioLocal } from "@/lib/paises/horarios";
import {
  formatMoneda,
  localizarMercado,
  porcentajeDescuento,
  precioCurso,
  precioLista,
} from "@/lib/paises/precios";
import { hreflangDe, rutaLocal } from "@/lib/paises/rutas";
import { SITE_URL, absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOg } from "@/lib/seo";
import { GUIDE_SEO } from "@/lib/seo/money";

const copy = GUIDE_SEO["curso-power-bi"];
const path = copy.path;

export const revalidate = 3600;

const share = pageOg({
  title: copy.title,
  description: copy.description,
  path,
  kicker: "Power BI · Chile",
  tags: ["Power BI", "Plantilla CSV", "Chile"],
});

export const metadata: Metadata = {
  title: { absolute: copy.title },
  description: copy.description,
  alternates: { canonical: path, languages: hreflangDe(path) },
  openGraph: {
    title: copy.title,
    description: copy.description,
    url: absoluteUrl(path),
    type: "article",
    images: share.images,
  },
  twitter: share.twitter,
};

const faqsPlantilla = [
  {
    q: "¿La plantilla de ventas es gratis?",
    a: "Sí. El CSV es gratis; solo pedimos tu email antes de la descarga. Puedes usarlo para practicar o para probar tus propias medidas.",
  },
  {
    q: "¿Qué incluye el archivo?",
    a: "18 filas de ejemplo con fecha, país, moneda, región, vendedor, categoría, producto, unidades, precio unitario, venta neta, costo y margen.",
  },
  {
    q: "¿Necesito tener Power BI instalado para abrirla?",
    a: "No. Se abre en Excel, Google Sheets o cualquier editor de texto. Para practicar el flujo completo, conéctala desde Power BI Desktop como origen CSV.",
  },
  {
    q: "¿El curso Power BI usa esta plantilla?",
    a: "La plantilla es un ejercicio de apoyo. En el curso trabajas con Power Query, modelado y DAX, y puedes usar este CSV como caso propio desde la primera clase.",
  },
];

const incluidos = [
  {
    title: "Ventas por país",
    body: "Filas de Chile, Argentina, México, Perú, Colombia y Uruguay con fecha, vendedor, categoría y producto.",
  },
  {
    title: "Números listos para medir",
    body: "Unidades, precio unitario, venta neta, costo y margen para practicar medidas, comparativas y visuales.",
  },
  {
    title: "Solo email, sin macros",
    body: "Dejas tu email, descargas el CSV y lo abres en Excel o lo conectas directo desde Power BI Desktop.",
  },
];

const pasos = [
  {
    title: "Descarga el archivo",
    body: "Guarda plantilla-ventas-powerbi.csv en una carpeta local. No necesita credenciales ni conexión a una base de datos.",
  },
  {
    title: "Cárgalo en Power BI Desktop",
    body: "Usa Obtener datos > Texto/CSV, revisa los tipos y deja que Power Query limpie fechas, números y textos.",
  },
  {
    title: "Crea tus primeras medidas",
    body: "Calcula venta total, margen porcentual y ventas por país. Después compara el resultado con el mapa o un gráfico de barras.",
  },
];

const aprendizajes = [
  "Limpieza y transformación de datos con Power Query.",
  "Modelo en estrella, relaciones y tablas de dimensión.",
  "Medidas DAX para ventas, margen y variación.",
  "Diseño de tableros y publicación en Power BI Service.",
];

export default async function Page({
  params,
}: {
  params: Promise<{ pais?: string }>;
}) {
  const pais = normalizarPais((await params).pais);
  const mercado = getPais(pais);
  const contenido = getContenidoPais(pais);
  const L = (texto: string) => localizarMercado(texto, pais);
  const href = (destino: string) => rutaLocal(pais, destino);

  const curso = getCourseBySlug("power-bi");
  const esChile = pais === ISO_CHILE;
  const precioLocal = precioCurso(pais, "power-bi");
  const precioCatalogo = curso ? offerLowPrice(curso, "publico") : undefined;
  const precio = esChile ? (precioCatalogo ?? null) : (precioLocal ?? precioCatalogo ?? null);
  const usaMonedaLocal = !esChile && precioLocal != null;
  const moneda = usaMonedaLocal ? mercado.moneda : "CLP";
  const precioTexto =
    precio != null ? formatMoneda(usaMonedaLocal ? pais : ISO_CHILE, precio) : null;
  const listaLocal = usaMonedaLocal ? precioLista(pais, "power-bi") : null;
  const listaTexto = listaLocal != null ? formatMoneda(pais, listaLocal) : null;
  const descuento =
    listaLocal != null && precioLocal != null
      ? porcentajeDescuento(listaLocal, precioLocal)
      : 0;
  const horario = horarioLocal(pais);

  const faqNivel = {
    q: "¿Qué nivel necesito para tomar el curso?",
    a: "El curso abierto es básico-intermedio, de 20 horas: Power Query, modelo y DAX. No necesitas saber DAX antes. El avanzado, también de 20 horas, cubre publicación en Power BI Service y seguridad a nivel de fila.",
  };

  const faqs = [
    ...faqsPlantilla,
    ...(contenido
      ? [...contenido.faqs.map((faq) => ({ q: faq.q, a: faq.a })), faqNivel]
      : [
          {
            q: `¿Cómo se paga el curso desde ${mercado.nombre}?`,
            a: `El pago se hace con ${mercado.mediosPago.join(", ")}. El precio de esta página está en ${mercado.moneda} y se confirma en el checkout.`,
          },
          {
            q: "¿Qué certificado recibo al terminar?",
            a: "Certificado digital de ProgramBI al completar el proyecto final, con código de verificación para adjuntar a LinkedIn o presentar en una búsqueda laboral.",
          },
          {
            q: `¿A qué hora son las clases en ${mercado.nombre}?`,
            a: esChile
              ? `Las clases en vivo por Zoom son de ${horario.inicio} a ${horario.fin}, hora de Chile (${horario.offset}).`
              : `Las clases en vivo por Zoom son de ${horario.inicio} a ${horario.fin}, hora de ${mercado.nombre} (${horario.offset}). En Chile son de ${horario.inicioChile} a ${horario.finChile}.`,
          },
          faqNivel,
        ]),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: L("Curso de Power BI online en vivo en Chile"),
        description: L(copy.description),
        url: absoluteUrl(href(path)),
        ...(curso ? { image: absoluteUrl(curso.imageUrl) } : {}),
        inLanguage: mercado.idioma,
        provider: {
          "@type": "Organization",
          name: "ProgramBI",
          url: SITE_URL,
          "@id": `${SITE_URL}/#organization`,
        },
        courseMode: "online",
        timeRequired: "PT20H",
        ...(precio != null
          ? {
              offers: {
                "@type": "Offer",
                price: precio,
                priceCurrency: moneda,
                availability: "https://schema.org/InStock",
                url: absoluteUrl(href(path)),
              },
            }
          : {}),
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT20H",
          location: {
            "@type": "VirtualLocation",
            url: absoluteUrl(href("/cursos/power-bi")),
          },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      breadcrumbJsonLd([
        { name: "Inicio", path: href("/") },
        { name: L("Curso de Power BI online en vivo en Chile"), path: href(path) },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <article className="bg-canvas">
        <section className="border-b border-line">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <nav className="mb-8 text-sm text-mute" aria-label="Migas">
              <Link href={href("/")} className="no-underline hover:text-ink">
                Inicio
              </Link>
              <span className="mx-2 text-faint">/</span>
              <span className="text-ink">{L("Curso Power BI")}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
                  {L("Power BI · Chile")}
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl sm:leading-[1.08]">
                  {L("Curso de Power BI online en vivo en Chile")}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mute">
                  {L(
                    "Aprende Power Query, modelado y DAX con un caso real: un CSV de ventas por país que puedes cargar en Power BI Desktop y convertir en tablero. La plantilla es gratis y el curso va en vivo."
                  )}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={href("/cursos/power-bi")}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas no-underline transition-opacity hover:opacity-90"
                  >
                    {L("Ver el curso Power BI")}
                  </Link>
                  <PlantillaDescarga
                    pais={pais}
                    location="curso_power_bi_hero"
                    label="Descargar plantilla CSV"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
                  />
                </div>
                <p className="mt-4 text-xs text-faint">
                  CSV de ejemplo · Solo email · Compatible con Power BI Desktop
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-line bg-paper p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
                      Precio del curso
                    </p>
                    {precioTexto ? (
                      <>
                        <p className="mt-1 text-2xl font-bold tracking-tight text-ink tabular-nums">
                          {precioTexto}
                        </p>
                        {listaTexto ? (
                          <p className="mt-1 text-xs text-mute">
                            <span className="line-through">{listaTexto}</span>
                            {descuento > 0 ? (
                              <span className="ml-2 font-semibold text-ink">
                                {descuento}% menos
                              </span>
                            ) : null}
                          </p>
                        ) : null}
                        <p className="mt-2 text-xs leading-relaxed text-faint">
                          Moneda: {moneda}. El monto se confirma en el checkout.
                        </p>
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-mute">
                        El precio se muestra en la ficha del curso.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-line bg-paper p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
                      Horario de clases
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-ink tabular-nums">
                      {horario.inicio} a {horario.fin}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-faint">
                      Hora de {mercado.nombre} ({horario.offset}). En Chile:{" "}
                      {horario.inicioChile} a {horario.finChile}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-line bg-paper p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-mute">
                    Vista previa del CSV
                  </p>
                  <span className="rounded-full bg-wash px-3 py-1 text-[11px] font-semibold text-mute">
                    .csv
                  </span>
                </div>
                <div className="mt-5 overflow-x-auto rounded-xl border border-line bg-canvas">
                  <table className="w-full text-left text-xs" aria-label="Vista previa de la plantilla de ventas">
                    <thead className="bg-wash text-mute">
                      <tr>
                        <th className="px-3 py-2 font-semibold">País</th>
                        <th className="px-3 py-2 font-semibold">Moneda</th>
                        <th className="px-3 py-2 text-right font-semibold">Venta neta</th>
                        <th className="px-3 py-2 text-right font-semibold">Margen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line text-ink">
                      <tr>
                        <td className="px-3 py-2">Chile</td>
                        <td className="px-3 py-2">CLP</td>
                        <td className="px-3 py-2 text-right tabular-nums">118.800</td>
                        <td className="px-3 py-2 text-right tabular-nums">71.280</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Argentina</td>
                        <td className="px-3 py-2">ARS</td>
                        <td className="px-3 py-2 text-right tabular-nums">318.000</td>
                        <td className="px-3 py-2 text-right tabular-nums">190.800</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">México</td>
                        <td className="px-3 py-2">MXN</td>
                        <td className="px-3 py-2 text-right tabular-nums">65.700</td>
                        <td className="px-3 py-2 text-right tabular-nums">39.420</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Perú</td>
                        <td className="px-3 py-2">PEN</td>
                        <td className="px-3 py-2 text-right tabular-nums">5.235</td>
                        <td className="px-3 py-2 text-right tabular-nums">3.141</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Colombia</td>
                        <td className="px-3 py-2">COP</td>
                        <td className="px-3 py-2 text-right tabular-nums">7.497.500</td>
                        <td className="px-3 py-2 text-right tabular-nums">4.498.500</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Uruguay</td>
                        <td className="px-3 py-2">UYU</td>
                        <td className="px-3 py-2 text-right tabular-nums">59.900</td>
                        <td className="px-3 py-2 text-right tabular-nums">35.940</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-mute">
                  18 filas de ejemplo con ventas de los seis mercados. Las cifras son referenciales.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Qué trae la plantilla
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {incluidos.map((item) => (
              <div key={item.title} className="rounded-2xl border border-line bg-paper p-6">
                <h3 className="text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-line bg-paper">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Cómo usarla en Power BI
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-mute">
                  No hace falta un ERP ni datos sensibles. Con el CSV puedes recorrer el mismo flujo
                  que verás en clase: importar, limpiar, modelar y visualizar.
                </p>
                <PlantillaDescarga
                  pais={pais}
                  location="curso_power_bi_pasos"
                  label="Descargar plantilla CSV"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline transition-opacity hover:opacity-90"
                />
              </div>

              <ol className="space-y-4">
                {pasos.map((paso, i) => (
                  <li key={paso.title} className="flex gap-4 rounded-2xl border border-line bg-canvas p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-canvas">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-ink">{paso.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-mute">{paso.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {contenido ? (
          <section className="border-t border-line bg-wash/30">
            <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
              <div className="max-w-[46rem]">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
                  Casos de uso por industria
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Dónde se aplica lo que enseñas en {mercado.nombre}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-mute">
                  Escenarios de trabajo típicos de {mercado.nombre}. No son casos de clientes ni
                  cifras de resultados: son ejercicios para practicar con la lógica de cada
                  industria.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {contenido.casos.map((caso) => (
                  <article key={caso.titulo} className="rounded-2xl border border-line bg-paper p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
                      {caso.sector}
                    </p>
                    <h3 className="mt-3 text-base font-bold text-ink">{caso.titulo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{caso.descripcion}</p>
                    <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-faint">
                      <span className="font-semibold text-mute">Datos de partida:</span>{" "}
                      {caso.fuente}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Qué practicas en el curso
              </h2>
              <ul className="mt-6 space-y-3">
                {aprendizajes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-mute">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-6">
              <h3 className="text-lg font-bold text-ink">La plantilla es el punto de partida</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">
                En el curso Power BI trabajas con Power Query, modelo de datos, DAX y publicación.
                La plantilla te sirve para llegar con un caso propio y comparar tus avances.
              </p>
              <Link
                href={href("/cursos/power-bi")}
                className="mt-5 inline-flex text-sm font-semibold text-ink no-underline hover:text-mute"
              >
                Ver el curso Power BI →
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-paper">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Preguntas frecuentes
            </h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="cursor-pointer list-none text-base font-semibold text-ink">
                    {faq.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-3xl bg-ink px-6 py-10 text-center sm:px-10">
            <h2 className="text-2xl font-bold tracking-tight text-canvas sm:text-3xl">
              Descarga la plantilla y practica hoy
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-canvas/70">
              Empieza con el CSV y sigue con el curso en vivo para dominar Power Query, el modelo
              de datos y DAX.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <PlantillaDescarga
                pais={pais}
                location="curso_power_bi_final"
                label="Descargar plantilla CSV"
                className="inline-flex h-12 items-center justify-center rounded-full bg-canvas px-6 text-sm font-semibold text-ink no-underline transition-opacity hover:opacity-90"
              />
              <Link
                href={href("/cursos/power-bi")}
                className="inline-flex h-12 items-center justify-center rounded-full border border-canvas/25 px-6 text-sm font-semibold text-canvas no-underline transition-colors hover:bg-canvas/10"
              >
                {L("Ver el curso Power BI")}
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
