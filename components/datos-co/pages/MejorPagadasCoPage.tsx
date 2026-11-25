import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { KpiCard } from "@/components/datos/KpiCard";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { CtaDatosCo } from "@/components/datos-co/CtaDatosCo";
import {
  getMetaCarrerasCo,
  getRankingCarrerasCo,
  medianaNivelCo,
} from "@/lib/datos-co/carreras";
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
  itemListJsonLdCo,
  metadataDatosCo,
} from "@/lib/datos-co/seo";
import type { PreguntaFaqCo } from "@/lib/datos-co/textos";
import type { CarreraCo, NivelFormacionCo } from "@/lib/datos-co/types";



const TITLE = "Carreras mejor pagadas en Colombia 2026 (datos OLE)";
const DESCRIPTION =
  "Rankings separados de las carreras mejor pagadas en Colombia: 99 universitarias, 210 tecnológicas y 26 técnicas profesionales con datos del OLE en COP 2026.";

export async function metadataCoMejorPagadas({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "co") notFound();

  return metadataDatosCo({
    title: TITLE,
    description: DESCRIPTION,
    path: "/co/datos/carreras/mejor-pagadas",
    rutaHreflang: "/datos/carreras/mejor-pagadas",
    keywords: [
      "carreras mejor pagadas en colombia 2026",
      "ranking carreras colombia ole",
      "carreras universitarias mejor pagadas colombia",
    ],
  });
}

const FAQS: readonly PreguntaFaqCo[] = [
  {
    pregunta: "¿Por qué se separan universitarias, tecnológicas y técnicas?",
    respuesta:
      "Cada nivel de formación tiene una duración, inversión y perfil de cargos distinto. Separarlos permite comparar programas equivalentes sin distorsiones.",
  },
  {
    pregunta: "¿Qué criterio define qué programas entran en el ranking?",
    respuesta:
      "Solo se incluyen los 335 programas habilitados para ranking (sugerido_ranking = sí) por su volumen de graduados cotizantes en seguridad social e instituciones reportantes en el OLE.",
  },
  {
    pregunta: "¿Cómo se ordena cada tabla?",
    respuesta:
      "De mayor a menor mediana salarial interpolada en COP 2026 (calculada con el SMMLV 2026 de $1.750.905), desempatando por porcentaje con 4 SMMLV o más y número de cotizantes.",
  },
];

function TablaRankingNivel({
  id,
  titulo,
  subtitulo,
  carreras,
}: {
  id: string;
  titulo: string;
  subtitulo: string;
  carreras: CarreraCo[];
}) {
  const ordenadas = carreras
    .slice()
    .sort(
      (a, b) =>
        b.mediana_cop_2026 - a.mediana_cop_2026 ||
        b.pct_4plus_smmlv - a.pct_4plus_smmlv ||
        b.graduados_cotizantes - a.graduados_cotizantes
    );

  return (
    <Card id={id} className="gap-3 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
      <CardHeader className="px-6 pb-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
            {titulo}
          </CardTitle>
          <Badge variant="secondary">{ordenadas.length} programas</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{subtitulo}</p>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                <th className="w-12 py-2.5 pr-2">#</th>
                <th className="py-2.5 pr-3">Programa</th>
                <th className="px-3 py-2.5 text-right">Mediana COP 2026</th>
                <th className="px-3 py-2.5 text-right">SMMLV</th>
                <th className="px-3 py-2.5 text-right">% ≥ 4 SMMLV</th>
                <th className="pl-3 py-2.5 text-right">Cotizantes OLE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {ordenadas.map((c, idx) => {
                const nombre = nombreProgramaCo(c.programa);
                return (
                  <tr key={c.slug} className="hover:bg-muted/35">
                    <td className="py-2.5 pr-2 font-medium tabular-nums text-muted-foreground">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 pr-3">
                      {c.sugerido_ficha ? (
                        <Link
                          href={`/co/datos/carreras/${c.slug}`}
                          prefetch={false}
                          className="font-medium text-blue-700 hover:underline"
                        >
                          {nombre}
                        </Link>
                      ) : (
                        <span className="font-medium text-foreground">{nombre}</span>
                      )}
                      <p className="text-xs text-muted-foreground">{c.area_conocimiento}</p>
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-foreground">
                      {pesosCo(c.mediana_cop_2026)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                      {smmlvCo(c.mediana_smmlv, false)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium tabular-nums text-emerald-700">
                      {porcentajeCo(c.pct_4plus_smmlv)}
                    </td>
                    <td className="pl-3 py-2.5 text-right tabular-nums text-muted-foreground">
                      {enteroCo(c.graduados_cotizantes)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export async function PageCoMejorPagadas({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "co") notFound();

  const meta = getMetaCarrerasCo();
  const universitarias = getRankingCarrerasCo("Universitario");
  const tecnologicas = getRankingCarrerasCo("Tecnológico");
  const tecnicas = getRankingCarrerasCo("Formación técnica profesional");

  const medUniv = medianaNivelCo("Universitario");
  const medTec = medianaNivelCo("Tecnológico");
  const medTecProf = medianaNivelCo("Formación técnica profesional");

  const migas = [
    ...MIGAS_CARRERAS_CO,
    { label: "Mejor pagadas", path: "/co/datos/carreras/mejor-pagadas" },
  ] as const;

  const top10Univ = universitarias
    .slice()
    .sort((a, b) => b.mediana_cop_2026 - a.mediana_cop_2026)
    .slice(0, 10);

  const jsonLd = [
    breadcrumbJsonLdCo(migas),
    datasetJsonLdCo({
      id: "dataset-mejor-pagadas-co",
      name: "Rankings de carreras mejor pagadas en Colombia (OLE)",
      description: DESCRIPTION,
      path: "/co/datos/carreras/mejor-pagadas",
      isBasedOn: { name: meta.fuente_ole, url: meta.fuente_ole_url },
      variableMeasured: [
        "Mediana salarial COP 2026",
        "Mediana en SMMLV",
        "Porcentaje >= 4 SMMLV",
      ],
      temporalCoverage: `${meta.cohorte}/${meta.anio_seguimiento}`,
    }),
    itemListJsonLdCo(
      "Top 10 carreras universitarias mejor pagadas en Colombia",
      top10Univ.map((p) => ({
        name: p.programa_normalizado,
        path: p.sugerido_ficha ? `/co/datos/carreras/${p.slug}` : "/co/datos/carreras/mejor-pagadas",
      }))
    ),
    faqJsonLdCo(FAQS),
  ];

  const anclas: Array<{ id: string; label: string; count: number; nivel: NivelFormacionCo }> = [
    { id: "ranking-universitarias", label: "Universitarias", count: universitarias.length, nivel: "Universitario" },
    { id: "ranking-tecnologicas", label: "Tecnológicas", count: tecnologicas.length, nivel: "Tecnológico" },
    { id: "ranking-tecnicas", label: "Técnicas profesionales", count: tecnicas.length, nivel: "Formación técnica profesional" },
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
            <Badge variant="secondary">335 programas en ranking OLE</Badge>
            <Badge variant="outline">SMMLV 2026: {pesosCo(meta.smmlv_2026_cop)}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Las carreras mejor pagadas en Colombia según datos del OLE
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            Rankings separados por nivel de formación ({universitarias.length} universitarias,{" "}
            {tecnologicas.length} tecnológicas y {tecnicas.length} técnicas profesionales) para
            comparar sueldos y salida laboral en igualdad de condiciones.
          </p>

          <nav aria-label="Saltar a un ranking" className="flex flex-wrap gap-2 pt-1">
            {anclas.map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-blue-300 hover:text-blue-700"
              >
                {a.label} ({a.count})
              </a>
            ))}
            <Link
              href="/co/datos/carreras/comparar"
              prefetch={false}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              Comparar hasta 3 carreras
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </nav>
        </header>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Medianas por nivel">
          <KpiCard
            variante="primary"
            etiqueta="Mediana Universitaria"
            valor={pesosCo(medUniv.mediana_cop_2026)}
            delta={smmlvCo(medUniv.mediana_smmlv)}
            subtitulo={`${universitarias.length} programas en ranking`}
          />
          <KpiCard
            etiqueta="Mediana Tecnológica"
            valor={pesosCo(medTec.mediana_cop_2026)}
            delta={smmlvCo(medTec.mediana_smmlv)}
            subtitulo={`${tecnologicas.length} programas en ranking`}
          />
          <KpiCard
            etiqueta="Mediana Técnica profesional"
            valor={pesosCo(medTecProf.mediana_cop_2026)}
            delta={smmlvCo(medTecProf.mediana_smmlv)}
            subtitulo={`${tecnicas.length} programas en ranking`}
          />
        </section>

        <TablaRankingNivel
          id="ranking-universitarias"
          titulo="1. Carreras universitarias mejor pagadas"
          subtitulo="Programas profesionales universitarios habilitados en ranking OLE, ordenados por mediana COP 2026."
          carreras={universitarias}
        />

        <TablaRankingNivel
          id="ranking-tecnologicas"
          titulo="2. Carreras tecnológicas mejor pagadas"
          subtitulo="Programas de nivel tecnológico habilitados en ranking OLE, ordenados por mediana COP 2026."
          carreras={tecnologicas}
        />

        <TablaRankingNivel
          id="ranking-tecnicas"
          titulo="3. Carreras técnicas profesionales mejor pagadas"
          subtitulo="Programas de formación técnica profesional habilitados en ranking OLE."
          carreras={tecnicas}
        />

        <CtaDatosCo
          pagina="/co/datos/carreras/mejor-pagadas"
          ctaPosition="mejor_pagadas_co"
        />

        <FaqDatos faqs={FAQS} />
      </div>
    </div>
  );
}
