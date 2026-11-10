import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Enlaces de entrada a las landings de nicho de la fase 5.
 *
 * Solo se montan en la versión chilena: las landings viven en la raíz y su
 * texto habla de Chile, así que no se enlazan desde /ar, /mx ni el resto de
 * los mercados. Los títulos y resúmenes salen del contenido real de cada
 * landing (`lib/data/landings-nicho.ts`, frente de landings de la fase 5).
 */
const OBJETIVOS = [
  {
    href: "/power-bi-para-finanzas",
    kicker: "Finanzas",
    title: "Analítica financiera con Power BI",
    text: "Presupuesto, margen y cierre de mes con un modelo que se actualiza solo.",
  },
  {
    href: "/power-bi-sql-server-python",
    kicker: "Ruta de datos",
    title: "Power BI, SQL Server y Python",
    text: "SQL para consultar, Power BI para modelar y Python para automatizar lo que se repite.",
  },
  {
    href: "/analisis-de-datos-mineria",
    kicker: "Minería",
    title: "Análisis de datos para minería",
    text: "Reportes de turno, OEE y mantenimiento con los datos que ya existen en faena.",
  },
  {
    href: "/capacitacion-empresas",
    kicker: "Empresas",
    title: "Capacitación in-company para equipos",
    text: "Un programa cerrado, armado con los datos y los reportes que ya usa tu área.",
  },
] as const;

/**
 * Fichas que van primero en la home, con el anchor exacto por el que compiten:
 * «curso power bi» y «curso de análisis de datos». El resto de enlaces del
 * bloque se mantiene; estos solo se anteponen. En /cursos no hacen falta
 * porque el catálogo ya muestra esas dos fichas arriba.
 */
const CURSOS_PRINCIPALES = [
  { href: "/cursos/power-bi", title: "Curso de Power BI en vivo" },
  { href: "/cursos/analisis-de-datos", title: "Curso de análisis de datos" },
] as const;

type Contexto = "home" | "cursos";

/** Cuatro tarjetas de objetivo, para la home y el catálogo. */
export function ObjetivosCursos({ contexto = "home" }: { contexto?: Contexto }) {
  return (
    <section
      aria-labelledby="cursos-por-objetivo"
      className="cv-auto border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Cursos por objetivo
        </p>
        <h2
          id="cursos-por-objetivo"
          className="mt-3 max-w-[28ch] text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          {contexto === "cursos"
            ? "Elige por el problema que quieres resolver"
            : "No todos llegan por el mismo motivo"}
        </h2>
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-mute">
          Cuatro rutas armadas según lo que necesitas hacer en el trabajo, no según la
          herramienta de moda. Cada una enlaza a la ficha o al programa que corresponde.
        </p>

        {contexto === "home" ? (
          <nav
            aria-label="Cursos principales"
            className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-5"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
              Cursos principales
            </span>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink">
              {CURSOS_PRINCIPALES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 no-underline underline-offset-4 hover:underline"
                  >
                    {item.title}
                    <ArrowRight size={14} className="text-mute" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {OBJETIVOS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-5 no-underline transition-colors hover:border-ink/25"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-faint">
                  {item.kicker}
                </span>
                <span className="mt-1.5 flex items-start justify-between gap-3 text-base font-semibold leading-snug text-ink">
                  {item.title}
                  <ArrowRight
                    size={15}
                    className="mt-1 shrink-0 text-mute transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
                <span className="mt-2 text-sm leading-relaxed text-mute">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Comparativas, glosario, FAQ y bolsa de trabajo. Son las páginas chilenas que
 * el índice de Google todavía no tiene: se enlazan con el nombre real de cada
 * una y con una línea de contexto, no como una lista de URLs.
 */
const RECURSOS = [
  {
    href: "/versus",
    title: "Comparativas de herramientas de datos",
    text: "Power BI vs Excel, SQL Server vs PostgreSQL y Python vs R, con criterio para elegir.",
  },
  {
    href: "/versus/desafio-latam-vs-programbi",
    title: "Desafío Latam vs ProgramBI",
    text: "Bootcamp de 32 semanas o curso de 20 horas: para quién es cada formato.",
  },
  {
    href: "/versus/programbi-vs-coderhouse-power-bi",
    title: "ProgramBI vs Coderhouse en Power BI",
    text: "Horas en vivo, precio por hora y certificado, con las fuentes y la fecha de revisión.",
  },
  {
    href: "/versus/ips-datax-vs-programbi",
    title: "IPS DATAX vs ProgramBI",
    text: "Curso grabado a tu ritmo o cohorte en vivo con horario y profesor.",
  },
  {
    href: "/cursos/machine-learning",
    title: "Curso de Machine Learning",
    text: "Regresión, clasificación y redes neuronales con Python, en nivel avanzado.",
  },
  {
    href: "/power-bi-mineria-chile",
    title: "Power BI para minería en Chile",
    text: "Reportes de faena, OEE y el Excel que cuesta soltar, con el curso o el pack in-company.",
  },
  {
    href: "/glosario",
    title: "Glosario de términos de datos",
    text: "SQL, DAX, Power BI y Machine Learning definidos para usar en una reunión.",
  },
  {
    href: "/faq",
    title: "Preguntas frecuentes",
    text: "Clases, grabaciones, certificados, cuotas y medios de pago por país.",
  },
  {
    href: "/empleos",
    title: "Bolsa de trabajo de datos",
    text: "Perfiles con certificados verificados y preinscripción abierta para candidatos y empresas.",
  },
  {
    href: "/empleos/vacantes",
    title: "Vacantes publicadas",
    text: "Ofertas de datos y tecnología de empresas verificadas, con postulación en línea.",
  },
] as const;

/** Bloque de recursos. `contexto` cambia solo el encabezado. */
export function RecursosDatos({ contexto = "home" }: { contexto?: Contexto }) {
  return (
    <section
      aria-labelledby="recursos-datos"
      className="cv-auto border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Para decidir con datos
        </p>
        <h2
          id="recursos-datos"
          className="mt-3 max-w-[30ch] text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          {contexto === "cursos"
            ? "Compara, consulta y sigue con tu carrera"
            : "Comparativas, glosario y bolsa de trabajo"}
        </h2>
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-mute">
          Páginas de apoyo para elegir herramienta, resolver una duda puntual o buscar
          trabajo en datos. Todas se actualizan con la misma información de precios y
          horarios del sitio.
        </p>

        <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {RECURSOS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group block no-underline">
                <span className="inline-flex items-start gap-1.5 text-base font-semibold leading-snug text-ink underline-offset-4 group-hover:underline">
                  {item.title}
                  <ArrowRight
                    size={14}
                    className="mt-1 shrink-0 text-mute transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
                <span className="mt-1 block max-w-[52ch] text-sm leading-relaxed text-mute">
                  {item.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
