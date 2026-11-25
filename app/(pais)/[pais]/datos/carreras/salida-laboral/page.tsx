import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { CtaDatosAr } from "@/components/datos-ar/CtaDatosAr";
import {
  getCarrerasAr,
  getDisciplinasPublicablesAr,
  getEstadoDiccionarioAr,
} from "@/lib/datos-ar/carreras";
import { enteroAr, periodoMesAr, pesosAr, tasaAr } from "@/lib/datos-ar/formato";
import {
  breadcrumbJsonLdAr,
  datasetAraucanoJsonLd,
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
  { label: "Salida laboral", path: "/ar/datos/carreras/salida-laboral" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "ar") return {};
  return metadataDatosAr({
    subpath: "carreras/salida-laboral",
    title: "Carreras con salida laboral en Argentina (y buen sueldo)",
    description:
      "Ranking oficial por porcentaje con empleo registrado en SIPA entre graduados universitarios de Argentina (Araucano 2016–2018 / SIPA 2019–2021).",
  });
}

export default async function CarrerasSalidaLaboralArPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "ar") notFound();

  const data = getCarrerasAr();
  const disciplinas = [...getDisciplinasPublicablesAr()].sort(
    (a, b) => b.porcentajeSipaPct - a.porcentajeSipaPct
  );
  const estado = getEstadoDiccionarioAr();
  const mesAjuste = periodoMesAr(estado.mesAjusteIpc);

  const jsonLd = [
    breadcrumbJsonLdAr(MIGAS),
    datasetAraucanoJsonLd({
      subpath: "carreras/salida-laboral",
      name: "Carreras con salida laboral en Argentina (% con empleo registrado en SIPA)",
      description:
        "Ranking de 36 disciplinas universitarias por porcentaje con empleo registrado en SIPA (2019–2021) y mediana salarial ajustada a octubre 2026.",
      temporalCoverage: "2019/2021",
      dateModified: data.actualizado,
      csvPath: "/ar/datos/carreras/csv/carreras-argentina.csv",
    }),
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
              Salida laboral
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Carreras con más salida laboral en Argentina
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Ranking ordenado por{" "}
            <strong className="font-semibold text-foreground">
              % con empleo registrado en SIPA
            </strong>{" "}
            (proporción de graduados 2016–2018 que registraron salario en relación de
            dependencia en SIPA durante {estado.anioBase}). Los sueldos se muestran
            ajustados por IPC INDEC a{" "}
            <strong className="font-semibold text-foreground">{mesAjuste}</strong>.
          </p>
        </div>

        <div
          role="note"
          className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-200"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Qué mide el % con empleo registrado en SIPA:</strong>{" "}
            excluye monotributistas, autónomos, trabajo informal y profesionales en el
            exterior. Año base {estado.anioBase} · Ajuste IPC {mesAjuste}.{" "}
            {!estado.disponible
              ? "Nombres oficiales pendientes de descarga del diccionario oficial (datos.produccion.gob.ar)."
              : null}
          </p>
        </div>
      </header>

      <section aria-label="Ranking por porcentaje con empleo registrado en SIPA" className="rounded-2xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3 sm:px-6">#</th>
                <th className="px-4 py-3">Disciplina oficial</th>
                <th className="px-4 py-3 text-right">
                  % con empleo registrado en SIPA ({estado.anioBase})
                </th>
                <th className="px-4 py-3 text-right">
                  Mediana ajustada ({mesAjuste})
                </th>
                <th className="px-4 py-3 text-right">Graduados SIPA (n)</th>
                <th className="px-4 py-3 text-right sm:px-6">Total cohorte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular-nums">
              {disciplinas.map((d, idx) => (
                <tr key={d.disciplinaId} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-semibold text-muted-foreground sm:px-6">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {d.nombreOficial ?? `Disciplina #${d.disciplinaId}`}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">
                    {tasaAr(d.porcentajeSipaPct)}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {pesosAr(d.medianaAjustadaOct2026)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {enteroAr(d.nConSalarioSipa)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground sm:px-6">
                    {enteroAr(d.nFilas)}
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
          href="/ar/datos/carreras/mejor-pagadas"
          className="underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          Ver ranking mejor pagadas →
        </Link>
      </div>

      <CtaDatosAr
        page="/ar/datos/carreras/salida-laboral"
        ctaPosition="datos_ar_salida_laboral"
      />
    </div>
  );
}
