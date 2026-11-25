import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  Database,
  FileSpreadsheet,
  GraduationCap,
  LineChart,
  MessageCircle,
  Receipt,
  Sparkles,
  Target,
  Video,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import LogoSlider from "@/components/marketing/LogoSlider";
import AnalyticsPageEvent from "@/components/shared/AnalyticsPageEvent";
import CourseImage from "@/components/shared/CourseImage";
import { courses } from "@/lib/data/courses";
import { whatsappHref } from "@/lib/whatsapp";
import { EmpresasContactForm } from "./empresas-contact-form";
import { EmpresasFaq } from "./empresas-faq";
import { ArmaPrograma } from "./ArmaPrograma";
import { rutaLocal } from "@/lib/paises/rutas";
import {
  FAQS_EMPRESAS_US,
  HERO_EMPRESAS_US,
  INCLUDES_EMPRESAS_US,
  ISO_EMPRESAS_US,
} from "@/lib/data/empresas-us";
import {
  FAQS_EMPRESAS_ES,
  HERO_EMPRESAS_ES,
  INCLUDES_EMPRESAS_ES,
  ISO_EMPRESAS_ES,
  VERTICALS_EMPRESAS_ES,
} from "@/lib/data/empresas-es";

type EmpresasLandingProps = {
  /** Nombre del país de la ruta (/empresas es Chile; /pe/empresas, Perú). */
  paisNombre?: string;
  /** ISO de la ruta. Estados Unidos usa su propio texto, preguntas y enlaces. */
  iso?: string;
};

const WA = whatsappHref({
  page: "/empresas",
  intent: "empresas",
});

const INCLUDES = [
  {
    title: "En vivo, para el equipo",
    text: "Sesiones con mentor. No es un video suelto ni un curso masivo.",
  },
  {
    title: "Con sus datos",
    text: "Ejercicios sobre las planillas, sistemas y KPIs que ya usan.",
  },
  {
    title: "Factura a la empresa",
    text: "Propuesta, OC si hace falta y reporte de asistencia.",
  },
  {
    title: "El equipo queda haciendo el trabajo",
    text: "Salen armando reportes y consultas. No dependen de un consultor para cada filtro.",
  },
];

/** Íconos de «Qué ofrecemos», por posición (sirven para los textos de cada mercado). */
const ICONOS_INCLUDES: LucideIcon[] = [Video, Database, Receipt, Target];

const STEPS = [
  {
    n: "01",
    title: "Nos cuentas el caso",
    text: "Área, tamaño del grupo y qué necesitan saber hacer. 20–30 minutos.",
  },
  {
    n: "02",
    title: "Armamos el programa",
    text: "Temas, nivel, fechas y valor. Te llega una propuesta concreta.",
  },
  {
    n: "03",
    title: "Capacitamos en vivo",
    text: "El equipo practica con sus datos. Quedan grabaciones y material.",
  },
];

/** Del problema del área al curso que lo resuelve. */
const NECESIDADES: {
  icono: LucideIcon;
  problema: string;
  resultado: string;
  cursos: { slug: string; label: string }[];
}[] = [
  {
    icono: FileSpreadsheet,
    problema: "Los reportes se arman a mano en Excel cada semana",
    resultado: "Tableros que se actualizan solos y una sola versión de los números.",
    cursos: [
      { slug: "excel", label: "Excel" },
      { slug: "power-bi", label: "Power BI" },
    ],
  },
  {
    icono: Database,
    problema: "Los datos están en el ERP o en bases SQL y casi nadie los consulta",
    resultado: "El equipo saca sus propias consultas sin esperar a TI.",
    cursos: [
      { slug: "sql-server", label: "SQL Server" },
      { slug: "power-bi", label: "Power BI" },
    ],
  },
  {
    icono: Bot,
    problema: "Quieren usar IA en el trabajo, pero con criterio y cuidando los datos",
    resultado: "Uso diario de IA en correos, documentos, planillas y análisis.",
    cursos: [
      { slug: "ia-productividad", label: "IA en Productividad" },
      { slug: "copilot", label: "Copilot" },
      { slug: "chatgpt", label: "ChatGPT" },
    ],
  },
  {
    icono: Workflow,
    problema: "Tareas repetitivas se comen horas del equipo",
    resultado: "Flujos automáticos para aprobaciones, correos, archivos y cargas de datos.",
    cursos: [
      { slug: "power-automate", label: "Power Automate" },
      { slug: "python", label: "Python" },
    ],
  },
  {
    icono: LineChart,
    problema: "Necesitan análisis más profundo: tendencias, segmentos y proyecciones",
    resultado: "Análisis reproducibles en Python y modelos que el área entiende.",
    cursos: [
      { slug: "python", label: "Python" },
      { slug: "machine-learning", label: "Machine Learning" },
    ],
  },
  {
    icono: GraduationCap,
    problema: "Formar a un área completa en datos, desde cero",
    resultado: "Una ruta con SQL, Power BI y Python para el mismo grupo.",
    cursos: [{ slug: "analisis-de-datos", label: "Análisis de Datos" }],
  },
];

const TOOLS = [
  {
    href: "/empresas/diagnostico",
    eyebrow: "Gratis · 2 minutos",
    title: "Diagnóstico de madurez de datos (2 minutos)",
    text: "Diez preguntas sobre fuentes, reportes y calidad de datos. Al final ves el nivel de madurez del equipo y qué conviene reforzar.",
    cta: "Hacer el diagnóstico",
  },
  {
    href: "/empresas/calculadora-capacitacion",
    eyebrow: "Gratis · Cálculo en vivo",
    title: "Calculadora de ahorro por capacitación",
    text: "Cuántas horas al mes puede recuperar el equipo al automatizar reportes. Tú ajustas los supuestos y el cálculo se actualiza solo.",
    cta: "Calcular el ahorro",
  },
];

const VERTICALS = [
  {
    sector: "Minería y Operaciones",
    title: "Control de faena, flota y mantención",
    deliverables: [
      "Tableros de OEE, disponibilidad mecánica y cumplimiento de turnos.",
      "Seguimiento de órdenes de mantención, detenciones y consumo de insumos.",
      "Consolidación automatizada desde planillas de operación y bases SQL.",
    ],
  },
  {
    sector: "Finanzas y Control de Gestión",
    title: "Cierre mensual sin planillas manuales",
    deliverables: [
      "Reportes de presupuesto vs. real, márgenes por centro de costo y EERR.",
      "Flujo de caja proyectado, cuentas por cobrar y antigüedad de saldos.",
      "Modelos en Power Query y DAX replicables por el equipo contable.",
    ],
  },
  {
    sector: "Retail y Comercial",
    title: "Inventarios, rotación y margen por SKU",
    deliverables: [
      "Alertas de quiebres de stock, sobrestock y cobertura por tienda o bodega.",
      "Análisis de ventas por canal, vendedor, ticket promedio y margen neto.",
      "Segmentación de clientes y seguimiento de metas comerciales en vivo.",
    ],
  },
];

const EMPRESA_COURSES = [...courses].sort((a, b) => a.sortOrder - b.sortOrder);

/** Encabezado de sección común: eyebrow, título y bajada. */
function Encabezado({
  eyebrow,
  titulo,
  bajada,
  centrado = false,
}: {
  eyebrow: string;
  titulo: string;
  bajada?: string;
  centrado?: boolean;
}) {
  return (
    <div className={centrado ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0958d9]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{titulo}</h2>
      {bajada ? <p className="mt-4 text-base leading-relaxed text-mute">{bajada}</p> : null}
    </div>
  );
}

export function EmpresasLanding({ paisNombre = "Chile", iso }: EmpresasLandingProps) {
  const esUs = iso === ISO_EMPRESAS_US;
  const esEs = iso === ISO_EMPRESAS_ES;
  // Estados Unidos y España conservan sus rutas locales; el resto enlaza como siempre.
  const href = (destino: string) => ((esUs || esEs) && iso ? rutaLocal(iso, destino) : destino);
  return (
    <div className="bg-canvas text-ink">
      <AnalyticsPageEvent event="view_empresas" />
      <Hero paisNombre={paisNombre} esUs={esUs} esEs={esEs} href={href} />
      <LogoSlider className="border-0 bg-transparent" />
      <Necesidades href={href} />
      <Includes esUs={esUs} esEs={esEs} />
      <How />
      {!esUs && <Verticals esEs={esEs} />}
      <Topics esUs={esUs} esEs={esEs} href={href} />
      <Tools />
      <Faq esUs={esUs} esEs={esEs} />
      <Contact />
    </div>
  );
}

function Hero({
  paisNombre,
  esUs,
  esEs,
  href,
}: {
  paisNombre: string;
  esUs: boolean;
  esEs: boolean;
  href: (destino: string) => string;
}) {
  const hero = esUs ? HERO_EMPRESAS_US : esEs ? HERO_EMPRESAS_ES : null;
  const garantias = [
    "En vivo con mentor",
    "Con los datos de la empresa",
    "Factura y orden de compra",
    "Certificado por participante",
  ];
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(24,144,255,0.10),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(23,23,22,0.04),transparent_50%)]" />

      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14 lg:px-8 lg:py-20">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-[12px] font-semibold text-mute">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#1890ff]" />
            {hero ? hero.kicker : `Capacitación in-company · ${paisNombre}`}
          </p>
          <h1 className="mt-5 max-w-[22ch] text-[2.15rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.3rem]">
            {hero ? hero.titulo : `Capacitación en Power BI, Excel e IA para empresas en ${paisNombre}`}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            {hero
              ? hero.descripcion
              : "Programas cerrados para tu equipo: Power BI, Excel, SQL, Python, automatización e IA generativa. En vivo, con los datos de la empresa y factura corporativa."}
          </p>

          <ul className="mt-6 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
            {garantias.map((g) => (
              <li key={g} className="flex items-center gap-2 text-sm font-medium text-ink">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e6f4ff] text-[#0958d9]">
                  <Check size={12} strokeWidth={3} aria-hidden />
                </span>
                {g}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contacto"
              data-analytics-event="click_cotizar_empresas"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-[14.5px] font-semibold text-canvas no-underline shadow-md shadow-ink/10 transition-transform active:scale-[0.98]"
            >
              Pedir una propuesta
              <ArrowRight size={16} strokeWidth={2.4} />
            </a>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#15803D] px-6 text-[14.5px] font-semibold text-white no-underline transition-colors hover:bg-[#126c34] active:scale-[0.98]"
            >
              <MessageCircle size={16} aria-hidden /> WhatsApp
            </a>
          </div>

          <p className="mt-6 text-[13px] text-faint">
            No es el curso abierto. Es un programa para el equipo.
            {hero ? ` ${hero.nota}` : ""}
          </p>
        </div>

        <ArmaPrograma />
      </div>

      {/* Enlaces de profundidad (antes bajo los botones del hero): siguen en el HTML. */}
      <nav
        aria-label="Más sobre programas para empresas"
        className="relative border-t border-line bg-paper/60"
      >
        <ul className="mx-auto flex max-w-[1400px] gap-x-5 gap-y-1 overflow-x-auto px-4 py-3 text-[13px] [scrollbar-width:none] sm:flex-wrap sm:px-6 lg:px-8">
          {[
            { href: "/implementacion-power-bi", label: "Implementación Power BI" },
            { href: "/migrar-excel-a-power-bi", label: "Migrar de Excel a Power BI" },
            { href: "/casos", label: "Testimonios de alumnos" },
            { href: "/capacitacion-empresas", label: "Programas in-company" },
            { href: "/curso-power-bi-vs-pack-adopcion", label: "Curso vs. pack de adopción" },
            { href: "/por-que-fallan-proyectos-power-bi", label: "Por qué fallan proyectos Power BI" },
          ].map((e) => (
            <li key={e.href} className="shrink-0">
              <Link
                href={href(e.href)}
                className="inline-flex items-center gap-1 font-semibold text-ink no-underline underline-offset-4 hover:underline"
              >
                {e.label} <ArrowRight size={12} aria-hidden className="text-faint" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

function Necesidades({ href }: { href: (destino: string) => string }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <Encabezado
        eyebrow="Por dónde empezar"
        titulo="¿Qué problema quiere resolver tu equipo?"
        bajada="Elige el caso que más se parece al tuyo. Cada uno lleva al programa que lo resuelve; en la propuesta lo ajustamos al área y al nivel del grupo."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NECESIDADES.map((n) => {
          const Icono = n.icono;
          return (
            <article
              key={n.problema}
              className="group flex flex-col rounded-[24px] border border-line bg-paper p-6 transition-shadow hover:shadow-[0_20px_50px_-25px_rgba(23,23,22,0.25)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6f4ff] text-[#0958d9]">
                <Icono size={20} aria-hidden />
              </span>
              <h3 className="mt-4 text-[17px] font-semibold leading-snug tracking-tight text-ink">
                {n.problema}
              </h3>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-mute">
                <Sparkles size={14} className="mt-0.5 shrink-0 text-[#1890ff]" aria-hidden />
                {n.resultado}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {n.cursos.map((c) => (
                  <Link
                    key={c.slug}
                    href={href(`/cursos/${c.slug}?para=empresas`)}
                    className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas px-3 py-1.5 text-[13px] font-semibold text-ink no-underline transition-colors hover:border-[#1890ff] hover:text-[#0958d9]"
                  >
                    {c.label} <ArrowRight size={12} aria-hidden />
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Includes({ esUs, esEs }: { esUs: boolean; esEs: boolean }) {
  const items = esUs ? INCLUDES_EMPRESAS_US : esEs ? INCLUDES_EMPRESAS_ES : INCLUDES;
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Encabezado
          eyebrow="Qué ofrecemos"
          titulo="Capacitación in-company. Claro y directo."
          bajada="Formamos al equipo para que arme y mantenga sus propios reportes. Si también hay que construir un tablero, lo conversamos aparte."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icono = ICONOS_INCLUDES[i % ICONOS_INCLUDES.length];
            return (
              <div key={item.title} className="rounded-[22px] border border-line bg-canvas p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-canvas">
                  <Icono size={18} aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function How() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <Encabezado eyebrow="Cómo funciona" titulo="Tres pasos. Conversación, propuesta, clases." />
      <ol className="relative mt-10 grid gap-4 lg:grid-cols-3 lg:gap-6">
        <span
          aria-hidden
          className="absolute left-0 right-0 top-[27px] hidden h-px bg-gradient-to-r from-[#1890ff]/50 via-line to-transparent lg:block"
        />
        {STEPS.map((step) => (
          <li key={step.n} className="relative rounded-[22px] border border-line bg-paper p-6 lg:border-0 lg:bg-transparent lg:p-0">
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1890ff] text-lg font-bold text-white shadow-[0_10px_24px_-10px_rgba(24,144,255,0.8)]">
              {step.n}
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-mute">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Verticals({ esEs }: { esEs: boolean }) {
  const verticals = esEs ? VERTICALS_EMPRESAS_ES : VERTICALS;
  return (
    <section className="border-y border-line bg-ink text-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#69b1ff]">
            Aplicado a tu industria
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Qué construyen los equipos según industria
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Entregables concretos que tu equipo arma durante la capacitación sobre sus propias fuentes y reglas de negocio.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {verticals.map((v) => (
            <div key={v.sector} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#69b1ff]">{v.sector}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{v.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-white/75">
                {v.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#69b1ff]" strokeWidth={2.4} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Topics({
  esUs,
  esEs,
  href,
}: {
  esUs: boolean;
  esEs: boolean;
  href: (destino: string) => string;
}) {
  // «Análisis para minería» no se ofrece en Estados Unidos ni en España.
  const list =
    esUs || esEs
      ? EMPRESA_COURSES.filter((course) => course.slug !== "analitica-mineria")
      : EMPRESA_COURSES;
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Encabezado
          eyebrow="Cursos para empresas"
          titulo="Los mismos cursos, en formato equipo."
          bajada="En vivo, con los datos de la empresa y factura a la empresa. Toca un curso para verlo como empresa."
        />
        <Link
          href={href("/cursos")}
          className="text-sm font-semibold text-ink no-underline underline-offset-4 hover:underline"
        >
          Si alguien quiere un cupo en un curso abierto, está en /cursos →
        </Link>
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((course) => (
          <Link
            key={course.slug}
            href={href(`/cursos/${course.slug}?para=empresas`)}
            className="group flex items-center gap-4 rounded-[20px] border border-line bg-paper p-3 pr-4 no-underline transition-colors hover:border-[#1890ff]/50"
          >
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-wash">
              <CourseImage
                src={course.imageUrl}
                alt={course.title}
                fill
                loading="lazy"
                sizes="112px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[15px] font-semibold tracking-tight text-ink">{course.title}</h3>
              <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-mute">{course.shortDescription}</p>
            </div>
            <ArrowRight
              size={16}
              aria-hidden
              className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-[#0958d9]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

function Faq({ esUs, esEs }: { esUs: boolean; esEs: boolean }) {
  const faqs = esUs ? FAQS_EMPRESAS_US : esEs ? FAQS_EMPRESAS_ES : undefined;
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:px-8 lg:py-20">
        <div>
          <Encabezado eyebrow="Preguntas" titulo="Preguntas sobre la capacitación in-company" />
          <a
            href="#contacto"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0958d9] no-underline underline-offset-4 hover:underline"
          >
            ¿Otra duda? Escríbenos <ArrowRight size={14} aria-hidden />
          </a>
        </div>
        <EmpresasFaq faqs={faqs} />
      </div>
    </section>
  );
}

function Tools() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Encabezado eyebrow="Autoservicio" titulo="Herramientas gratis para tu equipo" />
        <p className="max-w-sm text-sm leading-relaxed text-mute">
          Sin costo. Sirven para llegar a la conversación con números concretos,
          no con intuiciones.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col justify-between rounded-[24px] border border-line bg-gradient-to-br from-[#e6f4ff]/70 via-paper to-paper p-6 no-underline transition-colors hover:border-[#1890ff]/50"
          >
            <div>
              <p className="inline-flex rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-[#0958d9] ring-1 ring-[#bae0ff]">
                {tool.eyebrow}
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{tool.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{tool.text}</p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink">
              {tool.cta}{" "}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contacto" className="scroll-mt-24 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-8 lg:py-20">
        <div className="lg:sticky lg:top-28">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0958d9]">Contacto</p>
          <h2 className="mt-3 max-w-[16ch] text-3xl font-bold tracking-tight sm:text-4xl">
            Cuéntanos del equipo. Te armamos una propuesta.
          </h2>
          <p className="mt-4 max-w-md text-mute">
            Respondemos con temas, formato y valor. Sin un proceso largo.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Propuesta para capacitación in-company",
              "Factura a la empresa",
              "WhatsApp +56 9 3540 9699",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e6f4ff] text-[#0958d9]">
                  <Check size={12} strokeWidth={3} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl shadow-[0_30px_80px_-40px_rgba(23,23,22,0.3)]">
          <EmpresasContactForm />
        </div>
      </div>
    </section>
  );
}
