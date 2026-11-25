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



export async function metadataPeMejorPagadas({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "pe") return {};
  return metadataPaginaPe({
    path: "/pe/datos/carreras/mejor-pagadas",
    title: "Carreras universitarias mejor pagadas en Perú 2026",
    description:
      "Ranking oficial de las 22 carreras universitarias mejor pagadas en Perú (INEI ENAHO 2022–2024), con planilla formal MTPE, rank nacional y universidades SUNEDU.",
  });
}

export async function PagePeMejorPagadas({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "pe") notFound();

  const meta = getMetaCarrerasPe();
  const resumen = getResumenCarrerasPe();
  const universitarias = getCarrerasPePorTipo("universitaria");
  const top1 = universitarias[0];
  const top2 = universitarias[1];
  const conMtpe = universitarias.filter((c) => c.mtpe.nacional !== null);

  const faqs: FaqItemPe[] = [
    {
      pregunta: "¿Qué carrera universitaria paga más en Perú según el INEI?",
      respuesta: `${top1.nombre} ocupa el puesto 1 entre las ${entero(universitarias.length)} familias universitarias publicables, con mediana real de ${solesTexto(top1.enaho.mediana)} al mes (p25–p75 de ${solesTexto(top1.enaho.p25)} a ${solesTexto(top1.enaho.p75)}). Le sigue ${top2.nombre} con ${solesTexto(top2.enaho.mediana)}.`,
    },
    {
      pregunta: "¿Cuántas carreras universitarias cumplen el criterio de muestra?",
      respuesta: `De las familias universitarias evaluadas en ENAHO ${meta.periodoEnaho}, ${entero(universitarias.length)} alcanzan al menos 100 egresados con ingreso y coeficiente de variación de hasta 15 %.`,
    },
    {
      pregunta: "¿Qué muestra la columna de planilla formal MTPE?",
      respuesta: `Corresponde al sueldo promedio en planilla formal privada de jóvenes de 18 a 29 años (MTPE-DISEL, ${meta.periodoMtpe}) junto con su posición nacional cuando la familia existe en esa fuente. ${entero(conMtpe.length)} de las ${entero(universitarias.length)} carreras cuentan con cruce MTPE directo.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      datasetPeSchema({
        path: "/pe/datos/carreras/mejor-pagadas",
        name: "Carreras universitarias mejor pagadas en Perú 2026",
        description:
          "Ranking de 22 familias de carreras universitarias en Perú según mediana de ingreso ENAHO 2022–2024 y planilla formal MTPE.",
      }),
      breadcrumbsPeSchema([
        ...MIGAS_PE_BASE,
        { label: "Universitarias mejor pagadas", path: "/pe/datos/carreras/mejor-pagadas" },
      ]),
      itemListPeSchema("Carreras universitarias mejor pagadas en Perú", universitarias),
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
          <span className="font-medium text-foreground">Universitarias mejor pagadas</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Las carreras universitarias mejor pagadas en Perú (INEI 2022–2024)
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          Ranking exclusivo de las {entero(universitarias.length)} familias de pregrado universitario
          con muestra estadísticamente publicable en la ENAHO, ordenadas por sueldo real mediano y
          cruzadas con el sueldo joven formal y su rank nacional en la planilla electrónica del MTPE.
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
            href="/pe/datos/carreras/tecnicas-mejor-pagadas"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
          >
            Ver ranking de carreras técnicas
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <KpiResumenPe
        fechaCorte={meta.fechaCorte}
        items={[
          {
            etiqueta: "N.º 1 universitaria",
            valor: solesTexto(top1.enaho.mediana),
            subtitulo: `${top1.nombre} · ${porcentajeTexto(top1.enaho.pctOcupados)} ocupados`,
          },
          {
            etiqueta: "Mediana universitaria",
            valor: solesTexto(resumen.medianaUniversitaria),
            subtitulo: `${entero(universitarias.length)} familias universitarias`,
          },
          {
            etiqueta: "Con cruce MTPE formal",
            valor: `${entero(conMtpe.length)} de ${entero(universitarias.length)}`,
            subtitulo: "Planilla privada 18–29 años y rank nacional",
          },
        ]}
      />

      <GraficoSueldosPe
        carreras={universitarias}
        maxItems={15}
        titulo="Top 15 carreras universitarias por mediana ENAHO (S/ de 2024)"
        descripcion="Egresados universitarios completos de 25 a 40 años, formales e informales."
      />

      <section aria-labelledby="tabla-univ-pe" className="space-y-3">
        <h2 id="tabla-univ-pe" className="text-xl font-semibold text-foreground">
          Las {entero(universitarias.length)} carreras universitarias ordenadas por sueldo real
        </h2>
        <TablaCarrerasPe
          carreras={universitarias}
          mostrarFiltro={false}
          mostrarColumnaTipo={false}
          mostrarRankMtpe
          caption="Ranking universitario Perú — ENAHO 2022–2024 y MTPE-DISEL"
        />
      </section>

      <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Nota metodológica:</strong> los montos ENAHO están
        deflactados a soles de 2024 con el IPC de Lima (BCRP) e incluyen ocupados formales e
        informales; el dato MTPE corresponde a planilla formal joven (18–29 años).{" "}
        <Link href="/pe/datos/carreras#metodologia" className="font-medium text-blue-600 hover:underline">
          Leer metodología completa y fuentes oficiales
        </Link>
        .
      </div>

      <CtaDatosPe pagina="/pe/datos/carreras/mejor-pagadas" />
      <FaqDatosPe faqs={faqs} />
    </main>
  );
}
