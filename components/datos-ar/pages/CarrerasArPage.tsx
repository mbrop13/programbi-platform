import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowRight, Download } from "lucide-react";
import { CtaDatosAr } from "@/components/datos-ar/CtaDatosAr";
import { TablaCarrerasAr } from "@/components/datos-ar/TablaCarrerasAr";
import {
  getAnuarioDiu2024,
  getCarrerasAr,
  getDisciplinasPublicablesAr,
  getEstadoDiccionarioAr,
} from "@/lib/datos-ar/carreras";
import { enteroAr, periodoMesAr, pesosAr, tasaAr } from "@/lib/datos-ar/formato";
import {
  breadcrumbJsonLdAr,
  datasetAraucanoJsonLd,
  faqJsonLdAr,
  metadataDatosAr,
  type MigajaAr,
  type PreguntaAr,
} from "@/lib/datos-ar/seo";
import { jsonLdString } from "@/lib/seo";



const MIGAS: readonly MigajaAr[] = [
  { label: "Inicio", path: "/ar" },
  { label: "Datos de Argentina", path: "/ar/datos" },
  { label: "Carreras", path: "/ar/datos/carreras" },
];

const FAQS: readonly PreguntaAr[] = [
  {
    pregunta: "¿Por qué figuran códigos como «Disciplina #1» en vez del nombre de cada carrera?",
    respuesta:
      "La base pública del CEP XXI (Araucano 2016–2018 / SIPA 2019–2021) utiliza códigos numéricos de disciplina. Para no inventar nombres ni inducir a error, mostramos el código oficial exacto hasta incorporar el diccionario oficial publicado en datos.produccion.gob.ar.",
  },
  {
    pregunta: "¿Cómo se actualizan los salarios de 2019–2021 a octubre 2026?",
    respuesta:
      "Se multiplica la mediana salarial nominal registrada en SIPA (promedio 2019–2021) por el cociente entre el IPC Nivel General Nacional del INDEC de octubre 2026 y el IPC promedio de 2019–2021. Mostramos ambas cifras (nominal y ajustada) para total transparencia.",
  },
  {
    pregunta: "¿Qué mide el porcentaje con empleo registrado en SIPA y qué excluye?",
    respuesta:
      "Mide la proporción de graduados de las cohortes 2016–2018 que registraron salario en relación de dependencia en SIPA entre 2019 y 2021. Excluye a quienes trabajan como monotributistas, autónomos, en la informalidad o en el exterior.",
  },
  {
    pregunta: "¿El Anuario DIU 2024 mide demanda laboral?",
    respuesta:
      "No. El Anuario de Estadísticas Universitarias (DIU) mide matrícula académica: nuevos inscriptos, estudiantes totales, reinscriptos y egresados por rama en universidades estatales y privadas. Es una medida de elección estudiantil, no de vacantes del mercado laboral.",
  },
];

export async function metadataArCarreras({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "ar") return {};
  return metadataDatosAr({
    subpath: "carreras",
    title: "Carreras en Argentina: sueldo, salida laboral y demanda (datos oficiales)",
    description:
      "Explorá las 36 disciplinas universitarias de Argentina (Araucano / SIPA 2019–2021 ajustado por IPC a octubre 2026) y la matrícula del Anuario DIU 2024.",
  });
}

export async function PageArCarreras({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "ar") notFound();

  const data = getCarrerasAr();
  const disciplinas = getDisciplinasPublicablesAr();
  const diu = getAnuarioDiu2024();
  const estado = getEstadoDiccionarioAr();
  const mesAjuste = periodoMesAr(estado.mesAjusteIpc);

  const ordenadasPorSueldo = [...disciplinas].sort(
    (a, b) => b.medianaAjustadaOct2026 - a.medianaAjustadaOct2026
  );
  const topSueldo = ordenadasPorSueldo[0];
  const topSipa = [...disciplinas].sort(
    (a, b) => b.porcentajeSipaPct - a.porcentajeSipaPct
  )[0];

  const jsonLd = [
    breadcrumbJsonLdAr(MIGAS),
    faqJsonLdAr(FAQS),
    datasetAraucanoJsonLd({
      subpath: "carreras",
      name: "Salarios y empleo SIPA de graduados universitarios en Argentina (Araucano 2016–2018)",
      description:
        "Mediana salarial nominal (2019–2021), ajuste por IPC INDEC a octubre 2026 y porcentaje con empleo registrado en SIPA para 36 disciplinas con n >= 100.",
      temporalCoverage: "2019/2021",
      dateModified: data.actualizado,
      csvPath: "/ar/datos/carreras/csv/carreras-argentina.csv",
    }),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <header className="space-y-4">
        <nav aria-label="Ruta de navegación" className="text-xs text-muted-foreground sm:text-sm">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/ar" className="hover:text-foreground">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/ar/datos" className="hover:text-foreground">
                Datos de Argentina
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-foreground">
              Carreras
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              ¿Qué estudiar en Argentina? Sueldo y salida laboral por disciplina
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Datos oficiales del CEP XXI (Araucano 2016–2018 con salarios SIPA{" "}
              <strong className="font-semibold text-foreground">{estado.anioBase}</strong>{" "}
              ajustados por IPC INDEC a{" "}
              <strong className="font-semibold text-foreground">{mesAjuste}</strong>) y
              matrícula del Anuario DIU 2024.
            </p>
          </div>

          <a
            href="/ar/datos/carreras/csv/carreras-argentina.csv"
            download
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
          >
            <Download className="size-4" aria-hidden="true" />
            Descargar CSV (36 disciplinas)
          </a>
        </div>

        {/* Aviso bloqueo diccionario Araucano + año base en el primer pantallazo */}
        {!estado.disponible ? (
          <div
            role="note"
            className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-200"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong className="font-semibold">
                Códigos oficiales de disciplina ({estado.anioBase} → {mesAjuste}):
              </strong>{" "}
              los nombres oficiales de cada disciplina están pendientes de descarga del
              diccionario oficial en <code>datos.produccion.gob.ar</code>. Por rigor
              metodológico mostramos los códigos exactos (<code>Disciplina #1</code>, etc.) sin
              inventar etiquetas.
            </p>
          </div>
        ) : null}

        {/* KPIs en el primer pantallazo con año base y mes de ajuste */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Mayor mediana ajustada ({estado.anioBase} → {mesAjuste})
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
              {topSueldo ? pesosAr(topSueldo.medianaAjustadaOct2026) : "s/d"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {topSueldo
                ? `${topSueldo.nombreOficial ?? `Disciplina #${topSueldo.disciplinaId}`} · Nominal ${estado.anioBase}: ${pesosAr(topSueldo.medianaNominal)}`
                : ""}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Mayor % empleo registrado en SIPA ({estado.anioBase})
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
              {topSipa ? tasaAr(topSipa.porcentajeSipaPct) : "s/d"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {topSipa
                ? `${topSipa.nombreOficial ?? `Disciplina #${topSipa.disciplinaId}`} (n = ${enteroAr(topSipa.nConSalarioSipa)})`
                : ""}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Estudiantes universitarios (Anuario DIU 2024)
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
              {diu?.totalSistema ? enteroAr(diu.totalSistema.estudiantes) : "s/d"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {diu?.totalSistema
                ? `${enteroAr(diu.totalSistema.nuevosInscriptos)} nuevos inscriptos en 2024`
                : "Pregrado y grado"}
            </p>
          </div>
        </div>
      </header>

      {/* Enlaces a las otras 3 páginas de carreras y cursos */}
      <nav aria-label="Rankings de carreras" className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/ar/datos/carreras/mejor-pagadas"
          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
        >
          <span>Ranking: Mejor pagadas</span>
          <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
        </Link>
        <Link
          href="/ar/datos/carreras/salida-laboral"
          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
        >
          <span>Ranking: Mayor salida laboral</span>
          <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
        </Link>
        <Link
          href="/ar/datos/carreras/mas-demandadas"
          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
        >
          <span>Ranking: Más elegidas (DIU 2024)</span>
          <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
        </Link>
      </nav>

      {/* Gráfico + tabla ordenable */}
      <TablaCarrerasAr
        disciplinas={disciplinas}
        diccionarioDisponible={estado.disponible}
        anioBase={estado.anioBase}
        mesAjusteLabel={mesAjuste}
        mostrarGrafico
      />

      {/* Resumen Anuario DIU 2024 */}
      {diu ? (
        <section
          aria-labelledby="diu-resumen-titulo"
          className="rounded-2xl border border-border bg-card p-6 shadow-xs"
        >
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2 id="diu-resumen-titulo" className="text-lg font-bold text-foreground">
                Matrícula universitaria por rama (Anuario DIU 2024)
              </h2>
              <p className="text-xs text-muted-foreground">
                Pregrado y grado · Mide cantidad de inscriptos y estudiantes, no demanda
                laboral.
              </p>
            </div>
            <Link
              href="/ar/datos/carreras/mas-demandadas"
              className="text-sm font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Ver desglose estatal/privado →
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {diu.ramas.map((rama) => (
              <div
                key={rama.slug}
                className="rounded-xl border border-border bg-background p-4"
              >
                <p className="text-sm font-semibold text-foreground">{rama.rama}</p>
                <p className="mt-1 text-lg font-bold text-foreground tabular-nums">
                  {enteroAr(rama.nuevosInscriptos)}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    nuevos inscriptos
                  </span>
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {enteroAr(rama.estudiantes)} estudiantes totales ·{" "}
                  {enteroAr(rama.egresados)} egresados
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Metodología */}
      <section
        id="metodologia"
        aria-labelledby="metodologia-titulo"
        className="rounded-2xl border border-border bg-muted/30 p-6 space-y-3 text-sm leading-relaxed text-muted-foreground"
      >
        <h2 id="metodologia-titulo" className="text-lg font-bold text-foreground">
          Metodología y alcance de los datos
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Araucano + SIPA (CEP XXI):</strong>{" "}
            corresponde a graduados universitarios de las cohortes 2016–2018 observados en el
            Sistema Integrado Previsional Argentino (SIPA) entre 2019 y 2021 (licencia CC BY
            4.0). Se publican únicamente las {disciplinas.length} disciplinas con al menos{" "}
            <strong className="text-foreground">100 casos</strong> con salario SIPA (se
            excluyen disciplinas por debajo de ese umbral por secreto estadístico).
          </li>
          <li>
            <strong className="text-foreground">Qué excluye SIPA:</strong> registra empleo
            asalariado formal en relación de dependencia. No incluye monotributistas,
            trabajadores autónomos, empleo informal ni profesionales que trabajan para el
            exterior sin aportes locales.
          </li>
          <li>
            <strong className="text-foreground">Ajuste por IPC INDEC:</strong> los montos
            nominales 2019–2021 se expresan en pesos de {mesAjuste} usando el factor de
            variación del IPC Nivel General Nacional del INDEC (×
            {data.factorAjusteIpc.toFixed(2).replace(".", ",")}).
          </li>
          <li>
            <strong className="text-foreground">Anuario DIU 2024:</strong> mide matrícula
            universitaria (nuevos inscriptos, estudiantes, reinscriptos y egresados) en
            instituciones estatales y privadas; no mide demanda laboral de las empresas.
          </li>
        </ul>
        <p className="pt-1 text-xs">
          ¿Querés aprender a cruzar estas bases públicas vos mismo? Mirá nuestro{" "}
          <Link
            href="/ar/cursos/analisis-de-datos"
            className="font-medium text-foreground underline underline-offset-4"
          >
            programa de Análisis de Datos
          </Link>{" "}
          o el{" "}
          <Link
            href="/ar/cursos/excel"
            className="font-medium text-foreground underline underline-offset-4"
          >
            curso de Excel en vivo
          </Link>
          .
        </p>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-carreras-titulo" className="space-y-4">
        <h2 id="faq-carreras-titulo" className="text-xl font-bold text-foreground">
          Preguntas frecuentes
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((item) => (
            <details key={item.pregunta} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold text-foreground">
                {item.pregunta}
              </summary>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {item.respuesta}
              </p>
            </details>
          ))}
        </div>
      </section>

      <CtaDatosAr page="/ar/datos/carreras" ctaPosition="datos_ar_carreras" />
    </div>
  );
}
