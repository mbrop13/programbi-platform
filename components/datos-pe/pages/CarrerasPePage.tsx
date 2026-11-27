import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CtaDatosPe } from "@/components/datos-pe/CtaDatosPe";
import { FaqDatosPe, type FaqItemPe } from "@/components/datos-pe/FaqDatosPe";
import { FormalVsRealPe } from "@/components/datos-pe/FormalVsRealPe";
import { RankingTopPais, type GrupoTopPais } from "@/components/datos/RankingTopPais";
import { KpiResumenPe } from "@/components/datos-pe/KpiResumenPe";
import { MetodologiaPe } from "@/components/datos-pe/MetodologiaPe";
import { TablaCarrerasPe } from "@/components/datos-pe/TablaCarrerasPe";
import {
  getCarreraPe,
  getCarrerasPe,
  getCarrerasPePorTipo,
  getMetaCarrerasPe,
  getResumenCarrerasPe,
} from "@/lib/datos-pe/carreras";
import { entero, porcentajeTexto, solesTexto } from "@/lib/datos-pe/formato";
import {
  breadcrumbsPeSchema,
  datasetPeSchema,
  faqPagePeSchema,
  metadataPaginaPe,
  MIGAS_PE_BASE,
} from "@/lib/datos-pe/seo";
import { jsonLdString } from "@/lib/seo";



export async function metadataPeCarreras({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "pe") return {};
  return metadataPaginaPe({
    path: "/pe/datos/carreras",
    title: "Carreras mejor pagadas en Perú 2026: sueldos por carrera (INEI)",
    description:
      "Cuánto gana cada carrera en Perú con datos del INEI (ENAHO 2022–2024): sueldo real con informales, sueldo formal en planilla, % ocupados y % con pensión",
  });
}

export async function PagePeCarreras({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "pe") notFound();

  const meta = getMetaCarrerasPe();
  const resumen = getResumenCarrerasPe();
  const carreras = getCarrerasPe();
  const gruposTop: GrupoTopPais[] = (
    [
      { id: "universitaria", label: "Universitarias" },
      { id: "tecnica", label: "Técnicas" },
    ] as const
  ).map((g) => ({
    id: g.id,
    label: g.label,
    filas: [...getCarrerasPePorTipo(g.id)]
      .sort((a, b) => b.enaho.mediana - a.enaho.mediana)
      .slice(0, 10)
      .map((c) => ({
        href: `/pe/datos/carreras/${c.slug}`,
        nombre: c.nombre,
        detalle: `${porcentajeTexto(c.enaho.pctOcupados)} ocupados · ${porcentajeTexto(c.enaho.pctPension)} con pensión`,
        valor: c.enaho.mediana,
        texto: solesTexto(c.enaho.mediana),
      })),
  }));
  const univTop = getCarrerasPePorTipo("universitaria")[0];
  const tecTop = getCarrerasPePorTipo("tecnica")[0];
  const sistemas = getCarreraPe("ingenieria-de-sistemas");

  const faqs: FaqItemPe[] = [
    {
      pregunta: "¿Cuál es la carrera mejor pagada en Perú según el INEI?",
      respuesta: `${resumen.mayorMediana.nombre} registra la mediana de ingreso mensual más alta entre las ${entero(resumen.totalFichas)} familias publicables: ${solesTexto(resumen.mayorMediana.mediana)} (soles de 2024, ENAHO ${meta.periodoEnaho}, egresados de 25 a 40 años).`,
    },
    ...(sistemas
      ? [
          {
            pregunta: "¿Cuánto gana un ingeniero de sistemas en Perú?",
            respuesta: `Según ENAHO (${meta.periodoEnaho}), ${sistemas.nombre} tiene una mediana real de ${solesTexto(sistemas.enaho.mediana)} al mes (rango intercuartil ${solesTexto(sistemas.enaho.p25)} a ${solesTexto(sistemas.enaho.p75)}, n=${entero(sistemas.enaho.nConIngreso)}), con ${porcentajeTexto(sistemas.enaho.pctOcupados)} ocupados y ${porcentajeTexto(sistemas.enaho.pctPension)} con pensión.${sistemas.mtpe.nacional !== null ? ` En planilla formal joven (MTPE), el promedio nacional es ${solesTexto(sistemas.mtpe.nacional)}.` : ""}`,
          },
        ]
      : []),
    ...(tecTop
      ? [
          {
            pregunta: "¿Qué carrera técnica gana más en Perú?",
            respuesta: `Entre las ${entero(resumen.totalTecnicas)} carreras técnicas que pasan el filtro muestral, ${tecTop.nombre} encabeza el ranking ENAHO con una mediana de ${solesTexto(tecTop.enaho.mediana)} mensuales (${porcentajeTexto(tecTop.enaho.pctOcupados)} ocupados).`,
          },
        ]
      : []),
    {
      pregunta: "¿Por qué el sueldo ENAHO difiere del sueldo MTPE?",
      respuesta: `Porque miden poblaciones distintas: el MTPE reporta el promedio de jóvenes de 18 a 29 años en planilla formal privada, mientras la ENAHO mide la mediana de egresados de 25 a 40 años incluyendo independientes e informales.`,
    },
    ...(univTop
      ? [
          {
            pregunta: "¿Cuál es la diferencia entre carreras universitarias y técnicas en Perú?",
            respuesta: `La mediana del conjunto universitario (${entero(resumen.totalUniversitarias)} carreras) es ${solesTexto(resumen.medianaUniversitaria)}, liderada por ${univTop.nombre} (${solesTexto(univTop.enaho.mediana)}). La mediana del conjunto técnico (${entero(resumen.totalTecnicas)} carreras) es ${solesTexto(resumen.medianaTecnica)}.`,
          },
        ]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      datasetPeSchema({
        path: "/pe/datos/carreras",
        name: "Sueldos por carrera en Perú (INEI ENAHO 2022–2024, MTPE y SUNEDU)",
        description:
          "Dataset de 38 familias de carreras universitarias y técnicas en Perú con ingreso mensual mediano, p25–p75, planilla formal MTPE, % ocupados, % con pensión y universidades licenciadas SUNEDU.",
      }),
      breadcrumbsPeSchema(MIGAS_PE_BASE),
      faqPagePeSchema(faqs),
    ],
  };

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <header className="space-y-3">
        <nav aria-label="Migas de pan" className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href="/pe" className="hover:text-foreground">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/pe/datos" className="hover:text-foreground">
            Datos de Perú
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">Carreras</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          ¿Qué estudiar en Perú? Cuánto ganan 38 carreras según el INEI
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          Compara ingresos reales mensuales (formales e informales, ENAHO {meta.periodoEnaho} en{" "}
          {meta.unidad}), sueldo formal en planilla joven (MTPE), % ocupados, % con pensión,
          demanda EDO 2026 y universidades licenciadas por SUNEDU.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/pe/datos/carreras/mejor-pagadas"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Top 22 universitarias
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/pe/datos/carreras/tecnicas-mejor-pagadas"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Top 16 técnicas
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* Bloque 1: Resumen arriba del pliegue */}
      <KpiResumenPe
        fechaCorte={meta.fechaCorte}
        items={[
          {
            etiqueta: "Carrera con mayor mediana",
            valor: solesTexto(resumen.mayorMediana.mediana),
            subtitulo: `${resumen.mayorMediana.nombre} (ENAHO 2022–2024)`,
          },
          {
            etiqueta: `Mediana universitarias (${entero(resumen.totalUniversitarias)})`,
            valor: solesTexto(resumen.medianaUniversitaria),
            subtitulo: "Egresados 25–40 años, formales e informales",
          },
          {
            etiqueta: `Mediana técnicas (${entero(resumen.totalTecnicas)})`,
            valor: solesTexto(resumen.medianaTecnica),
            subtitulo: "Egresados 25–40 años, formales e informales",
          },
        ]}
      />

      {/* Top 10 por nivel: la respuesta rápida antes de la tabla completa */}
      <RankingTopPais
        titulo="Las carreras mejor pagadas de Perú"
        descripcion={`Sueldo real mediano mensual de egresados de 25 a 40 años (ENAHO ${meta.periodoEnaho}, ${meta.unidad}).`}
        grupos={gruposTop}
        verTodasHref="#tabla-38-carreras"
        verTodasTexto={`Ver las ${entero(carreras.length)} carreras con todos sus datos`}
      />

      {/* Bloque 2: Tabla ordenable con las 38 familias */}
      <section aria-labelledby="tabla-38-carreras" className="scroll-mt-24 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="tabla-38-carreras" className="text-xl font-semibold text-foreground">
            Ranking completo de {entero(carreras.length)} carreras publicables
          </h2>
          <Badge variant="outline">Filtro universitaria / técnica</Badge>
        </div>
        <TablaCarrerasPe
          carreras={carreras}
          mostrarFiltro
          mostrarColumnaTipo
          mostrarRankMtpe
          caption="38 familias de carrera en Perú con muestra suficiente (n ≥ 100 y CV ≤ 15 %)"
        />
      </section>

      {/* Bloque 4: Sueldo formal vs. sueldo real */}
      <FormalVsRealPe carreras={carreras} />

      {/* Bloque 5: Descarga CSV */}
      <Card aria-labelledby="descarga-csv-pe">
        <CardHeader>
          <CardTitle id="descarga-csv-pe" className="text-lg">
            Descarga los datos abiertos en CSV
          </CardTitle>
          <CardDescription>
            Archivo estático con las 38 familias publicables, las mismas columnas de la tabla,
            fuente por bloque y atribución oficial (sin tasa de desempleo).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Codificación UTF-8 con BOM compatible con Excel · Corte {meta.fechaCorte} · Atribución:
            ProgramBI (sobre INEI ENAHO, MTPE-DISEL, EDO 2026, SUNEDU y BCRP).
          </p>
          <a
            href="/pe/datos/carreras/csv/carreras-peru.csv"
            download="carreras-peru.csv"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Download className="size-4" aria-hidden="true" />
            Descargar carreras-peru.csv
          </a>
        </CardContent>
      </Card>

      {/* Bloque 6: Metodología */}
      <MetodologiaPe meta={meta} />

      {/* Bloque 7: CTA */}
      <CtaDatosPe pagina="/pe/datos/carreras" />

      {/* Bloque 8: FAQ */}
      <FaqDatosPe faqs={faqs} />
    </main>
  );
}
