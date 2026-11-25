import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { CtaDatosAr } from "@/components/datos-ar/CtaDatosAr";
import { getAnuarioDiu2024 } from "@/lib/datos-ar/carreras";
import { enteroAr } from "@/lib/datos-ar/formato";
import {
  breadcrumbJsonLdAr,
  datasetFuenteOficialJsonLd,
  metadataDatosAr,
  type MigajaAr,
} from "@/lib/datos-ar/seo";
import { jsonLdString } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ pais: "ar" }];
}

const MIGAS: readonly MigajaAr[] = [
  { label: "Inicio", path: "/ar" },
  { label: "Datos de Argentina", path: "/ar/datos" },
  { label: "Carreras", path: "/ar/datos/carreras" },
  { label: "Más elegidas", path: "/ar/datos/carreras/mas-demandadas" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "ar") return {};
  return metadataDatosAr({
    subpath: "carreras/mas-demandadas",
    title: "Carreras más demandadas en Argentina 2026: las más elegidas",
    description:
      "Matrícula universitaria oficial en Argentina según el Anuario DIU 2024: nuevos inscriptos, estudiantes totales y egresados por rama en universidades estatales y privadas.",
  });
}

export default async function CarrerasMasDemandadasArPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "ar") notFound();

  const diu = getAnuarioDiu2024();
  const ramas = diu
    ? [...diu.ramas].sort((a, b) => b.nuevosInscriptos - a.nuevosInscriptos)
    : [];

  const jsonLd = [
    breadcrumbJsonLdAr(MIGAS),
    ...(diu
      ? [
          datasetFuenteOficialJsonLd({
            subpath: "carreras/mas-demandadas",
            idSuffix: "dataset-diu-2024",
            name: "Anuario de Estadísticas Universitarias 2024 — Matrícula por rama (DIU)",
            description:
              "Nuevos inscriptos, estudiantes totales, reinscriptos y egresados de pregrado y grado por rama de estudio y sector (estatal y privado).",
            organismoNombre: diu.fuente.organismo,
            organismoUrl: diu.fuente.url,
            temporalCoverage: "2024",
            dateModified: "2025-01-01",
          }),
        ]
      : []),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
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
            <li>
              <Link href="/ar/datos/carreras" className="hover:text-foreground">
                Carreras
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-foreground">
              Más elegidas
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Las carreras más elegidas en Argentina (nuevos inscriptos 2024)
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Fuente principal: Anuario de Estadísticas Universitarias 2024 (DIU —
            Subsecretaría de Políticas Universitarias). Desglose de las 6 ramas de pregrado
            y grado en instituciones estatales y privadas.
          </p>
        </div>

        <div
          role="note"
          className="flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-950 dark:text-blue-200"
        >
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Aclaración importante:</strong> «carreras más
            elegidas» mide matrícula universitaria (cuántas personas se anotan a estudiar).
            No equivale a demanda laboral de las empresas ni garantiza mayor sueldo o salida
            laboral.
          </p>
        </div>
      </header>

      {diu?.totalSistema ? (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Nuevos inscriptos 2024</p>
            <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
              {enteroAr(diu.totalSistema.nuevosInscriptos)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Estudiantes totales 2024</p>
            <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
              {enteroAr(diu.totalSistema.estudiantes)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Sector estatal (estudiantes)</p>
            <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
              {enteroAr(diu.totalSistema.estatal.estudiantes)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Sector privado (estudiantes)</p>
            <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
              {enteroAr(diu.totalSistema.privado.estudiantes)}
            </p>
          </div>
        </div>
      ) : null}

      <section aria-label="Matrícula por rama DIU 2024" className="rounded-2xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3 sm:px-6">#</th>
                <th className="px-4 py-3">Rama de estudio</th>
                <th className="px-4 py-3 text-right">Nuevos inscriptos</th>
                <th className="px-4 py-3 text-right">Estudiantes totales</th>
                <th className="px-4 py-3 text-right">Estatal (inscriptos)</th>
                <th className="px-4 py-3 text-right">Privado (inscriptos)</th>
                <th className="px-4 py-3 text-right sm:px-6">Egresados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular-nums">
              {ramas.map((r, idx) => (
                <tr key={r.slug} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-semibold text-muted-foreground sm:px-6">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.rama}</td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">
                    {enteroAr(r.nuevosInscriptos)}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {enteroAr(r.estudiantes)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {enteroAr(r.estatal.nuevosInscriptos)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {enteroAr(r.privado.nuevosInscriptos)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground sm:px-6">
                    {enteroAr(r.egresados)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap gap-4 text-sm font-medium">
        <Link
          href="/ar/datos/carreras"
          className="underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          ← Volver a Carreras en Argentina
        </Link>
        <Link
          href="/ar/datos/carreras/salida-laboral"
          className="underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          Ver ranking por salida laboral →
        </Link>
      </div>

      <CtaDatosAr
        page="/ar/datos/carreras/mas-demandadas"
        ctaPosition="datos_ar_mas_demandadas"
      />
    </div>
  );
}
