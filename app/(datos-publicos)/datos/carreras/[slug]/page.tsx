import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { notFound } from "next/navigation";
import { Calculator, GitCompare, Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarrerasParecidas } from "@/components/datos/CarrerasParecidas";
import { CtaCarreraSueldo } from "@/components/datos/CtaCarreraSueldo";
import { CtaDatos } from "@/components/datos/CtaDatos";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import {
  AnalisisCarreraCollapsible,
  CompartirFichaButton,
  FichaCarreraClient,
} from "@/components/datos/FichaCarreraClient";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { FotosInstitucionesCarrera } from "@/components/datos/FotosInstitucionesCarrera";
import { MigasDatos } from "@/components/datos/MigasDatos";
import {
  esFichaIndexable,
  getCarrera,
  getCarreras,
  getInstitucionesCarrera,
  getMetaCarreras,
  getProgramasCarrera,
  TIPO_ETIQUETAS,
  tipoPrincipalDeCarrera,
} from "@/lib/datos/carreras";
import { partesTituloFicha } from "@/lib/datos/carreras-profesion";
import { nombreCortoCarrera } from "@/lib/datos/carreras-seo-mapa";
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

  const nombreCorto = nombreCortoCarrera(carrera);
  const tituloFicha = partesTituloFicha(carrera.slug, carrera.nombre);
  const instituciones = getInstitucionesCarrera(slug);
  const programas = getProgramasCarrera(slug);
  const resumen = resumenFichaCarrera(carrera, ctx);
  const narrativa = narrativaUnicaFicha(carrera, ctx);
  const faqs = faqsFichaCarrera(carrera, ctx);
  const { similares, menosAnos } = carrerasParecidas(carrera, ctx.tipo);

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
    <div className="mx-auto max-w-[1180px] space-y-10 px-4 py-6 sm:px-6 lg:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="space-y-4">
        <MigasDatos migas={migas} />

        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-lg bg-carreras-suave px-2.5 py-1 font-semibold text-blue-800">
                {carrera.area}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-resalte px-2.5 py-1 font-semibold text-white shadow-[0_2px_8px_rgba(24,144,255,0.28)]">
                <Trophy className="size-3.5" aria-hidden="true" />
                <span>
                  <span className="tabular-nums">#{ctx.posicionTipo}</span> de {ctx.totalTipo} en{" "}
                  {TIPO_ETIQUETAS[ctx.tipo].plural.toLowerCase()}
                </span>
              </span>
              <span className="text-muted-foreground">
                Edición {meta.edicion} · act. {fechaCorta(meta.fetched_at)}
              </span>
            </div>

            <h1 className="max-w-4xl text-foreground">
              <span className="h1-datos block">{tituloFicha.titulo}</span>
              {tituloFicha.subtitulo ? (
                <>
                  {" "}
                  <span className="mt-3 block text-lg font-medium leading-snug tracking-normal text-muted-foreground sm:text-xl">
                    {tituloFicha.subtitulo}
                  </span>
                </>
              ) : null}
            </h1>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {similares[0] ? (
                <Link
                  href={`/datos/carreras/comparar?c=${encodeURIComponent(`${carrera.slug},${similares[0].slug}`)}`}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-carreras px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <GitCompare className="size-4" aria-hidden="true" />
                  Comparar con {similares[0].nombre}
                </Link>
              ) : null}
              <a
                href="#calculadora-retorno"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-11 shrink-0 gap-2 rounded-xl border-line-strong bg-white px-4 text-sm font-semibold"
                )}
              >
                <Calculator className="size-4" aria-hidden="true" />
                Calcular retorno
              </a>
              <CompartirFichaButton titulo={carrera.nombre} />
            </div>
          </div>

          <FotosInstitucionesCarrera
            instituciones={instituciones.filter((i) => i.tipo === ctx.tipo)}
            total={instituciones.filter((i) => i.tipo === ctx.tipo).length}
          />
        </header>
      </div>

      {/* Panel interactivo unificado (incluye los 4 KPIs SSR + selector U/IP/CFT + ajuste IPC) */}
      <FichaCarreraClient
        carrera={carrera}
        tipoInicial={ctx.tipo}
        instituciones={instituciones}
        programas={programas}
        edicion={meta.edicion}
        ctaSueldo={
          <CtaCarreraSueldo
            slug={carrera.slug}
            nombreCorto={nombreCorto}
            area={carrera.area}
          />
        }
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

      {/* Preguntas frecuentes */}
      <FaqDatos
        faqs={faqs}
        titulo={`Preguntas frecuentes sobre ${carrera.nombre}`}
      />

      {/* CTA ProgramBI */}
      <CtaDatos
        slug={carrera.slug}
        area={carrera.area}
        nombreCorto={nombreCorto}
        pagina={`/datos/carreras/${carrera.slug}`}
      />

      {/* Fuente y aviso legal */}
      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
