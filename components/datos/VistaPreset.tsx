import Link from "@/components/datos/EnlaceNavegacionDatos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetaCarreras, TIPO_ETIQUETAS } from "@/lib/datos/carreras";
import { fechaCorta, pesos, porcentaje } from "@/lib/datos/formato";
import {
  filasPreset,
  PRESETS_MAP,
  PRESET_SLUGS,
  resumenPreset,
  type PresetRow,
  type PresetSlug,
} from "@/lib/datos/presets";
import {
  breadcrumbsSchema,
  faqPageSchema,
  itemListSchema,
  MIGAS_BASE,
} from "@/lib/datos/seo-carreras";
import { cn } from "@/lib/utils";
import { CarrerasAltaAfinidad } from "./CarrerasAltaAfinidad";
import { CtaDatos } from "./CtaDatos";
import { EnResumen } from "./EnResumen";
import { FaqDatos } from "./FaqDatos";
import { FuenteLinea } from "./FuenteLinea";
import { DatosViewTracker } from "./HubCarrerasExtras";
import { MigasDatos } from "./MigasDatos";
import { RankingPreset, type FilaRankingPreset, type MetricaPreset } from "./RankingPreset";

/** Cifra que ordena cada ranking: define la barra de cada fila y qué columna no se repite. */
const METRICA: Record<PresetSlug, MetricaPreset> = {
  "mejor-pagadas": "ing4",
  "mas-empleabilidad": "emp1",
  "mejor-sueldo-por-arancel": "ratio",
  "baratas-con-buena-empleabilidad": "arancel",
  "crecieron-en-sueldo-real": "crec",
  "mejor-pagadas-vespertinas": "ing4",
};

function aFilas(filas: PresetRow[]): FilaRankingPreset[] {
  return filas.map((r, idx) => ({
    pos: idx + 1,
    slug: r.slug,
    tipo: r.tipo,
    nombre: r.nombre,
    area: r.area,
    valor: r.valorMetrica,
    texto: r.textoMetrica,
    ing4: r.ing4,
    emp1: r.emp1,
    arancel: r.arancel_med,
    dur: r.dur_real,
  }));
}

function TituloConMarcador({ texto, marcador }: { texto: string; marcador: string }) {
  const i = texto.indexOf(marcador);
  if (i < 0) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <span className="marcador">{marcador}</span>
      {texto.slice(i + marcador.length)}
    </>
  );
}

/** Dato de apoyo bajo la cifra principal: la otra mitad de la decisión (sueldo o empleo). */
function datoApoyo(fila: PresetRow, metrica: MetricaPreset): string {
  if (metrica === "ing4" || metrica === "arancel") {
    return `Empleabilidad 1.er año: ${porcentaje(fila.emp1)}`;
  }
  return `Sueldo al 4.º año: ${pesos(fila.ing4)}`;
}

function Podio({
  filas,
  etiquetas,
  metrica,
  metricaLabel,
}: {
  filas: PresetRow[];
  etiquetas: string[];
  metrica: MetricaPreset;
  metricaLabel: string;
}) {
  if (filas.length === 0) return null;

  return (
    <section aria-labelledby="podio-titulo">
      <h2 id="podio-titulo" className="sr-only">
        Primeros lugares
      </h2>
      <ol className="grid grid-cols-2 gap-3 md:grid-cols-[1.3fr_1fr_1fr]">
        {filas.map((fila, i) => {
          const lider = i === 0;
          return (
            <li
              key={`${fila.slug}-${fila.tipo}`}
              className={cn(
                "group relative flex flex-col rounded-2xl border transition-colors",
                lider
                  ? "col-span-2 border-blue-600 bg-blue-600 p-5 text-white hover:bg-blue-700 sm:p-6 md:col-span-1"
                  : "border-border bg-card p-4 text-foreground hover:border-foreground/30 sm:p-5",
                filas.length === 2 && !lider && "col-span-2 md:col-span-1"
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium",
                  lider ? "text-white/85" : "text-muted-foreground"
                )}
              >
                {etiquetas[i]}
              </p>
              <h3
                className={cn(
                  "mt-2 font-display leading-tight font-bold tracking-tight text-balance",
                  lider ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                )}
              >
                <Link
                  href={`/datos/carreras/${fila.slug}?tipo=${fila.tipo}`}
                  className={cn(
                    "underline-offset-4 after:absolute after:inset-0 after:rounded-2xl group-hover:underline focus-visible:outline-none! focus-visible:after:ring-2 focus-visible:after:ring-offset-2",
                    lider ? "focus-visible:after:ring-blue-600" : "focus-visible:after:ring-ring"
                  )}
                >
                  {fila.nombre}
                </Link>
              </h3>
              <p className={cn("mt-1 text-sm", lider ? "text-white/85" : "text-muted-foreground")}>
                {fila.area}
              </p>

              <div className={cn("mt-auto", lider ? "pt-5" : "pt-4 sm:pt-5")}>
                <p
                  className={cn(
                    "font-display leading-none font-extrabold tracking-tight tabular-nums",
                    lider ? "kpi-hero" : "text-2xl sm:text-3xl"
                  )}
                >
                  {fila.textoMetrica}
                </p>
                <p className={cn("mt-1.5 text-sm", lider ? "text-white/85" : "text-muted-foreground")}>
                  {metricaLabel}
                </p>
                <p
                  className={cn(
                    "mt-3 border-t pt-3 tabular-nums",
                    lider
                      ? "border-white/25 text-sm text-white"
                      : "border-border text-xs text-foreground sm:text-sm"
                  )}
                >
                  {datoApoyo(fila, metrica)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function VistaPreset({ slug }: { slug: PresetSlug }) {
  const def = PRESETS_MAP[slug];
  const meta = getMetaCarreras();
  const metrica = METRICA[slug];
  const esMejorPagadas = slug === "mejor-pagadas";

  const filasU = esMejorPagadas ? filasPreset(slug, "u") : [];
  const filasIp = esMejorPagadas ? filasPreset(slug, "ip") : [];
  const filasCft = esMejorPagadas ? filasPreset(slug, "cft") : [];
  const filasUnicas = esMejorPagadas ? filasU : filasPreset(slug);

  const resumen = resumenPreset(slug, filasUnicas);

  const migas = [
    ...MIGAS_BASE,
    { label: def.tituloCorto, path: `/datos/carreras/${slug}` },
  ];

  const itemsSchema = esMejorPagadas ? [...filasU, ...filasIp, ...filasCft] : filasUnicas;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      itemListSchema(
        def.h1,
        itemsSchema.map((r) => ({ nombre: r.nombre, slug: r.slug, tipo: r.tipo }))
      ),
      faqPageSchema(def.faqs),
      breadcrumbsSchema(migas),
    ],
  };

  // Mejor pagadas: cada tipo es su propio ranking, así que el podio muestra al primero de cada uno.
  const podio = esMejorPagadas
    ? [filasU[0], filasIp[0], filasCft[0]].filter((f): f is PresetRow => Boolean(f))
    : filasUnicas.slice(0, 3);
  const etiquetasPodio = esMejorPagadas
    ? podio.map((f) => `N.º 1 en ${TIPO_ETIQUETAS[f.tipo].plural}`)
    : podio.map((f, i) => `${i + 1}.º lugar · ${TIPO_ETIQUETAS[f.tipo].singular}`);

  const filasCliente = esMejorPagadas
    ? [...aFilas(filasU), ...aFilas(filasIp), ...aFilas(filasCft)]
    : aFilas(filasUnicas);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:space-y-10 lg:py-10">
      <DatosViewTracker evento="datos_preset_view" params={{ preset: slug }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="space-y-6">
        <MigasDatos migas={migas} />

        <header className="max-w-3xl space-y-4">
          <h1 className="h1-datos text-foreground">
            <TituloConMarcador texto={def.h1} marcador={def.h1Marcador} />
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {def.descriptionSeo}
          </p>
          <p className="text-sm text-muted-foreground">
            Edición {meta.edicion} · actualizado el {fechaCorta(meta.fetched_at)} · fuente
            mifuturo.cl (SIES, Mineduc)
          </p>
        </header>

        <nav aria-label="Rankings de carreras">
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            {PRESET_SLUGS.map((s) => {
              const actual = s === slug;
              return (
                <li key={s} className="shrink-0">
                  <Link
                    href={`/datos/carreras/${s}`}
                    aria-current={actual ? "page" : undefined}
                    className={cn(
                      "inline-flex h-11 items-center rounded-xl border px-3.5 text-sm font-medium whitespace-nowrap transition-colors sm:h-9",
                      actual
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-foreground hover:border-foreground/40 active:bg-muted"
                    )}
                  >
                    {PRESETS_MAP[s].tituloCorto}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <Podio
        filas={podio}
        etiquetas={etiquetasPodio}
        metrica={metrica}
        metricaLabel={def.columnaExtraLabel}
      />

      <section aria-labelledby="ranking-titulo" className="space-y-4">
        <div className="space-y-1">
          <h2 id="ranking-titulo" className="h2-datos text-foreground">
            Ranking completo
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Abre cualquier carrera para ver su sueldo año a año, las instituciones que la dictan y
            sus aranceles.
          </p>
        </div>
        <RankingPreset
          filas={filasCliente}
          metrica={metrica}
          metricaLabel={def.columnaExtraLabel}
          separadoPorTipo={esMejorPagadas}
          hrefExplorador={`/datos/carreras${def.queryFiltros}`}
        />
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <EnResumen
          frases={resumen}
          fuente={`Fuente: www.mifuturo.cl (SIES, Mineduc), edición ${meta.edicion}.`}
        />

        <Card
          aria-labelledby="metodologia-preset-titulo"
          className="prose-datos gap-3 rounded-xl border border-border bg-card py-5 shadow-xs ring-0"
        >
          <CardHeader className="px-6 pb-0">
            <CardTitle
              id="metodologia-preset-titulo"
              className="text-base font-semibold tracking-tight text-foreground"
            >
              Cómo se construye este ranking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 px-6 text-sm leading-relaxed text-foreground/85">
            {def.metodologia.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
          </CardContent>
        </Card>
      </div>

      <CarrerasAltaAfinidad />

      <FaqDatos faqs={def.faqs} />

      <CtaDatos pagina={`/datos/carreras/${slug}`} />

      <FuenteLinea edicion={meta.edicion} conAviso />
    </div>
  );
}
