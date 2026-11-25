import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Calculator,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";
import { CtaDatosAr } from "@/components/datos-ar/CtaDatosAr";
import { getCarrerasAr, getEstadoDiccionarioAr } from "@/lib/datos-ar/carreras";
import {
  enteroAr,
  periodoMesAr,
  periodoTrimestreAr,
  pesosAr,
  tasaAr,
} from "@/lib/datos-ar/formato";
import { getDesempleoArLive, getInflacionArLive } from "@/lib/datos-ar/macro";
import {
  breadcrumbJsonLdAr,
  metadataDatosAr,
  type MigajaAr,
} from "@/lib/datos-ar/seo";
import { jsonLdString } from "@/lib/seo";



const MIGAS: readonly MigajaAr[] = [
  { label: "Inicio", path: "/ar" },
  { label: "Datos de Argentina", path: "/ar/datos" },
];

export async function metadataArHub({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "ar") return {};
  return metadataDatosAr({
    subpath: "",
    title: "Datos de Argentina: aguinaldo, inflación y carreras | ProgramBI",
    description:
      "Calculá tu aguinaldo / SAC, consultá la inflación mensual del INDEC, la tasa de desocupación EPH y los sueldos oficiales de carreras universitarias en Argentina.",
  });
}

export async function PageArHub({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "ar") notFound();

  const [inflacion, desempleo] = await Promise.all([
    getInflacionArLive(),
    getDesempleoArLive(),
  ]);
  const carreras = getCarrerasAr();
  const estado = getEstadoDiccionarioAr();
  const mesAjuste = periodoMesAr(estado.mesAjusteIpc);
  const mejorMediana = [...carreras.disciplinas].sort(
    (a, b) => b.medianaAjustadaOct2026 - a.medianaAjustadaOct2026
  )[0];

  const jsonLd = breadcrumbJsonLdAr(MIGAS);

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
            <li aria-current="page" className="font-medium text-foreground">
              Datos de Argentina
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Observatorio económico y universitario · Corte {mesAjuste}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Datos de Argentina para calcular tu sueldo y elegir carrera
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Series oficiales de INDEC, BCRA, CEP XXI (Sistema Araucano + SIPA) y Anuario DIU
            en un solo lugar. Consultá inflación mes a mes, desocupación, sueldo anual
            complementario y salida laboral por disciplina.
          </p>
        </div>
      </header>

      {/* Tarjetas principales */}
      <section aria-label="Secciones de datos de Argentina" className="grid gap-5 md:grid-cols-2">
        {/* Aguinaldo / SAC */}
        <Link
          href="/ar/guias/calcular-aguinaldo-excel"
          className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-colors hover:border-foreground/40"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Calculator className="size-3.5" aria-hidden="true" />
                Guía práctica
              </span>
              <ArrowRight
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Cómo calcular el aguinaldo / SAC en Excel
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Fórmula paso a paso para la 1.ª y 2.ª cuota del Sueldo Anual Complementario
              (50 % de la mejor remuneración mensual del semestre), proporcionales y
              descuentos.
            </p>
          </div>
          <p className="mt-5 text-xs font-medium text-foreground">
            Ver guía paso a paso →
          </p>
        </Link>

        {/* Inflación */}
        <Link
          href="/ar/datos/inflacion"
          className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-colors hover:border-foreground/40"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:text-orange-400">
                <TrendingUp className="size-3.5" aria-hidden="true" />
                IPC INDEC · {periodoMesAr(inflacion.actual.mes)}
              </span>
              <ArrowRight
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Inflación en Argentina mes a mes
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Último dato mensual:{" "}
              <strong className="font-semibold text-foreground">
                {tasaAr(inflacion.actual.variacionMensual)}
              </strong>{" "}
              · Interanual:{" "}
              <strong className="font-semibold text-foreground">
                {tasaAr(inflacion.actual.variacionInteranual)}
              </strong>
              . Incluye calculadora de ajuste por IPC y descarga CSV.
            </p>
          </div>
          <p className="mt-5 text-xs font-medium text-foreground">
            Explorar serie y calculadora IPC →
          </p>
        </Link>

        {/* Desempleo */}
        <Link
          href="/ar/datos/desempleo"
          className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-colors hover:border-foreground/40"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400">
                <Users className="size-3.5" aria-hidden="true" />
                EPH INDEC · {periodoTrimestreAr(desempleo.actual.fecha)}
              </span>
              <ArrowRight
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Desempleo en Argentina (tasa EPH)
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Último dato publicado:{" "}
              <strong className="font-semibold text-foreground">
                {tasaAr(desempleo.actual.tasaPct)}
              </strong>{" "}
              sobre el total de 31 aglomerados urbanos. Serie trimestral oficial y descarga
              CSV.
            </p>
          </div>
          <p className="mt-5 text-xs font-medium text-foreground">
            Ver evolución trimestral →
          </p>
        </Link>

        {/* Carreras Hub */}
        <Link
          href="/ar/datos/carreras"
          className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-colors hover:border-foreground/40"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                <GraduationCap className="size-3.5" aria-hidden="true" />
                Araucano + DIU 2024
              </span>
              <ArrowRight
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Carreras en Argentina: sueldo y salida laboral
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {estado.disciplinasPublicables} disciplinas con salarios SIPA ({estado.anioBase})
              ajustados a {mesAjuste}
              {mejorMediana ? ` (mediana tope: ${pesosAr(mejorMediana.medianaAjustadaOct2026)})` : ""}.
            </p>
          </div>
          <p className="mt-5 text-xs font-medium text-foreground">
            Explorar las {estado.disciplinasPublicables} disciplinas →
          </p>
        </Link>
      </section>

      {/* Subrutas de carreras */}
      <section aria-labelledby="subrutas-carreras" className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="subrutas-carreras" className="text-xl font-bold text-foreground">
            Rankings de carreras universitarias
          </h2>
          <Link
            href="/ar/datos/carreras"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Ver tabla completa →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/ar/datos/carreras/mejor-pagadas"
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/40"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <BarChart3 className="size-4 text-blue-600" aria-hidden="true" />
              Carreras mejor pagadas
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Ranking por mediana salarial SIPA ({estado.anioBase}) ajustada por IPC a{" "}
              {mesAjuste}.
            </p>
          </Link>

          <Link
            href="/ar/datos/carreras/salida-laboral"
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/40"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Briefcase className="size-4 text-emerald-600" aria-hidden="true" />
              Carreras con salida laboral
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Ranking por porcentaje con empleo registrado en SIPA entre graduados
              2016–2018.
            </p>
          </Link>

          <Link
            href="/ar/datos/carreras/mas-demandadas"
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/40"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users className="size-4 text-purple-600" aria-hidden="true" />
              Carreras más elegidas (2024)
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              6 ramas del Anuario DIU 2024 por nuevos inscriptos y estudiantes totales
              (estatales y privadas).
            </p>
          </Link>
        </div>
      </section>

      {/* Fuentes y corte */}
      <section
        aria-labelledby="fuentes-corte"
        className="rounded-2xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground"
      >
        <h2 id="fuentes-corte" className="mb-3 text-base font-semibold text-foreground">
          Fuentes oficiales y fecha de corte
        </h2>
        <ul className="space-y-1.5 leading-relaxed">
          <li>
            <strong className="text-foreground">INDEC (IPC y EPH):</strong> serie IPC
            Nacional actualizada a{" "}
            <strong className="text-foreground">{periodoMesAr(inflacion.actual.mes)}</strong>{" "}
            y tasa de desocupación EPH (31 aglomerados) a{" "}
            <strong className="text-foreground">
              {periodoTrimestreAr(desempleo.actual.fecha)}
            </strong>
            .
          </li>
          <li>
            <strong className="text-foreground">CEP XXI — Sistema Araucano / SIPA:</strong>{" "}
            cohortes de graduados 2016–2018 con salarios registrados 2019–2021 (licencia CC BY
            4.0), ajustados por IPC INDEC a{" "}
            <strong className="text-foreground">{mesAjuste}</strong>.{" "}
            {!estado.disponible ? (
              <span>
                Los nombres oficiales de disciplina están pendientes del diccionario oficial en{" "}
                <code>datos.produccion.gob.ar</code>, por lo que se muestran los códigos
                oficiales (#1 a #{estado.disciplinasPublicables}).
              </span>
            ) : null}
          </li>
          <li>
            <strong className="text-foreground">Anuario DIU 2024:</strong> matrícula
            universitaria de pregrado y grado (
            {carreras.anuarioDiu2024?.totalSistema
              ? `${enteroAr(carreras.anuarioDiu2024.totalSistema.estudiantes)} estudiantes totales`
              : "sistema estatal y privado"}
            ).
          </li>
        </ul>
      </section>

      <CtaDatosAr page="/ar/datos" ctaPosition="datos_ar_hub" />
    </div>
  );
}
