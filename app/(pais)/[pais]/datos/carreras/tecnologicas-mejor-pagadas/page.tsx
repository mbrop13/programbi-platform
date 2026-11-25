import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
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
import type { CarreraCo } from "@/lib/datos-co/types";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ pais: "co" }];
}

const TITLE = "Carreras tecnológicas mejor pagadas en Colombia (OLE)";
const DESCRIPTION =
  "Ranking de 210 carreras tecnológicas y 26 técnicas mejor pagadas en Colombia según el OLE. Destacamos software, sistemas y datos, y comparamos su ingreso frente al universitario.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "co") notFound();

  return metadataDatosCo({
    title: TITLE,
    description: DESCRIPTION,
    path: "/co/datos/carreras/tecnologicas-mejor-pagadas",
    keywords: [
      "carreras tecnologicas mejor pagadas colombia",
      "carreras tecnicas mejor pagadas colombia",
      "tecnologia en sistemas sueldo colombia",
    ],
  });
}

const RE_TECH_DATOS =
  /\b(datos|sistemas|software|inform[aá]tica|computaci[oó]n|redes|telecomunicaciones|telem[aá]tica)\b/i;

const FAQS: readonly PreguntaFaqCo[] = [
  {
    pregunta: "¿Cuánto gana un tecnólogo en Colombia frente a un profesional universitario?",
    respuesta:
      "La mediana general de los programas tecnológicos es menor que la universitaria, pero las tecnologías mejor pagadas —especialmente en sistemas, software, datos y operación industrial— superan la mediana de varias carreras universitarias.",
  },
  {
    pregunta: "¿Qué áreas tecnológicas tienen mejor salida laboral en datos y tecnología?",
    respuesta:
      "Destacan Tecnología en Sistematización de Datos, Tecnología en Desarrollo de Software, Tecnología en Sistemas y Tecnología en Análisis y Desarrollo de Sistemas de Información.",
  },
];

function TablaNivelCorto({
  titulo,
  carreras,
}: {
  titulo: string;
  carreras: CarreraCo[];
}) {
  const ordenadas = carreras
    .slice()
    .sort((a, b) => b.mediana_cop_2026 - a.mediana_cop_2026 || b.pct_4plus_smmlv - a.pct_4plus_smmlv);

  return (
    <Card className="gap-3 rounded-xl border border-border bg-card py-5 shadow-xs ring-0">
      <CardHeader className="px-6 pb-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
            {titulo}
          </CardTitle>
          <Badge variant="secondary">{ordenadas.length} programas</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                <th className="w-10 py-2.5 pr-2">#</th>
                <th className="py-2.5 pr-3">Programa</th>
                <th className="px-3 py-2.5 text-right">Mediana COP 2026</th>
                <th className="px-3 py-2.5 text-right">SMMLV</th>
                <th className="px-3 py-2.5 text-right">% ≥ 4 SMMLV</th>
                <th className="pl-3 py-2.5 text-right">Cotizantes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {ordenadas.map((c, idx) => (
                <tr key={c.slug} className="hover:bg-muted/35">
                  <td className="py-2.5 pr-2 tabular-nums text-muted-foreground">{idx + 1}</td>
                  <td className="py-2.5 pr-3">
                    {c.sugerido_ficha ? (
                      <Link
                        href={`/co/datos/carreras/${c.slug}`}
                        prefetch={false}
                        className="font-medium text-blue-700 hover:underline"
                      >
                        {nombreProgramaCo(c.programa)}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">
                        {nombreProgramaCo(c.programa)}
                      </span>
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
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function TecnologicasMejorPagadasPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "co") notFound();

  const meta = getMetaCarrerasCo();
  const tecnologicas = getRankingCarrerasCo("Tecnológico");
  const tecnicas = getRankingCarrerasCo("Formación técnica profesional");

  const medTec = medianaNivelCo("Tecnológico");
  const medTecProf = medianaNivelCo("Formación técnica profesional");
  const medUniv = medianaNivelCo("Universitario");

  const techDatos = [...tecnologicas, ...tecnicas]
    .filter((c) => RE_TECH_DATOS.test(c.programa_normalizado))
    .sort((a, b) => b.mediana_cop_2026 - a.mediana_cop_2026);

  const migas = [
    ...MIGAS_CARRERAS_CO,
    { label: "Tecnológicas mejor pagadas", path: "/co/datos/carreras/tecnologicas-mejor-pagadas" },
  ] as const;

  const jsonLd = [
    breadcrumbJsonLdCo(migas),
    datasetJsonLdCo({
      id: "dataset-tecnologicas-co",
      name: "Carreras tecnológicas y técnicas mejor pagadas en Colombia (OLE)",
      description: DESCRIPTION,
      path: "/co/datos/carreras/tecnologicas-mejor-pagadas",
      isBasedOn: { name: meta.fuente_ole, url: meta.fuente_ole_url },
      variableMeasured: ["Mediana salarial COP 2026", "Mediana SMMLV", "Porcentaje >= 4 SMMLV"],
      temporalCoverage: `${meta.cohorte}/${meta.anio_seguimiento}`,
    }),
    itemListJsonLdCo(
      "Top tecnológicas y técnicas en software, sistemas y datos",
      techDatos.slice(0, 12).map((p) => ({
        name: p.programa_normalizado,
        path: p.sugerido_ficha ? `/co/datos/carreras/${p.slug}` : "/co/datos/carreras/tecnologicas-mejor-pagadas",
      }))
    ),
    faqJsonLdCo(FAQS),
  ];

  const cursos = [
    { slug: "excel" as const, href: "/co/cursos/excel", titulo: "Excel Avanzado", descripcion: "" },
    { slug: "power-bi" as const, href: "/co/cursos/power-bi", titulo: "Power BI", descripcion: "" },
    { slug: "sql-server" as const, href: "/co/cursos/sql-server", titulo: "SQL Server", descripcion: "" },
    { slug: "analisis-de-datos" as const, href: "/co/cursos/analisis-de-datos", titulo: "Análisis de Datos", descripcion: "" },
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
            <Badge variant="secondary">
              {tecnologicas.length} tecnológicas + {tecnicas.length} técnicas
            </Badge>
            <Badge variant="outline">Datos OLE · SMMLV 2026</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Carreras tecnológicas y técnicas mejor pagadas en Colombia
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            Compara los ingresos de los programas tecnológicos y técnicos profesionales frente al
            nivel universitario. Los programas en software, sistemas y datos lideran la salida
            laboral de ciclo corto.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Comparación de medianas">
          <KpiCard
            variante="primary"
            etiqueta="Mediana Tecnológica"
            valor={pesosCo(medTec.mediana_cop_2026)}
            delta={smmlvCo(medTec.mediana_smmlv)}
            subtitulo={`Frente a ${pesosCo(medUniv.mediana_cop_2026)} universitario`}
          />
          <KpiCard
            etiqueta="Mediana Técnica profesional"
            valor={pesosCo(medTecProf.mediana_cop_2026)}
            delta={smmlvCo(medTecProf.mediana_smmlv)}
            subtitulo={`${tecnicas.length} programas en ranking`}
          />
          <KpiCard
            etiqueta="Referencia Universitaria"
            valor={pesosCo(medUniv.mediana_cop_2026)}
            delta={smmlvCo(medUniv.mediana_smmlv)}
            subtitulo="Mediana entre 209 fichas universitarias"
          />
        </section>

        <Card className="gap-4 rounded-xl border border-blue-200/80 bg-blue-50/30 py-5 shadow-xs ring-0">
          <CardHeader className="px-6 pb-0">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
              <Code2 className="size-5 text-blue-700" aria-hidden="true" />
              Destacadas en software, sistemas y datos
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Programas tecnológicos y técnicos enfocados en desarrollo, bases de datos y sistemas.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {techDatos.slice(0, 9).map((c) => (
                <div
                  key={c.slug}
                  className="flex flex-col justify-between rounded-lg border border-border bg-card p-3.5"
                >
                  <div>
                    <Badge variant="outline" className="mb-1.5 text-[10px]">
                      {c.nivel_formacion}
                    </Badge>
                    {c.sugerido_ficha ? (
                      <Link
                        href={`/co/datos/carreras/${c.slug}`}
                        prefetch={false}
                        className="block text-sm font-semibold text-blue-700 hover:underline"
                      >
                        {nombreProgramaCo(c.programa)}
                      </Link>
                    ) : (
                      <p className="text-sm font-semibold text-foreground">
                        {nombreProgramaCo(c.programa)}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-2 text-xs">
                    <span className="font-semibold tabular-nums text-foreground">
                      {pesosCo(c.mediana_cop_2026)}
                    </span>
                    <span className="tabular-nums text-emerald-700">
                      {porcentajeCo(c.pct_4plus_smmlv)} ≥4 SMMLV
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-muted-foreground">
                Potencia tu perfil técnico con cursos en vivo:
              </span>
              {cursos.map((curso) => (
                <Link
                  key={curso.href}
                  href={curso.href}
                  prefetch={false}
                  className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "h-7 gap-1 text-xs")}
                >
                  {curso.titulo}
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <TablaNivelCorto
          titulo="Ranking completo: 210 carreras tecnológicas"
          carreras={tecnologicas}
        />

        <TablaNivelCorto
          titulo="Ranking completo: 26 carreras técnicas profesionales"
          carreras={tecnicas}
        />

        <CtaDatosCo
          pagina="/co/datos/carreras/tecnologicas-mejor-pagadas"
          cursos={cursos}
          ctaPosition="tecnologicas_co"
        />

        <FaqDatos faqs={FAQS} />
      </div>
    </div>
  );
}
