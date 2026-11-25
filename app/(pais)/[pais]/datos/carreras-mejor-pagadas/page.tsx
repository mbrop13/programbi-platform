import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Download,
  TrendingUp,
} from "lucide-react";
import CtaDatosMx from "@/components/datos-mx/CtaDatosMx";
import GraficoTopCarrerasMx from "@/components/datos-mx/GraficoTopCarrerasMx";
import TablaCarrerasMx from "@/components/datos-mx/TablaCarrerasMx";
import {
  getCarreraMxPorClave,
  getCarrerasPublicablesMx,
  getMetaCarrerasMx,
  getTodasLasCarrerasMx,
} from "@/lib/datos-mx/carreras";
import { enteroMx, pesosMx, porcentajeMx } from "@/lib/datos-mx/formato";
import {
  jsonLdBreadcrumbListMx,
  jsonLdDatasetMx,
  jsonLdFaqPageMx,
  jsonLdItemListMx,
  metadataHubCarrerasMx,
  MIGAS_BASE_MX,
} from "@/lib/datos-mx/seo";
import type { FaqItemMx } from "@/lib/datos-mx/types";
import { jsonLdString } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ pais: "mx" }];
}

const TITLE = "Carreras mejor pagadas en México 2026: sueldo y campo laboral";
const DESCRIPTION =
  "Las carreras mejor pagadas de México en 2026 según IMCO e INEGI: ingreso mensual, desempleo, informalidad y las carreras con más campo laboral";
const CSV_PATH =
  "/mx/datos/carreras-mejor-pagadas/csv/carreras-mexico-imco-2026.csv";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "mx") return {};

  const base = metadataHubCarrerasMx();
  return {
    ...base,
    title: { absolute: TITLE },
    description: DESCRIPTION,
    openGraph: {
      ...base.openGraph,
      title: TITLE,
      description: DESCRIPTION,
    },
    twitter: {
      ...base.twitter,
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default async function CarrerasMejorPagadasMxPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "mx") notFound();

  const meta = getMetaCarrerasMx();
  const publicables = getCarrerasPublicablesMx();
  const todas = getTodasLasCarrerasMx();

  // Bloque 1: Top 10 por ingreso promedio mensual
  const top10 = publicables.slice(0, 10);
  const top10Chart = top10.map((c) => ({
    slug: c.slug,
    carrera: c.carrera,
    ingreso: c.ingreso ?? 0,
    tasaDesocupacion: c.tasaDesocupacion,
  }));

  // Bloque 3: Carreras con más campo laboral (menor suma de desocupación + informalidad)
  const topCampoLaboral = [...publicables]
    .filter((c) => c.tasaDesocupacion !== null && c.tasaInformalidad !== null)
    .sort(
      (a, b) =>
        (a.tasaDesocupacion ?? 1) +
        (a.tasaInformalidad ?? 1) -
        ((b.tasaDesocupacion ?? 1) + (b.tasaInformalidad ?? 1))
    )
    .slice(0, 8);

  // Bloque 4: Las más demandadas en universidades (menor tasa de aceptación y más solicitudes)
  const menorAceptacion = [...publicables]
    .filter((c) => c.tasaAceptacion !== null && c.solicitudes !== null)
    .sort((a, b) => (a.tasaAceptacion ?? 1) - (b.tasaAceptacion ?? 1))
    .slice(0, 6);

  const masSolicitudes = [...publicables]
    .filter((c) => c.solicitudes !== null)
    .sort((a, b) => (b.solicitudes ?? 0) - (a.solicitudes ?? 0))
    .slice(0, 6);

  // Bloque 8: FAQs calculadas del JSON
  const numeroUno = top10[0];
  const civil = getCarreraMxPorClave("732");
  const topCampoNombres = topCampoLaboral
    .slice(0, 3)
    .map((c) => c.carrera)
    .join(", ");

  const faqs: FaqItemMx[] = [
    {
      pregunta: "¿Cuál es la carrera mejor pagada en México?",
      respuesta: `Según ${meta.fuente}, la carrera mejor pagada en México en 2026 es ${numeroUno.carrera}, con un ingreso mensual promedio de ${pesosMx(numeroUno.ingreso)} y una mediana (Q50) de ${pesosMx(numeroUno.ingresoQ50)}, además de una tasa de desocupación de ${porcentajeMx(numeroUno.tasaDesocupacion)}.`,
    },
    {
      pregunta: "¿Qué carreras tienen más campo laboral?",
      respuesta: `Al combinar menor tasa de desocupación e informalidad (campo laboral = proporción de profesionistas de la carrera que tienen trabajo, según IMCO), destacan ${topCampoNombres}. Puedes revisar la lista completa y ordenar por desocupación o informalidad en la tabla de esta página.`,
    },
    {
      pregunta: "¿Cuánto gana un ingeniero civil en México?",
      respuesta: civil
        ? `La carrera ${civil.carrera} ocupa el lugar #${civil.posicionIngreso} de ${meta.totalPublicables} en México con un ingreso mensual promedio de ${pesosMx(civil.ingreso)} (rango intercuartílico de ${pesosMx(civil.ingresoQ25)} a ${pesosMx(civil.ingresoQ75)}), desocupación de ${porcentajeMx(civil.tasaDesocupacion)} e informalidad de ${porcentajeMx(civil.tasaInformalidad)}.`
        : "Construcción e ingeniería civil se ubica entre las ingenierías con mejor remuneración en el comparativo IMCO 2026.",
    },
  ];

  const jsonLd = [
    jsonLdDatasetMx({
      name: TITLE,
      description: DESCRIPTION,
      path: "/mx/datos/carreras-mejor-pagadas",
      distributionCsvPath: CSV_PATH,
    }),
    jsonLdItemListMx(publicables, "Carreras mejor pagadas en México 2026"),
    jsonLdBreadcrumbListMx(MIGAS_BASE_MX),
    jsonLdFaqPageMx(faqs),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <nav aria-label="Ruta de navegación" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/mx" className="hover:text-foreground">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/mx/datos" className="hover:text-foreground">
              Datos de México
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-foreground">
            Carreras mejor pagadas
          </li>
        </ol>
      </nav>

      <header className="max-w-3xl space-y-4">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          {meta.fuente}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Carreras mejor pagadas en México 2026 (IMCO con datos del INEGI)
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Compara cuánto gana un profesionista en México según su carrera:
          revisamos las {meta.totalCarreras} carreras del comparativo oficial (
          {meta.totalPublicables} con ingreso publicado y {meta.totalExcluidas}{" "}
          sin dato de ingreso en la ENOE), con mediana salarial de{" "}
          <strong className="font-semibold text-foreground">
            {pesosMx(meta.medianaIngresoPublicables)}
          </strong>{" "}
          mensuales.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="#tabla-completa"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90 sm:text-sm"
          >
            Ver tabla de {meta.totalCarreras} carreras
          </a>
          <a
            href={CSV_PATH}
            download
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover sm:text-sm"
          >
            <Download className="size-4" />
            Descargar CSV
          </a>
          <Link
            href="/mx/datos/carreras"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover sm:text-sm"
          >
            Índice de {meta.totalPublicables} fichas
          </Link>
        </div>
      </header>

      {/* Bloque 1: Top 10 por ingreso promedio mensual + tasa de desocupación + GraficoTopCarrerasMx */}
      <section aria-labelledby="top-10-heading" className="space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Award className="size-4" />
            Bloque 1 · Ranking salarial
          </div>
          <h2
            id="top-10-heading"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Top 10 carreras mejor pagadas en México 2026
          </h2>
          <p className="text-sm text-muted-foreground">
            Ingreso mensual promedio y tasa de desocupación para los primeros 10
            lugares del país.
          </p>
        </div>

        <GraficoTopCarrerasMx data={top10Chart} />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {top10.map((c) => (
            <Link
              key={c.cveCarrera}
              href={`/mx/datos/carreras/${c.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-foreground/30 hover:bg-surface-hover/50"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  #{c.posicionIngreso}
                </span>
                <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:underline">
                  {c.carrera}
                </h3>
              </div>
              <div className="mt-3 space-y-0.5 border-t border-border pt-2.5 text-xs tabular-nums">
                <p className="text-sm font-bold text-foreground">
                  {pesosMx(c.ingreso)}/mes
                </p>
                <p className="text-muted-foreground">
                  Desocupación:{" "}
                  {c.tasaDesocupacion !== null
                    ? porcentajeMx(c.tasaDesocupacion)
                    : "s/i"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bloque 2: Tabla ordenable de las 79 carreras */}
      <section
        id="tabla-completa"
        aria-labelledby="tabla-79-heading"
        className="space-y-4"
      >
        <div className="space-y-1">
          <h2
            id="tabla-79-heading"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Las {meta.totalCarreras} carreras en México: ingreso, P25–P75 y
            campo laboral
          </h2>
          <p className="text-sm text-muted-foreground">
            Haz clic en cualquier columna para ordenar. Las {meta.totalPublicables}{" "}
            carreras con ingreso publicado enlazan a su ficha individual; las{" "}
            {meta.totalExcluidas} sin muestra de ingreso suficiente en la ENOE se
            muestran como «sin dato de ingreso».
          </p>
        </div>

        <TablaCarrerasMx carreras={todas} />
      </section>

      {/* Bloque 3: Carreras con más campo laboral en México */}
      <section aria-labelledby="campo-laboral-heading" className="space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Briefcase className="size-4" />
            Estabilidad y formalidad
          </div>
          <h2
            id="campo-laboral-heading"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Carreras con más campo laboral en México
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Criterio de ordenamiento: combinamos la menor tasa de desocupación
            con la menor tasa de informalidad (campo laboral = proporción de
            profesionistas de la carrera que tienen trabajo, según IMCO).
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topCampoLaboral.map((c, idx) => (
            <Link
              key={c.cveCarrera}
              href={`/mx/datos/carreras/${c.slug}`}
              className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-foreground/30 hover:bg-surface-hover/50"
            >
              <p className="text-xs font-semibold text-muted-foreground tabular-nums">
                #{idx + 1} en estabilidad laboral
              </p>
              <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:underline">
                {c.carrera}
              </h3>
              <dl className="mt-3 space-y-1 text-xs text-muted-foreground tabular-nums">
                <div className="flex justify-between">
                  <dt>Desocupación</dt>
                  <dd className="font-semibold text-foreground">
                    {porcentajeMx(c.tasaDesocupacion)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Informalidad</dt>
                  <dd className="font-semibold text-foreground">
                    {porcentajeMx(c.tasaInformalidad)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Ingreso promedio</dt>
                  <dd className="font-semibold text-foreground">
                    {pesosMx(c.ingreso)}
                  </dd>
                </div>
              </dl>
            </Link>
          ))}
        </div>
      </section>

      {/* Bloque 4: Las más demandadas en universidades */}
      <section aria-labelledby="demandadas-heading" className="space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <BookOpen className="size-4" />
            Admisión universitaria (ANUIES)
          </div>
          <h2
            id="demandadas-heading"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Las más demandadas en universidades de México
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Nota importante: estos indicadores de demanda refieren al ingreso a
            universidades (solicitudes y lugares disponibles en ANUIES) y no a
            vacantes de empleo.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <h3 className="text-base font-semibold text-foreground">
              Menor tasa de aceptación (lugares / solicitudes)
            </h3>
            <ul className="divide-y divide-border text-sm">
              {menorAceptacion.map((c) => (
                <li
                  key={c.cveCarrera}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <Link
                    href={`/mx/datos/carreras/${c.slug}`}
                    className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    {c.carrera}
                  </Link>
                  <span className="shrink-0 text-xs font-semibold text-foreground tabular-nums">
                    {porcentajeMx(c.tasaAceptacion, 0)} aceptación (
                    {enteroMx(c.solicitudes)} sol.)
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <h3 className="text-base font-semibold text-foreground">
              Mayor volumen de solicitudes universitarias
            </h3>
            <ul className="divide-y divide-border text-sm">
              {masSolicitudes.map((c) => (
                <li
                  key={c.cveCarrera}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <Link
                    href={`/mx/datos/carreras/${c.slug}`}
                    className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    {c.carrera}
                  </Link>
                  <span className="shrink-0 text-xs font-semibold text-foreground tabular-nums">
                    {enteroMx(c.solicitudes)} solicitudes
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bloque 5: Habilidades que suben el sueldo en cualquier carrera */}
      <section
        aria-labelledby="habilidades-heading"
        className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <TrendingUp className="size-4" />
            Ventaja salarial transversal
          </div>
          <h2
            id="habilidades-heading"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Habilidades que suben el sueldo en cualquier carrera
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Sin importar si estudiaste ingeniería, finanzas, administración o
            ciencias de la salud, dominar herramientas de datos multiplica tu
            productividad y abre acceso a puestos mejor remunerados en México.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/mx/cursos/excel"
            className="group rounded-xl border border-border bg-background p-5 transition-colors hover:border-foreground/30"
          >
            <h3 className="text-base font-semibold text-foreground group-hover:underline">
              Curso de Excel en vivo
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fórmulas avanzadas, tablas dinámicas, Power Query y automatización
              de reportes.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-foreground">
              Ver programa en México
              <ArrowRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href="/mx/cursos/power-bi"
            className="group rounded-xl border border-border bg-background p-5 transition-colors hover:border-foreground/30"
          >
            <h3 className="text-base font-semibold text-foreground group-hover:underline">
              Curso de Power BI en vivo
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Modelado de datos, DAX y tableros ejecutivos conectados a tus
              fuentes reales.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-foreground">
              Ver programa en México
              <ArrowRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href="/mx/cursos/analisis-de-datos"
            className="group rounded-xl border border-border bg-background p-5 transition-colors hover:border-foreground/30"
          >
            <h3 className="text-base font-semibold text-foreground group-hover:underline">
              Curso de Análisis de Datos
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              SQL, Python, estadística aplicada y visualización para tomar
              decisiones con datos.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-foreground">
              Ver programa en México
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Bloque 6: Descarga CSV */}
      <section
        aria-labelledby="csv-heading"
        className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1">
          <h2 id="csv-heading" className="text-lg font-bold text-foreground">
            Descarga la base completa en CSV (79 carreras)
          </h2>
          <p className="text-sm text-muted-foreground">
            Incluye clave IMCO, ingreso promedio, cuartiles P25/P50/P75,
            desocupación, informalidad, matrícula y tasa de aceptación en
            formato UTF-8.
          </p>
        </div>
        <a
          href={CSV_PATH}
          download
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          <Download className="size-4" />
          Descargar CSV (IMCO 2026)
        </a>
      </section>

      {/* Bloque 7: Metodología y fuentes */}
      <section
        id="metodologia"
        aria-labelledby="metodologia-heading"
        className="space-y-3 rounded-xl border border-border bg-surface p-6"
      >
        <h2
          id="metodologia-heading"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          Metodología y fuentes
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Fuente:{" "}
          <a
            href={meta.fuenteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            {meta.fuente}
          </a>
          . Los datos de ingresos, desocupación e informalidad provienen de la
          Encuesta Nacional de Ocupación y Empleo (ENOE) del INEGI procesada por
          el IMCO; los indicadores de matrícula, egresados, solicitudes y
          lugares provienen de la ANUIES.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          De las {meta.totalCarreras} carreras incluidas en el comparativo
          nacional, {meta.totalPublicables} cuentan con muestra suficiente de
          ingreso mensual y tienen ficha individual; las {meta.totalExcluidas}{" "}
          restantes se muestran en la tabla general con la etiqueta «sin dato de
          ingreso». En la carrera clave 125 la ENOE no reporta tasa de
          desocupación por tamaño de muestra.
        </p>
      </section>

      {/* Bloque 8: FAQ */}
      <section aria-labelledby="faq-heading" className="space-y-4">
        <h2
          id="faq-heading"
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          Preguntas frecuentes sobre carreras mejor pagadas en México
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.pregunta}
              className="group rounded-xl border border-border bg-surface p-5"
              open
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-foreground">
                {faq.pregunta}
              </summary>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {faq.respuesta}
              </p>
            </details>
          ))}
        </div>
      </section>

      <CtaDatosMx
        page="/mx/datos/carreras-mejor-pagadas"
        ctaPosition="datos_mx_mejores_pagadas_cta"
      />
    </div>
  );
}
