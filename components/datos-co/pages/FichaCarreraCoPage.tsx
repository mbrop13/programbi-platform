import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { KpiCard } from "@/components/datos/KpiCard";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { CtaDatosCo } from "@/components/datos-co/CtaDatosCo";
import { GraficoRangosCo } from "@/components/datos-co/carreras/GraficoRangosCo";
import {
  getFichaPorSlugCo,
  getFichasCarrerasCo,
  getIesPorCarreraCo,
  getMetaCarrerasCo,
  posicionEnNivelCo,
} from "@/lib/datos-co/carreras";
import { cursosAfinesCo } from "@/lib/datos-co/cursos-afines";
import {
  enteroCo,
  nombreProgramaCo,
  pesosCo,
  porcentajeCo,
  smmlvCo,
} from "@/lib/datos-co/formato";
import {
  MIGAS_CARRERAS_CO,
  breadcrumbJsonLdCo,
  datasetJsonLdCo,
  faqJsonLdCo,
  metadataDatosCo,
} from "@/lib/datos-co/seo";
import {
  faqsFichaCo,
  h1FichaCo,
  metaFichaCo,
  narrativaUnicaFichaCo,
  relacionadasFichaCo,
  tituloFichaCo,
} from "@/lib/datos-co/textos";
import { cn } from "@/lib/utils";



export async function metadataCoFicha({
  params,
}: {
  params: Promise<{ pais: string; slug: string }>;
}): Promise<Metadata> {
  const { pais, slug } = await params;
  if (pais !== "co") notFound();

  const carrera = getFichaPorSlugCo(slug);
  if (!carrera) notFound();

  return metadataDatosCo({
    title: tituloFichaCo(carrera),
    description: metaFichaCo(carrera),
    path: `/co/datos/carreras/${carrera.slug}`,
    keywords: [
      `${nombreProgramaCo(carrera.programa)} salario colombia`,
      `cuanto gana ${nombreProgramaCo(carrera.programa)} colombia`,
      "datos ole colombia",
    ],
  });
}

function enlaceRankingPorNivel(nivel: string): { href: string; label: string } {
  if (nivel === "Tecnológico") {
    return {
      href: "/co/datos/carreras/tecnologicas-mejor-pagadas",
      label: "Ver ranking de carreras tecnológicas",
    };
  }
  if (nivel === "Formación técnica profesional") {
    return {
      href: "/co/datos/carreras/mejor-pagadas#ranking-tecnicas",
      label: "Ver ranking de técnicas profesionales",
    };
  }
  return {
    href: "/co/datos/carreras/mejor-pagadas#ranking-universitarias",
    label: "Ver ranking de carreras universitarias",
  };
}

export async function PageCoFicha({
  params,
}: {
  params: Promise<{ pais: string; slug: string }>;
}) {
  const { pais, slug } = await params;
  if (pais !== "co") notFound();

  const carrera = getFichaPorSlugCo(slug);
  if (!carrera) notFound();

  const meta = getMetaCarrerasCo();
  const nombre = nombreProgramaCo(carrera.programa);
  const pos = posicionEnNivelCo(carrera.slug);
  const narrativa = narrativaUnicaFichaCo(carrera);
  const faqs = faqsFichaCo(carrera);
  const iesLista = getIesPorCarreraCo(carrera.slug);
  const relacionadas = relacionadasFichaCo(carrera, 4);
  const cursos = cursosAfinesCo(carrera);
  const rankingLink = enlaceRankingPorNivel(carrera.nivel_formacion);

  const migas = [
    ...MIGAS_CARRERAS_CO,
    { label: nombre, path: `/co/datos/carreras/${carrera.slug}` },
  ] as const;

  const jsonLd = [
    breadcrumbJsonLdCo(migas),
    datasetJsonLdCo({
      id: `dataset-carrera-${carrera.slug}`,
      name: `${nombre} en Colombia: salarios y graduados cotizantes (OLE)`,
      description: metaFichaCo(carrera),
      path: `/co/datos/carreras/${carrera.slug}`,
      isBasedOn: { name: meta.fuente_ole, url: meta.fuente_ole_url },
      variableMeasured: [
        "Mediana salarial interpolada (SMMLV y COP 2026)",
        "Porcentaje de graduados cotizantes con 4 SMMLV o más",
        "Distribución en 7 rangos SMMLV",
        "Graduados cotizantes en seguridad social",
      ],
      temporalCoverage: `${meta.cohorte}/${meta.anio_seguimiento}`,
    }),
    faqJsonLdCo(faqs),
  ];

  return (
    <div className="bg-background">
      {jsonLd.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
        <MigasDatos migas={migas} />

        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{carrera.nivel_formacion}</Badge>
            <Badge variant="outline">{carrera.area_conocimiento}</Badge>
            {pos ? (
              <Badge variant="outline" className="border-blue-200 bg-blue-50/60 text-blue-800">
                Puesto #{pos.posicion} de {pos.total} en {carrera.nivel_formacion}
              </Badge>
            ) : null}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {h1FichaCo(carrera)}
          </h1>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/co/datos/carreras"
              prefetch={false}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Todas las carreras
            </Link>
            <span className="text-muted-foreground" aria-hidden="true">·</span>
            <Link
              href={rankingLink.href}
              prefetch={false}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:underline"
            >
              <Trophy className="size-4" aria-hidden="true" />
              {rankingLink.label}
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Indicadores principales">
          <KpiCard
            variante="primary"
            etiqueta="Mediana salarial COP 2026"
            valor={pesosCo(carrera.mediana_cop_2026)}
            delta={smmlvCo(carrera.mediana_smmlv)}
            subtitulo={`Promedio: ${pesosCo(carrera.promedio_cop_2026)} (${smmlvCo(carrera.promedio_smmlv)})`}
            fuente="OLE Base IBC 2023"
          />
          <KpiCard
            etiqueta="Ganan 4 SMMLV o más"
            valor={porcentajeCo(carrera.pct_4plus_smmlv)}
            subtitulo={`Equivalente a ${pesosCo(meta.smmlv_2026_cop * 4)} o más (2026)`}
            fuente="Cohorte 2020–2022"
          />
          <KpiCard
            etiqueta="Cotizantes en seguridad social"
            valor={enteroCo(carrera.graduados_cotizantes)}
            subtitulo={`Distribuidos en ${enteroCo(carrera.n_ies)} instituciones`}
            fuente="OLE seguimiento 2023"
          />
          {carrera.snies_2025 ? (
            <KpiCard
              etiqueta="Graduados SNIES 2025"
              valor={enteroCo(carrera.snies_2025.graduados_2025)}
              subtitulo={`Reportados en ${enteroCo(carrera.snies_2025.n_ies)} IES`}
              fuente="SNIES Mineduc 2025"
            />
          ) : (
            <KpiCard
              etiqueta="Ingreso promedio COP 2026"
              valor={pesosCo(carrera.promedio_cop_2026)}
              delta={smmlvCo(carrera.promedio_smmlv)}
              subtitulo="Media aritmética interpolada OLE"
              fuente="SMMLV 2026"
            />
          )}
        </section>

        <EnResumen
          titulo={`Análisis de ${nombre} en Colombia`}
          frases={narrativa}
          fuente={`Fuente: ${meta.fuente_ole} · SMMLV 2026 (${pesosCo(meta.smmlv_2026_cop)})`}
        />

        <GraficoRangosCo
          rangos={carrera.rangos_smmlv}
          totalCotizantes={carrera.graduados_cotizantes}
          nombrePrograma={nombre}
          smmlvCop={meta.smmlv_2026_cop}
        />

        {carrera.sector_ies ? (
          <Card className="gap-4 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
            <CardHeader className="px-6 pb-0">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
                <Building2 className="size-5 text-blue-700" aria-hidden="true" />
                Desglose por sector IES (Oficial vs. Privado)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Comparativa entre instituciones oficiales y privadas (ambos sectores cuentan con al menos 30 cotizantes).
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 px-6 sm:grid-cols-2">
              {(
                [
                  { titulo: "Sector Oficial (Público)", data: carrera.sector_ies.oficial },
                  { titulo: "Sector Privado", data: carrera.sector_ies.privado },
                ] as const
              ).map((sec) => (
                <div
                  key={sec.titulo}
                  className="rounded-xl border border-border bg-muted/25 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{sec.titulo}</h3>
                    <Badge variant="outline" className="text-[11px]">
                      {enteroCo(sec.data.n_ies)} IES
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-foreground">
                    {pesosCo(sec.data.mediana_cop_2026)}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {smmlvCo(sec.data.mediana_smmlv)} · {porcentajeCo(sec.data.pct_4plus_smmlv)} con ≥4 SMMLV ·{" "}
                    {enteroCo(sec.data.graduados_cotizantes)} cotizantes
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {iesLista.length > 0 ? (
          <Card className="gap-3 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
            <CardHeader className="px-6 pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                  Instituciones de educación superior (IES) con 30 o más cotizantes
                </CardTitle>
                <Badge variant="secondary">{iesLista.length} IES</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Desglose por institución según el seguimiento 2023 del OLE para {nombre}.
              </p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                      <th className="py-2.5 pr-3">Institución (IES)</th>
                      <th className="px-3 py-2.5">Sector</th>
                      <th className="px-3 py-2.5 text-right">Mediana COP 2026</th>
                      <th className="px-3 py-2.5 text-right">SMMLV</th>
                      <th className="px-3 py-2.5 text-right">% ≥ 4 SMMLV</th>
                      <th className="pl-3 py-2.5 text-right">Cotizantes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {iesLista.map((item) => (
                      <tr key={item.ies} className="hover:bg-muted/35">
                        <td className="py-2.5 pr-3 font-medium text-foreground">
                          {nombreProgramaCo(item.ies)}
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge variant="outline" className="text-[11px] font-normal">
                            {item.sector_ies}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-foreground">
                          {pesosCo(item.mediana_cop_2026)}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                          {smmlvCo(item.mediana_smmlv, false)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-medium tabular-nums text-emerald-700">
                          {porcentajeCo(item.pct_4plus_smmlv)}
                        </td>
                        <td className="pl-3 py-2.5 text-right tabular-nums text-muted-foreground">
                          {enteroCo(item.graduados_cotizantes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {relacionadas.length > 0 ? (
          <section aria-labelledby="carreras-relacionadas-co" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2
                id="carreras-relacionadas-co"
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                Carreras relacionadas en {carrera.nivel_formacion}
              </h2>
              <Link
                href="/co/datos/carreras/comparar"
                prefetch={false}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
              >
                Comparar carreras
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {relacionadas.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/co/datos/carreras/${rel.slug}`}
                  prefetch={false}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/20"
                >
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">{rel.area_conocimiento}</p>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-700">
                      {nombreProgramaCo(rel.programa)}
                    </h3>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-2 text-xs">
                    <span className="font-semibold tabular-nums text-foreground">
                      {pesosCo(rel.mediana_cop_2026)}
                    </span>
                    <span className="tabular-nums text-emerald-700">
                      {porcentajeCo(rel.pct_4plus_smmlv)} ≥4 SMMLV
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <CtaDatosCo
          pagina={`/co/datos/carreras/${carrera.slug}`}
          cursos={cursos}
          carreraNombre={nombre}
          ctaPosition="ficha_co"
        />

        <FaqDatos faqs={faqs} />

        <footer className="border-t border-border/80 pt-5 text-xs leading-relaxed text-muted-foreground">
          <p>
            Fuentes: {meta.fuente_ole} ({meta.fuente_ole_url}) · {meta.fuente_snies} (
            {meta.fuente_snies_url}).{" "}
            <Link
              href="/co/datos/carreras/metodologia"
              prefetch={false}
              className="underline hover:text-foreground"
            >
              Ver metodología completa
            </Link>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}
