import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GitCompare } from "lucide-react";
import { CarrerasParecidas } from "@/components/datos/CarrerasParecidas";
import { CtaDatos } from "@/components/datos/CtaDatos";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { FichaCarreraClient } from "@/components/datos/FichaCarreraClient";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import { KpiCard } from "@/components/datos/KpiCard";
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
import { tituloH1Ficha } from "@/lib/datos/carreras-profesion";
import {
  anosDesdeSemestres,
  entero,
  fechaCorta,
  pesos,
  porcentaje,
  semestres,
} from "@/lib/datos/formato";
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

  const { data } = principal;
  const oferta = data.oferta ?? carrera.oferta;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <MigasDatos migas={migas} />

      {/* Header + H1 */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-md bg-[#e9f4ff] px-2.5 py-1 text-[#1063b8]">
            {carrera.area}
          </span>
          <span className="rounded-md border border-[#e2e2dc] bg-white px-2.5 py-1 text-[#5c5c58]">
            {TIPO_ETIQUETAS[ctx.tipo].plural} · Puesto {ctx.posicionTipo} de {ctx.totalTipo}
          </span>
          <span className="text-[#5c5c58]">
            Edición {meta.edicion} · Actualizado {fechaCorta(meta.fetched_at)}
          </span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="h1-datos max-w-4xl text-[#171716]">
            {tituloH1Ficha(carrera.slug, carrera.nombre)}
          </h1>
          {similares[0] ? (
            <Link
              href={`/datos/carreras/comparar?c=${encodeURIComponent(`${carrera.slug},${similares[0].slug}`)}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#d6e6f5] bg-white px-3.5 py-2 text-xs font-semibold text-[#1063b8] transition-colors hover:bg-[#e9f4ff]"
            >
              <GitCompare className="size-3.5" aria-hidden="true" />
              Comparar carrera
            </Link>
          ) : null}
        </div>
      </header>

      {/* Hero KPIs SSR (garantiza cifras clave en HTML inicial) */}
      <section aria-label="Indicadores principales" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          variante="primary"
          etiqueta="Ingreso bruto 4.º año"
          valor={pesos(data.ing[3])}
          subtitulo={`1.er año: ${pesos(data.ing[0])} · sep-2025`}
        />
        <KpiCard
          etiqueta="Empleabilidad 1.er año"
          valor={porcentaje(data.emp1)}
          subtitulo={
            data.emp2 !== null
              ? `2.º año: ${porcentaje(data.emp2)}`
              : "Ingresos ≥ sueldo mínimo"
          }
        />
        <KpiCard
          etiqueta="Duración real"
          valor={semestres(data.dur_real)}
          subtitulo={anosDesdeSemestres(data.dur_real)}
        />
        <KpiCard
          variante="accent"
          etiqueta="Arancel mediano 2026"
          valor={pesos(oferta?.arancel?.med ?? null)}
          subtitulo={
            oferta
              ? `${entero(oferta.programas)} programas vigentes`
              : "Sin oferta publicada"
          }
        />
      </section>

      {/* Bloque "En resumen" citable */}
      <EnResumen
        frases={resumen}
        fuente={`Fuente: www.mifuturo.cl (Mineduc), edición ${meta.edicion}. Cifras en pesos de septiembre de 2025.`}
      />

      {/* Panel interactivo completo */}
      <FichaCarreraClient
        carrera={carrera}
        tipoInicial={ctx.tipo}
        instituciones={instituciones}
        programas={programas}
        edicion={meta.edicion}
      />

      {/* Análisis editorial determinista (≥ 250 palabras SSR) */}
      <section
        aria-labelledby="analisis-titulo"
        className="prose-datos rounded-xl border border-[#e2e2dc] bg-white p-6"
      >
        <h2 id="analisis-titulo" className="h2-datos text-[#171716]">
          Análisis de {carrera.nombre} en Chile
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#3c3c39]">
          {narrativa.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
      </section>

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
      <CtaDatos slug={carrera.slug} pagina={`/datos/carreras/${carrera.slug}`} />

      {/* Fuente y aviso legal */}
      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
