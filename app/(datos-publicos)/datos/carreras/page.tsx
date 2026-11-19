import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "@/components/datos/EnlaceNavegacionDatos";
import {
  ArrowUpRight,
  BarChart3,
  Calculator,
  Compass,
  GitCompare,
  Percent,
  Target,
} from "lucide-react";
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
import { entero, fechaCorta, pesos, porcentaje, semestres, variacionPorcentual } from "@/lib/datos/formato";
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
import { MigasDatos } from "@/components/datos/MigasDatos";
import { RankingCarreras } from "@/components/datos/RankingCarreras";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return metadataHubCarreras();
}

function MiniTablaDestacada({
  titulo,
  subtitulo,
  filas,
  metrica,
  hrefVerMas,
}: {
  titulo: string;
  subtitulo: string;
  filas: RankingItem[];
  metrica: (r: RankingItem) => string;
  hrefVerMas: string;
}) {
  return (
    <section className="rounded-xl border border-[#e2e2dc] bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-[#171716]">{titulo}</h2>
          <p className="mt-0.5 text-xs text-[#5c5c58]">{subtitulo}</p>
        </div>
        <Link
          href={hrefVerMas}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#1063b8] hover:underline"
        >
          Ver ranking
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
      <ol className="mt-4 divide-y divide-[#e2e2dc] text-sm">
        {filas.map((r, i) => (
          <li key={`${r.slug}-${r.tipo}`} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0 flex-1">
              <span className="mr-2 text-xs font-semibold text-[#5c5c58] tabular-nums">
                {i + 1}.
              </span>
              <Link
                href={`/datos/carreras/${r.slug}?tipo=${r.tipo}`}
                prefetch={false}
                className="font-medium text-[#171716] hover:text-[#1063b8] hover:underline"
              >
                {r.nombre}
              </Link>
              <span className="ml-2 text-xs text-[#5c5c58]">
                ({TIPO_ETIQUETAS[r.tipo].corto})
              </span>
            </div>
            <span className="shrink-0 font-bold text-[#171716] tabular-nums">
              {metrica(r)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function CarrerasHubPage() {
  const meta = getMetaCarreras();
  const ranking = getRankingCarreras();
  const areas = areasUnicas();
  const regiones = regionesUnicas();
  const ipcSeries = [...getIpcSeries()];
  const resumen = resumenHubCarreras();
  const faqs = faqsHubCarreras();

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
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:py-12">
      <DatosViewTracker params={{ pagina: "hub" }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="space-y-4">
        <MigasDatos migas={MIGAS_BASE} />

        <header className="max-w-3xl space-y-3">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#e2e2dc] bg-white px-3 py-1 text-xs font-semibold text-[#1063b8]">
            <span>Edición {meta.edicion}</span>
            <span aria-hidden="true" className="text-[#d4d4ce]">·</span>
            <span className="text-[#5c5c58] font-medium">
              Actualizado el {fechaCorta(meta.fetched_at)}
            </span>
          </div>
          <h1 className="h1-datos text-[#171716]">
            Ranking de carreras en Chile: sueldos y empleabilidad
          </h1>
          <p className="text-base leading-relaxed text-[#5c5c58]">
            Explora {meta.conteos.genericas_unicas} carreras genéricas y{" "}
            {entero(meta.conteos.filas_C)} programas con oferta 2026 en universidades, IP y CFT.
            Ingresos brutos mensuales en pesos de septiembre de 2025 (o ajustados por IPC a hoy).
          </p>
        </header>
      </div>

      <EnResumen
        frases={resumen}
        fuente={`Fuente: www.mifuturo.cl (SIES, Mineduc), edición ${meta.edicion}.`}
      />

      {/* Buscador rápido */}
      <section aria-label="Buscador de carreras" className="space-y-2">
        <BuscadorCarreras />
      </section>

      {/* Tabla + Filtros + Scatter */}
      <section aria-label="Ranking interactivo de carreras">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-[520px] w-full rounded-xl" />
            </div>
          }
        >
          <RankingCarreras
            initialRows={initialTop25U}
            areas={areas}
            regiones={regiones}
            arancelP95={arancelP95}
            pesosDe={meta.pesos_de}
            ultimoMesIpc={meta.ipc.ultimo_mes}
            ipcSeries={ipcSeries}
          />
        </Suspense>
      </section>

      {/* Vistas prefiltradas y herramientas */}
      <section aria-labelledby="vistas-herramientas-titulo" className="space-y-4">
        <h2 id="vistas-herramientas-titulo" className="h2-datos text-[#171716]">
          Vistas especializadas y herramientas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRESET_SLUGS.map((slug) => {
            const p = PRESETS_MAP[slug];
            return (
              <Link
                key={slug}
                href={`/datos/carreras/${slug}`}
                className="group flex flex-col justify-between rounded-xl border border-[#e2e2dc] bg-white p-4 transition-colors hover:border-[#1063b8]"
              >
                <div>
                  <span className="text-xs font-semibold text-[#1063b8]">Vista prefiltrada</span>
                  <h3 className="mt-1 text-base font-bold text-[#171716] group-hover:text-[#1063b8]">
                    {p.tituloCorto}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#5c5c58]">
                    {p.descriptionSeo}
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#1063b8]">
                  Explorar
                  <ArrowUpRight className="size-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/datos/carreras/comparar",
              icon: GitCompare,
              titulo: "Comparador de carreras",
              desc: "Compara hasta 3 carreras lado a lado: trayectoria 1.º a 5.º año, empleabilidad y arancel.",
            },
            {
              href: "/datos/carreras/retorno",
              icon: Calculator,
              titulo: "Calculadora de retorno",
              desc: "Estima el costo total de estudiar según duración real y cuántos meses de sueldo bruto equivale.",
            },
            {
              href: "/datos/carreras/test",
              icon: Compass,
              titulo: "Explorador por prioridades",
              desc: "Ordena carreras según tus áreas, presupuesto, puntaje PAES, región y jornada.",
            },
            {
              href: "/datos/carreras/puntaje-ponderado",
              icon: Target,
              titulo: "Calculadora de puntaje ponderado",
              desc: "Calcula tu puntaje ponderado con las ponderaciones oficiales 2025–2026.",
            },
            {
              href: "/datos/carreras/tecnologia-y-datos",
              icon: BarChart3,
              titulo: "Carreras de tecnología y datos",
              desc: "Foco en informática, redes, telecomunicaciones, matemática y estadística.",
            },
            {
              href: "/datos/inflacion",
              icon: Percent,
              titulo: "Calculadora de IPC",
              desc: "Convierte pesos de años anteriores a poder de compra actual con el IPC oficial.",
            },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-start gap-3 rounded-xl border border-[#e2e2dc] bg-white p-4 transition-colors hover:border-[#1063b8]"
              >
                <div className="rounded-lg bg-[#e9f4ff] p-2 text-[#1063b8]">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#171716] group-hover:text-[#1063b8]">
                    {tool.titulo}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#5c5c58]">{tool.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Secciones H2 destacadas en HTML SSR */}
      <section aria-label="Rankings destacados" className="grid gap-5 lg:grid-cols-2">
        <MiniTablaDestacada
          titulo="Top 10 en Universidades"
          subtitulo="Ingreso bruto promedio al 4.º año (pesos sep-2025)"
          filas={top10U}
          metrica={(r) => pesos(r.ing4)}
          hrefVerMas="/datos/carreras/mejor-pagadas"
        />
        <MiniTablaDestacada
          titulo="Top 10 en Institutos Profesionales"
          subtitulo="Ingreso bruto promedio al 4.º año (pesos sep-2025)"
          filas={top10Ip}
          metrica={(r) => pesos(r.ing4)}
          hrefVerMas="/datos/carreras/mejor-pagadas"
        />
        <MiniTablaDestacada
          titulo="Top 10 en Centros de Formación Técnica"
          subtitulo="Ingreso bruto promedio al 4.º año (pesos sep-2025)"
          filas={top10Cft}
          metrica={(r) => pesos(r.ing4)}
          hrefVerMas="/datos/carreras/mejor-pagadas"
        />
        <MiniTablaDestacada
          titulo="Mayor empleabilidad al 1.er año"
          subtitulo="Carreras con al menos 100 titulados en 2024"
          filas={top10Emp}
          metrica={(r) => porcentaje(r.emp1)}
          hrefVerMas="/datos/carreras/mas-empleabilidad"
        />
        <MiniTablaDestacada
          titulo="Las que más crecieron en sueldo real (2020–2024)"
          subtitulo="Variación real al 4.º año con al menos 100 titulados"
          filas={top10Crec}
          metrica={(r) => variacionPorcentual(r.yoy_real_4)}
          hrefVerMas="/datos/carreras/crecieron-en-sueldo-real"
        />
        <MiniTablaDestacada
          titulo="Más cortas con mejor sueldo"
          subtitulo="Duración real promedio ≤ 8 semestres, ordenadas por ingreso 4.º año"
          filas={top10Cortas}
          metrica={(r) => `${pesos(r.ing4)} · ${semestres(r.dur_real)}`}
          hrefVerMas="/datos/carreras?duracion_max=8&orden=ing4"
        />
      </section>

      {/* Descarga CSV + Cómo citar */}
      <section aria-labelledby="datos-abiertos-titulo" className="space-y-4">
        <div className="rounded-xl border border-[#e2e2dc] bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="datos-abiertos-titulo" className="text-lg font-bold text-[#171716]">
                Descarga los datos abiertos (CSV)
              </h2>
              <p className="mt-1 text-xs text-[#5c5c58]">
                Archivos limpios y listos para analizar en Excel, Power BI, SQL o Python.
              </p>
            </div>
            <CsvDownloadButtons />
          </div>
        </div>

        <ComoCitarBox cita={cita} />
      </section>

      {/* Metodología breve */}
      <section
        aria-labelledby="metodologia-breve-titulo"
        className="prose-datos rounded-xl border border-[#e2e2dc] bg-white p-6 text-sm leading-relaxed text-[#3c3c39]"
      >
        <h2 id="metodologia-breve-titulo" className="h2-datos text-[#171716]">
          Nota metodológica
        </h2>
        <p className="mt-3">
          Los ingresos y tasas de empleabilidad provienen de{" "}
          <strong>Estadísticas por Carrera</strong> del Servicio de Información de Educación
          Superior (SIES, www.mifuturo.cl), edición {meta.edicion}, elaborados mediante cruces con
          el Servicio de Impuestos Internos (SII) en pesos constantes de septiembre de 2025.
        </p>
        <p className="mt-2">
          La oferta académica, aranceles 2026, vacantes, acreditación y puntajes PAES promedio de
          matriculados corresponden al <strong>Buscador de Carreras</strong> del SIES. Los datos
          oficiales no desagregan sueldos por región ni por jornada debido al secreto tributario
          del SII.
        </p>
      </section>

      <FaqDatos faqs={faqs} />

      {/* Directorio completo SSR por área (hub-spoke: 0 huérfanas) */}
      <section aria-labelledby="directorio-carreras-titulo" className="rounded-xl border border-[#e2e2dc] bg-white p-6">
        <h2 id="directorio-carreras-titulo" className="h2-datos text-[#171716]">
          Todas las carreras analizadas por área
        </h2>
        <p className="mt-1 text-xs text-[#5c5c58]">
          Acceso directo a las {meta.conteos.genericas_unicas} fichas oficiales de mifuturo.cl ({meta.edicion}).
        </p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((areaNombre) => {
            const listaArea = getCarreras()
              .filter((c) => c.area === areaNombre && esFichaIndexable(c))
              .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
            if (listaArea.length === 0) return null;
            return (
              <div key={areaNombre} className="space-y-2">
                <h3 className="text-sm font-bold text-[#171716] border-b border-[#e2e2dc] pb-1">
                  {areaNombre} ({listaArea.length})
                </h3>
                <ul className="space-y-1 text-xs">
                  {listaArea.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/datos/carreras/${c.slug}`}
                        prefetch={false}
                        className="inline-flex min-h-6 items-center py-0.5 text-[#3c3c39] hover:text-[#1063b8] hover:underline"
                      >
                        {c.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <CtaDatos pagina="/datos/carreras" />

      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
