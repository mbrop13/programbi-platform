import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CollageCampus } from "@/components/datos/CollageCampus";
import { getFotoInstitucion } from "@/lib/datos/instituciones-fotos";
import { cn } from "@/lib/utils";
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
  fechaCorta,
  mesCorto,
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
import { CarrerasAltaAfinidad } from "@/components/datos/CarrerasAltaAfinidad";
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
import { InstitucionesDestacadas } from "@/components/datos/InstitucionesDestacadas";
import { getTarjetasInstituciones } from "@/lib/datos/instituciones-paginas";
import { MigasDatos } from "@/components/datos/MigasDatos";
import { RankingCarrerasProgresivo } from "@/components/datos/RankingCarrerasProgresivo";
import { TablaRankingCarreras } from "@/components/datos/TablaRankingCarreras";

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

// Jerarquía: el comparador es la herramienta más usada (sólida cobalto); el test, sólida tinta;
// las calculadoras quedan en blanco para no competir.
const HERRAMIENTAS = [
  {
    href: "/datos/carreras/comparar",
    titulo: "Comparar carreras",
    desc: "Hasta 3 carreras lado a lado.",
    clase: "bg-carreras text-white",
  },
  {
    href: "/datos/carreras/test",
    titulo: "Test por prioridades",
    desc: "Ordena opciones según tus intereses y presupuesto.",
    clase: "bg-foreground text-white",
  },
  {
    href: "/datos/carreras/retorno",
    titulo: "Calculadora de retorno",
    desc: "Lo que cuesta estudiar vs. meses de sueldo.",
    clase: "border border-line-strong bg-white text-foreground hover:border-foreground",
  },
  {
    href: "/datos/carreras/puntaje-ponderado",
    titulo: "Puntaje ponderado PAES",
    desc: "Simula tu ponderación oficial 2025-2026.",
    clase: "border border-line-strong bg-white text-foreground hover:border-foreground",
  },
] as const;

// Fotos de campus para el collage de portada (sólo se muestran las que tienen foto con licencia libre).
const CLAVES_COLLAGE = [
  "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
  "UNIVERSIDAD DE CONCEPCION",
  "UNIVERSIDAD TECNICA FEDERICO SANTA MARIA",
  "UNIVERSIDAD DE CHILE",
  "UNIVERSIDAD AUSTRAL DE CHILE",
  "PONTIFICIA UNIVERSIDAD CATOLICA DE VALPARAISO",
];

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

export default function CarrerasHubPage() {
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();
  const areas = areasUnicas();
  const regiones = regionesUnicas();
  const ipcSeries = [...getIpcSeries()];
  const resumen = resumenHubCarreras();
  const faqs = faqsHubCarreras();
  const tarjetasInstituciones = getTarjetasInstituciones();
  const fotosCollage = CLAVES_COLLAGE.flatMap((key) => {
    const foto = getFotoInstitucion(key);
    return foto ? [{ key, nombre: getInstitucionVisual(key).nombreCorto, foto }] : [];
  }).slice(0, 3);

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

      {/* Portada: pregunta + buscador a la izquierda, collage de campus reales a la derecha */}
      <div className="min-w-0 space-y-6">
        <MigasDatos migas={MIGAS_BASE} />

        <header className="grid min-w-0 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="min-w-0 space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-blue-700">
                Ranking de carreras en Chile · mifuturo.cl, edición {meta.edicion} · act.{" "}
                {fechaCorta(meta.fetched_at)}
              </p>
              <h1 className="h1-datos text-foreground">
                ¿Qué estudiar? Mira cuánto ganan y{" "}
                <span className="marcador">qué tan rápido encuentran pega</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Sueldos, empleabilidad y aranceles de {meta.conteos.genericas_unicas} carreras en
                universidades, institutos profesionales y CFT.
              </p>
            </div>

            <div className="max-w-xl space-y-3">
              <BuscadorCarreras />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Lo más buscado:</span>
                {CARRERAS_POPULARES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/datos/carreras/${c.slug}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-line-strong bg-white px-3.5 text-sm font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-white"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <CollageCampus
            fotos={fotosCollage}
            carreras={meta.conteos.genericas_unicas}
            programas={meta.conteos.filas_C}
          />
        </header>
      </div>

      {/* Herramientas: cuatro verbos claros, cada una con su color de tema */}
      <section aria-labelledby="herramientas-titulo">
        <h2 id="herramientas-titulo" className="sr-only">
          Herramientas interactivas
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HERRAMIENTAS.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className={cn(
                  "group flex h-full min-h-[120px] flex-col justify-between gap-4 rounded-2xl p-5 transition-transform hover:-translate-y-0.5",
                  tool.clase
                )}
              >
                <span className="font-display text-xl leading-tight font-bold">{tool.titulo}</span>
                <span className="flex items-end justify-between gap-3 text-[15px] leading-snug">
                  {tool.desc}
                  <ArrowRight
                    className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
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
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-white px-4 py-1.5 text-sm text-muted-foreground">
              <span>
                Universidades · Mejor sueldo (4.º año) · Pesos de {mesCorto(meta.pesos_de)}
              </span>
              <div className="flex gap-3">
                <Link
                  className="inline-flex min-h-10 items-center font-semibold text-blue-700 hover:underline"
                  href="/datos/carreras/mejor-pagadas"
                >
                  Mejor pagadas
                </Link>
                <Link
                  className="inline-flex min-h-10 items-center font-semibold text-blue-700 hover:underline"
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
            <div
              aria-hidden="true"
              className="h-[380px] w-full rounded-xl border border-border bg-muted/40"
            />
          </section>
        </RankingCarrerasProgresivo>
      </section>

      {/* Instituciones destacadas U / IP / CFT */}
      <InstitucionesDestacadas instituciones={tarjetasInstituciones} />

      {/* Carreras destacadas con alta afinidad a datos, Power BI y SQL */}
      <CarrerasAltaAfinidad />

      {/* Rankings rápidos consolidados con Tabs (SSR keepMounted) */}
      <section aria-label="Rankings rápidos destacados">
        <HubRankingsRapidos grupos={gruposMiniRanking} />
      </section>

      {/* Búsquedas curadas (Presets SEO) */}
      <section aria-labelledby="vistas-curadas-titulo" className="space-y-3">
        <div>
          <h2 id="vistas-curadas-titulo" className="h2-datos text-foreground">
            Listas para revisar en un minuto
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cruces preparados con las preguntas más comunes de postulantes y familias.
          </p>
        </div>

        <ol className="grid border-t border-line-strong sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
          {PRESET_SLUGS.map((slug, i) => {
            const p = PRESETS_MAP[slug];
            return (
              <li key={slug} className="border-b border-line">
                <Link
                  href={`/datos/carreras/${slug}`}
                  className="group flex h-full gap-4 py-5"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl leading-none font-extrabold text-blue-200 transition-colors group-hover:text-carreras"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold text-foreground group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                      {p.tituloCorto}
                    </h3>
                    <span className="mt-1 block text-[15px] leading-snug text-muted-foreground">
                      {p.descriptionSeo}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
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
