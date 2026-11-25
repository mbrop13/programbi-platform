import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, MapPin, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CtaDatosPe } from "@/components/datos-pe/CtaDatosPe";
import { FaqDatosPe } from "@/components/datos-pe/FaqDatosPe";
import {
  getCarreraHermanaPe,
  getCarreraPe,
  getCarrerasPe,
  getMetaCarrerasPe,
} from "@/lib/datos-pe/carreras";
import { cursosAfinesCarreraPe } from "@/lib/datos-pe/cursos-afines";
import { entero, porcentajeTexto, solesTexto } from "@/lib/datos-pe/formato";
import {
  breadcrumbsPeSchema,
  datasetPeSchema,
  faqPagePeSchema,
  metadataFichaCarreraPe,
  MIGAS_PE_BASE,
} from "@/lib/datos-pe/seo";
import {
  faqsFichaPe,
  h1FichaPe,
  narrativaUnicaFichaPe,
  relacionadasFichaPe,
} from "@/lib/datos-pe/textos";
import { jsonLdString } from "@/lib/seo";



export async function metadataPeFicha({
  params,
}: {
  params: Promise<{ pais: string; slug: string }>;
}): Promise<Metadata> {
  const { pais, slug } = await params;
  if (pais !== "pe") return {};
  const carrera = getCarreraPe(slug);
  if (!carrera) return {};
  return metadataFichaCarreraPe(carrera);
}

export async function PagePeFicha({
  params,
}: {
  params: Promise<{ pais: string; slug: string }>;
}) {
  const { pais, slug } = await params;
  if (pais !== "pe") notFound();

  const carrera = getCarreraPe(slug);
  if (!carrera) notFound();

  const meta = getMetaCarrerasPe();
  const todas = getCarrerasPe();
  const hermana = getCarreraHermanaPe(carrera);
  const { titulo, subtitulo } = h1FichaPe(carrera);
  const narrativa = narrativaUnicaFichaPe(carrera);
  const faqs = faqsFichaPe(carrera);
  const relacionadas = relacionadasFichaPe(carrera, todas, 4);
  const cursosAfines = cursosAfinesCarreraPe(carrera);

  const listaHref =
    carrera.tipo === "universitaria"
      ? "/pe/datos/carreras/mejor-pagadas"
      : "/pe/datos/carreras/tecnicas-mejor-pagadas";
  const listaLabel =
    carrera.tipo === "universitaria"
      ? "Ranking de carreras universitarias"
      : "Ranking de carreras técnicas";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      datasetPeSchema({
        path: `/pe/datos/carreras/${carrera.slug}`,
        name: `${carrera.nombre} (${carrera.tipo === "universitaria" ? "Universitaria" : "Técnica"}) — Sueldo en Perú`,
        description: `Ingresos reales (ENAHO ${meta.periodoEnaho}) y planilla formal joven (MTPE) para ${carrera.nombre} en Perú.`,
      }),
      breadcrumbsPeSchema([
        ...MIGAS_PE_BASE,
        { label: carrera.nombre, path: `/pe/datos/carreras/${carrera.slug}` },
      ]),
      faqPagePeSchema(faqs),
    ],
  };

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
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
          <span className="font-medium text-foreground">{carrera.nombre}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {carrera.tipo === "universitaria" ? "Universitaria" : "Técnica"}
          </Badge>
          <Badge variant="secondary">Código INEI {carrera.codigoInei}</Badge>
          <span className="text-xs text-muted-foreground">
            Puesto #{carrera.rankNivel} de su nivel · Corte {meta.fechaCorte}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {titulo}
        </h1>
        <p className="text-base text-muted-foreground">{subtitulo}</p>

        <div className="flex flex-wrap gap-4 pt-1 text-xs font-medium text-blue-600">
          <Link href="/pe/datos/carreras" className="inline-flex items-center gap-1 hover:underline">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Índice de 38 carreras
          </Link>
          <Link href={listaHref} className="inline-flex items-center gap-1 hover:underline">
            {listaLabel}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* KPIs ENAHO */}
      <section aria-label="Indicadores ENAHO" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mediana real (ENAHO)</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {solesTexto(carrera.enaho.mediana)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            p25–p75: {solesTexto(carrera.enaho.p25)} – {solesTexto(carrera.enaho.p75)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Intervalo IC 90 % y muestra</CardDescription>
            <CardTitle className="text-lg tabular-nums">
              {solesTexto(carrera.enaho.ic90Low)} – {solesTexto(carrera.enaho.ic90High)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            n = {entero(carrera.enaho.nConIngreso)} · CV {carrera.enaho.cvMediana.toFixed(1).replace(".", ",")} %
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>% ocupados (25–40 años)</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {porcentajeTexto(carrera.enaho.pctOcupados)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {porcentajeTexto(carrera.enaho.pctPension)} con aporte a pensión
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Planilla formal (MTPE 18–29)</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {carrera.mtpe.nacional !== null ? solesTexto(carrera.mtpe.nacional) : "Sin dato MTPE"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {carrera.mtpe.lima !== null
              ? `Lima: ${solesTexto(carrera.mtpe.lima)}`
              : "Sin desagregado Lima en CSV"}
          </CardContent>
        </Card>
      </section>

      {/* Narrativa única */}
      <section aria-labelledby="analisis-carrera-pe" className="space-y-3 rounded-xl border border-border bg-card p-6">
        <h2 id="analisis-carrera-pe" className="text-lg font-semibold text-foreground">
          Lectura de ingresos y situación laboral en Perú
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {narrativa.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* MTPE Top 5 departamentos + EDO 2026 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-blue-600" aria-hidden="true" />
              Top departamentos en planilla formal (MTPE)
            </CardTitle>
            <CardDescription>
              Promedio mensual en planilla privada joven (18–29 años, nov 2022 – oct 2023).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {carrera.mtpe.topDepartamentos.length > 0 ? (
              <ul className="divide-y divide-border text-sm">
                {carrera.mtpe.topDepartamentos.map((dep) => (
                  <li key={dep.departamento} className="flex items-center justify-between py-2">
                    <span className="font-medium text-foreground">{dep.departamento}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {solesTexto(dep.promedio)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sin dato MTPE departamental publicado para esta familia.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-blue-600" aria-hidden="true" />
              Demanda ocupacional EDO 2026
            </CardTitle>
            <CardDescription>
              Encuesta de Demanda Ocupacional 2026 del MTPE (publica solo el top 10 por nivel).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {carrera.edo2026 ? (
              <p className="text-foreground">
                Figura en el top 10 de demanda nacional 2026 ({carrera.edo2026.familia}) con{" "}
                <strong>{entero(carrera.edo2026.puestos)} puestos demandados</strong> proyectados.
              </p>
            ) : (
              <p className="text-muted-foreground">
                Fuera del top 10 EDO 2026 publicado por el MTPE (el informe oficial no detalla
                puestos por debajo del décimo lugar).
              </p>
            )}

            {hermana ? (
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs font-medium text-foreground">
                  Comparación {carrera.tipo === "universitaria" ? "universitaria vs. técnica" : "técnica vs. universitaria"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  La modalidad {hermana.tipo === "universitaria" ? "universitaria" : "técnica"} de{" "}
                  {hermana.nombre} tiene una mediana ENAHO de {solesTexto(hermana.enaho.mediana)} (n=
                  {entero(hermana.enaho.nConIngreso)}).{" "}
                  <Link
                    href={`/pe/datos/carreras/${hermana.slug}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Ver ficha {hermana.tipo}
                  </Link>
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* SUNEDU universidades */}
      {carrera.sunedu ? (
        <section aria-labelledby="sunedu-pe" className="space-y-3 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="sunedu-pe" className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Building2 className="size-4 text-blue-600" aria-hidden="true" />
              Universidades licenciadas SUNEDU ({entero(carrera.sunedu.totalUniversidades)} aprox.)
            </h2>
            <span className="text-xs text-muted-foreground">
              Coincidencia por nombre de programa · Corte {meta.corteSunedu}
            </span>
          </div>
          {carrera.sunedu.universidades.length > 0 ? (
            <ul className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
              {carrera.sunedu.universidades.map((u) => (
                <li key={u.nombre} className="rounded-md border border-border/70 px-3 py-2">
                  <span className="block font-medium text-foreground">{u.nombre}</span>
                  <span>
                    {u.tipoGestion} · {u.departamento}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* Herramientas que suben el sueldo */}
      <section aria-labelledby="herramientas-carrera-pe" className="space-y-3 rounded-xl border border-border bg-muted/20 p-6">
        <h2 id="herramientas-carrera-pe" className="text-lg font-semibold text-foreground">
          Qué herramientas te suben el sueldo en esta carrera
        </h2>
        <p className="text-sm text-muted-foreground">
          Formación práctica en vivo orientada a mejorar tu perfil analítico en {carrera.nombre}.
        </p>
        <div className="flex flex-wrap gap-3">
          {cursosAfines.chips.map((chip) => (
            <Link
              key={chip.slug}
              href={chip.href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-blue-600 hover:text-blue-600"
            >
              Curso de {chip.nombre} en Perú
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <CtaDatosPe carrera={carrera} pagina={`/pe/datos/carreras/${carrera.slug}`} />

      {/* Carreras relacionadas */}
      <nav aria-labelledby="carreras-relacionadas-pe" className="space-y-3">
        <h2 id="carreras-relacionadas-pe" className="text-lg font-semibold text-foreground">
          Carreras relacionadas del mismo nivel
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {relacionadas.map((rel) => (
            <Link
              key={rel.slug}
              href={`/pe/datos/carreras/${rel.slug}`}
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-blue-600"
            >
              <span className="block text-sm font-semibold text-foreground">{rel.nombre}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Mediana {solesTexto(rel.enaho.mediana)} · {porcentajeTexto(rel.enaho.pctOcupados)}{" "}
                ocupados
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <FaqDatosPe faqs={faqs} />
    </main>
  );
}
