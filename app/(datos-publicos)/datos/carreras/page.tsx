import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import {
  ArrowUpRight,
  Calculator,
  Compass,
  GitCompare,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  areasUnicas,
  esFichaIndexable,
  getCarreras,
  getMetaCarreras,
  getRankingCarreras,
  regionesUnicas,
  TIPO_ETIQUETAS,
  type RankingItem,
} from "@/lib/datos/carreras";
import {
  anosDesdeSemestres,
  entero,
  fechaCorta,
  mesCorto,
  millonesCorto,
  pesos,
  porcentaje,
  variacionPorcentual,
} from "@/lib/datos/formato";
import { getInstitucionVisual } from "@/lib/datos/instituciones-visual";
import { getIpcSeries } from "@/lib/datos/ipc";
import { PRESETS_MAP, PRESET_SLUGS } from "@/lib/datos/presets";
import {
  breadcrumbsSchema,
  datasetCarrerasSchema,
  faqPageSchema,
  itemListSchema,
  metadataHubCarreras,
  MIGAS_BASE,
} from "@/lib/datos/seo-carreras";
import { faqsHubCarreras, resumenHubCarreras } from "@/lib/datos/textos-carreras";
import { BuscadorCarreras } from "@/components/datos/BuscadorCarreras";
import { CtaDatos } from "@/components/datos/CtaDatos";
import { EnResumen } from "@/components/datos/EnResumen";
import { FaqDatos } from "@/components/datos/FaqDatos";
import { FuenteLinea } from "@/components/datos/FuenteLinea";
import {
  ComoCitarBox,
  CsvDownloadButtons,
  DatosViewTracker,
} from "@/components/datos/HubCarrerasExtras";
import {
  HubDirectorioAreas,
  HubRankingsRapidos,
  type GrupoDirectorioArea,
  type GrupoMiniRanking,
} from "@/components/datos/HubRankingsRapidos";
import {
  InstitucionesDestacadas,
  type InstitucionResumenItem,
} from "@/components/datos/InstitucionesDestacadas";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { RankingCarrerasProgresivo } from "@/components/datos/RankingCarrerasProgresivo";
import { TablaRankingCarreras } from "@/components/datos/TablaRankingCarreras";
import { InlineBar } from "@/components/datos/viz/InlineBar";
import { StatTile } from "@/components/datos/viz/StatTile";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return metadataHubCarreras();
}

const CARRERAS_POPULARES = [
  { slug: "medicina", label: "Medicina" },
  { slug: "ingenieria-comercial", label: "Ing. Comercial" },
  { slug: "ingenieria-civil-en-computacion-e-informatica", label: "Informática" },
  { slug: "enfermeria", label: "Enfermería" },
] as const;

const HERRAMIENTAS = [
  {
    href: "/datos/carreras/comparar",
    icon: GitCompare,
    titulo: "Comparador",
    desc: "Compara hasta 3 carreras lado a lado.",
  },
  {
    href: "/datos/carreras/retorno",
    icon: Calculator,
    titulo: "Calculadora de Retorno",
    desc: "Costo total vs. meses de sueldo al egresar.",
  },
  {
    href: "/datos/carreras/puntaje-ponderado",
    icon: Target,
    titulo: "Puntaje Ponderado PAES",
    desc: "Simula tu ponderación oficial 2025–2026.",
  },
  {
    href: "/datos/carreras/test",
    icon: Compass,
    titulo: "Test Vocacional",
    desc: "Ordena opciones según área y presupuesto.",
  },
] as const;

function toMiniFilas(filas: RankingItem[], metrica: (r: RankingItem) => string) {
  return filas.map((r) => ({
    slug: r.slug,
    tipo: r.tipo,
    tipoCorto: TIPO_ETIQUETAS[r.tipo].corto,
    nombre: r.nombre,
    area: r.area,
    metricaTexto: metrica(r),
  }));
}

function getStatsPorInstitucion(): Record<string, InstitucionResumenItem> {
  const counts: Record<string, { programas: number; slugs: Set<string> }> = {};
  for (const tipo of ["u", "ip", "cft"] as const) {
    const file = join(process.cwd(), "public", "datos", "carreras", `programas-${tipo}.json`);
    if (!existsSync(file)) continue;
    const rows = JSON.parse(readFileSync(file, "utf8")) as { i: string; s: string }[];
    for (const row of rows) {
      const vis = getInstitucionVisual(row.i, tipo.toUpperCase());
      const entry = counts[vis.key] ?? { programas: 0, slugs: new Set<string>() };
      entry.programas += 1;
      entry.slugs.add(row.s);
      counts[vis.key] = entry;
    }
  }
  const result: Record<string, InstitucionResumenItem> = {};
  for (const [key, val] of Object.entries(counts)) {
    result[key] = { key, programas: val.programas, carreras: val.slugs.size };
  }
  return result;
}

export default function CarrerasHubPage() {
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();
  const areas = areasUnicas();
  const regiones = regionesUnicas();
  const ipcSeries = [...getIpcSeries()];
  const resumen = resumenHubCarreras();
  const faqs = faqsHubCarreras();
  const statsPorInstitucion = getStatsPorInstitucion();

  const arancelesOrdenados = ranking
    .map((r) => r.arancel_med)
    .filter((x): x is number => x !== null && x > 0)
    .sort((a, b) => a - b);
  const arancelP95 =
    arancelesOrdenados[Math.floor(arancelesOrdenados.length * 0.95)] ?? 8_000_000;

  // Primeras 25 filas de universidades en HTML del servidor para SEO
  const initialTop25U = ranking
    .filter((r) => r.tipo === "u" && r.ing4 !== null)
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))
    .slice(0, 25);

  const top10U = initialTop25U.slice(0, 10);
  const top10Ip = ranking
    .filter((r) => r.tipo === "ip" && r.ing4 !== null)
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))
    .slice(0, 10);
  const top10Cft = ranking
    .filter((r) => r.tipo === "cft" && r.ing4 !== null)
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))
    .slice(0, 10);
  const top10Emp = ranking
    .filter((r) => r.emp1 !== null && (r.titulados ?? 0) >= 100)
    .sort((a, b) => (b.emp1 ?? 0) - (a.emp1 ?? 0) || (b.ing4 ?? 0) - (a.ing4 ?? 0))
    .slice(0, 10);
  const top10Crec = ranking
    .filter((r) => r.yoy_real_4 !== null && (r.titulados ?? 0) >= 100)
    .sort((a, b) => (b.yoy_real_4 ?? -99) - (a.yoy_real_4 ?? -99))
    .slice(0, 10);
  const top10Cortas = ranking
    .filter((r) => r.dur_real !== null && r.dur_real <= 8 && r.ing4 !== null)
    .sort((a, b) => (b.ing4 ?? 0) - (a.ing4 ?? 0))
    .slice(0, 10);

  // Hero: Top 5 mejor pagadas (U), mismas filas ya calculadas para el SSR
  const top5HeroU = initialTop25U.slice(0, 5);
  const maxIng4HeroU = top5HeroU[0]?.ing4 ?? 0;

  // «En resumen»: hallazgos derivados solo del ranking/meta ya cargados
  const mejorPagadaU = initialTop25U[0];
  const mayorEmpleabilidad = top10Emp[0];
  const arancelMasBajo = ranking
    .filter((r) => r.arancel_med !== null && r.arancel_med > 0)
    .sort((a, b) => (a.arancel_med ?? 0) - (b.arancel_med ?? 0))[0];

  const gruposMiniRanking: GrupoMiniRanking[] = [
    {
      id: "top-u",
      tabLabel: "Universidades",
      titulo: "Top 10 en Universidades",
      subtitulo: "Ingreso bruto mensual promedio al 4.º año (pesos de sep-2025)",
      hrefVerMas: "/datos/carreras/mejor-pagadas",
      filas: toMiniFilas(top10U, (r) => pesos(r.ing4)),
    },
    {
      id: "top-ip",
      tabLabel: "Institutos (IP)",
      titulo: "Top 10 en Institutos Profesionales",
      subtitulo: "Ingreso bruto mensual promedio al 4.º año (pesos de sep-2025)",
      hrefVerMas: "/datos/carreras/mejor-pagadas",
      filas: toMiniFilas(top10Ip, (r) => pesos(r.ing4)),
    },
    {
      id: "top-cft",
      tabLabel: "Técnicos (CFT)",
      titulo: "Top 10 en Centros de Formación Técnica",
      subtitulo: "Ingreso bruto mensual promedio al 4.º año (pesos de sep-2025)",
      hrefVerMas: "/datos/carreras/mejor-pagadas",
      filas: toMiniFilas(top10Cft, (r) => pesos(r.ing4)),
    },
    {
      id: "top-emp",
      tabLabel: "Mayor empleabilidad",
      titulo: "Mayor empleabilidad al 1.er año",
      subtitulo: "Carreras con al menos 100 titulados en 2024",
      hrefVerMas: "/datos/carreras/mas-empleabilidad",
      filas: toMiniFilas(top10Emp, (r) => porcentaje(r.emp1)),
    },
    {
      id: "top-crec",
      tabLabel: "Más crecieron",
      titulo: "Las que más crecieron en sueldo real (2020–2024)",
      subtitulo: "Variación real al 4.º año con al menos 100 titulados",
      hrefVerMas: "/datos/carreras/crecieron-en-sueldo-real",
      filas: toMiniFilas(top10Crec, (r) => variacionPorcentual(r.yoy_real_4)),
    },
    {
      id: "top-cortas",
      tabLabel: "Carreras cortas",
      titulo: "Carreras cortas mejor pagadas (≤ 4 años reales)",
      subtitulo: "Duración real promedio hasta 8 semestres, ordenadas por ingreso 4.º año",
      hrefVerMas: "/datos/carreras?duracion_max=8&orden=ing4",
      filas: toMiniFilas(top10Cortas, (r) => `${pesos(r.ing4)} · ${anosDesdeSemestres(r.dur_real)}`),
    },
  ];

  const todasIndexables = getCarreras().filter((c) => esFichaIndexable(c));
  const gruposDirectorio: GrupoDirectorioArea[] = areas
    .map((areaNombre) => ({
      area: areaNombre,
      carreras: todasIndexables
        .filter((c) => c.area === areaNombre)
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
        .map((c) => ({ slug: c.slug, nombre: c.nombre })),
    }))
    .filter((g) => g.carreras.length > 0);

  const cita = `ProgramBI (${meta.fetched_at.slice(0, 4)}). Observatorio de Carreras en Chile: sueldos, empleabilidad y oferta académica (Edición ${meta.edicion}). Elaboración propia a partir de datos de mifuturo.cl (SIES, Mineduc). Disponible en https://programbi.com/datos/carreras`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      datasetCarrerasSchema({
        path: "/datos/carreras",
        name: `Ranking de carreras en Chile (${meta.edicion}): sueldos y empleabilidad`,
        description: `Base estructurada con ${meta.conteos.genericas_unicas} carreras genéricas y ${meta.conteos.filas_C} programas 2026 de Chile, a partir de mifuturo.cl (Mineduc).`,
      }),
      itemListSchema(
        "Top 25 carreras mejor pagadas en universidades en Chile",
        initialTop25U.map((r) => ({ nombre: r.nombre, slug: r.slug, tipo: r.tipo }))
      ),
      faqPageSchema(faqs),
      breadcrumbsSchema(MIGAS_BASE),
    ],
  };

  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-10 overflow-x-clip px-4 py-8 sm:px-6 lg:py-10">
      <DatosViewTracker params={{ pagina: "hub" }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero editorial 2 columnas */}
      <div className="min-w-0 space-y-5">
        <MigasDatos migas={MIGAS_BASE} />

        <header className="grid min-w-0 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="min-w-0 space-y-5">
            <div className="space-y-3">
              <Badge
                variant="secondary"
                className="h-auto rounded-md border border-blue-200/80 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                Datos oficiales Mineduc · 2026 · Act. {fechaCorta(meta.fetched_at)}
              </Badge>
              <h1 className="h1-datos text-foreground">
                Ranking de carreras en Chile: sueldos y empleabilidad
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                Compara cuánto ganan los titulados, qué tan rápido encuentran trabajo y cuánto
                cuesta estudiar en universidades, IP y CFT.
              </p>
            </div>

            <div className="max-w-xl space-y-2.5">
              <BuscadorCarreras />
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Populares:</span>
                {CARRERAS_POPULARES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/datos/carreras/${c.slug}`}
                    className="rounded-md border border-border bg-card px-2.5 py-1 font-medium text-foreground transition-colors hover:border-slate-300 hover:bg-muted"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Listas:</span>
                {PRESET_SLUGS.map((slug) => (
                  <Link
                    key={slug}
                    href={`/datos/carreras/${slug}`}
                    className="rounded-full border border-[#e5e4df] bg-white px-2.5 py-1 font-medium text-[#0b63c5] transition-colors hover:border-[#1890FF] hover:bg-blue-50"
                  >
                    {PRESETS_MAP[slug].tituloCorto}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Top 5 mejor pagadas (U) — visual del hero, sin foto */}
          <div className="min-w-0">
            <div className="rounded-2xl border border-[#e5e4df] bg-white p-4 shadow-xs sm:p-5">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-sm font-semibold text-foreground">
                  Top 5 mejor pagadas (U)
                </h2>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  Edición {meta.edicion}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Ingreso bruto al 4.º año · pesos de {mesCorto(meta.pesos_de)}
              </p>
              <ol className="mt-3 space-y-2.5">
                {top5HeroU.map((r, i) => (
                  <li key={r.slug} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground tabular-nums">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        {pesos(r.ing4)}
                      </span>
                    </div>
                    <InlineBar
                      value={r.ing4 ?? 0}
                      max={maxIng4HeroU}
                      label={r.nombre}
                      tone="blue"
                    />
                  </li>
                ))}
              </ol>
              <Link
                href="/datos/carreras/mejor-pagadas"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#0b63c5] hover:underline"
              >
                Ver ranking completo
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* En resumen: 4 hallazgos con cifra grande (datos ya calculados arriba) */}
      <section aria-labelledby="en-resumen-hub-titulo" className="space-y-3">
        <div>
          <h2 id="en-resumen-hub-titulo" className="h2-datos text-foreground">
            En resumen
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Edición {meta.edicion} · mifuturo.cl (Mineduc).
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {mejorPagadaU && (
            <StatTile
              label="Mejor pagada (U)"
              value={millonesCorto(mejorPagadaU.ing4)}
              sub={`${mejorPagadaU.nombre} · ingreso al 4.º año`}
            />
          )}
          {mayorEmpleabilidad && (
            <StatTile
              label="Mayor empleabilidad"
              value={porcentaje(mayorEmpleabilidad.emp1)}
              sub={`${mayorEmpleabilidad.nombre} · 1.er año (≥100 titulados)`}
            />
          )}
          <StatTile
            label="Carreras genéricas"
            value={entero(meta.conteos.genericas_unicas)}
            sub="U, IP y CFT en la base oficial"
          />
          {arancelMasBajo && (
            <StatTile
              label="Arancel mediano más bajo"
              value={millonesCorto(arancelMasBajo.arancel_med)}
              sub={`${arancelMasBajo.nombre} (${TIPO_ETIQUETAS[arancelMasBajo.tipo].corto}) · anual 2026`}
            />
          )}
        </div>
      </section>

      {/* Tira compacta de 4 herramientas rápidas */}
      <section aria-labelledby="herramientas-titulo" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <h2 id="herramientas-titulo" className="sr-only">
          Herramientas interactivas
        </h2>
        {HERRAMIENTAS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-blue-700 transition-colors group-hover:bg-blue-50">
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-blue-700">
                    {tool.titulo}
                  </h3>
                  <ArrowUpRight
                    className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-700"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{tool.desc}</p>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Explorador interactivo principal (Áreas visuales + TanStack DataTable / Tarjetas + Scatter) */}
      <section id="explorar-carreras" aria-label="Ranking interactivo de carreras" className="space-y-4">
        <div>
          <h2 className="h2-datos text-foreground">Explora y compara las carreras</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtra por área, tipo de institución, región, arancel o duración. Haz clic en cualquier
            carrera para ver su ficha completa.
          </p>
        </div>

        <RankingCarrerasProgresivo
          initialRows={initialTop25U}
          areas={areas}
          regiones={regiones}
          arancelP95={arancelP95}
          pesosDe={meta.pesos_de}
          ultimoMesIpc={meta.ipc.ultimo_mes}
          ipcSeries={ipcSeries}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground shadow-xs">
              <span>
                Universidades · Mejor sueldo (4.º año) · Pesos de {mesCorto(meta.pesos_de)}
              </span>
              <div className="flex gap-3">
                <Link
                  className="font-medium text-blue-700 hover:underline"
                  href="/datos/carreras/mejor-pagadas"
                >
                  Mejor pagadas
                </Link>
                <Link
                  className="font-medium text-blue-700 hover:underline"
                  href="/datos/carreras/mas-empleabilidad"
                >
                  Más empleabilidad
                </Link>
              </div>
            </div>
            <TablaRankingCarreras rows={initialTop25U} />
          </div>
          <section aria-labelledby="heading-scatter-inicial" className="mt-8 space-y-3">
            <div>
              <h2 id="heading-scatter-inicial" className="h2-datos text-foreground">
                Mapa sueldo vs. empleabilidad
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Cada punto es una carrera en universidades según los filtros activos.
              </p>
            </div>
            <Skeleton className="h-[420px] w-full rounded-xl border border-border bg-muted/60" />
            <p className="sr-only">Cargando mapa sueldo vs empleabilidad</p>
          </section>
        </RankingCarrerasProgresivo>
      </section>

      {/* Instituciones destacadas U / IP / CFT */}
      <InstitucionesDestacadas statsPorInstitucion={statsPorInstitucion} />

      {/* Rankings rápidos consolidados con Tabs (SSR keepMounted) */}
      <section aria-label="Rankings rápidos destacados">
        <HubRankingsRapidos grupos={gruposMiniRanking} />
      </section>

      {/* Búsquedas curadas (Presets SEO) */}
      <section aria-labelledby="vistas-curadas-titulo" className="space-y-3">
        <div>
          <h2 id="vistas-curadas-titulo" className="h2-datos text-foreground">
            Listas listas para revisar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cruces preparados con las preguntas más comunes de postulantes y familias.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRESET_SLUGS.map((slug) => {
            const p = PRESETS_MAP[slug];
            return (
              <Link
                key={slug}
                href={`/datos/carreras/${slug}`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
              >
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-700">
                    {p.tituloCorto}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {p.descriptionSeo}
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-700">
                  Ver ranking
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bloque de conocimiento agrupado (SSR keepMounted para 0 links huérfanos y SEO) */}
      <section aria-label="Información, directorio completo y metodología">
        <Tabs defaultValue="resumen" className="flex flex-col gap-4">
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <TabsList className="inline-flex h-10 w-max flex-nowrap gap-1 bg-muted p-1">
              <TabsTrigger value="resumen" className="px-3.5 text-xs font-medium sm:text-sm">
                Resumen ejecutivo
              </TabsTrigger>
              <TabsTrigger value="directorio" className="px-3.5 text-xs font-medium sm:text-sm">
                Directorio completo ({meta.conteos.genericas_unicas})
              </TabsTrigger>
              <TabsTrigger value="metodologia" className="px-3.5 text-xs font-medium sm:text-sm">
                Metodología y cita
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="resumen" keepMounted className="mt-0 data-[hidden]:hidden">
            <EnResumen
              frases={resumen}
              fuente={`Fuente: www.mifuturo.cl (SIES, Mineduc), edición ${meta.edicion}.`}
            />
          </TabsContent>

          <TabsContent value="directorio" keepMounted className="mt-0 data-[hidden]:hidden">
            <HubDirectorioAreas
              grupos={gruposDirectorio}
              totalCarreras={meta.conteos.genericas_unicas}
              edicion={meta.edicion}
            />
          </TabsContent>

          <TabsContent value="metodologia" keepMounted className="mt-0 space-y-4 data-[hidden]:hidden">
            <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Descarga los datos abiertos (CSV)
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bases limpias listas para analizar en Excel, Power BI, SQL o Python.
                  </p>
                </div>
                <CsvDownloadButtons />
              </CardContent>
            </Card>

            <ComoCitarBox cita={cita} />

            <Card
              aria-labelledby="metodologia-breve-titulo"
              className="prose-datos gap-0 rounded-xl border border-border bg-card py-0 shadow-xs ring-0"
            >
              <CardContent className="p-6 text-sm leading-relaxed text-muted-foreground">
                <h2 id="metodologia-breve-titulo" className="text-lg font-semibold text-foreground">
                  Nota metodológica
                </h2>
                <p className="mt-3">
                  Los ingresos y tasas de empleabilidad provienen de{" "}
                  <strong className="font-medium text-foreground">Estadísticas por Carrera</strong>{" "}
                  del Servicio de Información de Educación Superior (SIES, www.mifuturo.cl), edición{" "}
                  {meta.edicion}, elaborados mediante cruces con el Servicio de Impuestos Internos
                  (SII) en pesos constantes de septiembre de 2025.
                </p>
                <p className="mt-2">
                  La oferta académica, aranceles 2026, vacantes, acreditación y puntajes PAES
                  promedio de matriculados corresponden al{" "}
                  <strong className="font-medium text-foreground">Buscador de Carreras</strong> del
                  SIES. Los datos oficiales no desagregan sueldos por región ni por jornada debido al
                  secreto tributario del SII.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <FaqDatos faqs={faqs} />

      <CtaDatos pagina="/datos/carreras" />

      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
