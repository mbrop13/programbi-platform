import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarClock, CreditCard, ShieldCheck, Video } from "lucide-react";
import { BrochureGateForm } from "@/components/marketing/BrochureGateForm";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { getPais } from "@/config/paises";
import { etiquetaHoraLocal, horarioLocal } from "@/lib/paises/horarios";
import { metadataLocal } from "@/lib/paises/metadata";
import { absoluteUrl, jsonLdString } from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = false;

const PAIS = "co";
const RUTA = "/cursos/power-bi-medellin";
const RUTA_COMPLETA = `/${PAIS}${RUTA}`;

export function generateStaticParams(): { pais: string }[] {
  return [{ pais: PAIS }];
}

const TITULO = "Curso de Power BI en Medellín en vivo por Zoom | ProgramBI";
const DESCRIPCION =
  "Aprende Power BI desde Medellín y el Valle de Aburrá con clases 100 % en vivo por Zoom (sin sede presencial), horario COT (UTC-5), valor en COP y 3 cuotas sin interés.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== PAIS) return {};
  const base = metadataLocal({ pais, path: RUTA, title: TITULO, description: DESCRIPCION });
  const url = absoluteUrl(RUTA_COMPLETA);
  return {
    ...base,
    alternates: { canonical: url },
    openGraph: { ...base.openGraph, url },
  };
}

const CASOS_MEDELLIN = [
  {
    sector: "Manufactura e industria textil",
    titulo: "Control de producción, mermas y rotación de inventarios",
    descripcion:
      "Integración de órdenes de producción, materias primas y tiempos de planta en tableros dinámicos para equipos industriales del Valle de Aburrá.",
    fuente: "Reportes de planta, inventarios de bodega y órdenes de compra.",
  },
  {
    sector: "Logística y distribución regional",
    titulo: "Trazabilidad de despachos y costos por ruta",
    descripcion:
      "Unificación de guías de transporte, entregas a tiempo y novedades operativas con Power Query para operaciones en Antioquia y el eje cafetero.",
    fuente: "Planillas de despacho, tiempos de tránsito y liquidación de fletes.",
  },
  {
    sector: "Comercio y retail antioqueño",
    titulo: "Márgenes por punto de venta, categoría y temporada",
    descripcion:
      "Cálculo de ticket promedio, comparativos interanuales y quiebres de stock mediante medidas DAX listas para gerencia comercial.",
    fuente: "Ventas diarias de POS, catálogos de SKU y promociones.",
  },
  {
    sector: "Centros de servicios y tecnología",
    titulo: "Indicadores de productividad y facturación por proyecto",
    descripcion:
      "Seguimiento de horas registradas, rentabilidad por cliente y capacidad instalada para empresas de servicios y tecnología en Medellín.",
    fuente: "Registros de horas, contratos activos y presupuestos por proyecto.",
  },
];

export default async function PowerBiMedellinPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== PAIS) notFound();

  const info = getPais(PAIS);
  const horario = horarioLocal(PAIS);
  const horaLocal = etiquetaHoraLocal(PAIS);

  const faqs = [
    {
      q: "¿El curso tiene clases presenciales en Medellín o Envigado?",
      a: "No. Todas las clases son 100 % en vivo por Zoom, sin sede presencial en Medellín ni en el Valle de Aburrá. Puedes conectarte desde casa u oficina y revisar las grabaciones en el campus durante el curso.",
    },
    {
      q: "¿Cuál es el horario de clases para Medellín?",
      a: `Las sesiones en vivo se realizan de ${horario.inicio} a ${horario.fin}, ${horaLocal} (COT UTC-5), un bloque nocturno pensado para compatibilizar el estudio con tu jornada laboral.`,
    },
    {
      q: "¿Dónde veo el precio en pesos colombianos (COP)?",
      a: "El curso maneja un valor referencial en COP con posibilidad de pago en 3 cuotas sin interés. Para ver el precio actualizado de la próxima cohorte, solicita el Temario y precios en el formulario de esta página o escríbenos por WhatsApp.",
    },
    {
      q: "¿Puedo probar una clase antes de matricularme?",
      a: "Sí. Puedes coordinar una clase gratis sin fecha fija escribiendo directamente por WhatsApp, donde además resolvemos tus dudas sobre nivel previo y fechas de inicio.",
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
        about: { "@type": "Thing", name: "Curso de Power BI en vivo para profesionales en Medellín" },
        audience: {
          "@type": "Audience",
          audienceType: "Profesionales y equipos en Medellín y Antioquia, Colombia",
          geographicArea: { "@type": "City", name: "Medellín" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl(`/${PAIS}`) },
          { "@type": "ListItem", position: 2, name: "Cursos", item: absoluteUrl(`/${PAIS}/cursos`) },
          { "@type": "ListItem", position: 3, name: "Power BI Medellín", item: absoluteUrl(RUTA_COMPLETA) },
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
          <Link href={`/${PAIS}/cursos`} className="no-underline hover:text-ink">
            Cursos
          </Link>
          <span className="mx-2 text-faint">/</span>
          <span className="text-ink">Power BI Medellín</span>
        </nav>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Medellín y Valle de Aburrá · Clases en vivo por Zoom
        </p>
        <h1 className="mt-3 max-w-[24ch] text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
          Curso de Power BI en vivo para profesionales en Medellín
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-mute">
          Domina Power Query, modelado de datos y DAX con instructor en tiempo real desde Medellín o
          cualquier municipio del Valle de Aburrá. La formación es{" "}
          <strong className="font-semibold text-ink">100 % en vivo por Zoom y sin sede presencial</strong>
          , en horario nocturno de Colombia ({horario.inicio} a {horario.fin} COT, UTC-5), con valor
          referencial en COP y <strong className="font-semibold text-ink">3 cuotas sin interés</strong>.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${PAIS}/cursos/power-bi`}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-canvas no-underline"
          >
            Ver ficha del curso de Power BI <ArrowRight size={16} aria-hidden />
          </Link>
          <WhatsAppCta
            page={RUTA_COMPLETA}
            intent="curso"
            course="Power BI"
            courseSlug="power-bi"
            country={PAIS}
            ctaPosition="medellin_hero"
            customText="Hola, estoy en Medellín y quiero coordinar una clase gratis del curso de Power BI."
            className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-sm font-medium text-ink no-underline hover:bg-wash"
          >
            Coordinar clase gratis por WhatsApp
          </WhatsAppCta>
        </div>

        <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <CalendarClock size={14} aria-hidden /> Horario Medellín
            </dt>
            <dd className="mt-2 text-lg font-bold tracking-tight text-ink tabular-nums">
              {horario.inicio} a {horario.fin}
            </dd>
            <dd className="mt-1 text-xs leading-relaxed text-mute">{horaLocal} (UTC-5)</dd>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <Video size={14} aria-hidden /> Modalidad
            </dt>
            <dd className="mt-2 text-lg font-bold tracking-tight text-ink">100 % en vivo por Zoom</dd>
            <dd className="mt-1 text-xs leading-relaxed text-mute">
              Sin sede presencial en Medellín. Acceso a clases grabadas en el campus.
            </dd>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <CreditCard size={14} aria-hidden /> Facilidades
            </dt>
            <dd className="mt-2 text-lg font-bold tracking-tight text-ink">3 cuotas sin interés</dd>
            <dd className="mt-1 text-xs leading-relaxed text-mute">
              Valor referencial en COP al descargar el temario y precios.
            </dd>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <ShieldCheck size={14} aria-hidden /> Certificación
            </dt>
            <dd className="mt-2 text-lg font-bold tracking-tight text-ink">20 horas prácticas</dd>
            <dd className="mt-1 text-xs leading-relaxed text-mute">
              Certificado digital verificable emitido por ProgramBI.
            </dd>
          </div>
        </dl>

        <section aria-labelledby="medellin-sectores" className="mt-16">
          <h2 id="medellin-sectores" className="text-2xl font-bold tracking-tight text-ink">
            Escenarios reales en empresas de Medellín y Antioquia
          </h2>
          <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-mute">
            La industria antioqueña combina manufactura, logística, comercio y centros de servicios
            que demandan analítica ágil sin depender de reportes estáticos. Estos casos reflejan
            flujos frecuentes en la región:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CASOS_MEDELLIN.map((caso) => (
              <div key={caso.sector} className="rounded-2xl border border-line bg-paper p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-mute">
                  {caso.sector}
                </p>
                <p className="mt-2 text-base font-semibold tracking-tight text-ink">
                  {caso.titulo}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-mute">{caso.descripcion}</p>
                <p className="mt-3 border-t border-line pt-3 text-xs leading-relaxed text-faint">
                  <span className="font-semibold text-mute">Datos habituales:</span> {caso.fuente}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="medellin-temario" className="mt-16 rounded-[26px] border border-line bg-paper p-6 sm:p-8">
          <h2 id="medellin-temario" className="text-2xl font-bold tracking-tight text-ink">
            Descarga el temario detallado y conoce el valor en COP
          </h2>
          <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-mute">
            Solicita el documento PDF con el plan de estudios completo y el valor en pesos
            colombianos, con opción de 3 cuotas sin interés. Si también quieres combinar SQL Server
            y Python, explora nuestro programa de{" "}
            <Link href={`/${PAIS}/cursos/analisis-de-datos`} className="font-semibold text-ink underline underline-offset-4">
              Análisis de datos
            </Link>{" "}
            o el curso de{" "}
            <Link href={`/${PAIS}/cursos/mercado-financiero`} className="font-semibold text-ink underline underline-offset-4">
              analítica financiera
            </Link>
            .
          </p>
          <div className="mt-6">
            <BrochureGateForm
              slug="power-bi"
              courseTitle="Power BI"
              pais={PAIS}
              source="ciudad-medellin"
              buttonLabel="Ver temario y precios"
              heading="Temario y precios para Colombia"
              idPrefix="medellin-brochure"
            />
          </div>
        </section>

        <section aria-labelledby="medellin-faq" className="mt-16">
          <h2 id="medellin-faq" className="text-2xl font-bold tracking-tight text-ink">
            Preguntas frecuentes desde Medellín
          </h2>
          <div className="mt-5 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                  <span className="text-sm font-semibold leading-snug text-ink sm:text-base">
                    {faq.q}
                  </span>
                  <span className="text-xl leading-none text-faint group-open:hidden">+</span>
                  <span className="hidden text-xl leading-none text-faint group-open:block">-</span>
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
