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
const RUTA = "/cursos/power-bi-bogota";
const RUTA_COMPLETA = `/${PAIS}${RUTA}`;

export function generateStaticParams(): { pais: string }[] {
  return [{ pais: PAIS }];
}

const TITULO = "Curso de Power BI en Bogotá en vivo por Zoom | ProgramBI";
const DESCRIPCION =
  "Aprende Power BI desde Bogotá con clases 100 % en vivo por Zoom (sin sede presencial), horario COT (UTC-5), valor en COP con 3 cuotas sin interés y certificado digital.";

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

const CASOS_BOGOTA = [
  {
    sector: "Banca y servicios financieros",
    titulo: "Seguimiento de cartera, colocación y riesgo por sucursal",
    descripcion:
      "Modelado de créditos, vencimientos y provisiones para áreas financieras en el centro empresarial de Bogotá sin depender de cruces manuales en Excel.",
    fuente: "Tablas de movimientos de cartera, tasas y calendarios de cierre mensual.",
  },
  {
    sector: "Salud, EPS e IPS",
    titulo: "Control de glosas, tiempos de atención y facturación",
    descripcion:
      "Consolidación de registros clínicos administrativos con Power Query para detectar cuellos de botella por sede y aseguradora.",
    fuente: "Reportes de facturación mensual, autorizaciones y radicación de cuentas.",
  },
  {
    sector: "Telecomunicaciones y servicios",
    titulo: "Análisis de rotación de clientes y cumplimiento de SLA",
    descripcion:
      "Medidas en DAX para calcular retención mensual, tickets resueltos y desempeño por regional desde fuentes operativas.",
    fuente: "Registros de suscripciones, órdenes de servicio y soporte técnico.",
  },
  {
    sector: "Consultoría y áreas contables",
    titulo: "Reportes ejecutivos de presupuesto frente a ejecución",
    descripcion:
      "Automatización de estados de resultados y centros de costo para firmas y departamentos administrativos en Bogotá y Cundinamarca.",
    fuente: "Auxiliares contables por centro de costo y presupuesto anual.",
  },
];

export default async function PowerBiBogotaPage({
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
      q: "¿Tienen sede física o clases presenciales en Bogotá?",
      a: "No. Todas las sesiones son 100 % en vivo por Zoom, sin sede presencial ni aulas en Bogotá. Esto permite grupos reducidos con instructor en directo y acceso a las grabaciones en el campus durante el curso.",
    },
    {
      q: "¿En qué horario se dictan las clases para Bogotá?",
      a: `Las sesiones en vivo son de ${horario.inicio} a ${horario.fin}, ${horaLocal} (COT UTC-5), pensadas para conectarte después de la jornada laboral sin desplazamientos por la ciudad.`,
    },
    {
      q: "¿Cómo puedo conocer el valor en pesos colombianos (COP)?",
      a: "El valor referencial está en COP con opción de pagar en 3 cuotas sin interés. Para proteger la actualización de tarifas por cohorte, puedes ver el monto exacto descargando el documento de Temario y precios en el formulario de esta página o consultando por WhatsApp.",
    },
    {
      q: "¿Qué incluye el curso y cómo coordino una clase gratis?",
      a: "El programa dura 20 horas prácticas cubriendo Power Query, modelado relacional, DAX y publicación de tableros, con certificado digital verificable. Si quieres probar la metodología antes de inscribirte, escríbenos por WhatsApp para coordinar una clase gratis sin fecha fija.",
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
        about: { "@type": "Thing", name: "Curso de Power BI en vivo para profesionales en Bogotá" },
        audience: {
          "@type": "Audience",
          audienceType: "Profesionales y equipos en Bogotá, Colombia",
          geographicArea: { "@type": "City", name: "Bogotá" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl(`/${PAIS}`) },
          { "@type": "ListItem", position: 2, name: "Cursos", item: absoluteUrl(`/${PAIS}/cursos`) },
          { "@type": "ListItem", position: 3, name: "Power BI Bogotá", item: absoluteUrl(RUTA_COMPLETA) },
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
          <span className="text-ink">Power BI Bogotá</span>
        </nav>

        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Bogotá y Cundinamarca · Clases en vivo por Zoom
        </p>
        <h1 className="mt-3 max-w-[24ch] text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
          Curso de Power BI en vivo para profesionales en Bogotá
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-mute">
          Aprende Power Query, modelado relacional y DAX con profesor en directo desde cualquier punto
          de Bogotá, sin perder horas en trancones. Las clases son{" "}
          <strong className="font-semibold text-ink">100 % en vivo por Zoom y sin sede presencial</strong>
          , en horario nocturno de Colombia ({horario.inicio} a {horario.fin} COT, UTC-5), con valor
          referencial en COP y opción de pagar en <strong className="font-semibold text-ink">3 cuotas sin interés</strong>.
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
            ctaPosition="bogota_hero"
            customText="Hola, estoy en Bogotá y quiero coordinar una clase gratis del curso de Power BI."
            className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-sm font-medium text-ink no-underline hover:bg-wash"
          >
            Coordinar clase gratis por WhatsApp
          </WhatsAppCta>
        </div>

        <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <CalendarClock size={14} aria-hidden /> Horario Bogotá
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
              Sin sede presencial en Bogotá. Grabaciones incluidas en el campus.
            </dd>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <CreditCard size={14} aria-hidden /> Facilidades
            </dt>
            <dd className="mt-2 text-lg font-bold tracking-tight text-ink">3 cuotas sin interés</dd>
            <dd className="mt-1 text-xs leading-relaxed text-mute">
              Valor referencial en COP disponible al descargar el temario y precios.
            </dd>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-mute">
              <ShieldCheck size={14} aria-hidden /> Respaldo
            </dt>
            <dd className="mt-2 text-lg font-bold tracking-tight text-ink">20 horas prácticas</dd>
            <dd className="mt-1 text-xs leading-relaxed text-mute">
              Certificado digital verificable al completar el programa.
            </dd>
          </div>
        </dl>

        <section aria-labelledby="bogota-sectores" className="mt-16">
          <h2 id="bogota-sectores" className="text-2xl font-bold tracking-tight text-ink">
            Aplicaciones de Power BI en industrias de Bogotá
          </h2>
          <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-mute">
            El tejido empresarial de la capital concentra sedes corporativas de banca, salud,
            telecomunicaciones y consultoría que requieren reportes confiables cada semana. Estos
            son escenarios habituales que puedes resolver con lo aprendido en clase:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CASOS_BOGOTA.map((caso) => (
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

        <section aria-labelledby="bogota-temario" className="mt-16 rounded-[26px] border border-line bg-paper p-6 sm:p-8">
          <h2 id="bogota-temario" className="text-2xl font-bold tracking-tight text-ink">
            Consulta el programa completo y las fechas para Colombia
          </h2>
          <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-mute">
            Descarga el PDF con los módulos detallados y el valor en pesos colombianos (COP) con
            opción de 3 cuotas sin interés. Si buscas una ruta más amplia que integre SQL Server y
            Python, revisa también{" "}
            <Link href={`/${PAIS}/cursos/analisis-de-datos`} className="font-semibold text-ink underline underline-offset-4">
              Análisis de datos
            </Link>{" "}
            o nuestro programa de{" "}
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
              source="ciudad-bogota"
              buttonLabel="Ver temario y precios"
              heading="Temario y precios para Colombia"
              idPrefix="bogota-brochure"
            />
          </div>
        </section>

        <section aria-labelledby="bogota-faq" className="mt-16">
          <h2 id="bogota-faq" className="text-2xl font-bold tracking-tight text-ink">
            Preguntas frecuentes desde Bogotá
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
