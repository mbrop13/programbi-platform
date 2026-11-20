import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { notFound } from "next/navigation";
import { Calculator, GitCompare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarrerasParecidas } from "@/components/datos/CarrerasParecidas";
import { CtaDatos } from "@/components/datos/CtaDatos";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import {
  AnalisisCarreraCollapsible,
  CompartirFichaButton,
  FichaCarreraClient,
} from "@/components/datos/FichaCarreraClient";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { getAreaVisual } from "@/lib/datos/areas-visual";
import {
  esFichaIndexable,
  getCarrera,
  getCarreras,
  getInstitucionesCarrera,
  getMetaCarreras,
  getProgramasCarrera,
  TIPO_ETIQUETAS,
  TIPO_ORDEN,
  tipoPrincipalDeCarrera,
  type TipoIesKey,
} from "@/lib/datos/carreras";
import { tituloH1Ficha } from "@/lib/datos/carreras-profesion";
import { fechaCorta } from "@/lib/datos/formato";
import { carrerasParecidas } from "@/lib/datos/parecidas";
import {
  breadcrumbsSchema,
  datasetCarrerasSchema,
  faqPageSchema,
  metadataFichaCarrera,
  MIGAS_BASE,
} from "@/lib/datos/seo-carreras";
import {
  contextoComparativoFicha,
  faqsFichaCarrera,
  narrativaUnicaFicha,
  resumenFichaCarrera,
} from "@/lib/datos/textos-carreras";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getCarreras().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const carrera = getCarrera(slug);
  if (!carrera) notFound();
  const indexable = esFichaIndexable(carrera);
  return metadataFichaCarrera(carrera, indexable);
}

export default async function FichaCarreraPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const carrera = getCarrera(slug);
  if (!carrera) notFound();

  const meta = getMetaCarreras();
  const principal = tipoPrincipalDeCarrera(carrera);
  const ctx = contextoComparativoFicha(carrera);
  if (!principal || !ctx) notFound();

  const instituciones = getInstitucionesCarrera(slug);
  const programas = getProgramasCarrera(slug);

  // Tipo inicial de la ficha: el que MÁS TITULADOS tiene (titulados.t no-null).
  // Empate → ctx.tipo (prioridad U→IP→CFT de tipoPrincipalDeCarrera).
  let tipoMasTitulados: TipoIesKey = ctx.tipo;
  let maxTitulados: number | null = null;
  for (const k of TIPO_ORDEN) {
    const d = carrera.tipos[k];
    const t = d?.titulados.t ?? null;
    if (t !== null && (maxTitulados === null || t > maxTitulados)) {
      tipoMasTitulados = k;
      maxTitulados = t;
    }
  }

  const resumen = resumenFichaCarrera(carrera, ctx);
  const narrativa = narrativaUnicaFicha(carrera, ctx);
  const faqs = faqsFichaCarrera(carrera, ctx);
  const { similares, menosAnos } = carrerasParecidas(carrera, ctx.tipo);
  const areaVisual = getAreaVisual(carrera.area);

  const migas = [
    ...MIGAS_BASE,
    { label: carrera.nombre, path: `/datos/carreras/${carrera.slug}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      datasetCarrerasSchema({
        path: `/datos/carreras/${carrera.slug}`,
        name: `${carrera.nombre} en Chile: sueldos, empleabilidad y aranceles`,
        description: `Estadísticas oficiales de ${carrera.nombre} en Chile según mifuturo.cl (Mineduc), edición ${meta.edicion}.`,
      }),
      faqPageSchema(faqs),
      breadcrumbsSchema(migas),
    ],
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="space-y-4">
        <MigasDatos migas={migas} />

        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge
                variant="secondary"
                className="h-auto rounded-md border border-blue-200/80 bg-blue-50 px-2.5 py-0.5 font-medium text-blue-800"
              >
                {carrera.area}
              </Badge>
              <Badge
                variant="outline"
                className="h-auto rounded-md bg-card px-2.5 py-0.5 font-medium text-foreground"
              >
                {TIPO_ETIQUETAS[ctx.tipo].plural} · Puesto {ctx.posicionTipo} de {ctx.totalTipo}
              </Badge>
              <span className="text-muted-foreground">
                Edición {meta.edicion} · Actualizado {fechaCorta(meta.fetched_at)}
              </span>
            </div>

            <h1 className="h1-datos max-w-4xl text-foreground">
              {tituloH1Ficha(carrera.slug, carrera.nombre)}
            </h1>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {similares[0] ? (
                <Link
                  href={`/datos/carreras/comparar?c=${encodeURIComponent(`${carrera.slug},${similares[0].slug}`)}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 shrink-0 gap-1.5 rounded-lg bg-card px-3.5 text-xs font-medium"
                  )}
                >
                  <GitCompare className="size-3.5 text-blue-700" aria-hidden="true" />
                  Comparar
                </Link>
              ) : null}
              <a
                href="#calculadora-retorno"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-9 shrink-0 gap-1.5 rounded-lg bg-card px-3.5 text-xs font-medium"
                )}
              >
                <Calculator className="size-3.5 text-blue-700" aria-hidden="true" />
                Calcular retorno
              </a>
              <CompartirFichaButton titulo={carrera.nombre} />
            </div>
          </div>

          <div className="hidden shrink-0 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xs sm:block">
            <Image
              src={areaVisual.image}
              alt={areaVisual.nombre}
              width={208}
              height={130}
              unoptimized
              className="h-[116px] w-[186px] rounded-lg object-cover lg:h-[130px] lg:w-[208px]"
            />
          </div>
        </header>
      </div>

      {/* Panel interactivo unificado (héroe levels.fyi + grilla 2×2 SSR + ToggleGroup U/IP/CFT + ajuste IPC).
          Abre en el tipo con más titulados; ?tipo= en la URL lo sobreescribe en el cliente. */}
      <FichaCarreraClient
        carrera={carrera}
        tipoInicial={tipoMasTitulados}
        instituciones={instituciones}
        programas={programas}
        edicion={meta.edicion}
      />

      {/* Bloque "En resumen" citable */}
      <EnResumen
        frases={resumen}
        fuente={`Fuente: www.mifuturo.cl (Mineduc), edición ${meta.edicion}. Cifras en pesos de septiembre de 2025.`}
      />

      {/* Análisis editorial determinista (≥ 250 palabras SSR) */}
      <Card
        aria-labelledby="analisis-titulo"
        className="prose-datos gap-3 rounded-xl border border-border bg-card py-6 shadow-xs ring-0"
      >
        <CardHeader className="px-6 pb-0">
          <CardTitle id="analisis-titulo" className="text-lg font-semibold text-foreground">
            Análisis de {carrera.nombre} en Chile
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 text-sm leading-relaxed text-foreground/85">
          <AnalisisCarreraCollapsible parrafos={narrativa} />
        </CardContent>
      </Card>

      {/* Carreras parecidas + Mismo sueldo menos años + Ranking + Cursos */}
      <CarrerasParecidas
        slugActual={carrera.slug}
        nombreActual={carrera.nombre}
        tipoActual={ctx.tipo}
        similares={similares}
        menosAnos={menosAnos}
        anteriorEnRanking={ctx.anteriorEnRanking}
        siguienteEnRanking={ctx.siguienteEnRanking}
      />

      {/* Preguntas frecuentes (id del título = destino del chip FAQ) */}
      <div id="faq-datos" className="scroll-mt-24">
        <FaqDatos
          faqs={faqs}
          titulo={`Preguntas frecuentes sobre ${carrera.nombre}`}
        />
      </div>

      {/* CTA ProgramBI */}
      <CtaDatos slug={carrera.slug} pagina={`/datos/carreras/${carrera.slug}`} />

      {/* Fuente y aviso legal */}
      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
