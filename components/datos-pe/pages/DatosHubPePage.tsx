import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BarChart3, BookOpen, FileSpreadsheet, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CtaDatosPe } from "@/components/datos-pe/CtaDatosPe";
import { getMetaCarrerasPe, getResumenCarrerasPe } from "@/lib/datos-pe/carreras";
import { entero, solesTexto } from "@/lib/datos-pe/formato";
import { breadcrumbsPeSchema, metadataPaginaPe } from "@/lib/datos-pe/seo";
import { GUIAS_PASO_A_PASO_PE } from "@/lib/guias/paso-a-paso-pe";
import { jsonLdString } from "@/lib/seo";



export async function metadataPeHub({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  if (pais !== "pe") return {};
  return metadataPaginaPe({
    path: "/pe/datos",
    title: "Datos laborales de Perú: sueldos por carrera y Excel | ProgramBI",
    description:
      "Observatorio de sueldos por carrera en Perú (INEI ENAHO 2022–2024, MTPE y SUNEDU) y 5 guías de Excel laboral con plantilla descargable.",
  });
}

export async function PagePeHub({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  if (pais !== "pe") notFound();

  const meta = getMetaCarrerasPe();
  const resumen = getResumenCarrerasPe();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbsPeSchema([
        { label: "Inicio", path: "/pe" },
        { label: "Datos de Perú", path: "/pe/datos" },
      ]),
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <nav aria-label="Migas de pan" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Link href="/pe" className="hover:text-foreground">
          Inicio
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Datos de Perú</span>
      </nav>

      <header className="max-w-3xl space-y-3">
        <Badge variant="outline">Perú · Corte {meta.fechaCorte}</Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Datos de Perú para decidir qué estudiar y calcular tu sueldo
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Cifras oficiales de sueldos reales por carrera (INEI ENAHO {meta.periodoEnaho}), planilla
          formal joven (MTPE {meta.periodoMtpe}) y oferta universitaria licenciada (SUNEDU), junto
          con guías prácticas de Excel laboral peruano listas para descargar.
        </p>
      </header>

      <section aria-labelledby="observatorio-carreras-pe" className="mt-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="observatorio-carreras-pe" className="text-xl font-semibold text-foreground">
            Observatorio de carreras en Perú ({entero(resumen.totalFichas)} familias)
          </h2>
          <span className="text-xs text-muted-foreground">
            Mediana máxima: {resumen.mayorMediana.nombre} (
            {solesTexto(resumen.mayorMediana.mediana)})
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border">
            <CardHeader>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-blue-600">
                <BarChart3 className="size-4" aria-hidden="true" />
                <span>Índice completo</span>
              </div>
              <CardTitle className="text-lg">
                <Link href="/pe/datos/carreras" className="hover:underline">
                  Sueldos de 38 carreras en Perú
                </Link>
              </CardTitle>
              <CardDescription>
                Tabla ordenable con mediana real ENAHO, planilla MTPE, % ocupados, % con pensión y
                descarga CSV.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/pe/datos/carreras"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              >
                Ver las 38 carreras
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-blue-600">
                <GraduationCap className="size-4" aria-hidden="true" />
                <span>Universitarias ({entero(resumen.totalUniversitarias)})</span>
              </div>
              <CardTitle className="text-lg">
                <Link href="/pe/datos/carreras/mejor-pagadas" className="hover:underline">
                  Carreras universitarias mejor pagadas
                </Link>
              </CardTitle>
              <CardDescription>
                Ranking de las 22 carreras universitarias publicables con cruce MTPE y rank
                nacional.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/pe/datos/carreras/mejor-pagadas"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              >
                Ver ranking universitario
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-blue-600">
                <GraduationCap className="size-4" aria-hidden="true" />
                <span>Técnicas ({entero(resumen.totalTecnicas)})</span>
              </div>
              <CardTitle className="text-lg">
                <Link href="/pe/datos/carreras/tecnicas-mejor-pagadas" className="hover:underline">
                  Carreras técnicas mejor pagadas
                </Link>
              </CardTitle>
              <CardDescription>
                Ranking de las 16 carreras técnicas publicables según ENAHO 2022–2024 y planilla
                MTPE.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/pe/datos/carreras/tecnicas-mejor-pagadas"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              >
                Ver ranking técnico
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-labelledby="guias-excel-pe" className="mt-12 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="guias-excel-pe" className="text-xl font-semibold text-foreground">
            5 guías de Excel laboral peruano con plantilla descargable
          </h2>
          <Link href="/pe/guias" className="text-sm font-medium text-blue-600 hover:underline">
            Ver todas las guías de Perú
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GUIAS_PASO_A_PASO_PE.map((guia, idx) => (
            <Card key={guia.slug} className="border-border">
              <CardHeader>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                    <FileSpreadsheet className="size-4" aria-hidden="true" />
                    Excel laboral Perú
                  </span>
                  {idx === 0 ? <Badge variant="secondary">Diciembre 2026</Badge> : null}
                </div>
                <CardTitle className="text-base leading-snug">
                  <Link href={`/pe/guias/${guia.slug}`} className="hover:underline">
                    {guia.h1}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">{guia.meta}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/pe/guias/${guia.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                >
                  Abrir guía y plantilla .xlsx
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="fuentes-resumen-pe" className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 size-5 shrink-0 text-blue-600" aria-hidden="true" />
          <div className="space-y-2 text-sm text-muted-foreground">
            <h2 id="fuentes-resumen-pe" className="text-base font-semibold text-foreground">
              Fuentes oficiales y fecha de corte ({meta.fechaCorte})
            </h2>
            <p>
              Todos los montos salariales de carreras provienen de microdatos del{" "}
              <strong className="text-foreground">INEI ENAHO ({meta.periodoEnaho})</strong>{" "}
              deflactados a {meta.unidad}, cruzados con la planilla electrónica joven del{" "}
              <strong className="text-foreground">MTPE-DISEL ({meta.periodoMtpe})</strong>, la
              Encuesta de Demanda Ocupacional 2026 y el registro de universidades licenciadas de{" "}
              <strong className="text-foreground">SUNEDU (corte {meta.corteSunedu})</strong>.
            </p>
            <p>
              <Link href="/pe/datos/carreras#metodologia" className="font-medium text-blue-600 hover:underline">
                Revisar metodología completa y enlaces oficiales
              </Link>
            </p>
          </div>
        </div>
      </section>

      <CtaDatosPe pagina="/pe/datos" className="mt-10" />
    </main>
  );
}
