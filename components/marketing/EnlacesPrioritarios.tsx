import Link from "next/link";

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
    href: "/power-bi-mineria-chile",
    kicker: "Minería",
    title: "Power BI y análisis de datos para minería",
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
 * "curso power bi" y "curso de análisis de datos". El resto de enlaces del
 * bloque se mantiene; estos solo se anteponen. En /cursos no hacen falta
 * porque el catálogo ya muestra esas dos fichas arriba.
 */
const CURSOS_PRINCIPALES = [
  {
    href: "/cursos/power-bi",
    title: "Curso de Power BI en vivo",
    detail: "Modelado DAX, Power Query y tableros ejecutivos en clases en directo.",
  },
  {
    href: "/cursos/analisis-de-datos",
    title: "Curso de análisis de datos",
    detail: "Ruta integral con Power BI, SQL Server y Python desde fundamentos.",
  },
] as const;

type Contexto = "home" | "cursos";

/** Bloque de rutas por objetivo: dos caminos principales + cuatro objetivos en lista editorial. */
export function ObjetivosCursos({ contexto = "home" }: { contexto?: Contexto }) {
  return (
    <section
      aria-labelledby="cursos-por-objetivo"
      className="home-scope cv-auto border-t border-[var(--h-border)] bg-[var(--h-bg)] py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--h-subtle)]">
              Cursos por objetivo
            </p>
            <h2
              id="cursos-por-objetivo"
              className="mt-2.5 max-w-[26ch] text-balance text-2xl font-bold tracking-tight text-[var(--h-ink)] sm:text-3xl"
            >
              {contexto === "cursos"
                ? "Elige por el problema que quieres resolver"
                : "No todos llegan por el mismo motivo"}
            </h2>
          </div>
          <p className="max-w-[54ch] text-sm leading-relaxed text-[var(--h-muted)] lg:col-span-5">
            Cuatro rutas armadas según lo que necesitas hacer en el trabajo, no según la herramienta
            de moda. Cada una enlaza a la ficha o al programa que corresponde.
          </p>
        </div>

        {contexto === "home" ? (
          <nav aria-label="Cursos principales" className="mt-8 grid gap-4 md:grid-cols-2">
            {CURSOS_PRINCIPALES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-[44px] flex-col justify-between gap-3 rounded-xl border border-[var(--h-border-strong)] bg-[var(--h-surface)] p-5 no-underline transition-colors hover:border-[var(--h-ink)] sm:flex-row sm:items-center sm:p-6"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-accent)]">
                    Programa principal
                  </span>
                  <span className="mt-1 block text-lg font-bold tracking-tight text-[var(--h-ink)]">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--h-muted)]">{item.detail}</span>
                </div>
                <span className="shrink-0 text-sm font-semibold text-[var(--h-ink)] underline-offset-4 group-hover:text-[var(--h-accent)] group-hover:underline">
                  Ver programa
                </span>
              </Link>
            ))}
          </nav>
        ) : null}

        <ol className="mt-10 grid grid-cols-1 border-t border-[var(--h-border)] md:grid-cols-2 md:gap-x-10">
          {OBJETIVOS.map((item, idx) => (
            <li key={item.href} className="border-b border-[var(--h-border)]">
              <Link
                href={item.href}
                className="group flex min-h-[44px] items-start gap-4 py-5 no-underline"
              >
                <span className="mt-0.5 shrink-0 font-mono text-xs font-semibold tabular-nums text-[var(--h-accent)]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--h-subtle)]">
                    {item.kicker}
                  </span>
                  <span className="mt-1 block text-base font-bold leading-snug text-[var(--h-ink)] transition-colors group-hover:text-[var(--h-accent)]">
                    {item.title}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-[var(--h-muted)]">
                    {item.text}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
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
    href: "/plantillas",
    title: "Plantillas gratuitas de Power BI y SQL",
    text: "8 datasets descargables con medidas DAX, 40 ejercicios SQL resueltos y notebook Python.",
  },
  {
    href: "/simulador-pl-300",
    title: "Simulador gratuito examen PL-300",
    text: "40 preguntas técnicas en español por dominio oficial, puntaje sobre 1000 y explicaciones.",
  },
  {
    href: "/herramientas/excel-a-dax",
    title: "Conversor de fórmulas Excel a DAX",
    text: "Traduce BUSCARV, SUMAR.SI, SI.ERROR y 25 fórmulas más de Excel a Power BI.",
  },
  {
    href: "/sueldos-analista-datos-chile",
    title: "Sueldos analista de datos en Chile",
    text: "Benchmark salarial referencial por rol y calculadora Bruto a Líquido.",
  },
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
    href: "/glosario",
    title: "Glosario de términos de datos",
    text: "SQL, DAX, Power BI y Machine Learning definidos para usar en una reunión.",
  },
  {
    href: "/preguntas-frecuentes",
    title: "Preguntas frecuentes",
    text: "Clases, grabaciones, certificados, cuotas y medios de pago por país.",
  },
  {
    href: "/cursos/sql-server",
    title: "Curso SQL Server en vivo",
    text: "Consultas SELECT, JOINs, GROUP BY y procedimientos almacenados en SQL Server, 20 horas por nivel.",
  },
  {
    href: "/cursos/python",
    title: "Curso Python para análisis de datos",
    text: "Pandas, limpieza, visualización y automatización de reportes en vivo desde cero, 20 horas por nivel.",
  },
  {
    href: "/curso-power-bi-vs-pack-adopcion",
    title: "Curso Power BI vs. pack de adopción",
    text: "Cuándo conviene formar al equipo con el curso y cuándo sumar implementación o pack in-company.",
  },
  {
    href: "/por-que-fallan-proyectos-power-bi",
    title: "Por qué fallan los proyectos de Power BI",
    text: "Causas reales por las que los tableros quedan sin uso y cómo evitarlas antes de implementar.",
  },
] as const;

/** Directorio editorial de recursos. `contexto` cambia solo el encabezado. */
export function RecursosDatos({ contexto = "home" }: { contexto?: Contexto }) {
  return (
    <section
      aria-labelledby="recursos-datos"
      className="home-scope cv-auto border-t border-[var(--h-border)] bg-[var(--h-wash)] py-14 lg:py-16"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--h-subtle)]">
              Para decidir con datos
            </p>
            <h2
              id="recursos-datos"
              className="mt-2.5 max-w-[30ch] text-balance text-2xl font-bold tracking-tight text-[var(--h-ink)] sm:text-3xl"
            >
              {contexto === "cursos"
                ? "Compara, consulta y sigue con tu carrera"
                : "Plantillas, herramientas gratuitas y comparativas"}
            </h2>
          </div>
          <p className="max-w-[54ch] text-sm leading-relaxed text-[var(--h-muted)] lg:col-span-5">
            Recursos gratuitos para practicar con datasets reales, simular el PL-300, comparar
            herramientas o resolver dudas sobre el programa.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-1 border-t border-[var(--h-border-strong)] sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
          {RECURSOS.map((item) => (
            <li key={item.href} className="border-b border-[var(--h-border)]">
              <Link href={item.href} className="group block min-h-[44px] py-4 no-underline">
                <span className="block text-[15px] font-semibold leading-snug text-[var(--h-ink)] underline-offset-4 group-hover:text-[var(--h-accent)] group-hover:underline">
                  {item.title}
                </span>
                <span className="mt-1 block max-w-[52ch] text-[13px] leading-snug text-[var(--h-muted)]">
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
