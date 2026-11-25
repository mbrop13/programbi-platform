import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CtaDatosPe } from "@/components/datos-pe/CtaDatosPe";
import { FaqDatosPe, type FaqItemPe } from "@/components/datos-pe/FaqDatosPe";
import { GraficoSueldosPe } from "@/components/datos-pe/GraficoSueldosPe";
import { KpiResumenPe } from "@/components/datos-pe/KpiResumenPe";
import { TablaCarrerasPe } from "@/components/datos-pe/TablaCarrerasPe";
import {
  getCarrerasPePorTipo,
  getMetaCarrerasPe,
  getResumenCarrerasPe,
} from "@/lib/datos-pe/carreras";
import { entero, porcentajeTexto, solesTexto } from "@/lib/datos-pe/formato";
import {
  breadcrumbsPeSchema,
  datasetPeSchema,
  faqPagePeSchema,
  itemListPeSchema,
  metadataPaginaPe,
  MIGAS_PE_BASE,
} from "@/lib/datos-pe/seo";
import { jsonLdString } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ pais: "pe" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "pe") return {};
  return metadataPaginaPe({
    path: "/pe/datos/carreras/tecnicas-mejor-pagadas",
    title: "Carreras técnicas mejor pagadas en Perú 2026",
    description:
      "Ranking oficial de las 16 carreras técnicas mejor pagadas en Perú (INEI ENAHO 2022–2024) cruzado con planilla formal MTPE-DISEL.",
  });
}

export default async function CarrerasTecnicasMejorPagadasPePage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "pe") notFound();

  const meta = getMetaCarrerasPe();
  const resumen = getResumenCarrerasPe();
  const tecnicas = getCarrerasPePorTipo("tecnica");
  const top1 = tecnicas[0];
  const top2 = tecnicas[1];
  const conMtpe = tecnicas.filter((c) => c.mtpe.nacional !== null);

  const faqs: FaqItemPe[] = [
    {
      pregunta: "¿Cuál es la carrera técnica mejor pagada en Perú?",
      respuesta: `${top1.nombre} lidera las ${entero(tecnicas.length)} carreras técnicas publicables en ENAHO con una mediana real de ${solesTexto(top1.enaho.mediana)} mensuales, seguida de ${top2.nombre} con ${solesTexto(top2.enaho.mediana)}.`,
    },
    {
      pregunta: "¿De dónde salen los sueldos formales MTPE de las carreras técnicas?",
      respuesta: `Se toman de las filas nacionales de técnicos en la publicación oficial MTPE-DISEL (${meta.periodoMtpe}). Cuando una familia no figura en el listado publicado, se indica «sin dato MTPE».`,
    },
    {
      pregunta: "¿Las carreras técnicas tienen lista de universidades SUNEDU?",
      respuesta: `No. El registro de programas de pregrado de SUNEDU cubre únicamente universidades licenciadas; por ello en las fichas técnicas no se asigna conteo de universidades.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      datasetPeSchema({
        path: "/pe/datos/carreras/tecnicas-mejor-pagadas",
        name: "Carreras técnicas mejor pagadas en Perú 2026",
        description:
          "Ranking de 16 familias de carreras técnicas en Perú con mediana de ingreso ENAHO 2022–2024 y cruce nacional MTPE.",
      }),
      breadcrumbsPeSchema([
        ...MIGAS_PE_BASE,
        {
          label: "Técnicas mejor pagadas",
          path: "/pe/datos/carreras/tecnicas-mejor-pagadas",
        },
      ]),
      itemListPeSchema("Carreras técnicas mejor pagadas en Perú", tecnicas),
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
          <Link href="/pe/datos/carreras" className="hover:text-foreground">
            Carreras
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">Técnicas mejor pagadas</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Carreras técnicas mejor pagadas en Perú
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          Comparativa de las {entero(tecnicas.length)} carreras técnicas superiores con muestra
          robusta en ENAHO ({meta.periodoEnaho}), cruzadas con las remuneraciones de técnicos en
          planilla formal privada publicadas por el MTPE.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/pe/datos/carreras"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Volver al índice de 38 carreras
          </Link>
          <Link
            href="/pe/datos/carreras/mejor-pagadas"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
          >
            Ver ranking universitario
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <KpiResumenPe
        fechaCorte={meta.fechaCorte}
        items={[
          {
            etiqueta: "N.º 1 técnica",
            valor: solesTexto(top1.enaho.mediana),
            subtitulo: `${top1.nombre} · ${porcentajeTexto(top1.enaho.pctOcupados)} ocupados`,
          },
          {
            etiqueta: "Mediana técnica",
            valor: solesTexto(resumen.medianaTecnica),
            subtitulo: `${entero(tecnicas.length)} familias técnicas`,
          },
          {
            etiqueta: "Con cruce MTPE técnico",
            valor: `${entero(conMtpe.length)} de ${entero(tecnicas.length)}`,
            subtitulo: "Planilla privada 18–29 años (nacional)",
          },
        ]}
      />

      <GraficoSueldosPe
        carreras={tecnicas}
        maxItems={16}
        titulo="Las 16 carreras técnicas por sueldo real mediano (S/ de 2024)"
        descripcion="Mediana mensual de egresados técnicos de 25 a 40 años (ENAHO 2022–2024)."
      />

      <section aria-labelledby="tabla-tec-pe" className="space-y-3">
        <h2 id="tabla-tec-pe" className="text-xl font-semibold text-foreground">
          Ranking completo de carreras técnicas ({entero(tecnicas.length)})
        </h2>
        <TablaCarrerasPe
          carreras={tecnicas}
          mostrarFiltro={false}
          mostrarColumnaTipo={false}
          mostrarRankMtpe
          caption="Ranking técnico Perú — ENAHO 2022–2024 y MTPE-DISEL"
        />
      </section>

      <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Nota metodológica:</strong> la ENAHO mide todos los
        egresados técnicos ocupados (formales e informales) de 25 a 40 años; el MTPE mide jóvenes
        de 18 a 29 años en planilla formal.{" "}
        <Link href="/pe/datos/carreras#metodologia" className="font-medium text-blue-600 hover:underline">
          Leer metodología completa y fuentes oficiales
        </Link>
        .
      </div>

      <CtaDatosPe pagina="/pe/datos/carreras/tecnicas-mejor-pagadas" />
      <FaqDatosPe faqs={faqs} />
    </main>
  );
}
